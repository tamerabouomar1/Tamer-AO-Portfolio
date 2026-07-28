import { useEffect, useRef, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import useTemplateFont from "../useTemplateFont";
import "./jack.css";

/* ── Jack — 3D Creator ─────────────────────────────────────────
   Dark full-length portfolio. Five sections: hero, scroll-linked
   marquee, about, services (white), stacking projects.
   All styles are scoped under .jk so nothing leaks into the portfolio. */

const EASE = [0.25, 0.1, 0.25, 1];

const MARQUEE = [
  "hero-space-voyage-preview-eECLH3Yc",
  "hero-codenest-preview-Cgppc2qV",
  "hero-vex-ventures-preview-BczMFIiw",
  "hero-stellar-ai-v2-preview-DjvxjG3C",
  "hero-asme-preview-B_nGDnTP",
  "hero-transform-data-preview-Cx5OU29N",
  "hero-vitara-preview-Cjz2QYyU",
  "hero-terra-preview-BFjrCr7T",
  "hero-skyelite-preview-DHaZIgUv",
  "hero-aethera-preview-DknSlcTa",
  "hero-designpro-preview-D8c5_een",
  "hero-stellar-ai-preview-D3HL6bw1",
  "hero-xportfolio-preview-D4A8maiC",
  "hero-orbit-web3-preview-BXt4OttD",
  "hero-nexora-preview-cx5HmUgo",
  "hero-evr-ventures-preview-DZxeVFEX",
  "hero-planet-orbit-preview-DWAP8Z1P",
  "hero-new-era-preview-CocuDUm9",
  "hero-wealth-preview-B70idl_u",
  "hero-luminex-preview-CxOP7ce6",
  "hero-celestia-preview-0yO3jXO8",
].map((n) => `https://motionsites.ai/assets/${n}.gif`);

const FIGMA = "https://shrug-person-78902957.figma.site/_components/v2";
const DECOR = `${FIGMA}/ebb2b8f25d8e24d5f0a5ca8af4c950de81aa2fd7`;
const PORTRAIT = `${FIGMA}/d24c01ad3a56fc65e942a1f501eb73db42d7cf9a/Rectangle_40443.81459862.png`;

const SERVICES = [
  ["01", "3D Modeling", "Creation of detailed objects, characters, or environments tailored to specific client needs, ideal for games, products, and visualizations."],
  ["02", "Rendering", "High-quality, photorealistic renders that showcase designs with custom lighting, textures, and materials to bring concepts to life."],
  ["03", "Motion Design", "Dynamic animations and motion graphics that add energy and storytelling to brands, products, and digital experiences."],
  ["04", "Branding", "Crafting cohesive visual identities — from logos to full brand systems — that communicate a clear and memorable presence."],
  ["05", "Web Design", "Designing clean, modern, and conversion-focused websites with attention to layout, typography, and user experience."],
];

const shot = (id) =>
  `https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_${id}.png&w=1280&q=85`;

const PROJECTS = [
  {
    n: "01",
    name: "Nextlevel Studio",
    cat: "Client",
    a: shot("20260412_055344_5eff02e0-87a5-41ce-b64f-eb08da8f33db"),
    b: shot("20260412_055431_11d841fd-8b41-46a5-82e4-b04f2407a7d8"),
    c: shot("20260412_055451_e317bf2d-28d4-48cc-86b0-6f72f25b6327"),
  },
  {
    n: "02",
    name: "Aura Brand Identity",
    cat: "Personal",
    a: shot("20260412_055654_911201c5-36d9-4bc6-bac7-331adfce159f"),
    b: shot("20260412_055723_5ceda0b8-d9c2-4665-b2e3-83ba19ba76d1"),
    c: shot("20260412_055753_adc5dcbd-a8e6-49c0-b43a-9b030d835cea"),
  },
  {
    n: "03",
    name: "Solaris Digital",
    cat: "Client",
    a: shot("20260412_055759_963cfb0b-4bd1-4b0f-9d0a-09bd6cf95b2f"),
    b: shot("20260412_060108_438f781a-9846-4dcc-89ab-c4e6cb830f5b"),
    c: shot("20260412_055818_9d062121-ad7e-46b9-999a-1a6a692ef1ee"),
  },
];

/* ── primitives ─────────────────────────────────────────────── */

function FadeIn({ children, delay = 0, duration = 0.7, x = 0, y = 30, className, style }) {
  return (
    <motion.div
      className={className}
      style={style}
      initial={{ opacity: 0, x, y }}
      whileInView={{ opacity: 1, x: 0, y: 0 }}
      viewport={{ once: true, margin: "50px", amount: 0 }}
      transition={{ delay, duration, ease: EASE }}
    >
      {children}
    </motion.div>
  );
}

/* Cursor-following magnetic wrapper: while the pointer is within `padding`
   of the element's box, the element leans toward it. */
function Magnet({ children, padding = 150, strength = 3, className }) {
  const ref = useRef(null);
  const [active, setActive] = useState(false);
  const [pos, setPos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    // A magnet is a pointer affordance — skip the listener entirely on touch.
    if (!window.matchMedia("(hover: hover)").matches) return;

    const onMove = (e) => {
      const el = ref.current;
      if (!el) return;
      const r = el.getBoundingClientRect();
      const cx = r.left + r.width / 2;
      const cy = r.top + r.height / 2;
      const dx = e.clientX - cx;
      const dy = e.clientY - cy;
      const inside =
        Math.abs(dx) < r.width / 2 + padding && Math.abs(dy) < r.height / 2 + padding;
      if (inside) {
        setActive(true);
        setPos({ x: dx / strength, y: dy / strength });
      } else {
        setActive(false);
        setPos({ x: 0, y: 0 });
      }
    };
    window.addEventListener("mousemove", onMove, { passive: true });
    return () => window.removeEventListener("mousemove", onMove);
  }, [padding, strength]);

  return (
    <div
      ref={ref}
      className={className}
      style={{
        transform: `translate3d(${pos.x}px, ${pos.y}px, 0)`,
        transition: active ? "transform 0.3s ease-out" : "transform 0.6s ease-in-out",
        willChange: "transform",
      }}
    >
      {children}
    </div>
  );
}

