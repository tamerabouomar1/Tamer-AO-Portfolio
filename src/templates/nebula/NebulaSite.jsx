import { useEffect, useRef } from "react";
import useTemplateFont from "../useTemplateFont";
import "./tokens.css";
import "./nebula.css";

/* ── Nebula — AI Product (Signature) ───────────────────────────
   Pure black void, one violet accent, amber for emphasis. Hierarchy comes
   from scale and tracking, never from weight: every headline is 400, body is
   200. That inversion is the whole system, so resist bolding anything.

   The signature gesture is a constellation of tiny outlined triangles that
   settle into a brain shape. It is drawn on a canvas rather than shipped as
   an image because it has to breathe, and because a buyer can retint the
   whole thing by editing one array.

   Sizes are authored against a 1440px design width and scale down with
   clamp(), so the 113px display never overflows a phone. */

const PALETTE = ["#8052ff", "#ffb829", "#15846e", "#c471ff", "#4d7dff", "#ff5fa2"];
const COUNT = 620;

/** Rough half-brain outline in unit space, mirrored to make the full shape. */
const LOBE = [
  [0.10, 0.46], [0.14, 0.30], [0.26, 0.17], [0.42, 0.11], [0.50, 0.14],
  [0.50, 0.90], [0.40, 0.90], [0.32, 0.82], [0.20, 0.80], [0.12, 0.68],
];

function insideLobe(x, y) {
  // even-odd ray cast against the polygon above
  let inside = false;
  for (let i = 0, j = LOBE.length - 1; i < LOBE.length; j = i++) {
    const [xi, yi] = LOBE[i];
    const [xj, yj] = LOBE[j];
    if (yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi) inside = !inside;
  }
  return inside;
}

function useConstellation(canvasRef) {
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");

    let raf = 0;
    let w = 0, h = 0, dpr = 1;
    let dots = [];

    // Rejection-sample the lobe, then mirror, so density follows the shape
    // instead of a bounding box.
    const build = () => {
      dots = [];
      let guard = 0;
      while (dots.length < COUNT && guard < COUNT * 200) {
        guard++;
        const ux = Math.random();
        const uy = Math.random();
        const half = ux < 0.5 ? ux : 1 - ux;
        if (!insideLobe(half, uy)) continue;
        dots.push({
          x: ux, y: uy,
          r: 1.6 + Math.random() * 2.6,
          c: PALETTE[(Math.random() * PALETTE.length) | 0],
          a: 0.25 + Math.random() * 0.75,
          ph: Math.random() * Math.PI * 2,
          sp: 0.4 + Math.random() * 0.9,
        });
      }
      // ambient drift outside the shape
      for (let i = 0; i < 90; i++) {
        dots.push({
          x: Math.random(), y: Math.random(),
          r: 1.2 + Math.random() * 1.6,
          c: PALETTE[(Math.random() * PALETTE.length) | 0],
          a: 0.08 + Math.random() * 0.2,
          ph: Math.random() * Math.PI * 2,
          sp: 0.3 + Math.random() * 0.6,
          amb: true,
        });
      }
    };

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      dpr = Math.min(2, window.devicePixelRatio || 1);
      w = rect.width; h = rect.height;
      canvas.width = Math.max(1, w * dpr);
      canvas.height = Math.max(1, h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const triangle = (x, y, r) => {
      ctx.beginPath();
      ctx.moveTo(x, y - r);
      ctx.lineTo(x + r * 0.87, y + r * 0.5);
      ctx.lineTo(x - r * 0.87, y + r * 0.5);
      ctx.closePath();
      ctx.stroke();
    };

    const frame = (t) => {
      ctx.clearRect(0, 0, w, h);
      ctx.lineWidth = 1;
      for (const d of dots) {
        // gentle breathing; static under reduced motion
        const puls = reduce.matches ? 0 : Math.sin(t / 1000 * d.sp + d.ph);
        const px = d.x * w + puls * (d.amb ? 5 : 2.5);
        const py = d.y * h + Math.cos(t / 1400 * d.sp + d.ph) * (d.amb ? 5 : 2.5);
        ctx.globalAlpha = d.a * (0.75 + 0.25 * (puls + 1) / 2);
        ctx.strokeStyle = d.c;
        triangle(px, py, d.r);
      }
      ctx.globalAlpha = 1;
      if (!reduce.matches) raf = requestAnimationFrame(frame);
    };

    const onResize = () => { resize(); };
    resize();
    build();
    raf = requestAnimationFrame(frame);
    window.addEventListener("resize", onResize);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", onResize);
    };
  }, [canvasRef]);
}

