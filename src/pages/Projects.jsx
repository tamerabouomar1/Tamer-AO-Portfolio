import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Page, { container, cardIn } from "../components/Page";
import { PROJECT_GROUPS, CONTACT } from "../siteData";

function initials(name) {
  return name
    .replace(/[^a-zA-Z0-9 ]/g, "")
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();
}

export default function Projects() {
  const [active, setActive] = useState(null);
  const [idx, setIdx] = useState(0);
  const [docIdx, setDocIdx] = useState(0);

  // A card can hold either a single image set, or several named documents.
  const docs = active && active.docs ? active.docs : null;
  const current = docs ? docs[docIdx] : active;
  const images = current ? current.images : [];
  const desc = current ? current.desc : "";

  const open = (item) => {
    setActive(item);
    setIdx(0);
    setDocIdx(0);
  };
  const pickDoc = (i) => {
    setDocIdx(i);
    setIdx(0);
  };
  const close = () => setActive(null);
  const next = useCallback(() => setIdx((i) => (i + 1) % images.length), [images.length]);
  const prev = useCallback(() => setIdx((i) => (i - 1 + images.length) % images.length), [images.length]);

  // keyboard: Esc closes, arrows navigate the carousel
  useEffect(() => {
    function onKey(e) {
      if (!active) return;
      if (e.key === "Escape") close();
      else if (e.key === "ArrowRight") next();
      else if (e.key === "ArrowLeft") prev();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [active, next, prev]);

  useEffect(() => {
    document.body.style.overflow = active ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [active]);

  return (
    <Page>
      <header className="topbar">
        <div>
          <h2 className="topbar__title">Graphic Designer</h2>
          <p className="topbar__sub">Student Athlete</p>
        </div>
        <a className="link" href={`mailto:${CONTACT.email}`}>
          Let's work together <span className="plus">+</span>
        </a>
      </header>

      {PROJECT_GROUPS.map((group) => (
        <section className="proj-section" key={group.title}>
          <h3 className="proj-section__title">{group.title}</h3>
          <motion.div className="proj-grid" variants={container} initial="hidden" animate="show">
            {group.items.map((item) => (
              <motion.article
                className={"card proj-card" + (group.product ? " proj-card--product" : "")}
                key={item.name}
                variants={cardIn}
                onClick={() => open(item)}
                role="button"
                tabIndex={0}
                aria-label={`Open ${item.name}`}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    open(item);
                  }
                }}
              >
                {(() => {
                  const cover = item.images ? item.images : item.docs[0].images;
                  return (
                    <>
                      <div className="proj-card__media">
                        <img src={cover[0]} alt={item.name} loading="lazy" />
                      </div>
                      {item.docs ? (
                        <span className="proj-card__count">{item.docs.length} docs</span>
                      ) : (
                        cover.length > 1 && <span className="proj-card__count">{cover.length} ▦</span>
                      )}
                    </>
                  );
                })()}
                <div className="proj-card__overlay" />
                <div className="proj-card__meta">
                  <div className="proj-card__tag">{item.tag}</div>
                  <div className="proj-card__name">{item.name}</div>
                </div>
                <span className="proj-card__expand" aria-hidden="true">⤢</span>
              </motion.article>
            ))}
          </motion.div>
        </section>
      ))}

      {/* click-to-open popup: carousel + info */}
      <AnimatePresence>
        {active && (
          <motion.div
            className="lightbox"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={close}
          >
            <motion.div
              className="lightbox__panel"
              initial={{ scale: 0.92, y: 24, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.95, y: 12, opacity: 0 }}
              transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
              onClick={(e) => e.stopPropagation()}
              role="dialog"
              aria-modal="true"
              aria-label={active.name}
            >
              <button className="lightbox__close" onClick={close} aria-label="Close">
                ×
              </button>

              <div className="lightbox__media">
                <AnimatePresence mode="wait">
                  <motion.img
                    key={idx}
                    src={images[idx]}
                    alt={`${active.name} ${idx + 1}`}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  />
                </AnimatePresence>
                {images.length > 1 && (
                  <>
                    <button className="lb-nav lb-nav--prev" onClick={prev} aria-label="Previous">‹</button>
                    <button className="lb-nav lb-nav--next" onClick={next} aria-label="Next">›</button>
                    <div className="lb-dots">
                      {images.map((_, i) => (
                        <button
                          key={i}
                          className={"lb-dot" + (i === idx ? " is-on" : "")}
                          onClick={() => setIdx(i)}
                          aria-label={`Image ${i + 1}`}
                        />
                      ))}
                    </div>
                  </>
                )}
              </div>

              <div className="lightbox__info">
                <div className="proj-card__tag">{active.tag}</div>
                <h3 className="lightbox__title">{active.name}</h3>
                {docs && (
                  <div className="lb-docs">
                    {docs.map((d, i) => (
                      <button
                        key={d.label}
                        className={"lb-doc" + (i === docIdx ? " is-on" : "")}
                        onClick={() => pickDoc(i)}
                      >
                        {d.label}
                      </button>
                    ))}
                  </div>
                )}
                <p className="card-body">{desc}</p>
                {images.length > 1 && (
                  <div className="lb-counter">
                    {idx + 1} / {images.length} · use ← → to browse
                  </div>
                )}
                <a className="link" href={`mailto:${CONTACT.email}`}>
                  Work with me <span className="plus">+</span>
                </a>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </Page>
  );
}
