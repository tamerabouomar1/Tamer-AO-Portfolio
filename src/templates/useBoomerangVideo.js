import { useEffect, useRef, useState } from "react";

/* Boomerang background video.

   A <video> can't play backwards — `playbackRate = -1` isn't supported, and
   winding `currentTime` down by hand stutters badly because the browser has
   to seek to a keyframe and decode forward on every step. So the clip plays
   through once while every frame is copied to an offscreen canvas, and from
   then on those frames are drawn forward, then backward, forever. The result
   is a seamless in-and-out loop with no visible cut.

   MEMORY: this is the catch nobody mentions. Every frame is uncompressed
   RGBA — at the 960px the design called for that's ~2MB per frame, so a ten
   second clip would want well over half a gigabyte and take the tab with it.
   Capture is therefore bounded on both axes: 640px wide and 72 frames, about
   66MB. It's a background behind text, scaled and often blurred, so the lost
   detail is invisible while the crash very much wouldn't be.

   Returns refs to wire onto a <video> and a <canvas>, plus `ready` — false
   while the clip is still playing through and the live video should show,
   true once the canvas takes over. */

const MAX_WIDTH = 640;
const MAX_FRAMES = 72;
const FPS = 30;

export default function useBoomerangVideo() {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const framesRef = useRef([]);
  const [ready, setReady] = useState(false);

  // ── capture ──────────────────────────────────────────────────
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    let capturing = true;
    let lastTime = -1;
    let raf = 0;
    let vfc = 0;
    const frames = [];

    const finish = () => {
      if (!capturing) return;
      capturing = false;
      if (frames.length > 1) {
        framesRef.current = frames;
        setReady(true);
      }
    };

    const grab = () => {
      if (!capturing || video.readyState < 2) return;
      // Same presented frame twice — nothing new to store.
      if (video.currentTime === lastTime) return;
      lastTime = video.currentTime;

      const scale = Math.min(1, MAX_WIDTH / (video.videoWidth || MAX_WIDTH));
      const w = Math.round((video.videoWidth || MAX_WIDTH) * scale);
      const h = Math.round((video.videoHeight || 360) * scale);
      if (!w || !h) return;

      const c = document.createElement("canvas");
      c.width = w;
      c.height = h;
      c.getContext("2d").drawImage(video, 0, 0, w, h);
      frames.push(c);

      if (frames.length >= MAX_FRAMES) finish();
    };

    const loop = () => {
      grab();
      if (capturing) raf = requestAnimationFrame(loop);
    };

    // requestVideoFrameCallback fires once per *decoded* frame, so it never
    // duplicates or misses one the way rAF can. Not everywhere yet.
    const vLoop = () => {
      grab();
      if (capturing) vfc = video.requestVideoFrameCallback(vLoop);
    };

    const onLoaded = () => {
      video.play().catch(() => {});
      if (typeof video.requestVideoFrameCallback === "function") vLoop();
      else raf = requestAnimationFrame(loop);
    };

    video.addEventListener("loadedmetadata", onLoaded);
    video.addEventListener("ended", finish);
    if (video.readyState >= 1) onLoaded();

    return () => {
      capturing = false;
      video.removeEventListener("loadedmetadata", onLoaded);
      video.removeEventListener("ended", finish);
      if (raf) cancelAnimationFrame(raf);
      if (vfc && video.cancelVideoFrameCallback) video.cancelVideoFrameCallback(vfc);
    };
  }, []);

  // ── playback ─────────────────────────────────────────────────
  useEffect(() => {
    if (!ready) return;
    const canvas = canvasRef.current;
    const frames = framesRef.current;
    if (!canvas || frames.length < 2) return;

    canvas.width = frames[0].width;
    canvas.height = frames[0].height;
    const ctx = canvas.getContext("2d");

    let i = 0;
    let step = 1;
    let last = 0;
    let raf = 0;
    const interval = 1000 / FPS;

    const render = (now) => {
      raf = requestAnimationFrame(render);
      if (now - last < interval) return;
      last = now;

      ctx.drawImage(frames[i], 0, 0);
      i += step;
      // Turn around at both ends rather than wrapping — wrapping would jump
      // from the last frame back to the first, which is the cut this whole
      // technique exists to avoid.
      if (i >= frames.length - 1) {
        i = frames.length - 1;
        step = -1;
      } else if (i <= 0) {
        i = 0;
        step = 1;
      }
    };

    raf = requestAnimationFrame(render);
    return () => cancelAnimationFrame(raf);
  }, [ready]);

  return { videoRef, canvasRef, ready };
}
