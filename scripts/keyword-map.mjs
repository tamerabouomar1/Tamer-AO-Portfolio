/* The keyword map: which searches the site answers, and with which page.
 *
 *   node scripts/keyword-harvest.mjs   refresh keyword-data.json from Google
 *   node scripts/keyword-map.mjs       print the map and check the site against it
 *
 * keyword-data.json is every query Google autocomplete suggested for Lebanon
 * across the seed list in keyword-harvest.mjs. It carries no search volumes:
 * `hits` is how many separate lookups surfaced the query, which ranks demand
 * roughly and is NOT a monthly figure. Real volumes need Keyword Planner or
 * Search Console, and when either is available its numbers should replace
 * `hits` here rather than sit beside it.
 *
 * A cluster is one thing a person wants, however they phrase it. Each cluster
 * gets at most ONE route: two pages answering the same search compete with
 * each other, which is the /websites against /website-design-lebanon mistake
 * this site has already made once.
 */
import { readFileSync } from "node:fs";
import { PAGE_META } from "../src/lib/usePageMeta.js";
import { SERVICE_PAGES } from "../src/siteData.js";

const rows = JSON.parse(readFileSync(new URL("./keyword-data.json", import.meta.url), "utf8"));

// "Lebanon" is also a town in Oregon, Ohio, Pennsylvania, Tennessee, New
// Hampshire and Missouri, and autocomplete mixes them in.
const US = /lebanon (pa|tn|ohio|oregon|nh|mo|in|ky|nj)\b|\b(oregon|ohio|tennessee|pennsylvania|missouri)\b/;
const JOBS = /\b(jobs?|salary|internship|courses?|university|masters|major|syndicate|exam|books)\b|مطلوب|الجامعة|نقابة/;
const local = rows.filter((r) => /lebanon|beirut|لبنان|بيروت/.test(r.q) && !US.test(r.q));

/* `match` picks the cluster's queries out of the local set. `route` is the one
   page that answers it, or null while that is still undecided. `title` lists
   words the route's <title> must contain, so a later rewrite of a heading
   cannot quietly drop the query the page exists for. `proof` is the live,
   nameable work behind the claim, because a page with none is a page that
   ranks briefly and convinces nobody. */
const CLUSTERS = [
  { id: "web design", match: /web ?(site)? ?(design|develop|dev\b|creat)|website (in|designer)/, route: "/website-design-lebanon", title: ["web design", "lebanon"], proof: 6 },
  { id: "website cost", match: /website (cost|price)|websites cost/, route: "/website-cost-lebanon", title: ["website cost", "lebanon"], proof: 6 },
  { id: "logo and branding", match: /logo|branding|brand identity|لوغو|هوية/, route: "/logo-design-beirut", title: ["logo design", "branding", "lebanon"], proof: 5 },
  { id: "graphic designer", match: /graphic design|جرافيك/, route: "/", title: ["graphic designer", "lebanon"], proof: 5 },
  { id: "social media management", match: /social media (management|manager|packages|compan)/, route: "/social-media-management-lebanon", title: ["social media management", "lebanon"], proof: 5 },
  { id: "video editor", match: /video edit/, route: "/video-editor-lebanon", title: ["video editor", "lebanon"], proof: 5 },

  // Open. Each has demand and no page. See decide() below.
  { id: "ecommerce and shopify", match: /e-?\s?commerce|shopify/, route: null, proof: 0, note: "No live client shop in WEBSITES. OKIRO is Tamer's own." },
  { id: "seo", match: /\bseo\b/, route: null, proof: 1, note: "Sold inside builds and the Google profile, never on its own." },
  { id: "marketing agency", match: /marketing|advertising agency|creative agency|social media (agency|marketing)|تسويق/, route: null, proof: 0, note: "Agency searches. /work-with-me is the nearest offer and targets no query." },
  { id: "arabic web design", match: /تصميم مواقع|تصميم موقع/, route: null, proof: 1, note: "No Arabic page on the site. Sophia's Forum is the bilingual proof." },
];

