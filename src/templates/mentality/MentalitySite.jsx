import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import useTemplateFont from "../useTemplateFont";
import "./mentality.css";

/* ── Mentality — Light Wellness Landing ────────────────────────
   The one light template in the set. Everything sits on #EDEEF5, and the film
   is inset below the fold rather than full-bleed: it starts 15vh down and a
   gradient at its top edge dissolves it back into the page colour, so the
   video reads as part of the background rather than a box dropped onto it.

   Type does the work. The headline states the promise in near-black and lets
   the rest fall away to grey, with a small outlined pill standing in for the
   word your eye expects — the one piece of decoration on the page.

   Icons are inline SVG, and the nav drawer is the only animated element. */

const VIDEO =
  "https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260603_132049_036591b8-6e92-4760-b94c-a7ea6eef315c.mp4";

const LINKS = ["service", "patient resources", "about us", "education center"];

function Clover() {
  return (
    <svg viewBox="0 0 24 24" fill="#1a1a1a" aria-hidden="true">
      <path d="M12 2c1.9 0 3.4 1.5 3.4 3.4 0 .9-.3 1.6-.8 2.2.6-.5 1.4-.8 2.2-.8 1.9 0 3.4 1.5 3.4 3.4S18.7 13.6 16.8 13.6c-.9 0-1.6-.3-2.2-.8.5.6.8 1.4.8 2.2 0 1.9-1.5 3.4-3.4 3.4s-3.4-1.5-3.4-3.4c0-.9.3-1.6.8-2.2-.6.5-1.4.8-2.2.8-1.9 0-3.4-1.5-3.4-3.4S4.3 6.8 6.2 6.8c.9 0 1.6.3 2.2.8-.5-.6-.8-1.4-.8-2.2C7.6 3.5 9.1 2 12 2Z" />
    </svg>
  );
}

function ArrowUp() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
      strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M12 19V5" /><path d="m5 12 7-7 7 7" />
    </svg>
  );
}

export default function MentalitySite() {
  useTemplateFont(
    "https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600&family=Outfit:wght@300;400;500;600&display=swap"
  );

  const [open, setOpen] = useState(false);

  return (
    <div className="men">
      <header className="men-nav">
        <div className="men-nav-grid">
          <a className="men-brand" href="#top">
            <span className="men-mark"><Clover /></span>
            <span className="men-name">m&#279;ntality</span>
          </a>

          <nav className="men-links">
            {LINKS.map((l) => (
              <a key={l} href="#top">{l}</a>
            ))}
          </nav>

          <div className="men-actions">
            <a className="men-help" href="#top">find help</a>
            <a className="men-start" href="#top">get started &rarr;</a>
            <button
              type="button"
              className={`men-burger${open ? " is-open" : ""}`}
              aria-expanded={open}
              aria-label={open ? "Close menu" : "Open menu"}
              onClick={() => setOpen((v) => !v)}
            >
              <span /><span />
            </button>
          </div>
        </div>

        <AnimatePresence>
          {open && (
            <motion.div
              className="men-drawer"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            >
              <div className="men-drawer-inner">
                {LINKS.map((l) => (
                  <a key={l} href="#top" onClick={() => setOpen(false)}>{l}</a>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      <main>
        <section className="men-hero">
          <div className="men-film" aria-hidden="true">
            <video
              className="men-video"
              src={VIDEO}
              autoPlay
              loop
              muted
              playsInline
              preload="auto"
            />
            {/* Dissolves the top edge of the film into the page colour. */}
            <div className="men-mask" />
          </div>

          <div className="men-wrap">
            <div className="men-col">
              <motion.h1
                className="men-title"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
              >
                <span className="men-ink">Remix: Mentality offers</span>{" "}
                <span className="men-grey">information</span>
                <br />
                <span className="men-grey">and resources to help you manage</span>
                <br />
                <span className="men-grey">
                  your{" "}
                  <span className="men-eye" aria-hidden="true"><i /></span>{" "}
                  mental wellbeing.
                </span>
              </motion.h1>

              <motion.div
                className="men-search"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.15 }}
              >
                <input
                  type="text"
                  placeholder="Ask me anything..."
                  aria-label="Ask me anything"
                />
                <button type="button" aria-label="Submit"><ArrowUp /></button>
              </motion.div>
            </div>
          </div>

          <div className="men-lang">pl &mdash; en</div>
          <div className="men-year">2024</div>
          <div className="men-tools">mental health tools</div>
        </section>
      </main>
    </div>
  );
}
