import { useEffect, useRef, useState } from "react";
import useTemplateFont from "../useTemplateFont";
import "./refract.css";

/* ── Refract — Liquid Glass Hero (Signature) ───────────────────
   One locked screen: a full-strength iridescent film, dark type straight on
   it, and a card that is a real refraction of the footage rather than a blur.
   Nothing is laid over the video — no scrim, no tint, no gradient. If the type
   ever needs help, change the clip.

   THE MECHANIC. The card is a window onto a refracted duplicate of the
   background video:

     1. a 2D canvas redraws the current video frame every animation frame,
        reproducing object-fit: cover by hand;
     2. that canvas carries an SVG filter which turbulence-displaces it three
        times at three strengths (65 / 56 / 47), masks each pass down to one
        colour channel, and screens them back together — so the offsets between
        channels read as chromatic fringing;
     3. an alpha-derived edge mask multiplies the noise, killing displacement in
        the middle of the element and leaving it strong at the rim. That is the
        thick-glass bevel.

   Two decisions inside the loop are worth keeping. The duplicate is sized to
   the VIEWPORT, not the card: the filter shifts each channel by a different
   amount, so the filtered element's own leading edges show hard channel bands
   — at viewport size those bands fall outside the card and only clean
   refraction shows through. And it stays at 1x even on retina, because the
   filter's cost scales with pixel count and 4x the work buys nothing on a soft
   refraction.

   Known and deliberate: under 640px the card is nearly viewport-wide, so its
   left edge sits inside the 45px edge-mask zone and one chromatic band shows
   as a blue stripe. Widening the filter to hide it would flatten the bevel
   everywhere else. */

const VIDEO =
  "https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260816_125506_3a597378-ec85-4ebd-bd22-03b45508ac62.mp4";

/* The duplicate stays at 1x on purpose — see the note above. */
const DUP_PIXEL_RATIO = 1;

const MENU_LINKS = ["About", "Research", "Projects", "Journal", "Contact"];

const FINDINGS = [
  {
    title: "Canopy Pulse Analysis 09.17",
    text: "Identified harmonic oscillation links between root mycelia networks and surrounding atmospheric moisture.",
  },
  {
    title: "Watershed Harmonic Index 11.06",
    text: "Forecasting framework for ecosystem regeneration spanning six continents using over 2,400 sensor arrays.",
  },
];

/* A static, hand-authored waveform: irregular amplitudes decaying left to
   right, so it reads as a captured signal rather than a sine. */
const WAVE =
  "M0 30 C10 30 12 45 18 45 C24 45 26 10 34 10 C42 10 44 40 52 40 C60 40 62 5 70 5 C78 5 80 42 88 42 C96 42 98 15 106 15 C114 15 116 38 124 38 C132 38 134 20 142 20 C150 20 152 35 160 35 C168 35 170 22 178 22 C186 22 188 32 196 32 C204 32 210 28 220 28";

/* Keeps the card's refracted duplicate registered with the real video behind
   it, every frame. */
function useGlassCard(cardRef, videoRef, dupRef, canvasRef) {
  useEffect(() => {
    let raf = 0;
    let lastW = 0;
    let lastH = 0;

    const frame = () => {
      raf = requestAnimationFrame(frame);

      const card = cardRef.current;
      const video = videoRef.current;
      const dup = dupRef.current;
      const canvas = canvasRef.current;
      if (!card || !video || !dup || !canvas) return;

      const rect = card.getBoundingClientRect();
      if (!rect.width || !rect.height) return;
      if (!video.videoWidth || !video.videoHeight) return;

      const vw = document.documentElement.clientWidth;
      const vh = document.documentElement.clientHeight;

      /* The duplicate is absolutely positioned inside the card, so offsetting
         it by the card's own position lands it exactly over the viewport
         origin: its pixels line up 1:1 with the video behind the card, and the
         card's overflow + border-radius do all the clipping. */
      dup.style.left = `${-rect.left}px`;
      dup.style.top = `${-rect.top}px`;
      dup.style.width = `${vw}px`;
      dup.style.height = `${vh}px`;

      const w = Math.round(vw * DUP_PIXEL_RATIO);
      const h = Math.round(vh * DUP_PIXEL_RATIO);
      if (w !== lastW || h !== lastH) {
        canvas.width = w;
        canvas.height = h;
        lastW = w;
        lastH = h;
      }

      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      // object-fit: cover, by hand
      const cover = Math.max(vw / video.videoWidth, vh / video.videoHeight);
      const sw = vw / cover;
      const sh = vh / cover;
      const sx = (video.videoWidth - sw) / 2;
      const sy = (video.videoHeight - sh) / 2;

      try {
        ctx.drawImage(video, sx, sy, sw, sh, 0, 0, w, h);
      } catch {
        // a frame may not be decodable yet; the next one will be
      }
    };

    raf = requestAnimationFrame(frame);
    return () => cancelAnimationFrame(raf);
  }, [cardRef, videoRef, dupRef, canvasRef]);
}

