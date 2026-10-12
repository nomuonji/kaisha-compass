# Kaisha Compass production: Cloudflare Pages

## Verified deployment target (2026-10-12)

The live hosting platform is **Cloudflare Pages**, not a standalone Cloudflare Worker.

- Pages project: `kaisha-compass`; GitHub repo: `nomuonji/kaisha-compass`
- Production branch: `main`
- Cloudflare Pages build command: `npm run build`
- Cloudflare Pages published output directory: `dist`
- Domains: `https://kaisha-compass.pages.dev/` and `https://kaisha-compass.antonbase.com/`
- `wrangler.jsonc` is **Pages** configuration (`pages_build_output_dir`), with no standalone Worker `main`, `routes`, or custom-domain creation.

Cloudflare Pages Git integration automatically deploys on each main push. GitHub Actions **Validate Astro** is build-only; its success is not equivalent to production HTTP 200.

## Why the site previously showed 404

Astro 7 with `@astrojs/cloudflare` emitted generated HTML under `dist/client/` and server assets under `dist/server/`. Cloudflare Pages published `dist/` as its URL root. Consequently `/client/` worked while `/`, `/practice/`, and `/company-law/` were 404.

Do **not** resolve this by adding Worker custom domain routes. The domain was already attached to the existing **Pages** project. Do **not** expose `dist/server` or convert the whole project to an unrelated Worker deployment.

The `npm run build` script now runs `npm run build:astro` then `node scripts/prepare-pages-output.mjs`. The staging step moves only browser assets from `dist/client/` to **`dist/`**, deleting the generated server directory from Pages static output. Assets, prerendered routes, sitemap, and headers keep their URL-relative locations.

`node scripts/check-deploy-assets.mjs` asserts that the published `dist/index.html`, 25 practice articles, 15 law articles, and CSS assets exist; also asserts there are no public `dist/client/` or `dist/server/` bundles.

## Dynamic CMS route

`/features/` and `/features/[slug]/` remain backed by My Portal Public CMS. These routes use Cloudflare **Pages Functions** (`functions/features/index.js` and `functions/features/[[slug]].js`), not a raw Astro Workers deployment.

The Functions fetch the same `/api/public-content?site=kaisha-compass` endpoint as `src/lib/portal-cms.ts`. The HTML is placed inside a pre-rendered Astro `/cms-page-template/` layout, keeping the existing site styles. Markdown is rendered with HTML disabled. The list is noindexed when empty; missing articles return HTTP 404. Public CMS base URL defaults to `https://my-portal-agent.netlify.app` and can be overridden with `PUBLIC_CMS_BASE_URL` in Pages runtime variables.

The two original `src/pages/features/` Astro SSR files remain as source references; they are not expected to create static HTML in the Pages build. Do not mark them as prerendered or snapshot them at build time.

## Release verification

1. Check GitHub PR `Validate Astro`: UX contract, Astro build, Pages output assertions.
2. Check **Cloudflare Pages** production deployment succeeded for the specific merge commit; GitHub workflow green alone is insufficient.
3. Check `https://kaisha-compass.pages.dev/` and `https://kaisha-compass.antonbase.com/` HTTP 200.
4. Test `/practice/`, a `/practice/[slug]/` article, `/company-law/`, and an article on each host.
5. Test `/features/`: it should serve HTML from a Pages Function (including an empty-state when there are no published CMS items).
6. A successful deployment with HTTP 404 still means release verification failed. Inspect uploaded output paths and Pages Functions route generation rather than changing domains.

For Pages deployments, never assume `wrangler.jsonc` Worker-specific `routes` config changes the Pages project's output or domains.
