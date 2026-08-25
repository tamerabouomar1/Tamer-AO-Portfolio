#!/usr/bin/env node
/* Package every store template as a standalone, runnable Vite + React project
   and drop the zips in public/downloads/.
 *
 * The templates live inside this app as bare components (`<Name>Site.jsx` plus
 * a stylesheet), which is not something someone can run. Each zip wraps one in
 * the smallest real project that boots it: an entry point, an index.html, a
 * package.json carrying only the dependencies that template actually imports,
 * and a README that gets them from unzip to a live domain.
 *
 * Run it with `npm run build:zips` after changing any template. The slug ->
 * folder map is read out of src/templates/registry.js rather than repeated
 * here, so adding a template to the store is enough to get it packaged.
 */

import { mkdirSync, readFileSync, writeFileSync, rmSync, existsSync, readdirSync } from "node:fs";
import { execFileSync } from "node:child_process";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const root = resolve(here, "..");
const TPL = join(root, "src/templates");
const OUT = join(root, "public/downloads");
const STAGE = join(root, ".zipstage");

/* ---- what to package ------------------------------------------------ */

// slug -> { folder, component }, straight out of the registry's import map.
function readRegistry() {
  const src = readFileSync(join(TPL, "registry.js"), "utf8");
  const map = {};
  const re = /(\w+):\s*\(\)\s*=>\s*import\("\.\/([\w-]+)\/(\w+)"\)/g;
  let m;
  while ((m = re.exec(src))) map[m[1]] = { folder: m[2], component: m[3] };
  return map;
}

