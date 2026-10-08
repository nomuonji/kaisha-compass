import { defineConfig } from "astro/config";
import cloudflare from "@astrojs/cloudflare";

const site = process.env.SITE_URL;

export default defineConfig({
  output: "static",
  adapter: cloudflare({ prerenderEnvironment: "node" }),
  build: { format: "directory" },
  ...(site ? { site } : {})
});
