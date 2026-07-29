import { useEffect, useRef, useState } from "react";
import useTemplateFont from "../useTemplateFont";
import "./calm.css";

/* ── Calm — Product Landing ────────────────────────────────────
   Three sections: a video hero with a floating pill nav, a cream "about"
   band that overlaps it, and a features section where a sticky left column
   tracks whichever card is on screen. Scoped under .cm.

   The tracking uses two IntersectionObservers per card rather than one:
   reveal fires early (15%) so a card is already animating in as it appears,
   while the active-state check waits until 60% so the left-hand nav only
   moves when a card genuinely owns the screen. One shared threshold made
   the nav flicker between two cards mid-scroll. */

const HERO_VIDEO =
  "https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260711_090308_1dd0cea7-f9ba-4db4-8147-c7d746061c9e.mp4";
const FEATURE_BG =
  "https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260709_082449_46df5cc4-ad98-4541-9236-a2659c1478a4.png&w=1920&q=85";

const FEATURES = [
  {
    title: "Built for ease, not urgency",
    desc: "Drift strips away the noise that makes organizing feel draining. Every surface is made to be soft, quiet, and intuitive so you can move forward, not get stuck decoding.",
    video:
      "https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260702_102608_5fa1187d-9ac6-44fb-82ab-54376200abc0.mp4",
  },
  {
    title: "The gentlest way to start",
    desc: "Beginning your day should feel natural, not daunting. Drift eases you into motion with subtle cues and a quiet view of what deserves your energy right now.",
    video:
      "https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260625_174131_395bc785-bb21-4e65-abf6-27c56f0764b6.mp4",
  },
  {
    title: "Deep, undivided focus",
    desc: "No interruptions, no clutter. Drift holds you in the present task with a stripped-back layout that softens all else until you are truly ready to shift.",
    video:
      "https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260525_052706_d2e390fd-1846-4fe7-a4d8-8d2f1c875358.mp4",
  },
];

const MARK =
  "M 256 256 L 178 256 C 150.386 256 128 233.614 128 206 L 128 256 L 0 256 L 0 192 C 0 156.654 28.654 128 64 128 C 99.346 128 128 156.654 128 192 L 128 128 L 256 128 Z M 78 0 C 105.614 0 128 22.386 128 50 L 128 0 L 256 0 L 256 64 C 256 99.346 227.346 128 192 128 C 156.654 128 128 99.346 128 64 L 128 128 L 0 128 L 0 0 Z";

function Mark({ fill = "#321C04", size = 40 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 256 256" fill="none" aria-hidden="true">
      <path d={MARK} fill={fill} />
    </svg>
  );
}

function Navbar() {
  const [open, setOpen] = useState(false);
  return (
    <div className="cm-navwrap">
      <div className="cm-pill">
        <span className="cm-brand">Drift.</span>
        <button
          className={`cm-burger${open ? " is-open" : ""}`}
          onClick={() => setOpen((o) => !o)}
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          type="button"
        >
          <span />
          <span />
        </button>
      </div>
      <div className={`cm-menu${open ? " is-open" : ""}`}>
        {["Features", "Drift AI", "FAQ"].map((l) => (
          <a key={l} href={`#${l.toLowerCase().replace(/\W+/g, "-")}`} onClick={() => setOpen(false)}>
            {l}
          </a>
        ))}
      </div>
    </div>
  );
}

function FeatureCard({ item, index, onActive }) {
  const ref = useRef(null);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // Reveal early so the card is mid-animation by the time it is readable.
    const reveal = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setShown(true);
          reveal.disconnect();
        }
      },
      { threshold: 0.15 }
    );
    // Claim the nav only once the card genuinely dominates the viewport.
    const active = new IntersectionObserver(
      ([e]) => e.isIntersecting && onActive(index),
      { threshold: 0.6 }
    );

    reveal.observe(el);
    active.observe(el);
    return () => {
      reveal.disconnect();
      active.disconnect();
    };
  }, [index, onActive]);

  return (
    <article className={`cm-card${shown ? " is-in" : ""}`} ref={ref}>
      <Mark fill="rgba(255,255,255,0.8)" />
      <h3>{item.title}</h3>
      <div className="cm-card__video">
        <video src={item.video} autoPlay muted loop playsInline preload="none" />
      </div>
      <p>{item.desc}</p>
    </article>
  );
}

