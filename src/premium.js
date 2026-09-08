/* Which templates the membership is for.
 *
 * This is its own module, not a field on each TEMPLATES entry and not a list
 * inside siteData.js, because the Cloudflare Worker has to answer the same
 * question at the edge before it will hand over a zip. Two copies of the list
 * would drift the first time a template moved tiers, and the failure is
 * silent in the worst direction: the store shows a lock, the file downloads
 * anyway. One 12-line module imports cleanly into both, and pulls none of
 * siteData.js's 120 kB into the worker bundle.
 *
 * The set is the animation-heavy work — everything built on Canvas, WebGL or
 * Framer Motion. It is the half that takes days rather than hours and the
 * half people point at, so it is the half worth $19. The other thirty stay
 * free and are what the gallery is for: nobody subscribes to a library they
 * have not already taken something from.
 */
export const PREMIUM_TEMPLATES = [
  "onyx", // React · Framer Motion
  "strata", // React · Canvas
  "aperture", // React · Canvas
  "signal", // React · Framer Motion · hls.js
  "mentality", // React · Framer Motion
  "refract", // React · SVG filters · Canvas
  "morph", // React · Canvas
  "nebula", // React · Canvas
  "prism", // React · Canvas
  "abyss", // React · Canvas
  "cinema", // React · Canvas
];

/** True if this template needs a membership to download. */
export const isPremium = (slug) => PREMIUM_TEMPLATES.includes(slug);

/* The cookie the worker sets once a membership code has been accepted, and
   reads on every premium download. httpOnly, so nothing on the page can read
   or forge it; the value is the member's own code, checked against KV on each
   request so that revoking a membership is a single key delete. */
export const MEMBER_COOKIE = "tao_member";
