/* Per-route static HTML for crawlers that do not run JavaScript.
 *
 * The app is a single-page React app: every URL is served the same
 * dist/index.html, so every URL also serves the HOME PAGE's title,
 * description and — the damaging one — <link rel="canonical" href="/">.
 * usePageMeta() corrects all of that at runtime, but only for crawlers that
 * execute JS. Google's renderer does; WhatsApp, Slack, most AI crawlers and
 * the second-wave-starved rest of the web do not. Fifty-one URLs therefore
 * announce themselves as duplicates of the home page.
 *
 * This writes dist/<route>/index.html for every route, identical to the shell
 * except for the head tags that identify the page. Cloudflare's asset handler
 * serves a real file in preference to the SPA fallback, so the crawler gets
 * the right head and the browser still boots the same app from the same
 * bundle. Nothing about the runtime changes.
 *
 * Runs after `vite build` — see the "build" script in package.json.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { pathToFileURL } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const DIST = path.join(ROOT, "dist");
const SITE = "https://tamerabouomar.com"; // SITE-URL
const SUFFIX = "Tamer AO";

/* The build-time renderer, from `vite build --ssr src/entry-server.jsx`.
   If that step has not run, fall back to head-only output rather than failing
   the build: a site with correct titles and no body text is a regression, a
   site that will not deploy is an outage. */
const SSR = path.join(ROOT, "dist-ssr/entry-server.js");
let render_ = null;
if (fs.existsSync(SSR)) {
  ({ render: render_ } = await import(pathToFileURL(SSR).href));
} else {
  console.warn("prerender-head: no dist-ssr build found, writing heads only");
}

const shell = fs.readFileSync(path.join(DIST, "index.html"), "utf8")
  // strip a block left by a previous run so re-running is idempotent
  .replace(/<noscript data-prerender>[\s\S]*?<\/noscript>\s*/g, "");

/* ---- routes from the app's own metadata, so this never drifts ---- */
const metaSrc = fs.readFileSync(path.join(ROOT, "src/lib/usePageMeta.js"), "utf8");
const block = metaSrc.slice(metaSrc.indexOf("export const PAGE_META = {") + "export const PAGE_META = ".length);
const PAGE_META = new Function("return " + block.slice(0, block.indexOf("\n};") + 2))();

const dataSrc = fs.readFileSync(path.join(ROOT, "src/siteData.js"), "utf8");
const templates = [...dataSrc.matchAll(
  /slug:\s*"([^"]+)"[\s\S]{0,400}?name:\s*"([^"]+)"[\s\S]{0,200}?kicker:\s*"([^"]+)"[\s\S]{0,400}?desc:\s*"([^"]+)"/g
)].map(([, slug, name, kicker, desc]) => ({ slug, name, kicker, desc }));

const routes = [];
for (const [p, m] of Object.entries(PAGE_META)) {
  if (p === "/") continue;                       // the shell already is the home page
  routes.push({ path: p, title: `${m.title} | ${SUFFIX}`, description: m.description, body: true });
}
routes.push({
  path: "/templates",
  title: `Free Website Templates | ${SUFFIX}`,
  // Deliberately uncounted, like the gallery itself: a number printed here
  // dates the moment it is written and has to be kept in step with a page
  // that no longer states one.
  description:
    "A gallery of finished website templates — portfolios, landing pages, product showcases and storefronts. Open any of them live, then take the full React source free.",
});
for (const t of templates) {
  routes.push({
    path: `/templates/${t.slug}`,
    title: `${t.name} — ${t.kicker} Website Template | ${SUFFIX}`,
    description: `${t.desc} A free, production-ready ${t.kicker.toLowerCase()} template by Tamer Abou Omar — preview it live, then take the source.`,
  });
}

/* ---- head rewriting ---- */
const esc = (s) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

function render(route) {
  const url = SITE + route.path;
  let h = shell;
  const set = (re, out) => { h = h.replace(re, out); };

  set(/<title>[\s\S]*?<\/title>/, `<title>${esc(route.title)}</title>`);
  set(/(<meta\s+name="description"\s+content=")[\s\S]*?(")/, `$1${esc(route.description)}$2`);
  set(/(<link\s+rel="canonical"\s+href=")[^"]*(")/, `$1${url}$2`);
  set(/(<meta\s+property="og:url"\s+content=")[^"]*(")/, `$1${url}$2`);
  set(/(<meta\s+property="og:title"\s+content=")[^"]*(")/, `$1${esc(route.title)}$2`);
  set(/(<meta\s+property="og:description"\s+content=")[\s\S]*?(")/, `$1${esc(route.description)}$2`);
  set(/(<meta\s+name="twitter:title"\s+content=")[^"]*(")/, `$1${esc(route.title)}$2`);
  set(/(<meta\s+name="twitter:description"\s+content=")[\s\S]*?(")/, `$1${esc(route.description)}$2`);

  // Breadcrumbs. Cheap, and it is what puts a readable path under the result
  // instead of the bare URL. The home page is its own root, so it gets none.
  if (route.path !== "/") {
    const crumbs = {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: SITE + "/" },
        { "@type": "ListItem", position: 2, name: route.title.split(" | ")[0], item: url },
      ],
    };
    h = h.replace("</head>",
      `  <script type="application/ld+json">${JSON.stringify(crumbs)}</script>\n  </head>`);
  }

  // The body. Where a real render is available the page ships its actual
  // markup, so a crawler that runs no JavaScript reads the same words a
  // visitor does. main.jsx mounts with createRoot and replaces all of it, so
  // nothing here has to match what React produces at runtime.
  if (route.body && render_) {
    try {
      return h.replace('<div id="root"></div>', `<div id="root">${render_(route.path)}</div>`);
    } catch (err) {
      console.warn(`prerender-head: ${route.path} did not render (${err.message}), using the stub`);
    }
  }

  // Fallback, and what the 42 template previews always get: they load through
  // React.lazy, which renderToString cannot resolve, so there is no markup to
  // put here. A short block beats an empty <div id="root">.
  const nos = `<noscript data-prerender><h1>${esc(route.title.split(" | ")[0])}</h1><p>${esc(route.description)}</p>` +
    `<p>Tamer Abou Omar — graphic designer and brand identity, Beirut, Lebanon. ` +
    `<a href="${SITE}/">Home</a> · <a href="${SITE}/projects">Projects</a> · ` +
    `<a href="${SITE}/websites">Websites</a> · ` +
    `<a href="${SITE}/media">Media</a> · <a href="${SITE}/about">About</a> · ` +
    `<a href="${SITE}/work-with-me">Services &amp; pricing</a></p></noscript>`;
  return h.replace('<div id="root"></div>', nos + '\n    <div id="root"></div>');
}

let n = 0;
for (const r of routes) {
  const dir = path.join(DIST, r.path.replace(/^\//, ""));
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(path.join(dir, "index.html"), render(r));
  n++;
}

// the home page keeps the shell's own head, and gains the same noscript body
fs.writeFileSync(path.join(DIST, "index.html"), render({
  path: "/",
  title: `${PAGE_META["/"].title} | ${SUFFIX}`,
  description: PAGE_META["/"].description,
  body: true,
}).replace(/(<link\s+rel="canonical"\s+href=")[^"]*(")/, `$1${SITE}/$2`)
  .replace(/(<meta\s+property="og:url"\s+content=")[^"]*(")/, `$1${SITE}/$2`));

console.log(`prerender-head: ${n} route pages + home (${templates.length} templates found)`);
