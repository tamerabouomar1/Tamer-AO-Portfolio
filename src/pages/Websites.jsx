import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import Page, { container, cardIn } from "../components/Page";
import LiveThumb from "../components/LiveThumb";
import { LoadBar, LoadingImage } from "../components/LoadBar";
import { BuyModalHost } from "../components/BuyModal";
import { prefetchTemplate } from "../templates/registry";
import {
  CONTACT,
  FREE_TEMPLATES,
  SIGNATURE_TEMPLATES,
  TEMPLATE_PACKAGES,
  SIGNATURE_PACKAGES,
  WEBSITES,
} from "../siteData";

/* One page covers both halves of the same question: sites already built for
   clients, and sites you can buy today. The store used to be its own
   destination in the nav; it lives here instead, under the heading people
   already click when they want a website. Client work comes first — it is the
   proof — and the offer follows it. */

/* One store card. Lifted out of the grid because the page now renders two
   collections through it: the free library and the paid Signature four. The
   only thing that differs is the price line and the button label, so they
   are derived from the template rather than duplicated as a second card. */
function TemplateCard({ t, onBuy }) {
  const signature = t.tier === "signature";
  return (
    <motion.article className="card tpl-card" variants={cardIn}>
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
              {t.name} <span className="tpl-card__kicker">{t.kicker}</span>
            </h4>
          </div>
          <div className="tpl-card__price">
            <span className="tpl-card__from">source</span>
            <span className="tpl-card__amount">{signature ? `$${t.price}` : "Free"}</span>
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
          <button className="btn-book tpl-card__buy" onClick={() => onBuy(t)}>
            {signature ? "Get it" : "Get it free"}
          </button>
        </div>
      </div>
    </motion.article>
  );
}

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
          <span className="storehead__flag">Built with AI · Free to take</span>
          <h3 className="storehead__title">
            {FREE_TEMPLATES.length} finished websites.
            <br />
            <span className="storehead__accent">Take any of them, free.</span>
          </h3>
          <p className="storehead__lede">
            Premium sites, designed and built with AI and finished by hand, and the source
            code is yours for nothing. What you see in each card below is the site itself
            running, not a screenshot. Open it, scroll it, break it if you like. When one
            fits, download it, run two commands and it is live on your machine. Pay me only
            if you would rather I put it on your domain for you.
          </p>

          <ul className="storeprops">
            <li>
              <strong>Free, genuinely</strong>
              The full React project, a deploy guide and a license to use it on client work.
              No payment, no card, no email course.
            </li>
            <li>
              <strong>AI speed, designer&apos;s eye</strong>
              AI does the heavy lifting. Every layout, colour and line of type is still
              judged by a designer before it ships.
            </li>
            <li>
              <strong>Or live in days</strong>
              Send your words and photos and I will have it on your domain this week, from
              $200.
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
          {FREE_TEMPLATES.map((t) => (
            <TemplateCard key={t.slug} t={t} onBuy={setBuying} />
          ))}
        </motion.div>
      </section>

      {/* The paid work. Kept as its own section rather than mixed into the grid
          above, because a $149 card sitting between free ones reads as a
          mistake — the split is what makes the price legible. */}
      <section className="proj-section">
        <div className="storehead storehead--sig">
          <h3 className="proj-section__title">Signature collection</h3>
          <p className="storehead__lede">
            A complete design system, not a single screen. Its own palette, type scale and
            signature visual, drawn in code so there is nothing licensed to swap out, and
            the tokens ship in three formats so it is yours to extend rather than only
            recolour. Priced because it is the work, not the sample.
          </p>
        </div>

        <motion.div className="tpl-grid" variants={container} initial="hidden" animate="show">
          {SIGNATURE_TEMPLATES.map((t) => (
            <TemplateCard key={t.slug} t={t} onBuy={setBuying} />
          ))}
        </motion.div>
      </section>

      <section className="proj-section">
        <h3 className="proj-section__title">Signature pricing</h3>
        <div className="price-grid">
          {SIGNATURE_PACKAGES.map((p) => (
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
                <span className="price-card__amount">${p.flat}</span>
                <span className="price-card__period">{p.period}</span>
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
            </article>
          ))}
        </div>
      </section>

      <section className="proj-section">
        <h3 className="proj-section__title">What every free template includes</h3>
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
                  {p.free ? "$0" : p.from ? `$${p.from}+` : `$${p.flat}`}
                </span>
                <span className="price-card__period">
                  {p.period ??
                    (p.free
                      ? "any template, no catch"
                      : p.from
                        ? "quoted per project"
                        : "flat, any template")}
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
              {/* The free tier's action is the grid above, not a call: the
                  whole point is that nobody has to talk to anyone to get it. */}
              {p.free ? (
                <button className="btn-book" onClick={() => setBuying(FREE_TEMPLATES[0])}>
                  Download one now
                </button>
              ) : (
                <a
                  className="btn-book"
                  href={CONTACT.calendly}
                  target="_blank"
                  rel="noreferrer noopener"
                >
                  Talk it through
                </a>
              )}
            </article>
          ))}
        </div>
        <p className="price-note">
          Want something that isn&apos;t here? I build custom sites from scratch too.{" "}
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
                    title={`${active.name} live site`}
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
