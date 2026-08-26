import { PROJECT_GROUPS, WEBSITES, SOCIAL_POSTS } from "../siteData";

/* Warm the images the CURRENT page is about to show. Nothing else.
 *
 * This used to warm the whole library on every route: 286 project photos plus
 * every website screenshot and social post, roughly 19MB over 141 requests,
 * started on any page. Opening /websites pulled uni-type-3.jpg at half a
 * megabyte, a university typography project that appears nowhere on that page
 * and never will.
 *
 * It had a gate meant to skip that on slow connections — and the gate is the
 * part that really hurt. It reads navigator.connection, which does not exist
 * in Safari at all, and treated "no signal" as "go ahead". So every iPhone
 * visitor got the full 19MB, which is most of the traffic arriving from an
 * Instagram link.
 *
 * The deep warm is gone rather than fixed. It existed so page switches felt
 * instant, which is a real benefit — but it is a benefit paid for entirely by
 * the first visit, and a first-time visitor who leaves before the page settles
 * never collects it. With the images now WebP and correctly sized, fetching a
 * page's own thumbnails on arrival is fast enough that the trade is not close.
 */

/** Just the images a given route actually puts on screen. */
export function imagesForRoute(pathname) {
  const urls = [];

  if (pathname === "/" || pathname.startsWith("/projects")) {
    for (const group of PROJECT_GROUPS) {
      for (const item of group.items) {
        const first = item.docs ? item.docs[0]?.images : item.images;
        // COVER ONLY. The hover reel's other frames are not rendered at all
        // until the card is armed — CardPreview returns null for them — so
        // warming them on arrival downloaded a slideshow for every project on
        // the page in case somebody hovered one of them. That alone was most
        // of a 7.6MB /projects load.
        if (first?.[0]) urls.push(first[0]);
      }
    }
  }

  if (pathname.startsWith("/websites")) {
    // Grid thumbnails only. `full` is the full-page screenshot behind the
    // lightbox, which nobody has asked for yet at this point.
    for (const w of WEBSITES) if (w.image) urls.push(w.image);
  }

  if (pathname.startsWith("/media")) {
    urls.push(...SOCIAL_POSTS.images.slice(0, 12));
  }

  return [...new Set(urls)];
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

/** Load a few at a time so the network is never saturated. */
async function warmAll(urls, concurrency = 4) {
  let i = 0;
  await Promise.all(
    Array.from({ length: concurrency }, async () => {
      while (i < urls.length) await warm(urls[i++]);
    })
  );
}

/* Respect an explicit "I am paying for this data" signal where the browser
   gives one. Absence is NOT treated as permission any more — Safari never
   sets it, and the previous code read that silence as a yes. */
function saveDataOn() {
  return navigator.connection?.saveData === true;
}

const done = new Set();

/** Warm the images for `pathname`, once per route, after the page settles. */
export function preloadRouteImages(pathname) {
  if (typeof window === "undefined" || done.has(pathname) || saveDataOn()) return;
  done.add(pathname);

  const urls = imagesForRoute(pathname);
  if (!urls.length) return;

  const run = () => warmAll(urls);
  if ("requestIdleCallback" in window) window.requestIdleCallback(run, { timeout: 2000 });
  else setTimeout(run, 800);
}
