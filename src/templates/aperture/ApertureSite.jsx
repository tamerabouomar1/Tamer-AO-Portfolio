import { useEffect, useRef, useState } from "react";
import useTemplateFont from "../useTemplateFont";
import "./aperture.css";

/* ── Aperture — Creative Studio ────────────────────────────────
   A studio hero in three moves, scoped under .ap.

   1. Ten panels wipe off the screen — the top row up, the bottom row down —
      staggered 50ms apart, so the page is uncovered rather than faded in.
   2. One enormous word sits BEHIND the photograph and is cropped by it. The
      word slides up from under the fold as the image settles, which is the
      only reason the crop reads as deliberate.
   3. A second photograph is stacked over the first and revealed by a soft
      spotlight that trails the cursor.

   The spotlight mask is drawn on a canvas rather than with a CSS radial
   gradient, for the same reason Strata does it: a gradient mask gives one
   ramp, and the falloff here needs six stops before the edge stops looking
   like a circle cut out with scissors. */

const BASE_IMG =
  "https://soft-zoom-63098134.figma.site/_assets/v11/5c9f982199fde1d9b85a20e5396f0fa7bacaf9a3.png?w=2560";
const REVEAL_IMG =
  "https://soft-zoom-63098134.figma.site/_assets/v11/6be2165e31648955b4e071f4cf2a50bc572b9bfd.png?w=1536";

const SPOTLIGHT_R = 260;
const BIG_WORD = "Visuals";
const HEADLINE = "I build compelling visual stories & motion that make ideas shine.";
const NAV = ["Work", "About", "Blog"];
const SOCIALS = ["Pinterest", "Behance", "Letterboxd"];
const EMAIL = "studio@aperture.co";

/* Drawn rather than fetched, so the template carries no image files of its
   own and nothing breaks when it is unzipped on someone else's machine. */
function Logo() {
  return (
    <svg className="ap-logo" viewBox="0 0 32 32" fill="none" aria-hidden="true">
      <circle cx="16" cy="16" r="14" stroke="currentColor" strokeWidth="2.5" />
      <path d="M16 2 L16 30 M2 16 L30 16" stroke="currentColor" strokeWidth="2.5" />
    </svg>
  );
}

function ArrowUpRight({ size = 18 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 18 18" fill="none" aria-hidden="true">
      <path
        d="M5 13L13 5M13 5H6M13 5V12"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/* The pill's white bed is a separate element rather than a background on the
   button, because it has to grow past the circle on hover while the circle
   slides back over it. One element cannot do both. */
function Cta({ children, small = false }) {
  return (
    <button type="button" className={`ap-cta${small ? " ap-cta--sm" : ""}`}>
      <span className="ap-cta__bed" />
      <span className="ap-cta__label">{children}</span>
      <span className="ap-cta__dot">
        <ArrowUpRight size={small ? 14 : 18} />
      </span>
    </button>
  );
}

function Splash() {
  const boxes = [0, 1, 2, 3, 4];
  return (
    <div className="ap-splash" aria-hidden="true">
      {["up", "down"].map((dir) => (
        <div key={dir} className={`ap-splash__row ap-splash__row--${dir}`}>
          {boxes.map((i) => (
            <span key={i} style={{ animationDelay: `${i * 0.05}s` }} />
          ))}
        </div>
      ))}
    </div>
  );
}

function RevealLayer({ image, x, y }) {
  const canvasRef = useRef(null);
  const layerRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const size = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    size();
    window.addEventListener("resize", size);
    return () => window.removeEventListener("resize", size);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    const layer = layerRef.current;
    if (!canvas || !layer) return;

    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const g = ctx.createRadialGradient(x, y, 0, x, y, SPOTLIGHT_R);
    g.addColorStop(0, "rgba(255,255,255,1)");
    g.addColorStop(0.4, "rgba(255,255,255,1)");
    g.addColorStop(0.6, "rgba(255,255,255,0.75)");
    g.addColorStop(0.75, "rgba(255,255,255,0.4)");
    g.addColorStop(0.88, "rgba(255,255,255,0.12)");
    g.addColorStop(1, "rgba(255,255,255,0)");

    ctx.fillStyle = g;
    ctx.beginPath();
    ctx.arc(x, y, SPOTLIGHT_R, 0, Math.PI * 2);
    ctx.fill();

    const url = canvas.toDataURL();
    layer.style.maskImage = `url(${url})`;
    layer.style.webkitMaskImage = `url(${url})`;
    layer.style.maskSize = "100% 100%";
    layer.style.webkitMaskSize = "100% 100%";
  }, [x, y]);

  return (
    <>
      <canvas ref={canvasRef} className="ap-canvas" />
      <div
        ref={layerRef}
        className="ap-reveal"
        style={{ backgroundImage: `url(${image})` }}
      />
    </>
  );
}

