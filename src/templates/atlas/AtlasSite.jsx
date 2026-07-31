import { useEffect, useRef } from "react";
import useTemplateFont from "../useTemplateFont";
import "./atlas.css";

/* ── Atlas — Cinematic Travel Story ────────────────────────────
   A sticky stage scrubbed by ~3700px of scroll. Seven transparent PNG layers
   sit in one 100vh frame; scrolling drives a single rAF loop that writes CSS
   custom properties, and every layer is positioned purely off those. Nothing
   re-renders React — the whole film runs on the compositor.

   Two things worth knowing before editing:

   1. The loop writes to the ROOT element of this template, not to
      document.documentElement. The original was a standalone page and could
      own :root; here the portfolio owns it, so the variables are scoped to
      .atl and would leak into the rest of the site otherwise.

   2. `smoothScroll` lerps toward the real scroll position at 0.14 and snaps
      when within 0.08. That inertia is the reason the layers feel like film
      rather than a slider, so keep it if you retime anything. Under
      prefers-reduced-motion it is bypassed and values snap. */

const FONT = "Ogg Medium";
const OGG =
  "https://dcym8fthxf5uu.cloudfront.net/fonts/247a073c-29f5-4a89-aa3a-741020f346fc/OggText-Medium.woff2";

const A = "https://raft-blast-61784561.figma.site/_assets/v11/";
const SCENE = {
  sky: `${A}16b5007d9c93971e26ffe4e0e3e37946f6bd538c.png`,
  four: `${A}8a7f8af50e0ce92ec2e228e7b0b4112178c51cf1.png`,
  bazaar: `${A}864afe00e41e2fa20a5aa546e15cb807e0f81384.png`,
  splitLeft: `${A}7536d7b60a1fce482cf6edf3f0bffd3bad5d0f8a.png`,
  splitRight: `${A}392db6a6a6b98e868bd7f8d3f55bb719d51e5028.png`,
  bridge: `${A}c6a6d8ef49bca43f708aa852692942c45ec950d4.png`,
  frameTwo: `${A}ba75252bab2b1c510987b74837770f7bc8a6b2d4.png`,
};

const P = "https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/";
const PIN = {
  1: `${P}hf_20260730_230438_d526b8b6-8a2e-4e3b-9993-3908acae03a7.png`,
  2: `${P}hf_20260730_230442_140bc25b-b165-4249-904a-f708bff6970e.png`,
  3: `${P}hf_20260730_230448_825949c9-ccdb-4857-b4a6-e349eccc9010.png`,
};

const NAV = [
  ["Intro", "#atl-cinema"],
  ["Bridge", "#atl-bridge"],
  ["Bazaar", "#atl-bazaar"],
  ["Routes", "#atl-routes"],
];

const SIGHTS = [
  { kicker: "Old Bridge", title: "Stari Most", pin: PIN[1],
    body: "The stone arch over the Neretva and Mostar's main landmark." },
  { kicker: "Bazaar Street", title: "Kujundziluk", pin: PIN[2],
    body: "Copper shops, souvenirs, and the old bazaar lane by the bridge." },
  { kicker: "Viewpoint", title: "Koski Mehmed Pasha Mosque", pin: PIN[3],
    body: "A classic minaret view back toward Stari Most and the river." },
  { kicker: "Ottoman House", title: "Kajtaz House", pin: PIN[1],
    body: "A preserved residential house showing Mostar's Ottoman layers." },
  { kicker: "Museum", title: "War Photo Exhibition", pin: PIN[2],
    body: "A compact, moving stop for context on the city's recent history." },
];

/* ── easing helpers ─────────────────────────────────────────── */
const clamp = (v, min = 0, max = 1) => Math.min(max, Math.max(min, v));
const lerp = (a, b, t) => a + (b - a) * t;
function smoothstep(e0, e1, v) {
  const x = clamp((v - e0) / (e1 - e0));
  return x * x * (3 - 2 * x);
}
/** enter/exit ramps for one beat of the film, and the window between them. */
function segmentInOut(s, a, b, c, d) {
  const enter = smoothstep(a, b, s);
  const exit = smoothstep(c, d, s);
  return { enter, exit, active: enter * (1 - exit) };
}

