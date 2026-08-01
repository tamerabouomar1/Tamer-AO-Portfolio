import { useEffect, useRef, useState } from "react";
import useTemplateFont from "../useTemplateFont";
import "./cinema.css";

/* ── Cinema — AI Landing (Signature) ───────────────────────────
   A dark editorial page whose background film is scrubbed by the page scroll
   rather than played. Scrolling IS the timeline.

   Naively that means setting `video.currentTime` on every scroll event, and it
   judders badly: each assignment is a seek, the browser must find a keyframe
   and decode forward, and requests get dropped. So the clip is decoded ONCE
   into a cache of bitmaps and the canvas draws the frame nearest the scroll
   position. That is the smooth path.

   Three layers crossfade as each becomes ready: poster (instant), video (has a
   decoded frame), canvas (frame cache built). Until the cache exists the video
   is seeked directly, which is rough but correct, so the page is never blank
   and never wrong.

   MEMORY: frames are ImageBitmaps at 960px wide, capped at 90. Uncapped, a
   long clip would decode hundreds of full-size frames and take the tab down. */

const VIDEO =
  "https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260729_102822_0e6c87e8-c141-4744-bf32-ad30db296371.mp4";
const PORTRAIT =
  "https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260728_050334_5b076e26-0ce7-4898-b432-d764190e448f.png&w=1280&q=85";

const MAX_FRAMES = 90;
const FRAME_WIDTH = 960;
const LERP = 0.12;

const SERVICES = ["/ AI AUTOMATION", "/ AI INTEGRATION", "/ AI AGENT DEVELOPMENT"];
const NAV = ["Projects", "About", "Blog", "Contact"];

const CAPABILITIES = [
  { n: "01", title: "Real-time vision", body: "Reads context as it happens and surfaces what matters before you ask." },
  { n: "02", title: "Layered insight", body: "Moves from rough outline to sharp output without losing the thread." },
  { n: "03", title: "Adaptive speed", body: "Learns your cadence and tightens every pass as you work." },
];

function Hexagon({ size = 24 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M21 16.05v-8.1a2 2 0 0 0-1-1.73l-7-4.05a2 2 0 0 0-2 0l-7 4.05a2 2 0 0 0-1 1.73v8.1a2 2 0 0 0 1 1.73l7 4.05a2 2 0 0 0 2 0l7-4.05a2 2 0 0 0 1-1.73z" />
    </svg>
  );
}
function ChevronRight({ size = 14 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="m9 18 6-6-6-6" />
    </svg>
  );
}

