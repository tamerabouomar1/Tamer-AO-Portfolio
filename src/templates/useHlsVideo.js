import { useEffect } from "react";

/* Play an HLS (.m3u8) stream in a plain <video>.
 *
 * WHICH PATH, AND WHY IT IS NOT canPlayType:
 * Chromium answers `canPlayType("application/vnd.apple.mpegurl")` with
 * "maybe" — a truthy string — while being completely unable to play HLS. So
 * branching on canPlayType sends every Chrome, Edge and Electron user down
 * the native path, where the stream buffers to readyState 4 and then sits
 * there forever at currentTime 0. It looks like a still image.
 *
 * Media Source Extensions is the honest signal: if MSE exists, hls.js can
 * drive playback, so use it. Only where MSE is absent — iOS Safari, where
 * HLS is native and the library would be dead weight — do we hand the URL
 * straight to the element.
 *
 * hls.js is pulled in with a dynamic import, so it stays in its own chunk and
 * is only fetched when someone actually opens one of the two templates that
 * stream from Mux, never by the portfolio itself.
 *
 * Starting playback is the fiddly part. The `autoPlay` attribute only reliably
 * fires when the source is present in the markup; here the source is attached
 * after mount, so the browser has usually already made its autoplay decision
 * by the time there is anything to play. Calling play() straight after setting
 * .src does not work either — readyState is still 0, and the returned promise
 * rejects.
 *
 * So playback is attempted on every event that means "there is now something
 * to show", and again immediately in case the media was ready before the
 * listeners were attached. muted is forced on in JS as well as in the markup,
 * because an unmuted autoplay is refused outright.
 */
export default function useHlsVideo(ref, src) {
  useEffect(() => {
    const video = ref.current;
    if (!video || !src) return;

    let hls;
    let cancelled = false;

    // Autoplay is only permitted for muted media; the attribute alone is not
    // enough once a source is attached programmatically.
    video.muted = true;
    video.playsInline = true;

    const tryPlay = () => {
      if (cancelled) return;
      const p = video.play();
      if (p && typeof p.catch === "function") p.catch(() => {});
    };

    const EVENTS = ["loadedmetadata", "loadeddata", "canplay"];
    EVENTS.forEach((e) => video.addEventListener(e, tryPlay));

    const playNatively = () => {
      video.src = src;
      video.load();
      if (video.readyState >= 2) tryPlay();
    };

    const hasMSE =
      typeof window !== "undefined" &&
      (typeof window.MediaSource !== "undefined" ||
        typeof window.ManagedMediaSource !== "undefined");

    if (hasMSE) {
      import("hls.js")
        .then(({ default: Hls }) => {
          if (cancelled || !video.isConnected) return;
          // Older WebKit exposes MSE but hls.js still declines it; that is the
          // one case where native is the remaining option.
          if (!Hls.isSupported()) return playNatively();
          hls = new Hls({ enableWorker: false });
          hls.loadSource(src);
          hls.attachMedia(video);
          hls.on(Hls.Events.MANIFEST_PARSED, tryPlay);
        })
        .catch(() => {
          if (!cancelled) playNatively();
        });
    } else {
      playNatively();
    }

    return () => {
      cancelled = true;
      EVENTS.forEach((e) => video.removeEventListener(e, tryPlay));
      if (hls) hls.destroy();
    };
  }, [ref, src]);
}
