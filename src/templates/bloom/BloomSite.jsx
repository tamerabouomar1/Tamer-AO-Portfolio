import useTemplateFont from "../useTemplateFont";
import "./bloom.css";

/* ── Bloom — AI Floral Platform ────────────────────────────────
   A 52/48 split over a looping film. The left panel is the pitch and sits
   inside an inset glass slab; the right is a column of product furniture —
   socials, a community card, two feature tiles and a wide one — and is hidden
   below 1024px, where it would stack into a second screen of chrome nobody
   asked for.

   Two glass tiers do all the work. The light one is a 4px blur for small
   pills that sit directly on the footage; the strong one is a 50px blur for
   anything holding text for more than a second. Both draw their border with
   a masked ::before rather than a border property, because the frame has to
   be bright at the top and bottom edges and clear through the middle.

   Strictly greyscale, by design: every value here is white at some alpha over
   whatever the film is doing. No accent colour anywhere.

   The mark and the thumbnail are inline SVG rather than image files, so the
   downloaded zip runs with nothing missing. Swap them for your own art.

   Icons are inline SVG. The reference called for lucide-react, which is a
   dependency and a build step for nine glyphs. */

const VIDEO =
  "https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260315_073750_51473149-4350-4920-ae24-c8214286f323.mp4";

const PILLS = ["Artistic Gallery", "AI Generation", "3D Structures"];

/* ── Icons ──────────────────────────────────────────────────── */
const stroke = {
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 2,
  strokeLinecap: "round",
  strokeLinejoin: "round",
};

function Icon({ size = 16, children }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" {...stroke} aria-hidden="true">
      {children}
    </svg>
  );
}

const Menu = (p) => (
  <Icon {...p}><path d="M4 6h16" /><path d="M4 12h16" /><path d="M4 18h16" /></Icon>
);
const Download = (p) => (
  <Icon {...p}><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><path d="m7 10 5 5 5-5" /><path d="M12 15V3" /></Icon>
);
const Sparkles = (p) => (
  <Icon {...p}><path d="m12 3 1.9 5.1L19 10l-5.1 1.9L12 17l-1.9-5.1L5 10l5.1-1.9L12 3Z" /><path d="M19 17.5 19.7 19.3 21.5 20 19.7 20.7 19 22.5 18.3 20.7 16.5 20 18.3 19.3 19 17.5Z" /></Icon>
);
const Wand2 = (p) => (
  <Icon {...p}><path d="m3 21 12-12" /><path d="m14 4 1 2.5L17.5 7.5 15 8.5 14 11l-1-2.5L10.5 7.5 13 6.5 14 4Z" /><path d="M20 13.5 20.6 15l1.5.6-1.5.6L20 17.7l-.6-1.5-1.5-.6 1.5-.6.6-1.5Z" /></Icon>
);
const BookOpen = (p) => (
  <Icon {...p}><path d="M2 4h6a4 4 0 0 1 4 4v12a3 3 0 0 0-3-3H2V4Z" /><path d="M22 4h-6a4 4 0 0 0-4 4v12a3 3 0 0 1 3-3h7V4Z" /></Icon>
);
const ArrowRight = (p) => (
  <Icon {...p}><path d="M5 12h14" /><path d="m12 5 7 7-7 7" /></Icon>
);
const Twitter = (p) => (
  <Icon {...p}><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 12 3 3c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" /></Icon>
);
const Linkedin = (p) => (
  <Icon {...p}><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-4 0v7h-4v-7a6 6 0 0 1 6-6z" /><rect x="2" y="9" width="4" height="12" /><circle cx="4" cy="4" r="2" /></Icon>
);
const Instagram = (p) => (
  <Icon {...p}><rect x="2" y="2" width="20" height="20" rx="5" /><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" /><line x1="17.5" x2="17.51" y1="6.5" y2="6.5" /></Icon>
);

/** The bloom mark. Inline so the zip has no missing asset. */
function BloomMark({ size = 32 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" aria-hidden="true"
      fill="none" stroke="currentColor" strokeWidth="1.6">
      <circle cx="24" cy="24" r="5" />
      {[0, 60, 120, 180, 240, 300].map((deg) => (
        <ellipse key={deg} cx="24" cy="13" rx="5.4" ry="9.5"
          transform={`rotate(${deg} 24 24)`} opacity="0.85" />
      ))}
    </svg>
  );
}

