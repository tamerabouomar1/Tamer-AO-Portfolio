import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import useTemplateFont from "../useTemplateFont";
import useHlsVideo from "../useHlsVideo";
import "./muse.css";

/* ── Muse — Early Access Hero ──────────────────────────────────
   One black screen that does not scroll: glass navbar, an Instrument Serif
   headline clipped out of a top-down gradient, and a CTA that turns into an
   email field. Scoped under .mu.

   The video is an HLS stream from Mux, not an mp4, so it needs hls.js
   everywhere except iOS Safari. That is exactly what ../useHlsVideo already
   solves — including the trap that Chromium answers canPlayType("…mpegurl")
   with a truthy "maybe" and then cannot play a frame — so this uses the hook
   rather than the canPlayType branch the spec described.

   Spec arrived as Tailwind + lucide-react. Translated to the house pattern:
   one component, one scoped stylesheet, icons inlined. framer-motion is
   already a dependency here, so the motion parts are kept as written. */

const HLS_SRC = "https://stream.mux.com/kimF2ha9zLrX64H00UgLGPflCzNtl1T0215MlAmeOztv8.m3u8";
const LINKS = ["Features", "Pricing", "About"];

const TYPE_IDLE = "Enter Your Email Here For Early Access";
const TYPE_DONE = "You Will Receive Notifications By Email";
const TYPE_MS = 60;

const EASE_OUT = [0.16, 1, 0.3, 1];

function GlobeIcon() {
  return (
    <svg className="mu-globe" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.7" />
      <path d="M2 12h20M12 2a15.3 15.3 0 0 1 0 20a15.3 15.3 0 0 1 0-20z" stroke="currentColor" strokeWidth="1.7" />
    </svg>
  );
}
function ArrowRight() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
function Check() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M4 12.5l5 5L20 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function BackgroundVideo() {
  const ref = useRef(null);
  useHlsVideo(ref, HLS_SRC);
  return (
    <div className="mu-videowrap" aria-hidden="true">
      <video ref={ref} className="mu-video" autoPlay muted loop playsInline />
    </div>
  );
}

/* Types `text` out one character at a time. Returns "" until it is asked to
   run, so the field opens empty and fills rather than flashing the whole
   string on the first frame. */
function useTypewriter(text, run) {
  const [out, setOut] = useState("");
  useEffect(() => {
    if (!run) {
      setOut("");
      return;
    }
    setOut("");
    let i = 0;
    const id = window.setInterval(() => {
      i += 1;
      setOut(text.slice(0, i));
      if (i >= text.length) window.clearInterval(id);
    }, TYPE_MS);
    return () => window.clearInterval(id);
  }, [text, run]);
  return out;
}

function Cta() {
  const [open, setOpen] = useState(false);
  const [sent, setSent] = useState(false);
  const placeholder = useTypewriter(sent ? TYPE_DONE : TYPE_IDLE, open);

  // Four seconds after a submit the whole thing folds back to the button, so
  // a shared screen never sits on a stale confirmation.
  useEffect(() => {
    if (!sent) return;
    const id = window.setTimeout(() => {
      setSent(false);
      setOpen(false);
    }, 4000);
    return () => window.clearTimeout(id);
  }, [sent]);

  return (
    <motion.div
      className="mu-ctawrap"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 1, ease: EASE_OUT, delay: 0.4 }}
    >
      <AnimatePresence mode="wait">
        {!open ? (
          <motion.button
            key="btn"
            type="button"
            className="mu-btn"
            onClick={() => setOpen(true)}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.2 }}
          >
            Get early access
          </motion.button>
        ) : (
          <motion.form
            key="form"
            className="mu-form"
            onSubmit={(e) => {
              e.preventDefault();
              setSent(true);
            }}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.2 }}
          >
            <input
              type="email"
              required
              autoFocus
              placeholder={placeholder}
              aria-label="Email address"
            />
            <button type="submit" aria-label={sent ? "Submitted" : "Submit"}>
              {sent ? <Check /> : <ArrowRight />}
            </button>
          </motion.form>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default function MuseSite() {
  useTemplateFont(
    "https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600&family=Instrument+Serif:ital@0;1&display=swap"
  );

  return (
    <main className="mu">
      <BackgroundVideo />

      <motion.nav
        className="mu-nav"
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: EASE_OUT }}
      >
        <div className="mu-nav__bar liquid-glass">
          <div className="mu-nav__left">
            <span className="mu-brand">
              <GlobeIcon />
              Asme
            </span>
            <div className="mu-nav__links">
              {LINKS.map((l) => (
                <button key={l} type="button">
                  {l}
                </button>
              ))}
            </div>
          </div>

          <div className="mu-nav__right">
            <button type="button" className="mu-signup">
              Sign Up
            </button>
            <button type="button" className="mu-login liquid-glass">
              Login
            </button>
          </div>
        </div>
      </motion.nav>

      <section className="mu-hero">
        <div className="mu-hero__inner">
          <motion.p
            className="mu-tagline"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            Build a no-code AI app in minutes
          </motion.p>

          <motion.h1
            className="mu-title"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: EASE_OUT }}
          >
            A new way to think and create
            <br className="mu-br" /> with computers
          </motion.h1>

          <Cta />

          <motion.div
            className="mu-demo"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.8 }}
          >
            <button type="button">Play Video Demo</button>
          </motion.div>
        </div>
      </section>
    </main>
  );
}
