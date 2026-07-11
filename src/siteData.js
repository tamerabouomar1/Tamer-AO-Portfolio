// Central place for content reused across pages.

export const CONTACT = {
  email: "tamerabouomar1@gmail.com",
  phone: "+961 70477595",
  phoneHref: "tel:+96170477595",
  // Real Calendly link — a free 30-minute discovery call (Zoom).
  calendly: "https://calendly.com/tamer_ao/30min",
  instagram: "https://www.instagram.com/tamer_ao/",
  // TODO: this is the generic LinkedIn feed, not a public profile.
  // Replace with your profile URL e.g. https://www.linkedin.com/in/your-name
  linkedin: "https://www.linkedin.com/feed/",
};

// Pre-filled "send a message" email for anything outside the packages
// (logos, motion, apparel, web — any digital thing).
export const MESSAGE_MAILTO =
  "mailto:tamerabouomar1@gmail.com?subject=Message%20for%20Tamer&body=Hi%20Tamer%2C%0A%0AI%20have%20something%20in%20mind%3A%20%0A%0A";

// ── Work With Me ──────────────────────────────────────────────
// Social-media management packages. Prices are in USD and fully
// customizable — edit freely. `featured` highlights the popular tier.
export const SOCIAL_PACKAGES = [
  {
    name: "Starter",
    tagline: "A consistent, on-brand feed",
    price: "$250",
    period: "/ month",
    cta: "Book a meeting",
    features: [
      "6 custom social posts / month",
      "1 platform (Instagram or Facebook)",
      "Monthly content calendar",
    ],
  },
  {
    name: "Growth",
    tagline: "Post more, move faster, stand out",
    price: "$450",
    period: "/ month",
    featured: true,
    cta: "Book a meeting",
    features: [
      "12 custom posts + story sets / month",
      "Up to 2 platforms",
      "Content calendar + captions",
      "1 animated / motion post per month",
    ],
  },
  {
    name: "Premium",
    tagline: "Your full-service design partner",
    price: "$750",
    period: "/ month",
    cta: "Book a meeting",
    features: [
      "20 posts, stories & reels / month",
      "Up to 3 platforms",
      "Content strategy + monthly report",
      "Priority turnaround",
    ],
  },
];

// One-off / custom work beyond the monthly packages.
export const EXTRA_SERVICES = [
  {
    name: "Logo & brand identity",
    desc: "A complete identity — logo, colours, type and the rules that hold it together.",
  },
  {
    name: "Logo motion",
    desc: "Bring your mark to life with a clean animated intro or logo sting.",
  },
  {
    name: "Apparel & print",
    desc: "Rashguards, fight kits, tees and print-ready artwork (OKIRO, 10th Planet).",
  },
  {
    name: "Any digital design",
    desc: "Websites, decks, posters, packaging — if it's digital, I can design it.",
  },
];

export const VIDEO_SRC =
  "https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260328_105406_16f4600d-7a92-4292-b96e-b19156c7830a.mp4";

// helper: ordered carousel array of N optimized images for a project slug
const imgs = (slug, n) =>
  Array.from({ length: n }, (_, i) => `/assets/projects/${slug}-${i + 1}.jpg`);
const pick = (...names) => names.map((n) => `/assets/projects/${n}.jpg`);

