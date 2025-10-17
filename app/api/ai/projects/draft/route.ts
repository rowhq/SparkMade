import { NextRequest, NextResponse } from 'next/server';
import { startDraft, generateDraftData } from '@/lib/ai';
import { prisma } from '@/lib/prisma';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    // Demo mode: use a test user ID
    const userId = 'demo-user';

    const body = await req.json();
    const { text } = body;

    if (!text || typeof text !== 'string') {
      return NextResponse.json({ error: 'Text is required' }, { status: 400 });
    }

    // Check if Anthropic API key is configured
    if (!process.env.ANTHROPIC_API_KEY || process.env.ANTHROPIC_API_KEY === 'dummy-key-for-build') {
      return NextResponse.json(
        {
          error: 'AI not configured',
          details: 'Please configure ANTHROPIC_API_KEY in your environment variables to use AI generation.'
        },
        { status: 503 }
      );
    }

    // Check if database is configured (either DATABASE_URL or POSTGRES_PRISMA_URL from Vercel)
    const hasDatabase = (process.env.DATABASE_URL && !process.env.DATABASE_URL.includes('dummy')) ||
                        process.env.POSTGRES_PRISMA_URL;

    if (hasDatabase) {
      // Ensure demo user exists
      await prisma.user.upsert({
        where: { id: userId },
        update: {},
        create: {
          id: userId,
          email: 'demo@sparkmade.com',
          name: 'Demo User',
          role: 'CREATOR',
        },
      });

      // Full flow: generate and save to database
      const projectId = await startDraft(userId, text);
      return NextResponse.json({ projectId }, { status: 201 });
    } else {
      // Demo mode: generate but don't save
      const draftData = await generateDraftData(text);
      return NextResponse.json(
        {
          demo: true,
          message: 'AI generation successful! (Demo mode - not saved to database)',
          data: {
            title: draftData.copy.short_title || draftData.brief.name,
            tagline: draftData.copy.one_liner || draftData.brief.tagline,
            description: draftData.copy.human_story || draftData.brief.problem,
            category: draftData.brief.category,
            features: draftData.brief.features,
            materials: draftData.brief.materials,
            estimatedCost: draftData.brief.estimated_cost,
            depositCents: draftData.funding.deposit_cents,
            thresholdValue: draftData.funding.threshold_value,
          }
        },
        { status: 200 }
      );
    }
  } catch (error) {
    console.error('Error creating draft:', error);

    // Check for database-specific errors
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    if (errorMessage.includes('does not exist') || errorMessage.includes('database')) {
      return NextResponse.json(
        {
          error: 'Database not configured',
          details: 'The AI Studio requires a database connection. Please configure your database to use this feature.'
        },
        { status: 503 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to create draft', details: errorMessage },
      { status: 500 }
    );
  }
}
