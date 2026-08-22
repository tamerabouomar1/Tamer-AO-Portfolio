#!/usr/bin/env node
/* Write public/sitemap.xml from the routes the app actually serves.
 *
 * The file used to be maintained by hand, and it drifted: /free was missing
 * and so was every /templates/:slug page — 37 URLs, and the template pages are
 * the largest body of unique content on the site. Anything Google cannot find
 * in the sitemap and cannot reach by a crawlable <a href> is effectively
 * invisible, and the store grid links are React <Link>s.
 *
 * Slugs are read out of siteData.js rather than repeated here, so adding a
 * template to the store puts it in the sitemap with no second edit.
 *
 * Run with `npm run build:sitemap`; `npm run build` does it automatically.
 */

import { readFileSync, writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const root = resolve(here, "..");

const SITE = "https://portfolio.tamerao.workers.dev";

/* The static routes, in the order they matter. `priority` is only a hint to
   crawlers about relative importance within this one site — it says nothing
   about ranking against anyone else, so the spread is deliberately narrow. */
const PAGES = [
  ["/", "weekly", "1.0"],
  ["/free", "weekly", "0.9"],
  ["/websites", "weekly", "0.9"],
  ["/templates", "weekly", "0.9"],
  ["/projects", "monthly", "0.9"],
  ["/work-with-me", "monthly", "0.8"],
  ["/fitness", "monthly", "0.8"],
  ["/media", "monthly", "0.7"],
  ["/about", "monthly", "0.7"],
];

// Every slug in TEMPLATES, including the ones pushed on from SIGNATURE.
function templateSlugs() {
  const src = readFileSync(join(root, "src/siteData.js"), "utf8");
  const slugs = [...src.matchAll(/^\s{4}slug:\s*"([\w-]+)"/gm)].map((m) => m[1]);
  const seen = new Set();
  return slugs.filter((s) => !seen.has(s) && seen.add(s));
}

const slugs = templateSlugs();
const today = new Date().toISOString().slice(0, 10);

const urls = [
  ...PAGES.map(([path, freq, pri]) => ({ path, freq, pri })),
  // A template page changes only when that template is rebuilt, which is rare
  // once it ships — monthly rather than the weekly the store index gets.
  ...slugs.map((s) => ({ path: `/templates/${s}`, freq: "monthly", pri: "0.6" })),
];

const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls
  .map(
    ({ path, freq, pri }) => `  <url>
    <loc>${SITE}${path}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${freq}</changefreq>
    <priority>${pri}</priority>
  </url>`
  )
  .join("\n")}
</urlset>
`;

writeFileSync(join(root, "public/sitemap.xml"), xml);
console.log(
  `sitemap.xml: ${urls.length} URLs (${PAGES.length} pages + ${slugs.length} templates)`
);
