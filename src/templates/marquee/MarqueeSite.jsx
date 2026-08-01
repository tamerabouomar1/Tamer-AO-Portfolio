import { useEffect, useState } from "react";
import useTemplateFont from "../useTemplateFont";
import "./marquee.css";

/* ── Marquee — Editorial Portfolio (Signature) ─────────────────
   One locked composition. A giant name scrolls forever behind a cut-out
   portrait, so the letters read THROUGH the figure. That layering is the whole
   idea: the portrait sits above the marquee and below the chrome, and nothing
   is allowed between them — no scrim, no card, no glow.

   The marquee track is two identical halves translated -50%, which is what
   makes the loop seamless: at -50% the second half sits exactly where the
   first began, so the reset is invisible.

   Everything enters once on load with staggered delays. Under reduced motion
   the whole entrance collapses to nothing. */

const BG =
  "https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260729_022513_486985a2-ac8c-4278-91a8-071dcd9fcaff.png&w=1280&q=85";
const FRONT =
  "https://stone-expand-60400629.figma.site/_assets/v11/8da570354e86aa0d44ac3e4aa335a72c8e750d68.png";

const NAV = ["Story", "Jobs", "Message"];
const SOCIAL = ["Instagram", "TikTok", "YouTube"];

function CloseIcon() {
  return (
    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth="1.5" strokeLinecap="round" aria-hidden="true">
      <path d="M18 6 6 18" /><path d="m6 6 12 12" />
    </svg>
  );
}

export default function MarqueeSite() {
  useTemplateFont(
    "https://db.onlinewebfonts.com/c/95cecf452d3208890088a5b4c19c7ecf?family=Helvetica+Neue+ME"
  );
  const [open, setOpen] = useState(false);

  // The drawer covers the page, so the document behind it must not scroll.
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = prev; };
  }, [open]);

  return (
    <section className="mrq">
      <img className="mrq-bg mrq-fade" src={BG} alt="" />

      <div className="mrq-marqueewrap mrq-up" style={{ animationDelay: "500ms" }}>
        <div className="mrq-track">
          <span>Marcus &mdash; Bennet&nbsp;</span>
          <span>Marcus &mdash; Bennet&nbsp;</span>
        </div>
      </div>

      {/* Above the name, below the chrome. Never receives pointer events. */}
      <img className="mrq-front mrq-rise" src={FRONT} alt="Portrait" />

      <header className="mrq-head">
        <a className="mrq-brand mrq-up" href="#top" style={{ animationDelay: "800ms" }}>
          Marcus
        </a>

        <div className="mrq-headright">
          <span className="mrq-year mrq-up" style={{ animationDelay: "900ms" }}>2025</span>
          <div className="mrq-stack">
            {NAV.map((l, i) => (
              <a key={l} href="#top" className="mrq-up" style={{ animationDelay: `${1000 + i * 80}ms` }}>
                {l}
              </a>
            ))}
          </div>
          <div className="mrq-stack">
            {SOCIAL.map((l, i) => (
              <a key={l} href="#top" className="mrq-up" style={{ animationDelay: `${1150 + i * 80}ms` }}>
                {l}
              </a>
            ))}
          </div>
        </div>

        <button
          className={"mrq-burger mrq-up" + (open ? " is-open" : "")}
          type="button"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          style={{ animationDelay: "900ms" }}
          onClick={() => setOpen((v) => !v)}
        >
          <i /><i /><i />
        </button>
      </header>

      <div className="mrq-rule mrq-line" />

      <footer className="mrq-foot">
        <div className="mrq-up" style={{ animationDelay: "1400ms" }}>
          <p>Visuals Composer</p>
          <p>Digital Crafter</p>
          <p>Obsessed by The Office</p>
        </div>
        <div className="mrq-footright mrq-up" style={{ animationDelay: "1550ms" }}>
          <p>A homage to</p>
          <p>Marcus Holloway</p>
        </div>
      </footer>

      <div
        className={"mrq-backdrop" + (open ? " is-open" : "")}
        onClick={() => setOpen(false)}
        aria-hidden="true"
      />
      <aside className={"mrq-drawer" + (open ? " is-open" : "")}>
        <button className="mrq-close" type="button" aria-label="Close menu" onClick={() => setOpen(false)}>
          <CloseIcon />
        </button>

        <span className="mrq-dlabel" style={{ transitionDelay: open ? "250ms" : "0ms" }}>
          Site Index
        </span>
        <nav className="mrq-dnav">
          {NAV.map((l, i) => (
            <a key={l} href="#top" style={{ transitionDelay: open ? `${300 + i * 80}ms` : "0ms" }}
              onClick={() => setOpen(false)}>
              {l}
            </a>
          ))}
        </nav>

        <span className="mrq-dlabel" style={{ transitionDelay: open ? "500ms" : "0ms" }}>
          Find Me
        </span>
        <div className="mrq-dsocial">
          {SOCIAL.map((l, i) => (
            <a key={l} href="#top" style={{ transitionDelay: open ? `${550 + i * 60}ms` : "0ms" }}
              onClick={() => setOpen(false)}>
              {l}
            </a>
          ))}
        </div>
      </aside>
    </section>
  );
}
