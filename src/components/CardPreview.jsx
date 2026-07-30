import { useEffect, useState } from "react";
import { LoadBar } from "./LoadBar";

/* The project grid's version of the live website previews.

   A project card used to be one flat cover image, so the only way to learn
   that "Contracts Design Company Profile" was fourteen pages — or which
   fourteen — was to open it. Hover a card and it leafs through the first few
   images in place, the way the Websites grid shows the real site running.

   Deliberately hover-only, one card at a time. Thirty-five cards all cycling
   at once is a wall of movement with nothing to look at; a card that changes
   *because you pointed at it* reads as a response. Everything you are not
   pointing at holds its cover, and the pointer leaving puts the card straight
   back to that cover.

   It is also the cheapest version: the extra frames are only fetched for cards
   someone actually shows interest in, so arriving on the page still costs one
   lazy image per card. */

// How many of a carousel's images the card leafs through. preloadImages.js
// warms exactly this many per project, so keep the two in step.
export const PREVIEW_MAX = 5;

// Short: the point is to feel like a response to the pointer, not a slideshow.
const HOLD_MS = 1150;

function prefersReducedMotion() {
  return (
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
}

export default function CardPreview({ images, name, playing = false }) {
  const [idx, setIdx] = useState(0);
  // Sticky: once a card has been hovered its reel stays mounted, so coming
  // back to it does not re-download anything.
  const [armed, setArmed] = useState(false);
  const [coverReady, setCoverReady] = useState(false);

  const reel = images.slice(0, PREVIEW_MAX);
  const canCycle = reel.length > 1 && !prefersReducedMotion();

  useEffect(() => {
    if (!playing || !canCycle) {
      setIdx(0); // pointer gone -> back to the cover
      return;
    }
    setArmed(true);
    const t = setInterval(() => setIdx((n) => (n + 1) % reel.length), HOLD_MS);
    return () => clearInterval(t);
  }, [playing, canCycle, reel.length]);

  return (
    <div className="cardpreview">
      {reel.map((src, n) => {
        if (n > 0 && !armed) return null;
        return (
          <img
            key={src}
            className={"cardpreview__slide" + (n === idx ? " is-on" : "")}
            src={src}
            /* The cover carries the name; the rest are the same project seen
               again, so naming each one just makes a screen reader repeat
               itself. */
            alt={n === 0 ? name : ""}
            aria-hidden={n > 0 ? "true" : undefined}
            loading="lazy"
            decoding="async"
            onLoad={n === 0 ? () => setCoverReady(true) : undefined}
            onError={n === 0 ? () => setCoverReady(true) : undefined}
          />
        );
      })}

      {!coverReady && <LoadBar label={`Loading ${name}`} />}

      {/* Only while it is actually leafing, so a still card shows no controls
          it does not have. */}
      {playing && canCycle && (
        <span className="cardpreview__pips" aria-hidden="true">
          {reel.map((src, n) => (
            <span key={src} className={"cardpreview__pip" + (n === idx ? " is-on" : "")} />
          ))}
        </span>
      )}
    </div>
  );
}
