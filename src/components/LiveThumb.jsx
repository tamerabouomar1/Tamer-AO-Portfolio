import { useEffect, useRef, useState } from "react";

/* A card thumbnail that is the actual website, not a picture of one.

   It renders the real site inside an iframe at desktop width (1440px) and
   scales that down to whatever the card is, so what you see is exactly what
   opens when you click — fonts, layout, animation and all.

   Two loading modes, because the two grids have different economics:

   - `eager` (the ready-made templates): the iframe builds as soon as the card
     nears the viewport. These share the parent's already-cached JS bundle, so
     each one really only pulls its own small template chunk.

   - `hover` (client work): the card leads with its static screenshot and only
     builds the iframe once someone shows interest. Those are whole separate
     websites with their own video and imagery — several megabytes each — and
     loading four of them on arrival would undo the point of a fast page.

   pointer-events stay off either way, so the card remains a single link to
   the full-size, genuinely interactive version. */

const FRAME_W = 1440;
const FRAME_H = 900;

export default function LiveThumb({ src, bg, label, poster, mode = "eager" }) {
  const box = useRef(null);
  const [armed, setArmed] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [scale, setScale] = useState(0.25);

  // Not every entry has a runnable copy (Sinar's export is missing its asset
  // folder). Without this guard those render a src-less iframe, which still
  // fires onLoad — fading the screenshot out to reveal nothing. Declared up
  // here because the effect below lists it as a dependency, and a dependency
  // array is evaluated during render.
  const canEmbed = Boolean(src);

  // Eager mode: arm as soon as the card is near the viewport.
  useEffect(() => {
    if (mode !== "eager" || !canEmbed) return;
    const el = box.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setArmed(true);
          io.disconnect();
        }
      },
      { rootMargin: "300px" }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [mode, canEmbed]);

  // Keep the 1440px frame scaled to whatever width the grid gives the card.
  useEffect(() => {
    const el = box.current;
    if (!el) return;
    const ro = new ResizeObserver(([e]) => {
      const w = e.contentRect.width;
      if (w) setScale(w / FRAME_W);
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const arm = () => canEmbed && setArmed(true);

  return (
    <div
      className="livethumb"
      ref={box}
      style={{ background: bg }}
      onMouseEnter={mode === "hover" ? arm : undefined}
      onTouchStart={mode === "hover" ? arm : undefined}
      onFocus={mode === "hover" ? arm : undefined}
    >
      {poster && (
        <img
          className={`livethumb__poster${loaded ? " is-hidden" : ""}`}
          src={poster}
          alt={label}
          loading="lazy"
          decoding="async"
        />
      )}

      {armed && canEmbed && (
        <iframe
          className={`livethumb__frame${loaded ? " is-loaded" : ""}`}
          src={src}
          title={`${label} preview`}
          onLoad={() => setLoaded(true)}
          loading="lazy"
          scrolling="no"
          tabIndex={-1}
          aria-hidden="true"
          style={{ width: FRAME_W, height: FRAME_H, transform: `scale(${scale})` }}
        />
      )}

      {!poster && !loaded && canEmbed && (
        <span className="livethumb__spinner" aria-hidden="true" />
      )}
    </div>
  );
}