/* Paragraph that lights up character by character as it scrolls through. */
function AnimatedText({ text }) {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 0.8", "end 0.2"],
  });
  const chars = [...text];

  return (
    <p className="jk-about__copy" ref={ref}>
      {chars.map((c, i) => {
        const start = i / chars.length;
        const end = start + 1 / chars.length;
        return <Char key={i} progress={scrollYProgress} range={[start, end]} char={c} />;
      })}
    </p>
  );
}

function Char({ char, progress, range }) {
  const opacity = useTransform(progress, range, [0.2, 1]);
  return (
    <span className="jk-char">
      <span className="jk-char__ghost">{char}</span>
      <motion.span className="jk-char__live" style={{ opacity }}>
        {char}
      </motion.span>
    </span>
  );
}

function ContactButton() {
  return (
    <a className="jk-btn-contact" href="#contact">
      Contact Me
    </a>
  );
}

/* ── sections ───────────────────────────────────────────────── */

function Hero() {
  return (
    <section className="jk-hero">
      <FadeIn y={-20} delay={0}>
        <nav className="jk-nav">
          {["About", "Price", "Projects", "Contact"].map((l) => (
            <a key={l} href={`#${l.toLowerCase()}`}>
              {l}
            </a>
          ))}
        </nav>
      </FadeIn>

      <div className="jk-hero__headwrap">
        <FadeIn y={40} delay={0.15}>
          <h1 className="jk-gradient jk-hero__head">Hi, i&apos;m jack</h1>
        </FadeIn>
      </div>

      <div className="jk-hero__bottom">
        <FadeIn y={20} delay={0.35}>
          <p className="jk-hero__lede">
            a 3d creator driven by crafting striking and unforgettable projects
          </p>
        </FadeIn>
        <FadeIn y={20} delay={0.5}>
          <ContactButton />
        </FadeIn>
      </div>

      <FadeIn y={30} delay={0.6} className="jk-hero__portrait">
        <Magnet>
          <img src={PORTRAIT} alt="Jack" fetchpriority="high" decoding="async" />
        </Magnet>
      </FadeIn>
    </section>
  );
}

/* Two rows that slide in opposite directions as the page scrolls past them.
   The transform is written straight to the node from a passive scroll
   listener, so this never triggers a React re-render while scrolling. */
