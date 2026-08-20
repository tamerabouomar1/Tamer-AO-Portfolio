import { useEffect, useRef, useState } from "react";
import useTemplateFont from "../useTemplateFont";
import "./matrix.css";

/* ── Matrix — AI Platform Hero (Signature) ─────────────────────
   One viewport, three bands: chrome at the top, the pitch in the middle, four
   counted metrics at the foot, all over a looping film. Nothing is a card and
   nothing scrolls.

   The type pairing is the whole identity. The headline and the four stat
   glyphs are set in a retro dot-matrix face; every other word on the page is
   Inter. That contrast is doing the work, so the headline stays SOLID WHITE —
   no gradient, no shimmer, no LED scan. Tracking tightens as the screen
   narrows (-0.04em, then -0.08em, then -0.09em) because the dot grid opens up
   as it shrinks.

   The trust row is a size language, not three logos: a dark padded ring with a
   small white disc inside it, the discs overlapping by 42% of their own width,
   and the pill overlapping the last one by the same amount. The metrics count
   up once, on an easeOutCubic, staggered 80ms apart. */

const VIDEO =
  "https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260809_012548_ef22562c-c0ae-4816-ad9d-f8922af4e6a7.mp4";

const NAV = ["Home", "Product", "Case Studies", "Contact"];

const TRUST = [
  { icon: "fa-microsoft", label: "Microsoft" },
  { icon: "fa-amazon", label: "Amazon" },
  { icon: "fa-google", label: "Google" },
];

const STATS = [
  { glyph: "<", target: 120, suffix: "ms", decimals: 0, label: "Inference Time" },
  { glyph: "%", target: 99.99, suffix: "%", decimals: 2, label: "Platform Uptime" },
  { glyph: "*", target: 24, suffix: "/7", decimals: 0, label: "Autonomous Runtime" },
  { glyph: "#", target: 2.4, suffix: "M", decimals: 1, label: "Context Windows" },
];

const easeOutCubic = (t) => 1 - Math.pow(1 - t, 3);

/* Counts every metric once, when the footer first comes into view. */
function useCountUp(rootRef) {
  const [values, setValues] = useState(() => STATS.map(() => 0));

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setValues(STATS.map((s) => s.target));
      return;
    }

    let raf = 0;
    const timers = [];
    let started = false;

    const run = () => {
      STATS.forEach((stat, i) => {
        const duration = 1500 + i * 80;
        timers.push(
          setTimeout(() => {
            const t0 = performance.now();
            const step = (now) => {
              const p = Math.min(1, (now - t0) / duration);
              const v = stat.target * easeOutCubic(p);
              setValues((prev) => {
                const next = prev.slice();
                next[i] = p === 1 ? stat.target : v;
                return next;
              });
              if (p < 1) raf = requestAnimationFrame(step);
            };
            raf = requestAnimationFrame(step);
          }, 480 + i * 90)
        );
      });
    };

    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting && !started) {
            started = true;
            run();
            io.disconnect();
          }
        }
      },
      { threshold: 0.25 }
    );
    io.observe(root);

    return () => {
      io.disconnect();
      cancelAnimationFrame(raf);
      timers.forEach(clearTimeout);
    };
  }, [rootRef]);

  return values;
}

function LogoMark() {
  return (
    <svg viewBox="0 0 52 52" aria-hidden="true">
      <circle cx="26" cy="26" r="24" fill="none" stroke="#111" strokeWidth="2.6" />
      <path d="M26 6v40" stroke="#111" strokeWidth="2.6" />
      <path d="M26 26 43 13" stroke="#111" strokeWidth="2.6" />
      <path d="M26 26 9 39" stroke="#111" strokeWidth="2.6" />
      <circle cx="26" cy="26" r="4.6" fill="#111" />
    </svg>
  );
}

