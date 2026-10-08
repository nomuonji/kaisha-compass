# Additive My Portal CMS (Kaisha Compass)

Agent HQ's topic and article decisions follow [CMS Editorial Charter](CMS_EDITORIAL_CHARTER.md). It is an additive rule and does not loosen the existing pedagogical, official-source or UX invariants.

- GitHub is the source of truth for the original fifteen company scenes, reading order, hierarchy bar, specialist topic indexes, curated resource digests and original-source links.
- My Portal's `kaisha-compass` Public CMS site owns only new `/features/` supplemental explanatory articles. No CMS record may redefine a scene, a primary official source, a hardcoded topic route, or navigation order.
- The `/features/` pages use on-demand Astro SSR via the Cloudflare adapter; all existing routes remain pre-rendered. CMS errors do not prevent access to the original learning site.
- CMS article bodies are Markdown rendered with raw HTML disabled. The existing hierarchy remains visible, and an article is labeled '補足解説', not falsely presented as a new original source.
- Editorial Method must independently verify law/tax sources, effective dates, and correspondence to the existing learning hierarchy. Repo/Work Item provenance must not leak into public content.
- Sites Operator owns SEO separately. Agent HQ edits only CMS content; repository design changes are not CMS Worker tasks.
- Production deployment requires verifying Workers SSR routing before merge. This branch must not be deployed as a purely static site with missing dynamic routes.