// name + one-line description per slug, read out of siteData so the README and
// the package name match what the store advertises.
function readTemplateMeta() {
  const src = readFileSync(join(root, "src/siteData.js"), "utf8");
  const block = src.slice(src.indexOf("export const TEMPLATES"), src.indexOf("export const TEMPLATE_PACKAGES"));
  const meta = {};
  for (const chunk of block.split(/\n\s*\{\s*\n/).slice(1)) {
    const get = (k) => chunk.match(new RegExp(`${k}:\\s*"((?:[^"\\\\]|\\\\.)*)"`))?.[1];
    const slug = get("slug");
    if (slug) meta[slug] = { name: get("name"), kicker: get("kicker"), desc: get("desc"), stack: get("stack") };
  }
  return meta;
}

/* ---- the wrapper files ---------------------------------------------- */

const VERSIONS = {
  react: "^18.3.1",
  "react-dom": "^18.3.1",
  "framer-motion": "^11.5.4",
  "hls.js": "^1.6.17",
  vite: "^5.4.8",
  "@vitejs/plugin-react": "^4.3.2",
};

function packageJson(slug, deps) {
  return JSON.stringify(
    {
      name: `${slug}-template`,
      private: true,
      version: "1.0.0",
      type: "module",
      scripts: { dev: "vite", build: "vite build", preview: "vite preview" },
      dependencies: Object.fromEntries(deps.map((d) => [d, VERSIONS[d]])),
      devDependencies: {
        "@vitejs/plugin-react": VERSIONS["@vitejs/plugin-react"],
        vite: VERSIONS.vite,
      },
    },
    null,
    2
  ) + "\n";
}

const VITE_CONFIG = `import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
});
`;

function indexHtml(title) {
  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${title}</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.jsx"></script>
  </body>
</html>
`;
}

function mainJsx(component) {
  return `import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import ${component} from "./${component}";
import "./reset.css";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <${component} />
  </StrictMode>
);
`;
}

/* The template stylesheets assume the host page has already been normalised
   (they are written to drop into an app, not to be the whole document), so the
   zip ships the small reset they were built against. */
const RESET_CSS = `*,
*::before,
*::after { box-sizing: border-box; }

html,
body { margin: 0; padding: 0; }

body {
  -webkit-font-smoothing: antialiased;
  text-rendering: optimizeLegibility;
}

img,
video,
svg { display: block; max-width: 100%; }

button { font: inherit; color: inherit; }
`;

function readme(slug, meta, component, hasVideo) {
  const t = meta || {};
  return `# ${t.name || slug}${t.kicker ? ` — ${t.kicker}` : ""}

${t.desc || ""}

Yours to use, free. Designed and built by Tamer Abou Omar.
Portfolio: https://tamerabouomar.com

## Run it

You need [Node.js](https://nodejs.org) 18 or newer. In this folder:

\`\`\`bash
npm install
npm run dev
\`\`\`

That prints a local address (usually http://localhost:5173). Open it and you
have the site running. Edit \`src/${component}.jsx\` for the content and
\`src/${slug}.css\` for the look; the page reloads as you save.

## Put it online

\`\`\`bash
npm run build
\`\`\`

That writes a \`dist/\` folder of plain static files. Any host will serve it:

- **Netlify** — drag \`dist\` onto https://app.netlify.com/drop
- **Vercel** — \`npx vercel deploy --prod\`
- **Cloudflare** — \`npx wrangler pages deploy dist\`
- **Your own hosting** — upload the contents of \`dist\` to the web root

## Make it yours

1. **Words.** All the copy is in \`src/${component}.jsx\`. Change it in place.
2. **Colours and type.** Both live at the top of \`src/${slug}.css\` as custom
   properties, so one edit reaches the whole page. The webfont is loaded by
   \`useTemplateFont\` inside the component; point it at any Google Fonts URL.
3. **Media.** ${
    hasVideo
      ? "The demo video and images are hosted remotely and are placeholders. Drop your own into a `public/` folder and reference them as `/your-file.mp4`."
      : "The demo images are hosted remotely and are placeholders. Drop your own into a `public/` folder and reference them as `/your-image.jpg`."
  }
   Replace them before going live: they are there to show the layout, and they
   are not licensed for your project.

## Want it done for you?

Send your copy, photos and brand and I will have it live on your domain, with
SSL and a working contact form, inside a week. WhatsApp +961 70477595 or email
tamerabouomar1@gmail.com.

## License

The template code is free to use for personal and commercial projects, and you
do not need to credit me. You may not resell or redistribute the template
itself. The placeholder photography, video and fonts belong to their own
owners and are not covered by this.
`;
}

/* ---- build ---------------------------------------------------------- */

const registry = readRegistry();
const meta = readTemplateMeta();

rmSync(STAGE, { recursive: true, force: true });
mkdirSync(OUT, { recursive: true });

const built = [];

for (const [slug, { folder, component }] of Object.entries(registry)) {
  const srcDir = join(TPL, folder);
  if (!existsSync(srcDir)) {
    console.warn(`! ${slug}: no folder ${folder}, skipped`);
    continue;
  }

  const dir = join(STAGE, slug);
  mkdirSync(join(dir, "src"), { recursive: true });

  // the component, with its shared-hook imports flattened to siblings
  let jsx = readFileSync(join(srcDir, `${component}.jsx`), "utf8");
  const needs = {
    useTemplateFont: jsx.includes('from "../useTemplateFont"'),
    useBoomerangVideo: jsx.includes('from "../useBoomerangVideo"'),
    useHlsVideo: jsx.includes('from "../useHlsVideo"'),
  };
  jsx = jsx.replace(
    /from "\.\.\/(useTemplateFont|useBoomerangVideo|useHlsVideo)"/g,
    'from "./$1"'
  );
  // css sits next to it either way, so only the folder prefix has to go
  jsx = jsx.replace(/from "\.\/([\w-]+\.css)"/g, 'from "./$1"');
  writeFileSync(join(dir, "src", `${component}.jsx`), jsx);

  // Its stylesheet, plus anything else sitting in the folder (extra css, the
  // token layer). The Tailwind theme and the DTCG json are reference material
  // rather than source — nothing imports them — so they go to their own folder
  // at the root of the zip where a buyer will actually look for them.
  const cssName = `${folder}.css`;
  for (const f of readdirSync(srcDir)) {
    if (f === `${component}.jsx`) continue;
    const reference = f === "theme.css" || f === "tokens.json";
    if (reference) mkdirSync(join(dir, "design-tokens"), { recursive: true });
    writeFileSync(
      join(dir, reference ? "design-tokens" : "src", f),
      readFileSync(join(srcDir, f))
    );
  }

  for (const [hook, needed] of Object.entries(needs)) {
    if (needed) writeFileSync(join(dir, "src", `${hook}.js`), readFileSync(join(TPL, `${hook}.js`)));
  }

  const deps = ["react", "react-dom"];
  if (jsx.includes('from "framer-motion"')) deps.push("framer-motion");
  // useHlsVideo imports hls.js dynamically, so the string never appears in the
  // component itself — the hook being copied in is what makes it a dependency.
  if (needs.useHlsVideo) deps.push("hls.js");

  const title = meta[slug]?.name ? `${meta[slug].name} — ${meta[slug].kicker || "Website"}` : slug;
  writeFileSync(join(dir, "package.json"), packageJson(slug, deps));
  writeFileSync(join(dir, "vite.config.js"), VITE_CONFIG);
  writeFileSync(join(dir, "index.html"), indexHtml(title));
  writeFileSync(join(dir, "src", "main.jsx"), mainJsx(component));
  writeFileSync(join(dir, "src", "reset.css"), RESET_CSS);
  writeFileSync(
    join(dir, "README.md"),
    readme(cssName.replace(/\.css$/, ""), meta[slug], component, /<video|useBoomerangVideo/.test(jsx))
  );

  const zip = join(OUT, `${slug}-template.zip`);
  rmSync(zip, { force: true });
  // -r recurse, -q quiet, -X drop the mac resource forks
  execFileSync("zip", ["-rqX", zip, slug], { cwd: STAGE });
  built.push([slug, zip]);
}

rmSync(STAGE, { recursive: true, force: true });

for (const [slug, zip] of built) {
  const kb = Math.round(readFileSync(zip).length / 1024);
  console.log(`  ${slug.padEnd(9)} -> public/downloads/${slug}-template.zip  ${kb}KB`);
}
console.log(`${built.length} template zips written`);
