import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import Page, { container, cardIn } from "../components/Page";
import TemplateMockup from "../components/TemplateMockup";
import { prefetchTemplate } from "../templates/registry";
import { CONTACT, TEMPLATES, WEBSITES } from "../siteData";

export default function Websites() {
  const [active, setActive] = useState(null); // website object or null

  useEffect(() => {
    if (!active) return;
    const onKey = (e) => e.key === "Escape" && setActive(null);
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [active]);

  return (
    <Page>
      <header className="topbar">
        <div>
          <h2 className="topbar__title">Websites</h2>
          <p className="topbar__sub">Designed &amp; built, end to end</p>
        </div>
        <Link className="link" to="/work-with-me">
          Work with me <span className="plus">+</span>
        </Link>
      </header>

      {/* Anyone browsing client work is already thinking "could I have one of
          these" — so the store sits above the portfolio rather than below it,
          where it would only be found by people who scrolled to the end. */}
      <motion.section
        className="card webstore"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      >
        <div className="webstore__copy">
          <span className="webstore__flag">Buy online</span>
          <h3 className="card-title">Want one without the wait?</h3>
          <p className="card-body">
            Four websites are already built and ready to go live. Open any of them as a
            real, working site — scroll it, click it, resize it — then take the source
            files or have me put it on your domain with your words and photos in it.
          </p>
          <Link className="btn-book webstore__cta" to="/templates">
            Browse the store — from ${Math.min(...TEMPLATES.map((t) => t.price))}
          </Link>
        </div>

        <div className="webstore__strip">
          {TEMPLATES.map((t) => (
            <Link
              key={t.slug}
              to={`/templates/${t.slug}`}
              className="webstore__tile"
              style={{ background: t.bg }}
              onMouseEnter={() => prefetchTemplate(t.slug)}
              aria-label={`Open the ${t.name} live preview`}
            >
              <TemplateMockup kind={t.mockup} />
              <span className="webstore__tile-name">
                {t.name} <em>${t.price}</em>
              </span>
            </Link>
          ))}
        </div>
      </motion.section>

      <section className="proj-section">
        <h3 className="proj-section__title">Client work</h3>
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
