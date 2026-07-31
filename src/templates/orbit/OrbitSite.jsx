import { useEffect, useRef, useState } from "react";
import useTemplateFont from "../useTemplateFont";
import "./orbit.css";

/* ── Orbit — Talent Marketplace ────────────────────────────────
   Four concentric rings turning at different speeds and directions, with
   specialist avatars pinned around them. Each avatar is placed with the
   rotate/translate/counter-rotate trio, so it rides the ring but stays
   upright; the centre readout counter-rotates for the same reason.

   The heading types itself, and the "20k+" counts up on an ease-out cubic.
   Both are a handful of lines here rather than an animation library, which
   keeps the template installable with nothing but React. */

const A = "https://polo-pecan-73837341.figma.site/_assets/v11/";
const LOGO = `${A}17ae538989a509947a8de3892c644664895e69b1.png`;
const BG =
  "https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260624_111401_56af5012-2263-45d3-849a-8688084d7c2a.png&w=1280&q=85";

const NAV = ["Your Team", "Solutions", "Blog", "Pricing"];

/* orbit index, angle on the ring, radius, size, shape, glow, entrance delay */
const AVATARS = [
  { src: `${A}aa51718fb3af3637e6d666b6543fc27a175fada6.png`, orbit: 1, deg: 270, r: 177, size: 58, radius: 20, glow: "purple", delay: 0.6 },
  { src: `${A}ca755f7f93c1126fb8bdbf99ab364a33aa9ab272.png`, orbit: 2, deg: 60,  r: 251, size: 58, radius: 999, glow: "yellow", delay: 0.8 },
  { src: `${A}dc01064c7093dcc32674876ee3cf5e41c4a485c6.png`, orbit: 2, deg: 180, r: 251, size: 78, radius: 999, glow: "pink",   delay: 1.0 },
  { src: `${A}d5470a58b02388336141575048720f19a50de832.png`, orbit: 2, deg: 300, r: 251, size: 58, radius: 20,  glow: "blue",   delay: 1.2 },
  { src: `${A}018736aa5d0275c4ce56cfebaf2ae3007d81ca1e.png`, orbit: 3, deg: 130, r: 325, size: 88, radius: 999, glow: "pink",   delay: 1.4 },
  { src: `${A}c76d8a0b99676de31c014344bfaf75bad090758d.png`, orbit: 4, deg: 30,  r: 399, size: 58, radius: 999, glow: "purple", delay: 1.7 },
  { src: `${A}7b1b5f039de7b54cc9913e96c1923c3b15a157fa.png`, orbit: 4, deg: 95,  r: 399, size: 88, radius: 24,  glow: "orange", delay: 1.9 },
  { src: `${A}9ae171d8895199349755c43fbff00e122221a027.png`, orbit: 4, deg: 220, r: 399, size: 88, radius: 24,  glow: "pink",   delay: 2.1 },
  { src: `${A}926c9eb7b4bc1df846fa0e39f0b0dc3fefd80671.png`, orbit: 4, deg: 320, r: 399, size: 58, radius: 999, glow: "purple", delay: 2.3 },
];

const ORBITS = [
  { i: 1, size: 353, dir: "left",  secs: 30 },
  { i: 2, size: 501, dir: "right", secs: 40 },
  { i: 3, size: 649, dir: "right", secs: 50 },
  { i: 4, size: 797, dir: "left",  secs: 60 },
];

const TICKER = [
  `${A}1e7b0e6fcc016cd28aec5c68990118b8c54c35a5.svg`,
  `${A}3eac03c183db2ae080d910159211c14843398b61.svg`,
  `${A}17705a4c0023a0e5a99154dfb10582adbbf4260b.svg`,
  `${A}0e5f442b09dc5c248e3e60d40a65505fb1887228.svg`,
  `${A}63f99030ceb459e3c9ab9e429cfa2353491d3816.svg`,
];

const HEADLINE =
  "Unlock Top Marketing Talent You Thought Was Out of Reach - Now Just One Click Away!";
const DARK_CHARS = 67; // the first clause is set in black, the rest in white

function Chevron() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="m9 18 6-6-6-6" />
    </svg>
  );
}
function Pointer() {
  return (
    <svg className="orb-pointer" width="22" height="22" viewBox="0 0 24 24"
      fill="#A068FF" aria-hidden="true">
      <path d="M5 2l14 9-6.5 1.5L9.5 20z" />
    </svg>
  );
}

