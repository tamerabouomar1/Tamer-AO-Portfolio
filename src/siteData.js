// Central place for content reused across pages.

// Shown under the name in the sidebar. One line: what he makes, and where.
export const PROFILE_TAGLINE = "Brand identity, logos and apparel. Beirut, Lebanon.";

// MERGE NOTE (2026-08-09): this file briefly carried TWO `export const
// FREE_OFFERS` arrays after a stash-pop — PR #27's and the local one landed
// in different places, so git never marked them as a conflict and the
// duplicate export would have failed the build with no marker to point at.
// PR #27's array (worth / lede / catch) was removed; the one kept lower down
// is what Free.jsx and FreeOffers.jsx actually read.

export const CONTACT = {
  email: "tamerabouomar1@gmail.com",
  phone: "+961 70477595",
  phoneHref: "tel:+96170477595",
  // Real Calendly link — a free 30-minute discovery call (Zoom).
  calendly: "https://calendly.com/tamer_ao/30min",
  instagram: "https://www.instagram.com/tamer_ao/",
  // TODO: this is the generic LinkedIn feed, not a public profile, so it drops
  // a visitor on their own LinkedIn homepage. The sidebar hides the icon while
  // it looks like this. Put the real profile URL here — the
  // https://www.linkedin.com/in/your-name form — and the icon returns.
  linkedin: "https://www.linkedin.com/feed/",
};

// ── Recurring billing ─────────────────────────────────────────
// One hosted checkout link per monthly plan. Deliberately provider-agnostic:
// these are plain URLs, so Dodo, Stripe, Lemon Squeezy, Paddle or a bank
// payment link all drop in here without a code change. Keys are plan ids from
// TEMPLATE_PACKAGES and WEBSITE_CARE_PLANS below.
//
// An empty string means "not live yet" — that plan's card keeps the existing
// "Talk it through" call and no Subscribe button renders. This is the point:
// a Subscribe button that 404s costs more trust than no button at all, so a
// plan only becomes self-serve once its link is real. Fill one in and that one
// card goes live on the next deploy; the others are unaffected.
export const SUBSCRIBE_LINKS = {
  member: "",
  "member-year": "",
  online: "",
  managed: "",
  complete: "",
};

/** The hosted checkout URL for a plan id, or "" while it isn't live yet. */
export const subscribeUrl = (id) => SUBSCRIBE_LINKS[id] || "";

// ── Paying from Lebanon ───────────────────────────────────────
// A card processor is not the way most of this gets paid. Whish and OMT are
// how money actually moves here, and a bank transfer covers everyone else, so
// the membership window offers those three rather than pretending a Stripe
// checkout exists.
//
// The flow is deliberately honest about what it is: pick a plan, pick a
// method, send the amount, then one tap opens WhatsApp with the plan and
// amount already written out. Access is opened by hand the same day. Nothing
// on this site takes a card number, and nothing should — see SECURITY.md.
//
// TAMER: `detail` is what a payer is told to send money to. Whish and OMT both
// run off the phone number, which is why they default to CONTACT.phone. Put
// the real NEO / bank account line in below before this ships, or that card
// tells someone to transfer money to a placeholder.
export const PAYMENT_METHODS = [
  {
    id: "whish",
    name: "Whish Money",
    blurb: "Send in the app, in USD or LBP.",
    detail: CONTACT.phone,
    detailLabel: "Whish number",
    note: "Open Whish, Send Money, enter the number, send the amount for your plan.",
  },
  {
    id: "omt",
    name: "OMT",
    blurb: "Any OMT branch, cash over the counter.",
    detail: CONTACT.phone,
    detailLabel: "Phone number",
    note: "Ask for a transfer to this number under the name Tamer Abou Omar, then keep the receipt.",
  },
  {
    id: "neo",
    name: "NEO / bank transfer",
    blurb: "Straight from your banking app.",
    detail: "",
    detailLabel: "Account",
    note: "Message me for the account details and I'll send them over, then transfer the amount for your plan.",
  },
];

// ── The free offers ───────────────────────────────────────────
// The site's front door, and the thing every page now points at.
//
// This follows the Stage 0 "Improvise" step of the $100M Scaling Roadmap:
// before charging for anything, give the work away, get people using it, and
// ask them what would make it better. Every service line here has a free way
// in, not just the websites — a line with no free entry has no way to start
// the conversation, so it never gets to the paid step at all.
//
// Two rules keep this honest:
//   1. Every offer is something Tamer can actually deliver, this week, at
//      close to zero marginal cost. Nothing here is a coupon or a "free
//      quote" dressed up as a gift.
//   2. `paid` is the real next step, named and priced. Stage 1 says to show
//      how the paid version beats the free one, which you cannot do if the
//      paid version is a mystery. Nobody is tricked into a ladder they can
//      see the whole of.
//
// `kind` drives the button: "download" opens the template modal, "form" opens
// the claim form, "call" goes straight to Calendly.
export const FREE_OFFERS = [
  {
    id: "templates",
    name: "A Finished Website",
    kicker: "Websites",
    // Deliberately uncounted. A number dates the moment it is printed and
    // invites the wrong question ("only that many?") instead of the right one
    // ("is one of them mine?"). The gallery answers that in one click.
    blurb:
      "A gallery of complete sites, built and running. Open any of them, and if it fits, the whole React source is yours.",
    proof: "Full source · commercial use · new ones every week",
    turnaround: "Instant download",
    kind: "download",
    to: "/websites#store",
    cta: "Open the gallery",
    paid: {
      label: "When you want it live without touching code",
      detail: "Set up for you from $350, live on your domain in a week.",
    },
  },
  {
    id: "teardown",
    name: "A Brand Teardown",
    kicker: "Design & Branding",
    blurb:
      "Send your logo, your Instagram or your site. You get back a short recorded critique: what is working, what is quietly costing you, and the three things I would change first.",
    proof: "Recorded video · yours to keep",
    turnaround: "Back within 3 days",
    kind: "form",
    cta: "Send yours in",
    paid: {
      label: "When you want the fixes made, not just named",
      detail: "Logo, full identity or a rebuild, quoted per project.",
    },
  },
  {
    id: "reel",
    name: "Your First Reel",
    kicker: "Social Media",
    blurb:
      "Send me your footage and I cut one reel: hook, captions, the lot. Post it, watch what it does, and decide about the rest afterwards.",
    proof: "My own reels: 855K+ views, best at 219K",
    turnaround: "Back within 5 days",
    kind: "form",
    cta: "Claim the reel",
    paid: {
      label: "When one reel a month is not enough",
      detail: "Reels-first management from $199/month.",
    },
  },
  {
    id: "session",
    name: "A Training Session",
    kicker: "Coaching",
    blurb:
      "One full hour, one-on-one, free. Movement screen, technique, and a plan you can run on your own whether or not you ever come back.",
    proof: "100+ students coached · 10+ years",
    turnaround: "Book any open slot",
    kind: "call",
    cta: "Book the session",
    paid: {
      label: "When you want the whole programme",
      detail: "Monthly coaching at $299, or a session pack.",
    },
  },
];

// ── Work With Me ──────────────────────────────────────────────
// Social-media management packages, built REELS-FIRST — short-form is
// what drives reach (Tamer's own reels have done 855K+ views), so
// every tier leads with reels. Prices in USD; `featured` = popular tier.
//
// Taglines state the OUTCOME the buyer is paying for rather than describing
// the deliverable, because "16 posts a month" is a cost and "you post every
// week without touching it" is a result. The deliverables are still there —
// they moved down into `features`, which is where a buyer checks the promise
// rather than where they decide.
//
// Each tier buys a FIXED NUMBER OF PIECES, not a fixed mix. Reels, carousels
// or story sets — the split is decided with the client on the kickoff call, so
// a brand that only wants reels gets only reels. Starter and Growth run one
// platform; only Premium goes up to three.
//
// `anchor` is the same volume bought one reel at a time at REEL_RATE. It is a
// real comparison — that is the price on the rate card below — which is the
// only kind of anchor worth printing.
export const REEL_RATE = 65;

