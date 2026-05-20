import TurndownService from "turndown";
import { HTMLElement, NodeType, parse, type Node } from "node-html-parser";

import type { BestPractice, RiskLevel } from "./types.ts";

const CONTENT_SELECTORS = ["#main-col-body", "#main-content", "main"] as const;

type MarkerDefinition = {
  label: string;
  matches: (text: string) => boolean;
};

const MARKERS = {
  desiredOutcome: {
    label: "Desired outcome",
    matches: (text: string) => /^desired outcomes?\b/.test(text),
  },
  commonAntiPatterns: {
    label: "Common anti-patterns",
    matches: (text: string) => /^common anti-patterns?\b/.test(text),
  },
  benefits: {
    label: "Benefits",
    matches: (text: string) => text.startsWith("benefits of") && text.includes("practice"),
  },
  risk: {
    label: "Level of risk",
    // The stable keyword across every observed variant is "level of risk".
    // Variants seen in the cached HTML:
    //   "Level of risk exposed if this best practice is not established"
    //   "Level of risk if this best practice isn't established"
    // The colon and the High/Medium/Low value can sit inside or outside the
    // closing </b> tag (see parseRiskLevel).
    matches: (text: string) => text.startsWith("level of risk"),
  },
} as const;

const turndown = new TurndownService({
  headingStyle: "atx",
  codeBlockStyle: "fenced",
  bulletListMarker: "-",
});

type ExtractContext = {
  id: string;
  title: string;
  pillarSlug: string;
  question: string;
  sourceUrl: string;
};

type MarkerLocation = {
  marker: MarkerDefinition;
  element: HTMLElement;
  directChildIndex: number;
};

type ImplementationGuidanceResult = {
  guidance: string;
  foundOrphanBody: boolean;
};

function normalizeText(value: string): string {
  return value.replace(/\s+/g, " ").trim();
}

function normalizeForMatch(value: string): string {
  return normalizeText(value).toLowerCase();
}

function normalizeMarkerText(value: string): string {
  return normalizeForMatch(value).replace(/:$/, "").trim();
}

