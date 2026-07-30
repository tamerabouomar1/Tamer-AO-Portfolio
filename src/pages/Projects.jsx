import { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import Page, { container, cardIn } from "../components/Page";
import { LoadBar } from "../components/LoadBar";
import CardPreview from "../components/CardPreview";
import useSwipe from "../components/useSwipe";
import { PROJECT_GROUPS } from "../siteData";

export default function Projects() {
  const [active, setActive] = useState(null);
  // Which card is leafing through its images. Exactly one at a time: the
  // preview is a response to the pointer, not ambient motion.
  const [hovered, setHovered] = useState(null);
  const [idx, setIdx] = useState(0);
  const [docIdx, setDocIdx] = useState(0);
  const [dir, setDir] = useState(0); // slide direction: 1 next, -1 prev
  // Whether the slide currently on screen has finished downloading. These
  // are full-page scans, so on a phone connection there is a real wait and
  // the panel would otherwise sit empty with no explanation.
  const [shotReady, setShotReady] = useState(false);

  // A card can hold either a single image set, or several named documents.
  const docs = active && active.docs ? active.docs : null;
  const current = docs ? docs[docIdx] : active;
  const images = current ? current.images : [];
  const desc = current ? current.desc : "";

  const open = (item) => {
    setActive(item);
    setIdx(0);
    setDocIdx(0);
    setDir(0);
  };
  const pickDoc = (i) => {
    setDocIdx(i);
    setIdx(0);
    setDir(0);
  };
  const close = () => setActive(null);
  const next = useCallback(() => {
    setDir(1);
    setShotReady(false);
    setIdx((i) => (i + 1) % images.length);
  }, [images.length]);
  const prev = useCallback(() => {
    setDir(-1);
    setShotReady(false);
    setIdx((i) => (i - 1 + images.length) % images.length);
  }, [images.length]);

  // touch: swipe left/right to browse the carousel, swipe down to close
  const swipe = useSwipe({
    onLeft: images.length > 1 ? next : undefined,
    onRight: images.length > 1 ? prev : undefined,
    onDown: close,
  });

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
        <Link className="link" to="/work-with-me">
          Work with me <span className="plus">+</span>
        </Link>
      </header>

      {PROJECT_GROUPS.map((group) => (
        <section className="proj-section" key={group.title}>
          <h3 className="proj-section__title">{group.title}</h3>
          <motion.div className="proj-grid" variants={container} initial="hidden" animate="show">
            {group.items.map((item) => (
              <motion.article
                className={
                  "card proj-card" +
                  (group.product ? " proj-card--product" : "") +
                  (item.phone ? " proj-card--phone" : "")
                }
                key={item.name}
                variants={cardIn}
                onClick={() => open(item)}
                onMouseEnter={() => setHovered(item.name)}
                onMouseLeave={() => setHovered((n) => (n === item.name ? null : n))}
                /* keyboard users get the same preview by tabbing to the card */
                onFocus={() => setHovered(item.name)}
                onBlur={() => setHovered((n) => (n === item.name ? null : n))}
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
                        {/* leafs through the first few images on hover, so the
                            grid shows what is inside without being opened */}
                        <CardPreview
                          images={cover}
                          name={item.name}
                          playing={hovered === item.name && !active}
                        />
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

              <div className="lightbox__media" {...swipe}>
                {!shotReady && <LoadBar label={`Loading ${active.name}`} />}
                <AnimatePresence mode="wait">
                  <motion.img
                    key={idx}
                    src={images[idx]}
                    alt={`${active.name} ${idx + 1}`}
                    onLoad={() => setShotReady(true)}
                    onError={() => setShotReady(true)}
                    initial={{ opacity: 0, x: 44 * dir }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -44 * dir }}
                    transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
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
                          onClick={() => {
                            setShotReady(false);
                            setIdx(i);
                          }}
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
                    {idx + 1} / {images.length} · swipe or use ← → to browse
                  </div>
                )}
                <Link className="link" to="/work-with-me">
                  Work with me <span className="plus">+</span>
                </Link>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </Page>
  );
}
