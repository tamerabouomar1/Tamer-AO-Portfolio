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
        desc: "A twenty-page company profile for BioGarden, the natural food arm of Green Gardens Agro Industries: who they are and what they stand for, then the full product catalogue.",
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
    // Work done for the town and for causes rather than for a fee.
    title: "Community Service",
    items: [
      {
        name: "Aley Run Club",
        tag: "Apparel & identity",
        images: imgs("arc", 7),
        desc: "Kit for Aley's run club: neon on black, English one side and Arabic the other. عاروسة الجبل is what Aley is called, يلا نركض سوا is the invitation.",
      },
      {
        name: "Environmental Campaign",
        tag: "Awareness campaign",
        images: [...imgs("environmental", 2), ...pick("notebook-1")],
        desc: "A flyer, a certificate and a notebook cover carrying one identity across print.",
      },
      {
        name: "RFACE Brochure",
        tag: "Brochure",
        images: imgs("reface", 1),
        desc: "A brochure built on a structured, photography-led layout.",
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
        desc: "رسائل إلى ابنتي — a book of five letters from a mother to her daughter, read right to left. Charcoal, family photographs across the gutter, and type treated as the same material as the images. Text by Najwa Sabbah, design by Tamer.",
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
        // The printed, filled and boxed range rather than the flat artwork.
        // A photograph of the real thing is the proof; the print sheet was not.
        name: "L'Arôme du Liban",
        tag: "Packaging · full range",
        images: imgs("uni-pack", 8),
        desc: "A bath and body range taken from label design to the shelf: hydrosol, musk, lotion bar, frankincense and shampoo, boxed in an engraved wooden case.",
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

// Instagram posts — the real reels from @tamer_ao, shown on the Media page.
//
// The video files are the posts themselves, downloaded from Instagram and
// served locally so they play inline instead of sitting behind an embed that
// needs a third-party script and a login. `url` points back at the real post.
//
// `views`, `likes` and `comments` are the counts Instagram shows on the post,
// read off @tamer_ao on 4 August 2026. They are typed in rather than fetched,
// because Instagram hands engagement counts only to a logged-in session — so
// refresh them by hand when a post keeps climbing. Any one left as `null`
// simply hides that chip, so a missing number never shows up as a zero.
export const INSTAGRAM_REELS = [
  {
    title: "Aura farm at the end of class",
    src: "/assets/motion/ig-aura.mp4",
    url: "https://www.instagram.com/tamer_ao/reel/DXENzRNCD_L/",
    caption: "+aura · #jiujitsu #wrestling",
    views: 180265,
    likes: 12914,
    comments: 23,
  },
  {
    title: "When rests are appreciated",
    src: "/assets/motion/ig-rests.mp4",
    url: "https://www.instagram.com/tamer_ao/reel/DYZO7X9OKBs/",
    caption: "when rests are appreciated · #jiujitsu #wrestling",
    views: 123694,
    likes: 8029,
    comments: 46,
  },
  {
    title: "Always healthy",
    src: "/assets/motion/ig-always-healthy.mp4",
    url: "https://www.instagram.com/tamer_ao/reel/DY4sc30ofku/",
    caption: "always healthy… · #jiujitsu #athlete #health",
    views: 2346,
    likes: 101,
    comments: 2,
  },
];

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
    desc: "A full-length dark portfolio built around your work.",
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
    desc: "A cinematic single-screen landing page on full-bleed video.",
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
    desc: "A carousel where the whole page changes palette with the piece on screen.",
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
    desc: "The complete studio site: ten sections, everything a solo studio needs.",
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
    desc: "A calm one-screen landing page for regulated industries.",
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
    desc: "One enormous italic word over a video that leans with your cursor.",
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
    desc: "The startup announcement page, over full-bleed video.",
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
    desc: "Two photographs stacked, revealed by a spotlight that follows the cursor.",
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
    desc: "A cinema-poster hero: full-bleed video, blur instead of a scrim.",
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
    desc: "A three-section product page with a sticky menu that tracks your reading.",
    highlights: ["3 full sections", "Scroll-tracking sticky menu", "Video feature cards", "Overlapping section edges"],
    bestFor: "Apps · SaaS · Product launches",
    stack: "React · CSS",
    accent: "#321C04",
    bg: "#F6E4CF",
    ink: "#321C04",
  },
  {
    slug: "atlas",
    name: "Atlas",
    kicker: "Travel Story",
    tag: "Scroll story",
    desc: "A cinematic scroll film in seven photographic layers.",
    highlights: ["Sticky scroll film", "Parallax on 7 layers", "Infinite sights carousel", "Pointer-drift depth"],
    bestFor: "Travel · Tourism boards · Editorial",
    stack: "React · CSS",
    accent: "#fdf1e1",
    bg: "#7fb4d4",
    ink: "#fdf1e1",
  },
  {
    slug: "halo",
    name: "Halo",
    kicker: "Waitlist Hero",
    tag: "Landing page",
    desc: "One dark screen built to collect emails, under liquid glass.",
    highlights: ["Seamless fading video loop", "Liquid-glass UI", "Email capture built in", "One screen, no scroll"],
    bestFor: "Waitlists · Newsletters · Launches",
    stack: "React · CSS",
    accent: "#ffffff",
    bg: "#000000",
    ink: "#ffffff",
  },
  {
    slug: "lumen",
    name: "Lumen",
    kicker: "Focus App",
    tag: "App landing",
    desc: "Four looping scenes the visitor switches between.",
    highlights: ["4 switchable video scenes", "Self-adjusting light/dark type", "Liquid-glass UI", "Full mobile menu"],
    bestFor: "Apps · Wellness · Products",
    stack: "React · CSS",
    accent: "#182C41",
    bg: "#000000",
    ink: "#ffffff",
  },
  {
    slug: "orbit",
    name: "Orbit",
    kicker: "Talent Marketplace",
    tag: "Marketplace",
    desc: "Four rings of specialists turning around a live counter.",
    highlights: ["Counter-rotating avatar orbits", "Typewriter headline", "Animated count-up", "Infinite logo ticker"],
    bestFor: "Marketplaces · Agencies · Hiring",
    stack: "React · CSS",
    accent: "#A068FF",
    bg: "#060218",
    ink: "#ffffff",
  },
  {
    slug: "quiet",
    name: "Quiet",
    kicker: "Product Landing",
    tag: "Product site",
    desc: "The app's own messages type themselves onto the phone in the footage.",
    highlights: ["Typing on-screen messages", "Glass pill navigation", "Serif display headline", "Soft entrance motion"],
    bestFor: "Apps · Journals · Slow products",
    stack: "React · CSS",
    accent: "#0871E7",
    bg: "#F3F4ED",
    ink: "#1a1a1a",
  },
  {
    slug: "frame",
    name: "Frame",
    kicker: "Agency Hero",
    tag: "Landing page",
    desc: "The background film is scrubbed by your mouse.",
    highlights: ["Mouse-scrubbed video", "Typewriter greeting", "Copy-to-clipboard contact", "Mobile overlay menu"],
    bestFor: "Agencies · Studios · Portfolios",
    stack: "React · CSS",
    accent: "#000000",
    bg: "#ffffff",
    ink: "#000000",
  },

  // ── Signature ───────────────────────────────────────────────
  // `tier: "signature"` splits these into their own paid section of the store
  // These four are built from full design systems rather than single-screen
  // briefs: multi-section pages, canvas-drawn signature visuals, and a token
  // set a buyer can extend rather than a layout they can only recolour. That
  // is what they are paying for, and it is why they are not in the free grid.
  //
  // The style references came from real companies. Names, copy and marks are
  // all changed — the SYSTEM is the reference, never the brand.
];