export const SOCIAL_PACKAGES = [
  {
    name: "Starter",
    tagline: "Stop going quiet for three weeks at a time",
    price: "$199",
    period: "/ month",
    anchor: 520,
    anchorNote: `8 pieces at $${REEL_RATE} each`,
    cta: "Book a meeting",
    features: [
      "8 pieces of content / month",
      "Reels, carousels or story sets \u2014 your mix",
      "1 platform (Instagram or TikTok)",
      "Hooks & captions written for you",
    ],
    bonus: "Free profile & bio refresh to start",
  },
  {
    name: "Growth",
    tagline: "Get in front of people who've never heard of you",
    price: "$449",
    period: "/ month",
    featured: true,
    anchor: 1040,
    anchorNote: `16 pieces at $${REEL_RATE} each`,
    cta: "Book a meeting",
    features: [
      "16 pieces of content / month",
      "Reels, carousels or story sets \u2014 your mix",
      "1 platform, done properly",
      "Trend & hook research",
      "Content calendar + captions",
    ],
    bonus: "Free monthly reach report + strategy call",
  },
  {
    name: "Premium",
    tagline: "Hand the whole thing over and stop thinking about it",
    price: "$899",
    period: "/ month",
    anchor: 1820,
    anchorNote: `28 pieces at $${REEL_RATE} each`,
    cta: "Book a meeting",
    features: [
      "28 pieces of content / month",
      "Reels, carousels or story sets \u2014 your mix",
      "Up to 3 platforms",
      "Full content & growth strategy + monthly report",
      "Priority editing & turnaround",
      "Monthly strategy meeting",
    ],
    bonus: "Free logo animation ($150 value)",
  },
];

// Conditional guarantee on the social packages. Measurable, checkable, and
// paid in Tamer's own work rather than in refunded cash — which is what makes
// it safe to offer and worth more than "satisfaction guaranteed".
//
// TAMER: this only works if you screenshot the client's trailing-90-day
// average views at kickoff. Do that on day one or the promise has no baseline.
export const SOCIAL_GUARANTEE = {
  title: "Beat your own average in 60 days, or the third month is free",
  body: "On day one we screenshot your average reel views over the last 90 days. If what I make for you hasn't beaten that average within 60 days, you don't pay for the third month — I keep working through it.",
};

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
  "Salon Nizar",
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

// ── The flagship offer (Fitness page) ─────────────────────────
//
// Built on the $100M Offers method rather than as another price tier.
//
//   Value = (Dream Outcome × Perceived Likelihood) ÷ (Time Delay × Effort)
//
// So every field below is pulling on one of those four levers: `promise` is
// the dream outcome stated as a capability, `proof` raises the likelihood,
// `interval` collapses the time delay, and the guarantee removes the risk of
// trying. The tracks exist because the book's first chapter is about picking
// a starving crowd — a woman who feels unsafe walking to her car and a parent
// whose kid is being singled out are not the same buyer and must not be sold
// with the same sentence.
//
// NAMING follows MAGIC: Goal ("Walk Home Safe"), Interval (90-Day),
// Container ("Program"), Avatar per track.
//
// ON THE NUMBERS. `value` on each stack line is priced off Tamer's OWN rate
// card, not invented: 26 sessions × the $37/session members already pay = $962,
// and the nutrition plan and programming are what the $299 month charges for
// today. That is what makes the $2,254 total defensible if a client ever asks
// how it was reached — which is the only reason to print an anchor at all.
// The total is SUMMED from the lines below at render time rather than stored,
// so editing a line can never leave the headline figure quietly wrong.
//
// TAMER, CONFIRM BEFORE THIS GOES LIVE:
//   1. `seatsPerIntake` — the site says you cap it. Only true if you cap it.
//   2. The guarantee — you are promising free training until they pass. That
//      costs hours, not cash, but it is a real promise. Say so only if you
//      will honour it.
export const DEFENSE_PROGRAM = {
  name: "The 90-Day Self-Defense Program",
  kicker: "Three tracks · one coach · every session with me",
  promise:
    "In 90 days you will be able to break a grip, create distance and get yourself out — under pressure, against someone bigger than you, without freezing.",
  // Perceived likelihood of achievement: the reason to believe it.
  proof:
    "Blue Belt BJJ, 4th Degree Black Belt Taekwondo, 10+ years on the mats and 100+ students coached. I run every session myself — there is no assistant coach you get handed to.",
  price: 997,
  period: "one payment, 12 weeks of training",
  cta: "Claim a seat",

  // Why 90 days rather than "keep training forever": a deadline is the thing
  // that makes an outcome believable, and it collapses the time delay term in
  // the value equation.
  phases: [
    {
      weeks: "Weeks 1–4",
      title: "Don't be there",
      body: "Awareness, distance and de-escalation, plus the base conditioning to move at all. Most fights are won before they start.",
    },
    {
      weeks: "Weeks 5–8",
      title: "Break the grip",
      body: "The five holds people actually get caught in, and the escape from each. Drilled until it is reflex, not memory.",
    },
    {
      weeks: "Weeks 9–12",
      title: "Under pressure",
      body: "Live resistance, escalating each week, finishing with a filmed pressure test against someone bigger than you.",
    },
  ],

  tracks: [
    {
      id: "women",
      name: "Walk Home Safe",
      who: "For women",
      pain: "You change your route, hold your keys between your fingers, and stay on the phone until you're inside.",
      outcome:
        "You stop rehearsing what you'd do and start knowing. Grip breaks, distance, and getting away from someone who is stronger than you.",
      note: "Grown out of the Women Empowerment Program I run at Combat Sports Academy.",
    },
    {
      id: "teens",
      name: "Stand Tall",
      who: "For parents of teens",
      pain: "Your kid has gone quiet about school, and you don't know whether it's a phase or a person.",
      outcome:
        "Your kid stops reading as an easy target — posture, voice and eye contact first, hands only if it gets there. They come home able to tell you what happened.",
      note: "Grown out of the Kids & Teenagers Anti-Bullying Program I run at Combat Sports Academy.",
    },
    {
      id: "adults",
      name: "Handle Yourself",
      who: "For adults, no experience",
      pain: "You've never trained, you're not going to start competing, and you'd just rather not be helpless.",
      outcome:
        "You can control a situation without escalating it, and end it early if it does. Fit enough to still be standing at the end of it.",
      note: "The general track. Start here if neither of the other two is you.",
    },
  ],

  // Trim and stack. Everything a buyer gets, priced at what it costs on its
  // own, so the discrepancy between the stack and the price is visible.
  stack: [
    { item: "26 coached sessions over 12 weeks, 2× per week", value: 962 },
    { item: "A training program written around your body and your starting point", value: 150 },
    { item: "Custom nutrition plan, built on university nutrition science", value: 150 },
    { item: "Weekly progress check-ins and a filmed benchmark every 4 weeks", value: 88 },
    { item: "WhatsApp access to me for the full 90 days", value: 120 },
  ],

  // Each bonus answers the objection that comes AFTER the sale, in the order
  // people raise them: "what about when I'm not with you", "what about my
  // home", "I don't want to go alone", "how will I know it worked".
  bonuses: [
    {
      name: "The Situational Awareness Playbook",
      value: 90,
      body: "The written guide to not being there when it happens — routes, exits, phones, taxis, car parks. Yours in week one, before you can throw a single strike.",
    },
    {
      name: "Home & Commute Safety Audit",
      value: 75,
      body: "A 30-minute call where we go through your actual street, building and daily route, and fix the three things that make you easiest to pick.",
    },
    {
      name: "Bring a training partner, free",
      value: 499,
      body: "Someone you trust trains the whole 90 days alongside you at no cost. You drill against a real person from week one, and neither of you has to walk in alone.",
    },
    {
      name: "Your filmed pressure test",
      value: 120,
      body: "Day 90, on camera, against someone bigger. Yours to keep — it is the proof, and it is the thing you show yourself the next time you doubt it.",
    },
  ],

  // Conditional guarantee: the strongest risk reversal that is also honest,
  // because it is paid in Tamer's hours rather than refunded cash.
  guarantee: {
    title: "Pass it, or keep training free",
    body: "Make 80% of the sessions and do the drills between them. If you can't pass the day-90 pressure test, you keep training with me — free — until you can. I am not asking you to trust that it works. I am asking you to show up.",
  },

  // Real constraint, not a countdown clock. Tamer coaches every session
  // himself and Friday is his private-class day, so the cap is genuine.
  intake: {
    seatsPerIntake: 6,
    label: "6 seats per intake.",
    cadence: "New intake starts the first Monday of every month.",
    reason:
      "Six seats, because I coach every session myself and I am not going to hand you to someone else halfway through.",
  },
};

