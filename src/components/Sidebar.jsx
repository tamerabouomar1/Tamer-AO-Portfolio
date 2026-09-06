import { NavLink, Link } from "react-router-dom";
import { NAV, SOCIALS } from "./navItems";
import ShinyText from "./ShinyText";
import { PROFILE_TAGLINE } from "../siteData";

/* Desktop sidebar. On phones this collapses to just the profile header —
   navigation there is handled by MobileTabBar (a bottom tab bar), so every
   section stays visible without opening a menu. */
export default function Sidebar() {
  return (
    <aside className="sidebar">
      <div className="sidebar__profile">
        <div className="avatar">
          <img src="/assets/avatar-square.webp?v=2" alt="Portrait of Tamer AO" />
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

      {/* The policy links.
          They live in the sidebar because this site has no footer: the layout
          is a fixed rail beside a scrolling column, so there is no bottom of
          the page for them to sit at. Putting them anywhere else would mean
          adding a footer to every route purely to hold four links.

          They have to be reachable from every page rather than from one. A
          privacy policy nobody can find is treated as a privacy policy that
          does not exist, and "linked from the homepage only" has failed that
          test before. */}
      <nav className="sidebar__legal" aria-label="Policies">
        <Link to="/privacy">Privacy</Link>
        <Link to="/cookies">Cookies</Link>
        <Link to="/terms">Terms</Link>
        <Link to="/refunds">Refunds</Link>
      </nav>
    </aside>
  );
}
