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

### 4a. Resource summaries are reader-first explanations

- All `/resources/[id]/` pages show **この資料で分かること → 確認ポイント → 会社のどんなときに使う？ → 4 原典** in that order. Keep publisher, time and verification metadata once, in readable type.
- A curated digest may say it summarizes the specific resource. For other resources, describe generic points as **原典で確認したいこと** and do not imply detailed human review.
- Source page typography must be practical at 390px and 1440px; preserve the blue level-3 treatment, dashed neutral level-4 external link and readable links back to model company scenes.
- Related topics and further reading support the page, never compete with the core explanation. See `docs/UX_DECISIONS.md` D010.

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

## Additive company-law study library

## 3D spatial exploration (2026-10-14)

- The Three.js viewer is a navigation and conceptual visualization of real existing content, **not** a gamified business simulator or a replacement for the textual chapters.
- Home: the model company is introduced in plain language before the spatial timeline. The full existing \`ReadingJourney\` remains intact.
- \`WorldExplorer.astro\` draws its points directly from the canonical \`events\`, \`practicalGuides\`, and \`lawStudyGroups\` data; do not maintain a duplicate editorial database for the scene.
- Keep item descriptions, original routes, semantic hierarchy and destination labels in the HTML. Canvas is progressive enhancement: all destinations remain keyboard navigable without WebGL, motion, or JavaScript.
- Use lazy loading, reduced-motion behavior, sensible GPU limits, no external CDN, and paused rendering when offscreen. Never load Three.js on source/resource pages that do not need it.
- The 3D graph illustrates relationships/sequence; distance, object size and movement are not quantitative financial/legal measurements. Do not imply actual simulations.
- Do not change the Cloudflare Pages static output, source-of-truth boundaries or canonical URLs.


- `/company-law/` and `/company-law/[slug]/` are level-2 topic learning routes for judicial-scrivener candidates.
- The canonical edited lesson data is `src/lib/companyLawLessons.ts`. The original 15-scene company year remains the primary narrative path.
- Use shared destination vocabulary and dashed level-4 links for original law sources; do not introduce a new hierarchy level.
- Every lesson includes statutory references, substantive prose, a worked example, a common trap, a self-check question and official source links.
- The edit date is not a certificate of complete legal review. Verify currently effective provisions before claiming recent changes or legal/registration exceptions.
- The study library is GitHub-owned and independent from the Public CMS `/features/`.

## Additive company operation practice course

- `/practice/` and `/practice/[slug]/` are a level-2 practical learning course with 25 curated business cases about founding and running a company.
- Canonical guide content is `src/lib/practicalGuidesA.ts`, `src/lib/practicalGuidesB.ts` with curriculum/scene mappings in `src/lib/practicalGuides.ts`. Preserve real case content, not just a card index.
- The model company is still the narrative spine; the 15 existing scene chapters remain first on the homepage. Connect each practical case to the company-year scene and relevant `/company-law/` lesson when possible.
- Require problem scenario, substantive ordered practical explanation, example document evidence, statutory boundary, likely misconception, interactive self-check, and official sources.
- Be explicit whether a document is an example, good practice, or legally mandatory; never assume identical filing requirements for all corporate types.
- Use existing topic-level navigation and external-source link semantics. New course does not create a new hierarchy level and is GitHub-owned, not My Portal's `/features/` CMS.

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