export default function MatrixSite() {
  useTemplateFont("https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&display=swap");
  useTemplateFont(
    "https://db.onlinewebfonts.com/c/8cb707a9b8a73f8a7403336b861c3074?family=BubbledotICG-FinePos"
  );
  useTemplateFont(
    "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.2/css/all.min.css"
  );

  const statsRef = useRef(null);
  const values = useCountUp(statsRef);
  const [menu, setMenu] = useState(false);

  useEffect(() => {
    if (!menu) return;
    const onKey = (e) => {
      if (e.key === "Escape") setMenu(false);
    };
    const onResize = () => {
      if (window.innerWidth > 720) setMenu(false);
    };
    window.addEventListener("keydown", onKey);
    window.addEventListener("resize", onResize);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("resize", onResize);
    };
  }, [menu]);

  return (
    <div className={`mtx${menu ? " is-menu" : ""}`}>
      <div className="mtx-bg">
        <video className="mtx-video" autoPlay muted loop playsInline aria-hidden="true">
          <source src={VIDEO} type="video/mp4" />
        </video>
      </div>

      <div className="mtx-page">
        <header className="mtx-header">
          <a className="mtx-logo" href="#top" aria-label="Home">
            <LogoMark />
          </a>

          <nav className="mtx-navpill" aria-label="Primary">
            {NAV.map((l, i) => (
              <a key={l} href="#top" className={i === 0 ? "is-active" : ""}>
                {l}
              </a>
            ))}
          </nav>

          <a className="mtx-signin" href="#top">
            Sign in
          </a>

          <button
            type="button"
            className="mtx-burger"
            aria-expanded={menu}
            aria-label={menu ? "Close menu" : "Open menu"}
            onClick={() => setMenu((v) => !v)}
          >
            <i />
            <i />
            <i />
          </button>
        </header>

        <main className="mtx-hero">
          <div className="mtx-trust mtx-anim" style={{ "--d": "0.05s" }}>
            {TRUST.map((t, i) => (
              <span className={`mtx-avatar mtx-avatar--${i + 1}`} key={t.label}>
                <span className="mtx-avatar__disc">
                  <i className={`fa-brands ${t.icon}`} aria-hidden="true" />
                </span>
                <span className="mtx-sr">{t.label}</span>
              </span>
            ))}
            <span className="mtx-trust__pill">Trusted by 2000+ Enterprises</span>
          </div>

          <h1 className="mtx-headline mtx-anim">
            <span>Intelligence</span>
            <span>Designed To Evolve</span>
          </h1>

          <p className="mtx-sub mtx-anim" style={{ "--d": "0.28s" }}>
            Build applications that reason, adapt and collaborate using a modular AI
            platform designed for production.
          </p>

          <a className="mtx-cta mtx-anim" href="#top" style={{ "--d": "0.4s" }}>
            Get Started
          </a>
        </main>

        <footer className="mtx-stats" ref={statsRef}>
          {STATS.map((s, i) => (
            <div className="mtx-stat mtx-anim" key={s.label} style={{ "--d": `${0.5 + i * 0.08}s` }}>
              <span className="mtx-stat__glyph" aria-hidden="true">
                {s.glyph}
              </span>
              <span className="mtx-stat__value">
                {values[i].toFixed(s.decimals)}
                {s.suffix}
              </span>
              <span className="mtx-stat__label">{s.label}</span>
            </div>
          ))}
        </footer>
      </div>

      <button
        type="button"
        className="mtx-overlay"
        aria-label="Close menu"
        tabIndex={menu ? 0 : -1}
        onClick={() => setMenu(false)}
      />

      <div className="mtx-sheet" hidden={!menu}>
        {NAV.map((l, i) => (
          <a
            key={l}
            href="#top"
            className={i === 0 ? "is-active" : ""}
            style={{ "--i": i }}
            onClick={() => setMenu(false)}
          >
            {l}
          </a>
        ))}
        <a className="mtx-sheet__signin" href="#top" style={{ "--i": NAV.length }}>
          Sign in
        </a>
      </div>
    </div>
  );
}
