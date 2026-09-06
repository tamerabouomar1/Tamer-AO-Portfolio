#!/usr/bin/env node
/* Write dist/sitemap.xml from the routes the app actually serves.
 *
 * dist/, not public/: <lastmod> is a content hash of the BUILT page, so this
 * has to run after the prerender. scripts/sitemap-lastmod.json carries the
 * hashes between builds and is why a clean `rm -rf dist` does not reset every
 * date to today.
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

import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { createHash } from "node:crypto";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const root = resolve(here, "..");

const SITE = "https://tamerabouomar.com";

/* The static routes, in the order they matter. `priority` is only a hint to
   crawlers about relative importance within this one site — it says nothing
   about ranking against anyone else, so the spread is deliberately narrow. */
const PAGES = [
  ["/", "weekly", "1.0"],
  ["/free", "weekly", "0.9"],
  ["/websites", "weekly", "0.9"],
  // NOT /templates. That route is a client-side <Navigate> to /websites, so
  // it is a redirect rather than a destination: a crawler that runs no JS
  // sees an all-but-empty page, and one that does gets bounced. Submitting a
  // redirect in a sitemap asks Google to index a URL that does not want to be
  // indexed. The route still works for anyone holding an old link.
  ["/projects", "monthly", "0.9"],
  ["/work-with-me", "monthly", "0.8"],
  // The search-intent pages. High priority because they are the ones written
  // to be found, rather than to be navigated to from inside the site.
  ["/website-design-lebanon", "monthly", "0.9"],
  ["/logo-design-beirut", "monthly", "0.9"],
  ["/restaurant-website-lebanon", "monthly", "0.9"],
  ["/social-media-management-lebanon", "monthly", "0.9"],
  ["/salon-website-lebanon", "monthly", "0.9"],
  ["/google-business-profile-lebanon", "monthly", "0.9"],
  ["/fitness", "monthly", "0.8"],
  ["/media", "monthly", "0.7"],
  ["/about", "monthly", "0.7"],
  /* The policy pages, at the bottom of the priority range on purpose.
     They belong in the sitemap: a crawler finding them is part of how a site
     reads as a real business, and payment providers look for them by URL. But
     they are not written to be found, so they sit below every page that is. */
  ["/privacy", "yearly", "0.3"],
  ["/cookies", "yearly", "0.3"],
  ["/terms", "yearly", "0.3"],
  ["/refunds", "yearly", "0.3"],
];

// Every slug in TEMPLATES, including the ones pushed on from SIGNATURE.
/* Slugs from TEMPLATES and SIGNATURE only.
 *
 * This used to scan the whole file for any four-space-indented `slug:`, which
 * was fine while templates were the only thing in siteData.js with a slug. The
 * moment SERVICE_PAGES arrived it silently swept those up too and published
 * /templates/website-design-lebanon and two more like it — URLs that render
 * nothing, in a sitemap that tells Google they are worth crawling.
 *
 * Scoped to the arrays that actually hold templates, so a future array with
 * slugs in it cannot leak in the same way. */
function templateSlugs() {
  const src = readFileSync(join(root, "src/siteData.js"), "utf8");

  // SIGNATURE is a plain `const`, not an export — it is pushed onto TEMPLATES
  // further down the file — so both declaration forms have to be matched or
  // its six templates go missing from the sitemap.
  const arrays = ["TEMPLATES", "SIGNATURE"]
    .map((name) => {
      const start = ["export const", "const"]
        .map((kw) => src.indexOf(`${kw} ${name} = [`))
        .filter((i) => i !== -1)
        .sort((a, b) => a - b)[0];
      if (start === undefined) return "";
      const end = src.indexOf("\n];", start);
      return end === -1 ? "" : src.slice(start, end);
    })
    .join("\n");

  const slugs = [...arrays.matchAll(/^\s{4}slug:\s*"([\w-]+)"/gm)].map((m) => m[1]);
  const seen = new Set();
  return slugs.filter((s) => !seen.has(s) && seen.add(s));
}

const slugs = templateSlugs();

/* ── lastmod, derived from content rather than from the clock ──────────────
 *
 * Every URL used to carry today's date, rewritten on every build. That is the
 * "lazy generation" pattern: it tells Google all 56 pages changed today, every
 * time anything ships, and a lastmod that is always today is a lastmod Google
 * learns to ignore — which costs the one optional sitemap field it still reads.
 * (It ignores <priority> and <changefreq> outright, which is why neither is
 * emitted any more.)
 *
 * So each page's PRERENDERED CONTENT is hashed: the title, the description and
 * the body a crawler actually reads, with the hashed asset filenames stripped
 * out so a CSS-only rebuild does not mark all 56 pages as changed. The date
 * moves only when the hash does, and is remembered in sitemap-lastmod.json
 * between builds.
 *
 * This runs AFTER the prerender (see the "build" script) because dist/ has to
 * exist to be hashed, and writes straight to dist/sitemap.xml. */
const MANIFEST = join(here, "sitemap-lastmod.json");
const prev = existsSync(MANIFEST) ? JSON.parse(readFileSync(MANIFEST, "utf8")) : {};
let changed = 0;   // pages whose CONTENT hash moved, which is the real signal
const today = new Date().toISOString().slice(0, 10);
const next = {};

function lastmodFor(path) {
  const file = join(root, "dist", path === "/" ? "index.html" : path.slice(1) + "/index.html");
  if (!existsSync(file)) return prev[path]?.date || today;
  const html = readFileSync(file, "utf8")
    // asset URLs carry a content hash that changes on any CSS/JS edit; a
    // stylesheet tweak is not a change to this page's content.
    .replace(/\/assets\/[A-Za-z0-9._-]+/g, "")
    // the sitemap's own date must not feed back into the hash
    .replace(/\d{4}-\d{2}-\d{2}/g, "");
  const hash = createHash("sha256").update(html).digest("hex").slice(0, 16);
  const unchanged = prev[path]?.hash === hash;
  if (!unchanged) changed++;
  const date = unchanged ? prev[path].date : today;
  next[path] = { hash, date };
  return date;
}

const urls = [...PAGES.map(([path]) => path), ...slugs.map((s) => `/templates/${s}`)];

const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls
  .map(
    (path) => `  <url>
    <loc>${SITE}${path}</loc>
    <lastmod>${lastmodFor(path)}</lastmod>
  </url>`
  )
  .join("\n")}
</urlset>
`;

writeFileSync(join(root, "dist/sitemap.xml"), xml);
writeFileSync(MANIFEST, JSON.stringify(next, null, 2) + "\n");

/* Count pages whose HASH moved, not pages whose date happens to equal today.
   The first version counted the latter and reported "56 changed" on a rebuild
   of untouched content, purely because the baseline had been written the same
   day — the mechanism was right and the number was lying about it. */
console.log(
  `sitemap.xml: ${urls.length} URLs (${PAGES.length} pages + ${slugs.length} templates), ` +
  `${changed} changed, ${urls.length - changed} kept their previous lastmod`
);
