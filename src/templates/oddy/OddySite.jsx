import { useCallback, useEffect, useRef, useState } from "react";
import useTemplateFont from "../useTemplateFont";
import "./oddy.css";

/* ── Atelier — Studio Site ─────────────────────────────────────
   The full studio site: hero, marquee, quote + parallax portrait,
   pricing, auto-scrolling testimonials, projects, an interactive
   partner CTA, footer and a floating bottom nav.

   Type note: the reference design pairs PP Neue Montreal (body) with
   PP Mondwest (the serif accent). Neue Montreal is loaded from Webflow's
   CDN in oddy.css; Mondwest is a licensed face with no free CDN, so the
   `.od-serif` class falls back to a book serif stack. Drop
   PPMondwest-Regular.woff2 into /public and the @font-face in oddy.css
   picks it up with no other change. */

const GIFS = [
  "hero-space-voyage-preview-eECLH3Yc",
  "hero-portfolio-cosmic-preview-BpvWJ3Nc",
  "hero-velorah-preview-CJNTtbpd",
  "hero-asme-preview-B_nGDnTP",
  "hero-transform-data-preview-Cx5OU29N",
  "hero-aethera-preview-DknSlcTa",
  "hero-orbit-web3-preview-BXt4OttD",
  "hero-nexora-preview-cx5HmUgo",
].map((n) => `https://motionsites.ai/assets/${n}.gif`);

/* The parallax slot held a founder headshot. This is a template, so it shows
   work instead of a face — nothing here should imply the site belongs to one
   particular person. */
const PARALLAX = "https://motionsites.ai/assets/hero-velorah-preview-CJNTtbpd.gif";

const AVATAR = (id, w = 96) =>
  `https://images.pexels.com/photos/${id}/pexels-photo-${id}.jpeg?auto=compress&cs=tinysrgb&w=${w}`;

const TESTIMONIALS = [
  {
    quote:
      "With very little guidance the team delivered designs that were consistently spot on. They understood the product faster than anyone we've hired.",
    name: "Marcus Anderson",
    role: "CEO",
    company: "Data.storage",
    avatar: AVATAR(220453),
  },
  {
    quote:
      "They led the creation of our best fundraising deck to date. We closed the round three weeks after sending the first version out.",
    name: "alexwu",
    role: "Founder",
    company: "Nexgate",
    avatar: AVATAR(614810),
  },
  {
    quote:
      "Working with the studio turned our product vision into something the whole company could rally behind. The clarity alone was worth it.",
    name: "James Mitchell",
    role: "VP Product",
    company: "LaunchPad",
    avatar: AVATAR(91227),
  },
  {
    quote:
      "The design quality exceeded our expectations at every single milestone, and the pace never dropped once across four months.",
    name: "Rachel Foster",
    role: "Co-founder",
    company: "Nexus Labs",
    avatar: AVATAR(774909),
  },
  {
    quote:
      "Incredible work from start to finish. A small team that behaves like a senior partner rather than a vendor waiting for direction.",
    name: "David Zhang",
    role: "Head of Design",
    company: "Paradigm Labs",
    avatar: AVATAR(1222271),
  },
];

const PROJECTS = [
  {
    name: "evr",
    desc: "From idea to millions raised for a web3 AI product",
    img: "https://motionsites.ai/assets/hero-evr-ventures-preview-DZxeVFEX.gif",
  },
  {
    name: "Automation Machines",
    desc: "Streamlining industrial automation processes",
    img: "https://motionsites.ai/assets/hero-automation-machines-preview-DlTveRIN.gif",
  },
  {
    name: "xPortfolio",
    desc: "Modern portfolio management platform",
    img: "https://motionsites.ai/assets/hero-xportfolio-preview-D4A8maiC.gif",
  },
];

const BOOK = "#book";

/* ── hooks & primitives ─────────────────────────────────────── */

