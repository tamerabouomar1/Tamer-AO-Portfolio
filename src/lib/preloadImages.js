import { PROJECT_GROUPS, WEBSITES, SOCIAL_POSTS } from "../siteData";

/**
 * Background image warming.
 *
 * Every project/website/post image is fetched into the browser cache once the
 * page is idle, so opening a popup or switching pages is instant instead of
 * waiting on a download. Quality is untouched — these are the same files the
 * UI uses, just requested early at low priority.
 */

// Ordered by how soon a visitor is likely to need them.
export function collectImageUrls() {
  const covers = [];
  const rest = [];

  for (const group of PROJECT_GROUPS) {
    for (const item of group.items) {
      const sets = item.docs ? item.docs.map((d) => d.images) : [item.images];
      sets.forEach((images, i) => {
        images.forEach((src, j) => {
          // first image of the first doc is the grid cover -> highest priority
          if (i === 0 && j === 0) covers.push(src);
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

  return [...new Set([...covers, ...rest])];
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
    const run = () => warmAll(collectImageUrls());
    if ("requestIdleCallback" in window) {
      window.requestIdleCallback(run, { timeout: 2500 });
    } else {
      setTimeout(run, 1200);
    }
  };

  if (document.readyState === "complete") start();
  else window.addEventListener("load", start, { once: true });
}
