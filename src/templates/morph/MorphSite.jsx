import { useEffect, useRef, useState } from "react";
import useTemplateFont from "../useTemplateFont";
import "./morph.css";

/* ── Morph — Pixel Poster (Signature) ──────────────────────────
   A single-screen poster: black ground, a giant two-tone wordmark, and a
   pixel-art lily standing in front of it. No scroll, no sections, one image
   that is really two.

   THE MECHANIC — a morph-reveal trail, not a spotlight. Two copies of the
   lily are stacked: the front one visible, the second one fully masked out.
   Moving the pointer pushes samples into a decaying trail, and every frame the
   trail is drawn as 24-point noise-warped blobs into an offscreen canvas which
   becomes a CSS mask for BOTH layers — punched out of the front lily,
   punched in for the one underneath. So the pointer doesn't light the image
   up, it wipes one image into another along an organic path, and the wordmark
   shows through wherever the petals go transparent.

   Two liberties, both load-bearing:
     - the mask canvas is drawn at reduced resolution (MASK_MAX_H). Every frame
       ends in canvas.toDataURL(), and a PNG encode of the full flower box twice
       per frame costs more than the whole frame budget. The mask is soft blobs;
       nobody can see the difference.
     - encoding stops the moment the trail is empty, so an idle page runs no
       loop at all.

   The entrance runs once, in CSS, while the root carries .is-anim: frame, then
   the word rises out of its mask, then the lily rises in front of it, then both
   corner captions together. JS strips the class when the last animation ends
   and it never replays. */

const FRONT =
  "https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260808_192942_e1086505-d7da-433b-a59b-8220f4e6c808.png&w=1280&q=85";

const REVEAL =
  "https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260808_151324_bf318a5f-5525-4fc7-aab5-e9a341018828.png&w=1280&q=85";

const NAV = [
  { label: "Home", href: "#home" },
  { label: "Resources", href: "#resources" },
  { label: "Benefits", href: "#benefits" },
  { label: "Contact", href: "#contact" },
];

/* ── trail constants ──────────────────────────────────────────── */
const TRAIL_MAX_POINTS = 60;
const TRAIL_HEAD_R = 140;
const TRAIL_NOISE_AMP = 44;
const TRAIL_BLOB_PTS = 24;
const TRAIL_FADE_SPEED = 0.92;
const TRAIL_SAMPLE_DIST = 8;

/* Mask resolution ceiling — see the note above. */
const MASK_MAX_H = 520;

/* One blob: a circle whose radius is warped by three summed sine terms, then
   closed through midpoints with quadratic curves so the outline is organic
   rather than a polygon. */
function drawMorphBlob(ctx, cx, cy, r, t, seed) {
  if (r < 2) return;
  const pts = [];
  for (let i = 0; i < TRAIL_BLOB_PTS; i++) {
    const angle = (i / TRAIL_BLOB_PTS) * Math.PI * 2;
    const n1 = Math.sin(angle * 3 + t * 1.4 + seed) * 0.45;
    const n2 = Math.sin(angle * 5 - t * 0.9 + seed * 2.3) * 0.3;
    const n3 = Math.cos(angle * 2 + t * 1.8 + seed * 0.7) * 0.25;
    const noise = (n1 + n2 + n3) * TRAIL_NOISE_AMP * (r / TRAIL_HEAD_R);
    const rad = Math.max(1, r + noise);
    pts.push([cx + Math.cos(angle) * rad, cy + Math.sin(angle) * rad]);
  }

  ctx.beginPath();
  const mid = (a, b) => [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2];
  let start = mid(pts[pts.length - 1], pts[0]);
  ctx.moveTo(start[0], start[1]);
  for (let i = 0; i < pts.length; i++) {
    const cur = pts[i];
    const next = pts[(i + 1) % pts.length];
    const m = mid(cur, next);
    ctx.quadraticCurveTo(cur[0], cur[1], m[0], m[1]);
  }
  ctx.closePath();
  ctx.fill();
}

