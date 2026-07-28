/* Shared navigation source of truth: the desktop sidebar and the mobile
   bottom tab bar both render from this list, so they can never drift apart.

   Uniform, crisp SVG icons (same 24x24 viewBox, same stroke) so every nav
   item is exactly the same size and colour is driven by state via currentColor. */
export const Icon = {
  home: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 9.8 12 3l9 6.8V20a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1V9.8Z" />
    </svg>
  ),
  projects: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 18h6" />
      <path d="M10 21h4" />
      <path d="M12 3a6 6 0 0 0-3.8 10.6c.7.6 1.3 1.3 1.3 2.4h5c0-1.1.6-1.8 1.3-2.4A6 6 0 0 0 12 3Z" />
    </svg>
  ),
  videos: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="5" width="18" height="14" rx="3" />
      <path d="m10 9 5 3-5 3V9Z" fill="currentColor" stroke="none" />
    </svg>
  ),
  websites: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="9" />
      <path d="M3 12h18" />
      <path d="M12 3a14 14 0 0 1 0 18 14 14 0 0 1 0-18Z" />
    </svg>
  ),
  about: <span className="nav-glyph">@</span>,
  fitness: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M2.5 12.5H7l1.8-5 3 9 2-4H21.5" />
    </svg>
  ),
  work: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="7" width="18" height="13" rx="2" />
      <path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
      <path d="M3 12.5h18" />
    </svg>
  ),
  store: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 8h16l-1.2 11a2 2 0 0 1-2 1.8H7.2a2 2 0 0 1-2-1.8L4 8Z" />
      <path d="M9 8V6a3 3 0 0 1 6 0v2" />
    </svg>
  ),
  more: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
      <circle cx="5" cy="12" r="1.1" fill="currentColor" stroke="none" />
      <circle cx="12" cy="12" r="1.1" fill="currentColor" stroke="none" />
      <circle cx="19" cy="12" r="1.1" fill="currentColor" stroke="none" />
    </svg>
  ),
};

/* Full navigation, in sidebar order.
   `tab` marks the four items that get a permanent slot in the mobile bottom
   bar. The bar only fits four plus "More", so the slots go to the pages
   people can act on: Home, the design work, the Store (the one page that
   sells something directly) and coaching. Websites — the archive of client
   builds — moved behind "More" when the Store took its slot; flip the `tab`
   flags to swap them back.
   `short` is the compact label used in the narrow tab bar. */
export const NAV = [
  { to: "/", label: "Home", short: "Home", end: true, icon: Icon.home, tab: true },
  { to: "/projects", label: "Projects", short: "Projects", icon: Icon.projects, tab: true },
  { to: "/templates", label: "Website Store", short: "Store", icon: Icon.store, tab: true },
  { to: "/websites", label: "Websites", short: "Websites", icon: Icon.websites },
  { to: "/media", label: "Media", short: "Media", icon: Icon.videos },
  { to: "/about", label: "About", short: "About", icon: Icon.about },
  { to: "/fitness", label: "Fitness", short: "Fitness", icon: Icon.fitness, tab: true },
  { to: "/work-with-me", label: "Work With Me", short: "Hire Me", icon: Icon.work },
];

export const TAB_ITEMS = NAV.filter((n) => n.tab);
export const MORE_ITEMS = NAV.filter((n) => !n.tab);
