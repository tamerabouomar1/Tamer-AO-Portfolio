import { useEffect, useRef, useState } from "react";
import useTemplateFont from "../useTemplateFont";
import "./frame.css";

/* ── Frame — Mouse-Scrub Agency Hero ───────────────────────────
   The background clip never plays. It is scrubbed by horizontal mouse
   movement: move right and time runs forward, move left and it runs back.
   The effect is that the visitor is driving the footage.

   Seeking is the whole problem. Assigning currentTime while a previous seek
   is still resolving makes the browser drop requests and the video judders,
   so a target time is held and only committed once the last seek has
   reported back. `seeking` is the gate; onSeeked commits whatever the target
   moved to in the meantime. */

const VIDEO =
  "https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260530_042513_df96a13b-6155-4f6e-8b93-c9dee66fba08.mp4";

const SENSITIVITY = 0.8;
const EMAIL = "hello@mainframe.co";
const LINKS = ["Labs", "Studio", "Openings", "Shop"];
const PILLS = ["Pitch us an idea", "Come work here", "Send a brief hello", "See how we operate"];
const LINE =
  "Glad you stopped in. Good taste tends to find us. Now, what are we building?";

function CopyIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect width="13" height="13" x="9" y="9" rx="2" />
      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
    </svg>
  );
}

/** Reveal `text` one character at a time after `startDelay`. */
function useTypewriter(text, speed = 38, startDelay = 600) {
  const [n, setN] = useState(0);
  useEffect(() => {
    let id = 0;
    const t = setTimeout(() => {
      id = setInterval(() => {
        setN((v) => {
          if (v >= text.length) { clearInterval(id); return v; }
          return v + 1;
        });
      }, speed);
    }, startDelay);
    return () => { clearTimeout(t); clearInterval(id); };
  }, [text, speed, startDelay]);
  return { displayed: text.slice(0, n), done: n >= text.length };
}

export default function FrameSite() {
  useTemplateFont("https://db.onlinewebfonts.com/c/5ac3fe7c6abd2f62067f266d89671492?family=HelveticaNowDisplay-Medium");
  useTemplateFont("https://db.onlinewebfonts.com/c/1aa3377e489837a26d019bba501e779d?family=HelveticaNowDisplayW01-Rg");

  const videoRef = useRef(null);
  const targetRef = useRef(0);
  const prevXRef = useRef(null);
  const [menu, setMenu] = useState(false);
  const [copied, setCopied] = useState(false);
  const [pillsIn, setPillsIn] = useState(false);
  const { displayed, done } = useTypewriter(LINE);

  // Pills arrive on their own timer rather than waiting for the typing to
  // finish, so the page is usable within half a second.
  useEffect(() => {
    const t = setTimeout(() => setPillsIn(true), 400);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const commit = () => {
      if (video.seeking || !video.duration) return;
      if (Math.abs(video.currentTime - targetRef.current) < 0.01) return;
      video.currentTime = targetRef.current;
    };

    const onMove = (e) => {
      if (!video.duration) return;
      if (prevXRef.current === null) { prevXRef.current = e.clientX; return; }
      const delta = e.clientX - prevXRef.current;
      prevXRef.current = e.clientX;
      const next = targetRef.current + (delta / window.innerWidth) * SENSITIVITY * video.duration;
      targetRef.current = Math.min(video.duration, Math.max(0, next));
      commit();
    };

    const onSeeked = () => commit();
    const onLoaded = () => { targetRef.current = 0; };

    window.addEventListener("mousemove", onMove, { passive: true });
    video.addEventListener("seeked", onSeeked);
    video.addEventListener("loadedmetadata", onLoaded);
    return () => {
      window.removeEventListener("mousemove", onMove);
      video.removeEventListener("seeked", onSeeked);
      video.removeEventListener("loadedmetadata", onLoaded);
    };
  }, []);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(EMAIL);
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    } catch {
      /* clipboard blocked (insecure origin or denied) — the address is still
         on screen to be selected by hand, so this fails quietly. */
    }
  };

  return (
    <div className="frm">
      <video ref={videoRef} className="frm-video" src={VIDEO} muted playsInline preload="auto" />

      <header className="frm-nav">
        <div className="frm-logo">
          <span className="frm-word">Mainframe(R)</span>
          <span className="frm-star" aria-hidden="true">✳︎</span>
        </div>

        <nav className="frm-links">
          {LINKS.map((l, i) => (
            <span key={l}>
              <a href="#top">{l}</a>
              {i < LINKS.length - 1 && <span>,&nbsp;</span>}
            </span>
          ))}
        </nav>

        <a className="frm-touch" href="#top">Get in touch</a>

        <button
          className={"frm-burger" + (menu ? " is-open" : "")}
          type="button"
          aria-label={menu ? "Close menu" : "Open menu"}
          aria-expanded={menu}
          onClick={() => setMenu((v) => !v)}
        >
          <i /><i /><i />
        </button>
      </header>

      <div className={"frm-sheet" + (menu ? " is-open" : "")}>
        {LINKS.map((l) => (
          <a key={l} href="#top" onClick={() => setMenu(false)}>{l}</a>
        ))}
        <a className="frm-sheet-touch" href="#top" onClick={() => setMenu(false)}>Get in touch</a>
      </div>

      <section className="frm-hero">
        <div className="frm-inner">
          <p className="frm-label" aria-hidden="true">
            Hey there, meet A.R.I.A,
            <br />
            Mainframe's Adaptive Response Interface Agent
          </p>

          <p className="frm-type">
            {displayed}
            {!done && <span className="frm-caret" aria-hidden="true" />}
          </p>

          <div className={"frm-pills" + (pillsIn ? " is-in" : "")}>
            {PILLS.map((p) => (
              <button key={p} className="frm-pill" type="button">{p}</button>
            ))}
            <button className="frm-pill frm-pill-out" type="button" onClick={copy}>
              <span>
                Reach us: <span className="frm-mail">{EMAIL}</span>
              </span>
              <CopyIcon />
              <span className="frm-copied" aria-live="polite">{copied ? "Copied" : ""}</span>
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