export default function ApertureSite() {
  useTemplateFont(
    "https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap"
  );

  const [menuOpen, setMenuOpen] = useState(false);

  const mouse = useRef({ x: -999, y: -999 });
  const smooth = useRef({ x: -999, y: -999 });
  const [pos, setPos] = useState({ x: -999, y: -999 });

  useEffect(() => {
    const onMove = (e) => {
      mouse.current = { x: e.clientX, y: e.clientY };
    };
    window.addEventListener("mousemove", onMove, { passive: true });

    let raf = 0;
    const tick = () => {
      // Eased rather than pinned to the pointer: the lag is what gives the
      // light weight. Snapped to the cursor it reads as a cheap overlay.
      smooth.current.x += (mouse.current.x - smooth.current.x) * 0.1;
      smooth.current.y += (mouse.current.y - smooth.current.y) * 0.1;
      setPos({ x: smooth.current.x, y: smooth.current.y });
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    return () => {
      window.removeEventListener("mousemove", onMove);
      cancelAnimationFrame(raf);
    };
  }, []);

  // Escape closes the panel, which is the only way out for a keyboard.
  useEffect(() => {
    if (!menuOpen) return;
    const onKey = (e) => e.key === "Escape" && setMenuOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [menuOpen]);

  return (
    <div className="ap">
      <Splash />

      {/* difference blending, so one mark stays legible over both the pale
          background and the photograph without a second coloured copy */}
      <div className="ap-logomark">
        <Logo />
      </div>

      <div className="ap-burgerwrap">
        <button
          type="button"
          className={`ap-burger${menuOpen ? " is-open" : ""}`}
          onClick={() => setMenuOpen((v) => !v)}
          aria-expanded={menuOpen}
          aria-label={menuOpen ? "Close menu" : "Open menu"}
        >
          <span />
          <span />
        </button>
      </div>

      <div className={`ap-menu${menuOpen ? " is-open" : ""}`}>
        <nav className="ap-menu__nav">
          {NAV.map((l) => (
            <button key={l} type="button" onClick={() => setMenuOpen(false)}>
              {l}
            </button>
          ))}
        </nav>

        <div className="ap-menu__contact">
          <a className="ap-menu__email" href={`mailto:${EMAIL}`}>
            {EMAIL}
          </a>
          <div className="ap-menu__socials">
            {SOCIALS.map((s) => (
              <button key={s} type="button">
                {s}
              </button>
            ))}
          </div>
          <Cta small>Let&apos;s talk</Cta>
        </div>
      </div>

      <main className="ap-hero">
        {/* Behind the photograph on purpose: the image crops the word, and the
            word only stops looking like an accident because it arrives late,
            sliding up from below as the picture settles. */}
        <div className="ap-word">
          <h2>{BIG_WORD}</h2>
        </div>

        <div className="ap-base" style={{ backgroundImage: `url(${BASE_IMG})` }} />
        <RevealLayer image={REVEAL_IMG} x={pos.x} y={pos.y} />

        <div className="ap-copy">
          <div className="ap-copy__inner">
            <h1 className="ap-headline">
              {HEADLINE.split(" ").map((word, i) => (
                <span
                  key={`${word}-${i}`}
                  style={{ animationDelay: `${1 + i * 0.05}s` }}
                >
                  {word}
                </span>
              ))}
            </h1>
            <div className="ap-ctawrap">
              <Cta>Start a project now</Cta>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
