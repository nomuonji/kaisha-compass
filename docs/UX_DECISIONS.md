# UX Decision Log

This document records the reasoning behind Kaisha Compass's major structural changes so later work does not accidentally recreate previously rejected designs.

Decisions are append-only in spirit. A later decision may supersede an earlier one, but the old entry should remain for context.

---

## 2026-10-04 — D001: Use a fixed model company as context

**Status:** Accepted

### Problem

Company-operation knowledge is fragmented across corporate law, registration, tax, accounting, labor, social insurance, contracts, and finance. A conventional topic-by-topic reference site makes the reader reconstruct the relationships themselves.

### Decision

Use one static model company and follow its first year.

The company is not a game simulation. It is a narrative device that explains *why a piece of knowledge becomes relevant now*.

### Do not regress to

- isolated subject silos as the only navigation;
- a gamified company simulator;
- a generic business-media homepage with unrelated articles.

---

## 2026-10-04 — D002: External sources are curated evidence, not the entire product

**Status:** Accepted

### Problem

The subject matter is specialized and changes over time. Writing all specialist content from scratch would be brittle, while a plain link directory would force the reader to leave the site before understanding anything.

### Decision

Curate high-quality official and practical sources, but summarize their role and important points inside Kaisha Compass.

Official sources are preferred for authority. Practical sources are used as explanatory aids.

### Do not regress to

- a pure outbound-link collection;
- thin one-line descriptions followed by an external link;
- replacing official sources with AI-generated assertions.

---

## 2026-10-04 — D003: Move from hand-written static HTML to Astro

**Status:** Accepted

### Problem

The initial plain HTML/CSS/JS implementation was quick to prototype but weak for page hierarchy, reusable components, metadata, static generation, and long-term maintenance.

### Decision

Use Astro + TypeScript with static generation.

Current route families:
- `/`
- `/journey/[id]/`
- `/topics/[topic]/`
- `/resources/`
- `/resources/[id]/`

### Do not regress to

- a single giant static HTML page;
- duplicated per-page markup;
- client-heavy application architecture without a concrete need.

---

## 2026-10-04 — D004: Reading-first, not database-first

**Status:** Accepted

### Problem observed

The first Astro design surfaced the database model too strongly: counts, cards, topic grids, filters, and resource inventories appeared before the reader had formed a mental model.

Humans tend to understand this domain better as a sequence of events and explanations, not as a database schema.

### Decision

The public experience should read like a book before it behaves like a database.

Homepage order:
1. editorial introduction;
2. model company introduction;
3. the company's year as a linear reading flow;
4. topic index after the story;
5. resource library last.

Scene pages are prose chapters, not search-result pages.

### Do not regress to

- counts/resources/categories as the opening visual;
- dashboard-first presentation;
- a homepage dominated by cards and filters;
- forcing category selection before reading context.

---

## 2026-10-04 — D005: Summarize source content inside Kaisha Compass

**Status:** Accepted

### Problem observed

Even after the reading-first redesign, a link-oriented resource model still required users to open external sites to understand the source.

### Decision

Source-detail pages must provide:
- a short summary;
- important points;
- when the source is useful;
- related company scenes;
- related knowledge domains;
- the external original only as the final verification step.

Major sources receive explicit curated digests in `src/lib/resourceDigests.ts`.
Fallback summaries provide baseline coverage for the remainder.

### Do not regress to

- metadata-only resource pages;
- treating outbound clicks as the primary learning interaction.

---

## 2026-10-04 — D006: Make hierarchy and click destination visually explicit

**Status:** Accepted

### Problem observed

The reader could not reliably tell:
- whether the current page was a scene, topic, source summary, or something else;
- whether a link moved deeper, sideways, upward, or outside the site;
- whether a section represented company context, a professional domain, or an external reference.

Prose readability alone did not solve orientation.

### Decision

Adopt one site-wide hierarchy:

```
0 Overview
  ↓
1 Scene
  ↓
2 Topic
  ↓
3 Source summary
  ↓
4 Original source (external)
```

Every page displays the shared hierarchy bar with the current level highlighted.

Important links display their destination level:
- `1 場面`
- `2 領域`
- `3 資料要約`
- `4 原典`

Level 4 must remain visually different because it exits Kaisha Compass.

### Do not regress to

- generic arrows whose destination type is ambiguous;
- breadcrumbs as the only orientation mechanism;
- using the same card/button style for internal hierarchy changes and external exits;
- hiding the site's hierarchy behind the data model.

---

## Current UX contract

When evaluating a future UI change, ask in this order:

1. Can a first-time reader tell what level they are currently on?
2. Can they tell what level each important link will open?
3. Is the main path readable top-to-bottom without operating a database UI?
4. Does the user understand the source before being asked to leave the site?
5. Are indexes/search presented as tools after context, rather than the primary mental model?

If any answer becomes "no", treat the change as a UX regression unless a new recorded decision explicitly supersedes this contract.
