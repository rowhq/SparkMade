// Shared TypeScript types and interfaces

export interface ProductBrief {
  name: string;
  tagline: string;
  problem: string;
  audience: string;
  features: string[];
  materials: string[];
  dimensions: string;
  estimated_cost: number;
  manufacturing_risk: 'low' | 'medium' | 'high';
  category: string;
  design_style: string;
}

export interface SpecPack {
  overview: string;
  materials: string[];
  dimensions: string;
  assembly_steps: string[];
  bom: BOMItem[];
  safety_flags: string[];
  production_notes: string;
}

export interface BOMItem {
  component: string;
  material: string;
  est_cost: number;
}

export interface ManufacturabilityScore {
  score: number; // 1-10
  issues: string[];
  simplifications: string[];
  cost_notes: string;
}

export interface ListingCopy {
  short_title: string;
  one_liner: string;
  bullet_features: string[];
  human_story: string;
  refund_policy_text: string;
  call_to_action_text: string;
}

export interface FundingSuggestion {
  deposit_cents: number;
  threshold_type: 'UNITS' | 'DOLLARS';
  threshold_value: number;
  rationale: string;
}

export interface RenderPrompt {
  prompt: string;
}

// Copy constants
export const COPY = {
  depositExplainer: "Your deposit is a reservation. If this project does not reach its goal by the deadline, you are automatically refunded. Before production starts, you can cancel anytime for a full refund.",
  productionLockExplainer: "When the goal is reached and the design is locked, we send the specs to a manufacturer. Refunds after lock follow our policy and may be partial.",
  complianceExplainer: "We screen for risky or restricted products. Some ideas cannot be listed. This is not legal advice.",
  positioningMessage: "Crowdfunding used to be about invention — not advertising. We rebuilt it around ideas, not marketing budgets. Here, the product is the strategy.",
};