/* Adds the fade-in-up class the first time the element scrolls into view. */
function useInViewAnimation(threshold = 0.1) {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          io.disconnect();
        }
      },
      { threshold }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [threshold]);

  return [ref, inView];
}

function Reveal({ children, delay = 0, className = "", as: Tag = "div" }) {
  const [ref, inView] = useInViewAnimation();
  return (
    <Tag
      ref={ref}
      className={`${className} ${inView ? "od-in" : "od-out"}`.trim()}
      style={{ animationDelay: `${delay}s` }}
    >
      {children}
    </Tag>
  );
}

function Button({ children, variant = "primary", href = BOOK, className = "" }) {
  return (
    <a className={`od-btn od-btn--${variant} ${className}`.trim()} href={href}>
      {children}
    </a>
  );
}

function QuoteMark() {
  return (
    <svg className="od-qmark" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M9.6 5.4 5.9 9.1A6.6 6.6 0 0 0 4 13.8v.6A4.6 4.6 0 0 0 8.6 19a4.3 4.3 0 0 0 4.3-4.3 4.2 4.2 0 0 0-4.2-4.2c-.3 0-.6 0-.9.1l3.2-3.3-1.4-1.9Zm9.2 0-3.7 3.7a6.6 6.6 0 0 0-1.9 4.7v.6a4.6 4.6 0 0 0 4.6 4.6 4.3 4.3 0 0 0 4.3-4.3 4.2 4.2 0 0 0-4.2-4.2c-.3 0-.6 0-.9.1l3.2-3.3-1.4-1.9Z" />
    </svg>
  );
}

function Stars() {
  return (
    <span className="od-stars" aria-hidden="true">
      {Array.from({ length: 5 }, (_, i) => (
        <svg key={i} viewBox="0 0 24 24" fill="currentColor">
          <path d="m12 2 3.1 6.3 6.9 1-5 4.9 1.2 6.8L12 17.8 5.8 21l1.2-6.8-5-4.9 6.9-1L12 2Z" />
        </svg>
      ))}
    </span>
  );
}

/* ── sections ───────────────────────────────────────────────── */

function Hero() {
  return (
    <header className="od-hero">
      <Reveal delay={0.1}>
        <div className="od-serif od-logo">Atelier</div>
      </Reveal>
      <Reveal delay={0.2}>
        <p className="od-mono">An independent design studio</p>
      </Reveal>
      <Reveal delay={0.3}>
        <h1 className="od-h1">
          Build a <span className="od-serif">brand</span>
          <br />
          that <span className="od-serif">gets noticed.</span>
        </h1>
      </Reveal>
      <Reveal delay={0.4} className="od-hero__copy">
        <p>
          A small studio built around brand and product design: identity systems,
          websites and the launch material that carries them, made for teams shaping
          something new.
        </p>
        <p>
          Deliberately small by design. Senior attention on every project, a short line
          between decision and delivery, and a pace that does not cut corners.
        </p>
        <p>Projects start at $5,000 per month.</p>
      </Reveal>
      <Reveal delay={0.5} className="od-hero__cta">
        <Button>Start a chat</Button>
        <Button variant="secondary" href="#projects">
          View projects
        </Button>
      </Reveal>
    </header>
  );
}

function Marquee() {
  return (
    <section className="od-marquee" aria-hidden="true">
      <div className="od-marquee__track">
        {[...GIFS, ...GIFS].map((src, i) => (
          <img key={i} src={src} alt="" loading="lazy" decoding="async" />
        ))}
      </div>
    </section>
  );
}

/* Portrait that drifts against the scroll while it is on screen. The
   listener only runs while the IntersectionObserver says it is visible. */
