import { CONTACT } from "../siteData";

/* Shared navigation source of truth: the desktop sidebar and the mobile
   bottom tab bar both render from this list, so they can never drift apart.

   Three rules keep this set looking like one set. Break any of them and the
   icons go soft or ragged at tab-bar size, which is exactly what happened
   before:

   1. SAME OPTICAL BOX. "Same viewBox" is not the same thing as "same size on
      screen" — the artwork inside has to agree too. Everything here is drawn
      to x 3–21 and centred on y 12. Fitness used to be a bare 19×9 ECG line
      and the gift sat 1.5 units low, next to a house and a briefcase that
      filled their boxes.

   2. HALF-PIXEL GRID, EVEN STROKE. Every straight edge sits on a .0 or .5
      coordinate and the stroke is 2. A stroke of width w centred on c has its
      edges at c ± w/2, so with w = 2 any whole or half coordinate puts both
      edges exactly on the device pixel grid at 1x and 2x. At the old 1.8 the
      edges landed on x.9 and x.1 and every line was antialiased into a smear.
      Render these at 24 CSS px (see .tab__icon / .nav-icon) — scaling 24 units
      into a 23px box reintroduces the same blur.

   3. currentColor ONLY, never a fill opacity. Transparency belongs to the
      colour the nav sets, and that colour is opaque grey; a half-transparent
      stroke reads as a broken icon rather than a dimmed one. */
export const Icon = {
  home: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 9.5 12 3l9 6.5V20a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1V9.5Z" />
    </svg>
  ),
  projects: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 18.5h6" />
      <path d="M10 21h4" />
      <path d="M12 3a6.5 6.5 0 0 0-4 11.5c.5.5 1 1.5 1 2.5h6c0-1 .5-2 1-2.5A6.5 6.5 0 0 0 12 3Z" />
    </svg>
  ),
  videos: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="4.5" width="18" height="15" rx="3" />
      <path d="m10 8.5 5.5 3.5-5.5 3.5v-7Z" fill="currentColor" stroke="none" />
    </svg>
  ),
  websites: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="9" />
      <path d="M3 12h18" />
      <path d="M12 3a14 14 0 0 1 0 18 14 14 0 0 1 0-18Z" />
    </svg>
  ),
  about: <span className="nav-glyph">@</span>,
  /* Gift, sitting on the same baseline as the house rather than 1.5 units
     below it: the box is y 9–20 with the ribbon loops filling 4.5–9 above. */
  free: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="9" width="18" height="11" rx="2" />
      <path d="M3 13.5h18" />
      <path d="M12 9v11" />
      <path d="M12 9C10.5 6 9 4.5 7.5 4.5a2.5 2.5 0 0 0 0 4.5H12Z" />
      <path d="M12 9c1.5-3 3-4.5 4.5-4.5a2.5 2.5 0 0 1 0 4.5H12Z" />
    </svg>
  ),
  /* Dumbbell, not the old ECG line. A single flat stroke has no mass at tab
     size, so Fitness looked like a half-loaded icon next to its neighbours —
     and a pulse says "heart rate" where the page is strength and jiu-jitsu. */
  fitness: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="5.5" width="4.5" height="13" rx="2" />
      <rect x="16.5" y="5.5" width="4.5" height="13" rx="2" />
      <path d="M7.5 12h9" />
    </svg>
  ),
  work: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="7" width="18" height="13.5" rx="2" />
      <path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
      <path d="M3 12.5h18" />
    </svg>
  ),
  store: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 8h16l-1 11.5a2 2 0 0 1-2 1.5H7a2 2 0 0 1-2-1.5L4 8Z" />
      <path d="M9 8V6a3 3 0 0 1 6 0v2" />
    </svg>
  ),
  /* Three dots can never fill the box, so they carry their weight in diameter
     instead: 3px across, against the 2px stroke everything else is drawn in.
     Whole-and-half centres keep their edges on the pixel grid too. */
  more: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
      <circle cx="5.5" cy="12" r="1.5" fill="currentColor" stroke="none" />
      <circle cx="12" cy="12" r="1.5" fill="currentColor" stroke="none" />
      <circle cx="18.5" cy="12" r="1.5" fill="currentColor" stroke="none" />
    </svg>
  ),
};

