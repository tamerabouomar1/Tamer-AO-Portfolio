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
