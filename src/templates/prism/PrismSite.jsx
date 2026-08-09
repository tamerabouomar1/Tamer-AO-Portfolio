import { useEffect, useRef, useState } from "react";
import useTemplateFont from "../useTemplateFont";
import "./tokens.css";
import "./prism.css";

/* ── Prism — Studio Editorial (Signature) ──────────────────────
   Radical monochrome discipline. Black, white, and thin greys carry the whole
   interface; the only colour in the system is one iridescent field behind the
   hero headline, and it is media, never UI. If you find yourself tinting a
   button, you have left the system.

   Two rules do most of the visual work:
     - radius jumps from 0px straight to 75px. Nothing in between. Cards,
       images and inputs are sharp; buttons and tags are full pills.
     - large type whispers. 78px sits at weight 300, 94px at 400 with a 0.76
       line-height so the lines lock into a solid block. Never above 400.

   The iridescent field is drawn on a canvas as slow-moving radial blobs, so
   it behaves like oil on water rather than a flat CSS gradient, and it costs
   no image download. */

const NAV = ["Work", "Manifesto", "Souls", "Team", "Contact"];
const LOCALES = ["EN", "VN", "中文"];

const PROJECTS = [
  { n: "01", title: "Salt & Static", meta: "Brand identity, 2026" },
  { n: "02", title: "Hanoi Sound Archive", meta: "Digital platform, 2025" },
  { n: "03", title: "Mekong Editions", meta: "Art direction, 2025" },
];

const OFFICES = [
  { city: "Saigon", lines: ["12 Nguyen Hue", "District 1, Ho Chi Minh City"] },
  { city: "Tokyo", lines: ["2-11-3 Meguro", "Shibuya, Tokyo 153-0063"] },
  { city: "London", lines: ["48 Charlotte Road", "Shoreditch, EC2A 3PD"] },
];

/* Slow iridescent field: sage green through molten amber into oxblood. */
const BLOBS = [
  { c: [160, 224, 171], r: 0.62, sx: 0.00019, sy: 0.00013, px: 0.28, py: 0.42 },
  { c: [255, 172, 46], r: 0.58, sx: 0.00014, sy: 0.00021, px: 0.55, py: 0.55 },
  { c: [165, 45, 37], r: 0.66, sx: 0.00011, sy: 0.00017, px: 0.76, py: 0.48 },
  { c: [255, 214, 140], r: 0.40, sx: 0.00023, sy: 0.00009, px: 0.42, py: 0.72 },
];

function useIridescence(canvasRef) {
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
    let raf = 0, w = 0, h = 0;

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      // Half-resolution: the field is all soft gradient, so nobody can see the
      // difference and it costs a quarter of the fill.
      const dpr = Math.min(1, window.devicePixelRatio || 1);
      w = Math.max(1, Math.round(rect.width * dpr * 0.5));
      h = Math.max(1, Math.round(rect.height * dpr * 0.5));
      canvas.width = w;
      canvas.height = h;
    };

    const frame = (t) => {
      ctx.globalCompositeOperation = "source-over";
      ctx.fillStyle = "#0b0b0b";
      ctx.fillRect(0, 0, w, h);
      ctx.globalCompositeOperation = "lighter";
      for (const b of BLOBS) {
        const x = (b.px + Math.sin(t * b.sx) * 0.16) * w;
        const y = (b.py + Math.cos(t * b.sy) * 0.14) * h;
        const rad = b.r * Math.max(w, h);
        const g = ctx.createRadialGradient(x, y, 0, x, y, rad);
        g.addColorStop(0, `rgba(${b.c[0]},${b.c[1]},${b.c[2]},0.85)`);
        g.addColorStop(0.5, `rgba(${b.c[0]},${b.c[1]},${b.c[2]},0.28)`);
        g.addColorStop(1, `rgba(${b.c[0]},${b.c[1]},${b.c[2]},0)`);
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.arc(x, y, rad, 0, Math.PI * 2);
        ctx.fill();
      }
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

function ScrollBadge() {
  return (
    <div className="prs-badge" aria-hidden="true">
      <svg viewBox="0 0 100 100">
        <defs>
          <path id="prsCircle" d="M50,50 m-36,0 a36,36 0 1,1 72,0 a36,36 0 1,1 -72,0" />
        </defs>
        <text>
          <textPath href="#prsCircle">
            SCROLL DOWN · SCROLL DOWN ·
          </textPath>
        </text>
      </svg>
    </div>
  );
}

export default function PrismSite() {
  useTemplateFont(
    "https://fonts.googleapis.com/css2?family=Inter:wght@300;400;600&family=Raleway:wght@400&display=swap"
  );
  const canvasRef = useRef(null);
  useIridescence(canvasRef);
  const [cookie, setCookie] = useState(true);
  const [locale, setLocale] = useState(0);

  return (
    <div className="prs">
      <header className="prs-nav">
        <span className="prs-word">prism studio</span>
        <div className="prs-locale">
          {LOCALES.map((l, i) => (
            <button key={l} type="button" className={i === locale ? "is-on" : ""}
              onClick={() => setLocale(i)}>{l}</button>
          ))}
        </div>
        <nav className="prs-menu">
          {NAV.map((l) => (
            <a key={l} href="#top">{l}</a>
          ))}
        </nav>
      </header>

      <section className="prs-hero">
        <canvas ref={canvasRef} className="prs-field" aria-hidden="true" />
        <h1 className="prs-display">United, Unbound</h1>
        <ScrollBadge />
      </section>

      <section className="prs-manifesto">
        <h2 className="prs-whisper">
          We make quiet things that refuse to be ignored.
        </h2>
        <div className="prs-manifesto-copy">
          <p>
            Prism is an independent studio working across identity, digital and film.
            We take a small number of projects each year and give each one the whole
            room.
          </p>
          <button className="prs-pill prs-pill--light" type="button">Read the manifesto</button>
        </div>
      </section>

      <section className="prs-work">
        <span className="prs-kicker">Selected work</span>
        {PROJECTS.map((p) => (
          <article className="prs-row" key={p.n}>
            <div className="prs-shot" aria-hidden="true" />
            <div className="prs-row-meta">
              <span>{p.n}</span>
              <h3>{p.title}</h3>
              <span>{p.meta}</span>
            </div>
          </article>
        ))}
      </section>

      <section className="prs-anchor">
        <h2 className="prs-anchor-type">
          Let us
          <br />
          make
          <br />
          something.
        </h2>
        <button className="prs-pill prs-pill--dark" type="button">Start a project</button>
      </section>

      <footer className="prs-foot">
        {OFFICES.map((o) => (
          <div className="prs-office" key={o.city}>
            <span className="prs-office-city">{o.city}</span>
            {o.lines.map((l) => (
              <span key={l}>{l}</span>
            ))}
          </div>
        ))}
      </footer>

      {cookie && (
        <div className="prs-cookie" role="dialog" aria-label="Cookie notice">
          <p>We use a small number of cookies to understand how this site is used.</p>
          <button className="prs-pill prs-pill--filled" type="button" onClick={() => setCookie(false)}>
            Accept
          </button>
        </div>
      )}
    </div>
  );
}
