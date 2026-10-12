import { defineConfig } from "astro/config";

// The existing production service is Cloudflare Pages, with "dist" as its
// published root. Static Astro emits HTML directly there; only /features/
// requires runtime rendering, handled by Cloudflare Pages Functions.
export default defineConfig({
  site: "https://kaisha-compass.antonbase.com",
  output: "static",
  build: { format: "directory" }
});
