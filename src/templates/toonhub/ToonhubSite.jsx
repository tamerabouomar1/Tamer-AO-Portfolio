import { useCallback, useEffect, useRef, useState } from "react";
import useTemplateFont from "../useTemplateFont";
import "./toonhub.css";

/* ── Drop — Product Showcase ───────────────────────────────────
   A four-item carousel where the entire page palette morphs with the piece
   on stage. Everything (colour, position, scale, blur) crossfades together
   over one 650ms curve, which is what sells the effect.

   Demo artwork stays as shipped with the template. */

const BASE =
  "https://fifth-gentle-45902158.figma.site/_components/v2/4de492f6d9cf8244ad5293233e5c6f52407d42fc";

const IMAGES = [
  { src: `${BASE}/1.02464a56.png`, bg: "#F4845F", panel: "#F79B7F" },
  { src: `${BASE}/2.b977faab.png`, bg: "#6BBF7A", panel: "#85CC92" },
  { src: `${BASE}/3.4df853b4.png`, bg: "#E882B4", panel: "#ED9DC4" },
  { src: `${BASE}/4.4457fbce.png`, bg: "#6EB5FF", panel: "#8DC4FF" },
];

const DURATION = 650;

/* Inline SVG noise — a data URI costs no request and no decode budget. */
const GRAIN =
  "data:image/svg+xml;utf8," +
  encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200"><filter id="n"><feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="4"/></filter><rect width="200" height="200" filter="url(#n)" opacity="0.08"/></svg>`
  );

function Arrow({ dir }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.25" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {dir === "left" ? (
        <>
          <path d="M19 12H5" />
          <path d="m12 19-7-7 7-7" />
        </>
      ) : (
        <>
          <path d="M5 12h14" />
          <path d="m12 5 7 7-7 7" />
        </>
      )}
    </svg>
  );
}

export default function ToonhubSite() {
  useTemplateFont(
    "https://fonts.googleapis.com/css2?family=Anton&family=Inter:wght@400;500;600;700&display=swap"
  );

  const [activeIndex, setActiveIndex] = useState(0);
  const [isMobile, setIsMobile] = useState(
    () => typeof window !== "undefined" && window.innerWidth < 640
  );
  const animating = useRef(false);
  const timer = useRef(0);

  useEffect(() => {
    // Preload every figurine so a rotation never shows a blank slot.
    IMAGES.forEach(({ src }) => {
      const img = new Image();
      img.src = src;
    });
  }, []);

  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth < 640);
    window.addEventListener("resize", onResize);
    return () => {
      window.removeEventListener("resize", onResize);
      clearTimeout(timer.current);
    };
  }, []);

  const navigate = useCallback((dir) => {
    if (animating.current) return;
    animating.current = true;
    setActiveIndex((prev) => (dir === "next" ? (prev + 1) % 4 : (prev + 3) % 4));
    timer.current = setTimeout(() => {
      animating.current = false;
    }, DURATION);
  }, []);

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "ArrowLeft") navigate("prev");
      if (e.key === "ArrowRight") navigate("next");
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [navigate]);

  const roleOf = (i) => {
    if (i === activeIndex) return "center";
    if (i === (activeIndex + 3) % 4) return "left";
    if (i === (activeIndex + 1) % 4) return "right";
    return "back";
  };

  const styleFor = (role) => {
    switch (role) {
      case "center":
        return {
          left: "50%",
          bottom: isMobile ? "22%" : 0,
          height: isMobile ? "60%" : "92%",
          transform: `translateX(-50%) scale(${isMobile ? 1.25 : 1.68})`,
          filter: "none",
          opacity: 1,
          zIndex: 20,
        };
      case "left":
      case "right":
        return {
          left: role === "left" ? (isMobile ? "20%" : "30%") : isMobile ? "80%" : "70%",
          bottom: isMobile ? "32%" : "12%",
          height: isMobile ? "16%" : "28%",
          transform: "translateX(-50%) scale(1)",
          filter: "blur(2px)",
          opacity: 0.85,
          zIndex: 10,
        };
      default:
        return {
          left: "50%",
          bottom: isMobile ? "32%" : "12%",
          height: isMobile ? "13%" : "22%",
          transform: "translateX(-50%) scale(1)",
          filter: "blur(4px)",
          opacity: 1,
          zIndex: 5,
        };
    }
  };

  return (
    <div
      className="th"
      style={{ backgroundColor: IMAGES[activeIndex].bg }}
    >
      <div className="th-stage">
        <div className="th-grain" style={{ backgroundImage: `url("${GRAIN}")` }} />

        <div className="th-ghost" aria-hidden="true">
          3D SHAPE
        </div>

        <span className="th-brand">TAMER AO</span>

        <div className="th-carousel">
          {IMAGES.map((item, i) => (
            <div key={item.src} className="th-item" style={styleFor(roleOf(i))}>
              <img src={item.src} alt="" draggable={false} />
            </div>
          ))}
        </div>

        <div className="th-bl">
          <p className="th-bl__title">TAMER AO FIGURINES</p>
          <p className="th-bl__copy">
            The artwork is stunning, shipped fully prepared. The finish is a vision, the 3D
            craft is flawless. Many thanks! Wishing you the win. Order now.
          </p>
          <div className="th-bl__nav">
            <button onClick={() => navigate("prev")} aria-label="Previous figurine">
              <Arrow dir="left" />
            </button>
            <button onClick={() => navigate("next")} aria-label="Next figurine">
              <Arrow dir="right" />
            </button>
          </div>
        </div>

        <a className="th-discover" href="#discover">
          Discover it
          <Arrow dir="right" />
        </a>
      </div>
    </div>
  );
}