export default function AtlasSite() {
  useTemplateFont(null); // the display face is a woff2, loaded below instead

  const rootRef = useRef(null);
  const sectionRef = useRef(null);
  const trackRef = useRef(null);
  const controlsRef = useRef(null);
  const activeRef = useRef(SIGHTS.length); // start in the middle clone set

  /* The display serif is a bare woff2, so @font-face has to be injected
     rather than linked like a Google Fonts stylesheet. Reference counting
     matches useTemplateFont: mount adds it, the last unmount removes it. */
  useEffect(() => {
    const id = "atl-ogg-face";
    let tag = document.getElementById(id);
    if (tag) {
      tag.dataset.uses = String(Number(tag.dataset.uses || 1) + 1);
    } else {
      tag = document.createElement("style");
      tag.id = id;
      tag.dataset.uses = "1";
      tag.textContent = `@font-face{font-family:"${FONT}";src:url("${OGG}") format("woff2");font-weight:500;font-style:normal;font-display:swap;}`;
      document.head.appendChild(tag);
    }
    return () => {
      const left = Number(tag.dataset.uses || 1) - 1;
      if (left > 0) tag.dataset.uses = String(left);
      else tag.remove();
    };
  }, []);

  /* ── the scroll engine ─────────────────────────────────────── */
  useEffect(() => {
    const root = rootRef.current;
    const section = sectionRef.current;
    if (!root || !section) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
    let targetMouseX = 0, targetMouseY = 0, mouseX = 0, mouseY = 0;
    let targetScroll = 0, smoothScroll = 0;
    let initialized = false, rafPending = false, raf = 0;

    const set = (k, v) => root.style.setProperty(k, v);

    const scrollDistance = () =>
      clamp(-section.getBoundingClientRect().top, 0, section.offsetHeight - window.innerHeight);

    function update() {
      rafPending = false;

      targetScroll = scrollDistance();
      if (!initialized || reduce.matches) {
        smoothScroll = targetScroll;
        initialized = true;
      } else {
        smoothScroll = lerp(smoothScroll, targetScroll, 0.14);
      }
      if (Math.abs(smoothScroll - targetScroll) < 0.08) smoothScroll = targetScroll;

      mouseX = lerp(mouseX, targetMouseX, 0.12);
      mouseY = lerp(mouseY, targetMouseY, 0.12);

      const s = smoothScroll;
      const frame2 = segmentInOut(s, 560, 900, 1300, 1620);
      const frame3 = segmentInOut(s, 1760, 2140, 2540, 2700);
      const progress = clamp(s / 2700);
      const introExit = smoothstep(90, 650, s);
      const sightsEnter = Math.pow(smoothstep(2760, 3560, s), 1.55);
      const sightsControlsEnter = smoothstep(3360, 3660, s);
      const blurActive = clamp(frame2.active + frame3.active);
      const splitDrift = Math.pow(frame2.enter, 1.5);
      const backScale =
        0.76 + progress * 0.2 + frame2.enter * 0.18 + frame3.enter * 0.16;
      const sharedHeroY = progress * -74;
      const sharedHeroScale = progress * 0.23;

      /* The slider is a child of the zooming back-stack, so it inherits that
         scale. Counter-scaling by 1/backScale keeps the cards screen-true,
         and the parent top is solved backwards from where they should land. */
      const sightsScreenTop =
        Math.min(220, Math.max(112, window.innerHeight * 0.19)) - 50;
      const sightsParentTop =
        window.innerHeight - (window.innerHeight - sightsScreenTop) / backScale;

      const m = reduce.matches ? 0 : mouseX;
      const my = reduce.matches ? 0 : mouseY;
      set("--mx", m.toFixed(4));
      set("--my", my.toFixed(4));

      set("--back-opacity", String(1 - frame2.active * 0.06));
      set("--back-x", `${m * -12}px`);
      set("--back-y", `${my * -4}px`);
      set("--back-scale", String(backScale));
      set("--four-y", `${10 + progress * 10}vh`);
      set("--four-scale", String(0.78 + progress * 0.16));
      set("--bazaar-y", `${20 - progress * 8}vh`);
      set("--blur-px", `${blurActive * 14}px`);
      set("--back-brightness", String(1 - blurActive * 0.255));
      set("--bazaar-blur-px", `${frame2.active * 14}px`);
      set("--bazaar-brightness", String(1 - frame2.active * 0.255 - frame3.active * 0.06));
      set("--bazaar-saturation", String(1 + frame3.active * 0.18));
      set("--shade-opacity", "1");
      set("--shade-z", frame2.active > 0.02 ? "2" : "0");
      set("--shade-top-alpha", String(blurActive * 0.465));
      set("--shade-mid-alpha", String(blurActive * 0.42));
      set("--shade-bottom-alpha", String(blurActive * 0.51));

      set("--title-y", `${introExit * -210}px`);
      set("--title-scale", String(1 - introExit * 0.08));
      set("--title-opacity", String(1 - introExit));

      set("--bridge-x", `calc(-50% + ${m * 18}px)`);
      set("--bridge-y", `${my * 8 + sharedHeroY - frame2.exit * 760}px`);
      set("--bridge-bottom", `${5 - frame2.enter * 13}vh`);
      set("--bridge-width", `${67.2 + frame2.enter * 37.8}vw`);
      set("--bridge-scale", String(1.02 + sharedHeroScale + frame2.exit * 0.46));

      const splitY = `${my * 10 + sharedHeroY - splitDrift * 180}px`;
      const splitScale = String(1 + sharedHeroScale + frame2.enter * 0.74);
      set("--split-left-x", `calc(-50% + ${-splitDrift * 46}vw + ${m * 22}px)`);
      set("--split-left-y", splitY);
      set("--split-left-scale", splitScale);
      set("--split-right-x", `calc(-50% + ${splitDrift * 46}vw + ${m * 22}px)`);
      set("--split-right-y", splitY);
      set("--split-right-scale", splitScale);

      set("--frame2-opacity", String(frame2.active * (1 - frame3.enter)));
      set("--frame2-x", `calc(-50% + ${m * 10}px)`);
      set("--frame2-y", `calc(-50% + ${my * 8 - frame2.exit * 150}px)`);
      set("--frame2-scale", String(1.06 + frame2.enter * 0.08 + frame2.exit * 0.08));

      set("--intro-copy-y", `${introExit * 90}px`);
      set("--intro-copy-opacity", String(1 - introExit));
      set("--panel2-opacity", String(frame2.active * (1 - frame2.exit)));
      set("--panel2-y", `calc(-50% + ${-frame2.exit * 86 + (1 - frame2.enter) * 58}px)`);
      set("--panel3-opacity", String(frame3.active * (1 - frame3.exit)));
      set("--panel3-y", `calc(-50% + ${-frame3.exit * 86 + (1 - frame3.enter) * 58}px)`);

      set("--sights-opacity", String(sightsEnter));
      set("--sights-controls-opacity", String(sightsControlsEnter));
      controlsRef.current?.classList.toggle("is-ready", sightsControlsEnter > 0.98);
      set("--sights-visibility", sightsEnter > 0.01 ? "visible" : "hidden");
      set("--sights-y", "0px");
      set("--sights-enter-x", `${(1 - sightsEnter) * 420}vw`);
      set("--sights-scale", String(1 / backScale));
      set("--sights-top", `${sightsParentTop}px`);
      set("--sights-screen-top", `${sightsScreenTop}px`);

      if (
        Math.abs(smoothScroll - targetScroll) > 0.08 ||
        Math.abs(mouseX - targetMouseX) > 0.001 ||
        Math.abs(mouseY - targetMouseY) > 0.001
      ) {
        requestTick();
      }
    }

    function requestTick() {
      if (rafPending) return;
      rafPending = true;
      raf = requestAnimationFrame(update);
    }

    const onMove = (e) => {
      targetMouseX = e.clientX / window.innerWidth - 0.5;
      targetMouseY = e.clientY / window.innerHeight - 0.5;
      requestTick();
    };
    const onResize = () => {
      layoutSlider();
      requestTick();
    };

    window.addEventListener("scroll", requestTick, { passive: true });
    window.addEventListener("resize", onResize);
    window.addEventListener("pointermove", onMove, { passive: true });

    /* ── infinite slider ─────────────────────────────────────── */
    // Three identical sets of cards. Moving past either outer set jumps the
    // index back into the middle one with transitions off, so the loop has no
    // seam and no card is ever cloned at runtime.
    function layoutSlider() {
      const track = trackRef.current;
      if (!track) return;
      const card = track.querySelector(".atl-sight-card");
      if (!card) return;
      const gap = parseFloat(getComputedStyle(track).columnGap || "0");
      set("--sights-shift", `${-(card.offsetWidth + gap) * activeRef.current}px`);
      track.querySelectorAll(".atl-sight-card").forEach((el) => {
        el.classList.toggle("is-active", Number(el.dataset.sightIndex) === activeRef.current);
      });
    }
    function normalize() {
      const n = SIGHTS.length;
      const i = activeRef.current;
      const to = i >= n * 2 ? i - n : i < n ? i + n : null;
      if (to === null) return;
      const track = trackRef.current;
      track.classList.add("is-jumping");
      activeRef.current = to;
      layoutSlider();
      requestAnimationFrame(() =>
        requestAnimationFrame(() => track.classList.remove("is-jumping"))
      );
    }

    const track = trackRef.current;
    track?.addEventListener("transitionend", normalize);
    layoutSlider();
    requestTick();

    // exposed for the buttons and card clicks, which live outside this effect
    root._atlMove = (dir) => {
      activeRef.current += dir;
      layoutSlider();
    };
    root._atlSelect = (i) => {
      if (Number.isFinite(i)) activeRef.current = i;
      layoutSlider();
    };

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", requestTick);
      window.removeEventListener("resize", onResize);
      window.removeEventListener("pointermove", onMove);
      track?.removeEventListener("transitionend", normalize);
      delete root._atlMove;
      delete root._atlSelect;
    };
  }, []);

  const move = (d) => rootRef.current?._atlMove?.(d);
  const select = (i) => rootRef.current?._atlSelect?.(i);

  // three sets, flattened once at render — the DOM is static from then on
  const cards = [0, 1, 2].flatMap((setIndex) =>
    SIGHTS.map((s, i) => ({ ...s, index: setIndex * SIGHTS.length + i, key: `${setIndex}-${i}` }))
  );

  return (
    <div className="atl" ref={rootRef}>
      <main className="atl-shell">
        <section
          className="atl-cinema"
          id="atl-cinema"
          ref={sectionRef}
          aria-label="Mostar cinematic scroll story"
        >
          <div className="atl-stage">
            <div className="atl-world">
              <img className="atl-scene atl-sky" src={SCENE.sky} alt="" />

              <header className="atl-header" aria-label="Primary navigation">
                <a className="atl-logo" href="#atl-cinema">Bosnia and Herzegovina</a>
                <nav className="atl-nav" aria-label="Main menu">
                  {NAV.map(([label, href]) => (
                    <a key={label} href={href}>{label}</a>
                  ))}
                </nav>
                <button className="atl-lang" type="button" aria-label="Change language">
                  <span>EN</span>
                  <span aria-hidden="true">⌄</span>
                </button>
              </header>

              <div className="atl-back-stack">
                <img className="atl-scene atl-back atl-back-four" src={SCENE.four} alt="" />

                <section className="atl-sights" aria-label="Mostar sights slider">
                  <div className="atl-track" ref={trackRef}>
                    {cards.map((c) => (
                      <article
                        key={c.key}
                        className="atl-sight-card"
                        data-sight-index={c.index}
                        tabIndex={0}
                        role="button"
                        aria-label={`Open ${c.title} card`}
                        onClick={() => select(c.index)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter" || e.key === " ") {
                            e.preventDefault();
                            select(c.index);
                          }
                        }}
                      >
                        <span className="atl-kicker">{c.kicker}</span>
                        <img className="atl-pin" src={c.pin} alt="" />
                        <h3>{c.title}</h3>
                        <p>{c.body}</p>
                      </article>
                    ))}
                  </div>
                </section>

                <img className="atl-scene atl-back atl-back-bazaar" src={SCENE.bazaar} alt="" />
              </div>

              <div className="atl-controls" ref={controlsRef} aria-label="Slider controls">
                <button className="atl-navbtn" type="button" aria-label="Previous sight"
                  onClick={() => move(-1)}>←</button>
                <button className="atl-navbtn" type="button" aria-label="Next sight"
                  onClick={() => move(1)}>→</button>
              </div>

              <h1 className="atl-title">MOSTAR</h1>

              <img className="atl-scene atl-split atl-split-left" src={SCENE.splitLeft} alt="" />
              <img className="atl-scene atl-split atl-split-right" src={SCENE.splitRight} alt="" />
              <img className="atl-scene atl-bridge" src={SCENE.bridge} alt="" />
              <img className="atl-scene atl-frame2" src={SCENE.frameTwo} alt="" />

              <div className="atl-shade" />
            </div>

            <section className="atl-intro" aria-label="Mostar overview">
              <p>
                A stone arch, emerald water, and a compact old city made for slow mornings,
                late light, and one unforgettable crossing.
              </p>
              <div className="atl-tags" aria-label="Mostar highlights">
                <span>Old Bridge</span>
                <span>Neretva River</span>
                <span>UNESCO old city</span>
              </div>
            </section>

            <section className="atl-panel atl-panel-bridge" id="atl-bridge" aria-label="Old Bridge details">
              <h2>The bridge is the city's compass.</h2>
              <p>
                Stari Most links the banks of the Neretva and anchors a historic quarter shaped
                by Ottoman, Mediterranean, and European layers.
              </p>
              <dl className="atl-facts">
                <div><dt>1566</dt><dd>Original bridge completed</dd></div>
                <div><dt>2005</dt><dd>Old Bridge Area inscribed by UNESCO</dd></div>
              </dl>
            </section>

            <section className="atl-panel atl-panel-bazaar" id="atl-bazaar" aria-label="Old town details">
              <h2>The bazaar keeps Mostar close.</h2>
              <p>
                Stone lanes, mosque courtyards, copper stalls, and riverside coffee stay within
                a short walk of Stari Most.
              </p>
              <button className="atl-note" type="button" id="atl-routes">
                <span aria-hidden="true">↗</span>
                <span>Open old town notes</span>
              </button>
            </section>
          </div>
        </section>
      </main>
    </div>
  );
}