// ── Signature ───────────────────────────────────────────────
// `tier: "signature"` gives these their own section of the store. It is a
// CURATION, not a price tier — everything here is free like the rest. These
// are the ones carrying a real mechanic rather than a layout, which is the
// only thing the split is claiming.
//
// The references came from real sites. Names, copy and marks are all changed;
// the SYSTEM is the reference, never the brand.
const SIGNATURE = [
  {
    slug: "cinema",
    name: "Cinema",
    kicker: "AI Landing",
    desc: "The background film is scrubbed by your scroll instead of playing.",
    highlights: ["Scroll-scrubbed film", "Decoded frame cache", "Liquid-glass chrome", "Staggered reveals"],
    bestFor: "AI products · Agencies · Studios",
    stack: "React · Canvas",
    accent: "#ffffff",
    bg: "#0a0a0a",
    ink: "#ffffff",
  },
  {
    slug: "marquee",
    name: "Marquee",
    kicker: "Editorial Portfolio",
    desc: "A name at 26vh running forever behind a cut-out portrait.",
    highlights: ["Seamless infinite marquee", "Portrait over type", "Choreographed entrance", "Editorial cream palette"],
    bestFor: "Photographers · Creatives · Personal sites",
    stack: "React · CSS",
    accent: "#efeee9",
    bg: "#000000",
    ink: "#efeee9",
  },
  {
    slug: "pixel",
    name: "Pixel",
    kicker: "Designer Portfolio",
    desc: "One locked viewport, no scroll, a bitmap face against Inter.",
    highlights: ["Single locked viewport", "Bitmap + grotesk pairing", "Four-column meta grid", "Full-screen mobile menu"],
    bestFor: "Designers · Engineers · Studios",
    stack: "React · CSS",
    accent: "#ef4444",
    bg: "#000000",
    ink: "#ffffff",
  },
  {
    slug: "charter",
    name: "Charter",
    kicker: "Luxury Landing",
    desc: "Dark type on bright footage, with the headline lines overlapping.",
    highlights: ["Overlapping headline lockup", "Dark type on light video", "Glass mobile menu", "One clean screen"],
    bestFor: "Travel · Luxury · Concierge",
    stack: "React · CSS",
    accent: "#202A36",
    bg: "#f9fafb",
    ink: "#202A36",
  },
  {
    slug: "drift",
    name: "Drift",
    kicker: "Parallax Landing",
    desc: "Five planes moving at five speeds, so the page has distance in it.",
    highlights: ["Scroll-linked depth layers", "Drawn scene, zero images", "Art that drifts inside its frame", "Honours reduced-motion"],
    bestFor: "Travel · Outdoor · Editorial",
    stack: "React · CSS",
    accent: "#F2A65A",
    bg: "#070B18",
    ink: "#EDE7DF",
  },
  {
    slug: "lost",
    name: "Lost",
    kicker: "404 Page",
    desc: "A 404 worth landing on: full-strength video, nothing laid over it.",
    highlights: ["No overlay, ever", "Gradient-clipped numerals", "Mono display face", "One composition"],
    bestFor: "Any site · Error pages · Holding pages",
    stack: "React · CSS",
    accent: "#ffffff",
    bg: "#000000",
    ink: "#ffffff",
  },
].map((t) => ({ ...t, tag: "Landing page" }));

