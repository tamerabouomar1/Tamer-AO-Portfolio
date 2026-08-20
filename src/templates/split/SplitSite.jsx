import { useEffect, useRef, useState } from "react";
import useTemplateFont from "../useTemplateFont";
import "./split.css";

/* ── Split — Login Screen (Signature) ──────────────────────────
   A login built as a composition rather than a form on a page: a falcon in a
   dive holding the left column with the promise seated at its foot, and the
   whole form measured into the right.

   Every number in split.css is a real measurement off a 1464x949 frame — 61px
   field heights, a 65.5px button, an OR rule that is 205px on one side and
   204px on the other. Those hold at any window size because the card's
   interior is SCALED, not reflowed: JS computes one factor from the pane and
   writes it as a transform. That is the whole trick, and it is why the type
   never drifts out of proportion with the box.

   Three modes, chosen by media query, not by width alone:
     land    — the two-column frame. The photo column eases from 57.1% down to
               36% between 1280 and 820px, handing measure to the card instead
               of squeezing it.
     tabport — portrait tablets: the photo becomes a masthead band with the
               badge and headline at its foot, and the card interior goes
               FLUID (vars off its own box) rather than scaled.
     phone   — real document flow. Nothing is viewport-scaled, inputs are 16px
               so iOS cannot zoom on focus, and the headline goes white over a
               scrim on the photo.

   Mode-switch hygiene: every branch writes inline styles, and inline styles
   outrank the stylesheet, so a mode change WIPES them first. Without that the
   outgoing mode's left/top/width stay latched and the incoming mode's CSS
   never lands — the layout would only look right after a reload. */

const VIDEO =
  "https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260813_052122_e77a27e6-17f1-4794-889b-3ceaa0e9e8cb.mp4";

/* reference frame + box metrics */
const REF_W = 1464;
const PHOTO_W = 836;
const PANE_W = 628;
const CARD_W = 613;
const CONTENT_H = 697; // form block plus breathing room, reference px
const IMG_W = 1177;
const IMG_H = 1336;
const IMG_REF_SCALE = PHOTO_W / IMG_W;
const PANE_RATIO = PANE_W / REF_W;
const HERO_W = 681;
const REF_CARD_ASPECT = 692 / 855;
const RAMP_HI = 1280;
const RAMP_LO = 1000;
const PHOTO_MIN = 0.42;
const RAMP_LO2 = 820;
const PHOTO_MIN2 = 0.36;

/* tablet-portrait proportions, off a 1086x1448 reference */
const TP = {
  pad: 0.1076,
  h1Top: 0.08656,
  h1Fs: 0.06839,
  subTop: 0.17368,
  subFs: 0.0309,
  emTop: 0.25435,
  emH: 0.10257,
  emR: 0.0202,
  ephFs: 0.02702,
  ephPad: 0.0332,
  pwTop: 0.36851,
  pwH: 0.10839,
  btnTop: 0.50435,
  btnH: 0.10981,
  btnFs: 0.0275,
  arrow: 0.026,
  btnGap: 0.02,
  divTop: 0.68222,
  orFs: 0.02245,
  orPad: 0.051,
  divH: 0.0026,
  gTop: 0.76445,
  gH: 0.09966,
  gIcon: 0.032,
  gtFs: 0.03205,
  gGap: 0.026,
  btTop: 0.89668,
  btFs: 0.02876,
  badgeH: 0.0742,
  heroLh: 1.1246,
  heroBot: 0.06493,
  heroGap: -0.30423,
  heroSide: 0.0525,
  heroFs: 0.1058,
};

const BADGE_PATH =
  "M449.0 0.0 435.0 0.0 415.0 10.0 200.0 249.0 187.0 276.0 189.0 299.0 212.0 326.0 232.0 332.0 289.0 334.0 289.0 516.0 301.0 543.0 324.0 556.0 346.0 556.0 374.0 536.0 573.0 311.0 582.0 288.0 579.0 264.0 559.0 240.0 539.0 233.0 478.0 230.0 478.0 32.0 470.0 13.0ZM442.0 38.0 446.0 250.0 466.0 267.0 540.0 270.0 547.0 285.0 341.0 520.0 332.0 522.0 324.0 514.0 321.0 314.0 307.0 300.0 295.0 297.0 233.0 297.0 224.0 291.0 221.0 282.0ZM1.0 67.0 4.0 81.0 17.0 90.0 216.0 90.0 223.0 87.0 232.0 74.0 228.0 57.0 215.0 49.0 18.0 49.0 5.0 57.0ZM0.0 285.0 4.0 300.0 17.0 308.0 105.0 308.0 118.0 299.0 121.0 291.0 119.0 278.0 111.0 270.0 103.0 267.0 17.0 267.0 4.0 275.0ZM1.0 495.0 4.0 511.0 10.0 517.0 23.0 520.0 179.0 520.0 191.0 516.0 200.0 500.0 196.0 488.0 182.0 479.0 18.0 479.0 9.0 483.0Z";

