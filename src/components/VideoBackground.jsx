import { useEffect, useRef, useState } from "react";
import { VIDEO_SRC } from "../siteData";

/**
 * Fixed, full-screen looping video background.
 *
 * A decorative background must never show playback UI. iOS paints its own
 * start-playback button over any <video> it declines to autoplay (Low Power
 * Mode, data saver, a source that fails to load), and CSS alone does not
 * reliably suppress it. So the element is proven before it is trusted:
 *
 *   1. It is created detached, off-document, with the autoplay-critical
 *      `muted` / `playsinline` ATTRIBUTES set (React sets muted only as a
 *      property, which iOS ignores when deciding autoplay).
 *   2. It is only inserted into the page once it is genuinely playing.
 *   3. If it has not started within a few seconds, it is discarded.
 *
 * No element in the document means no play button can ever be drawn. When
 * playback does not happen the dark gradient backdrop simply remains, which
 * is the intended look anyway.
 */
export default function VideoBackground() {
  const holderRef = useRef(null);
  const [live, setLive] = useState(false);

  useEffect(() => {
    let video = null;
    let timeoutId = null;
    let cancelled = false;

    const cleanup = () => {
      if (timeoutId) clearTimeout(timeoutId);
      if (video) {
        video.pause?.();
        video.removeAttribute("src");
        video.load?.();
        video.remove();
        video = null;
      }
    };

    const start = () => {
      if (cancelled) return;

      video = document.createElement("video");
      video.className = "video-bg__media";
      // attributes, not just properties — iOS checks these
      video.setAttribute("muted", "");
      video.setAttribute("playsinline", "");
      video.setAttribute("webkit-playsinline", "");
      video.setAttribute("loop", "");
      video.setAttribute("preload", "auto");
      video.setAttribute("aria-hidden", "true");
      video.muted = true;
      video.defaultMuted = true;
      video.loop = true;
      video.controls = false;
      video.disablePictureInPicture = true;
      video.tabIndex = -1;

      // Only adopt it once frames are actually advancing.
      const onPlaying = () => {
        if (cancelled || !video || !holderRef.current) return;
        if (timeoutId) clearTimeout(timeoutId);
        holderRef.current.appendChild(video);
        setLive(true);
      };
      video.addEventListener("playing", onPlaying, { once: true });

      // Never adopt a stalled or blocked video — bin it and keep the gradient.
      timeoutId = setTimeout(() => {
        if (!video || video.parentNode) return;
        cleanup();
      }, 6000);

      video.src = VIDEO_SRC;
      video.play().catch(() => {
        /* autoplay refused: the timeout discards it */
      });
    };

    const schedule = () => {
      if ("requestIdleCallback" in window) {
        window.requestIdleCallback(start, { timeout: 2000 });
      } else {
        setTimeout(start, 600);
      }
    };

    if (document.readyState === "complete") schedule();
    else window.addEventListener("load", schedule, { once: true });

    return () => {
      cancelled = true;
      window.removeEventListener("load", schedule);
      cleanup();
    };
  }, []);

  return (
    <div className={"video-bg" + (live ? " is-live" : "")} aria-hidden="true">
      <div className="video-bg__holder" ref={holderRef} />
      <div className="video-bg__overlay" />
    </div>
  );
}
