import { useEffect, useRef, useState } from "react";
import { VIDEO_SRC } from "../siteData";

/**
 * Fixed, full-screen looping video background.
 * autoplay + loop + muted + playsInline so it plays on every browser/mobile.
 * object-fit: cover guarantees it never distorts at any viewport size.
 * A dark overlay sits on top for foreground legibility.
 *
 * The source is attached only after the page has loaded, so this decorative
 * video never competes with the real content for bandwidth on first paint.
 * A CSS gradient stands in until it starts playing.
 */
export default function VideoBackground() {
  const [src, setSrc] = useState(null);
  const videoRef = useRef(null);

  useEffect(() => {
    const attach = () => {
      const run = () => setSrc(VIDEO_SRC);
      if ("requestIdleCallback" in window) {
        window.requestIdleCallback(run, { timeout: 2000 });
      } else {
        setTimeout(run, 600);
      }
    };
    if (document.readyState === "complete") attach();
    else {
      window.addEventListener("load", attach, { once: true });
      return () => window.removeEventListener("load", attach);
    }
  }, []);

  // autoplay attribute alone can be missed when src is set late
  useEffect(() => {
    if (src && videoRef.current) videoRef.current.play().catch(() => {});
  }, [src]);

  return (
    <div className="video-bg" aria-hidden="true">
      {src && (
        <video
          ref={videoRef}
          className="video-bg__media"
          src={src}
          autoPlay
          loop
          muted
          playsInline
          preload="auto"
          disablePictureInPicture
        />
      )}
      <div className="video-bg__overlay" />
    </div>
  );
}
