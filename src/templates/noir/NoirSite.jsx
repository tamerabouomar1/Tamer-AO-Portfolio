import { useEffect, useRef, useState } from "react";
import useTemplateFont from "../useTemplateFont";
import useBoomerangVideo from "../useBoomerangVideo";
import "./noir.css";

/* ── Noir — Creative Hero ──────────────────────────────────────
   Black, one enormous italic serif word over a boomerang video that leans
   with the cursor, with liquid-glass chrome floating on top.

   The reference used GSAP purely for `gsap.set()` on a parallax layer — a
   whole animation library to write a transform. That's done here with the
   same eased lerp straight onto the node, so the template ships with no
   extra dependency for a buyer to install or keep updated. */

const VIDEO =
  "https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260511_080827_a9e5ad52-b6ee-4e79-b393-d936f179cfd7.mp4";

const NAV = ["Gallery", "Styles", "API", "Pricing", "Blog"];
const STRENGTH = 20;

function LogoMark() {
  return (
    <svg className="nr-logo" viewBox="0 0 44 26" fill="#fff" aria-hidden="true">
      <rect x="0" y="3" width="14" height="20" rx="3" />
      <rect x="16" y="3" width="12" height="20" rx="3" />
      <rect x="30" y="3" width="14" height="20" rx="3" />
    </svg>
  );
}

export default function NoirSite() {
  useTemplateFont(
    "https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=Barlow:wght@300;400;500;600&display=swap"
  );
  const { videoRef, canvasRef, ready } = useBoomerangVideo();
  const bgRef = useRef(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 50);
    return () => clearTimeout(t);
  }, []);

  // Cursor parallax: the pointer sets a target, the frame loop eases toward
  // it. Writing the mouse position straight to the transform would feel
  // twitchy; the lerp is what makes it read as drift.
  useEffect(() => {
    if (!window.matchMedia("(hover: hover)").matches) return;
    const el = bgRef.current;
    if (!el) return;

    let tx = 0, ty = 0, cx = 0, cy = 0, raf = 0;

    const onMove = (e) => {
      const hx = window.innerWidth / 2;
      const hy = window.innerHeight / 2;
      tx = ((e.clientX - hx) / hx) * STRENGTH;
      ty = ((e.clientY - hy) / hy) * STRENGTH;
    };

    const tick = () => {
      cx += (tx - cx) * 0.06;
      cy += (ty - cy) * 0.06;
      el.style.transform = `scale(1.08) translate3d(${cx}px, ${cy}px, 0)`;
      raf = requestAnimationFrame(tick);
    };

    window.addEventListener("mousemove", onMove, { passive: true });
    raf = requestAnimationFrame(tick);
    return () => {
      window.removeEventListener("mousemove", onMove);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div className="nr">
      <div className="nr-bg" ref={bgRef}>
        <video
          ref={videoRef}
          src={VIDEO}
          muted
          playsInline
          preload="auto"
          crossOrigin="anonymous"
          style={{ display: ready ? "none" : "block" }}
        />
        <canvas ref={canvasRef} style={{ display: ready ? "block" : "none" }} />
      </div>

      <nav className="nr-nav">
        <div className="nr-pill liquid-glass">
          <LogoMark />
          <div className="nr-links">
            {NAV.map((l) => (
              <a key={l} href={`#${l.toLowerCase()}`}>
                {l}
              </a>
            ))}
          </div>
          <div className="nr-navright">
            <a href="#signin">Sign in</a>
            <a className="nr-try liquid-glass-strong" href="#try">
              Try it free
            </a>
          </div>
        </div>
      </nav>

      <div className={`nr-titlewrap${mounted ? " is-in" : ""}`}>
        <h1 className="nr-title">MicroVisuals</h1>
      </div>

      <div className={`nr-bottom${mounted ? " is-in" : ""}`}>
        <p className="nr-note">
          Forma&apos;s AI understands context, composition, and style like a creative
          director would.
        </p>

        <div className="nr-actions">
          <a className="nr-primary" href="#start">
            <span>Start generating</span>
          </a>
          <a className="nr-secondary liquid-glass" href="#templates">
            See templates
          </a>
        </div>

        <p className="nr-note nr-note--right">
          Describe what you see in your head — get images that actually match.
        </p>
      </div>
    </div>
  );
}
