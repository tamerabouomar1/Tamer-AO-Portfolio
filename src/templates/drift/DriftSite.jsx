import { useEffect, useRef } from "react";
import useTemplateFont from "../useTemplateFont";
import "./drift.css";

/* ── Drift — Scroll-Linked Depth ───────────────────────────────
   Every layer on this page moves at its own rate, so the screen reads as a
   space with distance in it rather than a flat sheet sliding past. The dusk
   scene in the hero is five separate planes: stars, sun, three ridges. The
   ridge nearest the camera travels almost with the scroll; the stars barely
   move at all, and the headline sinks behind the front ridge as you go.

   Two decisions worth knowing about:

   1. The scene is drawn, not photographed. Inline SVG paths and gradients
      mean the depth effect works with zero image requests, never waits on a
      CDN, and re-colours from four CSS variables. Swap in <img> tags with the
      same data-depth attributes and the mechanic is unchanged.

   2. Offsets are measured ONCE per layout, not read back from the DOM each
      frame. getBoundingClientRect() on a transformed element returns the
      transformed box, so driving a transform from it feeds the output back
      into the input and the layer creeps. Each element's resting position in
      the document is cached on mount (and on resize), and every frame is a
      pure function of scrollY — no read, no drift, no layout thrash.

   The loop is one rAF-throttled scroll listener writing translate3d on
   composited layers. prefers-reduced-motion skips the listener entirely and
   the page stands still, which is a complete and correct version of it. */

const NAV = [
  ["Journeys", "#journeys"],
  ["Field notes", "#notes"],
  ["About", "#about"],
];

/* depth > 0  → lags behind the scroll (reads as far away)
   depth = 0  → moves with the page
   depth < 0  → outruns the scroll (reads as close to the camera) */

/* Fixed, not random: a re-render must not reshuffle the sky. */
const STARS = [
  [80, 46, 1.4], [190, 92, 1], [305, 38, 1.7], [418, 120, 1.1], [530, 62, 1.3],
  [648, 30, 1], [742, 104, 1.6], [860, 54, 1.2], [975, 88, 1], [1090, 42, 1.5],
  [1204, 110, 1.1], [1318, 66, 1.3], [1402, 26, 1], [252, 152, 1], [1150, 150, 1.2],
];

const JOURNEYS = [
  { n: "01", place: "Kaçkar Range", meta: "Türkiye · 6 days", hue: "150" },
  { n: "02", place: "Lofoten Wall", meta: "Norway · 9 days", hue: "205" },
  { n: "03", place: "Wadi Rum", meta: "Jordan · 4 days", hue: "14" },
  { n: "04", place: "Torres Basin", meta: "Chile · 11 days", hue: "272" },
];

const STATS = [
  ["38", "Routes mapped"],
  ["6.2k", "Vertical metres"],
  ["19", "Countries"],
  ["100%", "Small groups"],
];

function ArrowRight({ size = 18 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M5 12h14" /><path d="m12 5 7 7-7 7" />
    </svg>
  );
}

function ScrollCue() {
  return (
    <svg width="16" height="26" viewBox="0 0 16 26" fill="none" stroke="currentColor"
      strokeWidth="1.4" aria-hidden="true">
      <rect x="0.7" y="0.7" width="14.6" height="24.6" rx="7.3" />
      <line className="drf-cue-dot" x1="8" y1="7" x2="8" y2="11" strokeLinecap="round" />
    </svg>
  );
}

/* A ridge line. `d` is authored against a 1440×320 box and stretched to
   whatever the viewport is — the silhouette is allowed to distort, that is
   what keeps it edge-to-edge without a media query per breakpoint. */
function Ridge({ className, d, fill, depth }) {
  return (
    /* The wrapper is deliberately the full size of its section, not the size
       of the crest. It is the wrapper that carries data-depth, and a layer's
       resting point is its own centre — so a hero-sized wrapper rests exactly
       where a hero-sized viewport is, and the scene starts undisturbed at
       scroll 0. A crest-sized layer would start life shoved off the horizon.

       ::after (see the stylesheet) continues the fill below the crest, so a
       ridge that drifts upward still has no daylight under it. */
    <div className={className} data-depth={depth} style={{ "--drf-fill": fill }} aria-hidden="true">
      <svg viewBox="0 0 1440 320" preserveAspectRatio="none">
        <path d={d} style={{ fill: "var(--drf-fill)" }} />
      </svg>
    </div>
  );
}