function Marquee() {
  const wrap = useRef(null);
  const rowA = useRef(null);
  const rowB = useRef(null);

  useEffect(() => {
    let frame = 0;
    const apply = () => {
      frame = 0;
      const el = wrap.current;
      if (!el) return;
      const top = el.getBoundingClientRect().top + window.scrollY;
      const offset = (window.scrollY - top + window.innerHeight) * 0.3;
      const d = offset - 200;
      if (rowA.current) rowA.current.style.transform = `translateX(${d}px)`;
      if (rowB.current) rowB.current.style.transform = `translateX(${-d}px)`;
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(apply);
    };
    apply();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);

  const row = (list) => [...list, ...list, ...list];

  return (
    <section className="jk-marquee" ref={wrap}>
      <div className="jk-marquee__row" ref={rowA}>
        {row(MARQUEE.slice(0, 11)).map((src, i) => (
          <img key={i} src={src} alt="" loading="lazy" decoding="async" />
        ))}
      </div>
      <div className="jk-marquee__row" ref={rowB}>
        {row(MARQUEE.slice(11)).map((src, i) => (
          <img key={i} src={src} alt="" loading="lazy" decoding="async" />
        ))}
      </div>
    </section>
  );
}

function About() {
  const decor = [
    ["moon_icon.11395d36.png", "jk-decor--tl", 0.1, -80],
    ["p59_1.4659672e.png", "jk-decor--bl", 0.25, -80],
    ["lego_icon-1.703bb594.png", "jk-decor--tr", 0.15, 80],
    ["Group_134-1.2e04f3ce.png", "jk-decor--br", 0.3, 80],
  ];

  return (
    <section className="jk-about" id="about">
      {decor.map(([file, cls, delay, x]) => (
        <FadeIn key={cls} className={`jk-decor ${cls}`} delay={delay} duration={0.9} x={x} y={0}>
          <img src={`${DECOR}/${file}`} alt="" loading="lazy" decoding="async" />
        </FadeIn>
      ))}

      <FadeIn y={40}>
        <h2 className="jk-gradient jk-about__head">About me</h2>
      </FadeIn>

      <AnimatedText text="With more than five years of experience in design, i focus on branding, web design, and user experience, i truly enjoy working with businesses that aim to stand out and present their best image. Let's build something incredible together!" />

      <ContactButton />
    </section>
  );
}

function Services() {
  return (
    <section className="jk-services" id="price">
      <h2 className="jk-services__head">Services</h2>
      <div className="jk-services__list">
        {SERVICES.map(([n, name, desc], i) => (
          <FadeIn key={n} delay={i * 0.1}>
            <div className="jk-service">
              <span className="jk-service__n">{n}</span>
              <div>
                <h3 className="jk-service__name">{name}</h3>
                <p className="jk-service__desc">{desc}</p>
              </div>
            </div>
          </FadeIn>
        ))}
      </div>
    </section>
  );
}

function ProjectCard({ p, index, total, progress }) {
  const target = 1 - (total - 1 - index) * 0.03;
  const scale = useTransform(progress, [index / total, 1], [1, target]);

  return (
    <div className="jk-proj__slot">
      <motion.article
        className="jk-proj"
        style={{ scale, top: `${index * 28}px` }}
      >
        <div className="jk-proj__top">
          <span className="jk-proj__n">{p.n}</span>
          <div className="jk-proj__meta">
            <span className="jk-proj__cat">{p.cat}</span>
            <h3 className="jk-proj__name">{p.name}</h3>
          </div>
          <a className="jk-btn-ghost" href="#projects">
            Live Project
          </a>
        </div>
        <div className="jk-proj__grid">
          <div className="jk-proj__col1">
            <img src={p.a} alt="" loading="lazy" decoding="async" />
            <img src={p.b} alt="" loading="lazy" decoding="async" />
          </div>
          <div className="jk-proj__col2">
            <img src={p.c} alt="" loading="lazy" decoding="async" />
          </div>
        </div>
      </motion.article>
    </div>
  );
}

function Projects() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"],
  });

  return (
    <section className="jk-projects" id="projects" ref={ref}>
      <FadeIn y={40}>
        <h2 className="jk-gradient jk-projects__head">Project</h2>
      </FadeIn>
      {PROJECTS.map((p, i) => (
        <ProjectCard
          key={p.n}
          p={p}
          index={i}
          total={PROJECTS.length}
          progress={scrollYProgress}
        />
      ))}
      <footer className="jk-foot" id="contact">
        <ContactButton />
      </footer>
    </section>
  );
}

export default function JackSite() {
  useTemplateFont(
    "https://fonts.googleapis.com/css2?family=Kanit:wght@300;400;500;700;900&display=swap"
  );

  return (
    <div className="jk">
      <Hero />
      <Marquee />
      <About />
      <Services />
      <Projects />
    </div>
  );
}
