import { PROJECT_GROUPS, WEBSITES, SOCIAL_POSTS } from "../siteData";
import { PREVIEW_MAX } from "../components/CardPreview";

/**
 * Background image warming.
 *
 * Project, website and post images are fetched into the browser cache once the
 * page is idle, so opening a popup or switching pages is instant instead of
 * waiting on a download. Quality is untouched — these are the same files the
 * UI uses, just requested early at low priority.
 *
 * Two tiers, because the library grew: the grid covers and the frames each
 * card actually cycles through are needed to render the Projects page itself,
 * while the deep pages of a 29-spread magazine are only needed if someone
 * opens it. The second tier is skipped on metered or slow connections rather
 * than spending someone's data on documents they may never look at.
 */

// Ordered by how soon a visitor is likely to need them.
export function collectImageUrls() {
  const covers = [];
  const preview = [];
  const rest = [];

  for (const group of PROJECT_GROUPS) {
    for (const item of group.items) {
      const sets = item.docs ? item.docs.map((d) => d.images) : [item.images];
      sets.forEach((images, i) => {
        images.forEach((src, j) => {
          // first image of the first doc is the grid cover -> highest priority
          if (i === 0 && j === 0) covers.push(src);
          // the rest of the card's visible reel comes next
          else if (i === 0 && j < PREVIEW_MAX) preview.push(src);
          else rest.push(src);
        });
      });
    }
  }

  for (const w of WEBSITES) {
    covers.push(w.image); // grid thumbnail
    rest.push(w.full); // full-page shot, only needed once opened
  }

  rest.push(...SOCIAL_POSTS.images);

  const needed = [...new Set([...covers, ...preview])];
  const deep = [...new Set(rest)].filter((src) => !needed.includes(src));
  return { needed, deep };
}

/** Don't pull the deep pages over a metered or slow connection. */
function wantsDeepWarming() {
  const c = navigator.connection;
  if (!c) return true; // no signal either way -> behave as before
  if (c.saveData) return false;
  return !["slow-2g", "2g", "3g"].includes(c.effectiveType);
}

/** Fetch one image; resolves either way so a 404 never stalls the queue. */
function warm(src) {
  return new Promise((resolve) => {
    const img = new Image();
    img.decoding = "async";
    if ("fetchPriority" in img) img.fetchPriority = "low";
    img.onload = img.onerror = () => resolve();
    img.src = src;
  });
}

/** Load `urls` a few at a time so the network is never saturated. */
async function warmAll(urls, concurrency = 4) {
  let i = 0;
  const workers = Array.from({ length: concurrency }, async () => {
    while (i < urls.length) {
      const src = urls[i++];
      await warm(src);
    }
  });
  await Promise.all(workers);
}

/**
 * Kick off warming after the page has loaded and the main thread is idle,
 * so it never competes with first paint. Safe to call more than once.
 */
let started = false;
export function preloadAllImages() {
  if (started || typeof window === "undefined") return;
  started = true;

  const start = () => {
    const run = async () => {
      const { needed, deep } = collectImageUrls();
      await warmAll(needed);
      if (wantsDeepWarming()) await warmAll(deep, 3);
    };
    if ("requestIdleCallback" in window) {
      window.requestIdleCallback(run, { timeout: 2500 });
    } else {
      setTimeout(run, 1200);
    }
  };

  if (document.readyState === "complete") start();
  else window.addEventListener("load", start, { once: true });
}
