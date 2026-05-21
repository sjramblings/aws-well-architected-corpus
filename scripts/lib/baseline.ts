import {
  SECTION_KEYS,
  type BaselineEntry,
  type BestPractice,
  type Deviation,
  type SectionKey,
  type StructureBaseline,
} from "./types.ts";

const KIND_ORDER: Record<Deviation["kind"], number> = {
  REGRESSION: 0,
  ENRICHMENT: 1,
  NEW_BP: 2,
  REMOVED_BP: 3,
};

function orderedSections(sections: Record<SectionKey, boolean>): Record<SectionKey, boolean> {
  const ordered = {} as Record<SectionKey, boolean>;
  for (const section of SECTION_KEYS) {
    ordered[section] = sections[section];
  }
  return ordered;
}

function riskKnown(bp: BestPractice): boolean {
  return bp.riskLevel !== "UNKNOWN";
}

function sectionOrder(section: Deviation["section"]): number {
  if (section === undefined) {
    return SECTION_KEYS.length + 1;
  }
  if (section === "risk") {
    return SECTION_KEYS.length;
  }
  return SECTION_KEYS.indexOf(section);
}

function compareDeviations(left: Deviation, right: Deviation): number {
  const bpOrder = left.bpId.localeCompare(right.bpId);
  if (bpOrder !== 0) {
    return bpOrder;
  }

  const kindOrder = KIND_ORDER[left.kind] - KIND_ORDER[right.kind];
  if (kindOrder !== 0) {
    return kindOrder;
  }

  return sectionOrder(left.section) - sectionOrder(right.section);
}

export async function loadBaseline(baselinePath: string): Promise<StructureBaseline | undefined> {
  const file = Bun.file(baselinePath);
  if (!(await file.exists())) {
    return undefined;
  }

  const text = await file.text();
  try {
    return JSON.parse(text) as StructureBaseline;
  } catch {
    return undefined;
  }
}

export function serializeBaseline(bps: BestPractice[]): string {
  const bestPractices: Record<string, BaselineEntry> = {};
  for (const bp of [...bps].sort((left, right) => left.id.localeCompare(right.id))) {
    bestPractices[bp.id] = {
      sections: orderedSections(bp.sectionPresence),
      riskKnown: riskKnown(bp),
    };
  }

  const baseline: StructureBaseline = {
    schema: 1,
    blessed_at: new Date().toISOString().slice(0, 10),
    bp_count: bps.length,
    best_practices: bestPractices,
  };

  return `${JSON.stringify(baseline, null, 2)}\n`;
}

export function classifyDeviations(extracted: BestPractice[], baseline: StructureBaseline): Deviation[] {
  const deviations: Deviation[] = [];
  const extractedById = new Map<string, BestPractice>(extracted.map((bp) => [bp.id, bp]));
  const ids = [...new Set([...Object.keys(baseline.best_practices), ...extractedById.keys()])].sort();

  for (const bpId of ids) {
    const baselineEntry = baseline.best_practices[bpId];
    const bp = extractedById.get(bpId);

    if (baselineEntry === undefined && bp !== undefined) {
      deviations.push({ bpId, kind: "NEW_BP" });
      continue;
    }
    if (baselineEntry !== undefined && bp === undefined) {
      deviations.push({ bpId, kind: "REMOVED_BP" });
      continue;
    }
    if (baselineEntry === undefined || bp === undefined) {
      throw new Error(`Incomplete structure baseline comparison for ${bpId}`);
    }

    for (const section of SECTION_KEYS) {
      const expected = baselineEntry.sections[section];
      const actual = bp.sectionPresence[section];
      if (expected === actual) {
        // Match and expected absence are both silent by design.
        continue;
      }
      if (expected && !actual) {
        deviations.push({ bpId, kind: "REGRESSION", section });
      } else if (!expected && actual) {
        deviations.push({ bpId, kind: "ENRICHMENT", section });
      } else {
        throw new Error(`Unhandled section drift state for ${bpId} ${section}`);
      }
    }

    const expectedRiskKnown = baselineEntry.riskKnown;
    const actualRiskKnown = riskKnown(bp);
    if (expectedRiskKnown && !actualRiskKnown) {
      deviations.push({ bpId, kind: "REGRESSION", section: "risk" });
    } else {
      // Stable risk state and newly-known risk are both silent by design.
    }
  }

  return deviations.sort(compareDeviations);
}
