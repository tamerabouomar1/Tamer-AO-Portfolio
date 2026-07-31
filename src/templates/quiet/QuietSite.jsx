import { useEffect, useState } from "react";
import useTemplateFont from "../useTemplateFont";
import "./quiet.css";

/* ── Quiet — Daily Notes Landing ───────────────────────────────
   A calm product page: serif headline over a video of a phone, with the
   product's own messages typing themselves on the phone's screen.

   The typing block is positioned as a percentage of the hero rather than
   pinned to a pixel, because the video is object-fit:cover — the phone moves
   as the viewport changes shape, and percentages track it. The left offset is
   nudged per breakpoint for the same reason. */

const VIDEO =
  "https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260427_054418_a6d194f0-ac86-4df9-abe5-ded73e596d7c.mp4";

const NAV = ["Philosophy", "Trust", "Access", "Tribe"];
const MESSAGES = ["Are you here?", "Yes, I am.", "Speak soon."];

const TYPE_MS = 100;
const DELETE_MS = 50;
const HOLD_MS = 2000;

/** Type a message, hold it, delete it, move to the next. Forever. */
function useCyclingType(messages) {
  const [i, setI] = useState(0);
  const [n, setN] = useState(0);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const word = messages[i];
    if (!deleting && n === word.length) {
      const t = setTimeout(() => setDeleting(true), HOLD_MS);
      return () => clearTimeout(t);
    }
    if (deleting && n === 0) {
      setDeleting(false);
      setI((v) => (v + 1) % messages.length);
      return;
    }
    const t = setTimeout(() => setN((v) => v + (deleting ? -1 : 1)), deleting ? DELETE_MS : TYPE_MS);
    return () => clearTimeout(t);
  }, [messages, i, n, deleting]);

  return messages[i].slice(0, n);
}

export default function QuietSite() {
  useTemplateFont(
    "https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=Inter:wght@100..900&display=swap"
  );
  // The phone-screen face is served from a different host than Google Fonts.
  useTemplateFont(
    "https://db.onlinewebfonts.com/c/440b53b1a1c65037f944ff19259d8014?family=Nokia+Cellphone+FC+Small"
  );

  const typed = useCyclingType(MESSAGES);
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 40);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className={"qui" + (mounted ? " is-in" : "")}>
      <div className="qui-navwrap">
        <nav className="qui-nav">
          <span className="qui-logo">dot.</span>
          <div className="qui-links">
            {NAV.map((l) => (
              <a key={l} href="#top">{l}</a>
            ))}
          </div>
          <button className="qui-cta" type="button">
            <span className="qui-glint" aria-hidden="true" />
            <span className="qui-cta-label">Link up</span>
          </button>
        </nav>
      </div>

      <section className="qui-hero">
        <video className="qui-video" src={VIDEO} autoPlay loop muted playsInline preload="auto" />
        <div className="qui-tint" />

        <div className="qui-copy">
          <h1 className="qui-title">
            Short notes.
            <br />
            Daily calm.
          </h1>
          <p className="qui-sub">
            Linked with a single anonymous peer. One message every day.
            A quiet rhythm in the digital noise.
          </p>
        </div>

        <div className="qui-screen" aria-live="polite">
          <span className="qui-typed">{typed}</span>
          <span className="qui-caret" aria-hidden="true" />
        </div>
      </section>
    </div>
  );
}
