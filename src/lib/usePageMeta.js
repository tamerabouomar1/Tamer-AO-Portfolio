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

const SITE = "https://tamerabouomar.com"; // SITE-URL
const SUFFIX = "Tamer AO";

/* One entry per route. Each description is written to be read in a search
   result: what the page holds and why to click it, not a keyword list. */
export const PAGE_META = {
  "/": {
    title: "Graphic Designer in Beirut, Lebanon",
    description:
      "Brand identity, logos, logo motion and apparel design in Beirut. Work for OKIRO, 10th Planet Jiu Jitsu, FabricAID and Combat Sports Academy, by Tamer Abou Omar.",
  },
  "/free": {
    title: "Free Website Templates, Brand Teardown & Reel",
    description:
      "Four things that cost nothing: a finished website in full source, a brand teardown, your first reel edited, or an hour of coaching. No card, no obligation.",
  },
  "/projects": {
    title: "Design & Branding Projects",
    description:
      "Design work across brand identity, clothing, packaging and print: athlete profiles, rashguards and fight kits, retail packaging and university projects.",
  },
  /* The store, and deliberately NOT titled "Website Design in Lebanon" any
     more. It used to carry that title and that h1, which are the title and h1
     of /website-design-lebanon, so the site's two strongest pages were
     competing for one query and Google was left to pick. This page's real job
     is the gallery: free templates, the membership, and the prices. That is a
     different search, with an audience far larger than Lebanon. */
  "/websites": {
    title: "Free Website Templates & Website Pricing",
    description:
      "A gallery of finished website templates, free in full React source. Plus what a built site costs: $350 for one page, $850 for a six-page build.",
  },
  "/media": {
    title: "Logo Motion & Video Editing",
    description:
      "Logo motion, video edits and social-media design, with the real Instagram posts and the view, like and comment counts they earned.",
  },
  "/about": {
    title: "About Tamer Abou Omar",
    description:
      "Graphic designer, martial-arts instructor and AUB student athlete in Beirut. Two athletic scholarships, seven years of working experience.",
  },
  "/fitness": {
    title: "Self-Defense Classes & Personal Training in Beirut",
    description:
      "Your first hour of one-on-one coaching in Beirut is free, and you keep the plan. Strength, personal training and the 90-Day Self-Defense Program.",
  },
  // The search-intent pages. Titles here lead with the query the page is
  // built to answer, because the title is the headline of the search result.
  "/website-design-lebanon": {
    title: "Website Design in Lebanon",
    description:
      "Websites designed, built and run for businesses in Lebanon. $850 for a six-page site, launched and found on Google, then care from $30 a month.",
  },
  "/logo-design-beirut": {
    title: "Logo Design & Brand Identity in Beirut",
    description:
      "Logo design, brand identity, logo motion and apparel in Beirut. Start with a free recorded brand teardown: what to change first, and why.",
  },
  "/restaurant-website-lebanon": {
    title: "Restaurant Websites in Lebanon",
    description:
      "Take orders on your own site instead of paying a delivery app a third of every one. Built already for Snack Faysal. $850, then from $30 a month.",
  },
  "/social-media-management-lebanon": {
    title: "Social Media Management in Lebanon",
    description:
      "Reels-first social media management from $199 a month: 8, 16 or 28 pieces, with hooks and captions written for you. Your first reel is cut free.",
  },
  "/salon-website-lebanon": {
    title: "Salon & Barbershop Websites in Lebanon",
    description:
      "Stop losing bookings in your DMs. A site where every screen books into your calendar, live already for Salon Nizar. $850 to build, care from $30 a month.",
  },
  "/google-business-profile-lebanon": {
    title: "Google Business Profile Setup in Lebanon",
    description:
      "The map listing sits above every website when someone nearby searches. Claimed, verified and set up properly for $250, live within 7 days or you don't pay.",
  },
  /* Retitled away from "Design & Social Media Services", which named the
     components rather than the outcome. The page now leads with the whole
     online presence, and the title has to agree with the h1. */
  "/work-with-me": {
    title: "Your Whole Online Presence",
    description:
      "Website, Google profile and content run as one thing: $950 to set up, $349 a month. Or buy the pieces on their own. Every price in the open, Beirut-based.",
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