function photoRatio(vw) {
  const wide = 1 - PANE_RATIO;
  if (vw >= RAMP_HI) return wide;
  if (vw >= RAMP_LO) {
    const t = (RAMP_HI - vw) / (RAMP_HI - RAMP_LO);
    return wide + (PHOTO_MIN - wide) * t;
  }
  if (vw >= RAMP_LO2) {
    const t = (RAMP_LO - vw) / (RAMP_LO - RAMP_LO2);
    return PHOTO_MIN + (PHOTO_MIN2 - PHOTO_MIN) * t;
  }
  return PHOTO_MIN2;
}

/* camelCase TP key -> --tp-kebab-case */
const tpVar = (k) => `--tp-${k.replace(/[A-Z]/g, (c) => `-${c.toLowerCase()}`)}`;

function useLayoutEngine(refs, onMode) {
  useEffect(() => {
    const { root, photo, pane, card, cardIn, hero, hl1 } = refs;
    const el = {
      root: root.current,
      photo: photo.current,
      pane: pane.current,
      card: card.current,
      cardIn: cardIn.current,
      hero: hero.current,
    };
    if (!el.root || !el.photo || !el.pane || !el.card || !el.cardIn || !el.hero) return;

    const mqLandscape = window.matchMedia("(min-width:700px) and (min-aspect-ratio:51/50)");
    const mqPortrait = window.matchMedia("(min-width:700px) and (max-aspect-ratio:51/50)");

    let mode = "";

    /* Inline styles outrank the stylesheet, so they have to go before the next
       mode's CSS can apply. None of these carry a style attribute in the
       markup, so clearing is safe. */
    const clearInline = () => {
      for (const node of [el.photo, el.pane, el.card, el.cardIn, el.hero]) node.style.cssText = "";
    };

    const setMode = (next) => {
      if (next === mode) return;
      mode = next;
      clearInline();
      /* The mode goes through React rather than classList: the root's className
         is rendered, so a later re-render (the entrance releasing its guard)
         would wipe an imperatively-added class and the tablet layout would
         silently revert. Phone needs no class at all — it is a media query. */
      onMode(next);
    };

    const placeCard = (paneW, vh) => {
      const cs = Math.min(paneW / PANE_W, vh / CONTENT_H);
      const gapL = 1 * cs;
      const mT = 14 * cs;
      const mB = 13 * cs;
      const mR = 14 * cs;
      const cw = Math.max(CARD_W * cs, paneW - gapL - mR);
      const ch = vh - mT - mB;
      el.card.style.left = `${gapL}px`;
      el.card.style.top = `${mT}px`;
      el.card.style.width = `${cw}px`;
      el.card.style.height = `${ch}px`;
      el.card.style.borderRadius = `${26 * cs}px`;
      el.card.style.borderWidth = `${Math.max(1, cs)}px`;
      // the interior is scaled, which is what keeps every fixed px value true
      el.cardIn.style.transform = `translate(${(cw - CARD_W * cs) / 2}px,0) scale(${cs})`;
      el.root.style.setProperty("--cs", String(cs));
    };

    /* The hero rides the video's own cover-scale, but is never wider than its
       column. */
    const seatHero = (photoW, vh) => {
      const imgScale = Math.max(photoW / IMG_W, vh / IMG_H);
      const s = Math.min(imgScale / IMG_REF_SCALE, (photoW * 0.92) / HERO_W);
      el.hero.style.bottom = "0px";
      el.hero.style.transform = `scale(${s})`;
    };

    const land = () => {
      setMode("land");
      const vw = document.documentElement.clientWidth;
      const vh = el.root.clientHeight;
      const photoW = Math.round(vw * photoRatio(vw));
      const paneW = vw - photoW;
      el.photo.style.width = `${photoW}px`;
      el.photo.style.height = "100%";
      el.pane.style.left = `${photoW}px`;
      el.pane.style.width = `${paneW}px`;
      el.pane.style.top = "0px";
      el.pane.style.height = "100%";
      placeCard(paneW, vh);
      seatHero(photoW, vh);
    };

    /* Measures the full headline in its real font so the tablet measure can be
       set to a fraction of it — the line can then only break after "to". */
    const headlineMeasure = () => {
      const src = hl1.current;
      if (!src) return 0;
      const probe = document.createElement("span");
      const cs = getComputedStyle(src);
      probe.style.cssText =
        "position:absolute;left:-9999px;top:0;white-space:nowrap;visibility:hidden;";
      probe.style.fontFamily = cs.fontFamily;
      probe.style.fontSize = cs.fontSize;
      probe.style.fontWeight = cs.fontWeight;
      probe.style.letterSpacing = cs.letterSpacing;
      probe.style.wordSpacing = cs.wordSpacing;
      probe.style.fontVariationSettings = cs.fontVariationSettings;
      probe.textContent = "Find Signal to Action Instantly";
      document.body.appendChild(probe);
      const w = probe.getBoundingClientRect().width;
      probe.remove();
      return w;
    };

    const tabport = () => {
      setMode("tabport");
      const vw = document.documentElement.clientWidth;
      const vh = el.root.clientHeight;
      const band = Math.round(vh * 0.425);
      const side = Math.round(vw * TP.heroSide);
      const footer = Math.round(vh * 0.0297);

      el.photo.style.width = "100%";
      el.photo.style.height = `${band}px`;
      el.pane.style.left = "0px";
      el.pane.style.top = `${band}px`;
      el.pane.style.width = "100%";
      el.pane.style.height = `${vh - band}px`;

      const cw = vw - side * 2;
      const ch = vh - band - footer - side;
      el.card.style.left = `${side}px`;
      el.card.style.top = `${Math.round(side * 0.4)}px`;
      el.card.style.width = `${cw}px`;
      el.card.style.height = `${ch}px`;
      // fluid, not scaled: every interior value is a var off the card's own box
      el.cardIn.style.inset = "0";
      el.cardIn.style.transform = "none";

      const S = Math.min(ch, cw * REF_CARD_ASPECT);
      const basis = {
        pad: cw,
        orPad: cw,
        badgeH: band,
        heroBot: band,
        heroSide: vw,
        heroFs: band,
      };
      for (const [k, v] of Object.entries(TP)) {
        // heroLh is a line-height multiplier, not a length: written as px it
        // becomes a 500px leading and throws the headline out of the band.
        if (k === "heroLh") {
          el.root.style.setProperty(tpVar(k), String(v));
          continue;
        }
        /* heroGap is negative on purpose — it tightens the badge against the
           headline's leading. The reference figure (-0.304 of the band) was
           measured against a much larger leading than the one above; at this
           line-height it would lift the headline clean out of the band, so it
           is scaled to the same optical result. */
        if (k === "heroGap") {
          el.root.style.setProperty(tpVar(k), `${(v / 10) * band}px`);
          continue;
        }
        const base = basis[k] ?? (k.endsWith("Top") || k.endsWith("H") ? ch : S);
        el.root.style.setProperty(tpVar(k), `${v * base}px`);
      }
      el.root.style.setProperty("--band-h", `${band}px`);
      el.root.style.setProperty("--badge-k", String((band * TP.badgeH) / 37));
      el.root.style.setProperty("--tp-hero-measure", `${Math.round(headlineMeasure() * 0.61)}px`);
    };

    /* Deliberately empty: the phone layout is pure CSS flow, and measuring
       here would only leave stale desktop values latched on. */
    const phone = () => setMode("phone");

    const layout = () => {
      if (mqLandscape.matches) land();
      else if (mqPortrait.matches) tabport();
      else phone();
    };

    layout();
    /* A resize event is not enough on its own: if the component mounts inside a
       box that has no size yet (a hidden tab, an iframe still being laid out),
       the first pass reads a 0-wide viewport and picks the phone branch. The
       observer re-runs it the moment the element actually has a size. */
    const ro = new ResizeObserver(layout);
    ro.observe(el.root);
    window.addEventListener("resize", layout, { passive: true });
    window.addEventListener("orientationchange", layout);
    mqLandscape.addEventListener("change", layout);
    mqPortrait.addEventListener("change", layout);
    document.fonts?.ready.then(layout).catch(() => {});

    return () => {
      ro.disconnect();
      window.removeEventListener("resize", layout);
      window.removeEventListener("orientationchange", layout);
      mqLandscape.removeEventListener("change", layout);
      mqPortrait.removeEventListener("change", layout);
    };
  }, [refs, onMode]);
}

