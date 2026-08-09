import { useRef } from "react";
import useTemplateFont from "../useTemplateFont";
import useHlsVideo from "../useHlsVideo";
import "./closer.css";

/* ── Closer — Cinematic CTA + Footer ───────────────────────────
   The last screen of a page rather than a whole one: a full-bleed film, one
   line of Instrument Serif over it, two buttons and the footer bar, all on
   black.

   The film is an HLS stream, so it needs hls.js everywhere except Safari —
   see useHlsVideo, which only fetches the library on the browsers that
   cannot play the stream from a plain src.

   The two 200px gradients top and bottom are what make this work as a
   section: the video does not end at an edge, it dissolves into the black of
   whatever sits above and below it. Both are pointer-events:none so they
   never swallow a click meant for the buttons underneath.

   Icons are inline SVG. The reference called for lucide-react, which is a
   dependency and a build step for one glyph used twice. */

const VIDEO =
  "https://stream.mux.com/8wrHPCX2dC3msyYU9ObwqNdm00u3ViXvOSHUMRYSEe5Q.m3u8";

const FOOTER_LINKS = ["Privacy", "Terms", "Contact"];

function ArrowUpRight({ size = 20 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M7 17 17 7" /><path d="M7 7h10v10" />
    </svg>
  );
}

export default function CloserSite() {
  useTemplateFont(
    "https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=Barlow:wght@300;400;500;600&display=swap"
  );

  const videoRef = useRef(null);
  useHlsVideo(videoRef, VIDEO);

  return (
    <div className="clo">
      <section className="clo-section">
        <video
          ref={videoRef}
          className="clo-video"
          autoPlay
          loop
          muted
          playsInline
          preload="auto"
        />

        <div className="clo-fade clo-fade--top" aria-hidden="true" />
        <div className="clo-fade clo-fade--bottom" aria-hidden="true" />

        <div className="clo-content">
          <h2 className="clo-title">Your next website starts here.</h2>
          <p className="clo-sub">
            Book a free strategy call. See what AI&#8209;powered design can do. No
            commitment, no pressure. Just possibilities.
          </p>

          <div className="clo-actions">
            <button className="clo-btn clo-btn--glass clo-glass" type="button">
              Book a Call
              <ArrowUpRight size={20} />
            </button>
            <button className="clo-btn clo-btn--solid" type="button">
              View Pricing
              <ArrowUpRight size={16} />
            </button>
          </div>

          <footer className="clo-footer">
            <p className="clo-copy">&copy; 2026 Studio. All rights reserved.</p>
            <div className="clo-links">
              {FOOTER_LINKS.map((link) => (
                <a key={link} href="#top">{link}</a>
              ))}
            </div>
          </footer>
        </div>
      </section>
    </div>
  );
}
