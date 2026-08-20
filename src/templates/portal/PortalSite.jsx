import { useEffect, useState } from "react";
import useTemplateFont from "../useTemplateFont";
import "./portal.css";

/* ── Portal — AI Infrastructure Hero (Signature) ───────────────
   A black void with one figure walking into a door of light, the pitch on the
   left, four partner marks sitting in the bottom fade. One composition: no
   stats, no chips, no second block.

   THE UNIT SYSTEM is the interesting part. Everything is measured in --u,
   which is one design pixel of a 1487x1058 frame locked to viewport HEIGHT:

     --u: calc(100dvh / 1058)

   Vertical rhythm therefore always fills the screen exactly — nav at 27u,
   headline at 230.5u, logo strip at 995u, baseline at 1058u — and the left
   column stays anchored 75u in. Type uses --h instead, a clamp that lets it
   grow up to 16% on an ultra-wide frame but never shrink below the
   height-locked value, so a very wide window gets larger type rather than a
   stretched layout.

   The film is a plane, not a card: full-bleed, with only the measured edge and
   bottom fades over it. Those fades are the ONLY thing allowed on top of it —
   the letterbox gradient masks the plate's own edges at exactly 746u/676u, and
   the bottom fade is where the partner marks live. */

const VIDEO =
  "https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260808_112712_da9d53df-6d27-4b12-bdf6-aa9dc2622bdf.mp4";

const LINKS = [
  { label: "About", href: "#about" },
  { label: "Features", href: "#features" },
  { label: "FAQ", href: "#faq" },
  { label: "Contact", href: "#contact" },
];

function BrandMark() {
  return (
    <svg className="ptl-mark" viewBox="0 0 31.5 48.5" aria-hidden="true">
      <defs>
        <linearGradient id="ptlBg1" x1="8" y1="0" x2="34.1" y2="28.9" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#9e9e9e" />
          <stop offset=".28" stopColor="#a6a6a6" />
          <stop offset=".34" stopColor="#a3a3a3" />
          <stop offset=".4" stopColor="#3a3a3a" />
          <stop offset=".55" stopColor="#414141" />
          <stop offset=".6" stopColor="#7a7a7a" />
          <stop offset=".68" stopColor="#8e8e8e" />
          <stop offset=".8" stopColor="#a9a9a9" />
          <stop offset=".95" stopColor="#c4c4c4" />
          <stop offset="1" stopColor="#cccccc" />
        </linearGradient>
      </defs>
      <path
        d="M21.5 0 L21.5 19.5 L31.5 19.5 L31.5 29 L10 48.5 L10 28.5 L0.5 28.5 L0.5 18.5 Z"
        fill="url(#ptlBg1)"
      />
      <rect x="0.5" y="18.5" width="9" height="10" fill="#fdfdfd" />
      <rect x="22" y="19.5" width="9.5" height="9.5" fill="#fdfdfd" />
    </svg>
  );
}

/* Four partner marks, drawn: a square with a circular bite, a split dual form,
   a ringed swirl, and a wave mound. currentColor is --strip throughout. */
const MARKS = [
  (
    <svg viewBox="0 0 30 31" key="m1" aria-hidden="true">
      <defs>
        <mask id="ptlBite">
          <rect width="30" height="31" fill="#fff" />
          <circle cx="19.5" cy="10.5" r="5.1" fill="#000" />
        </mask>
      </defs>
      <rect x="1.5" y="2" width="27" height="27" rx="6" fill="currentColor" mask="url(#ptlBite)" />
      <circle cx="19.5" cy="10.5" r="3.1" fill="currentColor" />
    </svg>
  ),
  (
    <svg viewBox="0 0 25 30" key="m2" aria-hidden="true">
      <rect x="1" y="2" width="7" height="26" fill="currentColor" />
      <path d="M11 15a7 7 0 0 1 7-7 7 7 0 0 1 0 14 7 7 0 0 1-7-7Z" fill="currentColor" />
      <path d="M18 8a7 7 0 0 0 0 14 7 7 0 0 0 0-14Z" fill="currentColor" opacity=".55" />
    </svg>
  ),
  (
    <svg viewBox="0 0 28 28" key="m3" aria-hidden="true">
      <circle cx="14" cy="14" r="12.35" fill="none" stroke="currentColor" strokeWidth="3.1" />
      <path d="M6 17c4-6 12-6 16 0" fill="none" stroke="currentColor" strokeWidth="3.1" strokeLinecap="round" />
      <path d="M9 10c3.4 3 6.6 3 10 0" fill="none" stroke="currentColor" strokeWidth="3.1" strokeLinecap="round" />
    </svg>
  ),
  (
    <svg viewBox="0 0 28 25.5" key="m4" aria-hidden="true">
      <path d="M2 12C6 3 11 3 14 8s7 5 12-2v6H2Z" fill="currentColor" />
      <path d="M2 19c4-4 8-4 12 0" fill="none" stroke="currentColor" strokeWidth="3.05" strokeLinecap="round" />
      <path d="M14 23c4-4 8-4 12 0" fill="none" stroke="currentColor" strokeWidth="3.05" strokeLinecap="round" />
    </svg>
  ),
];

