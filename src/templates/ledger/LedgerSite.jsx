import useTemplateFont from "../useTemplateFont";
import useBoomerangVideo from "../useBoomerangVideo";
import "./ledger.css";

/* ── Ledger — Fintech Landing ──────────────────────────────────
   One viewport: transparent nav over a boomerang background video, serif
   headline, and a glass "what do we do" panel anchored flush to the bottom
   edge. Scoped under .lg. */

const VIDEO =
  "https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260715_090628_7052d8a6-a094-4341-a4a2-ad58493a67a9.mp4";

const NAV = ["Product", "Solutions", "Pricing", "Company"];

const FEATURES = [
  ["01", "Conversational"],
  ["02", "Connected"],
  ["03", "Compliant"],
];

function Logo() {
  return (
    <svg className="lg-logo" viewBox="0 0 256 256" fill="currentColor" aria-hidden="true">
      <path d="M 144 256 L 27.598 256 L 144 139.598 Z" />
      <path d="M 256 207.5 L 200 256 L 200 56 L 0 56 L 48 0 L 256 0 Z" />
      <path d="M 0 204.402 L 0 112 L 92.402 112 Z" />
    </svg>
  );
}

function Arrow() {
  return (
    <svg className="lg-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M5 12h14" />
      <path d="m12 5 7 7-7 7" />
    </svg>
  );
}

export default function LedgerSite() {
  useTemplateFont(
    "https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600&display=swap"
  );
  const { videoRef, canvasRef, ready } = useBoomerangVideo();

  return (
    <div className="lg">
      <div className="lg-bg">
        <div className="lg-bg__inner">
          <video
            ref={videoRef}
            src={VIDEO}
            muted
            playsInline
            preload="auto"
            crossOrigin="anonymous"
            style={{ display: ready ? "none" : "block" }}
          />
          <canvas ref={canvasRef} style={{ display: ready ? "block" : "none" }} />
        </div>
      </div>

      <nav className="lg-nav">
        <span className="lg-brand">
          <Logo />
          Boomerang
        </span>
        <div className="lg-nav__links">
          {NAV.map((l) => (
            <a key={l} href={`#${l.toLowerCase()}`}>
              {l}
            </a>
          ))}
        </div>
        <a className="lg-btn" href="#demo">
          Book A Demo
        </a>
      </nav>

      <header className="lg-hero">
        <h1 className="lg-h1">
          Build lasting
          <br />
          relationships.
        </h1>
        <p className="lg-sub">
          Conversational AI platform for modern financial institutions — agents that
          handle the full borrower lifecycle across email, SMS, and voice.
        </p>
        <a className="lg-btn lg-btn--lg" href="#demo">
          Book A Demo
        </a>
      </header>

      <section className="lg-panelwrap">
        <div className="lg-panel">
          <div className="lg-panel__top">
            <div>
              <span className="lg-kicker">What do we do?</span>
              <h2 className="lg-h2">
                Conversations that
                <br />
                build momentum
              </h2>
            </div>
            <p className="lg-panel__body">
              Conversational AI built for regulated financial institutions. Agents that
              hold a real conversation, plug into the systems you run, and show their
              work.
            </p>
          </div>

          <div className="lg-rule" />

          <div className="lg-features">
            {FEATURES.map(([n, label]) => (
              <a className="lg-feature" key={n} href="#product">
                <span>
                  <span className="lg-feature__n">{n}</span>
                  <span className="lg-feature__slash">/</span>
                  <span className="lg-feature__label">{label}</span>
                </span>
                <Arrow />
              </a>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