// ── Personal training (Fitness page) ─────────────────────────
// The ongoing options for people who are not doing the 90-day program:
// a drop-in, the recurring month, and a flexible pack.
//
// `anchor` is what the same thing costs bought the other way, so the card can
// show a struck-through comparison instead of the old floating "save" pill.
// Only set it where the comparison is REAL — Single Session has none, which is
// the point of it being the entry price.
export const PT_PACKAGES = [
  {
    name: "First Session",
    tagline: "Free, and it stays free",
    price: "$0",
    period: "one full hour",
    free: true,
    save: "No card, no catch",
    cta: "Book the free session",
    features: [
      "1-hour one-on-one training",
      "Movement screen & technique work",
      "A plan you keep either way",
      "No obligation to book a second",
    ],
    bonus: "Drop-in sessions after that are $45",
  },
  {
    name: "Monthly Coaching",
    tagline: "Someone in your corner every week",
    price: "$299",
    period: "/ month",
    featured: true,
    anchor: 360, // 8 drop-in sessions at $45
    anchorNote: "8 sessions bought singly",
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
    name: "11-Session Pack",
    tagline: "For weeks that never look the same twice",
    price: "$399",
    period: "11 sessions",
    anchor: 495, // 11 drop-in sessions at $45
    anchorNote: "11 sessions bought singly",
    cta: "Book a session",
    features: [
      "Buy 10 sessions, get the 11th free",
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
    name: "Design & Identities",
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
  Array.from({ length: n }, (_, i) => `/assets/projects/${slug}-${i + 1}.webp`);
const pick = (...names) => names.map((n) => `/assets/projects/${n}.webp`);

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
//
// WHICH POSTS GO HERE: the top five on the account by views, biggest first.
// A shelf of proof is only as strong as its weakest number, so a 2K-view post
// sitting beside a 219K one does not add a sixth data point, it invites the
// reader to discount the other five. "Always healthy" (2,346 views) was cut
// for exactly that reason; its file is still in public/assets/motion/ if it is
// ever wanted back. Sixth by reach is "+aura no training partner" (12,483),
// which is where the drop-off starts and where this list should stop.
export const INSTAGRAM_REELS = [
  {
    title: "Side effects of jiu jitsu",
    src: "/assets/motion/ig-side-effects.mp4",
    url: "https://www.instagram.com/tamer_ao/reel/DXy8SfNokAO/",
    caption: "SIDE EFFECTS OF JIUJITSU · #jiujitsu #wrestling",
    views: 219149,
    likes: 14520,
    comments: 83,
  },
  {
    title: "Aura farm at the end of class",
    src: "/assets/motion/ig-aura.mp4",
    url: "https://www.instagram.com/tamer_ao/reel/DXENzRNCD_L/",
    caption: "+aura · #jiujitsu #wrestling",
    views: 180356,
    likes: 12913,
    comments: 23,
  },
  {
    title: "When rests are appreciated",
    src: "/assets/motion/ig-rests.mp4",
    url: "https://www.instagram.com/tamer_ao/reel/DYZO7X9OKBs/",
    caption: "when rests are appreciated · #jiujitsu #wrestling",
    views: 125314,
    likes: 8158,
    comments: 46,
  },
  {
    title: "Tag them in the comments",
    src: "/assets/motion/ig-tag-them.mp4",
    url: "https://www.instagram.com/tamer_ao/reel/DXedYUuCIzL/",
    caption: "tag them in the comments · #invincible #jiujitsu",
    views: 39476,
    likes: 2792,
    comments: 19,
  },
  {
    title: "Revenge",
    src: "/assets/motion/ig-revenge.mp4",
    url: "https://www.instagram.com/tamer_ao/reel/DXOk9vrCNQ0/",
    caption: "REVENGE · #jiujitsu #warmup #revenge",
    views: 30448,
    likes: 1077,
    comments: 5,
  },
  {
    // Two days old and already sixth on the account by total views, which is a
    // faster climb than anything above it. `posted` drives the age chip on the
    // card: while a post is recent the chip says so, and once it is older than
    // a month the chip retires itself, so nothing here needs maintaining.
    title: "Oppa",
    src: "/assets/motion/ig-oppa.mp4",
    url: "https://www.instagram.com/tamer_ao/reel/Dbsy6JfoDUT/",
    caption: "oppa @ryanjitsu · #jiujitsu",
    posted: "2026-08-06",
    views: 23400,
    likes: 613,
    comments: 17,
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
    image: "/assets/projects/web-fabricaid.webp",
    full: "/assets/projects/web-fabricaid.webp",
    desc: "A seven-page site for FabricAID's uniform arm: workwear made in their own facility, with the social impact woven through rather than bolted on. Browse the range, the facility and the partner logos.",
  },
  {
    name: "Kitchen Garage",
    demo: "/demo/kitchen-garage/index.html",
    tag: "Website design",
    image: "/assets/projects/web-kg.webp",
    full: "/assets/projects/web-kg-full.webp",
    desc: "A full ordering site for Kitchen Garage in Aley: smash burgers, wings and loaded fries, with a menu, cart, accounts and every payment method.",
  },
  {
    name: "Snack Faysal",
    demo: "/demo/snack-faysal/index.html",
    tag: "Website design",
    image: "/assets/projects/web-snack.webp",
    full: "/assets/projects/web-snack-full.webp",
    desc: "A Beirut manakish and fatayer institution. The site is warm and appetite-led, built around the menu and the brand's heritage.",
  },
  {
    name: "Salon Nizar",
    demo: "/demo/salon-nizar/index.html",
    tag: "Website design",
    // NO `image` yet, deliberately. The card's poster is the still shown
    // before someone hovers and the live site loads in its place, and the
    // only screenshots on hand were Saifi's — a different client's site under
    // this one's name is worse than no still at all. Without it the card
    // shows its dark ground and the "Open the real site" badge, then the real
    // thing on hover. Drop a 16:10 screenshot in /assets/projects and set
    // `image` (and `full`) to finish it.
    desc: "A men's barbershop in Abadiyeh. The $10 haircut leads, the hot towel and face massage are free with it, and every screen books straight through to their Fresha calendar.",
  },
  {
    name: "Rasif Aley",
    demo: "/demo/rasif-aley/index.html",
    tag: "Website design",
    image: "/assets/projects/web-rasif.webp",
    full: "/assets/projects/web-rasif.webp",
    desc: "A coffee shop in Aley, built on their real menu, their real photographs and their real reviews. Warm and unhurried, the way the place is.",
  },
  {
    name: "ACC",
    demo: "/demo/acc/index.html",
    tag: "Website design",
    image: "/assets/projects/web-acc.webp",
    full: "/assets/projects/web-acc.webp",
    desc: "Arabian Construction Company, building since 1967. Architectural graphite and red, with the history carrying the credibility rather than a claim about it.",
  },
  {
    name: "Sinar",
    demo: "/demo/sinar/index.html",
    tag: "Website design",
    image: "/assets/projects/web-sinar.webp",
    full: "/assets/projects/web-sinar-full.webp",
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
    slug: "aperture",
    name: "Aperture",
    kicker: "Creative Studio",
    tag: "Studio site",
    desc: "Ten panels wipe off the screen, then a spotlight finds the second photograph.",
    highlights: [
      "Ten-panel splash wipe",
      "Cursor spotlight reveal",
      "Display word cropped by the image",
      "Slide-down glass menu",
    ],
    bestFor: "Studios · Motion designers · Photographers",
    stack: "React · Canvas",
    accent: "#75C5DE",
    bg: "#E4E4E4",
    ink: "#111111",
  },
  {
    slug: "aurora",
    name: "Aurora",
    kicker: "AI Product Hero",
    tag: "Landing page",
    desc: "A 220px wordmark half-painted in a gradient, over a self-fading film.",
    highlights: [
      "Hand-driven video fade loop",
      "Gradient-clipped display type",
      "Liquid-glass chrome",
      "Seamless logo marquee",
    ],
    bestFor: "AI products · Recruitment · Enterprise",
    stack: "React · CSS",
    accent: "#a855f7",
    bg: "#05010E",
    ink: "#F4F2F0",
  },
  {
    slug: "muse",
    name: "Muse",
    kicker: "Early Access Hero",
    tag: "Landing page",
    desc: "A serif headline over streamed film, with a CTA that becomes an email field.",
    highlights: [
      "HLS stream via hls.js",
      "Typewriter placeholder",
      "Glass pill navbar",
      "One locked screen, no scroll",
    ],
    bestFor: "AI tools · Waitlists · Launches",
    stack: "React · Framer Motion · hls.js",
    accent: "#ffffff",
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
  {
    slug: "closer",
    name: "Closer",
    kicker: "CTA & Footer",
    tag: "Section",
    desc: "The closing screen of a page: one serif line over film, two buttons, the footer.",
    highlights: [
      "HLS stream via Mux",
      "Top and bottom video dissolves",
      "Liquid-glass CTA",
      "Footer bar built in",
    ],
    bestFor: "Any page · Agencies · Studios",
    stack: "React · CSS · hls.js",
    accent: "#ffffff",
    bg: "#000000",
    ink: "#ffffff",
  },
  {
    slug: "signal",
    name: "Signal",
    kicker: "No-Code AI Hero",
    tag: "Landing page",
    desc: "The button becomes an email field, and the placeholder types itself in.",
    highlights: [
      "Button-to-form CTA swap",
      "Typewriter placeholder",
      "HLS stream via Mux",
      "Glass pill navbar",
    ],
    bestFor: "AI tools · SaaS · Waitlists",
    stack: "React · Framer Motion · hls.js",
    accent: "#ffffff",
    bg: "#000000",
    ink: "#ffffff",
  },
  {
    slug: "echoid",
    name: "Echoid",
    kicker: "Voice ID Signup",
    tag: "Landing page",
    desc: "A signup panel pinned to the right of a cinematic face reel.",
    highlights: [
      "Dual-gradient scrim",
      "Circular clip-path menu",
      "Sora + JetBrains Mono",
      "Reduced-motion poster",
    ],
    bestFor: "AI products · Waitlists · Identity",
    stack: "React · CSS",
    accent: "#ffffff",
    bg: "#000000",
    ink: "#ffffff",
  },
  {
    slug: "vibrant",
    name: "Vibrant",
    kicker: "Wellness Hero",
    tag: "Landing page",
    desc: "Glass nav, social-proof badge and stats over a calm looping film.",
    highlights: [
      "Liquid-glass surfaces",
      "Overlapping avatar badge",
      "Drawn stat icons",
      "Rotating menu toggle",
    ],
    bestFor: "Wellness · Clinics · Coaching",
    stack: "React · CSS",
    accent: "#ffffff",
    bg: "#000000",
    ink: "#ffffff",
  },
  {
    slug: "mentality",
    name: "Mentality",
    kicker: "Light Wellness Landing",
    tag: "Landing page",
    desc: "The light one: near-black type on soft grey, film dissolving into the page.",
    highlights: [
      "Light #EDEEF5 palette",
      "Film masked into the background",
      "Two-tone headline with inline pill",
      "Search capsule + edge anchors",
    ],
    bestFor: "Health · Nonprofits · Editorial",
    stack: "React · Framer Motion",
    accent: "#1a1a1a",
    bg: "#edeef5",
    ink: "#1a1a1a",
  },
  {
    slug: "kollektiva",
    name: "Kollektiva",
    kicker: "Studio Team Page",
    tag: "Landing page",
    desc: "Pick a face and the whole screen becomes that person.",
    highlights: [
      "Full-bleed portrait crossfade",
      "Eight-person avatar picker",
      "Bio and name fade on change",
      "Editorial, no cards",
    ],
    bestFor: "Studios · Agencies · Teams",
    stack: "React · CSS",
    accent: "#ffffff",
    bg: "#0d0d0d",
    ink: "#ffffff",
  },
  {
    slug: "bloom",
    name: "Bloom",
    kicker: "AI Platform Split",
    tag: "Landing page",
    desc: "A 52/48 split over film: the pitch on one side, the product furniture on the other.",
    highlights: [
      "Two-panel split layout",
      "Two tiers of liquid glass",
      "Strictly greyscale palette",
      "Drawn marks, zero image files",
    ],
    bestFor: "AI products · Studios · Platforms",
    stack: "React · CSS",
    accent: "#ffffff",
    bg: "#0b0b0b",
    ink: "#ffffff",
  },

  /* ── Added 2026-08-17 ───────────────────────────────────────────────────
     Six single-composition screens, each built around one real mechanic
     rather than a layout: a live SVG refraction, a canvas morph-reveal, a
     choreographed entrance, a counted stat row, a scaling layout engine, and
     a height-locked unit system. Their demo media is remote and belongs to
     its owners — a buyer swaps it before going live. */
  {
    slug: "refract",
    name: "Refract",
    kicker: "Liquid Glass Hero",
    tag: "Landing page",
    desc: "A card that really refracts the film behind it, rainbow fringing and all.",
    highlights: [
      "Live SVG refraction, no WebGL",
      "Per-channel chromatic dispersion",
      "Untinted full-strength video",
      "Slide-in fullscreen menu",
    ],
    bestFor: "Research · Climate · Science",
    stack: "React · SVG filters · Canvas",
    accent: "#000000",
    bg: "#c2ccd3",
    ink: "#000000",
  },
  {
    slug: "morph",
    name: "Morph",
    kicker: "Pixel Poster",
    tag: "Poster",
    desc: "Your cursor wipes one pixel-art lily into another along an organic trail.",
    highlights: [
      "Canvas morph-reveal masking",
      "24-point noise-warped blobs",
      "Serif wordmark rising out of its mask",
      "One locked screen, no scroll",
    ],
    bestFor: "Software · Art direction · Launches",
    stack: "React · Canvas",
    accent: "#fd86db",
    bg: "#161616",
    ink: "#ffffff",
  },
  {
    slug: "clarity",
    name: "Clarity",
    kicker: "Analytics Landing",
    tag: "Landing page",
    desc: "A dark cinematic pitch with a glass demo card in the opposite corner.",
    highlights: [
      "Choreographed one-shot entrance",
      "Headline clipped up out of its own mask",
      "Height-locked type scale",
      "Glass card, watch button, play control",
    ],
    bestFor: "SaaS · Analytics · B2B",
    stack: "React · CSS",
    accent: "#ffffff",
    bg: "#000000",
    ink: "#ffffff",
  },
  {
    slug: "matrix",
    name: "Matrix",
    kicker: "AI Platform Hero",
    tag: "Landing page",
    desc: "A dot-matrix headline over film, with four metrics counting themselves up.",
    highlights: [
      "Retro dot-matrix display face",
      "Count-up metrics on easeOutCubic",
      "Overlapping trust rings",
      "White sheet menu on mobile",
    ],
    bestFor: "AI platforms · Infrastructure · Enterprise",
    stack: "React · CSS",
    accent: "#ffffff",
    bg: "#000000",
    ink: "#ffffff",
  },
  {
    slug: "split",
    name: "Split",
    kicker: "Login Screen",
    tag: "Login screen",
    desc: "A sign-in worth landing on: a falcon in a dive holding half the frame.",
    highlights: [
      "Three-mode layout engine",
      "Card interior scaled, not reflowed",
      "Twelve-step WAAPI entrance",
      "16px inputs, no iOS zoom",
    ],
    bestFor: "Products · Dashboards · Apps",
    stack: "React · CSS",
    accent: "#283139",
    bg: "#fefefe",
    ink: "#000000",
  },
  {
    slug: "portal",
    name: "Portal",
    kicker: "AI Infrastructure Hero",
    tag: "Landing page",
    desc: "A figure walking into a door of light, measured in one height-locked unit.",
    highlights: [
      "Every value in one viewport unit",
      "Measured letterbox + bottom fades",
      "Gradient bolt mark",
      "Frosted portrait menu",
    ],
    bestFor: "AI infrastructure · Deep tech · Platforms",
    stack: "React · CSS",
    accent: "#cccccc",
    bg: "#050505",
    ink: "#fafafa",
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

  /* ── Restored 2026-08-09 ────────────────────────────────────────────────
     These four were built from style references Tamer sent, then dropped from
     the store on 2026-08-01 while it was being cut back — the folders were
     deleted, so they only survived in git. Recovered from 97f1d70^ (prism,
     darkroom, abyss) and 8ba034b^ (nebula).

     They come back on the CURRENT model, not the one they left on: the
     `price: 149` and `tier: "signature"` fields they used to carry are gone,
     since nothing in the store is priced or tiered any more, and the
     descriptions are cut to one line like every other card. Their own
     tokens.css / theme.css / tokens.json came back with them — they are the
     only token-based templates left, and `npm run build:tokens` discovers
     them by looking for tokens.css.

     Every visual in all four is drawn in canvas or CSS, so unlike most of the
     library these carry no remote demo media a buyer would have to swap. */
  {
    slug: "nebula",
    name: "Nebula",
    kicker: "AI Product",
    tag: "Landing page",
    desc: "Thousands of tiny triangles settle into a brain over pure black.",
    highlights: ["Canvas particle constellation", "Weight-free type hierarchy", "Team + carousel sections", "Retint from one array"],
    bestFor: "AI products · Research labs · Deep tech",
    stack: "React · Canvas",
    accent: "#8052ff",
    bg: "#000000",
    ink: "#ffffff",
  },
  {
    slug: "prism",
    name: "Prism",
    kicker: "Studio Editorial",
    tag: "Studio site",
    desc: "Strict monochrome wrapped around one iridescent field, drawn live.",
    highlights: ["Live iridescent hero field", "225px editorial display type", "Rotating scroll badge", "Strict monochrome UI"],
    bestFor: "Design studios · Agencies · Galleries",
    stack: "React · Canvas",
    accent: "#a02d25",
    bg: "#ffffff",
    ink: "#000000",
  },
  {
    slug: "darkroom",
    name: "Darkroom",
    kicker: "Product Story",
    tag: "Product site",
    desc: "One object lit like a museum artifact in warm darkness.",
    highlights: ["Product rendered in pure CSS", "Two-mode type system", "Full-viewport reveals", "No licensed imagery"],
    bestFor: "Product launches · Makers · Objects",
    stack: "React · CSS",
    accent: "#dc5000",
    bg: "#100904",
    ink: "#ffedd7",
  },
  {
    slug: "abyss",
    name: "Abyss",
    kicker: "Fintech Terminal",
    tag: "Landing page",
    desc: "A deep-water trading terminal built from depth, not shadows.",
    highlights: ["Depth-sorted particle sphere", "Shadowless surface stack", "Rationed colour system", "Statistic + division blocks"],
    bestFor: "Fintech · Trading · B2B platforms",
    stack: "React · Canvas",
    accent: "#fde9ff",
    bg: "#012624",
    ink: "#ffffff",
  },
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

/** How many websites the store actually holds, counted rather than typed. */
export const TEMPLATE_COUNT = TEMPLATES.length;

/* The templates offer used to have its counts patched in here from
   TEMPLATES.length. Nothing on the site prints the size of the library any
   more — the gallery shows it — so the placeholders and this loop are gone. */


// ── Access ────────────────────────────────────────────────────
// The gallery is free to browse and a handful of templates download free, no
// questions asked. The library behind them — every template, every font, and
// whatever ships next week — is the membership.
//
// $19 is under the line where a freelancer stops to think about it, and yearly
// is priced at ten months so the saving reads without a discount table.
export const TEMPLATE_PACKAGES = [
  {
    id: "source",
    name: "One Template",
    tagline: "Yours to keep, free",
    free: true,
    // Downloading hands over the lead: the form asks for a name and a way to
    // reach them before the zip starts.
    gated: true,
    period: "free, no card",
    features: [
      "Full React source code",
      "Runs with two commands",
      "Free for personal and client work",
      "Deploy guide included",
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
    badge: "Most popular",
    subscription: true,
    features: [
      "Every template in the gallery",
      "The full font library with them",
      "Something new every week",
      "Commercial licence, unlimited client work",
      "Keep everything you downloaded",
    ],
    bonus: "Free 30-minute call to pick the right one",
    guarantee:
      "Cancel in the first 30 days and I refund the month. You keep whatever you already downloaded.",
  },
  {
    id: "member-year",
    name: "Membership, Yearly",
    tagline: "The same thing, two months free",
    flat: 190,
    period: "per year, billed once",
    anchor: 228, // 12 × $19 paid monthly
    anchorNote: "paid monthly",
    subscription: true,
    features: [
      "Everything in the monthly membership",
      "Two months free against monthly",
      "Locked at this price while you stay",
    ],
    bonus: "First pick of what gets built next",
    guarantee:
      "Cancel in the first 30 days and I refund the year. You keep whatever you already downloaded.",
  },
];

// ── What a website costs ──────────────────────────────────────
// The page used to lead with one flagship offer — a free build against $199 a
// month on a twelve-month term — and it took up most of the page before a
// visitor reached a single number they could act on. It is gone. What replaces
// it is the pricing that has actually been quoted to a client and signed off:
// the FabricAID Uniforms proposal of 21 August 2026. One setup fee to build,
// launch and get the site found, then a monthly plan chosen by how often you
// expect to want changes.
//
// KEEP THESE IN STEP with the proposal and with the Website Build & Hosting
// Agreement (§5.1). If a build fee or an edit allowance moves here, it moves
// in both of those the same day, or a client is reading two different prices
// for the same thing.

// ── Everything else ───────────────────────────────────────────
// Deliberately demoted, and deliberately small. These used to be two full
// pricing tables above the fold, which turned the page into a menu and let a
// visitor comparison-shop instead of deciding. They are still here because
// somebody genuinely only wants a one-page site, or already has a site and
// only wants it kept alive, and refusing to sell that would be posturing.
//
// Every one of them now carries a guarantee. A tier without one is a tier
// where the risk is still sitting on the buyer.
export const SERVICE_PACKAGES = [
  {
    id: "setup",
    name: "One Page, Live This Week",
    tagline: "You have something to point at by Friday",
    flat: 350,
    period: "one-off, no monthly",
    features: [
      "Any template from the gallery, set up for you",
      "Your copy, photos and colours applied",
      "Domain, SSL and deployment handled",
      "Contact or WhatsApp button wired up",
      "One round of revisions",
    ],
    bonus: "Free logo animation for your hero",
    guarantee: "Live within 7 days of getting your content, or you don't pay.",
  },
  {
    /* The FabricAID number, and the one most businesses actually buy: a whole
       site designed, launched and findable. Priced against what it is worth
       rather than against the hours — the same scope is $4,000–$8,000 from a
       Beirut agency and $12,000+ regionally. */
    id: "build",
    name: "The Whole Site, Live and Found",
    tagline: "Up to six pages, launched and on Google",
    flat: 850,
    period: "one-off · about three weeks",
    featured: true,
    badge: "Most bought",
    features: [
      "Up to six pages, designed around your brand",
      "All content edits and two rounds of revisions",
      "Domain, Cloudflare hosting, SSL and CDN set up",
      "Image compression and speed work on every page",
      "Full SEO: titles, descriptions, structured data, sitemap, social cards",
      "Google Search Console and analytics installed and verified",
      "Booking calendar, contact form and socials wired up",
      "Handover walkthrough and a first ranking report",
    ],
    bonus: "Free logo animation for your hero",
    guarantee:
      "Half on signature, half on launch. The second half is due when the site is live, not on a date — if it is not live, it is not payable.",
  },
  {
    id: "custom",
    name: "Built From Scratch",
    tagline: "When the site has a job to do",
    from: 1500,
    period: "quoted per project",
    features: [
      "Shop, accounts, payments or multi-language",
      "Built to your flows, not a template's",
      "Performance and technical SEO pass",
      "Analytics and conversion tracking",
      "Unlimited revisions inside the agreed scope",
      "60 days of post-launch support",
    ],
    bonus: "Free 30-minute scoping call first",
    guarantee:
      "Fixed quote before a line is written. If it takes longer than quoted, that is mine to absorb, not yours to pay for.",
  },
];

// ── Keeping a site alive ──────────────────────────────────────
// The three monthly plans from the FabricAID proposal, unchanged. Every plan
// keeps the site online, secure, backed up and monitored; what separates them
// is how changes are handled and how fast I answer.
//
// The prices are deliberately arranged so the plans cross over in the client's
// favour, and the crossover is stated on the page rather than hidden: seven
// small changes on Online costs exactly what Managed costs, and Managed
// includes five of them and answers three working days sooner.
export const WEBSITE_CARE_PLANS = [
  {
    id: "online",
    name: "Online",
    tagline: "The site stays up, and that is all",
    flat: 30,
    period: "per month, per site",
    features: [
      "Cloudflare hosting, SSL, CDN and domain renewal",
      "Nightly backups with 30-day history",
      "Uptime monitoring",
      "Security and dependency updates",
      "No edits included — every change is quoted and billed",
      "First reply within five working days",
    ],
    guarantee: "Down for more than a day and that month is free.",
  },
  {
    id: "managed",
    name: "Managed",
    tagline: "For a site that changes now and then",
    flat: 100,
    period: "per month, per site",
    features: [
      "Everything in Online",
      "Five content edits included every month",
      "First reply within two working days",
      "Quarterly traffic and Google ranking report",
      "Basic SEO upkeep",
      "Extra edits at $8 each, below the pay-as-you-go rate",
    ],
    guarantee: "Down for more than a day and that month is free.",
  },
  {
    id: "complete",
    name: "Complete",
    tagline: "For a site that keeps working for you",
    flat: 190,
    period: "per month, per site",
    featured: true,
    badge: "Recommended",
    features: [
      "Everything in Managed",
      "Unlimited content edits — fair use to fifteen a month",
      "No per-change invoices and no approval delays",
      "First reply within one working day",
      "Two new pages included per year",
      "Monthly report: visitors, sources, enquiries and rankings",
      "Quarterly SEO refresh as search behaviour shifts",
      "Priority WhatsApp channel",
    ],
    guarantee: "Down for more than a day and that month is free.",
  },
];

/** Pay-as-you-go, for anyone on Online. Same rates as the FabricAID proposal.
 *  Printed next to the plans on purpose: it is what makes the monthly plans
 *  arithmetic a visitor can check rather than a claim they have to accept. */
export const WEBSITE_CHANGE_RATES = [
  { what: "Text, price or contact detail change", price: "$10" },
  { what: "Photo swap or new gallery item", price: "$15" },
  { what: "New section on an existing page", price: "$45" },
  { what: "A whole new page", price: "$120" },
];

/** What counts as a content edit, and what the monthly does not cover. */
export const WEBSITE_CARE_NOTES = [
  "A content edit is a change to existing text, images, prices or opening hours. New pages, new features and redesigns are quoted separately.",
  "Billed monthly in advance from launch day, in USD. Unused edits don't roll over.",
  "The plan runs for an initial twelve months from launch, then continues monthly and can be cancelled with thirty days' notice.",
  "You can move up a plan at any time. Moving down takes effect at the end of the paid month.",
  "The domain is registered in your name. The content and all the data are yours.",
  "Third-party costs are minimal and paid by you directly: domain renewal is roughly $20 a year, and Cloudflare hosting, the form service and the booking calendar are all free at normal traffic levels.",
];

// ── Service pages ─────────────────────────────────────────────
// Three pages that exist because of what people type into Google, which is
// not what the rest of this site is organised around. Nobody searches "Start
// Free" or "Work With Me"; they search "website design lebanon" and
// "restaurant website lebanon". The eight pages the site already had answer
// none of those queries directly.
//
// The rule these have to earn their place by: every one of them is about work
// Tamer has actually done, names real clients with sites that are live, and
// quotes prices that match the rest of siteData. A page written for a search
// engine and not for the person who arrives is worth less than no page — it
// ranks briefly, converts nobody, and teaches Google the site is thin.
//
// `faqs` become FAQPage structured data as well as visible copy. Keep the two
// identical: marking up an answer that is not on the page is a guideline
// violation, and the visible version is the one that has to convince anyone.
export const SERVICE_PAGES = [
  {
    slug: "website-design-lebanon",
    h1: "Website Design in Lebanon",
    kicker: "For businesses that need the phone to ring",
    lede:
      "Most small business sites in Lebanon are a logo, a phone number and a Facebook link. They sit there. A site should bring you work, and that is a different job from looking nice.",
    sections: [
      {
        title: "What actually gets built",
        body:
          "A site designed around your brand rather than a theme, on your own domain, with the pages written to come up when someone in your area searches for what you sell. Booking, ordering, a menu or an enquiry form, whichever one is the thing you need people to do. Hosting, the domain, SSL, backups and monitoring are mine to run, so nothing about it is left for you to maintain.",
      },
      {
        title: "Who I build for",
        body:
          "Restaurants and cafés paying a delivery app a third of every order. Salons and clinics losing bookings in their DMs. Contractors and trades who are invisible the moment somebody searches instead of asking a friend. Different problems, one fix: a site you own, that people can find.",
      },
      {
        title: "What it costs",
        body:
          "A full site — up to six pages, designed, launched, optimised and submitted to Google — is $850 as a one-off, and takes about three weeks. Then a monthly plan keeps it online and looked after: $30 for hosting and monitoring alone, $100 with five content edits a month and a quarterly report, $190 for unlimited edits, monthly reporting and a quarterly SEO refresh. If a whole site is more than you need, a single page set up from the free gallery is $350 one-off, and a build with a shop or booking system behind it starts at $1,500.",
      },
    ],
    proof: [
      { name: "Kitchen Garage", what: "Full ordering site in Aley: menu, cart, accounts and every payment method." },
      { name: "Rasif Aley", what: "A coffee shop, built on their real menu, real photographs and real reviews." },
      { name: "Snack Faysal", what: "A Beirut manakish institution, appetite-led and built around the menu." },
      { name: "Sophia's Forum", what: "Bilingual English and Arabic, mirroring cleanly into right-to-left." },
      { name: "ACC", what: "Arabian Construction Company, building since 1967." },
    ],
    faqs: [
      {
        q: "How much does a website cost in Lebanon?",
        a: "A full six-page site, launched and set up to be found on Google, is $850 one-off. Keeping it running afterwards is $30, $100 or $190 a month depending on how often you want changes made. A single page set up from the free gallery is $350 as a one-off, and a site built from scratch with a shop or booking system behind it starts at $1,500. Every price on this site is the price you pay.",
      },
      {
        q: "How long does it take?",
        a: "A single page from the gallery is live within 7 days of you sending your content, or you do not pay. A full six-page build runs about three weeks: week one is your content edits and revisions, week two is launch on your own domain, week three is the SEO setup and handover. That timeline holds as long as your changes come back as one list.",
      },
      {
        q: "Do I own the website?",
        a: "You own your domain, your content and your brand. While you are on a monthly plan I run the hosting and the code, which is what lets me keep it up and keep working on it. Full ownership and a domain transfer are available any time as a one-time buy-out.",
      },
      {
        q: "Can you do the site in Arabic?",
        a: "Yes. Sophia's Forum is bilingual English and Arabic and mirrors cleanly into right-to-left, which is the part most templates get wrong.",
      },
      {
        q: "What if it does not bring in any enquiries?",
        a: "On day one we write down what came in over your previous 90 days: calls, messages, walk-ins. If the 90 days after launch have not beaten that number, you do not pay for months four, five or six, and I keep working straight through them.",
      },
    ],
    cta: { label: "See the offer", to: "/websites" },
  },

  {
    slug: "logo-design-beirut",
    h1: "Logo Design & Brand Identity in Beirut",
    kicker: "A mark, and everything that has to live around it",
    lede:
      "A logo on its own is not an identity. What you need is the mark, the type, the colours and the rules for using them, so everything you put out afterwards looks like it came from the same place.",
    sections: [
      {
        title: "Start with the teardown, free",
        body:
          "Send your logo, your Instagram or your site and you get back a short recorded critique: what is working, what is quietly costing you, and the three things I would change first. It is real work, it takes me an afternoon, and it costs you nothing. Most people can act on it without hiring anybody.",
      },
      {
        title: "What a full identity includes",
        body:
          "The primary mark and its variations, the typefaces and how they are set, the palette, and the rules that keep it consistent. Logo motion if the mark needs to move, which it usually does the moment it goes on a reel or a story. Then the applications: apparel, packaging, print, whatever the brand actually has to survive.",
      },
      {
        title: "Where the work has gone",
        body:
          "Brand identity, logos, logo motion and apparel for clients across Beirut and beyond, including athletic and combat-sports brands where the mark has to work stitched onto a rashguard at two centimetres and on a banner at two metres. That constraint is the whole test of a logo.",
      },
    ],
    proof: [
      { name: "OKIRO", what: "Brand identity and apparel." },
      { name: "10th Planet Jiu Jitsu", what: "Combat-sports identity and kit design." },
      { name: "FabricAID", what: "Identity work for their uniform arm." },
      { name: "KARV Pilates Studio", what: "Studio branding." },
      { name: "Playwear Club", what: "Apparel and identity." },
    ],
    faqs: [
      {
        q: "How much does a logo cost in Beirut?",
        a: "One-off design work is quoted per project, because a single mark and a full identity with apparel and packaging behind it are not the same job. Start with the free brand teardown and you will know what you actually need before anyone quotes you anything.",
      },
      {
        q: "What do I get at the end?",
        a: "The mark in every format you will need for print and screen, the typefaces and colours written down, and the rules for using them. If we do motion, you get the animated version for your reels and stories too.",
      },
      {
        q: "Is the brand teardown really free?",
        a: "Yes. No card, no trial, no email course. You send what you have, I record a critique and send it back within 3 days, and it is yours to keep whether or not you ever hire me.",
      },
      {
        q: "Do you design for apparel and packaging as well?",
        a: "Yes, and it changes how the mark should be drawn. A logo that only works on a website falls apart embroidered on a sleeve. Rashguards, fight kits, retail packaging and print are all work I do regularly.",
      },
    ],
    cta: { label: "Claim the free teardown", to: "/free" },
  },

  {
    slug: "restaurant-website-lebanon",
    h1: "Restaurant Websites in Lebanon",
    kicker: "Stop paying a third of every order to an app",
    lede:
      "The delivery apps did not give you customers. They rented them to you, they keep about a third of every order, and they will not tell you the phone number of the person who just ate your food.",
    sections: [
      {
        title: "The arithmetic",
        body:
          "On a $20 order an app can keep around $6. Twenty orders a day through the app is roughly $3,600 a month gone. A site that takes your orders directly is $850 to build and from $30 a month to run, and the customer becomes yours: their number, their order history, and a reason to come back that does not involve somebody else's push notification.",
      },
      {
        title: "What the site does",
        body:
          "Your full menu, priced and photographed, with a cart and every payment method that actually works here. Orders land with you. It comes up on Google when somebody nearby searches for what you serve, and your Google Business profile gets fixed in the first week so the map listing is right before the site is even finished.",
      },
      {
        title: "Already built and running",
        body:
          "This is not a plan, it is the thing I have already built more than once. Kitchen Garage in Aley takes smash burger orders through a full cart and accounts system. Snack Faysal is built around a manakish menu and the brand's heritage. Rasif Aley runs on their real menu, real photographs and real reviews.",
      },
    ],
    proof: [
      { name: "Kitchen Garage", what: "Menu, cart, accounts and every payment method, in Aley." },
      { name: "Snack Faysal", what: "Beirut manakish and fatayer, appetite-led and menu-first." },
      { name: "Rasif Aley", what: "Coffee shop, warm and unhurried, the way the place is." },
    ],
    faqs: [
      {
        q: "Can people order directly from the site?",
        a: "Yes. Kitchen Garage runs a full cart with accounts and every payment method, and that is the same system I would build for you. The order comes to you, and so does the customer.",
      },
      {
        q: "Do I have to leave the delivery apps?",
        a: "No, and I would not advise it on day one. Keep them for reach and run your own ordering alongside, then watch which one costs you less per order. The apps stop being a problem once they stop being the only way anyone can order.",
      },
      {
        q: "What does it cost to run?",
        a: "$850 to build it, then a monthly plan from $30. Online at $30 covers hosting, the domain, SSL, backups and monitoring. Managed at $100 adds five content edits a month and a quarterly report. Complete at $190 is unlimited edits, a monthly report and a quarterly SEO refresh.",
      },
      {
        q: "Can you put the menu in Arabic?",
        a: "Yes. I have built a fully bilingual site that mirrors into right-to-left properly, which is the part most templates get wrong.",
      },
      {
        q: "What if it does not work?",
        a: "We write down what came in over your previous 90 days before we start. If the 90 days after launch have not beaten it, you do not pay for months four, five or six and I keep working through them.",
      },
    ],
    cta: { label: "See the offer", to: "/websites" },
  },

  /* Social media. The one thing on this list that is sold every month rather
     than once, and the one the site had no search page for at all: everything
     about the packages lived on /work-with-me, which nobody types into Google.
     Prices mirror SOCIAL_PACKAGES and REEL_RATE above. If a tier moves there,
     it moves here the same day. */
  {
    slug: "social-media-management-lebanon",
    h1: "Social Media Management in Lebanon",
    kicker: "Post every week without touching it",
    lede:
      "Posting stops for three weeks, the account goes quiet, and starting again feels like starting from zero. The fix is not more effort. It is somebody whose job it is, every week, whether or not you feel like it.",
    sections: [
      {
        title: "Reels first, because reach is",
        body:
          "Carousels talk to the people who already follow you. Reels are what put you in front of people who have never heard of you, so every package leads with them and the mix is decided with you on the kickoff call. A brand that only wants reels gets only reels. You get the hooks and the captions written for you as well, because a good cut with a dead first line still dies.",
      },
      {
        title: "What it costs, in the open",
        body:
          "Starter is $199 a month for 8 pieces on one platform. Growth is $449 for 16, with trend and hook research and a content calendar. Premium is $899 for 28 pieces across up to three platforms, with a monthly strategy meeting and priority turnaround. Bought one reel at a time the same volume is $65 each, which is the rate on the card, so the arithmetic is one you can check rather than a claim you have to take.",
      },
      {
        title: "The numbers behind the work",
        body:
          "My own reels have done over 855,000 views, with the best single one at 219,000. The posts on the media page carry their real view, like and comment counts, unedited, because a screenshot of a number is worth more than an adjective. That is the same editing, the same hooks and the same pacing your account gets.",
      },
      {
        title: "You go first, for free",
        body:
          "Send your footage and I cut one reel: hook, captions, the lot, back within 5 days. Post it, watch what it does, and decide about the rest afterwards. No card and no obligation. If it does nothing, you have lost nothing and you keep the reel.",
      },
    ],
    proof: [
      { name: "OKIRO", what: "Brand identity and apparel, carried through to social." },
      { name: "10th Planet Jiu Jitsu", what: "Combat sports content, where the cut has to match the pace of the sport." },
      { name: "KARV Pilates Studio", what: "Studio branding and the social design around it." },
      { name: "Playwear Club", what: "Apparel brand, identity and content." },
      { name: "Tamer AO", what: "855K+ views on my own reels, best single reel at 219K." },
    ],
    faqs: [
      {
        q: "How much does social media management cost in Lebanon?",
        a: "$199 a month for 8 pieces of content on one platform, $449 for 16 with trend research and a content calendar, or $899 for 28 across up to three platforms with a monthly strategy meeting. Buying the same content one reel at a time is $65 a piece. Every price on this site is the price you pay.",
      },
      {
        q: "Do I have to send you the footage?",
        a: "For most brands yes, and it is less work than it sounds: phone footage shot through your normal week is usually enough, and I tell you what to shoot. Where a brand needs it filmed properly that is quoted on top rather than assumed.",
      },
      {
        q: "Is the first reel really free?",
        a: "Yes. Send your footage and you get one reel cut, captioned and back within 5 days. No card, no trial and no email course. Post it and judge the work by what it does.",
      },
      {
        q: "What if my views do not go up?",
        a: "On day one we screenshot your average reel views over the last 90 days. If what I make for you has not beaten that average within 60 days, you do not pay for the third month and I keep working through it.",
      },
      {
        q: "Which platforms do you handle?",
        a: "Instagram and TikTok. Starter and Growth run one platform properly rather than two badly. Premium goes up to three.",
      },
      {
        q: "Can I stop whenever I want?",
        a: "Yes. The packages are monthly. There is no twelve month term on social the way there is on a website care plan.",
      },
    ],
    cta: { label: "See the packages", to: "/work-with-me" },
  },

  /* Salons, barbershops and clinics. The whole category buys the same thing
     for the same reason: bookings currently arrive as DMs at eleven at night
     and half of them are never answered. Salon Nizar is live and is the
     proof. */
  {
    slug: "salon-website-lebanon",
    h1: "Salon & Barbershop Websites in Lebanon",
    kicker: "Stop losing bookings in your DMs",
    lede:
      "Bookings arrive as messages at eleven at night, get read in the morning, and half of them are gone by then. A booking page does not sleep, does not forget, and does not need you to answer it.",
    sections: [
      {
        title: "Booking is the whole point",
        body:
          "Every screen books. Your calendar, whether that is Fresha, Calendly or something else, is wired in so a client picks a time and it lands in the book without a message being sent. Your services and your prices are listed the way you would say them out loud, so nobody has to ask what a cut costs before they can commit to one.",
      },
      {
        title: "Found by the people standing nearby",
        body:
          "Most of your business is people within a few streets who searched instead of asking a friend. The site is written for those searches, and your Google Business profile is fixed in the first week so the map listing, the hours and the photographs are right before the site is even finished. That listing is often what actually gets the walk-in.",
      },
      {
        title: "Already live",
        body:
          "Salon Nizar is a men's barbershop in Abadiyeh. The $10 haircut leads, the hot towel and the face massage are stated as free with it rather than buried, and every screen books straight through to their Fresha calendar. That is the same build, and it is running now.",
      },
      {
        title: "What it costs",
        body:
          "A full site, up to six pages, designed, launched and set up to be found, is $850 one off and takes about three weeks. Keeping it alive afterwards is $30 a month for hosting and monitoring, $100 with five content edits a month, or $190 for unlimited edits and a quarterly SEO refresh. If a single page is all you need, one set up from the free gallery is $350 with no monthly at all.",
      },
    ],
    proof: [
      { name: "Salon Nizar", what: "Men's barbershop in Abadiyeh, booking straight into their Fresha calendar." },
      { name: "KARV Pilates Studio", what: "Studio branding for a booking-led business." },
      { name: "Rasif Aley", what: "A local shop built on its real menu, photographs and reviews." },
      { name: "Kitchen Garage", what: "Full accounts and checkout, in Aley." },
    ],
    faqs: [
      {
        q: "How much does a salon website cost in Lebanon?",
        a: "$850 one off for a full six page site, launched and set up to be found on Google, then $30, $100 or $190 a month depending on how often you want changes made. A single page from the free gallery is $350 one off with no monthly.",
      },
      {
        q: "Can clients book directly on the site?",
        a: "Yes, and they should. Salon Nizar books straight into Fresha from every screen. If you already run a calendar I wire that one in rather than moving you onto something new.",
      },
      {
        q: "I already take bookings on Instagram. Why do I need a site?",
        a: "Because Instagram only reaches people who already follow you, and a DM only becomes a booking if somebody answers it. A site is found by the person who searched for a barber near them ten minutes ago and has never heard of you.",
      },
      {
        q: "Do you fix my Google listing too?",
        a: "Yes, in the first week, before the site is finished. Hours, address, photographs and services. For a local shop that listing is often worth more than the site on its own.",
      },
      {
        q: "How long does it take?",
        a: "About three weeks for a full build: your edits and revisions in week one, launch on your own domain in week two, the SEO setup and handover in week three. A single page from the gallery is live within 7 days of your content arriving, or you do not pay.",
      },
    ],
    cta: { label: "See the offer", to: "/websites" },
  },
];

/** How many templates sit on the open shelf, free and downloadable one at a
    time. Most of the library, deliberately: somebody has to be able to judge
    the work before there is any reason to pay for it, and a gallery that shows
    a teaser and gates the rest reads as bait. What is behind the membership is
    the REST of the shelf plus every font, in one download, plus next week's.

    One number, one gate, one call to action. There is no second "view more"
    button that reveals the rest for free — that made two buttons doing what a
    visitor reads as the same job, and split the one decision worth asking
    for. */
export const GALLERY_PREVIEW_COUNT = 30;

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

// ── Fitness page copy ─────────────────────────────────────────
// The /fitness page is the coaching funnel, in the same order and the same
// voice as the standalone fitness site (fitness-site/src/data.js): the free
// hour above the prices, the prices in the open, the risk moved onto me.
// Everything a visitor reads on that page that is not a price, a class time
// or the 90-day program lives here.
export const FITNESS = {
  eyebrow: "Beirut · one-on-one coaching",
  title: "Strength & Self-Defense",
  sub: "Martial arts, strength & personal training",

  freeFlag: "Free · no card · no obligation",
  freeTitle: "Your First Session Is Free.",
  freeBody:
    "One hour, one-on-one. I check how you move, we train, and you leave with a written plan. The plan is yours even if you never come back.",
  freeCta: "Book the free hour",
  secondaryCta: "See the prices",

  taughtAt: [
    "International College (IC)",
    "Combat Sports Academy",
    "Yarzeh Leisure Club",
  ],

  steps: [
    { n: "01", title: "Book the Free Hour", body: "Pick any open slot. No card, no forms." },
    { n: "02", title: "We Train", body: "A real session. I check how you move and find what is holding you back." },
    { n: "03", title: "You Keep the Plan", body: "Written down and yours. It works even if you train alone after this." },
    { n: "04", title: "Then You Decide", body: "Want me every week? Pick a package. If not, I won't chase you." },
  ],

  guarantee: {
    days: "90 days",
    title: "The 90-Day Promise",
    body: "Come to your sessions and follow the plan for 90 days. If you are not stronger, fitter or leaner, I keep coaching you for free until you are.",
    small: "You do the work. The result is my problem.",
  },

  // ⚠ CHECK the number, and change it when it changes. A limit nobody
  // enforces reads as a lie the first time somebody asks twice.
  scarcity: {
    line: "I coach 6 people one-on-one at a time.",
    sub: "When the slots are full, the free hour becomes a waitlist.",
  },

  faq: [
    {
      q: "I have never trained before. Is that a problem?",
      a: "No. That is most first sessions. We start where your body is, and nothing gets loaded until the movement is right.",
    },
    {
      q: "Where do we train?",
      a: "In Beirut, at whichever gym or academy suits you. Your building's gym works too if it has the basics. Tell me where you are and I will tell you.",
    },
    {
      q: "Is the first session really free?",
      a: "Yes. No card, and no obligation. You keep the plan either way.",
    },
    {
      q: "I already train a combat sport.",
      a: "Then your strength work is built around your mat schedule, so it adds to your training instead of stealing your recovery.",
    },
    {
      q: "Do you write nutrition plans?",
      a: "Yes, and they come with monthly coaching. I studied nutrition and exercise science at AUB, so your plan is built on how your body uses food.",
    },
    {
      q: "Can I pause a monthly package?",
      a: "Message me. Travel, exams and injuries happen.",
    },
  ],

  close: {
    title: "The Free Hour Costs You an Hour.",
    body: "Worst case, you get a session and a plan to keep, and you never hear from me again. Best case, you stop starting over.",
    cta: "Book the free hour",
  },
};
