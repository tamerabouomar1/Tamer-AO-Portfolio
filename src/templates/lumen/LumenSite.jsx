import { useEffect, useRef, useState } from "react";
import useTemplateFont from "../useTemplateFont";
import "./lumen.css";

/* ── Lumen — Focus App Hero ────────────────────────────────────
   Four looping scenes stacked in the same box; only one is opaque and the
   switch is a 1000ms opacity crossfade. All four play from mount rather than
   starting on selection, so a switch never waits on a first frame.

   A transparent PNG of a train window sits over them, bobbing 6px. It is held
   at scale(1.03) the whole time — without that, the 6px lift would expose the
   cut edge at the top of the frame.

   The third scene, Deep Woods, is bright enough that white type disappears
   into it, so the hero content (not the nav or the stats, which sit over
   darker corners) switches to a dark ink over 700ms. */

const P = "https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/";
const SCENES = [
  { label: "Golden Hour", src: `${P}hf_20260702_081127_0992a171-d3c6-4978-8213-0ec5df8b6d63.mp4` },
  { label: "Still Water", src: `${P}hf_20260702_092026_dd05b805-ea0f-40b2-8c52-332b88502592.mp4` },
  { label: "Deep Woods", src: `${P}hf_20260702_081042_df7202bf-bd80-4b2b-bbc6-1f09ba2870e9.mp4` },
  { label: "Quiet Dawn", src: `${P}hf_20260702_080959_4cac5234-3573-464e-a5b7-76b94b8a7d61.mp4` },
];
const OVERLAY =
  "https://soft-zoom-63098134.figma.site/_assets/v11/0b4a435b2df2747593c43d7a1c9b4578f7d8d90c.png";

const NAV = ["How It Works", "Features", "Pricing", "Community"];
const STATS = [
  ["60+", "Deep Sessions"],
  ["12,000+", "Creators"],
  ["4.8", "User Satisfaction"],
  ["Intentional-First", "Design"],
];
const DARK_SCENE = 2; // Deep Woods
const CROSSFADE_MS = 1000;

function MenuIcon({ open }) {
  return (
    <span className="lum-burger" aria-hidden="true">
      <svg className={open ? "is-out" : ""} width="20" height="20" viewBox="0 0 24 24"
        fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
        <path d="M4 6h16" /><path d="M4 12h16" /><path d="M4 18h16" />
      </svg>
      <svg className={open ? "" : "is-out"} width="20" height="20" viewBox="0 0 24 24"
        fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
        <path d="M18 6 6 18" /><path d="m6 6 12 12" />
      </svg>
    </span>
  );
}

export default function LumenSite() {
  useTemplateFont(
    "https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&display=swap"
  );

  const [active, setActive] = useState(0);
  const [busy, setBusy] = useState(false);
  const [menu, setMenu] = useState(false);
  const stageRef = useRef(null);

  /* `autoplay` alone is not enough. A browser will refuse it in a background
     tab, in low-power mode, and inside in-app browsers, and once refused it
     never retries — the hero would sit on a frozen first frame. Asking again
     on mount and whenever the tab comes back is cheap and fixes all three. */
  useEffect(() => {
    const play = () => {
      stageRef.current?.querySelectorAll("video").forEach((v) => {
        const p = v.play();
        if (p && p.catch) p.catch(() => {});
      });
    };
    play();
    document.addEventListener("visibilitychange", play);
    return () => document.removeEventListener("visibilitychange", play);
  }, []);

  // A click during the crossfade would stack two fades and flash the layer
  // underneath, so input is ignored until the transition has actually landed.
  useEffect(() => {
    if (!busy) return;
    const t = setTimeout(() => setBusy(false), CROSSFADE_MS);
    return () => clearTimeout(t);
  }, [busy]);

  const pick = (i) => {
    if (i === active || busy) return;
    setActive(i);
    setBusy(true);
  };

  const dark = active === DARK_SCENE;

  return (
    <section className={"lum" + (dark ? " is-dark" : "")}>
      <div className="lum-videos" ref={stageRef}>
        {SCENES.map((s, i) => (
          <video
            key={s.src}
            className={"lum-video" + (i === active ? " is-on" : "")}
            src={s.src}
            autoPlay
            muted
            loop
            playsInline
            preload="auto"
          />
        ))}
      </div>

      <img className="lum-overlay" src={OVERLAY} alt="" aria-hidden="true" />

      <div className="lum-content">
        <header className="lum-nav">
          <span className="lum-logo">Lumora</span>

          <div className="lum-pill lum-glass">
            {NAV.map((l) => (
              <a key={l} href="#top">{l}</a>
            ))}
            <button className="lum-cta" type="button">Get Started</button>
          </div>

          <button
            className="lum-menubtn lum-glass"
            type="button"
            aria-label={menu ? "Close menu" : "Open menu"}
            aria-expanded={menu}
            onClick={() => setMenu((v) => !v)}
          >
            <MenuIcon open={menu} />
          </button>
        </header>

        <div className={"lum-sheet" + (menu ? " is-open" : "")}>
          <div className="lum-sheet-inner">
            {NAV.map((l, i) => (
              <a key={l} href="#top" style={{ transitionDelay: `${100 + i * 50}ms` }}
                onClick={() => setMenu(false)}>
                {l}
              </a>
            ))}
            <button className="lum-cta" type="button" style={{ transitionDelay: "300ms" }}>
              Get Started
            </button>
          </div>
        </div>

        <main className="lum-hero">
          <span className="lum-badge lum-glass">
            Over 10,000 minds already finding their clarity
          </span>

          <h1 className="lum-title">
            Clarity in an Endlessly
            <br />
            Noisy Universe
          </h1>

          <p className="lum-sub">
            Rise above the chaos of pings, infinite scrolling, and relentless demands.
            Discover how to protect your presence and create with intention.
          </p>

          <form className="lum-email lum-glass" onSubmit={(e) => e.preventDefault()}>
            <input type="email" placeholder="Your Best Email" aria-label="Your best email" />
            <button type="submit">Get Early Access</button>
          </form>

          <div className="lum-switch" role="tablist" aria-label="Background scene">
            {SCENES.map((s, i) => (
              <button
                key={s.label}
                type="button"
                role="tab"
                aria-selected={i === active}
                className={i === active ? "is-on" : ""}
                onClick={() => pick(i)}
              >
                {s.label}
              </button>
            ))}
          </div>
        </main>

        <footer className="lum-stats">
          {STATS.map(([n, l], i) => (
            <span key={l}>
              {i > 0 && <i className="lum-div" aria-hidden="true">|</i>}
              <b>{n}</b> {l}
            </span>
          ))}
        </footer>
      </div>
    </section>
  );
}
