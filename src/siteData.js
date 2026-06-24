// Central place for content reused across pages.

export const CONTACT = {
  email: "tamerabouomar1@gmail.com",
  phone: "+961 70477595",
  phoneHref: "tel:+96170477595",
  // No Calendly yet — "Book a session / call" opens a pre-filled email.
  // Replace with "https://calendly.com/your-handle" when you have one.
  calendly: "mailto:tamerabouomar1@gmail.com?subject=Booking%20a%20session",
  instagram: "https://www.instagram.com/tamer_ao/",
  // TODO: this is the generic LinkedIn feed, not a public profile.
  // Replace with your profile URL e.g. https://www.linkedin.com/in/your-name
  linkedin: "https://www.linkedin.com/feed/",
};

export const VIDEO_SRC =
  "https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260328_105406_16f4600d-7a92-4292-b96e-b19156c7830a.mp4";

// helper: build an ordered carousel array of N optimized images for a project slug
const imgs = (slug, n) =>
  Array.from({ length: n }, (_, i) => `/assets/projects/${slug}-${i + 1}.jpg`);

// Projects — every card opens a popup carousel (`images`) with info (`desc`).
export const PROJECT_GROUPS = [
  {
    title: "Profiles",
    items: [
      {
        name: "Charbel Farah — Portfolio",
        tag: "Athlete profile",
        images: imgs("charbel", 14),
        desc: "A 14-page athlete portfolio for boxer Charbel Farah — editorial layouts, bold typography and a fight-ready identity under The Gulf Heritage.",
      },
      {
        name: "Contracts Design — Company Profile",
        tag: "Corporate",
        images: imgs("contracts", 5),
        desc: "Company profile and logo system for Contracts Design — clean, confident corporate layouts across cover, services and team.",
      },
    ],
  },
  {
    title: "Branding",
    items: [
      {
        name: "KARV Pilates Studio",
        tag: "Logo & identity",
        images: imgs("karv", 5),
        desc: "Logo and brand identity for KARV Pilates Studio — an elegant, minimal mark with a calm, premium boutique feel.",
      },
      {
        name: "BioGarden",
        tag: "Brand identity",
        images: imgs("biogarden", 4),
        desc: "Brand identity and product catalogue for BioGarden — a natural, organic food brand.",
      },
      {
        name: "MoCars / MoTrouble",
        tag: "Logo & motion",
        images: imgs("mocars", 1),
        desc: "Logo and logo-motion for MoCars / MoTrouble — a sharp automotive brand built for speed and attitude.",
      },
    ],
  },
  {
    title: "Clothing",
    product: true, // product renders -> contain image + caption below
    items: [
      {
        name: "OKIRO",
        tag: "Grappling wear",
        images: imgs("okiro", 6),
        desc: "OKIRO grappling wear — rashguard and shorts designs (God of War, Jiu-Jitsu Girl and more) built for BJJ training and competition.",
      },
      {
        name: "OKIRO × Gripline",
        tag: "Collab kit",
        images: imgs("oxg", 3),
        desc: "OKIRO × Gripline collaboration — a co-branded No-Gi capsule kit.",
      },
      {
        name: "10th Planet — Jiu Jitsu Beirut",
        tag: "Apparel & social",
        images: imgs("tenp", 12),
        desc: "Design work for 10th Planet Jiu Jitsu Beirut — rashguards, fight shorts, membership posts, weekly schedules and event flyers.",
      },
      {
        name: "PGC / PLAY",
        tag: "Apparel",
        images: imgs("pgc", 12),
        desc: "PGC / PLAY streetwear — a run of tee designs and mockups.",
      },
    ],
  },
  {
    title: "Other",
    items: [
      {
        name: "Environmental",
        tag: "Awareness campaign",
        images: imgs("environmental", 2),
        desc: "Environmental awareness campaign — flyer and certificate design.",
      },
      {
        name: "RFACE — Brochure",
        tag: "Brochure",
        images: imgs("reface", 2),
        desc: "Brochure design — a structured, photography-led layout system.",
      },
      {
        name: "Notebook Cover",
        tag: "Print",
        images: imgs("notebook", 1),
        desc: "Notebook cover design.",
      },
      {
        name: "Qasr Hyatt",
        tag: "Hospitality",
        images: imgs("qasr", 1),
        desc: "Hospitality design for Qasr Hyatt — refined collateral with a luxury feel.",
      },
    ],
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
