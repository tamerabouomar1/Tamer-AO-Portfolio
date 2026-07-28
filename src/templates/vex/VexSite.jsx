import { useEffect, useState } from "react";
import useTemplateFont from "../useTemplateFont";
import "./vex.css";

/* ── Vantage — Venture Landing ─────────────────────────────────
   One screen. Raw full-bleed video (no dimming overlay by design),
   liquid-glass chrome, and a headline that types itself in.
   Demoed with Tamer's own brand and copy. */

const VIDEO =
  "https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260403_050628_c4e32401-fab4-4a27-b7a8-6e9291cd5959.mp4";

const HEADING = "Designing brands\nthat refuse to blend in.";
const CHAR_DELAY = 30;
const START_DELAY = 200;

/* Fades its children in once, `delay` ms after mount. */
function FadeIn({ children, delay = 0, duration = 1000, className }) {
  const [shown, setShown] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setShown(true), delay);
    return () => clearTimeout(t);
  }, [delay]);
  return (
    <div
      className={className}
      style={{ opacity: shown ? 1 : 0, transitionDuration: `${duration}ms` }}
    >
      {children}
    </div>
  );
}

/* Splits a line into words, and each word into characters, so every letter
   can slide in on its own stagger.

   The words matter: a bare run of inline-block characters lets the browser
   break a line between any two letters ("tomorro / w"). Grouping them into
   non-breaking word spans means breaks only happen at spaces, like normal
   text. The character counter keeps running across words so the stagger
   stays continuous down the whole line. */
function Line({ text, lineIndex, on }) {
  const words = text.split(" ");
  let ci = -1;

  return (
    <span className="vx-head__line">
      {words.map((word, wi) => {
        // put the space back on every word but the last, so it animates too
        const chars = [...(wi < words.length - 1 ? `${word} ` : word)];
        return (
          <span className="vx-head__word" key={wi}>
            {chars.map((ch) => {
              const i = (ci += 1);
              return (
                <span
                  key={i}
                  className="vx-head__char"
                  style={{
                    opacity: on ? 1 : 0,
                    transform: on ? "translateX(0)" : "translateX(-18px)",
                    transitionDelay: `${
                      lineIndex * text.length * CHAR_DELAY + i * CHAR_DELAY
                    }ms`,
                  }}
                >
                  {ch === " " ? " " : ch}
                </span>
              );
            })}
          </span>
        );
      })}
    </span>
  );
}

function AnimatedHeading({ text, delay = START_DELAY }) {
  const [on, setOn] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setOn(true), delay);
    return () => clearTimeout(t);
  }, [delay]);

  return (
    <h1 className="vx-head">
      {text.split("\n").map((line, li) => (
        <Line key={li} text={line} lineIndex={li} on={on} />
      ))}
    </h1>
  );
}

export default function VexSite() {
  useTemplateFont(
    "https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600&display=swap"
  );

  return (
    <div className="vx">
      <video
        className="vx-video"
        src={VIDEO}
        autoPlay
        loop
        muted
        playsInline
        preload="auto"
      />

      <div className="vx-shell">
        <div className="vx-pad vx-navwrap">
          <nav className="vx-nav liquid-glass">
            <span className="vx-logo">TAMER AO</span>
            <div className="vx-nav__links">
              {["Work", "Brands", "Apparel", "Contact"].map((l) => (
                <a key={l} href={`#${l.toLowerCase()}`}>
                  {l}
                </a>
              ))}
            </div>
            <a className="vx-btn vx-btn--solid vx-btn--sm" href="#contact">
              Start a project
            </a>
          </nav>
        </div>

        <div className="vx-pad vx-hero">
          <div className="vx-hero__grid">
            <div>
              <AnimatedHeading text={HEADING} />
              <FadeIn delay={800} className="vx-sub">
                <p>
                  Identities, apparel and websites for people building something worth
                  looking at.
                </p>
              </FadeIn>
              <FadeIn delay={1200} className="vx-actions">
                <a className="vx-btn vx-btn--solid" href="#contact">
                  Start a project
                </a>
                <a className="vx-btn vx-btn--glass liquid-glass" href="#work">
                  See the work
                </a>
              </FadeIn>
            </div>

            <FadeIn delay={1400} className="vx-tagwrap">
              <div className="vx-tag liquid-glass">Brands. Apparel. Websites.</div>
            </FadeIn>
          </div>
        </div>
      </div>
    </div>
  );
}
