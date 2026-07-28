import { useEffect, useRef, useState } from "react";

/* A real Instagram post, embedded live.

   Uses Instagram's own /embed endpoint in an iframe rather than their
   embed.js script. The script is heavier, loads on every page whether a post
   is on screen or not, and drops third-party tracking on visitors; the iframe
   is one request per post, sandboxed, and shows the same card — caption,
   likes, video with sound control — always reflecting the live post rather
   than a copy that goes stale.

   Like the site previews, nothing loads until the post is near the viewport,
   so a page of reels costs nothing until it is actually looked at. */

export default function InstagramEmbed({ url, caption }) {
  const box = useRef(null);
  const [visible, setVisible] = useState(false);
  const [loaded, setLoaded] = useState(false);

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
      { rootMargin: "400px" }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  // Accepts a plain post/reel link and normalises it to the embed form.
  const embedSrc = `${url.replace(/\/+$/, "")}/embed/captioned/`;

  return (
    <article className="card ig-card" ref={box}>
      <div className="ig-card__frame">
        {visible && (
          <iframe
            src={embedSrc}
            title={caption || "Instagram post"}
            loading="lazy"
            scrolling="no"
            allow="encrypted-media; picture-in-picture; clipboard-write"
            allowFullScreen
            onLoad={() => setLoaded(true)}
            className={loaded ? "is-loaded" : ""}
          />
        )}
        {!loaded && <span className="livethumb__spinner" aria-hidden="true" />}
      </div>
      {caption && <p className="ig-card__caption">{caption}</p>}
    </article>
  );
}
