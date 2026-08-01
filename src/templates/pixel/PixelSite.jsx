import { useState } from "react";
import useTemplateFont from "../useTemplateFont";
import "./pixel.css";

/* ── Pixel — Designer Portfolio (Signature) ────────────────────
   One locked viewport, no scroll. A meta grid at the top, a spacer that eats
   the middle, and the headline pinned to the bottom edge.

   Two typefaces doing two jobs: Inter for everything structural, and a bitmap
   face for the surnames and the two shouted words inside the headline. The
   mix is the identity, so do not let the pixel face leak into body copy or
   the pixel words fall back to Inter. */

const VIDEO =
  "https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260725_114042_d2ed2a89-f2fa-449b-9609-da456344257b.mp4";

const NAV = ["ABOUT", "PROCESS", "PROJECTS", "CATALOG", "D.O.T", "TALK"];

const SERVICES = [
  "Branding",
  "Creative Direction & Strategy",
  "UX/UI Design",
  "Web Development (React/Nextjs)",
  "3D, WebGL / Photography",
  "Video & Animation",
];

const AWARDS = [
  { name: "FWA", count: "x1", cls: "pix-award-fwa" },
  { name: "W.", count: "x7", cls: "pix-award-w" },
  { name: "CSSDesignAwards", count: "x22", cls: "pix-award-css" },
];

function Logo() {
  return (
    <svg width="28" height="28" viewBox="0 0 256 256" fill="none" aria-hidden="true">
      <path
        d="M 160 88 L 194 34 L 216 0 L 256 0 L 256 40 L 221.5 93.5 L 200 128 L 256 128 L 256 256 L 96 256 L 96 168 L 64.246 220 L 40 256 L 0 256 L 0 216 L 34 162 L 56 128 L 0 128 L 0 0 L 160 0 Z"
        fill="white"
      />
    </svg>
  );
}
function MenuIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth="2" strokeLinecap="round" aria-hidden="true">
      <path d="M4 6h16" /><path d="M4 12h16" /><path d="M4 18h16" />
    </svg>
  );
}
function CloseIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth="2" strokeLinecap="round" aria-hidden="true">
      <path d="M18 6 6 18" /><path d="m6 6 12 12" />
    </svg>
  );
}
function PlayIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="white" aria-hidden="true">
      <path d="M8 5v14l11-7z" />
    </svg>
  );
}

export default function PixelSite() {
  useTemplateFont(
    "https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap"
  );
  useTemplateFont("https://db.onlinewebfonts.com/c/d08bafd725a4cfc309efb5a88e0b63a5?family=basis33");

  const [menu, setMenu] = useState(false);

  return (
    <div className="pix">
      <video className="pix-video" src={VIDEO} autoPlay muted loop playsInline />

      <div className="pix-shell">
        <nav className="pix-nav">
          <Logo />
          <div className="pix-navlinks">
            {NAV.map((l) => (
              <a key={l} href="#top">{l}</a>
            ))}
          </div>
          <button className="pix-burger" type="button" aria-label="Open menu" onClick={() => setMenu(true)}>
            <MenuIcon />
          </button>
        </nav>

        <div className="pix-meta">
          <div className="pix-col">
            <h2 className="pix-name">
              <span>ADAM</span>
              <span className="pix-font">ROBERTS</span>
            </h2>
            <span className="pix-star">*</span>
            <p className="pix-font pix-blurb">
              Grilled Pixels is my
              <br />
              personal brand - I came up
              <br />
              with it in 2004 based on
              <br />
              "cooking up ideas"
            </p>
          </div>

          <div className="pix-col pix-col--right">
            <h2 className="pix-name">
              <span>DESIGN &amp;</span>
              <span className="pix-font">ENGINEERING</span>
            </h2>
          </div>

          <div className="pix-col">
            <span className="pix-font pix-label">What I Do</span>
            <p className="pix-copy">
              I create the top 1% of experiences for brands and digital products
            </p>
          </div>

          <div className="pix-col pix-col--right">
            <span className="pix-font pix-label">Services</span>
            <ul className="pix-services">
              {SERVICES.map((s) => (
                <li key={s}>{s}</li>
              ))}
            </ul>
          </div>
        </div>

        <div className="pix-grow" />

        <div className="pix-bottom">
          <div className="pix-hero">
            <h1 className="pix-headline">
              I BRING THE
              <br />
              <span className="pix-font pix-shout">UNEXPECTED</span> TO
              <br />
              BRAND &amp; DIGITAL
              <br />
              <span className="pix-font pix-shout">EXPERIENCES</span>
            </h1>

            <div className="pix-side">
              <button className="pix-showreel" type="button">
                <PlayIcon />
                <span>PLAY SHOWREEL</span>
              </button>

              <div className="pix-awards">
                {AWARDS.map((a) => (
                  <div className="pix-chip" key={a.name}>
                    <span className={a.cls}>{a.name}</span>
                    <span className="pix-count">{a.count}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="pix-foot">
            <p>
              Open to freelance, contract or full-time.{" "}
              <a className="pix-red" href="#top">Schedule a call</a>
            </p>
            <p className="pix-foot-right">
              5 full cases • 82 archive fragments • 22 catalog items
            </p>
          </div>
        </div>
      </div>

      <div className={"pix-menu" + (menu ? " is-open" : "")}>
        <div className="pix-menu-head">
          <Logo />
          <button type="button" aria-label="Close menu" onClick={() => setMenu(false)}>
            <CloseIcon />
          </button>
        </div>
        <nav className="pix-menu-nav">
          {NAV.map((l, i) => (
            <a
              key={l}
              href="#top"
              style={{ transitionDelay: menu ? `${100 + i * 60}ms` : "0ms" }}
              onClick={() => setMenu(false)}
            >
              {l}
            </a>
          ))}
        </nav>
      </div>
    </div>
  );
}
