import { useState } from "react";
import { NavLink } from "react-router-dom";
import ShinyText from "./ShinyText";
import { CONTACT } from "../siteData";

/* Uniform, crisp SVG icons (same 24x24 viewBox, same stroke) so every nav
   item is exactly the same size and colour is driven by state via currentColor. */
const Icon = {
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
};

const NAV = [
  { to: "/", label: "Home", end: true, icon: Icon.home },
  { to: "/projects", label: "Projects", icon: Icon.projects },
  { to: "/media", label: "Media", icon: Icon.videos },
  { to: "/about", label: "About", icon: Icon.about },
  { to: "/fitness", label: "Fitness", icon: Icon.fitness },
  { to: "/work-with-me", label: "Work With Me", icon: Icon.work },
];

const svgProps = {
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.9,
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

const SOCIALS = [
  { href: CONTACT.instagram, label: "Instagram", icon: SocialIcon.instagram },
  { href: CONTACT.linkedin, label: "LinkedIn", icon: SocialIcon.linkedin },
  { href: CONTACT.phoneHref, label: "Phone", icon: SocialIcon.phone },
  { href: `mailto:${CONTACT.email}`, label: "Email", icon: SocialIcon.email },
];

export default function Sidebar() {
  const [open, setOpen] = useState(false);
  return (
    <aside className={"sidebar" + (open ? " is-open" : "")}>
      <div className="sidebar__profile">
        <div className="avatar">
          <img src="/assets/avatar-square.jpg?v=2" alt="Portrait of Tamer AO" />
        </div>
        <ShinyText as="h1" className="sidebar__name" text="Tamer AO" speed={4} />
      </div>

      <button
        className="nav-toggle"
        onClick={() => setOpen((o) => !o)}
        aria-label="Toggle menu"
        aria-expanded={open}
      >
        <span /><span /><span />
      </button>

      <nav className="nav" aria-label="Primary">
        {NAV.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            onClick={() => setOpen(false)}
            className={({ isActive }) => "nav-item" + (isActive ? " is-active" : "")}
          >
            {({ isActive }) => (
              <>
                <span className="nav-icon">{item.icon}</span>
                <span className="nav-label">
                  {/* active page = blue ShinyText; the rest stay plain white */}
                  {isActive ? (
                    <ShinyText text={item.label} speed={3} spread={100} />
                  ) : (
                    item.label
                  )}
                </span>
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
