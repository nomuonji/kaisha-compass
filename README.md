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