export default function CalmSite() {
  useTemplateFont(
    "https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@1&family=Inter:wght@400;500;600&display=swap"
  );
  const [active, setActive] = useState(0);

  return (
    <div className="cm">
      {/* ── hero ── */}
      <section className="cm-hero">
        <video className="cm-hero__video" src={HERO_VIDEO} autoPlay muted loop playsInline />
        <div className="cm-hero__scrim" />
        <Navbar />

        <div className="cm-hero__content">
          <h1 className="cm-h1">
            Own your time
            <br />
            without{" "}
            <em className="cm-serif">the stress</em>
          </h1>
          <p className="cm-hero__sub">
            Drift is a calm, ADHD-friendly planner that turns scattered ideas into a clear
            path
          </p>
          <div className="cm-ctabar">
            <span className="cm-ctabar__lg">
              No noise. No complicated systems. Just your day, gently sorted.
            </span>
            <span className="cm-ctabar__sm">No noise. Just your day, gently sorted.</span>
            <button type="button">Start for free</button>
          </div>
        </div>
      </section>

      {/* ── about ── */}
      <section className="cm-about">
        <div className="cm-about__top">
          <p>
            We craft tools that move with your rhythm, not over it. Designed for ease,
            presence, and flow.
          </p>
          <div className="cm-about__btns">
            <button className="cm-btn cm-btn--dark" type="button">
              <span className="cm-btn__dot">
                <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="#321C04" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <rect x="2" y="4" width="20" height="16" rx="2" />
                  <path d="m22 7-10 5L2 7" />
                </svg>
              </span>
              Say hello
            </button>
            <button className="cm-btn cm-btn--muted" type="button">
              <span className="cm-btn__dot">
                <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="#321C04" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
                  <path d="M12 5v14M5 12h14" />
                </svg>
              </span>
              Stay informed
            </button>
          </div>
        </div>

        <div className="cm-divider">
          <span className="cm-divider__dot" />
          <span className="cm-divider__line" />
          <span className="cm-divider__dot" />
        </div>

        <div className="cm-about__bottom">
          <div className="cm-about__mark">
            <Mark />
            <span>
              Calm /<br />
              Amplified
            </span>
          </div>
          <p>
            We make AI tools and assistants. But, most importantly, we help you remember
            what gentle productivity looks like when software moves with you, not over
            you. We create systems that carry the cognitive weight, so you can attend to
            what truly counts.
          </p>
        </div>
      </section>

      {/* ── features ── */}
      <section className="cm-features" id="features">
        <div className="cm-features__bg" style={{ backgroundImage: `url(${FEATURE_BG})` }} />

        <div className="cm-features__grid">
          <div className="cm-features__side">
            <h2>Software that flows with your mind, not over it</h2>

            <div className="cm-featnav">
              {FEATURES.map((f, i) => (
                <button
                  key={f.title}
                  className={i === active ? "is-active" : ""}
                  onClick={() =>
                    document
                      .querySelectorAll(".cm-card")
                      [i]?.scrollIntoView({ behavior: "smooth", block: "center" })
                  }
                  type="button"
                >
                  {f.title}
                </button>
              ))}
            </div>

            <div className="cm-features__cta">
              <p>No noise. No complicated systems. Just your day, gently sorted.</p>
              <button type="button">Start for free</button>
            </div>
          </div>

          <div className="cm-features__cards">
            {FEATURES.map((f, i) => (
              <FeatureCard key={f.title} item={f} index={i} onActive={setActive} />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
