import { existsSync, renameSync, rmSync, readdirSync } from "node:fs";
import { join, resolve } from "node:path";

// Cloudflare Pages Git integration uploads the directory configured in its dashboard:
// dist. Astro + @astrojs/cloudflare emits its pre-rendered HTML under dist/client.
// Stage ONLY the browser assets at dist/, avoiding publication of dist/server code.
const dist = resolve("dist");
const client = join(dist, "client");
const staging = resolve(".kaisha-pages-output");
const required = ["index.html", "practice/index.html", "company-law/index.html", "_astro"];
for (const item of required) {
  if (!existsSync(join(client, item))) {
    throw new Error("Missing Astro browser asset: dist/client/" + item);
  }
}
if (existsSync(staging)) {
  throw new Error("Refusing to overwrite an existing Pages staging folder");
}
renameSync(client, staging);
rmSync(dist, { recursive: true, force: true });
renameSync(staging, dist);
for (const item of required) {
  if (!existsSync(join(dist, item))) {
    throw new Error("Missing Cloudflare Pages output: dist/" + item);
  }
}
if (existsSync(join(dist, "server"))) {
  throw new Error("Cloudflare Pages static output must not publicly expose Astro server bundles");
}
console.log("Cloudflare Pages deploy root:", dist);
console.log("Root assets:", readdirSync(dist).slice(0, 35).join(", "));
