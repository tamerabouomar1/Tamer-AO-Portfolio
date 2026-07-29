import { lazy } from "react";

/* Every template is its own dynamic import, so Vite emits one chunk per
   template and NONE of them ship in the portfolio's main bundle. A visitor
   who never opens the store downloads none of this code.

   `loaders` is kept separate from `TEMPLATE_VIEWS` so the store can call a
   loader on hover to warm the chunk (and its CSS) before the click — by the
   time the preview route mounts the code is usually already parsed. */

/* Keys are the public slugs from TEMPLATES. The folder names are the original
   internal codenames and deliberately left alone — renaming them would churn
   every import and CSS prefix for no user-visible gain. */
const loaders = {
  onyx: () => import("./jack/JackSite"),
  vantage: () => import("./vex/VexSite"),
  drop: () => import("./toonhub/ToonhubSite"),
  atelier: () => import("./oddy/OddySite"),
  ledger: () => import("./ledger/LedgerSite"),
  noir: () => import("./noir/NoirSite"),
  launch: () => import("./launch/LaunchSite"),
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