function ParallaxImage({ src, alt }) {
  const ref = useRef(null);
  const [offset, setOffset] = useState(0);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let visible = false;
    let frame = 0;

    const update = () => {
      frame = 0;
      const r = el.getBoundingClientRect();
      const progress = 1 - (r.top + r.height) / (window.innerHeight + r.height);
      setOffset(Math.max(-200, Math.min(200, (progress - 0.5) * 120)));
    };
    const onScroll = () => {
      if (visible && !frame) frame = requestAnimationFrame(update);
    };

    const io = new IntersectionObserver(([e]) => {
      visible = e.isIntersecting;
      if (visible) update();
    });
    io.observe(el);
    window.addEventListener("scroll", onScroll, { passive: true });

    return () => {
      io.disconnect();
      window.removeEventListener("scroll", onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <div className="od-parallax" ref={ref}>
      <img
        src={src}
        alt={alt}
        loading="lazy"
        decoding="async"
        style={{ transform: `translate3d(0, ${offset}px, 0)` }}
      />
    </div>
  );
}

function QuoteSection() {
  return (
    <section className="od-quote">
      <Reveal delay={0.1}>
        <QuoteMark />
      </Reveal>
      <Reveal delay={0.2}>
        <p className="od-h1">
          The studio we always <span className="od-serif">wanted</span> to work with
        </p>
      </Reveal>
      <Reveal delay={0.3}>
        <p className="od-quote__author">Studio manifesto</p>
      </Reveal>
      {/* Placeholder client marks. Deliberately neutral names — the originals
          were real employers, which made the page read as one person's CV
          rather than a template a buyer drops their own logos into. */}
      <Reveal delay={0.4} className="od-logos">
        <span style={{ width: 96 }}>Northwind</span>
        <span style={{ width: 80 }}>Lumen</span>
        <span style={{ width: 104 }}>Fieldwork</span>
      </Reveal>
      <Reveal delay={0.5}>
        <ParallaxImage src={PARALLAX} alt="" />
      </Reveal>
    </section>
  );
}

function Pricing() {
  return (
    <section className="od-pricing" id="pricing">
      <div className="od-pricing__grid">
        <Reveal delay={0.1} className="od-price od-price--dark">
          <h3>Monthly Partnership</h3>
          <p className="od-price__desc">
            A dedicated creative design team.
            <br />
            You work directly with the founder.
          </p>
          <div className="od-price__amount">$5,000</div>
          <p className="od-price__period">Monthly</p>
          <div className="od-price__cta">
            <Button>Start a chat</Button>
            <Button variant="secondary">How it works</Button>
          </div>
        </Reveal>

        <Reveal delay={0.2} className="od-price od-price--light">
          <h3>Custom Project</h3>
          <p className="od-price__desc">
            Fixed scope, fixed timeline.
            <br />
            Same team, same standards.
          </p>
          <div className="od-price__amount">$5,000</div>
          <p className="od-price__period">Minimum</p>
          <div className="od-price__cta">
            <Button variant="tertiary">Start a chat</Button>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function Carousel() {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const loop = [...TESTIMONIALS, ...TESTIMONIALS, ...TESTIMONIALS];

  useEffect(() => {
    if (paused) return;
    const id = setInterval(() => setIndex((i) => i + 1), 3000);
    return () => clearInterval(id);
  }, [paused]);

  // Snap back to the middle copy once we run off the end, so the track can
  // scroll forever without the transform growing without bound.
  useEffect(() => {
    if (index >= TESTIMONIALS.length * 2) setIndex((i) => i - TESTIMONIALS.length);
  }, [index]);

  const move = (d) => setIndex((i) => (i + d + loop.length) % loop.length);

  return (
    <section
      className="od-carousel"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div className="od-carousel__head">
        <h2 className="od-h1">
          What <span className="od-serif">builders</span> say
        </h2>
        <div className="od-clutch">
          <Stars />
          <span>Clutch 5/5</span>
        </div>
      </div>

      <div className="od-carousel__viewport">
        <div
          className="od-carousel__track"
          style={{ transform: `translate3d(calc(${-index} * (var(--od-card) + 24px)), 0, 0)` }}
        >
          {loop.map((t, i) => (
            <article className="od-tcard" key={i}>
              <QuoteMark />
              <p className="od-tcard__quote">{t.quote}</p>
              <div className="od-tcard__who">
                <img src={t.avatar} alt="" loading="lazy" decoding="async" />
                <div>
                  <p className="od-tcard__name">{t.name}</p>
                  <p className="od-tcard__role">
                    → {t.role}, {t.company}
                  </p>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>

      <div className="od-carousel__nav">
        <button onClick={() => move(-1)} aria-label="Previous testimonial">
          ‹
        </button>
        <button onClick={() => move(1)} aria-label="Next testimonial">
          ›
        </button>
      </div>
    </section>
  );
}

function Projects() {
  return (
    <section className="od-projects" id="projects">
      {PROJECTS.map((p, i) => (
        <Reveal key={p.name} delay={0.1 * (i + 1)} className="od-project">
          <div className="od-project__text">
            <h3 className="od-serif">{p.name}</h3>
            <p>{p.desc}</p>
          </div>
          <img src={p.img} alt={p.name} loading="lazy" decoding="async" />
        </Reveal>
      ))}
    </section>
  );
}

/* Hovering the panel drips rotated GIF thumbnails that fade out behind the
   cursor. Spawns are throttled to one per 80ms and each cleans itself up. */
function PartnerSection() {
  const [trail, setTrail] = useState([]);
  const last = useRef(0);
  const seq = useRef(0);

  const onMove = useCallback((e) => {
    const now = e.timeStamp;
    if (now - last.current < 80) return;
    last.current = now;

    const box = e.currentTarget.getBoundingClientRect();
    const id = ++seq.current;
    const item = {
      id,
      x: e.clientX - box.left,
      y: e.clientY - box.top,
      rot: ((id * 37) % 21) - 10,
      src: GIFS[id % GIFS.length],
    };
    setTrail((t) => [...t.slice(-14), item]);
    setTimeout(() => setTrail((t) => t.filter((p) => p.id !== id)), 1000);
  }, []);

  return (
    <section className="od-partner" onMouseMove={onMove}>
      {trail.map((p) => (
        <img
          key={p.id}
          className="od-partner__drip"
          src={p.src}
          alt=""
          aria-hidden="true"
          style={{ left: p.x, top: p.y, "--od-rot": `${p.rot}deg` }}
        />
      ))}
      <h2 className="od-serif od-partner__head">Partner with us</h2>
      {/* No founder headshot on the CTA — the page is a template, so it must
          not look like it belongs to one particular person. */}
      <a className="od-btn od-btn--primary od-partner__cta" href={BOOK}>
        Start a chat
      </a>
    </section>
  );
}

function Footer() {
  return (
    <footer className="od-footer">
      <Button>Start a chat</Button>
      <div className="od-footer__links">
        <svg className="od-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M7 17 17 7" />
          <path d="M8 7h9v9" />
        </svg>
        <ul>
          <li><a href="#pricing">Services</a></li>
          <li><a href="#projects">Work</a></li>
          <li><a href="#about">About</a></li>
        </ul>
        <ul>
          <li><a href="https://x.com" target="_blank" rel="noreferrer noopener">x.com</a></li>
          <li><a href="https://linkedin.com" target="_blank" rel="noreferrer noopener">LinkedIn</a></li>
        </ul>
      </div>
    </footer>
  );
}

export default function OddySite() {
  useTemplateFont(null); // fonts for this template come from oddy.css @font-face

  return (
    <div className="od">
      <Hero />
      <Marquee />
      <QuoteSection />
      <Pricing />
      <Carousel />
      <Projects />
      <PartnerSection />
      <Footer />

      <div className="od-copyright">
        <span>Atelier Studio</span>
        <span>Working worldwide</span>
      </div>

      <nav className="od-bottomnav">
        <span className="od-serif od-bottomnav__mark">A</span>
        <Button>Start a chat</Button>
      </nav>
    </div>
  );
}