function markdownFromHtml(html: string): string {
  if (html.trim() === "") {
    return "";
  }
  return turndown
    .turndown(html)
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

function findContentContainer(root: HTMLElement): HTMLElement | null {
  for (const selector of CONTENT_SELECTORS) {
    const candidate = root.querySelector(selector);
    if (candidate !== null) {
      return candidate;
    }
  }
  return null;
}

function removeChrome(content: HTMLElement): void {
  const selectors = [
    "script",
    "style",
    "noscript",
    "nav",
    ".breadcrumbs",
    ".breadcrumb",
    "#breadcrumbs",
    ".awsdocs-breadcrumbs",
    ".awsdocs-page-header",
    ".awsdocs-feedback",
    ".feedback",
    "#feedback",
    "awsdocs-feedback-container",
  ];

  for (const selector of selectors) {
    for (const node of content.querySelectorAll(selector)) {
      node.remove();
    }
  }

  for (const selector of ["div", "p"]) {
    for (const node of content.querySelectorAll(selector)) {
      const text = normalizeForMatch(node.textContent);
      if (text.startsWith("javascript is disabled") || text.startsWith("did this page help you")) {
        node.remove();
      }
    }
  }

  for (const h1 of content.querySelectorAll("h1")) {
    h1.remove();
  }
}

function directChildIndex(container: HTMLElement, node: Node): number {
  let current: Node = node;
  while (true) {
    const parent = current.parentNode as HTMLElement | undefined;
    if (parent === undefined) {
      return -1;
    }
    if (parent === container) {
      return container.childNodes.indexOf(current);
    }
    current = parent;
  }
}

function findMarker(content: HTMLElement, marker: MarkerDefinition): MarkerLocation | undefined {
  const candidates = [...content.querySelectorAll("b"), ...content.querySelectorAll("strong")];

  for (const element of candidates) {
    if (marker.matches(normalizeMarkerText(element.textContent))) {
      const index = directChildIndex(content, element);
      if (index >= 0) {
        return { marker, element, directChildIndex: index };
      }
    }
  }

  return undefined;
}

function findHeadingIndex(content: HTMLElement, headingText: string): number | undefined {
  const normalizedHeading = normalizeForMatch(headingText);
  for (const heading of content.querySelectorAll("h2")) {
    if (normalizeForMatch(heading.textContent).startsWith(normalizedHeading)) {
      const index = directChildIndex(content, heading);
      if (index >= 0) {
        return index;
      }
    }
  }
  return undefined;
}

function stripLeadingMarkerPunctuation(parent: HTMLElement, startIndex: number): void {
  const nextNode = parent.childNodes[startIndex];
  if (nextNode?.nodeType !== NodeType.TEXT_NODE) {
    return;
  }

  nextNode.textContent = nextNode.textContent.replace(/^\s*:\s*/, "").replace(/^\s+/, "");
}

function removeMarkerFromBlock(blockHtml: string, markerDefinition: MarkerDefinition): string {
  const root = parse(blockHtml);
  const marker = findMarker(root, markerDefinition);
  if (marker !== undefined) {
    const parent = marker.element.parentNode;
    const markerIndex = parent.childNodes.indexOf(marker.element);
    marker.element.remove();
    if (markerIndex >= 0) {
      stripLeadingMarkerPunctuation(parent, markerIndex);
    }
  }
  return root.innerHTML;
}

function htmlBetween(
  content: HTMLElement,
  startInclusive: number,
  endExclusive: number,
  markerToRemove?: MarkerDefinition,
): string {
  if (startInclusive < 0 || endExclusive <= startInclusive) {
    return "";
  }

  const blocks: string[] = [];
  for (let index = startInclusive; index < endExclusive; index += 1) {
    const node = content.childNodes[index];
    if (node === undefined) {
      continue;
    }
    const html = node.toString();
    if (index === startInclusive && markerToRemove !== undefined) {
      blocks.push(removeMarkerFromBlock(html, markerToRemove));
    } else {
      blocks.push(html);
    }
  }
  return blocks.join("\n");
}

function firstDefinedIndex(...values: Array<number | undefined>): number | undefined {
  for (const value of values) {
    if (value !== undefined) {
      return value;
    }
  }
  return undefined;
}

function stripRiskMarkerPrefix(value: string): string {
  // Strips every observed risk-label variant so only the trailing
  // High/Medium/Low value remains:
  //   "Level of risk exposed if this best practice is not established:"
  //   "Level of risk if this best practice isn't established:"
  return normalizeText(value)
    .replace(
      /^level of risk(?:\s+exposed)?(?:\s+if this best practice (?:is not|isn't) established)?\s*:?\s*/i,
      "",
    )
    .replace(/^\s*:\s*/, "");
}

function inlineTextAfterMarkerElement(marker: MarkerLocation): string {
  const parent = marker.element.parentNode;
  const markerIndex = parent.childNodes.indexOf(marker.element);
  if (markerIndex < 0) {
    return "";
  }

  return normalizeText(
    parent.childNodes
      .slice(markerIndex + 1)
      .map((node) => node.textContent)
      .join(" "),
  ).replace(/^\s*:\s*/, "");
}

function riskLevelFromText(text: string): RiskLevel | undefined {
  const match = /\b(high|medium|low)\b/i.exec(text);
  if (match === null) {
    return undefined;
  }

  const value = match[1]?.toLowerCase();
  if (value === "high") {
    return "HIGH";
  }
  if (value === "medium") {
    return "MEDIUM";
  }
  if (value === "low") {
    return "LOW";
  }
  return undefined;
}

function parseRiskLevel(content: HTMLElement, riskMarker: MarkerLocation | undefined): RiskLevel {
  if (riskMarker === undefined) {
    return "UNKNOWN";
  }

  const candidateTexts: string[] = [];
  const inlineText = inlineTextAfterMarkerElement(riskMarker);
  if (inlineText !== "") {
    candidateTexts.push(inlineText);
  }

  const markerBlock = content.childNodes[riskMarker.directChildIndex];
  if (markerBlock !== undefined) {
    candidateTexts.push(stripRiskMarkerPrefix(markerBlock.textContent));
  }

  for (let offset = 1; offset <= 2; offset += 1) {
    const sibling = content.childNodes[riskMarker.directChildIndex + offset];
    if (sibling !== undefined) {
      candidateTexts.push(normalizeText(sibling.textContent));
    }
  }

  const text = candidateTexts.join(" ");
  return riskLevelFromText(text) ?? "UNKNOWN";
}

function sectionFromMarker(
  content: HTMLElement,
  marker: MarkerLocation | undefined,
  endIndex: number | undefined,
  sectionName: string,
  warnings: string[],
): string {
  if (marker === undefined) {
    warnings.push(`Missing inline marker: ${sectionName}`);
    return "";
  }
  const actualEnd = endIndex ?? content.childNodes.length;
  return markdownFromHtml(htmlBetween(content, marker.directChildIndex, actualEnd, marker.marker));
}

function resolveImplementationGuidance(
  content: HTMLElement,
  implementationIndex: number | undefined,
  stepsHeadingIndex: number | undefined,
  resourcesIndex: number | undefined,
  desiredMarker: MarkerLocation | undefined,
  commonMarker: MarkerLocation | undefined,
  benefitsMarker: MarkerLocation | undefined,
  riskMarker: MarkerLocation | undefined,
): ImplementationGuidanceResult {
  const resourcesEnd = resourcesIndex ?? content.childNodes.length;

  if (implementationIndex !== undefined) {
    return {
      guidance: markdownFromHtml(htmlBetween(content, implementationIndex + 1, resourcesEnd)),
      foundOrphanBody: false,
    };
  }

  if (stepsHeadingIndex !== undefined) {
    const precedingSectionIndex = firstDefinedIndex(
      riskMarker?.directChildIndex,
      benefitsMarker?.directChildIndex,
      commonMarker?.directChildIndex,
      desiredMarker?.directChildIndex,
    );
    const leadingHtml =
      precedingSectionIndex === undefined ? "" : htmlBetween(content, precedingSectionIndex + 1, stepsHeadingIndex);
    const stepsHtml = htmlBetween(content, stepsHeadingIndex + 1, resourcesEnd);
    const guidanceHtml = [leadingHtml, stepsHtml].filter((html) => html.trim() !== "").join("\n");

    return {
      guidance: markdownFromHtml(guidanceHtml),
      foundOrphanBody: false,
    };
  }

  const precedingSectionIndex = firstDefinedIndex(
    riskMarker?.directChildIndex,
    benefitsMarker?.directChildIndex,
    commonMarker?.directChildIndex,
    desiredMarker?.directChildIndex,
    0,
  );
  const orphanBody =
    precedingSectionIndex === undefined ? "" : markdownFromHtml(htmlBetween(content, precedingSectionIndex + 1, resourcesEnd));

  return {
    guidance: orphanBody,
    foundOrphanBody: orphanBody !== "",
  };
}

export function extractBestPractice(html: string, ctx: ExtractContext): BestPractice {
  const root = parse(html);
  const h1 = root.querySelector("h1");
  if (h1 === null) {
    throw new Error(`Layout break for ${ctx.id}: missing <h1> in ${ctx.sourceUrl}`);
  }

  const h1Text = normalizeText(h1.textContent);
  if (!h1Text.startsWith(ctx.id)) {
    throw new Error(`Layout break for ${ctx.id}: unexpected <h1> "${h1Text}" in ${ctx.sourceUrl}`);
  }

  const content = findContentContainer(root);
  if (content === null) {
    throw new Error(`Layout break for ${ctx.id}: missing main content container in ${ctx.sourceUrl}`);
  }

  removeChrome(content);

  const warnings: string[] = [];
  const desiredMarker = findMarker(content, MARKERS.desiredOutcome);
  const commonMarker = findMarker(content, MARKERS.commonAntiPatterns);
  const benefitsMarker = findMarker(content, MARKERS.benefits);
  const riskMarker = findMarker(content, MARKERS.risk);
  const implementationIndex = findHeadingIndex(content, "Implementation guidance");
  const stepsHeadingIndex = findHeadingIndex(content, "Implementation steps");
  const resourcesIndex = findHeadingIndex(content, "Resources");
  const implementationGuidanceResult = resolveImplementationGuidance(
    content,
    implementationIndex,
    stepsHeadingIndex,
    resourcesIndex,
    desiredMarker,
    commonMarker,
    benefitsMarker,
    riskMarker,
  );

  if (riskMarker === undefined) {
    warnings.push(`Missing inline marker: ${MARKERS.risk.label}`);
  }
  if (
    implementationGuidanceResult.guidance === "" &&
    implementationIndex === undefined &&
    stepsHeadingIndex === undefined &&
    !implementationGuidanceResult.foundOrphanBody
  ) {
    warnings.push("Missing heading: Implementation guidance");
  }
  if (resourcesIndex === undefined) {
    warnings.push("Missing heading: Resources");
  }

  const statementEnd = firstDefinedIndex(
    desiredMarker?.directChildIndex,
    commonMarker?.directChildIndex,
    benefitsMarker?.directChildIndex,
    riskMarker?.directChildIndex,
    implementationIndex,
    resourcesIndex,
  );
  const statement =
    statementEnd === undefined ? "" : markdownFromHtml(htmlBetween(content, 0, statementEnd));

  const desiredOutcome = sectionFromMarker(
    content,
    desiredMarker,
    firstDefinedIndex(commonMarker?.directChildIndex, benefitsMarker?.directChildIndex, riskMarker?.directChildIndex, implementationIndex),
    MARKERS.desiredOutcome.label,
    warnings,
  );
  const commonAntiPatterns = sectionFromMarker(
    content,
    commonMarker,
    firstDefinedIndex(benefitsMarker?.directChildIndex, riskMarker?.directChildIndex, implementationIndex),
    MARKERS.commonAntiPatterns.label,
    warnings,
  );
  const benefits = sectionFromMarker(
    content,
    benefitsMarker,
    firstDefinedIndex(riskMarker?.directChildIndex, implementationIndex),
    MARKERS.benefits.label,
    warnings,
  );

  const implementationGuidance = implementationGuidanceResult.guidance;
  const resources =
    resourcesIndex === undefined
      ? ""
      : markdownFromHtml(htmlBetween(content, resourcesIndex + 1, content.childNodes.length));

  return {
    id: ctx.id,
    pillarSlug: ctx.pillarSlug,
    prefix: ctx.id.match(/^[A-Z]{2,4}/)?.[0] ?? "",
    questionId: ctx.id.split("-")[0] ?? ctx.id,
    question: ctx.question,
    title: ctx.title,
    riskLevel: parseRiskLevel(content, riskMarker),
    sourceUrl: ctx.sourceUrl,
    statement,
    desiredOutcome,
    commonAntiPatterns,
    benefits,
    implementationGuidance,
    resources,
    warnings,
  };
}
