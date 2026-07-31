import { useEffect, useRef } from "react";
import useTemplateFont from "../useTemplateFont";
import "./halo.css";

/* ── Halo — Liquid-Glass Waitlist Hero ─────────────────────────
   One screen: full-bleed video, a glass nav, an email capture and three
   social buttons. Everything above the video is the same liquid-glass
   treatment — a near-transparent fill, a 4px backdrop blur and a gradient
   border drawn by a masked ::before.

   The loop is hand-rolled rather than left to the `loop` attribute. A looping
   <video> cuts hard back to frame one, which on a slow drifting shot reads as
   a glitch. Instead the clip fades out over the last 0.55s, resets, and fades
   back in — so the seam lands in darkness where nobody sees it.

   The fade is rAF rather than a CSS transition because a transition can't be
   interrupted and resumed from its current value without fighting it; here
   each new fade cancels the previous frame and picks up from wherever the
   opacity actually is. */

const VIDEO =
  "https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260328_115001_bcdaa3b4-03de-47e7-ad63-ae3e392c32d4.mp4";

const NAV = ["Features", "Pricing", "About"];
const FADE_MS = 500;
const TAIL_S = 0.55; // start fading out this long before the end

/* Icons are inline SVG rather than a package. The reference called for
   lucide-react, which is a dependency and a build step for four glyphs. */
function GlobeIcon({ size = 24 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="12" cy="12" r="10" />
      <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
      <path d="M2 12h20" />
    </svg>
  );
}
function ArrowRight({ size = 20 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M5 12h14" /><path d="m12 5 7 7-7 7" />
    </svg>
  );
}
function InstagramIcon({ size = 20 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect width="20" height="20" x="2" y="2" rx="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
    </svg>
  );
}
function TwitterIcon({ size = 20 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 12 3 3c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" />
    </svg>
  );
}

export default function HaloSite() {
  useTemplateFont(
    "https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&display=swap"
  );

  const videoRef = useRef(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    let raf = 0;
    let fadingOut = false;

    /* Ease opacity to `to` over FADE_MS, starting from wherever it is now.
       Cancelling the previous frame first is what stops two fades fighting
       when a loop restarts while an old one is still running. */
    const fadeTo = (to) => {
      cancelAnimationFrame(raf);
      const from = Number(video.style.opacity || 0);
      const start = performance.now();
      const step = (now) => {
        const t = Math.min(1, (now - start) / FADE_MS);
        video.style.opacity = String(from + (to - from) * t);
        if (t < 1) raf = requestAnimationFrame(step);
      };
      raf = requestAnimationFrame(step);
    };

    const onLoaded = () => {
      video.style.opacity = "0";
      video.play().catch(() => {});
      fadeTo(1);
    };
    const onTimeUpdate = () => {
      if (fadingOut || !video.duration) return;
      if (video.duration - video.currentTime <= TAIL_S) {
        fadingOut = true;
        fadeTo(0);
      }
    };
    const onEnded = () => {
      video.style.opacity = "0";
      setTimeout(() => {
        video.currentTime = 0;
        video.play().catch(() => {});
        fadingOut = false;
        fadeTo(1);
      }, 100);
    };

    video.addEventListener("loadeddata", onLoaded);
    video.addEventListener("timeupdate", onTimeUpdate);
    video.addEventListener("ended", onEnded);
    if (video.readyState >= 2) onLoaded();

    return () => {
      cancelAnimationFrame(raf);
      video.removeEventListener("loadeddata", onLoaded);
      video.removeEventListener("timeupdate", onTimeUpdate);
      video.removeEventListener("ended", onEnded);
    };
  }, []);

  return (
    <div className="hal">
      <video
        ref={videoRef}
        className="hal-video"
        src={VIDEO}
        muted
        playsInline
        autoPlay
        preload="auto"
        style={{ opacity: 0 }}
      />

      <div className="hal-frame">
        <nav className="hal-nav">
          <div className="hal-nav-inner hal-glass">
            <div className="hal-nav-left">
              <a className="hal-logo" href="#top">
                <GlobeIcon size={24} />
                <span>Asme</span>
              </a>
              <div className="hal-links">
                {NAV.map((l) => (
                  <a key={l} href="#top">{l}</a>
                ))}
              </div>
            </div>
            <div className="hal-nav-right">
              <button className="hal-signup" type="button">Sign Up</button>
              <button className="hal-login hal-glass" type="button">Login</button>
            </div>
          </div>
        </nav>

        <main className="hal-hero">
          <h1 className="hal-title">Built for the curious</h1>

          <div className="hal-stack">
            <form className="hal-email hal-glass" onSubmit={(e) => e.preventDefault()}>
              <input type="email" placeholder="Enter your email" aria-label="Email address" />
              <button type="submit" aria-label="Subscribe">
                <ArrowRight size={20} />
              </button>
            </form>
            <p className="hal-sub">
              Stay updated with the latest news and insights. Subscribe to our newsletter
              today and never miss out on exciting updates.
            </p>
          </div>

          <button className="hal-manifesto hal-glass" type="button">Read the manifesto</button>
        </main>

        <footer className="hal-social">
          <button className="hal-icon hal-glass" type="button" aria-label="Instagram">
            <InstagramIcon />
          </button>
          <button className="hal-icon hal-glass" type="button" aria-label="Twitter">
            <TwitterIcon />
          </button>
          <button className="hal-icon hal-glass" type="button" aria-label="Website">
            <GlobeIcon size={20} />
          </button>
        </footer>
      </div>
    </div>
  );
}
