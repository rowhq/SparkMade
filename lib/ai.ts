import Anthropic from '@anthropic-ai/sdk';
import { readFileSync } from 'fs';
import { join } from 'path';
import type {
  ProductBrief,
  SpecPack,
  ManufacturabilityScore,
  ListingCopy,
  FundingSuggestion,
} from '@/contracts';
import { prisma } from './prisma';

let anthropic: Anthropic | null = null;

function getAnthropic(): Anthropic {
  if (!anthropic) {
    anthropic = new Anthropic({
      apiKey: process.env.ANTHROPIC_API_KEY || 'dummy-key-for-build',
    });
  }
  return anthropic;
}

const MODEL = 'claude-3-5-sonnet-20241022';

// Load prompts from filesystem
function loadPrompt(name: string): string {
  const promptPath = join(process.cwd(), 'prompts', `${name}.system.txt`);
  try {
    return readFileSync(promptPath, 'utf-8');
  } catch (error) {
    console.warn(`Could not load prompt ${name}, using fallback`);
    return getFallbackPrompt(name);
  }
}

function getFallbackPrompt(name: string): string {
  const prompts: Record<string, string> = {
    idea_to_brief: 'You are an expert industrial designer. Convert the user\'s idea into a ProductBrief JSON with these fields: name, tagline, problem, audience, features (array), materials (array), dimensions, estimated_cost (number), manufacturing_risk (low|medium|high), category, design_style. Respond with only JSON.',
    brief_to_render: 'Create a detailed image prompt for a photorealistic product render on a clean studio background with neutral lighting.',
    brief_to_spec: 'Convert the ProductBrief into a SpecPack JSON with: overview, materials (array), dimensions, assembly_steps (array), bom (array of {component, material, est_cost}), safety_flags (array), production_notes. Respond with only JSON.',
    manufacturability: 'Analyze the SpecPack and output JSON: {score (1-10), issues (array), simplifications (array), cost_notes}. Respond with only JSON.',
    copy_writer: 'Write product listing copy. Output JSON: {short_title, one_liner, bullet_features (array), human_story, refund_policy_text, call_to_action_text}. Respond with only JSON.',
    funding_suggest: 'Suggest deposit and funding threshold. Output JSON: {deposit_cents (number), threshold_type ("UNITS" or "DOLLARS"), threshold_value (number), rationale}. Respond with only JSON.',
    canvas_runtime: 'You are an AI design assistant. Help users turn ideas into manufacturable products. Be clear and encouraging.',
  };
  return prompts[name] || 'You are a helpful assistant.';
}

async function callClaude(systemPrompt: string, userMessage: string): Promise<string> {
  const response = await getAnthropic().messages.create({
    model: MODEL,
    max_tokens: 2048,
    system: systemPrompt,
    messages: [
      {
        role: 'user',
        content: userMessage,
      },
    ],
  });

  const content = response.content[0];
  if (content.type === 'text') {
    return content.text;
  }
  throw new Error('Unexpected response type from Claude');
}

async function callClaudeJSON<T>(systemPrompt: string, userMessage: string): Promise<T> {
  const text = await callClaude(systemPrompt, userMessage);
  // Try to extract JSON from response
  const jsonMatch = text.match(/\{[\s\S]*\}/);
  if (!jsonMatch) {
    throw new Error('No JSON found in response: ' + text);
  }
  return JSON.parse(jsonMatch[0]);
}

/**
 * Generate draft data from user text (without saving to database)
 */
export async function generateDraftData(ideaText: string) {
  // 1. Call idea_to_brief
  const ideaPrompt = loadPrompt('idea_to_brief');
  const brief: ProductBrief = await callClaudeJSON<ProductBrief>(ideaPrompt, ideaText);

  // 2. Call brief_to_render
  const renderPrompt = loadPrompt('brief_to_render');
  const imagePrompt = await callClaude(renderPrompt, JSON.stringify(brief));

  // 3. Call copy_writer
  const copyPrompt = loadPrompt('copy_writer');
  const copy: ListingCopy = await callClaudeJSON<ListingCopy>(copyPrompt, JSON.stringify(brief));

  // 4. Call funding_suggest
  const fundingPrompt = loadPrompt('funding_suggest');
  const funding: FundingSuggestion = await callClaudeJSON<FundingSuggestion>(
    fundingPrompt,
    JSON.stringify(brief)
  );

  return {
    brief,
    imagePrompt,
    copy,
    funding,
  };
}

/**
 * Start a new draft from user text
 */
export async function startDraft(userId: string, ideaText: string): Promise<string> {
  const { brief, imagePrompt, copy, funding } = await generateDraftData(ideaText);

  // 5. Create project draft
  const deadline = new Date();
  deadline.setDate(deadline.getDate() + 30); // Default 30 days

  const project = await prisma.project.create({
    data: {
      title: copy.short_title || brief.name,
      tagline: copy.one_liner || brief.tagline,
      description: copy.human_story || brief.problem,
      category: brief.category,
      tags: brief.features.slice(0, 5),
      heroImages: [], // Will be populated with actual image generation
      specImages: [],
      aiBriefJson: brief as any,
      priceTarget: Math.round(brief.estimated_cost * 100), // Convert to cents
      depositAmount: funding.deposit_cents,
      thresholdType: funding.threshold_type,
      thresholdValue: funding.threshold_value,
      deadlineAt: deadline,
      riskFlags: [],
      complianceStatus: 'PASS',
      status: 'LIVE', // Changed from DRAFT to LIVE so it's immediately shareable
      creatorId: userId,
    },
  });

  return project.id;
}