function GlassDefs() {
  return (
    <svg className="trn-defs" width="0" height="0" aria-hidden="true" focusable="false">
      <defs>
        <filter
          id="trn-liquid-glass"
          x="-30%"
          y="-30%"
          width="160%"
          height="160%"
          colorInterpolationFilters="sRGB"
        >
          {/* the refraction normal map */}
          <feTurbulence type="fractalNoise" baseFrequency="0.012 0.015" numOctaves="3" result="noise" />

          {/* alpha pushed to full, blurred, then inverted: an edge mask that is
              ~0 in the interior and rises toward the borders */}
          <feColorMatrix
            in="SourceAlpha"
            type="matrix"
            result="boosted_alpha"
            values="0 0 0 0 0
                    0 0 0 0 0
                    0 0 0 0 0
                    0 0 0 100 0"
          />
          <feGaussianBlur in="boosted_alpha" stdDeviation="45" result="blurred_alpha" />
          <feComponentTransfer in="blurred_alpha" result="edge_mask">
            <feFuncA type="linear" slope="-1.3" intercept="1" />
          </feComponentTransfer>

          {/* noise x mask: displacement only at the rim = a glass bevel */}
          <feComposite
            in="noise"
            in2="edge_mask"
            operator="arithmetic"
            k1="1"
            k2="0"
            k3="0"
            k4="0"
            result="masked_noise"
          />

          {/* chromatic dispersion: one displacement pass per channel */}
          <feDisplacementMap
            in="SourceGraphic"
            in2="masked_noise"
            scale="65"
            xChannelSelector="R"
            yChannelSelector="G"
            result="red_displaced"
          />
          <feColorMatrix
            in="red_displaced"
            type="matrix"
            result="red"
            values="1 0 0 0 0
                    0 0 0 0 0
                    0 0 0 0 0
                    0 0 0 1 0"
          />
          <feDisplacementMap
            in="SourceGraphic"
            in2="masked_noise"
            scale="56"
            xChannelSelector="R"
            yChannelSelector="G"
            result="green_displaced"
          />
          <feColorMatrix
            in="green_displaced"
            type="matrix"
            result="green"
            values="0 0 0 0 0
                    0 1 0 0 0
                    0 0 0 0 0
                    0 0 0 1 0"
          />
          <feDisplacementMap
            in="SourceGraphic"
            in2="masked_noise"
            scale="47"
            xChannelSelector="R"
            yChannelSelector="G"
            result="blue_displaced"
          />
          <feColorMatrix
            in="blue_displaced"
            type="matrix"
            result="blue"
            values="0 0 0 0 0
                    0 0 0 0 0
                    0 0 1 0 0
                    0 0 0 1 0"
          />

          <feBlend in="red" in2="green" mode="screen" result="rg" />
          <feBlend in="rg" in2="blue" mode="screen" result="chromatic_dispersion" />
        </filter>
      </defs>
    </svg>
  );
}

function Rule({ side }) {
  return (
    <div className={`trn-rule trn-rule--${side}`} aria-hidden="true">
      <span className="trn-rule__seg trn-rule__seg--end" />
      <span className="trn-rule__plus">+</span>
      <span className="trn-rule__seg trn-rule__seg--mid" />
      <span className="trn-rule__plus">+</span>
      <span className="trn-rule__seg trn-rule__seg--end" />
    </div>
  );
}

const ICON = {
  fill: "none",
  stroke: "currentColor",
  strokeWidth: "1.5",
  strokeLinecap: "round",
  strokeLinejoin: "round",
};