/* Full navigation, in sidebar order.
   `tab` marks the five items that get a permanent slot in the mobile bottom
   bar — Home, the free offers, and the three things people pay for. Projects,
   Media and About live behind "More": they are what someone reads to decide,
   not what they arrive for.

   The ready-made site store deliberately has NO nav entry of its own: it is
   a section of the Websites page, which is where someone shopping for a
   website already goes.

   `short` is the compact label used in the narrow tab bar, where six slots
   have to share the width of a phone — so "Services" is "Work" and "Fitness"
   is "Train" there while the sidebar keeps the full word. */
export const NAV = [
  { to: "/", label: "Home", short: "Home", end: true, icon: Icon.home, tab: true },
  { to: "/free", label: "Start Free", short: "Free", icon: Icon.free, tab: true },
  { to: "/work-with-me", label: "Services", short: "Work", icon: Icon.work, tab: true },
  { to: "/websites", label: "Websites", short: "Sites", icon: Icon.websites, tab: true },
  { to: "/fitness", label: "Fitness", short: "Train", icon: Icon.fitness, tab: true },
  { to: "/projects", label: "Projects", short: "Projects", icon: Icon.projects },
  { to: "/media", label: "Media", short: "Media", icon: Icon.videos },
  { to: "/about", label: "About", short: "About", icon: Icon.about },
];

export const TAB_ITEMS = NAV.filter((n) => n.tab);
export const MORE_ITEMS = NAV.filter((n) => !n.tab);


/* ── Contact links ───────────────────────────────────────────────
 *
 * These lived in Sidebar.jsx, where only desktop could reach them: the
 * stylesheet hides `.socials` along with `.nav` below 760px, so a phone
 * visitor had no Instagram, phone or email link anywhere in the site chrome.
 * That is the wrong way round — the Instagram bio link opens in an in-app
 * browser on a phone, which is where most of this traffic lands.
 *
 * Here for the same reason NAV is here: the sidebar and the tab bar both
 * render from one list, so the two can never drift apart.
 */
/* strokeWidth 2, not 1.9, and rendered at 24px — same rule as the nav icons in
   navItems.jsx: an even stroke on whole coordinates puts both edges on the
   device pixel grid, where 1.9 scaled into a 20px box landed everything on
   thirds of a pixel and softened every line. */
const svgProps = {
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 2,
  strokeLinecap: "round",
  strokeLinejoin: "round",
};

const SocialIcon = {
  instagram: (
    <svg {...svgProps}>
      <rect x="2" y="2" width="20" height="20" rx="5" />
      <circle cx="12" cy="12" r="4.2" />
      <circle cx="17.5" cy="6.5" r="1.1" fill="currentColor" stroke="none" />
    </svg>
  ),
  linkedin: (
    <svg {...svgProps}>
      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
      <rect width="4" height="12" x="2" y="9" />
      <circle cx="4" cy="4" r="2" />
    </svg>
  ),
  phone: (
    <svg {...svgProps}>
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.8 19.8 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.12 4.18 2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.91.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92z" />
    </svg>
  ),
  email: (
    <svg {...svgProps}>
      <rect width="20" height="16" x="2" y="4" rx="2" />
      <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
    </svg>
  ),
};

/* Built from CONTACT so a link only ever appears once it points somewhere.
   LinkedIn is filtered out on purpose while CONTACT.linkedin is the generic
   /feed/ URL: that sends a visitor to their own LinkedIn homepage instead of
   to Tamer, which is worse than having no icon at all. Set a real profile URL
   in siteData.js and the icon comes back by itself. */
export const SOCIALS = [
  { href: CONTACT.instagram, label: "Instagram", icon: SocialIcon.instagram },
  CONTACT.linkedin && !CONTACT.linkedin.includes("/feed")
    ? { href: CONTACT.linkedin, label: "LinkedIn", icon: SocialIcon.linkedin }
    : null,
  { href: CONTACT.phoneHref, label: "Phone", icon: SocialIcon.phone },
  { href: `mailto:${CONTACT.email}`, label: "Email", icon: SocialIcon.email },
].filter(Boolean);
