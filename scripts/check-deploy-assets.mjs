import { existsSync, readdirSync, statSync } from "node:fs";
import { join, resolve } from "node:path";

// Cloudflare Pages deploys dist/ as the site's URL root.
// build must move Astro's dist/client assets here; dist/server must NOT be public.
const output = resolve("dist");
const mustExist = [
  "index.html",
  "practice/index.html",
  "practice/kk-or-gk/index.html",
  "practice/annual-shareholders-meeting/index.html",
  "company-law/index.html",
  "company-law/articles-of-incorporation/index.html",
];
const errors = [];
for (const path of mustExist) {
  if (!existsSync(join(output, path))) errors.push("Missing generated asset: dist/" + path);
}
for (const [directory, expected] of [["practice", 25], ["company-law", 15]]) {
  const dir = join(output, directory);
  if (!existsSync(dir)) continue;
  const count = readdirSync(dir).filter((name) => {
    const path = join(dir, name);
    return statSync(path).isDirectory() && existsSync(join(path, "index.html"));
  }).length;
  if (count < expected) errors.push("Generated " + directory + " pages: " + count + " (expected at least " + expected + ")");
}
if (existsSync(join(output, "server"))) errors.push("Private Astro server bundle leaked into public Pages output");
if (existsSync(join(output, "client"))) errors.push("Nested client directory would break public URLs");
if (!existsSync(join(output, "cms-page-template", "index.html"))) errors.push("CMS layout template missing");
if (!existsSync(resolve("functions", "features", "index.js")) || !existsSync(resolve("functions", "features", "[[slug]].js"))) errors.push("Cloudflare Pages CMS Functions missing");
if (errors.length) {
  console.error("Generated output layout:", existsSync(output) ? readdirSync(output, {withFileTypes:true}).map(entry=>entry.name).join(", ") : "(missing dist)");
  console.error("Deployment asset check failed:\n" + errors.join("\n"));
  process.exit(1);
}
console.log("Deployment assets verified: homepage, practical study pages, company-law pages.");
