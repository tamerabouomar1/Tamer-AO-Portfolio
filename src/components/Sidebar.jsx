import { NavLink } from "react-router-dom";
import { NAV } from "./navItems";
import ShinyText from "./ShinyText";
import { CONTACT, PROFILE_TAGLINE } from "../siteData";

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
const SOCIALS = [
  { href: CONTACT.instagram, label: "Instagram", icon: SocialIcon.instagram },
  CONTACT.linkedin && !CONTACT.linkedin.includes("/feed")
    ? { href: CONTACT.linkedin, label: "LinkedIn", icon: SocialIcon.linkedin }
    : null,
  { href: CONTACT.phoneHref, label: "Phone", icon: SocialIcon.phone },
  { href: `mailto:${CONTACT.email}`, label: "Email", icon: SocialIcon.email },
].filter(Boolean);

/* Desktop sidebar. On phones this collapses to just the profile header —
   navigation there is handled by MobileTabBar (a bottom tab bar), so every
   section stays visible without opening a menu. */
export default function Sidebar() {
  return (
    <aside className="sidebar">
      <div className="sidebar__profile">
        <div className="avatar">
          <img src="/assets/avatar-square.jpg?v=2" alt="Portrait of Tamer AO" />
        </div>
        <div className="sidebar__id">
          {/* Was an <h1>. It rendered on EVERY page, ahead of the page's own
              heading, so all eight pages announced themselves to a crawler as
              "Tamer AO" and the heading that says what the page is about came
              second. A site name in a persistent sidebar is identity, not the
              heading of the document — the page's own <h1> is in its topbar. */}
          <ShinyText as="p" className="sidebar__name" text="Tamer AO" speed={4} />
          <p className="sidebar__tagline">{PROFILE_TAGLINE}</p>
        </div>
      </div>

      <nav className="nav" aria-label="Primary">
        {NAV.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            className={({ isActive }) => "nav-item" + (isActive ? " is-active" : "")}
          >
            {() => (
              <>
                <span className="nav-icon">{item.icon}</span>
                {/* The active page is marked by weight, colour and the rule
                    under it (see .nav-item.is-active), not by a highlight
                    sweeping across the word on a loop. */}
                <span className="nav-label">{item.label}</span>
                {/* Marks the free page in the nav itself, so the offer is
                    visible from every route without a banner. */}
                {item.flag && <span className="nav-flag">{item.flag}</span>}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      <div className="socials">
        {SOCIALS.map((s) => (
          <a
            key={s.label}
            className="social"
            href={s.href}
            aria-label={s.label}
            target={s.href.startsWith("http") ? "_blank" : undefined}
            rel={s.href.startsWith("http") ? "noreferrer" : undefined}
          >
            {s.icon}
          </a>
        ))}
      </div>
    </aside>
  );
}
