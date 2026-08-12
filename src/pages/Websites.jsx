import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import Page, { container, cardIn } from "../components/Page";
import LiveThumb from "../components/LiveThumb";
import { LoadBar, LoadingImage } from "../components/LoadBar";
import { BuyModalHost } from "../components/BuyModal";
import PriceCard from "../components/PriceCard";
import MessageForm from "../components/MessageForm";
import { prefetchTemplate } from "../templates/registry";
import {
  CONTACT,
  TEMPLATES,
  TEMPLATE_PACKAGES,
  SERVICE_PACKAGES,
  WEBSITE_CARE_PLANS,
  WEBSITE_CARE_NOTES,
  WEBSITES,
} from "../siteData";

/* One page covers both halves of the same question: sites already built for
   clients, and sites you can buy today. The store used to be its own
   destination in the nav; it lives here instead, under the heading people
   already click when they want a website. Client work comes first — it is the
   proof — and the offer follows it. */

/* One store card, deliberately thin. It used to carry a four-item feature
   list, a "best for" line and a stack line on top of the description, which at
   21 cards is a wall nobody reads. The live preview IS the pitch, so the card
   keeps a name, a kicker, one line, and the two things you can do. */
function TemplateCard({ t, onBuy }) {
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
          <span className="tpl-card__amount">Free</span>
        </div>

        <p className="card-body">{t.desc}</p>

        <div className="tpl-card__actions">
          <Link
            className="btn-book tpl-card__preview"
            to={`/templates/${t.slug}`}
            onMouseEnter={() => prefetchTemplate(t.slug)}
          >
            Live preview
          </Link>
          <button className="btn-book tpl-card__buy" onClick={() => onBuy(t)}>
            Get it free
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
        <h3 className="proj-section__title">Client Work</h3>
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
          <span className="storehead__flag">All free · Something new every week</span>
          <h3 className="storehead__title">
            {TEMPLATES.length} finished websites.
            <br />
            <span className="storehead__accent">Take any of them, free.</span>
          </h3>
          <p className="storehead__lede">
            Every card below is the real site running, not a screenshot. Open it, and if it
            fits, download it. Two commands and it is live.
          </p>

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
            <TemplateCard key={t.slug} t={t} onBuy={setBuying} />
          ))}
        </motion.div>
      </section>

      <section className="proj-section">
        <div className="storehead storehead--sig">
          <h3 className="proj-section__title">Take One, or Take the Lot</h3>
          <p className="storehead__lede">
            Every template here is free, one at a time. The membership is for the flow:
            the whole library including the fonts, and whatever ships next week.
          </p>
        </div>
        <motion.div className="price-grid" variants={container} initial="hidden" animate="show">
          {TEMPLATE_PACKAGES.map((p) => (
            <PriceCard
              key={p.id}
              name={p.name}
              tagline={p.tagline}
              amount={p.free ? "$0" : p.from ? `$${p.from}+` : `$${p.flat}`}
              period={
                p.period ??
                (p.free
                  ? "any template, no catch"
                  : p.from
                    ? "quoted per project"
                    : "flat, any template")
              }
              was={p.anchor ? `$${p.anchor}` : undefined}
              anchorNote={p.anchorNote}
              badge={p.badge}
              featured={p.featured}
              features={p.features}
              bonus={p.bonus}
              guarantee={p.guarantee}
              action={
                /* The free tier's action is the grid above, not a call: the
                   whole point is that nobody has to talk to anyone to get it. */
                /* TEMPLATES[0], not FREE_TEMPLATES[0]: that export stopped
                   existing when every template went free and the two tiers
                   collapsed into one list. PR #27 still called it, which
                   builds clean and throws on the first click. */
                p.free ? (
                  <button className="btn-book" onClick={() => setBuying(TEMPLATES[0])}>
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
                )
              }
            />
          ))}
        </motion.div>
        <p className="price-note">
          Want something that isn&apos;t here? I build custom sites from scratch too.{" "}
          <Link className="link" to="/work-with-me">
            see how we&apos;d work together <span className="plus">+</span>
          </Link>
        </p>
      </section>
      <section className="proj-section">
        <h3 className="proj-section__title">Rather I did it for you?</h3>
        {/* Named up front, not buried in the plan table below: the build fee
            buys the build, and the site runs on a monthly plan from launch
            day. Somebody who finds that out after they have agreed a price
            feels sold to, which is the one thing this page cannot afford. */}
        <p className="page-lead" style={{ marginTop: "-4px" }}>
          A one-off fee to build it, then a monthly plan to run it. Hosting, the domain, SSL
          and the upkeep are mine to look after, so nothing about the site is left for you to
          maintain.
        </p>
        <motion.div className="price-grid" variants={container} initial="hidden" animate="show">
          {SERVICE_PACKAGES.map((p) => (
            <PriceCard
              key={p.id}
              name={p.name}
              tagline={p.tagline}
              amount={p.from ? `$${p.from}+` : `$${p.flat}`}
              period={p.period}
              badge={p.badge}
              featured={p.featured}
              features={p.features}
              bonus={p.bonus}
              guarantee={p.guarantee}
              action={
                <a
                  className="btn-book"
                  href={CONTACT.calendly}
                  target="_blank"
                  rel="noreferrer noopener"
                >
                  Talk it through
                </a>
              }
            />
          ))}
        </motion.div>
      </section>

      {/* The monthly half of the same deal. Mirrors §5.1 of the Website Build
          & Hosting Agreement — if a price or an edit allowance moves here, it
          moves in the contract too. */}
      <section className="proj-section">
        <h3 className="proj-section__title">Keeping It Running</h3>
        <p className="page-lead" style={{ marginTop: "-4px" }}>
          Every site I build runs on one of these from launch day. You get a site that stays
          up, stays current and never needs you to touch a hosting dashboard.
        </p>
        <motion.div className="price-grid" variants={container} initial="hidden" animate="show">
          {WEBSITE_CARE_PLANS.map((p) => (
            <PriceCard
              key={p.id}
              name={p.name}
              tagline={p.tagline}
              amount={`$${p.flat}`}
              period={p.period}
              badge={p.badge}
              featured={p.featured}
              features={p.features}
              action={
                <a
                  className="btn-book"
                  href={CONTACT.calendly}
                  target="_blank"
                  rel="noreferrer noopener"
                >
                  Talk it through
                </a>
              }
            />
          ))}
        </motion.div>
        <ul className="care-notes">
          {WEBSITE_CARE_NOTES.map((n) => (
            <li key={n}>{n}</li>
          ))}
        </ul>
      </section>

      {/* Was a two-question feedback form. Asking a stranger what they thought
          of a template is one more thing to fill in before they can say the
          thing they actually came to say, so the page ends with a message
          instead: name, a way to reach them, and whatever they want. */}
      <section className="proj-section">
        <h3 className="proj-section__title">Send a Message</h3>
        <motion.div className="card work-message" variants={cardIn} initial="hidden" animate="show">
          <p className="card-body">
            Took a template, want one built, or just have a question? Write it here and I&apos;ll
            get back to you.
          </p>
          <MessageForm placeholder="What do you need? A site built, a template set up, or something else." />
        </motion.div>
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