function useMorphTrail({ stageRef, flowerRef, bgRef, topRef }) {
  useEffect(() => {
    const stage = stageRef.current;
    const flower = flowerRef.current;
    const bg = bgRef.current;
    const top = topRef.current;
    if (!stage || !flower || !bg || !top) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");

    // one canvas per layer: white-filled minus blobs for the front lily,
    // blobs-only for the one underneath
    const cut = document.createElement("canvas");
    const paint = document.createElement("canvas");
    const cutCtx = cut.getContext("2d");
    const paintCtx = paint.getContext("2d");

    let scale = 1;
    let w = 0;
    let h = 0;
    let raf = 0;
    let running = false;
    let hovering = false;
    let headRadius = 0;
    let time = 0;
    let last = null;
    const trail = [];

    const HIDDEN = "linear-gradient(#0000, #0000)";

    const setMask = (el, value) => {
      el.style.maskImage = value;
      el.style.webkitMaskImage = value;
      el.style.maskSize = "100% 100%";
      el.style.webkitMaskSize = "100% 100%";
      el.style.maskRepeat = "no-repeat";
      el.style.webkitMaskRepeat = "no-repeat";
    };

    const rest = () => {
      setMask(bg, "none");
      setMask(top, HIDDEN);
    };

    const measure = () => {
      const rect = flower.getBoundingClientRect();
      if (!rect.width || !rect.height) return false;
      scale = Math.min(1, MASK_MAX_H / rect.height);
      w = Math.max(1, Math.round(rect.width * scale));
      h = Math.max(1, Math.round(rect.height * scale));
      if (cut.width !== w || cut.height !== h) {
        cut.width = paint.width = w;
        cut.height = paint.height = h;
      }
      return true;
    };

    const toFlower = (e) => {
      const rect = flower.getBoundingClientRect();
      if (!rect.width || !rect.height) return null;
      return { x: (e.clientX - rect.left) * scale, y: (e.clientY - rect.top) * scale };
    };

    const frame = () => {
      const target = hovering ? TRAIL_HEAD_R * scale : 0;
      headRadius += (target - headRadius) * (hovering ? 0.14 : 0.04);

      // decay
      for (let i = trail.length - 1; i >= 0; i--) {
        trail[i].alpha *= TRAIL_FADE_SPEED;
        trail[i].r *= 0.995;
        if (trail[i].alpha < 0.01) trail.splice(i, 1);
      }
      time += 0.016;

      cutCtx.globalCompositeOperation = "source-over";
      cutCtx.fillStyle = "#fff";
      cutCtx.fillRect(0, 0, w, h);
      paintCtx.clearRect(0, 0, w, h);

      cutCtx.globalCompositeOperation = "destination-out";
      paintCtx.globalCompositeOperation = "source-over";
      for (const p of trail) {
        cutCtx.fillStyle = `rgba(0,0,0,${p.alpha})`;
        paintCtx.fillStyle = `rgba(255,255,255,${p.alpha})`;
        drawMorphBlob(cutCtx, p.x, p.y, p.r, time, p.seed);
        drawMorphBlob(paintCtx, p.x, p.y, p.r, time, p.seed);
      }

      setMask(bg, `url(${cut.toDataURL()})`);
      setMask(top, `url(${paint.toDataURL()})`);

      if (trail.length || headRadius > 0.5) {
        raf = requestAnimationFrame(frame);
      } else {
        running = false;
        rest();
      }
    };

    const start = () => {
      if (running || reduce.matches) return;
      running = true;
      raf = requestAnimationFrame(frame);
    };

    const onMove = (e) => {
      if (reduce.matches) return;
      if (!measure()) return;
      hovering = true;
      const p = toFlower(e);
      if (!p) return;
      if (headRadius > 5 * scale) {
        const far =
          !last || Math.hypot(p.x - last.x, p.y - last.y) > TRAIL_SAMPLE_DIST * scale;
        if (far) {
          trail.push({ x: p.x, y: p.y, r: headRadius, alpha: 1, seed: Math.random() * 100 });
          if (trail.length > TRAIL_MAX_POINTS) trail.shift();
          last = p;
        }
      } else {
        last = p;
      }
      start();
    };

    const onEnter = (e) => {
      hovering = true;
      onMove(e);
    };
    const onLeave = () => {
      hovering = false;
      last = null;
      start();
    };

    rest();
    measure();
    stage.addEventListener("mousemove", onMove);
    stage.addEventListener("mouseenter", onEnter);
    stage.addEventListener("mouseleave", onLeave);
    window.addEventListener("resize", measure);

    return () => {
      cancelAnimationFrame(raf);
      stage.removeEventListener("mousemove", onMove);
      stage.removeEventListener("mouseenter", onEnter);
      stage.removeEventListener("mouseleave", onLeave);
      window.removeEventListener("resize", measure);
    };
  }, [stageRef, flowerRef, bgRef, topRef]);
}

