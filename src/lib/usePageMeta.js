import { useEffect } from "react";

/* Gives each route its own <title> and description.
 *
 * Every page shipped the same title and the same description, because both
 * live in index.html and nothing ever changed them. To Google that reads as
 * seven near-duplicate pages, and to anyone with a few tabs open it reads as
 * seven identical tabs. Search results and shared links both use the title as
 * the headline, so it is worth being the page you are actually on.
 *
 * Canonical is updated alongside, so /projects does not claim to be the home
 * page. Open Graph tags are updated too: they only help for crawlers that run
 * JavaScript (which the Google and LinkedIn ones do, and WhatsApp does not),
 * but there is no cost to keeping them in step.
 */

const SITE = "https://portfolio.tamerao.workers.dev"; // SITE-URL
const SUFFIX = "Tamer AO";

/* One entry per route. Each description is written to be read in a search
   result: what the page holds and why to click it, not a keyword list. */
export const PAGE_META = {
  "/": {
    title: "Graphic Designer & Brand Identity, Beirut",
    description:
      "Brand identity, logos, logo motion and apparel design from Beirut. Selected work for OKIRO, 10th Planet Jiu Jitsu, FabricAID and more, by Tamer Abou Omar.",
  },
  "/projects": {
    title: "Projects, Branding, Packaging & Apparel",
    description:
      "Design work across brand identity, clothing, packaging and print: athlete profiles, rashguards and fight kits, retail packaging and university projects.",
  },
  "/websites": {
    title: "Websites & Templates",
    description:
      "Client websites plus 22 finished website templates. Take the source free, have it set up for you, or commission a custom build.",
  },
  "/media": {
    title: "Motion, Video Edits & Social",
    description:
      "Logo motion, video edits and social-media design, with the real Instagram posts and the view, like and comment counts they earned.",
  },
  "/about": {
    title: "About Tamer Abou Omar",
    description:
      "Graphic designer, martial-arts instructor and AUB student athlete in Beirut. Two athletic scholarships, seven years of working experience.",
  },
  "/fitness": {
    title: "Coaching & Personal Training",
    description:
      "Martial-arts instruction and personal training in Beirut. Class schedule, personal-training packages and nutrition-informed coaching.",
  },
  "/work-with-me": {
    title: "Services & Pricing",
    description:
      "Social-media management from $199/month, one-off design work, and a free 30-minute call. Reels-first packages built around short-form reach.",
  },
};

function setMeta(selector, attr, value) {
  const el = document.head.querySelector(selector);
  if (el) el.setAttribute(attr, value);
}

export default function usePageMeta(title, description, path) {
  useEffect(() => {
    // A null title means "this route manages its own head" — currently the
    // full-screen template previews. Touch nothing.
    if (!title) return;

    // The brand goes on the end so the useful half of the title survives
    // truncation in a narrow tab or a search result.
    document.title = `${title} | ${SUFFIX}`;

    if (description) {
      setMeta('meta[name="description"]', "content", description);
      setMeta('meta[property="og:description"]', "content", description);
      setMeta('meta[name="twitter:description"]', "content", description);
    }
    setMeta('meta[property="og:title"]', "content", document.title);
    setMeta('meta[name="twitter:title"]', "content", document.title);

    if (path) {
      const url = SITE + path;
      setMeta('link[rel="canonical"]', "href", url);
      setMeta('meta[property="og:url"]', "content", url);
    }
  }, [title, description, path]);
}