// Projects — each distinct DESIGN is its own card; clicking opens a popup carousel.
export const PROJECT_GROUPS = [
  {
    title: "Profiles",
    items: [
      {
        name: "Charbel Farah Portfolio",
        tag: "Athlete profile",
        images: imgs("charbel", 14),
        desc: "A 14-page athlete portfolio for boxer Charbel Farah, with editorial layouts, bold typography and a fight-ready identity built under The Gulf Heritage.",
      },
      {
        name: "Contracts Design Company Profile",
        tag: "Corporate",
        images: imgs("contracts", 5),
        desc: "A company profile and logo system for Contracts Design, with clean, confident corporate layouts across the cover, services and team.",
      },
      {
        name: "BioGarden",
        tag: "Company profile",
        images: imgs("biogarden", 4),
        desc: "A company profile and product catalogue for BioGarden, a natural, organic food brand.",
      },
      {
        name: "FabricAid",
        tag: "Profile & pledge",
        docs: [
          {
            label: "Company Profile",
            images: imgs("fabricaid", 8),
            desc: "A company profile for FabricAid, the social enterprise working on clothing waste and accessibility. The layout carries their mission, programs and reach in a clear, impact-driven tone.",
          },
          {
            label: "Sustainability Pledge",
            images: imgs("pledge", 6),
            desc: "The Textile Sustainability Pledge for FabricAid, a brochure that brings brands and partners together around responsible, circular textile practices.",
          },
        ],
      },
    ],
  },
  {
    title: "Branding",
    items: [
      {
        name: "KARV Pilates Studio",
        tag: "Logo & identity",
        images: imgs("karv", 4),
        desc: "A logo and brand identity for KARV Pilates Studio. The mark is elegant and minimal, with a calm, premium boutique feel.",
      },
      {
        name: "Contracts Design",
        tag: "Logo",
        images: pick("contracts-5"),
        desc: "The Contracts Design logo: a refined CD monogram in serif type, built for an engineering design firm.",
      },
      {
        name: "Playwear Club",
        tag: "Logo & identity",
        images: imgs("playwear", 5),
        desc: "Logo and identity for Playwear Club, a playful kids' clothing brand: the logo lockups, the mascot, and the Patch Bar patterns.",
      },
      {
        name: "MoCars / MoTrouble",
        tag: "Logo, motion & poster",
        images: pick("mocars-2", "mocars-1", "mocars-3"),
        desc: "Branding for MoCars and MoTrouble. It includes a yellow Super Veloce Jota 'Trouble' poster, the logo and its motion treatment, and a matching MO grappling kit. The result is a sharp automotive brand built for speed and attitude.",
      },
      {
        name: "Qasr Al Hyatt",
        tag: "Hospitality brand",
        images: imgs("qasr", 1),
        desc: "Brand and collateral design for Qasr Al Hyatt, a refined, luxury hospitality identity.",
      },
    ],
  },
  {
    title: "Clothing",
    product: true, // product renders -> contain image + caption below
    items: [
      {
        name: "OKIRO God of War",
        tag: "Rashguard & shorts",
        images: pick("okiro-3", "okiro-5"),
        desc: "The OKIRO 'God of War' set: a red and black grappling rashguard with matching fight shorts, finished with Ω branding and a thorn motif.",
      },
      {
        name: "OKIRO Jiu-Jitsu Girl",
        tag: "Rashguard & shorts",
        images: pick("okiro-4", "okiro-2"),
        desc: "The OKIRO 'Jiu-Jitsu Girl' set: a women's floral rashguard with matching grappling shorts in pink, white and magenta over matte black.",
      },
      {
        name: "OKIRO Wanted",
        tag: "Rashguard & shorts",
        images: pick("okiro-1", "okiro-6"),
        desc: "The OKIRO 'Wanted: Dead or Alive' set: a grappler's wanted-poster rashguard with matching fight shorts.",
      },
      {
        name: "OKIRO × Gripline",
        tag: "Collab kit",
        images: imgs("oxg", 3),
        desc: "A collaboration between OKIRO and Gripline: a co-branded No-Gi capsule kit.",
      },
      {
        name: "10th Planet Apparel",
        tag: "Rashguards & shorts",
        images: imgs("tenp-app", 3),
        desc: "Apparel for 10th Planet Jiu Jitsu Beirut: three competition sets of rashguards and fight shorts in white, camo and black.",
      },
      {
        name: "PGC / PLAY",
        tag: "Apparel",
        images: imgs("pgc", 12),
        desc: "PGC and PLAY streetwear: a run of tee designs and mockups.",
      },
    ],
  },
  {
    title: "Packaging & Retail",
    product: true, // light artwork reads better with the caption below
    items: [
      {
        name: "BioGarden Labels",
        tag: "Packaging",
        images: imgs("bg-label", 5),
        desc: "Product label design for BioGarden's natural food range, shown on the shelf line-up and in flat layouts for coconut butter, coconut oil, green olives and black olives, each with full bilingual nutrition panels.",
      },
      {
        name: "BioGarden Posters",
        tag: "Print",
        images: imgs("bg-poster", 2),
        desc: "A3 poster design for BioGarden: the 'From Nature To You' product poster and a photographic tapenade flatlay.",
      },
      {
        name: "BioGarden Shelf Talkers",
        tag: "Retail",
        images: imgs("bg-st", 3),
        desc: "A photographic shelf-talker series for BioGarden's in-store displays, covering tomato juice, tahini and tomato paste.",
      },
    ],
  },
  {
    title: "Other",
    product: true, // light document artwork reads better with the caption below
    items: [
      {
        name: "Environmental",
        tag: "Awareness campaign",
        images: imgs("environmental", 2),
        desc: "An environmental awareness campaign, with flyer and certificate design.",
      },
      {
        name: "RFACE Brochure",
        tag: "Brochure",
        images: imgs("reface", 2),
        desc: "Brochure design built on a structured, photography-led layout system.",
      },
      {
        name: "Notebook Cover",
        tag: "Print",
        images: imgs("notebook", 1),
        desc: "Notebook cover design.",
      },
    ],
  },
];

