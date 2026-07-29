import useTemplateFont from "../useTemplateFont";
import "./launch.css";

/* ── Launch — Startup Hero ─────────────────────────────────────
   One viewport: glass nav pill, credibility badge, oversized serif
   headline and a single CTA over a looping video. Scoped under .ax.

   Plain autoplay loop here rather than the boomerang canvas the other two
   use — this clip is cut to loop cleanly, so there is nothing to hide and
   no reason to spend the memory. */

const VIDEO =
  "https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260714_113715_c7e0daa0-8bdd-4486-a2da-040901f8f0ea.mp4";

const NAV = ["Features", "Plans", "Security", "About"];

function Logo() {
  return (
    <svg className="ax-logo" viewBox="0 0 256 256" fill="#1B133C" aria-hidden="true">
      <path d="M 256 256 L 128 256 L 0 128 L 128 128 Z" />
      <path d="M 256 128 L 128 128 L 0 0 L 128 0 Z" />
    </svg>
  );
}

export default function LaunchSite() {
  useTemplateFont(
    "https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=Inter:wght@400;500;600&display=swap"
  );

  return (
    <div className="ax">
      <video
        className="ax-bg"
        src={VIDEO}
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
      />

      <nav className="ax-navwrap">
        <div className="ax-nav">
          <Logo />
          <div className="ax-nav__links">
            {NAV.map((l) => (
              <a key={l} href={`#${l.toLowerCase()}`}>
                {l}
              </a>
            ))}
          </div>
        </div>
      </nav>

      <header className="ax-hero">
        <span className="ax-badge">
          <span className="ax-badge__y" aria-hidden="true">
            Y
          </span>
          Funded by Y Combinator
        </span>

        <h1 className="ax-h1">
          Deploy digital workers
          <br />
          for mundane workflows
        </h1>

        <p className="ax-sub">
          Eliminate your tedious browser work and 10x your team&apos;s capacity. Put
          intelligent agents on every routine process so you grow faster and deliver
          more for clients, effortlessly.
        </p>

        <a className="ax-cta" href="#access">
          Get Early Access
        </a>
      </header>
    </div>
  );
}
