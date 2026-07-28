import { lazy } from "react";

/* Every template is its own dynamic import, so Vite emits one chunk per
   template and NONE of them ship in the portfolio's main bundle. A visitor
   who never opens the store downloads none of this code.

   `loaders` is kept separate from `TEMPLATE_VIEWS` so the store can call a
   loader on hover to warm the chunk (and its CSS) before the click — by the
   time the preview route mounts the code is usually already parsed. */

const loaders = {
  jack: () => import("./jack/JackSite"),
  vex: () => import("./vex/VexSite"),
  toonhub: () => import("./toonhub/ToonhubSite"),
  oddy: () => import("./oddy/OddySite"),
};

export const TEMPLATE_VIEWS = Object.fromEntries(
  Object.entries(loaders).map(([slug, load]) => [slug, lazy(load)])
);

const warmed = new Set();

/** Fetch a template's chunk ahead of time. Safe to call repeatedly. */
export function prefetchTemplate(slug) {
  const load = loaders[slug];
  if (!load || warmed.has(slug)) return;
  warmed.add(slug);
  load().catch(() => warmed.delete(slug));
}
