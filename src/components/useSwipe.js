import { useRef } from "react";

/**
 * iOS-style swipe gestures for touch screens.
 * Returns touch handlers to spread onto an element:
 * swipe left/right -> onLeft/onRight (browse), swipe down -> onDown (dismiss).
 * Thresholds keep taps and diagonal scrolls from triggering navigation.
 */
export default function useSwipe({ onLeft, onRight, onDown }) {
  const start = useRef(null);
  return {
    onTouchStart(e) {
      const t = e.touches[0];
      start.current = { x: t.clientX, y: t.clientY };
    },
    onTouchEnd(e) {
      if (!start.current) return;
      const t = e.changedTouches[0];
      const dx = t.clientX - start.current.x;
      const dy = t.clientY - start.current.y;
      start.current = null;
      if (Math.abs(dx) >= 48 && Math.abs(dx) > 1.5 * Math.abs(dy)) {
        if (dx < 0) onLeft?.();
        else onRight?.();
      } else if (dy >= 80 && Math.abs(dy) > 1.5 * Math.abs(dx)) {
        onDown?.();
      }
    },
  };
}
