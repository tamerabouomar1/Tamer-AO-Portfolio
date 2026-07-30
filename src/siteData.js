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

// ── Work With Me ──────────────────────────────────────────────
// Social-media management packages, built REELS-FIRST — short-form is
// what drives reach (Tamer's own reels pull 200K+ views/month), so
// every tier leads with reels. Prices in USD; `featured` = popular tier.
export const SOCIAL_PACKAGES = [
  {
    name: "Starter",
    tagline: "Get on reels, consistently",
    price: "$199",
    period: "/ month",
    save: "1st month $149",
    cta: "Book a meeting",
    features: [
      "4 custom reels / month",
      "4 feed posts / month",
      "1 platform (Instagram or TikTok)",
      "Hooks & captions written for you",
    ],
    bonus: "Free profile & bio refresh to start",
  },
  {
    name: "Growth",
    tagline: "Reels that actually reach",
    price: "$449",
    period: "/ month",
    featured: true,
    save: "Best value · reels-first",
    cta: "Book a meeting",
    features: [
      "10 custom reels / month",
      "8 feed posts + story sets",
      "Up to 2 platforms (Reels + TikTok)",
      "Trend & hook research",
      "Content calendar + captions",
    ],
    bonus: "Free monthly reach report + strategy call",
  },
  {
    name: "Premium",
    tagline: "Your full short-form studio",
    price: "$899",
    period: "/ month",
    save: "Built to go viral",
    cta: "Book a meeting",
    features: [
      "20 custom reels / month",
      "12 feed posts + story sets",
      "Up to 3 platforms",
      "Full reel & growth strategy + monthly report",
      "Priority editing & turnaround",
      "Monthly strategy meeting",
    ],
    bonus: "Free logo animation ($150 value)",
  },
];

// ── Social proof ──────────────────────────────────────────────
// Real brands Tamer has delivered work for — every one of these has a
// project in PROJECT_GROUPS or WEBSITES below. Only add a name here once
// the work is actually done and shippable.
export const CLIENTS = [
  "FabricAid",
  "BioGarden",
  "OKIRO",
  "10th Planet Jiu Jitsu",
  "KARV Pilates Studio",
  "Contracts Design",
  "Charbel Farah",
  "Kitchen Garage",
  "Snack Faysal",
  "Saifi Barbershop",
  "Sinar",
  "MoCars",
  "Playwear Club",
  "Qasr Al Hyatt",
];

// Client testimonials. INTENTIONALLY EMPTY: only add quotes people
// actually said, with their real name and role. The section hides itself
// while this is empty, so the site never shows a hollow "reviews" block.
// Shape: { quote, name, role, project }
export const TESTIMONIALS = [];

// ── Personal training (Fitness page) ─────────────────────────
// A per-session drop-in, a recurring monthly plan (featured, centre —
// the best value and the business's recurring revenue), and a flexible
// session pack for people who can't commit weekly.
export const PT_PACKAGES = [
  {
    name: "Single Session",
    tagline: "Try it, zero commitment",
    price: "$45",
    period: "/ session",
    cta: "Book a session",
    features: [
      "1-hour one-on-one training",
      "Technique & form focus",
      "Free fitness assessment",
    ],
  },
  {
    name: "Monthly Coaching",
    tagline: "Everything, every month",
    price: "$299",
    period: "/ month",
    featured: true,
    save: "Just $37 / session",
    cta: "Book a session",
    features: [
      "8 sessions (2× per week)",
      "Personalized training program",
      "Weekly progress check-ins",
      "Custom nutrition plan",
      "WhatsApp support anytime",
    ],
    bonus: "Free monthly progress tracking",
  },
  {
    name: "10-Session Pack",
    tagline: "Train on your schedule",
    price: "$399",
    period: "11 sessions",
    save: "1 session free",
    cta: "Book a session",
    features: [
      "Buy 10 sessions, get 1 free",
      "Personalized training program",
      "No weekly commitment",
      "Valid for 4 months",
    ],
    bonus: "Free nutrition guide",
  },
];