/* Surface establishes depth, the brand promise overlaps it, the form groups
   resolve last. Runs once; a resize never replays it. */
const STEPS = [
  { key: "card", delay: 40, duration: 820, soft: false },
  { key: "badge", delay: 120, duration: 480, soft: true },
  { key: "hl1", delay: 240, duration: 760, soft: false, clip: true },
  { key: "hl2", delay: 330, duration: 760, soft: false, clip: true },
  { key: "h1", delay: 470, duration: 620, soft: false, y: 10 },
  { key: "sub", delay: 570, duration: 560, soft: false, y: 10 },
  { key: "email", delay: 720, duration: 520, soft: true },
  { key: "pw", delay: 790, duration: 520, soft: true },
  { key: "login", delay: 930, duration: 560, soft: false },
  { key: "divider", delay: 1060, duration: 440, soft: true, y: 6 },
  { key: "gbtn", delay: 1150, duration: 540, soft: false },
  { key: "bottom", delay: 1260, duration: 500, soft: true, y: 6 },
];

function useEntrance(refs, release) {
  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion:reduce)").matches;
    if (reduce || typeof Element.prototype.animate !== "function") {
      release();
      return;
    }

    const ease = "cubic-bezier(.16,1,.3,1)";
    const softEase = "cubic-bezier(.22,1,.36,1)";
    const compact = window.matchMedia("(max-width:699px)").matches;
    let animations = [];
    let cancelled = false;

    /* Safety release. The timeline waits on fonts and then on two frames, and
       requestAnimationFrame does not run in a background tab — without this a
       page opened in one would sit on its hidden first frame. */
    const fallback = setTimeout(release, 3500);

    const start = () => {
      if (cancelled) return;
      clearTimeout(fallback);
      for (const step of STEPS) {
        const el = refs[step.key]?.current;
        if (!el) continue;
        let from;
        if (step.clip) {
          from = {
            opacity: 0,
            transform: `translateY(${compact ? 12 : 16}px)`,
            clipPath: "inset(100% 0 0 0)",
          };
        } else if (step.key === "card") {
          from = {
            opacity: 0,
            transform: compact ? "translateY(14px)" : "translateY(12px) scale(.988)",
          };
        } else {
          from = { opacity: 0, transform: `translateY(${step.y || 8}px)` };
        }
        const to = step.clip
          ? { opacity: 1, transform: "none", clipPath: "inset(0 0 0 0)" }
          : { opacity: 1, transform: "none" };
        animations.push(
          el.animate([from, to], {
            delay: step.delay,
            duration: step.duration,
            easing: step.soft ? softEase : ease,
            fill: "both",
          })
        );
      }

      /* The animation layer now owns the hidden first frame, so the CSS guard
         can drop without a flash. */
      release();

      Promise.allSettled(animations.map((a) => a.finished)).then(() => {
        // cancelling restores the authored static styles exactly — no fill residue
        animations.forEach((a) => a.cancel());
        animations = [];
      });
    };

    // fonts get a chance to land, but a slow font can never stall past 650ms
    Promise.race([
      document.fonts?.ready ?? Promise.resolve(),
      new Promise((r) => setTimeout(r, 650)),
    ]).then(() => requestAnimationFrame(() => requestAnimationFrame(start)));

    return () => {
      cancelled = true;
      clearTimeout(fallback);
      animations.forEach((a) => a.cancel());
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
}

