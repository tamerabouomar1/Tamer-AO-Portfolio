import { useEffect, useRef, useState } from "react";
import useTemplateFont from "../useTemplateFont";
import "./strata.css";

/* ── Strata — Interactive Hero ─────────────────────────────────
   Two stacked photographs where the cursor carries a soft spotlight that
   reveals the second one through the first. Scoped under .st.

   The mask is generated on a canvas rather than with a CSS radial-gradient
   because a gradient mask can only be one hard stop or a linear ramp; the
   six stops here are what make the edge read as light falling off rather
   than a circle cut out with scissors. */

const BG_1 =
  "https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260609_195923_b0ba8ace-1d1d-4f2c-9a28-1ab84b330680.png&w=1280&q=85";
const BG_2 =
  "https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260609_201152_bba90a12-bf12-459f-91f0-51f237dbaf3b.png&w=1280&q=85";

const SPOTLIGHT_R = 260;
const NAV = ["Course", "Field Guides", "Geology", "Plans", "Live Tour"];

function Logo() {
  return (
    <svg className="st-logo" viewBox="0 0 256 256" fill="#ffffff" aria-hidden="true">
      <path d="M 256 256 L 128 256 L 0 128 L 128 128 Z M 256 128 L 128 128 L 0 0 L 128 0 Z" />
    </svg>
  );
}

function RevealLayer({ image, x, y }) {
  const canvasRef = useRef(null);
  const layerRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const layer = layerRef.current;
    if (!canvas || !layer) return;

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
      <canvas ref={canvasRef} className="st-canvas" />
      <div
        ref={layerRef}
        className="st-reveal"
        style={{ backgroundImage: `url(${image})` }}
      />
    </>
  );
}

export default function StrataSite() {
  useTemplateFont(
    "https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Playfair+Display:ital,wght@1,400;1,500;1,600&display=swap"
  );

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
      // Easing the spotlight instead of pinning it to the pointer is what
      // gives it weight; snapped to the cursor it reads as a cheap overlay.
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

  return (
    <div className="st">
      <section className="st-hero">
        <div className="st-base hero-zoom" style={{ backgroundImage: `url(${BG_1})` }} />
        <RevealLayer image={BG_2} x={pos.x} y={pos.y} />

        <nav className="st-nav">
          <span className="st-brand">
            <Logo />
            <span className="st-wordmark">Lithos</span>
          </span>

          <div className="st-pill">
            {NAV.map((l, i) => (
              <button key={l} className={i === 0 ? "is-active" : ""} type="button">
                {l}
              </button>
            ))}
          </div>

          <button className="st-signup" type="button">
            Sign Up
          </button>
        </nav>

        <div className="st-heading">
          <h1>
            <span className="st-line1 hero-anim hero-reveal" style={{ animationDelay: "0.25s" }}>
              Layers hold
            </span>
            <span className="st-line2 hero-anim hero-reveal" style={{ animationDelay: "0.42s" }}>
              tales of time
            </span>
          </h1>
        </div>

        <div className="st-left hero-anim hero-fade" style={{ animationDelay: "0.7s" }}>
          <p>
            Every layer of sediment records a chapter of our planet, from ancient seabeds
            to drifting ash, layered across millions of years beneath us.
          </p>
        </div>

        <div className="st-right hero-anim hero-fade" style={{ animationDelay: "0.85s" }}>
          <p>
            Our interactive maps let you peel back the crust to trace how stones, fossils,
            and deep time combine to shape the ground beneath your feet.
          </p>
          <button className="st-cta" type="button">
            Start Digging
          </button>
        </div>
      </section>
    </div>
  );
}
