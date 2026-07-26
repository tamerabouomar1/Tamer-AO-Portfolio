import { useEffect, useRef } from "react";
import { VIDEO_SRC } from "../siteData";

/**
 * Fixed, full-screen looping video background.
 *
 * iOS only allows autoplay when the element carries the real `muted`
 * ATTRIBUTE (plus playsinline). React sets `muted` as a property and never
 * writes the attribute, which makes iOS refuse to autoplay and paint its
 * native play button over the page — so the element is always rendered and
 * both are set imperatively via the ref instead.
 *
 * The source is attached only after the page has loaded, so this decorative
 * video never competes with real content for bandwidth on first paint. The
 * dark gradient backdrop stands in until it plays, and remains the graceful
 * fallback when the device blocks autoplay outright (e.g. iOS Low Power
 * Mode) — the video is decorative, so no controls are ever shown.
 */
export default function VideoBackground() {
  const videoRef = useRef(null);

  // Guarantee the autoplay-critical attributes exist in the DOM.
  const setNode = (node) => {
    videoRef.current = node;
    if (!node) return;
    node.muted = true;
    node.defaultMuted = true;
    node.setAttribute("muted", "");
    node.setAttribute("playsinline", "");
    node.setAttribute("webkit-playsinline", "");
  };

  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;

    const tryPlay = () => v.play().catch(() => {});

    const attach = () => {
      const run = () => {
        if (!v.src) {
          v.src = VIDEO_SRC;
          v.load();
        }
        tryPlay();
      };
      if ("requestIdleCallback" in window) {
        window.requestIdleCallback(run, { timeout: 2000 });
      } else {
        setTimeout(run, 600);
      }
    };

    if (document.readyState === "complete") attach();
    else window.addEventListener("load", attach, { once: true });

    // Retry when the clip is ready, when returning to the tab, and on the
    // first touch — covers browsers that defer autoplay until interaction.
    v.addEventListener("canplay", tryPlay);
    const onVisible = () => document.visibilityState === "visible" && tryPlay();
    document.addEventListener("visibilitychange", onVisible);
    const onFirstTouch = () => tryPlay();
    window.addEventListener("touchstart", onFirstTouch, { once: true, passive: true });
    window.addEventListener("click", onFirstTouch, { once: true });

    return () => {
      window.removeEventListener("load", attach);
      v.removeEventListener("canplay", tryPlay);
      document.removeEventListener("visibilitychange", onVisible);
      window.removeEventListener("touchstart", onFirstTouch);
      window.removeEventListener("click", onFirstTouch);
    };
  }, []);

  return (
    <div className="video-bg" aria-hidden="true">
      <video
        ref={setNode}
        className="video-bg__media"
        autoPlay
        loop
        muted
        playsInline
        controls={false}
        preload="none"
        disablePictureInPicture
        disableRemotePlayback
        tabIndex={-1}
      />
      <div className="video-bg__overlay" />
    </div>
  );
}