// Social-media posts — shown on the Media page.
export const SOCIAL_POSTS = {
  name: "10th Planet Social Media",
  desc: "Social-media design for 10th Planet Jiu Jitsu Beirut, covering membership posts, event flyers, the US Embassy seminar and the weekly schedule.",
  images: imgs("tenp-soc", 6),
};

// Video edits — shown on the Media page.
export const VIDEO_EDITS = [
  {
    title: "Athletes Night at AUB",
    src: "/assets/motion/edit-athletes-night.mp4",
    desc: "Event edit from Athletes Night at AUB.",
  },
  {
    title: "Match Edit: Tamer vs Amir",
    src: "/assets/motion/edit-tamer-fight.mp4",
    desc: "Competition match edit.",
  },
];

// Websites — shown on the Media page.
export const WEBSITES = [
  {
    name: "Kitchen Garage",
    tag: "Website design",
    image: "/assets/projects/web-kg.jpg",
    full: "/assets/projects/web-kg-full.jpg",
    desc: "A full ordering site for Kitchen Garage in Aley: smash burgers, wings and loaded fries, with a menu, cart, accounts and every payment method.",
  },
  {
    name: "Snack Faysal",
    tag: "Website design",
    image: "/assets/projects/web-snack.jpg",
    full: "/assets/projects/web-snack-full.jpg",
    desc: "A Beirut manakish and fatayer institution. The site is warm and appetite-led, built around the menu and the brand's heritage.",
  },
  {
    name: "Saifi Barbershop",
    tag: "Website design",
    image: "/assets/projects/web-saifi.jpg",
    full: "/assets/projects/web-saifi-full.jpg",
    desc: "A premium 'precision cuts and premium style' identity in gold and black, with booking kept front and center.",
  },
  {
    name: "Sinar",
    tag: "Website design",
    image: "/assets/projects/web-sinar.jpg",
    full: "/assets/projects/web-sinar-full.jpg",
    desc: "A construction and interior fit-out company. The site is clean and architectural, positioning Sinar as a full solution partner.",
  },
];

// Weekly class schedule (Fitness page).
export const SCHEDULE = [
  { day: "MON", classes: ["S&C"] },
  { day: "TUE", classes: ["JIU-JITSU CSA"] },
  { day: "WED", classes: ["JIU-JITSU Yarz"] },
  { day: "THUR", classes: ["OPEN MAT", "S&C"] },
  { day: "FRI", classes: ["Private Classes"] },
  { day: "SAT", classes: ["JIU-JITSU Yarz", "JIU-JITSU CSA"] },
  { day: "SUN", classes: ["REST"] },
];
