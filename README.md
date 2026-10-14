# Kaisha Compass

会社運営を、点ではなく流れで学ぶ。

Kaisha Compass は、一社の仮想会社を設立から申告・定時株主総会まで追いながら、法務・税務・労務・会計・財務を信頼できる外部教材で学ぶ静的学習サイトです。

## Stack

- Astro 7
- TypeScript
- Static Site Generation
- JSON-based curated resource database
- No client framework dependency

## Information architecture

- `/` — editorial landing page
- `/journey/[id]/` — 15 company-event learning routes
- `/topics/[topic]/` — 6 domain-specific resource maps
- `/resources/` — searchable resource library
- `/resources/[id]/` — 79 resource context/detail pages
- `/sitemap.xml` — generated static sitemap

## Development

~~~bash
npm install
npm run dev
~~~

## Build

~~~bash
npm run build
npm run preview
~~~

Set `SITE_URL` in the build environment to emit production canonical URLs and the production sitemap origin.

## Editorial principle

The product does not try to replace specialist guidance with generic AI-written summaries. Its value is navigation:

1. What happened in the company?
2. What knowledge domains become relevant?
3. Which official source should be checked first?
4. Which practical explanation is useful as a supporting guide?

Official sources are marked separately from practical explanations. Each resource stores a `lastCheckedAt` date; time-sensitive resources can also store `validAsOf`.


## UX governance

Kaisha Compass has an explicit non-regression contract.

- `AGENTS.md` — mandatory product/UX invariants for future agents and contributors.
- `docs/UX_DECISIONS.md` — dated decision history explaining why rejected structures should not be reintroduced.
- `npm run check:ux` — automated contract check run by GitHub Actions before the Astro build.
- `.github/pull_request_template.md` — hierarchy and external-link regression checklist.

The current canonical hierarchy is:

`0 Overview → 1 Scene → 2 Topic → 3 Source summary → 4 Original source (external)`

Intentional changes to this model must update the decision log, agent contract, and automated check together.


## Interactive 3D curriculum (2026-10-14)

The homepage, practice index, company-law index and company-year chapters have a Three.js spatial explorer. It uses the same editorial data as the existing articles rather than creating a second database. Rotate/zoom the company model, choose a numbered event or topic, and continue into its original article.

The canvas is an enhancement only: full titles, summaries and links remain server-rendered HTML, with buttons to navigate if WebGL or motion is unavailable. The Three.js bundle is loaded only when the explorer approaches the viewport; rendering is paused when offscreen.

The visual relationships are educational, not a numerical simulation. Source and article URLs, canonical hierarchy and Cloudflare Pages static deployment remain unchanged. See D011 in \`docs/UX_DECISIONS.md\`.
