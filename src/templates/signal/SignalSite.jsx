import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import useTemplateFont from "../useTemplateFont";
import useHlsVideo from "../useHlsVideo";
import "./signal.css";

/* ── Signal — No-Code AI Hero ──────────────────────────────────
   One locked screen: an HLS film, a glass pill navbar and a centred hero
   whose call to action is a single button until you press it.

   The mechanic is that swap. "Get early access" becomes an email field, and
   the placeholder types itself in a character at a time rather than just
   appearing — the motion is what tells you the field is live and waiting.
   Submit it and the placeholder retypes as a confirmation, then the whole
   thing folds back to the button after four seconds so the screen returns to
   rest instead of sitting on a dead form.

   Every timer is cleared on unmount, and the typewriter keys off a step index
   rather than appending to state, so a re-render mid-type cannot double a
   character.

   Icons are inline SVG. The reference called for lucide-react, which is a
   dependency and a build step for three glyphs. */

const VIDEO =
  "https://stream.mux.com/kimF2ha9zLrX64H00UgLGPflCzNtl1T0215MlAmeOztv8.m3u8";

const NAV = ["Features", "Pricing", "About"];
const TYPE_MS = 60; // per character
const RESET_MS = 4000; // how long the confirmation holds before folding back
const ASK = "Enter Your Email Here For Early Access";
const THANKS = "You Will Receive Notifications By Email";

const EASE_OUT = [0.16, 1, 0.3, 1];

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
function ArrowRight({ size = 16 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M5 12h14" /><path d="m12 5 7 7-7 7" />
    </svg>
  );
}
function CheckIcon({ size = 16 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M20 6 9 17l-5-5" />
    </svg>
  );
}

export default function SignalSite() {
  useTemplateFont(
    "https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600&family=Instrument+Serif:ital@0;1&display=swap"
  );

  const videoRef = useRef(null);
  useHlsVideo(videoRef, VIDEO);

  const [open, setOpen] = useState(false); // is the email field showing?
  const [sent, setSent] = useState(false);
  const [typed, setTyped] = useState("");
  // Controlled so submitting can empty it. Left uncontrolled, the address the
  // visitor just typed stays in the box and the confirmation — which is a
  // placeholder — never becomes visible behind it.
  const [email, setEmail] = useState("");

  const target = sent ? THANKS : ASK;

  /* Type `target` out one character per tick whenever the field is open.
     Keyed off the current length rather than a closure over the string, so
     switching ASK -> THANKS restarts cleanly from empty. */
  useEffect(() => {
    if (!open) {
      setTyped("");
      return;
    }
    setTyped("");
    let i = 0;
    const id = setInterval(() => {
      i += 1;
      setTyped(target.slice(0, i));
      if (i >= target.length) clearInterval(id);
    }, TYPE_MS);
    return () => clearInterval(id);
  }, [open, target]);

  // Fold back to the button once the confirmation has been read.
  useEffect(() => {
    if (!sent) return;
    const id = setTimeout(() => {
      setSent(false);
      setOpen(false);
    }, RESET_MS);
    return () => clearTimeout(id);
  }, [sent]);

  return (
    <main className="sig">
      <div className="sig-bg" aria-hidden="true">
        <video
          ref={videoRef}
          className="sig-video"
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
        />
      </div>

      <motion.nav
        className="sig-nav"
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: EASE_OUT }}
      >
        <div className="sig-nav-inner sig-glass">
          <div className="sig-nav-left">
            <a className="sig-logo" href="#top">
              <GlobeIcon size={24} />
              <span>Asme</span>
            </a>
            <div className="sig-links">
              {NAV.map((l) => (
                <a key={l} href="#top">{l}</a>
              ))}
            </div>
          </div>
          <div className="sig-nav-right">
            <button className="sig-signup" type="button">Sign Up</button>
            <button className="sig-login sig-glass" type="button">Login</button>
          </div>
        </div>
      </motion.nav>

      <section className="sig-hero">
        <div className="sig-hero-inner">
          <motion.p
            className="sig-tagline"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            Build a no-code AI app in minutes
          </motion.p>

          <motion.h1
            className="sig-title"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: EASE_OUT }}
          >
            A new way to think and create
            <br className="sig-br" /> with computers
          </motion.h1>

          <motion.div
            className="sig-cta"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.8, ease: EASE_OUT }}
          >
            <AnimatePresence mode="wait">
              {open ? (
                <motion.form
                  key="form"
                  className="sig-form"
                  initial={{ scale: 0.95, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.95, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  onSubmit={(e) => {
                    e.preventDefault();
                    setEmail("");
                    setSent(true);
                  }}
                >
                  <input
                    type="email"
                    required
                    autoFocus
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder={typed}
                    aria-label="Email address"
                  />
                  <button type="submit" aria-label={sent ? "Subscribed" : "Subscribe"}>
                    {sent ? <CheckIcon /> : <ArrowRight />}
                  </button>
                </motion.form>
              ) : (
                <motion.button
                  key="button"
                  type="button"
                  className="sig-access"
                  initial={{ scale: 0.95, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.95, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  onClick={() => setOpen(true)}
                >
                  Get early access
                </motion.button>
              )}
            </AnimatePresence>
          </motion.div>

          <motion.div
            className="sig-demo"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8, duration: 0.8 }}
          >
            <a href="#top">Play Video Demo</a>
          </motion.div>
        </div>
      </section>
    </main>
  );
}
