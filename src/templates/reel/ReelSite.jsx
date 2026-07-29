import { useState } from "react";
import useTemplateFont from "../useTemplateFont";
import "./reel.css";

/* ── Reel — Streaming Hero ─────────────────────────────────────
   Full-bleed video, liquid-glass chrome, and everything arriving on a
   staggered blur-rise. Scoped under .rl.

   The overlay is blur only, masked to the bottom third. A dark scrim would
   have been easier but it flattens the footage; blurring instead keeps the
   colour and motion alive while still giving the copy something to sit on. */

const VIDEO =
  "https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260406_094145_4a271a6c-3869-4f1c-8aa7-aeb0cb227994.mp4";

const NAV = ["Movies", "TV Series", "Editor's Pick", "Interviews", "User Reviews"];

const I = {
  search: "m21 21-4.3-4.3M11 19a8 8 0 1 0 0-16 8 8 0 0 0 0 16Z",
  user: "M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z",
  menu: "M4 6h16M4 12h16M4 18h16",
  close: "M18 6 6 18M6 6l12 12",
  clock: "M12 6v6l4 2M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20Z",
  calendar: "M8 2v4M16 2v4M3 10h18M5 4h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2Z",
  left: "m15 18-6-6 6-6",
  right: "m9 18 6-6-6-6",
};

function Icon({ d, size = 18, className = "" }) {
  return (
    <svg
      className={className}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d={d} />
    </svg>
  );
}

const Star = () => (
  <svg className="rl-ic" width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="m12 2 3.1 6.3 6.9 1-5 4.9 1.2 6.8L12 17.8 5.8 21l1.2-6.8-5-4.9 6.9-1L12 2Z" />
  </svg>
);

const Play = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M6 4l14 8-14 8V4Z" />
  </svg>
);

export default function ReelSite() {
  useTemplateFont(
    "https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap"
  );
  const [open, setOpen] = useState(false);

  const fade = (ms) => ({ animationDelay: `${ms}ms` });

  return (
    <div className="rl">
      <video className="rl-video" src={VIDEO} autoPlay muted loop playsInline preload="auto" />
      <div className="rl-blur" />

      <nav className="rl-nav">
        <span className="rl-logo animate-blur-fade-up" style={fade(0)}>
          CINEMATIC
        </span>

        <div className="rl-links">
          {NAV.map((l, i) => (
            <a
              key={l}
              href={`#${l.toLowerCase().replace(/\W+/g, "-")}`}
              className="animate-blur-fade-up"
              style={fade(100 + i * 50)}
            >
              {l}
            </a>
          ))}
        </div>

        <div className="rl-actions">
          <button className="rl-search liquid-glass animate-blur-fade-up" style={fade(350)} type="button">
            Search
            <Icon d={I.search} />
          </button>
          <button className="rl-circle liquid-glass animate-blur-fade-up" style={fade(400)} type="button" aria-label="Account">
            <Icon d={I.user} />
          </button>
          <button
            className="rl-circle rl-burger liquid-glass animate-blur-fade-up"
            style={fade(350)}
            type="button"
            onClick={() => setOpen((o) => !o)}
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
          >
            <span className={`rl-ico${open ? " is-off" : ""}`}>
              <Icon d={I.menu} />
            </span>
            <span className={`rl-ico rl-ico--x${open ? "" : " is-off"}`}>
              <Icon d={I.close} />
            </span>
          </button>
        </div>
      </nav>

      <div className={`rl-sheet${open ? " is-open" : ""}`}>
        {NAV.map((l, i) => (
          <a
            key={l}
            href={`#${l.toLowerCase().replace(/\W+/g, "-")}`}
            style={{ transitionDelay: `${i * 50}ms` }}
            onClick={() => setOpen(false)}
          >
            {l}
          </a>
        ))}
      </div>

      <div className="rl-hero">
        <div className="rl-hero__row">
          <div className="rl-hero__main">
            <div className="rl-meta animate-blur-fade-up" style={fade(300)}>
              <span>
                <Star />
                <strong>8.7/10 IMDB</strong>
              </span>
              <span>
                <Icon d={I.clock} size={16} className="rl-ic" />
                132 min
              </span>
              <span>
                <Icon d={I.calendar} size={16} className="rl-ic" />
                April, 2025
              </span>
            </div>

            <h1 className="rl-title animate-blur-fade-up" style={fade(400)}>
              Step Through. Work Smarter.
            </h1>

            <p className="rl-desc animate-blur-fade-up" style={fade(500)}>
              A voyage through forgotten realms, where past and future intertwine.
            </p>

            <div className="rl-ctas">
              <button className="rl-watch animate-blur-fade-up" style={fade(600)} type="button">
                <Play />
                Watch Now
              </button>
              <button className="rl-learn liquid-glass animate-blur-fade-up" style={fade(700)} type="button">
                Learn More
              </button>
            </div>
          </div>

          <div className="rl-arrows">
            <button className="rl-arrow liquid-glass animate-blur-fade-up" style={fade(800)} type="button">
              <Icon d={I.left} />
              Previous
            </button>
            <button className="rl-arrow liquid-glass animate-blur-fade-up" style={fade(900)} type="button">
              Next
              <Icon d={I.right} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
