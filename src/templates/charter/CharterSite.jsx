import { useState } from "react";
import useTemplateFont from "../useTemplateFont";
import "./charter.css";

/* ── Charter — Luxury Landing (Signature) ──────────────────────
   The odd one in the set: dark type on bright footage rather than white on
   black. It works because the clip is high-key, so the headline is a soft grey
   over a near-black second line and the whole thing reads as print.

   The two headline lines deliberately overlap by 12px — the descender of the
   first sits into the cap height of the second, which is what gives the lockup
   its weight without going bold. */

const VIDEO =
  "https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260328_091828_e240eb17-6edc-4129-ad9d-98678e3fd238.mp4";

const NAV = ["Start", "Story", "Rates", "Benefits", "FAQ"];

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

export default function CharterSite() {
  useTemplateFont(
    "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap"
  );
  const [open, setOpen] = useState(false);

  return (
    <div className="cha">
      <section className="cha-hero">
        <video className="cha-video" src={VIDEO} autoPlay muted loop playsInline />

        <div className="cha-shell">
          <nav className="cha-nav">
            <span className="cha-brand">SkyElite</span>

            <div className="cha-links">
              {NAV.map((l) => (
                <a key={l} href="#top">{l}</a>
              ))}
            </div>

            <button
              className="cha-burger"
              type="button"
              aria-label={open ? "Close menu" : "Open menu"}
              aria-expanded={open}
              onClick={() => setOpen((v) => !v)}
            >
              {open ? <CloseIcon /> : <MenuIcon />}
            </button>

            {open && (
              <div className="cha-menu">
                {NAV.map((l) => (
                  <a key={l} href="#top" onClick={() => setOpen(false)}>{l}</a>
                ))}
              </div>
            )}
          </nav>

          <main className="cha-main">
            <div className="cha-copy">
              <span className="cha-kicker">Private Jets</span>
              <h1 className="cha-h1">
                <span className="cha-line1">Premium.</span>
                <span className="cha-line2">Accessible.</span>
              </h1>
              <p className="cha-sub">Your dedication deserves recognition.</p>
              <div className="cha-ctas">
                <button className="cha-btn cha-btn--soft" type="button">Discover</button>
                <button className="cha-btn cha-btn--dark" type="button">Book Now</button>
              </div>
            </div>
          </main>
        </div>
      </section>
    </div>
  );
}