/** Placeholder for the flower thumbnail the reference loaded from /assets. */
function FlowerThumb() {
  return (
    <svg className="blm-thumb" viewBox="0 0 96 64" aria-hidden="true" preserveAspectRatio="xMidYMid slice">
      <defs>
        <linearGradient id="blm-t" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="rgba(255,255,255,0.22)" />
          <stop offset="100%" stopColor="rgba(255,255,255,0.05)" />
        </linearGradient>
      </defs>
      <rect width="96" height="64" fill="url(#blm-t)" />
      <g fill="none" stroke="rgba(255,255,255,0.55)" strokeWidth="1.2">
        <circle cx="48" cy="32" r="6" />
        {[0, 72, 144, 216, 288].map((deg) => (
          <ellipse key={deg} cx="48" cy="20" rx="5" ry="10"
            transform={`rotate(${deg} 48 32)`} />
        ))}
      </g>
    </svg>
  );
}

export default function BloomSite() {
  useTemplateFont(
    "https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600&family=Source+Serif+4:ital,wght@0,400;1,400&display=swap"
  );

  return (
    <div className="blm">
      <video
        className="blm-video"
        src={VIDEO}
        autoPlay
        loop
        muted
        playsInline
        preload="auto"
      />

      <div className="blm-split">
        {/* ── Left: the pitch ─────────────────────────────── */}
        <div className="blm-left">
          <div className="blm-slab blm-glass-strong" aria-hidden="true" />

          <div className="blm-left-inner">
            <nav className="blm-nav">
              <a className="blm-brand" href="#top">
                <BloomMark size={32} />
                <span>bloom</span>
              </a>
              <button className="blm-menu blm-glass" type="button">
                <Menu size={16} />
                Menu
              </button>
            </nav>

            <div className="blm-hero">
              <BloomMark size={80} />
              <h1 className="blm-title">
                Innovating the
                <br />
                spirit of <em>bloom AI</em>
              </h1>

              <button className="blm-cta blm-glass-strong" type="button">
                Explore Now
                <span className="blm-cta-dot">
                  <Download size={14} />
                </span>
              </button>

              <div className="blm-pills">
                {PILLS.map((p) => (
                  <span className="blm-pill blm-glass" key={p}>{p}</span>
                ))}
              </div>
            </div>

            <figure className="blm-quote">
              <figcaption className="blm-kicker">Visionary Design</figcaption>
              <blockquote>
                We imagined a <em>realm</em> with no ending.
              </blockquote>
              <p className="blm-author">
                <span className="blm-rule" />
                Marcus Aurelio
                <span className="blm-rule" />
              </p>
            </figure>
          </div>
        </div>

        {/* ── Right: the furniture ────────────────────────── */}
        <aside className="blm-right">
          <div className="blm-topbar">
            <div className="blm-socials blm-glass">
              <a href="#top" aria-label="Twitter"><Twitter size={16} /></a>
              <a href="#top" aria-label="LinkedIn"><Linkedin size={16} /></a>
              <a href="#top" aria-label="Instagram"><Instagram size={16} /></a>
              <span className="blm-social-go"><ArrowRight size={14} /></span>
            </div>
            <button className="blm-account blm-glass" type="button">
              <span className="blm-dot"><Sparkles size={14} /></span>
              Account
            </button>
          </div>

          <div className="blm-community blm-glass">
            <h3>Enter our ecosystem</h3>
            <p>A working community of growers, designers and machines.</p>
          </div>

          <div className="blm-features blm-glass">
            <div className="blm-feature-row">
              <article className="blm-feature blm-glass">
                <span className="blm-dot"><Wand2 size={14} /></span>
                <h4>Processing</h4>
                <p>Generative passes refine every stem.</p>
              </article>
              <article className="blm-feature blm-glass">
                <span className="blm-dot"><BookOpen size={14} /></span>
                <h4>Growth Archive</h4>
                <p>Every iteration, kept and searchable.</p>
              </article>
            </div>

            <article className="blm-wide blm-glass">
              <FlowerThumb />
              <div className="blm-wide-copy">
                <h4>Advanced Plant Sculpting</h4>
                <p>Shape structure, density and bloom in one pass.</p>
              </div>
              <button className="blm-plus" type="button" aria-label="Open">+</button>
            </article>
          </div>
        </aside>
      </div>
    </div>
  );
}
