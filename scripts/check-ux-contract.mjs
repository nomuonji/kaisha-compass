import { readFileSync } from "node:fs";

const read = (path) => readFileSync(new URL("../" + path, import.meta.url), "utf8");
const failures = [];

function requireText(path, text, reason) {
  const body = read(path);
  if (!body.includes(text)) failures.push(path + ": " + reason + " (missing: " + text + ")");
}

function forbidText(path, text, reason) {
  const body = read(path);
  if (body.includes(text)) failures.push(path + ": " + reason + " (found: " + text + ")");
}

// Global hierarchy must remain visible.
requireText("src/layouts/BaseLayout.astro", "HierarchyBar", "site-wide hierarchy bar was removed");
requireText("src/components/HierarchyBar.astro", "0", "overview level missing");
requireText("src/components/HierarchyBar.astro", "場面", "scene level missing");
requireText("src/components/HierarchyBar.astro", "領域", "topic level missing");
requireText("src/components/HierarchyBar.astro", "資料要約", "source-summary level missing");
requireText("src/components/HierarchyBar.astro", "原典", "external-original level missing");

// Homepage must stay reading-first.
requireText("src/pages/index.astro", "ReadingJourney", "homepage no longer uses the reading-first journey");
forbidText("src/pages/index.astro", "JourneyTimeline", "legacy timeline/database-first journey was reintroduced");
requireText("src/components/ReadingJourney.astro", "1 場面", "scene destination labels disappeared from story links");

// Page families must declare their hierarchy level.
requireText("src/pages/journey/[id].astro", 'level="scene"', "journey page hierarchy level is missing");
requireText("src/pages/topics/[topic].astro", 'level="topic"', "topic page hierarchy level is missing");
requireText("src/pages/resources/[id].astro", 'level="source"', "resource-detail hierarchy level is missing");
requireText("src/pages/resources/index.astro", 'level="source"', "resource-library hierarchy level is missing");

// Scene pages must remain prose chapters with in-site source summaries.
requireText("src/pages/journey/[id].astro", "eventGuides", "scene page lost narrative guide content");
requireText("src/pages/journey/[id].astro", "参照資料の内容", "scene page lost in-site source summaries");
requireText("src/pages/journey/[id].astro", "4 原典", "external source destination is no longer explicit");

// Resource pages must summarize before external exit.
requireText("src/pages/resources/[id].astro", "digestForResource", "resource page lost internal digest");
requireText("src/pages/resources/[id].astro", "資料の要点", "resource page lost summary-first structure");
requireText("src/pages/resources/[id].astro", "original-source", "external original section is missing");
requireText("src/pages/resources/[id].astro", "4 原典", "external exit is no longer labeled");

// Resource cards must differentiate internal summary from external source.
requireText("src/components/ResourceCard.astro", "3 資料要約", "resource-card internal destination label missing");
requireText("src/components/ResourceCard.astro", "4 原典", "resource-card external destination label missing");

// Plain language must not regress into editorial rhetoric.
forbidText("src/pages/journey/[id].astro", "原典を開かなくても", "rhetorical source-summary heading was reintroduced");
forbidText("src/pages/resources/[id].astro", "30秒で把握する", "promotional/editorial summary heading was reintroduced");
requireText("src/pages/journey/[id].astro", "section-kind source-kind", "semantic section label is missing");
requireText("src/pages/resources/[id].astro", "section-kind external-kind", "external-original semantic section label is missing");
requireText("src/styles/global.css", "--level-scene", "scene color token is missing");
requireText("src/styles/global.css", "--level-topic", "topic color token is missing");
requireText("src/styles/global.css", "--level-source", "source-summary color token is missing");
requireText("src/styles/global.css", "--level-external", "external-source token is missing");

// Future agents must have durable context.
requireText("AGENTS.md", "Non-regression UX contract", "agent UX contract missing");
requireText("docs/UX_DECISIONS.md", "D007", "plain-language visual-semantics decision is missing");

if (failures.length) {
  console.error("\nUX CONTRACT FAILED\n");
  for (const failure of failures) console.error("- " + failure);
  console.error("\nIf this is an intentional product change, update docs/UX_DECISIONS.md, AGENTS.md, and this contract in the same change.\n");
  process.exit(1);
}

console.log("UX contract passed: reading-first flow, hierarchy, source summaries, and external-exit semantics are intact.");
