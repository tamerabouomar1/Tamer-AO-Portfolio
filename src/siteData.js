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
  care: "",
  business: "",
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
    name: "Rasif Aley",
    demo: "/demo/rasif-aley/index.html",
    tag: "Website design",
    image: "/assets/projects/web-rasif.jpg",
    full: "/assets/projects/web-rasif.jpg",
    desc: "A coffee shop in Aley, built on their real menu, their real photographs and their real reviews. Warm and unhurried, the way the place is.",
  },
  {
    name: "ACC",
    demo: "/demo/acc/index.html",
    tag: "Website design",
    image: "/assets/projects/web-acc.jpg",
    full: "/assets/projects/web-acc.jpg",
    desc: "Arabian Construction Company, building since 1967. Architectural graphite and red, with the history carrying the credibility rather than a claim about it.",
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

// ── The flagship website offer ────────────────────────────────
//
// Same structure as DEFENSE_PROGRAM above, and for the same reason: this page
// used to be a menu. Nine priced cards in three tables, all of them nameable,
// comparable and shoppable against any other freelancer in Beirut. A price
// table invites a visitor to compare and defer, which is the opposite of what
// the $100M Offers method is for.
//
// So the thing Tamer most wants to sell is no longer a column. It is one
// offer, to one starving crowd, built on the same four levers:
//
//   Value = (Dream Outcome × Perceived Likelihood) ÷ (Time Delay × Effort)
//
// `promise` is the dream outcome as a capability, `proof` raises the
// likelihood with sites that are actually running, `phases` collapses the time
// delay into a dated plan, and the bonuses plus the guarantee take the effort
// and the risk off the buyer.
//
// NAMING follows MAGIC: Goal ("Booked Out"), Interval (90 days), Container
// ("Program"), Avatar per track.
//
// THE STRUCTURE. The build is free and the money is monthly. That is not a
// discount — it is the "free installation" shape, and it works here because
// the agreement ALREADY runs a 12-month first term (see WEBSITE_CARE_NOTES).
// The build cost is recovered by about month five. `terms` states the early
// exit condition out loud rather than hiding it in the contract, because a
// buyer who discovers that later feels tricked and tells people so.
//
// TAMER, CONFIRM BEFORE THIS GOES LIVE:
//   1. The free build. You are fronting ~$850 of work against a 12-month
//      term. If a client leaves in month two you are out that work unless you
//      actually enforce `terms`. Only ship this if you will enforce it.
//   2. RATE_CARD below. Those are the numbers the stack is priced from. They
//      have to be what you would genuinely charge for each thing on its own,
//      because the total is only defensible if someone can ask you for the
//      breakdown and get it.
//   3. `intake.perMonth` — the site says you cap builds. Only true if you cap.
//   4. The bonuses are promises. Four reels, the copy written, the logo
//      animated, the Google profile fixed in week one. All four cost you
//      hours in month one, on top of the build.

/* What each line of the stack costs bought on its own. The stack total is only
   worth printing if every line traces back to a price Tamer would actually
   quote, so they live here in one place rather than as loose numbers. Two are
   already published elsewhere on the site: the build fee is the Starter+
   build, and REEL_RATE is the single-reel price on the services page. */
const RATE_CARD = {
  build: 850, // a designed multi-page site, one-off
  hostingMonth: 39, // what Care costs on its own
  seoPage: 120, // one page researched, written and optimised
  gmbMonth: 50, // Google Business run and posted to
  landingPage: 250, // a single-offer landing page
  trackingSetup: 200, // call, form and WhatsApp tracking wired up
  reportMonth: 40, // the monthly report
  logoAnimation: 150, // already quoted at this on the services page
  copywriting: 300, // a site's worth of copy from one interview
  gmbFix: 150, // profile claimed, corrected and photographed
};

export const WEBSITE_PROGRAM = {
  name: "Booked Out in 90 Days",
  kicker: "One site, built and run for you · Three tracks, one outcome",
  promise:
    "In 90 days, people searching for what you sell find you, land on a site that is actually yours, and contact you directly instead of through an app that keeps a third of it.",
  // Perceived likelihood: sites that are up and being used, not a claim.
  proof:
    "Already running for a burger shop in Aley, a manakish institution in Beirut, a barbershop, a coffee shop, a breathwork studio and a construction company that has been building since 1967. I build and run every one of them myself.",
  price: 199,
  period: "per month, 12-month term. The build costs you nothing.",
  cta: "Claim a build slot",

  // The route to the outcome, so 90 days reads as a plan and not a guess.
  phases: [
    {
      weeks: "Days 1–7",
      title: "Live",
      body: "Your Google Business profile is claimed and corrected, and the site goes up on your own domain. Your name, your number and your hours are right everywhere someone might look.",
    },
    {
      weeks: "Days 8–45",
      title: "Found",
      body: "Pages written around what people in your area actually type into Google, not what the industry calls it. Every call, form and WhatsApp message starts getting tracked back to where it came from.",
    },
    {
      weeks: "Days 46–90",
      title: "Enquiring",
      body: "A landing page built for your strongest offer, reels pointing at it, and the first report: what came in, where from, and what we do next month.",
    },
  ],

  tracks: [
    {
      id: "food",
      name: "Own Your Orders",
      who: "For restaurants, cafés and bakeries",
      pain: "Every order comes through an app that keeps a third of it, and you don't even get the customer's number.",
      outcome:
        "People order from you directly, on your own site, and you keep the whole ticket and the customer with it.",
      note: "The shape of what is already running for Kitchen Garage and Snack Faysal.",
    },
    {
      id: "booking",
      name: "Fill the Calendar",
      who: "For salons, clinics and studios",
      pain: "Bookings live in your DMs, you lose half of them to no-shows, and there is no record of who came or when.",
      outcome:
        "People book themselves in, get reminded, and turn up. You open the calendar in the morning and it is already full.",
      note: "The shape of what is already running for Saifi Barbershop.",
    },
    {
      id: "trade",
      name: "Get Found First",
      who: "For trades, contractors and services",
      pain: "All your work is word of mouth, and when someone finally searches for what you do, they find a competitor.",
      outcome:
        "You come up when someone in your area searches, with the work and the credibility already on the page before they call.",
      note: "The shape of what is already running for ACC and Sinar.",
    },
  ],

  // Trim and stack. Everything included over the first twelve months, priced
  // at what it costs bought on its own, so the gap against $199 is visible.
  stack: [
    { item: "The site itself, designed around your brand, up to 6 pages", value: RATE_CARD.build },
    {
      item: "Hosting, domain, SSL, backups and uptime monitoring, all year",
      value: RATE_CARD.hostingMonth * 12,
    },
    {
      item: "A page written and optimised to rank, every month",
      value: RATE_CARD.seoPage * 12,
    },
    {
      item: "Your Google Business profile run and posted to, every week",
      value: RATE_CARD.gmbMonth * 12,
    },
    {
      item: "A landing page built for each season or offer, four a year",
      value: RATE_CARD.landingPage * 4,
    },
    {
      item: "Every call, form and WhatsApp message tracked to its source",
      value: RATE_CARD.trackingSetup,
    },
    {
      item: "A report every month: what came in, and what we do next",
      value: RATE_CARD.reportMonth * 12,
    },
  ],

  // Each bonus answers the objection that lands AFTER the decision, in the
  // order people raise them: "how long until anything happens", "I haven't got
  // the words", "my logo is a JPEG", "what do I post while I wait".
  bonuses: [
    {
      name: "Your Google profile fixed in week one",
      value: RATE_CARD.gmbFix,
      body: "Claimed, corrected and photographed before the site is even live, so the map listing starts working while I am still building.",
    },
    {
      name: "All your copy written for you",
      value: RATE_CARD.copywriting,
      body: "One 45-minute call and I write the whole site from it. You do not write a word, and you do not hold the project up trying to.",
    },
    {
      name: "Your logo animated for the hero",
      value: RATE_CARD.logoAnimation,
      body: "The same logo motion I charge for on its own, on the first thing anyone sees.",
    },
    {
      name: "Four reels in your first month",
      value: REEL_RATE * 4,
      body: "Cut from your footage, captions and hooks written, pointed at the new site. Something to post the week it goes live.",
    },
  ],

  // Conditional guarantee, the same shape as SOCIAL_GUARANTEE: measurable
  // against a baseline recorded on day one, and paid in Tamer's hours rather
  // than in refunded cash, which is what makes it safe to offer and honest.
  //
  // TAMER: this only works if you write down their previous 90 days at
  // kickoff. Do it on day one or the promise has no baseline.
  guarantee: {
    title: "Beat your own 90 days, or the next three are free",
    body: "On day one we write down what came in over your previous 90 days: calls, messages, walk-ins. If the 90 days after launch have not beaten that number, you do not pay for months four, five or six, and I keep working straight through them.",
  },

  // Real constraint, not a countdown clock. He designs, writes and builds
  // every one of these himself, which is a hard ceiling on how many can run.
  intake: {
    perMonth: 3,
    label: "3 builds a month.",
    cadence: "New builds start on the first Monday of the month.",
    reason:
      "Three, because I design it, write it and build it myself. A fourth means all four wait.",
  },

  // Said out loud rather than buried in the agreement.
  terms:
    "The build is free against the 12-month term the agreement already runs. Leave before month twelve and the $850 build fee falls due, which is the only thing the free build is holding.",
};

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

// ── Keeping an existing site alive ────────────────────────────
// What is left of the old care table once Growth was promoted out of it and
// into WEBSITE_PROGRAM. These two are maintenance, and they are sold as
// maintenance: keeping a site up is not the same product as growing a
// business, and pricing them in the same table implied it was.
export const WEBSITE_CARE_PLANS = [
  {
    id: "care",
    name: "Care",
    tagline: "Online, backed up, watched",
    flat: 39,
    period: "per month, per site",
    features: [
      "Hosting, SSL, CDN and backups",
      "Domain registered and renewed",
      "Uptime monitoring",
      "2 content edits a month",
      "Reply within 5 business days",
    ],
    guarantee: "Down for more than a day and that month is free.",
  },
  {
    id: "business",
    name: "Business",
    tagline: "For a site that keeps moving",
    flat: 89,
    period: "per month, per site",
    featured: true,
    badge: "Most popular",
    features: [
      "Everything in Care",
      "6 content edits a month",
      "Reply within 2 business days",
      "2 new pages a year",
      "Monthly traffic report",
      "Basic SEO maintenance",
    ],
    guarantee: "Down for more than a day and that month is free.",
  },
];

/** What counts as a content edit, and what the monthly does not cover. */
export const WEBSITE_CARE_NOTES = [
  "A content edit is a change to existing text, images, prices or opening hours. New pages, new features and redesigns are quoted separately.",
  "Billed monthly in advance from launch day, in USD. Unused edits don't roll over.",
  "I run the hosting, domain and code while you're on a plan. Full ownership and domain transfer are available any time as a one-time buy-out.",
];

/** How many templates the gallery opens on. The rest are one click away and
    cost nothing either — this is a first screenful, NOT a paywall. Every
    template is free, and the membership sells the library and the fonts, so
    hiding templates behind it would be selling something already given away.
    It also caps how many live preview iframes exist before someone asks. */
export const GALLERY_PREVIEW_COUNT = 12;

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
