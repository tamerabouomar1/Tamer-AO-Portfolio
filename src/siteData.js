// Central place for content reused across pages.
// Contact details come straight from the Figma design (intended public).

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

// Projects grouped as in the Figma "Projects" screen.
// `images` powers the click-to-open popup carousel; `desc` is the info text.
export const PROJECT_GROUPS = [
  {
    title: "Profiles",
    items: [
      {
        name: "Charbel Farah — Portfolio",
        tag: "Athlete profile",
        images: [
          "/assets/projects/charbel-1.jpg",
          "/assets/projects/charbel-2.jpg",
          "/assets/projects/charbel-3.jpg",
          "/assets/projects/charbel-4.jpg",
        ],
        desc: "A bold athlete portfolio for boxer Charbel Farah — editorial layout, dramatic typography and a fight-ready visual identity under The Gulf Heritage.",
      },
      {
        name: "Contracts Design — Company Profile",
        tag: "Corporate",
        images: [
          "/assets/projects/contracts-1.jpg",
          "/assets/projects/contracts-2.jpg",
          "/assets/projects/contracts-3.jpg",
          "/assets/projects/contracts-4.jpg",
        ],
        desc: "A corporate company profile for Contracts Design — structured, confident layouts presenting services, team and projects.",
      },
    ],
  },
  {
    title: "Branding",
    items: [
      {
        name: "KARV Pilates Studio",
        tag: "Logo & identity",
        images: ["/assets/projects/karv.jpg"],
        desc: "Logo and brand identity for KARV Pilates Studio — an elegant, minimal mark with a calm, premium boutique feel.",
      },
      {
        name: "MoCars / MoTrouble",
        tag: "Logo & identity",
        images: ["/assets/projects/mocars.jpg"],
        desc: "Logo, identity and logomotion for MoCars / MoTrouble — a sharp automotive brand built for speed and attitude.",
      },
      {
        name: "BioGarden",
        tag: "Brand identity",
        images: ["/assets/projects/biogarden.jpg"],
        desc: "Brand identity for BioGarden — a natural, organic food brand spanning packaging, labels and marketing collateral.",
      },
    ],
  },
  {
    title: "Clothing",
    product: true, // product renders -> contain image + caption below
    items: [
      {
        name: "OKIRO × Gripline",
        tag: "Collab — OXG kit",
        images: ["/assets/projects/okiro-oxg.jpg", "/assets/projects/okiro-oxg-gi.jpg"],
        desc: "OKIRO × Gripline 'OXG — Grapple Division': a full No-Gi kit — rashguard, fight shorts and a gi — with sublimated graphics, reinforced seams and 4-way stretch. Discipline through struggle.",
      },
      {
        name: "OKIRO — God of War",
        tag: "Rashguard",
        images: ["/assets/projects/godofwar-front.jpg", "/assets/projects/rashguard-godofwar.jpg"],
        desc: "OKIRO grappling rashguard — a red-and-black 'God of War' design with bold panels and a thorn motif, built for BJJ training and competition.",
      },
      {
        name: "OKIRO — Wanted",
        tag: "Rashguard & shorts",
        images: [
          "/assets/projects/wanted-front.jpg",
          "/assets/projects/rashguard-wanted.jpg",
          "/assets/projects/wanted-shorts.jpg",
        ],
        desc: "OKIRO 'Wanted: Dead or Alive' set — a grappler's wanted-poster concept (front, back and matching shorts) that lists your favourite submissions as the charges.",
      },
      {
        name: "OKIRO — JJ Girl",
        tag: "Rashguard & shorts",
        images: ["/assets/projects/jj-girl-rashguard.jpg", "/assets/projects/jj-girl-shorts.jpg"],
        desc: "Women's 'Jiu-Jitsu Girl' set for OKIRO — a floral rashguard and matching grappling shorts in pink, white and magenta line-art over a matte black base.",
      },
      {
        name: "OKIRO — Armbar",
        tag: "Headwear",
        images: ["/assets/projects/okiro-armbar.jpg", "/assets/projects/okiro-cap.jpg"],
        desc: "OKIRO 'Armbar' headwear — a clean trucker-cap line for the grappling / training-gear range. Stand out.",
      },
      {
        name: "10th Planet — Beirut",
        tag: "Rashguard",
        images: ["/assets/projects/10p-white-front.jpg", "/assets/projects/10p-white-back.jpg"],
        desc: "Competition rashguard for 10th Planet Jiu Jitsu Beirut — the white colourway, with patterned sleeves and a clean centre crest for the No-Gi academy.",
      },
      {
        name: "PGC — Play Tee",
        tag: "Apparel",
        images: ["/assets/projects/tee-2.jpg"],
        desc: "Streetwear tee for PGC / PLAY — relaxed apparel with clean logo placement.",
      },
    ],
  },
  {
    title: "Other",
    items: [
      {
        name: "RFACE — Brochure",
        tag: "Brochure",
        images: ["/assets/projects/reface.jpg"],
        desc: "Brochure design for RFACE — a structured, photography-led layout system.",
      },
      {
        name: "Resilience & Reflection Retreat",
        tag: "Event — Environmental",
        images: ["/assets/projects/environmental.jpg"],
        desc: "Event and environmental design for a Resilience & Reflection retreat — calm, grounded visuals across flyers and signage.",
      },
      {
        name: "Qasr Hyatt",
        tag: "Hospitality",
        images: ["/assets/projects/qasr-hyatt.jpg"],
        desc: "Hospitality design work for Qasr Hyatt — refined collateral with a luxury feel.",
      },
    ],
  },
];

// Weekly class schedule from the Fitness screen.
export const SCHEDULE = [
  { day: "MON", classes: ["JIU-JITSU CSA"] },
  { day: "TUE", classes: ["S&C"] },
  { day: "WED", classes: ["S&C"] },
  { day: "THUR", classes: ["REST"] },
  { day: "FRI", classes: ["S&C"] },
  { day: "SAT", classes: ["OPEN MAT"] },
  { day: "SUN", classes: ["JIU-JITSU CSA", "JIU-JITSU Yarz"] },
];
