import { useState } from "react";
import useTemplateFont from "../useTemplateFont";
import "./vibrant.css";

/* ── Vibrant — Holistic Wellness Hero ──────────────────────────
   One screen over a looping film: a glass nav pill, a social-proof badge, the
   headline, and two stats along the bottom.

   Every glass surface is the same recipe — a near-transparent fill, a 4px
   backdrop blur and a gradient border drawn by a masked ::before. The border
   has to be bright at the top and bottom edges and clear through the middle,
   which no single border colour can do.

   Icons are inline SVG. The reference called for lucide-react, which is a
   dependency and a build step for three glyphs. */

const VIDEO =
  "https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260715_082433_69699cf8-444b-4484-93cc-053e57896dfd.mp4";

const NAV = [
  { label: "Home", current: true },
  { label: "Our Approach" },
  { label: "Healing Methods" },
];

const FACES = [
  "https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=100",
  "https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=100",
  "https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=100",
  "https://images.pexels.com/photos/697509/pexels-photo-697509.jpeg?auto=compress&cs=tinysrgb&w=100",
];

const LOGO_PATH =
  "M 128 128 C 198.692 128 256 185.308 256 256 L 151.883 256 C 149.812 220.307 120.213 192 84 192 C 47.787 192 18.188 220.307 16.117 256 L 0 256 C 0 185.308 57.308 128 128 128 Z M 104.117 0 C 106.188 35.694 135.787 64 172 64 C 208.213 64 237.812 35.694 239.883 0 L 256 0 C 256 70.692 198.692 128 128 128 C 57.308 128 0 70.692 0 0 Z";

function UserIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"
      strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="12" cy="12" r="10" />
      <circle cx="12" cy="10" r="3" />
      <path d="M6.2 19.4A5 5 0 0 1 11 16h2a5 5 0 0 1 4.8 3.4" />
    </svg>
  );
}
function MenuIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"
      strokeLinecap="round" aria-hidden="true">
      <path d="M4 6h16" /><path d="M4 12h16" /><path d="M4 18h16" />
    </svg>
  );
}
function CloseIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"
      strokeLinecap="round" aria-hidden="true">
      <path d="M18 6 6 18" /><path d="m6 6 12 12" />
    </svg>
  );
}

/* Nine squares in a triangle. Positions are a fraction of the 20px box so the
   shape holds if the box is resized. */
const TRIANGLE = [
  [50, 0], [33, 33], [67, 33], [17, 67], [50, 67],
  [83, 67], [0, 100], [33, 100], [67, 100],
];

export default function VibrantSite() {
  useTemplateFont(
    "https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap"
  );

  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="vib">
      <video
        className="vib-video"
        src={VIDEO}
        autoPlay
        loop
        muted
        playsInline
        preload="auto"
      />

      <header className="vib-nav">
        <a className="vib-logo" href="#top" aria-label="Vibrant Wellness home">
          <svg viewBox="0 0 256 256" fill="currentColor" aria-hidden="true">
            <path d={LOGO_PATH} />
          </svg>
        </a>

        <nav className="vib-pill vib-glass">
          {NAV.map((n) => (
            <a key={n.label} href="#top" className={n.current ? "is-current" : ""}>
              {n.label}
            </a>
          ))}
        </nav>

        <span className="vib-account vib-glass" aria-hidden="true">
          <UserIcon />
        </span>

        <button
          type="button"
          className="vib-burger vib-glass"
          aria-expanded={menuOpen}
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          onClick={() => setMenuOpen((v) => !v)}
        >
          {/* Both glyphs stay mounted and cross-rotate, so the swap is a
              single motion rather than one icon popping out and another in. */}
          <span className={`vib-ico${menuOpen ? "" : " is-on"}`}><MenuIcon /></span>
          <span className={`vib-ico${menuOpen ? " is-on" : ""}`}><CloseIcon /></span>
        </button>
      </header>

      <div className={`vib-sheet${menuOpen ? " is-open" : ""}`}>
        <div className="vib-sheet-inner">
          {NAV.map((n) => (
            <a key={n.label} href="#top" onClick={() => setMenuOpen(false)}>
              {n.label}
            </a>
          ))}
          <div className="vib-sheet-acct">
            <span className="vib-account vib-glass" aria-hidden="true"><UserIcon /></span>
            <span>Account</span>
          </div>
        </div>
      </div>

      <main className={`vib-main${menuOpen ? " is-hidden" : ""}`}>
        <div className="vib-top">
          <div className="vib-badge vib-glass">
            <span className="vib-faces">
              {FACES.map((src) => (
                <img key={src} src={src} alt="" decoding="async" />
              ))}
            </span>
            <span className="vib-badge-text">our path to natural wellness</span>
          </div>

          <h1 className="vib-title">
            Heal Your Body
            <br />
            Naturally
          </h1>

          <p className="vib-sub">Holistic wellness. Transformative results.</p>

          <button className="vib-cta vib-glass" type="button">
            Begin Your Journey
          </button>
        </div>

        <div className="vib-stats">
          <div className="vib-stat">
            <span className="vib-tri" aria-hidden="true">
              {TRIANGLE.map(([x, y]) => (
                <i key={`${x}-${y}`} style={{ left: `${x}%`, top: `${y}%` }} />
              ))}
            </span>
            <span className="vib-stat-num">48 Hours</span>
            <span className="vib-stat-label">Initial Consultation</span>
          </div>

          <div className="vib-stat">
            <span className="vib-grid" aria-hidden="true">
              {Array.from({ length: 9 }, (_, i) => (
                <i key={i} className={i % 2 === 0 ? "is-on" : ""} />
              ))}
            </span>
            <span className="vib-stat-num">Initial Consultation</span>
            <span className="vib-stat-label">Healing Sessions</span>
          </div>
        </div>
      </main>
    </div>
  );
}