/* The entrance is CSS; this only decides when it is over. */
function useOneShotEntrance(rootRef) {
  const [anim, setAnim] = useState(true);
  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    let done = false;
    const finish = () => {
      if (done) return;
      done = true;
      setAnim(false);
    };
    // the last orb-* animation to end releases it; the timeout is the backstop
    const onEnd = (e) => {
      if (e.animationName === "orb-corner") finish();
    };
    root.addEventListener("animationend", onEnd);
    const t = setTimeout(finish, 6000);
    return () => {
      root.removeEventListener("animationend", onEnd);
      clearTimeout(t);
    };
  }, [rootRef]);
  return anim;
}

function BrandMark() {
  return (
    <svg className="orb-mark" viewBox="0 0 66 62" aria-hidden="true">
      <g stroke="#fff" strokeWidth="5" strokeLinecap="square">
        <line x1="33" y1="1" x2="33" y2="61" />
        <line x1="3" y1="31" x2="63" y2="31" />
        <line x1="11.8" y1="9.8" x2="54.2" y2="52.2" />
        <line x1="54.2" y1="9.8" x2="11.8" y2="52.2" />
      </g>
    </svg>
  );
}

export default function MorphSite() {
  useTemplateFont(
    "https://fonts.googleapis.com/css2?family=Archivo:wght@400;500&family=Instrument+Serif&display=swap"
  );

  const rootRef = useRef(null);
  const stageRef = useRef(null);
  const flowerRef = useRef(null);
  const bgRef = useRef(null);
  const topRef = useRef(null);
  const [menu, setMenu] = useState(false);

  const anim = useOneShotEntrance(rootRef);
  useMorphTrail({ stageRef, flowerRef, bgRef, topRef });

  useEffect(() => {
    if (!menu) return;
    const onKey = (e) => {
      if (e.key === "Escape") setMenu(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [menu]);

  return (
    <main
      className={`orb${anim ? " is-anim" : ""}${menu ? " is-open" : ""}`}
      ref={rootRef}
    >
      <section className="orb-stage" ref={stageRef}>
        <a className="orb-brand" href="#home" aria-label="Home">
          <BrandMark />
        </a>

        <nav className="orb-nav" aria-label="Primary">
          <ul>
            {NAV.map((n) => (
              <li key={n.label}>
                <a href={n.href}>{n.label}</a>
              </li>
            ))}
          </ul>
        </nav>

        <span className="orb-pill">Secure system</span>

        <button
          type="button"
          className="orb-burger"
          aria-expanded={menu}
          aria-label={menu ? "Close menu" : "Open menu"}
          onClick={() => setMenu((v) => !v)}
        >
          <i />
          <i />
        </button>

        <h1 className="orb-word" aria-label="Orbit">
          <span className="orb-word__mask">
            <span className="orb-word__inner">
              <span className="orb-word__white">
                <span className="orb-word__o">O</span>R
              </span>
              <span className="orb-word__pink">BIT</span>
            </span>
          </span>
        </h1>

        <div className="orb-flower" ref={flowerRef}>
          <img className="orb-flower__sizer" src={FRONT} alt="" aria-hidden="true" />
          <div className="orb-flower__layer orb-flower__layer--bg" ref={bgRef}>
            <img src={FRONT} alt="Pixel-art pink and violet lily" />
          </div>
          <div className="orb-flower__layer orb-flower__layer--top" ref={topRef} aria-hidden="true">
            <img src={REVEAL} alt="" />
          </div>
        </div>

        <p className="orb-copy orb-copy--left">
          <span className="orb-copy__inner">
            Every workflow,
            <br />
            intelligently connected.
          </span>
        </p>
        <p className="orb-copy orb-copy--right">
          <span className="orb-copy__inner">
            Less manual work.
            <br />
            More meaningful output.
          </span>
        </p>

        <button
          type="button"
          className="orb-scrim"
          aria-label="Close menu"
          tabIndex={menu ? 0 : -1}
          onClick={() => setMenu(false)}
        />

        <div className="orb-sheet" aria-hidden={!menu}>
          <nav aria-label="Menu">
            {NAV.map((n) => (
              <a key={n.label} href={n.href} tabIndex={menu ? 0 : -1} onClick={() => setMenu(false)}>
                {n.label}
              </a>
            ))}
          </nav>
          <span className="orb-sheet__pill">Secure system</span>
        </div>
      </section>
    </main>
  );
}
