import { useEffect, useRef, useState } from "react";
import useTemplateFont from "../useTemplateFont";
import "./echoid.css";

/* ── Echoid — Voice Identity Hero ──────────────────────────────
   Three rows on a full-bleed film: nav, a signup panel pinned right, legal.
   The left two-thirds is deliberately empty — the video is the content there,
   and the scrim only darkens the edge the form sits on.

   The mobile menu opens as a circle wiped out from the burger itself rather
   than a slide or a fade. Because the panel is fixed and covers the page, it
   is inert and aria-hidden while closed: without that, a screen reader walks
   straight into four links that are not on screen, and Tab lands in them.

   Escape closes it, the body stops scrolling behind it, focus returns to the
   button that opened it, and crossing to desktop closes it — otherwise a
   rotate to landscape leaves an invisible overlay swallowing every click. */

const VIDEO =
  "https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260806_133255_956f653f-5d80-4b06-abd5-0f46c98b60fa.mp4";
const POSTER =
  "https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260806_132328_5f9029c8-218f-4489-82b6-29ff2849920e.png";

const LINKS = [
  { label: "Story", href: "#story" },
  { label: "Platforms", href: "#platforms" },
  { label: "Identity", href: "#identity" },
  { label: "Contact", href: "#contact" },
];

export default function EchoidSite() {
  useTemplateFont(
    "https://fonts.googleapis.com/css2?family=Sora:wght@200;300;400&family=JetBrains+Mono:wght@300;400;500&display=swap"
  );

  const [open, setOpen] = useState(false);
  const toggleRef = useRef(null);
  const menuRef = useRef(null);

  // Escape to close, and hold the page still while the overlay is up.
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => {
      if (e.key === "Escape") {
        setOpen(false);
        toggleRef.current?.focus();
      }
    };
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [open]);

  /* Crossing into desktop hides the toggle. Leaving `open` true would strand
     a fullscreen overlay with no way to dismiss it. */
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 901px)");
    const sync = (e) => e.matches && setOpen(false);
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  // `inert` is a property, not an attribute React understands on all versions.
  useEffect(() => {
    const el = menuRef.current;
    if (el) el.inert = !open;
  }, [open]);

  const close = () => setOpen(false);

  return (
    <section className="ech">
      {/* The poster doubles as the reduced-motion still: the stylesheet drops
          the <video> and paints this instead, so there is always a face. */}
      <div className="ech-media" style={{ "--ech-poster": `url("${POSTER}")` }}>
        <video
          className="ech-video"
          src={VIDEO}
          poster={POSTER}
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
        />
        <div className="ech-scrim" />
      </div>

      <header className="ech-nav">
        <a className="ech-logo" href="#top">ECHOID</a>

        <nav className="ech-navright">
          <div className="ech-links">
            {LINKS.map((l) => (
              <a key={l.label} href={l.href}>{l.label}</a>
            ))}
          </div>
          <a className="ech-cta" href="#join">Join up</a>

          <button
            ref={toggleRef}
            type="button"
            className={`ech-burger${open ? " is-open" : ""}`}
            aria-expanded={open}
            aria-controls="echoidMenu"
            aria-label={open ? "Close menu" : "Open menu"}
            onClick={() => setOpen((v) => !v)}
          >
            <span /><span /><span />
          </button>
        </nav>
      </header>

      <div
        id="echoidMenu"
        ref={menuRef}
        className={`ech-menu${open ? " is-open" : ""}`}
        role="dialog"
        aria-modal="true"
        aria-label="Site menu"
        aria-hidden={!open}
        onClick={(e) => e.target === e.currentTarget && close()}
      >
        <div className="ech-menu-inner">
          {LINKS.map((l, i) => (
            <a key={l.label} href={l.href} style={{ "--i": i }} onClick={close}>
              {l.label}
            </a>
          ))}
          <a className="ech-menu-cta" href="#join" style={{ "--i": 4 }} onClick={close}>
            Join up
          </a>
        </div>
      </div>

      <div className="ech-body">
        <div className="ech-panel">
          <span className="ech-chip">[ Voice entry ]</span>

          <h1 className="ech-title">ECHOID</h1>
          <p className="ech-tag">Your voice ID to the E network.</p>

          <form
            className="ech-form"
            action="#"
            method="post"
            noValidate
            onSubmit={(e) => e.preventDefault()}
          >
            <label className="ech-vh" htmlFor="ech-email">Email</label>
            <input id="ech-email" className="ech-input" type="email" name="email" placeholder="Email" />

            <button className="ech-btn ech-btn--ghost" type="submit">
              Proceed using email
            </button>
            <button className="ech-btn ech-btn--solid" type="button">
              Access
            </button>
          </form>

          <a className="ech-ref" href="#invite">I&apos;ve got an invite key</a>
        </div>
      </div>

      <footer className="ech-legal">
        Opening an e.xyz account signals that you accept our{" "}
        <a href="#privacy-notice">Privacy Notice</a> and{" "}
        <a href="#service-contract">Service Contract</a>.
      </footer>
    </section>
  );
}
