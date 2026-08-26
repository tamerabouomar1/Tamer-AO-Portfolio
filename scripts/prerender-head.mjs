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
/* Also pulls tag, highlights, bestFor and stack, because the 42 template
   pages cannot server-render (React.lazy) and were shipping ~54 characters of
   text each. Forty-two near-empty URLs in a sitemap is a thin-content
   footprint, and thin pages drag on the pages that are not thin. Everything
   here is already written and already true; it just was not in the HTML. */
/* One entry per template, parsed field by field rather than with a single
   ordered pattern.
 *
 * The previous version was one regex demanding slug, name, kicker, tag, desc,
 * highlights, bestFor and stack in that exact order within a character budget.
 * It matched 36 of the 42 and silently dropped the rest — no error, just six
 * pages with no title, no description and no content. Splitting on the object
 * boundary and reading each field on its own means a template with an unusual
 * field order, or one missing an optional field, still gets everything it has.
 */
const templates = dataSrc
  .split(/\n\s{2}\{\n/)                     // each object literal in the arrays
  .map((chunk) => {
    const one = (re) => (chunk.match(re) || [, ""])[1];
    const slug = one(/\bslug:\s*"([^"]+)"/);
    if (!slug) return null;
    return {
      slug,
      name: one(/\bname:\s*"([^"]+)"/) || slug,
      kicker: one(/\bkicker:\s*"([^"]+)"/),
      tag: one(/\btag:\s*"([^"]+)"/),
      desc: one(/\bdesc:\s*"([^"]+)"/),
      bestFor: one(/\bbestFor:\s*"([^"]+)"/),
      stack: one(/\bstack:\s*"([^"]+)"/),
      highlights: [...(one(/\bhighlights:\s*\[([^\]]*)\]/) || "").matchAll(/"([^"]+)"/g)]
        .map((m) => m[1]),
    };
  })
  .filter((t) => t && t.desc);   // service pages have a slug but no desc

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
    template: t,
  });
}

/* ---- head rewriting ---- */
const esc = (s) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

function render(route) {
  const url = SITE + route.path;
  let h = shell;
  const set = (re, out) => { h = h.replace(re, out); };

  /* /fitness is the site's one light page (see :root[data-theme="fit"] in
     index.css). Stamping the attribute here means a cold load paints white
     immediately instead of flashing the dark shell before React mounts. */
  if (route.path === "/fitness") set(/<html lang="en">/, '<html lang="en" data-theme="fit">');

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

  /* Template previews. They load through React.lazy, which renderToString
     cannot resolve, so there is no component markup to put here — but the
     template's own data is right there in siteData and describes it perfectly
     well. Written into #root rather than <noscript> because React replaces
     the container wholesale on mount, so a visitor never sees it and a
     crawler always does. */
  if (route.template) {
    const t = route.template;
    const block =
      `<article data-prerender>` +
      `<h1>${esc(t.name)} — ${esc(t.kicker)} Website Template</h1>` +
      `<p>${esc(t.desc)}</p>` +
      `<p>A free, production-ready ${esc(t.tag.toLowerCase())} template. ` +
      `Open the live preview, and if it fits, take the whole React source: it is yours ` +
      `for personal and client work at no cost.</p>` +
      `<h2>What it includes</h2><ul>${t.highlights.map((x) => `<li>${esc(x)}</li>`).join("")}</ul>` +
      `<p><strong>Best for:</strong> ${esc(t.bestFor)}</p>` +
      `<p><strong>Built with:</strong> ${esc(t.stack)}</p>` +
      `<p>Part of a gallery of finished website templates by Tamer Abou Omar, a graphic ` +
      `and web designer in Beirut, Lebanon. ` +
      `<a href="${SITE}/websites">See the whole gallery</a> · ` +
      `<a href="${SITE}/website-design-lebanon">Website design in Lebanon</a></p>` +
      `</article>`;
    return h.replace('<div id="root"></div>', `<div id="root">${block}</div>`);
  }

  // Last resort, if a route is neither renderable nor a template.
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