/** Fade up on entry. One observer per node, disconnected once seen. */
function Reveal({ delay = 0, className = "", children, as: Tag = "div" }) {
  const ref = useRef(null);
  const [seen, setSeen] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) { setSeen(true); io.disconnect(); }
      },
      { threshold: 0.15 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return (
    <Tag
      ref={ref}
      className={`cin-reveal${seen ? " is-in" : ""} ${className}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </Tag>
  );
}

function ScrollVideo() {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [hasFrame, setHasFrame] = useState(false);
  const [cached, setCached] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    const video = videoRef.current;
    if (!canvas || !video) return;

    const ctx = canvas.getContext("2d");
    let frames = [];
    let raf = 0;
    let smoothed = 0;
    let disposed = false;

    const sizeCanvas = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.max(1, window.innerWidth * dpr);
      canvas.height = Math.max(1, window.innerHeight * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    /* object-cover: scale to the larger ratio, centre the overflow. */
    const drawCover = (src, sw, sh) => {
      const vw = window.innerWidth;
      const vh = window.innerHeight;
      const scale = Math.max(vw / sw, vh / sh);
      const w = sw * scale;
      const h = sh * scale;
      ctx.clearRect(0, 0, vw, vh);
      ctx.drawImage(src, (vw - w) / 2, (vh - h) / 2, w, h);
    };

    const progress = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      if (max <= 0) return 0;
      return Math.min(1, Math.max(0, window.scrollY / max));
    };

    const tick = () => {
      if (disposed) return;
      smoothed += (progress() - smoothed) * LERP;

      if (frames.length) {
        const i = Math.min(frames.length - 1, Math.round(smoothed * (frames.length - 1)));
        const f = frames[i];
        if (f) drawCover(f, f.width, f.height);
      } else if (video.duration) {
        // Fallback while the cache builds. Only seek on a real move, or the
        // browser queues requests it will never finish.
        const t = smoothed * (video.duration - 0.05);
        if (Math.abs(video.currentTime - t) > 0.04) video.currentTime = t;
      }
      raf = requestAnimationFrame(tick);
    };

    /* Decode the clip once into bitmaps, off an offscreen element so the
       visible video keeps showing its frame while this runs. */
    const buildCache = async () => {
      const off = document.createElement("video");
      off.src = VIDEO;
      off.muted = true;
      off.playsInline = true;
      off.preload = "auto";
      off.crossOrigin = "anonymous";

      await new Promise((res) => {
        if (off.readyState >= 2) return res();
        off.addEventListener("loadeddata", res, { once: true });
        off.addEventListener("error", res, { once: true });
      });
      if (disposed || !off.videoWidth) return;

      const count = Math.min(MAX_FRAMES, Math.max(24, Math.round((off.duration || 4) * 12)));
      const w = Math.min(FRAME_WIDTH, off.videoWidth);
      const h = Math.round((off.videoHeight / off.videoWidth) * w);
      const scratch = document.createElement("canvas");
      scratch.width = w;
      scratch.height = h;
      const sctx = scratch.getContext("2d");
      const out = [];

      for (let i = 0; i < count; i++) {
        if (disposed) return;
        const t = (i / (count - 1)) * (off.duration - 0.05);
        // eslint-disable-next-line no-await-in-loop
        const ok = await new Promise((res) => {
          const done = () => res(true);
          off.addEventListener("seeked", done, { once: true });
          off.addEventListener("error", () => res(false), { once: true });
          off.currentTime = t;
          setTimeout(() => res(false), 2000); // never hang on a stalled seek
        });
        if (!ok) continue;
        sctx.drawImage(off, 0, 0, w, h);
        // eslint-disable-next-line no-await-in-loop
        out.push(await createImageBitmap(scratch));
      }
      if (disposed || out.length < 2) return;
      frames = out;
      setCached(true);
    };

    const onLoaded = () => {
      setHasFrame(true);
      // Let the visible video paint before hammering the decoder.
      setTimeout(() => { if (!disposed) buildCache(); }, 300);
    };

    sizeCanvas();
    window.addEventListener("resize", sizeCanvas);
    video.addEventListener("loadeddata", onLoaded);
    if (video.readyState >= 2) onLoaded();
    raf = requestAnimationFrame(tick);

    return () => {
      disposed = true;
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", sizeCanvas);
      video.removeEventListener("loadeddata", onLoaded);
      frames.forEach((f) => f.close && f.close());
    };
  }, []);

  return (
    <div className="cin-bg" aria-hidden="true">
      <div className={"cin-poster" + (hasFrame || cached ? " is-out" : "")} />
      <video
        ref={videoRef}
        className={"cin-video" + (!hasFrame || cached ? " is-out" : "")}
        src={VIDEO}
        muted
        playsInline
        preload="auto"
      />
      <canvas ref={canvasRef} className={"cin-canvas" + (cached ? " is-in" : "")} />
    </div>
  );
}

export default function CinemaSite() {
  useTemplateFont(
    "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap"
  );

  return (
    <div className="cin">
      <ScrollVideo />

      <div className="cin-layer">
        <header className="cin-nav">
          <Reveal delay={0} className="cin-logo">
            <Hexagon size={24} />
            <span>novaai</span>
          </Reveal>

          <nav className="cin-links">
            {NAV.map((l, i) => (
              <Reveal key={l} delay={100 + i * 100} as="span">
                <a href="#top">
                  {l}
                  {l === "Projects" && <sup>6</sup>}
                </a>
              </Reveal>
            ))}
          </nav>

          <Reveal delay={500} className="cin-navcta">
            <button type="button">Get Free Consultation</button>
          </Reveal>
        </header>

        <main>
          <section className="cin-section">
            <div className="cin-row cin-row--top">
              <ul className="cin-services">
                {SERVICES.map((s, i) => (
                  <Reveal key={s} delay={150 + i * 120} as="li">{s}</Reveal>
                ))}
              </ul>
              <Reveal delay={300} className="cin-intro">
                <p>
                  We design automation that brings clarity, precision, and efficiency to
                  the way your company operates.
                </p>
              </Reveal>
            </div>

            <div className="cin-row cin-row--bottom">
              <div>
                <Reveal delay={150} className="cin-badge">
                  <span>We Automate 100+ Businesses</span>
                </Reveal>
                <Reveal delay={280} as="h1" className="cin-display">
                  Clear. Precise.
                  <br />
                  Automated.
                </Reveal>
              </div>

              <Reveal delay={420} className="cin-card">
                <img src={PORTRAIT} alt="Mitha, co-founder of NovaAI" />
                <div className="cin-card-text">
                  <span className="cin-card-name">Talk with Mitha</span>
                  <span className="cin-card-role">Co-founder of NovaAI</span>
                  <button className="cin-pill" type="button">
                    Book 15-mins call <ChevronRight size={14} />
                  </button>
                </div>
              </Reveal>
            </div>
          </section>

          {/* The film needs runway between the two screens or the scrub has
              nowhere to happen. Do not delete this. */}
          <div className="cin-spacer" aria-hidden="true" />

          <section className="cin-section">
            <div className="cin-row cin-row--top">
              <Reveal delay={120} className="cin-badge">
                <span>Insight On Demand</span>
              </Reveal>
              <Reveal delay={220} className="cin-intro cin-intro--narrow">
                <p>
                  Our AI doesn't just respond — it interprets, sharpens, and delivers the
                  signal you need.
                </p>
              </Reveal>
            </div>

            <div className="cin-row cin-row--cap">
              <div className="cin-capcopy">
                <Reveal delay={180} as="h2" className="cin-display">
                  Learn to see
                  <br />
                  brilliantly.
                </Reveal>
                <Reveal delay={320} as="p" className="cin-body">
                  From the first sketch to the final render, Nova turns raw intent into
                  decisions your team can act on — quietly, precisely, at speed.
                </Reveal>
                <Reveal delay={420} className="cin-ctas">
                  <button className="cin-pill" type="button">
                    Run the demo <ChevronRight size={14} />
                  </button>
                  <button className="cin-ghost" type="button">Free consultation</button>
                </Reveal>
              </div>

              <div className="cin-panel">
                {CAPABILITIES.map((c, i) => (
                  <Reveal key={c.n} delay={300 + i * 110} className="cin-caprow">
                    <span className="cin-capindex">{c.n}</span>
                    <div>
                      <h3>
                        {c.title} <ChevronRight size={16} />
                      </h3>
                      <p>{c.body}</p>
                    </div>
                  </Reveal>
                ))}
              </div>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}