export default function PortalSite() {
  useTemplateFont("https://fonts.googleapis.com/css2?family=Manrope:wght@200..800&display=swap");
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") setOpen(false);
    };
    // a rotation back to landscape has nowhere to put the overlay
    const onResize = () => {
      if (window.innerWidth / window.innerHeight > 1.1) setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    window.addEventListener("resize", onResize);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  return (
    <div className={`ptl-stage${open ? " is-open" : ""}`}>
      <div className="ptl-plate">
        <video className="ptl-video" autoPlay muted loop playsInline preload="auto" aria-hidden="true">
          <source src={VIDEO} type="video/mp4" />
        </video>
      </div>

      <header className="ptl-topbar">
        <a className="ptl-brand" href="#top" aria-label="Home">
          <BrandMark />
        </a>

        <nav className="ptl-links" aria-label="Primary">
          {LINKS.map((l) => (
            <a key={l.label} href={l.href}>
              {l.label}
            </a>
          ))}
        </nav>

        <a className="ptl-pill ptl-pill--nav" href="#top">
          <span>Get Started</span>
        </a>

        <button
          type="button"
          className="ptl-burger"
          aria-expanded={open}
          aria-label={open ? "Close menu" : "Open menu"}
          onClick={() => setOpen((v) => !v)}
        >
          <i />
          <i />
        </button>
      </header>

      <nav className="ptl-menu" aria-hidden={!open} aria-label="Menu">
        <div className="ptl-menu__inner">
          <p className="ptl-menu__eyebrow">Menu</p>
          <ul className="ptl-menu__list">
            {LINKS.map((l) => (
              <li key={l.label}>
                <a href={l.href} tabIndex={open ? 0 : -1} onClick={() => setOpen(false)}>
                  {l.label}
                </a>
              </li>
            ))}
          </ul>
          <div className="ptl-menu__foot">
            <a className="ptl-pill" href="#top" tabIndex={open ? 0 : -1}>
              <span>Get Started</span>
            </a>
            <a className="ptl-ghost" href="#top" tabIndex={open ? 0 : -1}>
              View Architecture
            </a>
          </div>
        </div>
      </nav>

      <main className="ptl-hero">
        {/* the explicit spaces matter: portrait sets these spans to `inline` so
            the two lines flow into one paragraph, and JSX would otherwise join
            them with no word break at all */}
        <h1 className="ptl-headline">
          <span>The Next Layer</span>{" "}
          <span>of Intelligence</span>
        </h1>
        <p className="ptl-sub">
          <span>A unified infrastructure platform to help teams build,</span>{" "}
          <span>ship, and scale AI systems with confidence.</span>
        </p>
        <div className="ptl-actions">
          <a className="ptl-pill ptl-pill--cta" href="#top">
            <span>Get Started</span>
          </a>
          <a className="ptl-ghost" href="#top">
            View Architecture
          </a>
        </div>
      </main>

      <div className="ptl-logos" aria-label="Trusted by">
        {MARKS.map((mark, i) => (
          <div className={`ptl-lg ptl-lg${i + 1}`} key={i}>
            {mark}
            <span className="ptl-lg__word">
              logoipsum
              {i === 1 && <b className="ptl-dot" aria-hidden="true" />}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
