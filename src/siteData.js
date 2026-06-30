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
        name: "BioGarden",
        tag: "Brand identity",
        images: imgs("biogarden", 4),
        desc: "Brand identity and a product catalogue for BioGarden, a natural, organic food brand.",
      },
      {
        name: "MoCars / MoTrouble",
        tag: "Logo, motion & poster",
        images: imgs("mocars", 3),
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
    title: "Social Media",
    product: true,
    items: [
      {
        name: "10th Planet Social Media",
        tag: "Posts & flyers",
        images: imgs("tenp-soc", 6),
        desc: "Social-media design for 10th Planet Jiu Jitsu Beirut, covering membership posts, event flyers, the US Embassy seminar and the weekly schedule.",
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
        images: imgs("tenp-app", 5),
        desc: "Apparel for 10th Planet Jiu Jitsu Beirut, including competition rashguards and fight shorts across Lebanon, military and other designs.",
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
    title: "Other",
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

// Websites — shown on the Media page.
export const WEBSITES = [
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