const NAV = ["Manifesto", "Team", "Blog"];

const SECTIONS = [
  {
    label: "How it works",
    title: "Every answer already exists inside the room.",
    body: "Nebula reads the documents, threads and decisions your team already made, then hands them back the moment somebody asks. Nothing new to write. Nothing new to maintain.",
  },
  {
    label: "Why it holds",
    title: "Distributed, not hierarchical.",
    body: "Knowledge is not a tree with a root. It is a field of points that light up together. Nebula is built on that shape, which is why it keeps working as a company grows past the point where a wiki stops.",
  },
];

const TEAM = [
  { role: "Co founder & CEO", name: "Ilya Novak" },
  { role: "Co founder & CTO", name: "Joel Kang" },
  { role: "Head of Research", name: "Marta Oyelaran" },
];

export default function NebulaSite() {
  useTemplateFont(
    "https://fonts.googleapis.com/css2?family=Inter:wght@200;400;600;700&display=swap"
  );
  const canvasRef = useRef(null);
  useConstellation(canvasRef);

  return (
    <div className="neb">
      <header className="neb-nav">
        <a className="neb-logo" href="#top">
          <svg viewBox="0 0 20 20" aria-hidden="true">
            <defs>
              <linearGradient id="nebGrad" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#8052ff" />
                <stop offset="100%" stopColor="#15846e" />
              </linearGradient>
            </defs>
            <path d="M10 1 L19 18 L1 18 Z" fill="url(#nebGrad)" />
          </svg>
          <span>Nebula</span>
        </a>
        <nav className="neb-links">
          {NAV.map((l, i) => (
            <a key={l} href="#top" className={i === 0 ? "is-on" : ""}>{l}</a>
          ))}
        </nav>
        <button className="neb-cta" type="button">Request Access</button>
      </header>

      <section className="neb-hero">
        <div className="neb-hero-copy">
          <span className="neb-label">Collective intelligence</span>
          <h1 className="neb-display">Your workplace has the answer.</h1>
          <p className="neb-body">
            Ask once. Nebula gathers what your people already know, from every thread and
            every document, and gives it back as a single clear reply.
          </p>
          <button className="neb-cta" type="button">Request Access</button>
        </div>
        <div className="neb-hero-art">
          <canvas ref={canvasRef} aria-hidden="true" />
        </div>
      </section>

      {SECTIONS.map((s, i) => (
        <section className={"neb-section" + (i % 2 ? " is-flipped" : "")} key={s.title}>
          <h2 className="neb-heading">{s.title}</h2>
          <div className="neb-section-copy">
            <span className="neb-label">{s.label}</span>
            <p className="neb-body">{s.body}</p>
          </div>
        </section>
      ))}

      <section className="neb-team">
        <h2 className="neb-heading">The people building it.</h2>
        <div className="neb-team-grid">
          {TEAM.map((m) => (
            <article className="neb-member" key={m.name}>
              <div className="neb-portrait" aria-hidden="true" />
              <span className="neb-role">{m.role}</span>
              <h3 className="neb-name">{m.name}</h3>
            </article>
          ))}
        </div>
        <div className="neb-dots" aria-hidden="true">
          <i className="is-on" /><i />
        </div>
      </section>

      <footer className="neb-foot">
        <h2 className="neb-heading">Just ask.</h2>
        <button className="neb-cta" type="button">Request Access</button>
        <p className="neb-fine">Nebula, 2026. Built for teams that already know the answer.</p>
      </footer>
    </div>
  );
}
