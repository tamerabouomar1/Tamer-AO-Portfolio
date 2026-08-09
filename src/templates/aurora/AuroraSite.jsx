import { useEffect, useRef } from "react";
import useTemplateFont from "../useTemplateFont";
import "./aurora.css";

/* ── Aurora — AI Product Hero ──────────────────────────────────
   One locked screen: navbar, a 220px wordmark whose second half is a
   three-stop gradient, and a logo marquee pinned to the bottom. Scoped
   under .au.

   The video does NOT use the `loop` attribute. It runs a hand-driven cycle —
   half a second fading up, half a second fading down, then a full reset to
   opacity 0 and a 100ms pause before it replays from zero. `loop` would jump
   the last frame straight onto the first, which on this clip is a visible
   cut; the pause is what makes the restart read as intentional.

   Spec came in written for Tailwind + @fontsource. Translated to the house
   pattern — one component, one scoped stylesheet, icons drawn inline — with
   every number, colour and URL kept verbatim. */

const VIDEO =
  "https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260328_065045_c44942da-53c6-4804-b734-f9e07fc22e08.mp4";

const FADE = 0.5; // seconds, both ends
const NAV = [
  { label: "Features", caret: true },
  { label: "Solutions", caret: false },
  { label: "Plans", caret: false },
  { label: "Learning", caret: true },
];
const LOGOS = ["Vortex", "Nimbus", "Prysma", "Cirrus", "Kynder", "Halcyn"];

function Caret() {
  return (
    <svg className="au-caret" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/* Drawn rather than shipped as logo.png, so the template carries no binary
   assets and nothing 404s when a buyer unzips it. */
function Logo() {
  return (
    <svg className="au-logo" viewBox="0 0 120 32" fill="none" aria-hidden="true">
      <circle cx="16" cy="16" r="9" stroke="currentColor" strokeWidth="2.4" />
      <circle cx="16" cy="16" r="3" fill="currentColor" />
      <text x="34" y="22" className="au-logo__word" fill="currentColor">
        Aurora
      </text>
    </svg>
  );
}

function BackgroundVideo() {
  const ref = useRef(null);

  useEffect(() => {
    const v = ref.current;
    if (!v) return;

    // Respect the OS setting: hold one steady frame rather than pulsing.
    const still = window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches;
    if (still) {
      v.style.opacity = "1";
      v.play?.().catch(() => {});
      return;
    }

    let raf = 0;
    let cancelled = false;

    const tick = () => {
      if (cancelled) return;
      const d = v.duration;
      // duration is NaN until metadata lands; hold at 0 rather than dividing
      // by it and writing "NaN" into opacity, which paints the video opaque.
      if (d && isFinite(d)) {
        const t = v.currentTime;
        const up = Math.min(t / FADE, 1);
        const down = Math.min(Math.max(d - t, 0) / FADE, 1);
        v.style.opacity = String(Math.min(up, down));
      }
      raf = requestAnimationFrame(tick);
    };

    const onEnded = () => {
      v.style.opacity = "0";
      window.setTimeout(() => {
        if (cancelled) return;
        v.currentTime = 0;
        v.play().catch(() => {});
      }, 100);
    };

    v.addEventListener("ended", onEnded);
    v.play().catch(() => {});
    raf = requestAnimationFrame(tick);

    return () => {
      cancelled = true;
      cancelAnimationFrame(raf);
      v.removeEventListener("ended", onEnded);
    };
  }, []);

  return (
    <video
      ref={ref}
      className="au-video"
      src={VIDEO}
      muted
      playsInline
      preload="auto"
      aria-hidden="true"
    />
  );
}

export default function AuroraSite() {
  useTemplateFont("https://fonts.googleapis.com/css2?family=Geist:wght@300;400;500;600;700&display=swap");
  useTemplateFont("https://api.fontshare.com/v2/css?f[]=general-sans@400,500,600,700&display=swap");

  return (
    <div className="au">
      <div className="au-stage">
        <BackgroundVideo />

        <div className="au-screen">
          <header className="au-nav">
            <a className="au-brand" href="#top" aria-label="Aurora home">
              <Logo />
            </a>

            <nav className="au-links">
              {NAV.map((n) => (
                <button key={n.label} type="button">
                  {n.label}
                  {n.caret && <Caret />}
                </button>
              ))}
            </nav>

            <button type="button" className="au-signup liquid-glass">
              Sign Up
            </button>
          </header>
          <div className="au-rule" />

          <main className="au-hero">
            {/* Sits BEHIND the copy and is deliberately not clipped — the
                section keeps overflow visible so the 82px blur can spill. */}
            <div className="au-glow" aria-hidden="true" />

            <div className="au-copy">
              <h1 className="au-title">
                Power <span className="au-title__grad">AI</span>
              </h1>
              <p className="au-sub">
                The most powerful AI ever deployed
                <br />
                in talent acquisition
              </p>
              <button type="button" className="au-cta liquid-glass">
                Schedule a Consult
              </button>
            </div>
          </main>

          <footer className="au-marquee">
            <div className="au-marquee__inner">
              <p className="au-marquee__label">
                Relied on by brands
                <br />
                across the globe
              </p>

              <div className="au-track" aria-hidden="true">
                {/* Two identical halves, shifted -50%: that is what makes the
                    loop seamless rather than snapping at the join. */}
                <div className="au-track__run">
                  {[...LOGOS, ...LOGOS].map((name, i) => (
                    <span className="au-logo-item" key={`${name}-${i}`}>
                      <span className="au-logo-item__mark liquid-glass">{name[0]}</span>
                      {name}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </footer>
        </div>
      </div>
    </div>
  );
}