export default function DriftSite() {
  useTemplateFont(
    "https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,300;9..144,500&family=Inter:wght@400;500&display=swap"
  );

  const rootRef = useRef(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const layers = Array.from(root.querySelectorAll("[data-depth]"));
    if (!layers.length) return;

    /* offsetTop is immune to transforms; walking the offsetParent chain turns
       it into a document-absolute coordinate we can cache. */
    const docTop = (el) => {
      let y = 0;
      for (let n = el; n; n = n.offsetParent) y += n.offsetTop;
      return y;
    };

    /* Everything is measured against the middle of the viewport, so a zero
       reading — which some embedded and offscreen contexts do return — would
       put every layer at one extreme of its travel and hold it there. */
    const viewport = () =>
      window.innerHeight || document.documentElement.clientHeight || 800;

    let items = [];
    let vh = viewport();

    const measure = () => {
      vh = viewport();
      items = layers.map((el) => ({
        el,
        depth: parseFloat(el.dataset.depth) || 0,
        // Where this layer sits, centre-to-centre, in the document.
        centre: docTop(el) + el.offsetHeight / 2,
      }));
    };

    let raf = 0;
    const render = () => {
      raf = 0;
      const y = window.scrollY;
      for (const { el, depth, centre } of items) {
        /* `travelled` is 0 the moment the layer is centred in the viewport, so
           a layer is never pushed away from where the layout put it — it only
           ever leans out of position on the way in and on the way out.
           Pushing it back DOWN as the page scrolls up is what makes it lag. */
        const travelled = y + vh / 2 - centre;
        /* Clamped to one viewport in each direction. Offsets only matter while
           a layer is anywhere near the screen, and without this a tall section
           accumulates thousands of pixels of lean before it ever arrives. It
           also fixes each layer's maximum travel at depth × viewport height,
           which is the number the layout has to leave room for. */
        const lean = Math.max(-vh, Math.min(vh, travelled)) * depth;
        el.style.transform = `translate3d(0, ${lean.toFixed(2)}px, 0)`;
      }
    };

    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(render);
    };
    const onResize = () => {
      measure();
      onScroll();
    };

    measure();
    render();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onResize);

    /* Webfonts land after first paint and reflow the long headings, which
       moves every cached centre. Re-measure once they do. */
    if (document.fonts?.ready) document.fonts.ready.then(onResize).catch(() => {});

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
      for (const { el } of items) el.style.transform = "";
    };
  }, []);

  return (
    <div className="drf" ref={rootRef}>
      <nav className="drf-nav">
        <a className="drf-logo" href="#top">Drift<span>°</span></a>
        <div className="drf-links">
          {NAV.map(([label, href]) => <a key={href} href={href}>{label}</a>)}
        </div>
        <button className="drf-cta" type="button">
          Plan a trip <ArrowRight />
        </button>
      </nav>

      {/* ── Hero ─────────────────────────────────────────────── */}
      <header className="drf-hero" id="top">
        <div className="drf-sky" />

        <div className="drf-stars" data-depth="0.85">
          <svg viewBox="0 0 1440 200" preserveAspectRatio="none" aria-hidden="true">
            {STARS.map(([cx, cy, r], i) => (
              <circle key={i} cx={cx} cy={cy} r={r} fill="#fff" opacity={0.25 + (i % 4) * 0.18} />
            ))}
          </svg>
        </div>

        <div className="drf-sun" data-depth="0.7" />

        <Ridge className="drf-ridge drf-ridge--far" depth={0.5}
          d="M0,320 L0,148 L118,88 L242,142 L376,58 L518,132 L662,70 L804,150 L946,78 L1088,140 L1224,94 L1342,152 L1440,108 L1440,320 Z"
          fill="var(--drf-far)" />

        <div className="drf-copy" data-depth="-0.12">
          <p className="drf-eyebrow">Guided expeditions since 2011</p>
          <h1 className="drf-title">
            <span>Distance</span>
            <span><em>you can feel</em></span>
          </h1>
          <p className="drf-lede">
            Small groups, long horizons and routes we walk ourselves before
            anyone else is invited on them.
          </p>
          <div className="drf-actions">
            <button className="drf-btn" type="button">See this season <ArrowRight /></button>
            <button className="drf-btn drf-btn--ghost" type="button">Watch the film</button>
          </div>
        </div>

        <Ridge className="drf-ridge drf-ridge--mid" depth={0.26}
          d="M0,320 L0,186 L162,138 L318,198 L472,146 L638,208 L796,158 L958,214 L1122,162 L1288,218 L1440,172 L1440,320 Z"
          fill="var(--drf-mid)" />

        <Ridge className="drf-ridge drf-ridge--near" depth={0.06}
          d="M0,320 L0,242 L178,262 L360,228 L544,264 L722,232 L902,266 L1082,234 L1262,260 L1440,238 L1440,320 Z"
          fill="var(--drf-near)" />

        <div className="drf-scroll">
          <ScrollCue />
          <span>Scroll</span>
        </div>
      </header>

      {/* ── Statement ────────────────────────────────────────── */}
      <section className="drf-statement" id="notes">
        <span className="drf-ghost" data-depth="0.3" aria-hidden="true">Elevation</span>
        <p className="drf-said" data-depth="-0.06">
          A view is not a photograph. It is the four hours of ridge you walked
          to stand in front of it, and the quiet on the way back down.
        </p>
      </section>

      {/* ── Journeys ─────────────────────────────────────────── */}
      <section className="drf-journeys" id="journeys">
        <div className="drf-head">
          <h2>This season</h2>
          <span>Four routes · Sixteen departures</span>
        </div>

        <div className="drf-grid">
          {JOURNEYS.map((j, i) => (
            /* Every card gets its own depth, and the art INSIDE the card gets
               a second one. Nested transforms compose, so the art's -0.07 is
               measured against its own frame no matter what the card is doing
               — the frame and its contents separate as the card crosses the
               screen. That inner slide is the whole reason each figure is
               over-tall and clipped: the overflow IS the travel budget. */
            <article className="drf-card" key={j.n} data-depth={i % 2 ? 0.05 : 0.12}>
              <figure className="drf-frame">
                <div
                  className="drf-art"
                  data-depth="-0.07"
                  style={{ "--h": j.hue }}
                />
                <figcaption>{j.n}</figcaption>
              </figure>
              <h3>{j.place}</h3>
              <p>{j.meta}</p>
            </article>
          ))}
        </div>
      </section>

      {/* ── Stats ────────────────────────────────────────────── */}
      <section className="drf-stats">
        <div className="drf-stats-wash" data-depth="0.35" aria-hidden="true" />
        <div className="drf-stats-row">
          {STATS.map(([n, label], i) => (
            <div className="drf-stat" key={label} data-depth={-0.03 - i * 0.02}>
              <strong>{n}</strong>
              <span>{label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ── Close ────────────────────────────────────────────── */}
      <footer className="drf-foot" id="about">
        <Ridge className="drf-foot-ridge" depth={0.22}
          d="M0,320 L0,214 L150,168 L306,222 L458,176 L620,228 L784,180 L944,230 L1108,182 L1276,232 L1440,190 L1440,320 Z"
          fill="var(--drf-mid)" />

        <div className="drf-foot-copy" data-depth="-0.05">
          <h2>Next departure leaves in nine days.</h2>
          <form className="drf-signup" onSubmit={(e) => e.preventDefault()}>
            <input type="email" placeholder="you@email.com" aria-label="Email address" />
            <button type="submit">Join the list <ArrowRight /></button>
          </form>
          <div className="drf-foot-meta">
            <span>Drift° Expeditions</span>
            <span>hello@drift.example</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