const NOT_BUYERS = [
  { id: "job seekers", match: JOBS },
  { id: "shoppers", match: /online (store|shop|shopping)|store price/ },
];

const measure = (c, pool) => {
  const qs = pool.filter((r) => c.match.test(r.q));
  return { queries: qs.length, hits: qs.reduce((n, r) => n + r.hits, 0), top: qs.slice(0, 3).map((r) => r.q) };
};

const buyers = local.filter((r) => !NOT_BUYERS.some((n) => n.match.test(r.q)));

/* What to do with a cluster that has demand and no page yet.
 *
 * Receives { id, queries, hits, proof, note } and returns one of:
 *   "build"  it earns its own page now
 *   "fold"   answer it inside an existing page instead (an FAQ, a section)
 *   "wait"   real demand, but not until there is proof or an offer behind it
 *
 * For scale: the clusters that already have pages run from about 25 hits
 * (website cost) to 300+ (web design). `proof` is how many live, nameable
 * pieces of work stand behind the claim.
 */
function decide(cluster) {
  // TODO(Tamer): your rule goes here. Until then nothing open is acted on.
  return "undecided";
}

// ── Report ────────────────────────────────────────────────────
const pad = (s, n) => String(s).padEnd(n);
console.log(`\n${rows.length} queries harvested, ${local.length} about Lebanon, ${buyers.length} left after dropping job seekers and shoppers.\n`);
console.log(pad("cluster", 26) + pad("queries", 9) + pad("hits", 7) + "page");
for (const c of CLUSTERS) {
  const m = measure(c, buyers);
  const where = c.route ?? `(none) -> ${decide({ ...c, ...m })}`;
  console.log(pad(c.id, 26) + pad(m.queries, 9) + pad(m.hits, 7) + where);
  console.log(pad("", 26) + m.top.join(" | "));
}
console.log("\nNot buyers, deliberately given no page:");
for (const n of NOT_BUYERS) {
  const m = measure(n, local);
  console.log(pad(n.id, 26) + pad(m.queries, 9) + pad(m.hits, 7) + m.top.join(" | "));
}

// ── Checks ────────────────────────────────────────────────────
const problems = [];
for (const c of CLUSTERS.filter((x) => x.route)) {
  const meta = PAGE_META[c.route];
  if (!meta) { problems.push(`${c.id}: ${c.route} has no PAGE_META entry, so it is not prerendered and will 404`); continue; }
  for (const word of c.title) {
    if (!meta.title.toLowerCase().includes(word)) problems.push(`${c.id}: title of ${c.route} no longer contains "${word}"`);
  }
}
const routes = CLUSTERS.filter((c) => c.route).map((c) => c.route);
for (const r of new Set(routes)) {
  if (routes.filter((x) => x === r).length > 1) problems.push(`${r} is the target of more than one cluster`);
}
const seen = new Map();
for (const p of SERVICE_PAGES) {
  if (seen.has(p.h1)) problems.push(`"${p.h1}" is the h1 of both /${seen.get(p.h1)} and /${p.slug}`);
  seen.set(p.h1, p.slug);
  if (!PAGE_META[`/${p.slug}`]) problems.push(`/${p.slug} is in SERVICE_PAGES but not PAGE_META`);
}
const titles = new Map();
for (const [route, m] of Object.entries(PAGE_META)) {
  if (titles.has(m.title)) problems.push(`${route} and ${titles.get(m.title)} share the title "${m.title}"`);
  titles.set(m.title, route);
  const n = m.description.length;
  if (n < 110 || n > 160) problems.push(`${route} description is ${n} characters (budget 110 to 160)`);
}

console.log(problems.length ? `\n${problems.length} problem(s):\n  ${problems.join("\n  ")}\n` : "\nMap and site agree: no problems.\n");
process.exit(problems.length ? 1 : 0);
