import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import Page, { container, cardIn } from "../components/Page";
import SplitHeading from "../components/SplitHeading";
import useSwipe from "../components/useSwipe";
import InstagramEmbed from "../components/InstagramEmbed";
import {
  CONTACT,
  INSTAGRAM_POSTS,
  INSTAGRAM_REELS,
  LOGO_MOTIONS,
  MOTION_REELS,
  SOCIAL_POSTS,
  VIDEO_EDITS,
  posterFor,
} from "../siteData";


// 2346 → "2.3K", 123694 → "124K" — the way Instagram itself shortens them.
// One decimal below 100K, none above, and never a dangling ".0".
const compact = (n) => {
  const trim = (v) => `${v}`.replace(/\.0$/, "");
  if (n >= 1_000_000) return `${trim((n / 1_000_000).toFixed(1))}M`;
  if (n >= 100_000) return `${Math.round(n / 1_000)}K`;
  if (n >= 1_000) return `${trim((n / 1_000).toFixed(1))}K`;
  return `${n}`;
};

/* How old a post is, but only while "recent" is still the point.
 *
 * A big number with no date behind it reads as history. On a post that is days
 * old the same number reads as a rate, which is the more useful claim: 23K in
 * two days beats 30K in four months. Past a month that framing stops being
 * true, so this returns null and the card simply drops the chip — no stale
 * "posted 7 months ago" left sitting on the page. */
const freshness = (iso) => {
  if (!iso) return null;
  const days = Math.floor((Date.now() - new Date(`${iso}T12:00:00Z`)) / 86_400_000);
  if (days < 0 || days > 30) return null;
  if (days <= 1) return "New";
  if (days < 7) return `${days} days old`;
  const weeks = Math.floor(days / 7);
  return weeks === 1 ? "1 week old" : `${weeks} weeks old`;
};

/* A reel that plays only while it is on screen. Twelve autoplaying clips on one
   page would all start downloading at once on a phone; with preload="none" and
   an IntersectionObserver each one loads and runs only when it is scrolled to,
   and pauses again when it leaves. Muted + playsInline is what lets iOS start it
   without a tap. */
function LoopVideo({ src, label }) {
  const ref = useRef(null);
  useEffect(() => {
    const v = ref.current;
    if (!v || typeof IntersectionObserver === "undefined") return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) v.play().catch(() => {});
        else v.pause();
      },
      { threshold: 0.35 },
    );
    io.observe(v);
    return () => io.disconnect();
  }, []);
  return <video ref={ref} src={src} poster={posterFor(src)} muted loop playsInline preload="none" aria-label={label} />;
}

