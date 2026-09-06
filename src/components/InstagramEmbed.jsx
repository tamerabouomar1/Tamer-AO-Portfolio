import { useState } from "react";
import ConsentEmbed from "./ConsentEmbed";

/* A real Instagram post, embedded live.

   Uses Instagram's own /embed endpoint in an iframe rather than their
   embed.js script. The script is heavier, loads on every page whether a post
   is on screen or not, and drops third-party tracking on visitors; the iframe
   is one request per post, sandboxed, and shows the same card — caption,
   likes, video with sound control — always reflecting the live post rather
   than a copy that goes stale.

   ── Why this no longer lazy-loads on scroll ──────────────────────────────
   It used to mount the iframe from an IntersectionObserver, 400px before the
   card reached the viewport. That was the right call for performance and the
   wrong one for privacy: scrolling past a post is not a decision to be
   announced to Meta, and by the time the observer fired, the visitor's IP had
   already reached Instagram and Instagram's cookies had already been set. The
   observer made it automatic; it did not make it consented.

   ConsentEmbed replaces it. Nothing is requested from Instagram until the
   visitor presses the button, which keeps every byte of the old lazy-load
   saving AND removes the site's only unconsented third-party call. See
   ConsentEmbed.jsx for why this is a facade rather than a cookie banner. */

export default function InstagramEmbed({ url, caption }) {
  const [loaded, setLoaded] = useState(false);

  // Accepts a plain post/reel link and normalises it to the embed form.
  const embedSrc = `${url.replace(/\/+$/, "")}/embed/captioned/`;

  return (
    <article className="card ig-card">
      <div className="ig-card__frame">
        <ConsentEmbed provider="Instagram" label="Instagram post" className="consent-embed--ig">
          {() => (
            <>
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
              {!loaded && <span className="livethumb__spinner" aria-hidden="true" />}
            </>
          )}
        </ConsentEmbed>
      </div>
      {caption && <p className="ig-card__caption">{caption}</p>}
    </article>
  );
}