TEMPLATES.push(...SIGNATURE);


// ── Access ────────────────────────────────────────────────────
// Every template is free, including the Signature five. That is the whole
// offer: give the work away, and the person who took it knows who made it.
//
// So the money is not in the files, it is in the FLOW. Something new ships
// every week — a template or a typeface — and a membership is the only way to
// get it as it lands instead of coming back to hunt for it. That is a real
// recurring reason to pay, which a one-off "bundle of what already exists"
// never was. The fonts matter here: they are the half a template cannot be
// downloaded one at a time.
//
// $19 is under the line where a freelancer thinks about it, and against four
// new templates a month it is roughly $5 each. Yearly is priced at ten months
// so the saving is legible without a discount table.
export const TEMPLATE_PACKAGES = [
  {
    id: "source",
    name: "One Template",
    tagline: "Yours to keep, free",
    free: true,
    // Downloading hands over the lead: the form asks for a name and a way to
    // reach them before the zip starts.
    gated: true,
    period: "any template, no catch",
    features: [
      "Full React source code",
      "Runs with two commands, no setup",
      "Free for personal and client work",
      "Deploy guide for Netlify, Vercel and Cloudflare",
    ],
    bonus: "No payment, no card, no email course",
  },
  {
    id: "member",
    name: "Membership",
    tagline: "The whole library, templates and fonts",
    flat: 19,
    period: "per month, cancel any time",
    featured: true,
    save: "Something new every week",
    subscription: true,
    features: [
      "Every website template, in one download",
      "The full font library with them",
      "Something new every week, yours the day it ships",
      "Commercial licence for unlimited client work",
      "Cancel any time, keep everything you downloaded",
    ],
    bonus: "Free 30-minute call to pick the right one",
  },
  {
    id: "member-year",
    name: "Membership, yearly",
    tagline: "The same thing, two months free",
    flat: 190,
    period: "per year, billed once",
    save: "Save $38",
    subscription: true,
    features: [
      "Everything in the monthly membership",
      "Two months free against paying monthly",
      "Locked at this price while you stay",
    ],
    bonus: "First pick of what gets built next",
  },
];

// Delivery, not access. These are services and stay one-off.
export const SERVICE_PACKAGES = [
  {
    id: "setup",
    name: "Done For You",
    tagline: "Live on your domain this week",
    flat: 200,
    period: "flat, any template",
    featured: true,
    save: "Most popular",
    features: [
      "Any template, set up for you",
      "Your copy, photos and branding applied",
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
    period: "quoted per project",
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
