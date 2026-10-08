# AGENTS.md — Kaisha Compass

This file defines product/UX invariants for any human or agent modifying this repository.

## Product intent

Kaisha Compass is not a database browser and not a game.
It is a reading-first learning site that uses one company's first year as the narrative spine for learning company operations.

The database exists behind the interface. The interface must follow human reading and orientation.

## Required context for Agent HQ editorial work

Before creating or editing any reader-facing text, fetch the **current main** versions of this file, `docs/EDITORIAL_POLICY.md`, `docs/UX_DECISIONS.md`, and `docs/HQ_EDITORIAL_OPERATIONS.md`. The site is an independent publication: HQ task IDs, Worker QA notes and other operational details must never appear in its public pages. Preserve Sites Operator's separate SEO ownership.

## Non-regression UX contract

### 1. Reading before browsing

The homepage must first explain the company and let the user read its year in sequence.

Do not:
- lead with counts, filters, resource cards, or database metrics;
- turn the homepage into a dashboard;
- make users choose a category before they understand the company story.

Indexes/search belong later, mainly in the resource library.

### 2. Fixed information hierarchy

Every piece of content belongs to one of these levels:

0. **Overview** — the whole company journey / site map.
1. **Scene** — something that happens in the company, e.g. hiring or closing.
2. **Topic** — a professional domain such as tax, labor, accounting, corporate law.
3. **Source summary** — Kaisha Compass's in-site explanation of one source.
4. **Original source** — an external official/practical source.

The site-wide hierarchy bar is the canonical visual model. Do not replace it with an unrelated navigation metaphor without an explicit product decision recorded in `docs/UX_DECISIONS.md`.

### 3. Link destination must be visible

A user should know what level a click will open before clicking.

Use the shared destination vocabulary:
- `1 場面`
- `2 領域`
- `3 資料要約`
- `4 原典`

External links must be visually distinct and use the external-source treatment (`↗`, dashed styling, or the shared `external` classes).

Do not use the same generic arrow/button treatment for scene, topic, internal source summary, and external source links.

### 4. External sources are the last step, not the content

Users must be able to understand the source's role, outline, and important points inside Kaisha Compass before leaving the site.

For important sources, maintain a curated digest in `src/lib/resourceDigests.ts`.
Fallback summaries are allowed for coverage, but major sources used in journey chapters should receive explicit curated summaries.

Do not regress resource pages into:
`title + one sentence + external link`.

### 5. Scene pages are articles, not result sets

Journey pages must read as chapters:
- introduction / context;
- what the user should understand;
- operational order;
- summarized source material;
- optional original-source verification;
- previous/next chapter navigation.

Do not replace the chapter with a grid of resource cards.

### 6. Topics are indexes, not the main reading path

Topic pages are useful after the reader has context.
They organize knowledge horizontally and may link back to scenes and down to source summaries.

Do not make topic/category selection the primary onboarding flow.

### 7. The resource library may look like an index

The resource library is the one place where search/filter/database-like presentation is appropriate.
Even there, each item should explain what the source contains before offering an external exit.

### 8. The model company is narrative context

The model company exists to connect otherwise separate disciplines.
Present it as a company the reader follows, not as a simulation dashboard or game state.

### 9. Plain, explicit language

Kaisha Compass is an instructional product, not an editorial magazine.

Prefer direct labels that describe function:
- 概要
- 重要ポイント
- 実務上の手順
- 資料要約
- 関連資料
- 外部原典

Avoid:
- poetic or metaphorical headings;
- copy that asks the reader to infer what a section does;
- clever editorial phrases such as “原典を開かなくても、まずここまで分かる” or “30秒で把握する”;
- English eyebrow text when a Japanese functional label is clearer.

Headings should answer “what is in this section?” rather than create mood.

### 10. Visual semantics are fixed

The visual language must map directly to content type.

Canonical level colors:
- 0 Overview: gray
- 1 Scene: orange
- 2 Topic: green
- 3 Source summary: blue
- 4 Original source: dark neutral + dashed border

Use the same level treatment in:
- hierarchy bar;
- destination badges;
- page-type labels;
- section borders where relevant.

External originals must always use dashed treatment in addition to the level label.

Do not introduce decorative colors with conflicting semantic meaning.

### 11. Framework and build

- Astro + TypeScript
- static output
- data under `src/data`
- reusable UI under `src/components`
- production build must pass GitHub Actions

Before considering a UX change complete, run the UX contract check and Astro build.

## Additive Public CMS boundary

- `/features/` is a separate My Portal CMS source (`siteId: kaisha-compass`) for supplemental articles only.
- Existing 15 scenes, scene navigation, resource digests, topic taxonomy, source links, and SEO control remain GitHub/Sites Operator owned.
- Agent HQ's publishing Manager/Worker work is limited to CMS records, not repository changes.
- See `docs/PORTAL_CMS_CONTRACT.md`. Changes to the site renderer itself are separate engineering tasks, validated before merge.

## Change discipline

If a future change intentionally contradicts one of these rules:

1. do not silently overwrite the rule;
2. add a dated entry to `docs/UX_DECISIONS.md`;
3. explain the user problem that justifies the change;
4. update this file and the automated UX contract check in the same change.

The default is preservation, not reinterpretation.
