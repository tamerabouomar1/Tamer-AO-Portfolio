import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Page, { container, cardIn } from "../components/Page";
import { CONTACT, WEBSITES, SOCIAL_POSTS, VIDEO_EDITS } from "../siteData";

const LOGOMOTIONS = [
  { title: "Combat Sports Academy", src: "/assets/motion/logomotion-csa.mp4" },
  { title: "MoCars / MoTrouble", src: "/assets/motion/logomotion-mocars.mp4" },
  { title: "BIAF", src: "/assets/motion/logomotion-biaf.mp4", fit: "cover", scale: 1.18 },
];

export default function Media() {
  const [active, setActive] = useState(null); // website object or null
  const [postIdx, setPostIdx] = useState(null); // social-post index or null

  const anyOpen = active !== null || postIdx !== null;
  useEffect(() => {
    if (!anyOpen) return;
    const onKey = (e) => {
      if (e.key === "Escape") {
        setActive(null);
        setPostIdx(null);
      } else if (postIdx !== null && e.key === "ArrowRight") {
        setPostIdx((i) => (i + 1) % SOCIAL_POSTS.images.length);
      } else if (postIdx !== null && e.key === "ArrowLeft") {
        setPostIdx((i) => (i - 1 + SOCIAL_POSTS.images.length) % SOCIAL_POSTS.images.length);
      }
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [anyOpen, postIdx]);

  return (
    <Page>
      <header className="topbar">
        <div>
          <h2 className="topbar__title">Media</h2>
          <p className="topbar__sub">Motion, edits &amp; social</p>
        </div>
        <a className="link" href={`mailto:${CONTACT.email}`}>
          Get in touch <span className="plus">+</span>
        </a>
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
        <h3 className="section-title">Websites</h3>
        <motion.div className="web-grid" variants={container} initial="hidden" animate="show">
          {WEBSITES.map((w) => (
            <motion.article
              className="card web-card"
              key={w.name}
              variants={cardIn}
              onClick={() => setActive(w)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && setActive(w)}
            >
              <div className="web-card__shot">
                <img src={w.image} alt={w.name} loading="lazy" />
                <span className="web-card__badge">Scroll the site +</span>
              </div>
              <div className="web-card__body">
                <span className="web-card__tag">{w.tag}</span>
                <h4 className="web-card__title">{w.name}</h4>
                <p className="card-body">{w.desc}</p>
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
            >
              <button className="lightbox__close" onClick={() => setPostIdx(null)} aria-label="Close">
                ×
              </button>
              <img src={SOCIAL_POSTS.images[postIdx]} alt={`${SOCIAL_POSTS.name} post ${postIdx + 1}`} />
              <button
                className="lb-nav lb-nav--prev"
                onClick={() => setPostIdx((i) => (i - 1 + SOCIAL_POSTS.images.length) % SOCIAL_POSTS.images.length)}
                aria-label="Previous"
              >
                ‹
              </button>
              <button
                className="lb-nav lb-nav--next"
                onClick={() => setPostIdx((i) => (i + 1) % SOCIAL_POSTS.images.length)}
                aria-label="Next"
              >
                ›
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {active && (
          <motion.div
            className="lightbox"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setActive(null)}
          >
            <motion.div
              className="weblb__panel"
              initial={{ scale: 0.96, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.96, opacity: 0 }}
              transition={{ type: "spring", stiffness: 260, damping: 26 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="weblb__head">
                <div>
                  <span className="web-card__tag">{active.tag}</span>
                  <h3 className="weblb__title">{active.name}</h3>
                </div>
                <button className="weblb__close" onClick={() => setActive(null)} aria-label="Close">
                  ×
                </button>
              </div>
              <div className="weblb__scroll">
                <img src={active.full} alt={`${active.name} full page`} />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </Page>
  );
}
