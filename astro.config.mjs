import { defineConfig } from "astro/config";
import cloudflare from "@astrojs/cloudflare";

export default defineConfig({
  site: "https://kaisha-compass.antonbase.com",
  output: "static",
  adapter: cloudflare({ prerenderEnvironment: "node" }),
  build: { format: "directory" }
});
