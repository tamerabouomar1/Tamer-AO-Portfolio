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
      "Brand identity, logos, logo motion and apparel design in Beirut. Work for OKIRO, 10th Planet Jiu Jitsu, FabricAID and Kitchen Garage, by Tamer Abou Omar.",
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
  "/websites": {
    title: "Website Design in Lebanon",
    description:
      "Websites designed, built and run for restaurants, salons, clinics and trades in Lebanon. See client sites, take a free template, or get booked out in 90 days.",
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
      "Your first hour of one-on-one coaching in Beirut is free, and you keep the plan. Strength, personal training and the 90-Day Self-Defense Program — every price in the open.",
  },
  // The search-intent pages. Titles here lead with the query the page is
  // built to answer, because the title is the headline of the search result.
  "/website-design-lebanon": {
    title: "Website Design in Lebanon",
    description:
      "Websites designed, built and run for businesses in Lebanon. The build is free, $199/month covers hosting, SEO and your Google profile. Real client sites, real prices.",
  },
  "/logo-design-beirut": {
    title: "Logo Design & Brand Identity in Beirut",
    description:
      "Logo design, brand identity, logo motion and apparel in Beirut. Start with a free recorded brand teardown: what is working, what is costing you, what to change first.",
  },
  "/restaurant-website-lebanon": {
    title: "Restaurant Websites in Lebanon",
    description:
      "Take orders on your own site instead of paying a delivery app a third of every one. Built already for Kitchen Garage, Snack Faysal and Rasif Aley. $199/month, build included.",
  },
  "/work-with-me": {
    title: "Design & Social Media Services",
    description:
      "Social-media management from $199/month, logo and brand identity design, and websites. Beirut-based, with a free 30-minute call and the first reel free.",
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
