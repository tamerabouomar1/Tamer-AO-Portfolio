import { useEffect, useRef, useState } from "react";
import useTemplateFont from "../useTemplateFont";
import "./clarity.css";

/* ── Clarity — Analytics Landing (Signature) ───────────────────
   One composition on one screen: full-bleed cinematic film, the pitch stacked
   bottom-left, a glass demo card bottom-right. No second section, no stat
   strip, no logo wall — the restraint is the design.

   What carries it is the type and the entrance. Every size is a clamp against
   viewport HEIGHT (vh), not width, because the page never scrolls: the whole
   composition has to shrink into a short window instead of overflowing it.
   The headline sits at weight 500 with a horizontal scale under 0.8 on each
   line — the condensing is optical, so the two lines must never be given a
   transform of their own by an animation.

   The entrance is one shot, choreographed: chrome, then the headline lines
   clipping up out of their own masks, then copy, then the CTA, then the card
   last at 1040ms. While it runs the root carries .is-pending, which holds the
   first frame hidden; the card's own animationend is what releases it, with a
   3500ms backstop in case the animation never fires. */

const VIDEO =
  "https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260808_064556_051587f1-74a1-4336-8c05-4dde3594ed05.mp4";

const NAV = ["Home", "About", "Services", "Contact"];

function BrandLogo() {
  return (
    <svg className="vtg-brand__mark" width="25" height="25" viewBox="0 0 25 25" aria-hidden="true">
      <defs>
        <clipPath id="vtgDisc">
          <circle cx="12.5" cy="12.5" r="12.5" />
        </clipPath>
      </defs>
      <g clipPath="url(#vtgDisc)">
        <rect width="25" height="25" fill="#ededed" />
        <path d="M12.5 0 L25 12.5 L12.5 25 Z" fill="#737778" />
        <path d="M0 12.5 L12.5 0 L12.5 12.5 Z" fill="#fafafa" />
        <path d="M12.5 12.5 L25 12.5 L12.5 25 Z" fill="#050606" />
        <path d="M0 12.5 L12.5 12.5 L6.25 25 Z" fill="#0a0b0b" />
      </g>
    </svg>
  );
}

export default function ClaritySite() {
  useTemplateFont(
    "https://fonts.googleapis.com/css2?family=Archivo:wght@100..900&family=Bricolage+Grotesque:opsz,wght@12..96,300..800&display=swap"
  );

  const cardRef = useRef(null);
  const headerRef = useRef(null);
  const [pending, setPending] = useState(
    () => !window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
  const [menu, setMenu] = useState(false);

  /* The card is the last thing in the timeline, so its animationend is the
     signal that the entrance is over. The timeout is the backstop. */
  useEffect(() => {
    if (!pending) return;
    const card = cardRef.current;
    const done = () => setPending(false);
    card?.addEventListener("animationend", done);
    const t = setTimeout(done, 3500);
    return () => {
      card?.removeEventListener("animationend", done);
      clearTimeout(t);
    };
  }, [pending]);

  // Escape, outside pointer and any link close the collapsed menu.
  useEffect(() => {
    if (!menu) return;
    const onKey = (e) => {
      if (e.key === "Escape") setMenu(false);
    };
    const onDown = (e) => {
      if (!headerRef.current?.contains(e.target)) setMenu(false);
    };
    window.addEventListener("keydown", onKey);
    window.addEventListener("pointerdown", onDown);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("pointerdown", onDown);
    };
  }, [menu]);

  return (
    <main className={`vtg${pending ? " is-pending" : ""}`}>
      <section className="vtg-screen">
        <video
          className="vtg-background"
          autoPlay
          muted
          loop
          playsInline
          disablePictureInPicture
          aria-hidden="true"
        >
          <source src={VIDEO} type="video/mp4" />
        </video>

        <header className={`vtg-header${menu ? " menu-open" : ""}`} ref={headerRef}>
          <a className="vtg-brand" href="#top" aria-label="Vantage home">
            <BrandLogo />
          </a>

          <div className="vtg-actions" id="vtg-navigation">
            <nav className="vtg-nav" aria-label="Primary">
              {NAV.map((l, i) => (
                <a key={l} href="#top" className={i === 0 ? "is-active" : ""} onClick={() => setMenu(false)}>
                  {l}
                </a>
              ))}
            </nav>

            <div className="vtg-time">
              <span className="vtg-time__label">Timezone</span>
              <span className="vtg-time__value">9:47 PM&nbsp; • &nbsp;14 July 2026</span>
            </div>

            <button type="button" className="vtg-signup">
              Sign Up
            </button>
          </div>

          <button
            type="button"
            className="vtg-toggle"
            aria-expanded={menu}
            aria-controls="vtg-navigation"
            aria-label={menu ? "Close menu" : "Open menu"}
            onClick={() => setMenu((v) => !v)}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden="true">
              <line className="vtg-toggle__a" x1="4" y1="9" x2="20" y2="9" />
              <line className="vtg-toggle__b" x1="4" y1="15" x2="20" y2="15" />
            </svg>
          </button>
        </header>

        <section className="vtg-hero">
          <div className="vtg-hero__content">
            <h1 className="vtg-title">
              <span className="vtg-line vtg-line--one">
                <span className="vtg-reveal">Stop Digging</span>
              </span>
              <span className="vtg-line vtg-line--two">
                <span className="vtg-reveal">Through Dashboards.</span>
              </span>
            </h1>

            <p className="vtg-copy">
              Your metrics are scattered across a dozen dashboards.
              <br />
              Vantage bring them into one clear signal, so every
              <br />
              decision is backed by data you actually trust.
            </p>

            <button type="button" className="vtg-cta">
              <span className="vtg-cta__label">Get Started</span>
              <span className="vtg-cta__arrow" aria-hidden="true">
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#fff"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M5 12h13" />
                  <path d="m12 5 7 7-7 7" />
                </svg>
              </span>
            </button>
          </div>

          <article className="vtg-card" ref={cardRef}>
            <div className="vtg-visual">
              {/* The reference thumbnail is a licensed still; the smoke here is
                  drawn in CSS so the template ships with nothing to replace. */}
              <div className="vtg-visual__art" role="img" aria-label="Abstract red and blue smoke" />
              <button type="button" className="vtg-play" aria-label="Play demo">
                <svg width="12" height="14" viewBox="0 0 12 14" aria-hidden="true">
                  <path d="M1 1.2 10.6 7 1 12.8Z" fill="#fff" />
                </svg>
              </button>
            </div>
            <button type="button" className="vtg-watch">
              Watch Demo
            </button>
          </article>
        </section>
      </section>
    </main>
  );
}