/** Count 0 -> target on an ease-out cubic, after a delay. */
function useCountUp(target, ms = 2000, delay = 1200) {
  const [n, setN] = useState(0);
  useEffect(() => {
    let raf = 0;
    const timer = setTimeout(() => {
      const start = performance.now();
      const step = (now) => {
        const t = Math.min(1, (now - start) / ms);
        setN(Math.round(target * (1 - Math.pow(1 - t, 3))));
        if (t < 1) raf = requestAnimationFrame(step);
      };
      raf = requestAnimationFrame(step);
    }, delay);
    return () => { clearTimeout(timer); cancelAnimationFrame(raf); };
  }, [target, ms, delay]);
  return n;
}

/** Reveal `text` one character at a time. */
function useTypewriter(text, speed = 35, delay = 400) {
  const [n, setN] = useState(0);
  useEffect(() => {
    let id = 0;
    const timer = setTimeout(() => {
      id = setInterval(() => {
        setN((v) => {
          if (v >= text.length) { clearInterval(id); return v; }
          return v + 1;
        });
      }, speed);
    }, delay);
    return () => { clearTimeout(timer); clearInterval(id); };
  }, [text, speed, delay]);
  return { shown: text.slice(0, n), done: n >= text.length };
}

export default function OrbitSite() {
  useTemplateFont(
    "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Urbanist:wght@500;600;700&display=swap"
  );

  const { shown, done } = useTypewriter(HEADLINE);
  const count = useCountUp(20);
  const rootRef = useRef(null);

  // Two-tone headline: the clause before DARK_CHARS is black, the rest white.
  const dark = shown.slice(0, DARK_CHARS);
  const light = shown.slice(DARK_CHARS);

  return (
    <div className="orb" ref={rootRef} style={{ backgroundImage: `url("${BG}")` }}>
      <header className="orb-header">
        <div className="orb-header-left">
          <img className="orb-logo" src={LOGO} alt="Marketeam" />
          <nav className="orb-nav">
            {NAV.map((l) => (
              <a key={l} href="#top">{l}</a>
            ))}
          </nav>
        </div>
        <div className="orb-header-right">
          <a className="orb-login" href="#top">Log In</a>
          <div className="orb-borderwrap">
            <button className="orb-btn" type="button">Join Now</button>
          </div>
        </div>
      </header>

      <div className="orb-hero">
        <div className="orb-left">
          <h1 className="orb-title">
            <span className="orb-ink">{dark}</span>
            <span className="orb-paper">{light}</span>
            {!done && <span className="orb-caret" aria-hidden="true" />}
          </h1>

          <div className={"orb-borderwrap orb-start" + (done ? " is-in" : "")}>
            <button className="orb-btn orb-btn-lg" type="button">
              Start Project <Chevron />
            </button>
          </div>

          <div className={"orb-cursor" + (done ? " is-in" : "")}>
            <Pointer />
            <span className="orb-tag">David</span>
          </div>
        </div>

        <div className="orb-right">
          <div className="orb-circles">
            {ORBITS.map((o) => (
              <div
                key={o.i}
                className={`orb-ring orb-ring-${o.i}`}
                style={{
                  width: o.size, height: o.size,
                  animationDuration: `${o.secs}s`,
                  animationDirection: o.dir === "left" ? "reverse" : "normal",
                }}
              >
                {o.i === 1 && (
                  <div
                    className="orb-centre"
                    style={{
                      animationDuration: `${o.secs}s`,
                      animationDirection: o.dir === "left" ? "normal" : "reverse",
                    }}
                  >
                    <strong>{count}k+</strong>
                    <span>Specialists</span>
                  </div>
                )}

                {/* Three nested nodes because three transforms have to coexist:
                    placement on the ring (static, inline), the counter-spin that
                    keeps the face upright, and the entrance fly-in. Putting any
                    two on one element makes them overwrite each other. */}
                {AVATARS.filter((a) => a.orbit === o.i).map((a) => (
                  <div
                    key={a.src}
                    className="orb-av"
                    style={{
                      width: a.size, height: a.size,
                      transform:
                        `translate(-50%, -50%) rotate(${a.deg}deg) translate(${a.r}px) rotate(${-a.deg}deg)`,
                    }}
                  >
                    <div
                      className="orb-av-spin"
                      style={{
                        animationDuration: `${o.secs}s`,
                        animationDirection: o.dir === "left" ? "normal" : "reverse",
                      }}
                    >
                      <img
                        className={`orb-av-img orb-glow-${a.glow}`}
                        src={a.src}
                        alt=""
                        style={{ borderRadius: a.radius, animationDelay: `${a.delay}s` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="orb-ticker">
        <div className="orb-ticker-track">
          {[0, 1, 2, 3].flatMap((rep) =>
            TICKER.map((src) => <img key={`${rep}-${src}`} src={src} alt="" />)
          )}
        </div>
      </div>
    </div>
  );
}