// One-off / custom work beyond the monthly packages, by category.
export const SERVICE_CATEGORIES = [
  {
    name: "Design & identities",
    desc: "Logos, full brand identities, logo motion, websites and decks. One design or a complete system, built to make your brand look like it means business.",
    chips: ["Logos", "Brand identity", "Logo motion", "Websites & decks"],
  },
  {
    name: "Clothing",
    desc: "Apparel designed for the real world and delivered print-ready: rashguards, fight kits and tees (OKIRO, 10th Planet).",
    chips: ["Rashguards", "Fight kits", "Tees", "Print-ready artwork"],
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
        images: imgs("contracts", 14),
        desc: "A company profile and logo system for Contracts Design, with clean, confident corporate layouts across the cover, services and team.",
      },
      {
        name: "BioGarden",
        tag: "Company profile",
        images: imgs("biogarden", 20),
        desc: "The full twenty-page company profile for BioGarden, the natural food arm of Green Gardens Agro Industries. It runs from who they are, their vision and mission through why they stand out, their origin and their standards, then turns into a product catalogue: tomato base, olive base, extra virgin and infused olive oils, cold-pressed seed oils, pomegranate molasses, vinegars, tahini, thyme, floral waters and butter spreads.",
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
            label: "Company Profile (Arabic)",
            images: imgs("fabricaid-ar", 8),
            desc: "The Arabic edition of the FabricAid company profile: the full eight-page document rebuilt right-to-left, with the type, grid and photography reset around Arabic rather than poured into the English layout.",
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
        images: pick("contracts-logo"),
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
        images: [...imgs("environmental", 2), ...pick("notebook-1")],
        desc: "An environmental awareness campaign: the flyer, the certificate and the notebook cover that carried the same identity across print.",
      },
      {
        name: "RFACE Brochure",
        tag: "Brochure",
        images: imgs("reface", 1),
        desc: "Brochure design built on a structured, photography-led layout system.",
      },
    ],
  },
  {
    // Coursework from the AUB graphic design degree. Kept as its own group at
    // the end so it reads as academic work rather than sitting alongside paid
    // client projects.
    title: "University",
    items: [
      {
        // Publication project 3. Shown as reading SPREADS, not single pages:
        // the contents list and most features run across the gutter, so a
        // page-at-a-time carousel would cut every one of them in half.
        //
        // Tamer produced the whole issue. The source file's masthead spread
        // (pages 8-9) listed other names, so it is excluded here and the four
        // feature bylines were reset to his; see scratchpad/fix_madar.py.
        name: "MADAR Magazine",
        tag: "Publication · 56 pages",
        images: imgs("uni-madar", 28),
        desc: "MADAR, Issue #1: a fifty-six page bilingual magazine about the architecture of Beirut, laid out here as reading spreads. Five features carry it, from the old houses with soul through the Brutalists, layers of time, the future of Beirut and its resilient spaces, with English and Arabic sharing one grid rather than one language being poured into the other's layout.",
      },
      {
        // The two app projects this deck came out of (the Peaks and Charles
        // Hostler interfaces) were pulled from the site; the deck stands on its
        // own, so it carries the concept by itself now.
        name: "Peaks Pitch Deck",
        tag: "Business models · 18 slides",
        images: imgs("uni-pitch", 18),
        desc: "An eighteen-slide deck pitching Peaks, an app for the Mzaar slopes, as a business rather than a screen: the problem on the mountain, who it is for, how the app answers it, and the case for building it.",
      },
      {
        // Publication project 4, the final draft (43 single pages, from the
        // exports/ folder). Arabic reads right to left, so each spread puts the
        // LOWER page number on the RIGHT: pairs are given to the exporter as
        // 3-2, 5-4 and so on. Verified rather than assumed. Comparing the pixel
        // columns either side of the gutter, that arrangement scores 19.5 mean
        // edge difference against 44.8 for the left-to-right one, and the
        // full-bleed family photographs join up with no seam.
        name: "Letters to My Daughter",
        tag: "Publication · book design",
        images: imgs("uni-letters", 22),
        desc: "رسائل إلى ابنتي, a book designed around five letters from a mother to her daughter, read right to left as it was made to be. Charcoal drawing, family photographs that run full-bleed across the gutter, and type treated as the same material as the images: the text pulls apart, tilts and compacts into blocks as the letters go on, so a page carries its tone before it is read. Text by Najwa Sabbah; design and art direction by Tamer.",
      },
      {
        // Publication project 2, a 12-page saddle-stitched booklet: front and
        // back covers stand alone, the interior reads two-up.
        name: "Musical Night",
        tag: "Publication · programme",
        images: imgs("uni-musical", 7),
        desc: "The programme for Beit Kanafesh's first Musical Night, a twelve-page booklet in teal and white. Photography of the grounds runs against the mission, the programme schedule and the featured acts, with a leaf line drawing threading the whole thing together.",
      },
      {
        name: "Ossa Kbire",
        tag: "GD2 · brand identity",
        images: imgs("uni-ossa", 20),
        desc: "A complete black-and-white identity for Ossa Kbire, taken past the logo into everything it has to live on: the street sign, stationery, seal and envelopes, toilet signage cut from the same geometry, tote bags, bookmarks and a bookmark lamp, then the Facebook page, the Vagabond posters and the Instagram posts and stories.",
      },
      {
        name: "Blow Up",
        tag: "GD3 · poster series",
        images: imgs("uni-blowup", 8),
        desc: "Eight poster variations for Antonioni's Blow Up (1966), all on the same grainy park photograph. The image never changes; the typography does, and each version reads as a different film.",
      },
      {
        // The mats-and-ropes poster came out; the tik tik BOOM poster leads,
        // which is why the display image is the last of the original three.
        name: "Experimental Typography",
        tag: "Type 2 · poster series",
        images: pick("uni-type-3", "uni-type-2"),
        desc: "Two posters where the letterforms are made of the subject rather than set in it: hands and rubble for a tik tik BOOM countdown, and a heap of donated clothing built into a call for action.",
      },
      {
        name: "Ayn El Mrayseh",
        tag: "GD2 · Arabic logotype",
        images: imgs("uni-ayn", 7),
        desc: "An Arabic wordmark for the Beirut neighbourhood of Ayn El Mrayseh, drawn on a strict horizontal and vertical geometry so the letters read as built structure. The sheets follow it from first lockup to the final mark, past a photograph of the street it came from.",
      },
      {
        name: "Knafeh",
        tag: "GD2 · logo & identity",
        images: imgs("uni-knafeh", 6),
        desc: "A logo for a knafeh shop built from concentric rings, the tray seen from above. It works bilingually as كنافة and KNAFEH, and the sheets carry the variations and the sketch and photography work behind it.",
      },
      {
        name: "Illustration",
        tag: "Illustration · editorial & book",
        images: imgs("uni-illus", 3),
        desc: "Illustration work across a Dead Poets Society editorial piece, a children's book spread, and a bound collection of the term's drawing.",
      },
      {
        name: "Visual Theory",
        tag: "Publication",
        images: imgs("uni-vt", 5),
        desc: "A short publication produced for visual theory, where the argument and the typography are doing the same work.",
      },
      {
        name: "Packaging",
        tag: "Packaging · print artwork",
        images: imgs("uni-pack", 1),
        desc: "The final print sheet for L'Arôme, a rosemary-led bath and body range: shampoo, hair wax, sea essence, lotion bar and hair mask labels laid out together as they go to print, so the palette and type hold as one family across five different formats.",
      },
      {
        name: "Calendar",
        tag: "Type 2 · print",
        images: imgs("uni-cal", 1),
        desc: "A calendar built as a typographic exercise, where the grid of the year and the grid of the page are the same problem.",
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

// Live Instagram posts — embedded on the Media page.
//
// These are the real posts, pulled from Instagram at view time, so likes,
// views and captions stay current instead of going stale like an exported
// copy would. Nothing loads until the post scrolls near the viewport.
//
// TO ADD ONE: open the post on Instagram → Share → Copy link, and paste the
// plain URL below. Reels and feed posts both work; the /embed suffix is added
// automatically. Only public posts can embed.
//   { url: "https://www.instagram.com/reel/ABC123xyz/", caption: "..." }
//
// INTENTIONALLY EMPTY until real links are added — the section hides itself
// while this is empty rather than showing an empty shelf, the same way
// TESTIMONIALS does.
export const INSTAGRAM_POSTS = [];

// Video edits — shown on the Media page.
// NOTE ON SOURCES: the three "From Instagram" entries below were taken from
// ~/Desktop/Portfolio/videos portfolio intors/ — "Instagram Video from
// Snapinsta copy.mp4", "Comp 1.mp4" and "No audio 1.mp4" — because there was
// no way to pull the posts themselves. If any of these is the wrong clip, swap
// the file in public/assets/motion/ and keep the name.
//
// Live embeds are still the better option and the code is already in place:
// paste post links into INSTAGRAM_POSTS above and a Reels section appears with
// real view and like counts.
export const VIDEO_EDITS = [
  {
    title: "Reel: Short-form Edit",
    src: "/assets/motion/edit-instagram-1.mp4",
    desc: "A short-form edit made for Instagram, cut for the feed rather than the timeline.",
  },
  {
    title: "Reel: Motion Composite",
    src: "/assets/motion/edit-instagram-2.mp4",
    desc: "Motion and compositing work built for social, where the first second has to earn the next five.",
  },
  {
    title: "Reel: Silent Cut",
    src: "/assets/motion/edit-instagram-3.mp4",
    desc: "An edit built to read with the sound off, which is how most of the feed is actually watched.",
  },
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

// Client websites. `demo` points at a real, runnable copy of the site served
// from /public/demo — so the card can show it live and the lightbox can let
// people actually use it, instead of showing a flat screenshot. `image` is
// still the fast, static card art; the live copy only loads on hover.
export const WEBSITES = [
  {
    name: "FabricAID Uniforms",
    demo: "/demo/fabricaid/index.html",
    tag: "Website design",
    image: "/assets/projects/web-fabricaid.jpg",
    full: "/assets/projects/web-fabricaid.jpg",
    desc: "A seven-page site for FabricAID's uniform arm: workwear made in their own facility, with the social impact woven through rather than bolted on. Browse the range, the facility and the partner logos.",
  },
  {
    name: "Kitchen Garage",
    demo: "/demo/kitchen-garage/index.html",
    tag: "Website design",
    image: "/assets/projects/web-kg.jpg",
    full: "/assets/projects/web-kg-full.jpg",
    desc: "A full ordering site for Kitchen Garage in Aley: smash burgers, wings and loaded fries, with a menu, cart, accounts and every payment method.",
  },
  {
    name: "Snack Faysal",
    demo: "/demo/snack-faysal/index.html",
    tag: "Website design",
    image: "/assets/projects/web-snack.jpg",
    full: "/assets/projects/web-snack-full.jpg",
    desc: "A Beirut manakish and fatayer institution. The site is warm and appetite-led, built around the menu and the brand's heritage.",
  },
  {
    name: "Saifi Barbershop",
    demo: "/demo/saifi-barbershop/index.html",
    tag: "Website design",
    image: "/assets/projects/web-saifi.jpg",
    full: "/assets/projects/web-saifi-full.jpg",
    desc: "A premium 'precision cuts and premium style' identity in gold and black, with booking kept front and center.",
  },
  {
    name: "Sinar",
    demo: "/demo/sinar/index.html",
    tag: "Website design",
    image: "/assets/projects/web-sinar.jpg",
    full: "/assets/projects/web-sinar-full.jpg",
    desc: "A construction and interior fit-out company. The site is clean and architectural, positioning Sinar as a full solution partner.",
  },
];

// ── Website Store ─────────────────────────────────────────────
// Ready-made websites, FREE to download. Every template has a LIVE preview
// at /templates/:slug (its own lazy-loaded chunk — none of this code is in
// the portfolio's main bundle) and its source is handed over as a zip through
// the package modal. There is deliberately no per-template price any more:
// the source costs nothing to copy, so the money is in TEMPLATE_PACKAGES,
// which sells getting it live rather than getting the file.
//
// EDITING: features and copy are all here. `accent`/`bg`/`ink` drive the
// store card's zero-weight CSS mockup, so a new template needs no image.
// `media` is the animated preview, and it is ONLY fetched on hover/tap.
// Product names are styles, not invented people, and the demo copy carries
// Tamer's name rather than a fictional persona. The demo ARTWORK is the
// template's own — it shows what the layout does; a client's photos replace
// it under "Done For You".
//
// A new template needs: an entry here, a loader in templates/registry.js,
// and `npm run build:zips` to produce its downloadable source.
export const TEMPLATES = [
  {
    slug: "onyx",
    name: "Onyx",
    kicker: "Creator Portfolio",
    tag: "Portfolio",
    desc: "A full-length dark portfolio built around your work. Scroll-driven marquee, a magnetic hero portrait and project cards that stack as you scroll.",
    highlights: ["5 sections", "Scroll-linked marquee", "Sticky project stack", "Fully responsive"],
    bestFor: "Designers · Photographers · Studios",
    stack: "React · Framer Motion",
    accent: "#BBCCD7",
    bg: "#0C0C0C",
    ink: "#D7E2EA",
    media: "https://motionsites.ai/assets/hero-stellar-ai-v2-preview-DjvxjG3C.gif",
  },
  {
    slug: "vantage",
    name: "Vantage",
    kicker: "Venture Landing",
    tag: "Landing page",
    desc: "A cinematic single-screen landing page built on full-bleed video, liquid-glass UI and a headline that types itself in. Made to convert on the first screen.",
    highlights: ["Full-screen video hero", "Liquid-glass navbar", "Character entrance animation", "One screen, zero scroll"],
    bestFor: "Agencies · Startups · Consultants",
    stack: "React · CSS",
    accent: "#ffffff",
    bg: "#0a0a0a",
    ink: "#ffffff",
    video: "https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260403_050628_c4e32401-fab4-4a27-b7a8-6e9291cd5959.mp4",
  },
  {
    slug: "drop",
    name: "Drop",
    kicker: "Product Showcase",
    tag: "Product showcase",
    desc: "A colour-shifting product carousel where the whole page changes palette with the piece on screen. Built for collectibles, drops and character work.",
    highlights: ["Colour-morphing carousel", "Depth-blurred stage", "Grain overlay", "Touch + arrow controls"],
    bestFor: "Apparel · Product drops · Collections",
    stack: "React · CSS",
    accent: "#F4845F",
    bg: "#F4845F",
    ink: "#ffffff",
    media: "https://fifth-gentle-45902158.figma.site/_components/v2/4de492f6d9cf8244ad5293233e5c6f52407d42fc/1.02464a56.png",
  },
  {
    slug: "atelier",
    name: "Atelier",
    kicker: "Studio Site",
    tag: "Studio site",
    desc: "The complete studio site: hero, marquee, work carousel, pricing, project showcase and an interactive contact section. Everything a solo studio needs to sell.",
    highlights: ["10 sections", "Pricing + work carousel", "Auto-scrolling showcase", "Mouse-trail CTA"],
    bestFor: "Design studios · Freelancers · Consultants",
    stack: "React · CSS",
    accent: "#051A24",
    bg: "#ffffff",
    ink: "#051A24",
    media: "https://motionsites.ai/assets/hero-velorah-preview-CJNTtbpd.gif",
  },
  {
    slug: "ledger",
    name: "Ledger",
    kicker: "Fintech Landing",
    tag: "Landing page",
    desc: "A calm, credible one-screen landing page for regulated industries. Serif headline over a seamlessly looping video, with a glass panel anchored to the bottom edge.",
    highlights: ["Boomerang video loop", "Glass bottom panel", "Serif display type", "One screen, no scroll"],
    bestFor: "Fintech · SaaS · B2B",
    stack: "React · CSS",
    accent: "#191919",
    bg: "#ffffff",
    ink: "#191919",
  },
  {
    slug: "noir",
    name: "Noir",
    kicker: "Creative Hero",
    tag: "Landing page",
    desc: "One enormous italic word over a video that leans with your cursor, framed by floating liquid-glass chrome. Built to be remembered, not read.",
    highlights: ["Cursor parallax", "Boomerang video loop", "Liquid-glass nav", "Oversized display type"],
    bestFor: "Studios · AI tools · Portfolios",
    stack: "React · CSS",
    accent: "#ffffff",
    bg: "#000000",
    ink: "#ffffff",
  },
  {
    slug: "launch",
    name: "Launch",
    kicker: "Startup Hero",
    tag: "Landing page",
    desc: "The startup announcement page: glass nav, a credibility badge, an oversized serif promise and one call to action over full-bleed video.",
    highlights: ["Credibility badge", "Glass nav pill", "Full-bleed video", "Single clear CTA"],
    bestFor: "Startups · Launches · Waitlists",
    stack: "React · CSS",
    accent: "#1B133C",
    bg: "#ffffff",
    ink: "#1B133C",
  },
  {
    slug: "strata",
    name: "Strata",
    kicker: "Interactive Hero",
    tag: "Landing page",
    desc: "Two photographs stacked, with a soft spotlight that follows the cursor and reveals the second one through the first. People play with it before they read a word.",
    highlights: ["Cursor spotlight reveal", "Canvas-masked lighting", "Staggered blur entrance", "Glass pill nav"],
    bestFor: "Museums · Editorial · Tourism",
    stack: "React · Canvas",
    accent: "#e8702a",
    bg: "#000000",
    ink: "#ffffff",
  },
  {
    slug: "reel",
    name: "Reel",
    kicker: "Streaming Hero",
    tag: "Landing page",
    desc: "A cinema-poster hero: full-bleed video, ratings and runtime, and everything rising into place on a staggered blur. Blur instead of a dark scrim, so the footage keeps its colour.",
    highlights: ["Masked blur, no scrim", "Staggered blur entrance", "Liquid-glass controls", "Mobile menu built in"],
    bestFor: "Film · Events · Media",
    stack: "React · CSS",
    accent: "#ffffff",
    bg: "#000000",
    ink: "#ffffff",
  },
  {
    slug: "calm",
    name: "Calm",
    kicker: "Product Landing",
    tag: "Product site",
    desc: "A full three-section product page: video hero, a warm about band that overlaps it, and a features section where a sticky menu tracks whichever card you are reading.",
    highlights: ["3 full sections", "Scroll-tracking sticky menu", "Video feature cards", "Overlapping section edges"],
    bestFor: "Apps · SaaS · Product launches",
    stack: "React · CSS",
    accent: "#321C04",
    bg: "#F6E4CF",
    ink: "#321C04",
  },
];

// The three ways to get any template above.
//
// The source files are FREE. Copying a file costs nothing, so charging for it
// only stopped people from ever seeing how good the work is. What is actually
// scarce is getting it live, on brand, with real content, which is what the two
// paid tiers sell. `free` means no price at all; `flat` is a fixed price that
// no longer depends on which template; `from` means the tier is quoted.
export const TEMPLATE_PACKAGES = [
  {
    id: "source",
    name: "Source Files",
    tagline: "Yours to keep, free",
    free: true,
    // Downloading hands over the lead: the form asks for a name and a way to
    // reach them before the zip starts.
    gated: true,
    features: [
      "Full React source code",
      "Runs with two commands, no setup",
      "Free for personal and client work",
      "Deploy guide for Netlify, Vercel and Cloudflare",
    ],
    bonus: "No payment, no email course, no catch",
  },
  {
    id: "setup",
    name: "Done For You",
    tagline: "Live on your domain this week",
    flat: 200,
    featured: true,
    save: "Most popular",
    features: [
      "Everything in Source Files",
      "Your copy, photos & branding applied",
      "Deployed on your domain + SSL",
      "Contact form or booking hooked up",
      "1 round of revisions",
    ],
    bonus: "Free logo animation for your hero",
  },
  {
    id: "custom",
    name: "Custom Build",
    tagline: "Start here, go anywhere",
    from: 600,
    features: [
      "Template as the design starting point",
      "Redesigned around your brand",
      "Extra pages, shop or booking system",
      "Performance & SEO pass",
      "30 days of post-launch support",
    ],
    bonus: "Free 30-minute strategy call first",
  },
];

/** Where a template's free source zip lives. Built by npm run build:zips. */
export const templateZip = (slug) => `/downloads/${slug}-template.zip`;

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
