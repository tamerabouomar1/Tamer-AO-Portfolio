import { useCallback, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import Page, { container, cardIn } from "../components/Page";
import TemplateMockup from "../components/TemplateMockup";
import { BuyModalHost } from "../components/BuyModal";
import { prefetchTemplate } from "../templates/registry";
import { CONTACT, TEMPLATES, TEMPLATE_PACKAGES } from "../siteData";

/* The store. Cards paint a CSS miniature of each template (no image
   requests), warm the template's JS chunk on hover, and swap in the real
   animated preview only once the visitor shows interest. */

function Preview({ t }) {
  // `armed` flips on first hover/touch: until then no GIF or video exists in
  // the DOM at all, so the grid costs nothing to render.
  const [armed, setArmed] = useState(false);
  const [ready, setReady] = useState(false);

  const arm = useCallback(() => {
    setArmed(true);
    prefetchTemplate(t.slug);
  }, [t.slug]);

  return (
    <div
      className="tpl-card__shot"
      style={{ background: t.bg }}
      onMouseEnter={arm}
      onFocus={arm}
      onTouchStart={arm}
    >
      <TemplateMockup kind={t.mockup} />

      {armed && t.video && (
        <video
          className={`tpl-card__media${ready ? " is-ready" : ""}`}
          src={t.video}
          autoPlay
          loop
          muted
          playsInline
          preload="none"
          onPlaying={() => setReady(true)}
        />
      )}
      {armed && t.media && (
        <img
          className={`tpl-card__media${ready ? " is-ready" : ""}`}
          src={t.media}
          alt=""
          decoding="async"
          onLoad={() => setReady(true)}
        />
      )}

      <span className="tpl-card__badge">Open live preview +</span>
    </div>
  );
}

export default function Templates() {
  const [buying, setBuying] = useState(null);

  return (
    <Page>
      <header className="topbar">
        <div>
          <h2 className="topbar__title">Website Store</h2>
          <p className="topbar__sub">Ready-made sites, live to preview, yours to buy</p>
        </div>
        <a className="link" href={CONTACT.calendly} target="_blank" rel="noreferrer noopener">
          Not sure which? Book a call <span className="plus">+</span>
        </a>
      </header>

      <section className="tpl-intro card">
        <p className="card-body">
          Every site below is a real, working build — not a screenshot. Open the live
          preview, scroll it, click it, resize it. When one fits, pick a package: take the
          source files and host it yourself, or have me put it live on your domain with
          your own words and photos in it.
        </p>
        <div className="chip-row">
          {TEMPLATE_PACKAGES.map((p) => (
            <span className="chip" key={p.id}>
              {p.name} · {p.from ? `from $${p.from}` : p.add ? `+$${p.add}` : "base price"}
            </span>
          ))}
        </div>
      </section>

      <section className="proj-section">
        <motion.div className="tpl-grid" variants={container} initial="hidden" animate="show">
          {TEMPLATES.map((t) => (
            <motion.article className="card tpl-card" key={t.slug} variants={cardIn}>
              <Link
                className="tpl-card__link"
                to={`/templates/${t.slug}`}
                onMouseEnter={() => prefetchTemplate(t.slug)}
                aria-label={`Open the ${t.name} live preview`}
              >
                <Preview t={t} />
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
                  {p.from ? "quoted per project" : p.add ? "on top of the template" : "template price"}
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

      <BuyModalHost template={buying} onClose={() => setBuying(null)} />
    </Page>
  );
}