export default function Media() {
  const [postIdx, setPostIdx] = useState(null); // social-post index or null
  const [reelIdx, setReelIdx] = useState(null); // motion-reel index or null

  const nextPost = () => setPostIdx((i) => (i + 1) % SOCIAL_POSTS.images.length);
  const prevPost = () => setPostIdx((i) => (i - 1 + SOCIAL_POSTS.images.length) % SOCIAL_POSTS.images.length);

  // touch: swipe left/right through posts, swipe down to close
  const postSwipe = useSwipe({
    onLeft: nextPost,
    onRight: prevPost,
    onDown: () => setPostIdx(null),
  });

  const nextReel = () => setReelIdx((i) => (i + 1) % MOTION_REELS.length);
  const prevReel = () => setReelIdx((i) => (i - 1 + MOTION_REELS.length) % MOTION_REELS.length);
  const reelSwipe = useSwipe({
    onLeft: nextReel,
    onRight: prevReel,
    onDown: () => setReelIdx(null),
  });

  useEffect(() => {
    if (reelIdx === null) return;
    const onKey = (e) => {
      if (e.key === "Escape") setReelIdx(null);
      else if (e.key === "ArrowRight") nextReel();
      else if (e.key === "ArrowLeft") prevReel();
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [reelIdx]);

  useEffect(() => {
    if (postIdx === null) return;
    const onKey = (e) => {
      if (e.key === "Escape") setPostIdx(null);
      else if (e.key === "ArrowRight") nextPost();
      else if (e.key === "ArrowLeft") prevPost();
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [postIdx]);

  return (
    <Page>
      <header className="topbar">
        <div>
          <SplitHeading>Motion Design &amp; Video Editing</SplitHeading>
          <p className="topbar__sub">Motion, edits &amp; social</p>
        </div>
        <Link className="link" to="/work-with-me">
          Work with me <span className="plus">+</span>
        </Link>
      </header>

      <section className="proj-section" style={{ marginTop: 0 }}>
        <h2 className="section-title">Motion Design</h2>
        <p className="card-body" style={{ maxWidth: "70ch", marginBottom: 14 }}>
          Design reels made for Instagram, with type, colour and shape in motion and each one
          scored with its own original music. Tap any of them to watch it with sound.
        </p>
        {MOTION_REELS.map((r, i) =>
          r.featured ? (
            <motion.article className="card reel-feature" key={r.src} variants={cardIn} initial="hidden" animate="show">
              <button className="reel-card__frame reel-card__play reel-feature__frame" onClick={() => setReelIdx(i)} aria-label={`Play ${r.title} with sound`}>
                <LoopVideo src={r.src} label={r.title} />
                <span className="reel-card__sound" aria-hidden="true">
                  <svg viewBox="0 0 24 24">
                    <path d="M4 9.5h3.2L12 5.5v13l-4.8-4H4z" />
                    <path d="M15.5 9a4.2 4.2 0 0 1 0 6M18.2 6.6a7.6 7.6 0 0 1 0 10.8" />
                  </svg>
                </span>
              </button>
              <div className="reel-feature__body">
                <span className="reel-feature__tag">{r.tag}</span>
                <h3 className="reel-feature__title">{r.title}</h3>
                <p className="card-body">{r.desc}</p>
                <ul className="reel-feature__points">
                  {r.points.map((p) => (
                    <li key={p}>{p}</li>
                  ))}
                </ul>
                <div className="reel-feature__actions">
                  <button className="btn-book reel-feature__watch" onClick={() => setReelIdx(i)}>
                    Watch with sound
                  </button>
                  <Link className="link" to={r.cta.to}>
                    {r.cta.label} <span className="plus">+</span>
                  </Link>
                </div>
              </div>
            </motion.article>
          ) : null,
        )}
        <motion.div className="reel-grid" variants={container} initial="hidden" animate="show">
          {MOTION_REELS.map((r, i) => r.featured ? null : (
            <motion.article className="card reel-card" key={r.src} variants={cardIn}>
              <button className="reel-card__frame reel-card__play" onClick={() => setReelIdx(i)} aria-label={`Play ${r.title} with sound`}>
                <LoopVideo src={r.src} label={r.title} />
                <span className="reel-card__sound" aria-hidden="true">
                  <svg viewBox="0 0 24 24">
                    <path d="M4 9.5h3.2L12 5.5v13l-4.8-4H4z" />
                    <path d="M15.5 9a4.2 4.2 0 0 1 0 6M18.2 6.6a7.6 7.6 0 0 1 0 10.8" />
                  </svg>
                </span>
              </button>
              <div className="reel-card__body">
                <h3 className="web-card__title">{r.title}</h3>
                <p className="card-body">{r.desc}</p>
              </div>
            </motion.article>
          ))}
        </motion.div>
      </section>

      <section className="proj-section">
        <h2 className="section-title">Logo Motion</h2>
        <motion.div className="motion-grid" variants={container} initial="hidden" animate="show">
          {LOGO_MOTIONS.map((m) => (
            <motion.article className="card motion-card" key={m.src} variants={cardIn}>
              <video
                src={m.src}
                poster={posterFor(m.src)}
                autoPlay
                loop
                muted
                playsInline
                preload="metadata"
                style={{ objectFit: m.fit || "contain", transform: m.scale ? `scale(${m.scale})` : undefined }}
              />
              <div className="motion-card__label">{m.title}</div>
            </motion.article>
          ))}
        </motion.div>
      </section>

      <section className="proj-section">
        <h2 className="section-title">Video Edits</h2>
        <motion.div className="video-grid" variants={container} initial="hidden" animate="show">
          {VIDEO_EDITS.map((v) => (
            <motion.article className="card video-card" key={v.src} variants={cardIn}>
              <video src={v.src} poster={posterFor(v.src)} controls preload="metadata" playsInline />
              <div className="web-card__body">
                <h3 className="web-card__title">{v.title}</h3>
                <p className="card-body">{v.desc}</p>
              </div>
            </motion.article>
          ))}
        </motion.div>
      </section>

      <section className="proj-section">
        <h2 className="section-title">Instagram Posts</h2>
        <p className="card-body" style={{ maxWidth: "70ch", marginBottom: 14 }}>
          Six posts, <strong style={{ color: "#fff" }}>618,000 views and 40,000 likes</strong>. The
          newest did <strong style={{ color: "#fff" }}>23,400 views in its first two days</strong>.
          Shot, cut and captioned by me. The counts are from Instagram, unedited.
        </p>
        <motion.div className="reel-grid" variants={container} initial="hidden" animate="show">
          {INSTAGRAM_REELS.map((r) => (
            <motion.article className="card reel-card" key={r.src} variants={cardIn}>
              <a className="reel-card__frame" href={r.url} target="_blank" rel="noreferrer" aria-label={`${r.title} on Instagram`}>
                <video src={r.src} poster={posterFor(r.src)} autoPlay loop muted playsInline preload="metadata" />
              </a>
              <div className="reel-card__body">
                <div className="reel-card__head">
                  <h3 className="web-card__title">{r.title}</h3>
                  {freshness(r.posted) && <span className="reel-fresh">{freshness(r.posted)}</span>}
                </div>
                <p className="card-body">{r.caption}</p>
                {(r.views != null || r.likes != null || r.comments != null) && (
                  <ul className="reel-stats">
                    {r.views != null && (
                      <li className="reel-stat">
                        <svg viewBox="0 0 24 24" aria-hidden="true">
                          <path d="M1.5 12S5.5 5 12 5s10.5 7 10.5 7-4 7-10.5 7S1.5 12 1.5 12Z" />
                          <circle cx="12" cy="12" r="3.2" />
                        </svg>
                        <b>{compact(r.views)}</b> views
                      </li>
                    )}
                    {r.likes != null && (
                      <li className="reel-stat">
                        <svg viewBox="0 0 24 24" aria-hidden="true">
                          <path d="M12 20s-7.5-4.6-7.5-9.6a4.4 4.4 0 0 1 7.5-3.1 4.4 4.4 0 0 1 7.5 3.1c0 5-7.5 9.6-7.5 9.6Z" />
                        </svg>
                        <b>{compact(r.likes)}</b> likes
                      </li>
                    )}
                    {r.comments != null && (
                      <li className="reel-stat">
                        <svg viewBox="0 0 24 24" aria-hidden="true">
                          <path d="M20.5 11.5a7.6 7.6 0 0 1-10.9 6.9L4.5 19.5l1.2-4.6a7.6 7.6 0 1 1 14.8-3.4Z" />
                        </svg>
                        <b>{compact(r.comments)}</b> comments
                      </li>
                    )}
                  </ul>
                )}
              </div>
            </motion.article>
          ))}
        </motion.div>
      </section>

      <section className="proj-section">
        <h2 className="section-title">Social Media</h2>
        <p className="card-body" style={{ maxWidth: "70ch", marginBottom: 14 }}>{SOCIAL_POSTS.desc}</p>
        <motion.div className="post-grid" variants={container} initial="hidden" animate="show">
          {SOCIAL_POSTS.images.map((src, i) => (
            <motion.button
              className="card post-card"
              key={src}
              variants={cardIn}
              onClick={() => setPostIdx(i)}
              aria-label={`Open post ${i + 1}`}
            >
              <img src={src} alt={`${SOCIAL_POSTS.name} post ${i + 1}`} loading="lazy" />
            </motion.button>
          ))}
        </motion.div>
      </section>

      {INSTAGRAM_POSTS.length > 0 && (
        <section className="proj-section">
          <h2 className="section-title">Reels</h2>
          <motion.div
            className="ig-grid"
            variants={container}
            initial="hidden"
            animate="show"
          >
            {INSTAGRAM_POSTS.map((p) => (
              <motion.div key={p.url} variants={cardIn}>
                <InstagramEmbed url={p.url} caption={p.caption} />
              </motion.div>
            ))}
          </motion.div>
        </section>
      )}

      <section className="proj-section">
        <h2 className="section-title">On Instagram</h2>
        <motion.div
          className="card cta"
          variants={cardIn}
          initial="hidden"
          animate="show"
          style={{ minHeight: 0 }}
        >
          {/* The number here has to survive somebody opening the profile in
              another tab, so it is the all-time total across the account
              rather than a monthly rate. */}
          <div className="media-ig">
            <div className="media-ig__big">
              <div className="stat-num">855K+</div>
              <div className="stat-label">views on my own account</div>
            </div>
            <div className="media-ig__copy">
              <p className="card-body">
                Short-form is where most of my motion work lives. My own reels have done
                <strong style={{ color: "#fff" }}> over 855,000 views</strong>, with a best month of
                415,000 and a best post at 219,000. Same hooks, same editing and same posting rhythm
                I use for brand promos, fitness content, logo animations and event recaps.
              </p>
              <a
                className="link"
                href={CONTACT.instagram}
                target="_blank"
                rel="noreferrer"
                style={{ marginTop: 14 }}
              >
                Watch on Instagram <span className="plus">+</span>
              </a>
            </div>
          </div>
        </motion.div>
      </section>

      <AnimatePresence>
        {reelIdx !== null && (
          <motion.div
            className="lightbox"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setReelIdx(null)}
          >
            <motion.div
              className="reellb"
              initial={{ scale: 0.96, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.96, opacity: 0 }}
              transition={{ type: "spring", stiffness: 260, damping: 26 }}
              onClick={(e) => e.stopPropagation()}
              {...reelSwipe}
            >
              <button className="lightbox__close" onClick={() => setReelIdx(null)} aria-label="Close">
                ×
              </button>
              {/* keyed so switching reels starts the new one from the top */}
              <video
                key={MOTION_REELS[reelIdx].src}
                src={MOTION_REELS[reelIdx].src}
                poster={posterFor(MOTION_REELS[reelIdx].src)}
                controls
                autoPlay
                playsInline
                aria-label={MOTION_REELS[reelIdx].title}
              />
              <button className="lb-nav lb-nav--prev" onClick={prevReel} aria-label="Previous reel">
                ‹
              </button>
              <button className="lb-nav lb-nav--next" onClick={nextReel} aria-label="Next reel">
                ›
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {postIdx !== null && (
          <motion.div
            className="lightbox"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setPostIdx(null)}
          >
            <motion.div
              className="postlb"
              initial={{ scale: 0.96, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.96, opacity: 0 }}
              transition={{ type: "spring", stiffness: 260, damping: 26 }}
              onClick={(e) => e.stopPropagation()}
              {...postSwipe}
            >
              <button className="lightbox__close" onClick={() => setPostIdx(null)} aria-label="Close">
                ×
              </button>
              <img src={SOCIAL_POSTS.images[postIdx]} alt={`${SOCIAL_POSTS.name} post ${postIdx + 1}`} />
              <button className="lb-nav lb-nav--prev" onClick={prevPost} aria-label="Previous">
                ‹
              </button>
              <button className="lb-nav lb-nav--next" onClick={nextPost} aria-label="Next">
                ›
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </Page>
  );
}
