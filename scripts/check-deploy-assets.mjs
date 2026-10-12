import { existsSync, readdirSync, statSync } from "node:fs";
import { join, resolve } from "node:path";

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
if (errors.length) {
  console.error("Generated output layout:", readdirSync(output, {withFileTypes:true}).map(entry=>entry.name).join(", "));
  for (const part of ["client","server"]) {
    const folder=join(output,part);
    if (existsSync(folder)) {
      console.error("Generated "+part+" layout:",readdirSync(folder).slice(0,30).join(", "));
    }
  }
  console.error("Deployment asset check failed:\n" + errors.join("\n"));
  process.exit(1);
}
console.log("Deployment assets verified: homepage, practical study pages, company-law pages.");
