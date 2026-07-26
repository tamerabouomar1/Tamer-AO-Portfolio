import { useEffect, useRef, useState } from "react";
import { VIDEO_SRC } from "../siteData";

/* Phones never get the video. iOS paints its own start-playback button over
   any <video> that is not actively playing, and on phones that happens
   constantly: in-app browsers (the Instagram bio link opens in one) refuse
   autoplay, and Low Power Mode — which iOS turns on by itself around 20%
   battery — suspends playback. Instead of fighting it, small screens get an
   animated CSS gradient: real motion, no download, and no element that
   could ever show a play button. Desktop, where autoplay is reliable,
   keeps the video. */
const PHONE_QUERY = "(max-width: 760px), (pointer: coarse)";

export default function VideoBackground() {
  const holderRef = useRef(null);
  const [live, setLive] = useState(false);

  useEffect(() => {
    if (window.matchMedia(PHONE_QUERY).matches) return; // animated gradient only

    let video = null;
    let startTimer = null;
    let cancelled = false;

    const destroy = () => {
      if (startTimer) clearTimeout(startTimer);
      startTimer = null;
      if (video) {
        try {
          video.pause();
          video.removeAttribute("src");
          video.load();
        } catch {
          /* already torn down */
        }
        video.remove();
        video = null;
      }
      if (!cancelled) setLive(false);
    };

    const start = () => {
      if (cancelled) return;

      video = document.createElement("video");
      video.className = "video-bg__media";
      video.setAttribute("muted", "");
      video.setAttribute("playsinline", "");
      video.setAttribute("loop", "");
      video.setAttribute("preload", "auto");
      video.setAttribute("aria-hidden", "true");
      video.muted = true;
      video.defaultMuted = true;
      video.loop = true;
      video.controls = false;
      video.disablePictureInPicture = true;
      video.tabIndex = -1;

      // Adopt only once frames are genuinely advancing.
      video.addEventListener("playing", () => {
        if (cancelled || !video || !holderRef.current) return;
        if (startTimer) clearTimeout(startTimer);
        if (!video.parentNode) holderRef.current.appendChild(video);
        setLive(true);
      });
      // A background has no reason to sit paused or broken — bin it and
      // fall back to the gradient rather than risk any playback chrome.
      video.addEventListener("error", destroy);
      const onPause = () => {
        if (!video) return;
        video.play().catch(destroy);
      };
      video.addEventListener("pause", onPause);

      startTimer = setTimeout(() => {
        if (video && !video.parentNode) destroy();
      }, 6000);

      video.src = VIDEO_SRC;
      video.play().catch(() => {
        /* refused: the timer discards it */
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
      destroy();
    };
  }, []);

  return (
    <div className={"video-bg" + (live ? " is-live" : "")} aria-hidden="true">
      <div className="video-bg__anim" />
      <div className="video-bg__holder" ref={holderRef} />
      <div className="video-bg__overlay" />
    </div>
  );
}