function GoogleMark() {
  /* The four-colour G, built from arcs plus the blue bar rather than traced
     path data, so it stays geometrically correct at any size. */
  return (
    <svg className="sgl-g" viewBox="0 0 48 48" aria-hidden="true">
      <g fill="none" strokeWidth="9">
        <path d="M24 8.5A15.5 15.5 0 0 0 10.2 17" stroke="#EA4335" />
        <path d="M10.2 17A15.5 15.5 0 0 0 10.2 31" stroke="#FBBC05" />
        <path d="M10.2 31A15.5 15.5 0 0 0 24 39.5" stroke="#34A853" />
        <path d="M24 39.5A15.5 15.5 0 0 0 39.5 24" stroke="#4285F4" />
      </g>
      <rect x="23" y="19.5" width="17" height="9" fill="#4285F4" />
    </svg>
  );
}

export default function SplitSite() {
  useTemplateFont(
    "https://fonts.googleapis.com/css2?family=Archivo:wght@400;700&family=Manrope:wght@200..800&display=swap"
  );

  const root = useRef(null);
  const photo = useRef(null);
  const pane = useRef(null);
  const card = useRef(null);
  const cardIn = useRef(null);
  const hero = useRef(null);
  const badge = useRef(null);
  const hl1 = useRef(null);
  const hl2 = useRef(null);
  const h1 = useRef(null);
  const sub = useRef(null);
  const email = useRef(null);
  const pw = useRef(null);
  const login = useRef(null);
  const divider = useRef(null);
  const gbtn = useRef(null);
  const bottom = useRef(null);

  const refs = useRef({
    root, photo, pane, card, cardIn, hero, badge, hl1, hl2, h1, sub,
    email, pw, login, divider, gbtn, bottom,
  }).current;

  const [pending, setPending] = useState(true);
  const [mode, setMode] = useState("land");

  useLayoutEngine(refs, setMode);
  useEntrance(refs, () => setPending(false));

  return (
    <div
      className={`sgl${mode === "tabport" ? " is-tabport" : ""}${pending ? " is-entry" : ""}`}
      ref={root}
    >
      <div className="sgl-stage">
        <section className="sgl-photo" ref={photo}>
          {/* two responsive variants of the same file; CSS shows one */}
          <video
            className="sgl-photo-img sgl-photo-img--tall"
            src={VIDEO}
            autoPlay
            muted
            loop
            playsInline
            preload="auto"
            aria-label="A peregrine falcon in a high-speed dive"
          />
          <video
            className="sgl-photo-img sgl-photo-img--wide"
            src={VIDEO}
            aria-hidden="true"
            autoPlay
            muted
            loop
            playsInline
            preload="auto"
          />
          <div className="sgl-scrim" />

          <div className="sgl-hero" ref={hero}>
            <div className="sgl-badge" ref={badge}>
              <svg viewBox="0 0 582 557" aria-hidden="true">
                <path d={BADGE_PATH} fill="#fff" fillRule="evenodd" />
              </svg>
              <span>Built for fast-moving teams</span>
            </div>
            <div className="sgl-hl-wrap">
              <span className="sgl-hl sgl-hl1" ref={hl1}>
                Find Signal to Action
              </span>
              <span className="sgl-hl sgl-hl2" ref={hl2}>
                Instantly
              </span>
            </div>
          </div>
        </section>

        <section className="sgl-pane" ref={pane}>
          <div className="sgl-card" ref={card}>
            <div className="sgl-card-in" ref={cardIn}>
              <h1 className="sgl-col sgl-center sgl-h1" ref={h1}>
                Welcome Back!
              </h1>
              <p className="sgl-col sgl-center sgl-sub" ref={sub}>
                <b>Log in</b> to continue monitoring your signals.
              </p>

              <div className="sgl-field sgl-email" ref={email}>
                <input
                  type="email"
                  autoComplete="email"
                  aria-label="Email address"
                  placeholder="Eg. johndoe@gmail.com"
                />
              </div>

              <div className="sgl-field sgl-pw" ref={pw}>
                <input
                  type="password"
                  autoComplete="current-password"
                  aria-label="Password"
                  placeholder="Password"
                />
              </div>

              <button type="button" className="sgl-login" ref={login}>
                <span>Login</span>
                <svg className="sgl-arrow" viewBox="0 0 22 22" aria-hidden="true">
                  <path
                    d="M3 11h15.4M11 3.3l7.7 7.7-7.7 7.7"
                    stroke="#fff"
                    strokeWidth="2.6"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    fill="none"
                  />
                </svg>
              </button>

              <div className="sgl-divider" ref={divider}>
                <i />
                <b>OR</b>
                <i />
              </div>

              <button type="button" className="sgl-gbtn" ref={gbtn}>
                <GoogleMark />
                <span>Sign in with Google</span>
              </button>

              <p className="sgl-bottom" ref={bottom}>
                Don&#8217;t have an account? <a href="#top">Start Free</a>
              </p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
