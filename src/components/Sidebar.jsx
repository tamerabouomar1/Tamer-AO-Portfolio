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
};

const NAV = [
  { to: "/", label: "Home", end: true, icon: Icon.home },
  { to: "/projects", label: "Projects", icon: Icon.projects },
  { to: "/media", label: "Media", icon: Icon.videos },
  { to: "/about", label: "About", icon: Icon.about },
  { to: "/fitness", label: "Fitness", icon: Icon.fitness },
];

const SOCIALS = [
  { href: CONTACT.instagram, label: "Instagram", src: "/assets/icon-instagram.png" },
  { href: CONTACT.linkedin, label: "LinkedIn", src: "/assets/icon-linkedin.png" },
  { href: CONTACT.phoneHref, label: "Phone", src: "/assets/icon-phone.png" },
  { href: `mailto:${CONTACT.email}`, label: "Email", src: "/assets/icon-letter.png" },
];

export default function Sidebar() {
  const [open, setOpen] = useState(false);
  return (
    <aside className={"sidebar" + (open ? " is-open" : "")}>
      <div className="sidebar__profile">
        <div className="avatar">
          <img src="/assets/avatar.jpg" alt="Portrait of Tamer AO" />
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
            <img src={s.src} alt="" />
          </a>
        ))}
      </div>
    </aside>
  );
}
