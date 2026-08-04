import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import Page, { container, cardIn } from "../components/Page";
import useSwipe from "../components/useSwipe";
import InstagramEmbed from "../components/InstagramEmbed";
import { CONTACT, INSTAGRAM_POSTS, INSTAGRAM_REELS, SOCIAL_POSTS, VIDEO_EDITS } from "../siteData";

const LOGOMOTIONS = [
  { title: "Combat Sports Academy", src: "/assets/motion/logomotion-csa.mp4" },
  { title: "MoCars / MoTrouble", src: "/assets/motion/logomotion-mocars.mp4" },
  { title: "BIAF", src: "/assets/motion/logomotion-biaf.mp4", fit: "cover", scale: 1.18 },
];

// 2346 → "2.3K", 123694 → "124K" — the way Instagram itself shortens them.
// One decimal below 100K, none above, and never a dangling ".0".
const compact = (n) => {
  const trim = (v) => `${v}`.replace(/\.0$/, "");
  if (n >= 1_000_000) return `${trim((n / 1_000_000).toFixed(1))}M`;
  if (n >= 100_000) return `${Math.round(n / 1_000)}K`;
  if (n >= 1_000) return `${trim((n / 1_000).toFixed(1))}K`;
  return `${n}`;
};

export default function Media() {
  const [postIdx, setPostIdx] = useState(null); // social-post index or null

  const nextPost = () => setPostIdx((i) => (i + 1) % SOCIAL_POSTS.images.length);
  const prevPost = () => setPostIdx((i) => (i - 1 + SOCIAL_POSTS.images.length) % SOCIAL_POSTS.images.length);

  // touch: swipe left/right through posts, swipe down to close
  const postSwipe = useSwipe({
    onLeft: nextPost,
    onRight: prevPost,
    onDown: () => setPostIdx(null),
  });

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
          <h2 className="topbar__title">Media</h2>
          <p className="topbar__sub">Motion, edits &amp; social</p>
        </div>
        <Link className="link" to="/work-with-me">
          Work with me <span className="plus">+</span>
        </Link>
      </header>

      <section className="proj-section" style={{ marginTop: 0 }}>
        <h3 className="section-title">Logo Motion</h3>
        <motion.div className="motion-grid" variants={container} initial="hidden" animate="show">
          {LOGOMOTIONS.map((m) => (
            <motion.article className="card motion-card" key={m.src} variants={cardIn}>
              <video
                src={m.src}
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
        <h3 className="section-title">Video Edits</h3>
        <motion.div className="video-grid" variants={container} initial="hidden" animate="show">
          {VIDEO_EDITS.map((v) => (
            <motion.article className="card video-card" key={v.src} variants={cardIn}>
              <video src={v.src} controls preload="metadata" playsInline />
              <div className="web-card__body">
                <h4 className="web-card__title">{v.title}</h4>
                <p className="card-body">{v.desc}</p>
              </div>
            </motion.article>
          ))}
        </motion.div>
      </section>

      <section className="proj-section">
        <h3 className="section-title">Instagram Posts</h3>
        <p className="card-body" style={{ maxWidth: "70ch", marginBottom: 14 }}>
          Five posts, <strong style={{ color: "#fff" }}>592,000 views and 39,000 likes</strong>. Shot,
          cut and captioned by me, with the numbers they actually did.
        </p>
        <motion.div className="reel-grid" variants={container} initial="hidden" animate="show">
          {INSTAGRAM_REELS.map((r) => (
            <motion.article className="card reel-card" key={r.src} variants={cardIn}>
              <a className="reel-card__frame" href={r.url} target="_blank" rel="noreferrer" aria-label={`${r.title} on Instagram`}>
                <video src={r.src} autoPlay loop muted playsInline preload="metadata" />
              </a>
              <div className="reel-card__body">
                <h4 className="web-card__title">{r.title}</h4>
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
        <h3 className="section-title">Social Media</h3>
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
          <h3 className="section-title">Reels</h3>
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
        <h3 className="section-title">On Instagram</h3>
        <motion.div
          className="card cta"
          variants={cardIn}
          initial="hidden"
          animate="show"
          style={{ minHeight: 0 }}
        >
          <div className="media-ig">
            <div className="media-ig__big">
              <div className="stat-num">200K+</div>
              <div className="stat-label">views per month</div>
            </div>
            <div className="media-ig__copy">
              <p className="card-body">
                Short-form is where most of my motion work lives. My reels and edits on Instagram pull in
                <strong style={{ color: "#fff" }}> over 200,000 views every month</strong>, from brand
                promos and fitness content to logo animations and event recaps that reach a real,
                growing audience.
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
