import { useEffect, useRef, useState } from "react";

/* A card thumbnail that is the actual site, not a drawing of it.

   It renders the real /templates/:slug route inside an iframe at desktop
   width (1440px) and scales that down to whatever the card is, so what you
   see is exactly what opens when you click — fonts, layout, imagery and all.
   Earlier this slot held a hand-drawn CSS approximation, which was cheap but
   didn't actually show the website.

   Three things keep it from being expensive:
   - the iframe is only created once the card scrolls into view, and never
     torn down afterwards;
   - the iframes share the parent's already-cached JS/CSS bundle, so each one
     really only fetches its own small template chunk;
   - pointer-events are off, so the whole card stays a single link to the
     full-size, genuinely interactive preview. */

const FRAME_W = 1440;
const FRAME_H = 900;

export default function LiveThumb({ slug, bg, label }) {
  const box = useRef(null);
  const [visible, setVisible] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [scale, setScale] = useState(0.25);

  // Only build the iframe once the card is near the viewport.
  useEffect(() => {
    const el = box.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setVisible(true);
          io.disconnect();
        }
      },
      { rootMargin: "300px" }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  // Keep the 1440px frame scaled to the card, whatever the grid gives it.
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

  return (
    <div className="livethumb" ref={box} style={{ background: bg }}>
      {visible && (
        <iframe
          className={`livethumb__frame${loaded ? " is-loaded" : ""}`}
          src={`/templates/${slug}`}
          title={`${label} preview`}
          onLoad={() => setLoaded(true)}
          loading="lazy"
          scrolling="no"
          tabIndex={-1}
          aria-hidden="true"
          style={{
            width: FRAME_W,
            height: FRAME_H,
            transform: `scale(${scale})`,
          }}
        />
      )}
      {!loaded && <span className="livethumb__spinner" aria-hidden="true" />}
    </div>
  );
}