/**
 * Iterate on existing project with delta changes
 */
export async function iterateProject(
  projectId: string,
  delta: string | Partial<ProductBrief>
): Promise<ProductBrief> {
  const project = await prisma.project.findUnique({
    where: { id: projectId },
  });

  if (!project) {
    throw new Error('Project not found');
  }

  const currentBrief = project.aiBriefJson as unknown as ProductBrief;

  let updatedBrief: ProductBrief;

  if (typeof delta === 'string') {
    // Natural language edit
    const prompt = `Here is the current ProductBrief:\n${JSON.stringify(currentBrief, null, 2)}\n\nThe user wants to change: ${delta}\n\nProvide the updated ProductBrief JSON with the requested changes.`;
    updatedBrief = await callClaudeJSON<ProductBrief>(loadPrompt('idea_to_brief'), prompt);
  } else {
    // Direct merge
    updatedBrief = { ...currentBrief, ...delta };
  }

  // Update project
  await prisma.project.update({
    where: { id: projectId },
    data: {
      aiBriefJson: updatedBrief as any,
      title: updatedBrief.name,
      tagline: updatedBrief.tagline,
    },
  });

  return updatedBrief;
}

/**
 * Generate spec pack from product brief
 */
export async function generateSpec(projectId: string): Promise<SpecPack> {
  const project = await prisma.project.findUnique({
    where: { id: projectId },
  });

  if (!project) {
    throw new Error('Project not found');
  }

  const brief = project.aiBriefJson as unknown as ProductBrief;
  const specPrompt = loadPrompt('brief_to_spec');
  const specPack: SpecPack = await callClaudeJSON<SpecPack>(
    specPrompt,
    JSON.stringify(brief)
  );

  // Save spec pack
  await prisma.project.update({
    where: { id: projectId },
    data: {
      specPackJson: specPack as any,
    },
  });

  return specPack;
}

/**
 * Analyze manufacturability
 */
export async function manufacturability(projectId: string): Promise<ManufacturabilityScore> {
  const project = await prisma.project.findUnique({
    where: { id: projectId },
  });

  if (!project) {
    throw new Error('Project not found');
  }

  // Generate spec if not exists
  let specPack = project.specPackJson as SpecPack | null;
  if (!specPack) {
    specPack = await generateSpec(projectId);
  }

  const mfgPrompt = loadPrompt('manufacturability');
  const score: ManufacturabilityScore = await callClaudeJSON<ManufacturabilityScore>(
    mfgPrompt,
    JSON.stringify(specPack)
  );

  return score;
}

/**
 * Generate render prompt for image generation
 */
export async function generateRenderPrompt(brief: ProductBrief): Promise<string> {
  const renderPrompt = loadPrompt('brief_to_render');
  return await callClaude(renderPrompt, JSON.stringify(brief));
}

/**
 * Finalize project for review
 */
export async function finalizeForReview(projectId: string): Promise<void> {
  const project = await prisma.project.findUnique({
    where: { id: projectId },
  });

  if (!project) {
    throw new Error('Project not found');
  }

  const brief = project.aiBriefJson as unknown as ProductBrief;

  // Run compliance check
  const isBanned = await checkBannedCategory(brief.category);

  await prisma.project.update({
    where: { id: projectId },
    data: {
      status: 'REVIEW',
      complianceStatus: isBanned ? 'FAIL' : 'PASS',
      riskFlags: isBanned ? ['Banned category'] : [],
    },
  });

  // Create compliance check record
  await prisma.complianceCheck.create({
    data: {
      projectId,
      result: isBanned ? 'FAIL' : 'PASS',
      notes: isBanned ? 'Project in banned category' : 'Passed initial screening',
      checklist: {
        bannedCategory: !isBanned,
        hasDescription: !!project.description,
        hasTitle: !!project.title,
      },
    },
  });
}

/**
 * Check if category is banned
 */
async function checkBannedCategory(category: string): Promise<boolean> {
  try {
    const bannedPath = join(
      process.cwd(),
      'rules/banned_categories.json'
    );
    const bannedData = JSON.parse(readFileSync(bannedPath, 'utf-8'));
    const banned: string[] = bannedData.banned || [];

    return banned.some((b) => category.toLowerCase().includes(b.toLowerCase()));
  } catch (error) {
    console.error('Error checking banned categories:', error);
    return false;
  }
}

/**
 * Chat with canvas AI assistant
 */
export async function canvasChat(
  projectId: string,
  userMessage: string,
  history: Array<{ role: 'user' | 'assistant'; content: string }>
): Promise<string> {
  const project = await prisma.project.findUnique({
    where: { id: projectId },
  });

  if (!project) {
    throw new Error('Project not found');
  }

  const brief = project.aiBriefJson as unknown as ProductBrief;
  const systemPrompt = loadPrompt('canvas_runtime');

  const context = `Current ProductBrief:\n${JSON.stringify(brief, null, 2)}\n\n`;

  const messages = [
    ...history.map((h) => ({ role: h.role, content: h.content })),
    { role: 'user' as const, content: userMessage },
  ];

  const response = await getAnthropic().messages.create({
    model: MODEL,
    max_tokens: 2048,
    system: systemPrompt + '\n\n' + context,
    messages: messages as any,
  });

  const content = response.content[0];
  if (content.type === 'text') {
    return content.text;
  }

  throw new Error('Unexpected response type');
}
