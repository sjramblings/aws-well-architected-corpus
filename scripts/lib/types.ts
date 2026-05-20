export type Pillar = {
  slug: string;
  prefix: string;
  lensPillarId: string;
  name: string;
};

export type RiskLevel = "HIGH" | "MEDIUM" | "LOW" | "UNKNOWN";

export const PILLARS = [
  {
    slug: "operational-excellence",
    prefix: "OPS",
    lensPillarId: "operationalExcellence",
    name: "Operational Excellence",
  },
  {
    slug: "security",
    prefix: "SEC",
    lensPillarId: "security",
    name: "Security",
  },
  {
    slug: "reliability",
    prefix: "REL",
    lensPillarId: "reliability",
    name: "Reliability",
  },
  {
    slug: "performance-efficiency",
    prefix: "PERF",
    lensPillarId: "performance",
    name: "Performance Efficiency",
  },
  {
    slug: "cost-optimization",
    prefix: "COST",
    lensPillarId: "costOptimization",
    name: "Cost Optimization",
  },
  {
    slug: "sustainability",
    prefix: "SUS",
    lensPillarId: "sustainability",
    name: "Sustainability",
  },
] as const satisfies readonly Pillar[];

export type TocBpNode = {
  id: string;
  title: string;
  href: string;
  question: string;
  pillarSlug: string;
  prefix: string;
  questionId: string;
};

export type BestPractice = {
  id: string;
  pillarSlug: string;
  prefix: string;
  questionId: string;
  question: string;
  title: string;
  riskLevel: RiskLevel;
  sourceUrl: string;
  statement: string;
  desiredOutcome: string;
  commonAntiPatterns: string;
  benefits: string;
  implementationGuidance: string;
  resources: string;
  warnings: string[];
};

export type Meta = {
  generated_at: string;
  framework_source: string;
  bp_count: number;
  pillar_count: number;
  content_hash: string;
  best_practices: Record<string, string>;
};

export function pillarForPrefix(prefix: string): Pillar {
  const pillar = PILLARS.find((candidate) => candidate.prefix === prefix);
  if (pillar === undefined) {
    throw new Error(`Unknown Well-Architected pillar prefix: ${prefix}`);
  }
  return pillar;
}

export function pillarForSlug(slug: string): Pillar {
  const pillar = PILLARS.find((candidate) => candidate.slug === slug);
  if (pillar === undefined) {
    throw new Error(`Unknown Well-Architected pillar slug: ${slug}`);
  }
  return pillar;
}

// Shared best-practice-count expectations, consumed by structure-drift guards.
export const EXPECTED_BP_COUNT = 306;

export const EXPECTED_BP_COUNT_BY_PREFIX: Readonly<Record<string, number>> = {
  OPS: 67,
  SEC: 63,
  REL: 65,
  PERF: 32,
  COST: 50,
  SUS: 29,
};

export const BP_COUNT_LOWER_GUARD = 280;
