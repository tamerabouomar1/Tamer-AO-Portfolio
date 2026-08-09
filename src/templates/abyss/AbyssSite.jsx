import { useEffect, useRef } from "react";
import useTemplateFont from "../useTemplateFont";
import "./tokens.css";
import "./abyss.css";

/* ── Abyss — Fintech Terminal (Signature) ──────────────────────
   A deep-water trading terminal. Depth is communicated by a three-step teal
   surface stack (deep → abyss → kelp), never by shadow: objects float at
   different depths in water rather than sitting on paper.

   Colour is rationed hard. Whites and silvers carry every word; the aurora
   gradient is allowed on exactly one button, and the lavender pink is only
   ever a large statistic. Body text is silver, not white — pure white is
   reserved for headings and nav.

   The signature visual is a rotating particle sphere, projected in 2D on a
   canvas. Points are sorted by depth each frame so the far side dims and
   shrinks, which is what sells it as a sphere rather than a disc. */

const NAV = ["Firm", "Trading", "Liquidity", "Research", "Careers"];

const STATS = [
  ["$18.21B", "Notional traded, 2026"],
  ["94", "Venues connected"],
  ["11 ms", "Median round trip"],
];

const DIVISIONS = [
  { title: "Proprietary Trading", body: "Systematic strategies run across spot, perpetuals and options on ninety-four venues." },
  { title: "Liquidity Solutions", body: "Continuous two-sided markets for issuers and exchanges, quoted around the clock." },
  { title: "Careers", body: "Researchers and engineers who would rather own a problem than be assigned one." },
];

const POINTS = 900;

function useSphere(canvasRef) {
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");

    let raf = 0, w = 0, h = 0, dpr = 1;

    // Fibonacci sphere: even coverage without the pole clustering that
    // naive lat/long sampling produces.
    const pts = Array.from({ length: POINTS }, (_, i) => {
      const y = 1 - (i / (POINTS - 1)) * 2;
      const r = Math.sqrt(Math.max(0, 1 - y * y));
      const theta = i * Math.PI * (3 - Math.sqrt(5));
      return {
        x: Math.cos(theta) * r,
        y,
        z: Math.sin(theta) * r,
        pink: Math.random() < 0.14,
      };
    });

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      dpr = Math.min(2, window.devicePixelRatio || 1);
      w = rect.width; h = rect.height;
      canvas.width = Math.max(1, w * dpr);
      canvas.height = Math.max(1, h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const frame = (t) => {
      ctx.clearRect(0, 0, w, h);
      const cx = w / 2, cy = h / 2;
      const rad = Math.min(w, h) * 0.42;
      const a = reduce.matches ? 0.6 : t / 9000;
      const cos = Math.cos(a), sin = Math.sin(a);

      // Painter's algorithm: back of the sphere drawn first.
      const projected = pts.map((p) => {
        const x = p.x * cos - p.z * sin;
        const z = p.x * sin + p.z * cos;
        return { x, y: p.y, z, pink: p.pink };
      }).sort((m, n) => m.z - n.z);

      for (const p of projected) {
        const depth = (p.z + 1) / 2;           // 0 far, 1 near
        const scale = 0.55 + depth * 0.45;      // weak perspective
        const px = cx + p.x * rad * scale;
        const py = cy + p.y * rad * scale;
        const size = 0.7 + depth * 1.5;
        ctx.globalAlpha = 0.12 + depth * 0.75;
        ctx.fillStyle = p.pink ? "#fde9ff" : depth > 0.72 ? "#cbfffc" : "#00827c";
        ctx.beginPath();
        ctx.arc(px, py, size, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1;
      if (!reduce.matches) raf = requestAnimationFrame(frame);
    };

    resize();
    raf = requestAnimationFrame(frame);
    window.addEventListener("resize", resize);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
    };
  }, [canvasRef]);
}

function ArrowGlyph() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"
      strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M7 17 17 7" /><path d="M9 7h8v8" />
    </svg>
  );
}

/* Flat molecular diagram: circles joined by hairlines, no fills. */
function Molecule() {
  const nodes = [[50, 18], [18, 44], [82, 44], [34, 82], [66, 82], [50, 52]];
  const links = [[0, 5], [1, 5], [2, 5], [3, 5], [4, 5], [0, 1], [0, 2], [3, 4]];
  return (
    <svg className="aby-molecule" viewBox="0 0 100 100" aria-hidden="true">
      {links.map(([a, b], i) => (
        <line key={i} x1={nodes[a][0]} y1={nodes[a][1]} x2={nodes[b][0]} y2={nodes[b][1]} />
      ))}
      {nodes.map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r={i === 5 ? 6 : 4} />
      ))}
    </svg>
  );
}

export default function AbyssSite() {
  useTemplateFont(
    "https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500&display=swap"
  );
  const canvasRef = useRef(null);
  useSphere(canvasRef);

  return (
    <div className="aby">
      <header className="aby-nav">
        <span className="aby-mark">Abyss</span>
        <nav>
          {NAV.map((l, i) => (
            <a key={l} href="#top" className={i === 0 ? "is-on" : ""}>{l}</a>
          ))}
        </nav>
        <button className="aby-cta" type="button">Get in touch</button>
      </header>

      <section className="aby-hero">
        <canvas ref={canvasRef} className="aby-sphere" aria-hidden="true" />
        <div className="aby-hero-copy">
          <span className="aby-eyebrow">Abyss</span>
          <h1 className="aby-display">Liquidity, at depth.</h1>
          <p className="aby-body">
            A research-led trading firm making continuous markets across ninety-four
            venues, in every hour the world is awake.
          </p>
          <button className="aby-cta aby-cta--grad" type="button">Request a quote</button>
        </div>
      </section>

      <section className="aby-stats">
        {STATS.map(([n, l]) => (
          <div key={l}>
            <strong>{n}</strong>
            <span>{l}</span>
          </div>
        ))}
      </section>

      <section className="aby-explore">
        <div className="aby-explore-list">
          <span className="aby-eyebrow">Explore</span>
          {DIVISIONS.map((d) => (
            <article className="aby-row" key={d.title}>
              <div>
                <h3>{d.title}</h3>
                <p className="aby-body">{d.body}</p>
              </div>
              <button className="aby-arrow" type="button" aria-label={`Go to ${d.title}`}>
                <ArrowGlyph />
              </button>
            </article>
          ))}
        </div>
        <div className="aby-explore-art">
          <Molecule />
        </div>
      </section>

      <section className="aby-well">
        <span className="aby-eyebrow">Work with us</span>
        <h2 className="aby-heading">The market never closes. Neither do we.</h2>
        <button className="aby-cta" type="button">Talk to the desk</button>
      </section>

      <footer className="aby-foot">
        <span className="aby-mark">Abyss</span>
        <p>Abyss Capital, 2026. Nothing here is an offer or a solicitation.</p>
      </footer>
    </div>
  );
}