export default function RefractSite() {
  useTemplateFont(
    "https://db.onlinewebfonts.com/c/0e6de1ec911a2e267ff136bbdd384a44?family=Helvetica+Neue+Light"
  );

  const cardRef = useRef(null);
  const videoRef = useRef(null);
  const dupRef = useRef(null);
  const canvasRef = useRef(null);
  const openRef = useRef(null);
  const closeRef = useRef(null);
  const [open, setOpen] = useState(false);

  useGlassCard(cardRef, videoRef, dupRef, canvasRef);

  /* Focus follows the panel: into the close button on open, back to the
     hamburger on close. Escape only does anything while open. */
  useEffect(() => {
    const target = open ? closeRef.current : openRef.current;
    target?.focus({ preventScroll: true });
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <div className="trn">
      <video
        ref={videoRef}
        className="trn-video"
        src={VIDEO}
        aria-hidden="true"
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
      />

      <GlassDefs />

      <main className="trn-hero">
        <Rule side="left" />
        <Rule side="right" />

        <nav className="trn-nav">
          <button
            ref={openRef}
            type="button"
            className="trn-nav__item"
            aria-expanded={open}
            aria-controls="trn-menu"
            onClick={() => setOpen(true)}
          >
            <svg className="trn-icon" width="20" height="20" viewBox="0 0 24 24" {...ICON} aria-hidden="true">
              <line x1="4" y1="6" x2="20" y2="6" />
              <line x1="4" y1="12" x2="20" y2="12" />
              <line x1="4" y1="18" x2="20" y2="18" />
            </svg>
            <span className="trn-nav__label trn-nav__label--menu">Menu</span>
          </button>

          <a className="trn-nav__item" href="#top">
            <span className="trn-nav__dot" aria-hidden="true" />
            <span className="trn-nav__label">Book a call</span>
          </a>
        </nav>

        <div className="trn-bottom">
          <div className="trn-lede">
            <h1 className="trn-lede__title">
              Signals from
              <br />
              the Deep Green
            </h1>
            <p className="trn-lede__body">
              An open research collective mapping, decoding, and archiving the silent
              vibrations that bind our planet’s ecological networks.
            </p>

            <a className="trn-chamfer" href="#top">
              <span className="trn-chamfer__glass" aria-hidden="true" />
              <svg
                className="trn-chamfer__outline"
                viewBox="0 0 260 48"
                preserveAspectRatio="none"
                aria-hidden="true"
              >
                <polygon
                  points="14,0 260,0 260,34 246,48 0,48 0,14"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  vectorEffect="non-scaling-stroke"
                />
              </svg>
              <span className="trn-chamfer__label">Start listening</span>
              <svg className="trn-icon" width="16" height="16" viewBox="0 0 24 24" {...ICON} aria-hidden="true">
                <path d="M5 12h14" />
                <path d="m12 5 7 7-7 7" />
              </svg>
            </a>
          </div>

          <aside className="trn-card" ref={cardRef}>
            <div className="trn-dup" ref={dupRef}>
              <canvas className="trn-dup__canvas" ref={canvasRef} />
            </div>
            <div className="trn-card__frost" aria-hidden="true" />

            <div className="trn-card__head">
              <h2 className="trn-card__title">Latest findings</h2>
              <span className="trn-card__index">//02</span>
            </div>

            <div className="trn-card__body">
              {FINDINGS.map((f) => (
                <div className="trn-finding" key={f.title}>
                  <h3 className="trn-finding__title">{f.title}</h3>
                  <p className="trn-finding__text">{f.text}</p>
                </div>
              ))}
            </div>

            <svg className="trn-card__wave" viewBox="0 0 220 50" fill="none" aria-hidden="true">
              <path d={WAVE} stroke="black" strokeWidth="1.8" strokeLinecap="round" fill="none" />
            </svg>
          </aside>
        </div>
      </main>

      <div className={`trn-menu${open ? " is-open" : ""}`} id="trn-menu">
        <div className="trn-menu__backdrop" onClick={() => setOpen(false)} />
        <div className="trn-menu__panel">
          <button
            ref={closeRef}
            type="button"
            className="trn-menu__close"
            onClick={() => setOpen(false)}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" {...ICON} aria-hidden="true">
              <path d="M18 6 6 18" />
              <path d="m6 6 12 12" />
            </svg>
            Close
          </button>

          <nav className="trn-menu__nav">
            {MENU_LINKS.map((l) => (
              <a className="trn-menu__link" key={l} href="#top" onClick={() => setOpen(false)}>
                <span className="trn-menu__linkText">{l}</span>
                <svg
                  className="trn-menu__arrow trn-icon"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  {...ICON}
                  aria-hidden="true"
                >
                  <path d="M5 12h14" />
                  <path d="m12 5 7 7-7 7" />
                </svg>
              </a>
            ))}
          </nav>

          <div className="trn-menu__foot">
            <span className="trn-menu__footLabel">Get in touch</span>
            <a className="trn-menu__mail" href="mailto:hello@terranova.earth">
              hello@terranova.earth
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
