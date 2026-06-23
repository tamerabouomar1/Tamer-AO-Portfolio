import { VIDEO_SRC } from "../siteData";

/**
 * Fixed, full-screen looping video background.
 * autoplay + loop + muted + playsInline so it plays on every browser/mobile.
 * object-fit: cover guarantees it never distorts at any viewport size.
 * A dark overlay sits on top for foreground legibility.
 */
export default function VideoBackground() {
  return (
    <div className="video-bg" aria-hidden="true">
      <video
        className="video-bg__media"
        src={VIDEO_SRC}
        autoPlay
        loop
        muted
        playsInline
        preload="auto"
        disablePictureInPicture
      />
      <div className="video-bg__overlay" />
    </div>
  );
}
