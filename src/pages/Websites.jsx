import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import Page, { container, cardIn } from "../components/Page";
import LiveThumb from "../components/LiveThumb";
import { LoadBar, LoadingImage } from "../components/LoadBar";
import { BuyModalHost } from "../components/BuyModal";
import { prefetchTemplate } from "../templates/registry";
import { CONTACT, TEMPLATES, TEMPLATE_PACKAGES, WEBSITES } from "../siteData";

/* One page covers both halves of the same question: sites already built for
   clients, and sites you can buy today. The store used to be its own
   destination in the nav; it lives here instead, under the heading people
   already click when they want a website. Client work comes first — it is the
   proof — and the offer follows it. */

export default function Websites() {
  const [active, setActive] = useState(null); // client site, or null
  const [buying, setBuying] = useState(null); // template being bought, or null
  const [siteReady, setSiteReady] = useState(false); // popup iframe loaded?

  useEffect(() => {
    setSiteReady(false);
    if (!active) return;
    const onKey = (e) => e.key === "Escape" && setActive(null);
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [active]);

  const from = Math.min(...TEMPLATES.map((t) => t.price));

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

      <section className="proj-section" style={{ marginTop: 0 }}>
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
                <LiveThumb
                  src={w.demo}
                  poster={w.image}
                  bg="#0b0b0d"
                  label={w.name}
                  mode="hover"
                />
                <span className="web-card__badge">Open the real site +</span>
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

      {/* ── Ready-made sites ─────────────────────────────────── */}
      <section className="proj-section" id="store">
        <div className="storehead">
          <span className="storehead__flag">Ready to buy</span>
          <h3 className="storehead__title">
            Skip the six-week build.
            <br />
            <span className="storehead__accent">Launch this week instead.</span>
          </h3>
          <p className="storehead__lede">
            Four websites, already designed and already built. What you see in each card
            below is the site itself running — not a screenshot. Open it, scroll it, break
            it if you like. When one fits, it&apos;s yours from ${from}.
          </p>

          <ul className="storeprops">
            <li>
              <strong>Live in days</strong>
              Your words and photos in, deployed on your domain — not next quarter.
            </li>
            <li>
              <strong>Yours to keep</strong>
              Full source code and a one-project licence. No monthly platform rent.
            </li>
            <li>
              <strong>Hand-built</strong>
              Real React, not a page builder. Fast on a phone, and it stays that way.
            </li>
          </ul>

          <a
            className="link storehead__ask"
            href={CONTACT.calendly}
            target="_blank"
            rel="noreferrer noopener"
          >
            Not sure which one fits? Book a free 30-minute call <span className="plus">+</span>
          </a>
        </div>

        <motion.div className="tpl-grid" variants={container} initial="hidden" animate="show">
          {TEMPLATES.map((t) => (
            <motion.article className="card tpl-card" key={t.slug} variants={cardIn}>
              <Link
                className="tpl-card__link"
                to={`/templates/${t.slug}`}
                onMouseEnter={() => prefetchTemplate(t.slug)}
                aria-label={`Open the ${t.name} live preview`}
              >
                <div className="tpl-card__shot">
                  <LiveThumb src={`/templates/${t.slug}`} bg={t.bg} label={t.name} />
                  <span className="tpl-card__badge">Open live preview +</span>
                </div>
              </Link>

              <div className="tpl-card__body">
                <div className="tpl-card__row">
                  <div>
                    <span className="web-card__tag">{t.tag}</span>
                    <h4 className="web-card__title">
                      {t.name} <span className="tpl-card__kicker">— {t.kicker}</span>
                    </h4>
                  </div>
                  <div className="tpl-card__price">
                    <span className="tpl-card__from">from</span>
                    <span className="tpl-card__amount">${t.price}</span>
                  </div>
                </div>

                <p className="card-body">{t.desc}</p>

                <ul className="tpl-card__feats">
                  {t.highlights.map((h) => (
                    <li key={h}>
                      <span className="tick" />
                      {h}
                    </li>
                  ))}
                </ul>

                <p className="tpl-card__meta">
                  <strong>Best for</strong> {t.bestFor} · {t.stack}
                </p>

                <div className="tpl-card__actions">
                  <Link
                    className="btn-book tpl-card__preview"
                    to={`/templates/${t.slug}`}
                    onMouseEnter={() => prefetchTemplate(t.slug)}
                  >
                    Live preview
                  </Link>
                  <button className="btn-book tpl-card__buy" onClick={() => setBuying(t)}>
                    Buy this site
                  </button>
                </div>
              </div>
            </motion.article>
          ))}
        </motion.div>
      </section>

      <section className="proj-section">
        <h3 className="proj-section__title">What every package includes</h3>
        <div className="price-grid">
          {TEMPLATE_PACKAGES.map((p) => (
            <article
              className={`card price-card${p.featured ? " price-card--featured" : ""}`}
              key={p.id}
            >
              {p.save && <span className="price-card__badge">{p.save}</span>}
              <div className="price-card__head">
                <h4 className="price-card__name">{p.name}</h4>
                <p className="price-card__tagline">{p.tagline}</p>
              </div>
              <div className="price-card__price">
                <span className="price-card__amount">
                  {p.from ? `$${p.from}+` : p.add ? `+$${p.add}` : "Base"}
                </span>
                <span className="price-card__period">
                  {p.from
                    ? "quoted per project"
                    : p.add
                      ? "on top of the template"
                      : "template price"}
                </span>
              </div>
              <ul className="price-card__features">
                {p.features.map((f) => (
                  <li key={f}>
                    <span className="tick" />
                    {f}
                  </li>
                ))}
                {p.bonus && (
                  <li>
                    <span className="tick tick--gift" />
                    <span className="price-card__bonus">{p.bonus}</span>
                  </li>
                )}
              </ul>
              <a
                className="btn-book"
                href={CONTACT.calendly}
                target="_blank"
                rel="noreferrer noopener"
              >
                Talk it through
              </a>
            </article>
          ))}
        </div>
        <p className="price-note">
          Want something that isn&apos;t here? I build custom sites from scratch too —{" "}
          <Link className="link" to="/work-with-me">
            see how we&apos;d work together <span className="plus">+</span>
          </Link>
        </p>
      </section>

      {/* full-page screenshot of a client site */}
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
              className={`weblb__panel${active.demo ? " weblb__panel--live" : ""}`}
              initial={{ scale: 0.96, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.96, opacity: 0 }}
              transition={{ type: "spring", stiffness: 260, damping: 26 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="weblb__head">
                <div>
                  <span className="web-card__tag">{active.tag}</span>
                  <h3 className="weblb__title">
                    {active.name}
                    {active.demo && <em className="weblb__live">Live · fully interactive</em>}
                  </h3>
                </div>
                <button className="weblb__close" onClick={() => setActive(null)} aria-label="Close">
                  ×
                </button>
              </div>

              {/* The real site, running — click the menu, open the cart, play
                  the video. Sites without a runnable copy fall back to the
                  full-page screenshot they always had. */}
              {active.demo ? (
                <>
                  {!siteReady && <LoadBar label={`Loading ${active.name}`} />}
                  <iframe
                    className="weblb__live-frame"
                    src={active.demo}
                    title={`${active.name} — live site`}
                    onLoad={() => setSiteReady(true)}
                  />
                </>
              ) : (
                <div className="weblb__scroll">
                  <LoadingImage src={active.full} alt={`${active.name} full page`} />
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <BuyModalHost template={buying} onClose={() => setBuying(null)} />
    </Page>
  );
}
