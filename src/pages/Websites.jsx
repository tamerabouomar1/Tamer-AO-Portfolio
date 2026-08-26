import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import Page, { container, cardIn } from "../components/Page";
import LiveThumb from "../components/LiveThumb";
import { LoadBar, LoadingImage } from "../components/LoadBar";
import { BuyModalHost } from "../components/BuyModal";
import { MemberModalHost } from "../components/MemberModal";
import PriceCard from "../components/PriceCard";
import MessageForm from "../components/MessageForm";
import { prefetchTemplate } from "../templates/registry";
import {
  CONTACT,
  TEMPLATES,
  TEMPLATE_PACKAGES,
  GALLERY_PREVIEW_COUNT,
  SERVICE_PACKAGES,
  WEBSITE_CARE_PLANS,
  WEBSITE_CARE_NOTES,
  WEBSITE_CHANGE_RATES,
  WEBSITES,
  subscribeUrl,
} from "../siteData";

/* The footer of any card for a plan billed monthly.
 *
 * Two states, decided by whether SUBSCRIBE_LINKS has a real URL for the plan:
 * with one, the card is self-serve and Subscribe is the primary call, with
 * booking a call demoted to a quiet line underneath — somebody ready to pay
 * should never have to book a meeting to do it. Without one, the card keeps
 * exactly the call to action it had before, so an unfilled link is invisible
 * to a visitor rather than a dead button.
 *
 * Checkout is a hosted page on the processor's domain, so this is a plain
 * link, not a fetch: no card details ever touch this site. */
function SubscribeAction({ id, label = "Subscribe monthly" }) {
  const url = subscribeUrl(id);

  if (!url) {
    return (
      <a className="btn-book" href={CONTACT.calendly} target="_blank" rel="noreferrer noopener">
        Talk it through
      </a>
    );
  }

  return (
    <>
      <a className="btn-book" href={url} target="_blank" rel="noreferrer noopener">
        {label}
      </a>
      <p className="price-card__alt">
        or{" "}
        <a className="link" href={CONTACT.calendly} target="_blank" rel="noreferrer noopener">
          talk it through first
        </a>
      </p>
    </>
  );
}

/* One page covers both halves of the same question: sites already built for
   clients, and sites you can buy today. The store used to be its own
   destination in the nav; it lives here instead, under the heading people
   already click when they want a website. Client work comes first — it is the
   proof — and the offer follows it. */

/* One gallery card, deliberately thin.

   It used to carry a feature list, a "best for" line and a description on top
   of the preview, which across a whole gallery is a wall nobody reads. The
   live preview IS the pitch, so the card keeps a name, a kicker and the two
   things you can do with it — which lets three or four sit in a row instead
   of two, and lets someone scan the gallery instead of reading it. */
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
            <h3 className="web-card__title">{t.name}</h3>
            <span className="tpl-card__kicker">{t.kicker}</span>
          </div>
          <span className="tpl-card__amount">Free</span>
        </div>

        <div className="tpl-card__actions">
          <Link
            className="btn-book tpl-card__preview"
            to={`/templates/${t.slug}`}
            onMouseEnter={() => prefetchTemplate(t.slug)}
          >
            Preview
          </Link>
          <button className="btn-book tpl-card__buy" onClick={() => onBuy(t)}>
            Get it free
          </button>
        </div>
      </div>
    </motion.article>
  );
}

/* The last tile in the gallery grid, and the only call to action in it.

   There were briefly two: a "view the full gallery" button that revealed the
   rest for free, and a separate "become a member" card. A visitor reads those
   as the same job offered twice, and two buttons for one decision is how you
   get neither pressed. They are one thing now — the rest of the gallery IS
   the membership, along with every font and next week's template.

   It sits in the grid rather than under it so the plus lands exactly where the
   templates stop, which is the moment somebody is already wondering whether
   there are more. */
function MemberCard({ onOpen }) {
  return (
    <motion.button type="button" className="card tpl-more" variants={cardIn} onClick={onOpen}>
      <span className="tpl-more__plus" aria-hidden="true">
        +
      </span>
      <span className="tpl-more__title">See the full gallery</span>
      <span className="tpl-more__sub">
        The rest of the templates, every font with them, and whatever ships next week.
        One download, $19 a month.
      </span>
      <span className="link tpl-more__go">
        Become a member <span className="plus">+</span>
      </span>
    </motion.button>
  );
}

export default function Websites() {
  const [active, setActive] = useState(null); // client site, or null
  const [buying, setBuying] = useState(null); // template being bought, or null
  const [siteReady, setSiteReady] = useState(false); // popup iframe loaded?
  const [joining, setJoining] = useState(false); // membership window open?

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
          <h1 className="topbar__title">Website Design in Lebanon</h1>
          <p className="topbar__sub">Designed &amp; built, end to end</p>
        </div>
        <Link className="link" to="/work-with-me">
          Work with me <span className="plus">+</span>
        </Link>
      </header>

      <section className="proj-section" style={{ marginTop: 0 }}>
        <h2 className="proj-section__title">Client Work</h2>
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
                <h3 className="web-card__title">{w.name}</h3>
                <p className="card-body">{w.desc}</p>
              </div>
            </motion.article>
          ))}
        </motion.div>
      </section>

      {/* What it costs, straight after the proof. This was a full-page offer
          block — the free build against $199 a month — which took up most of
          the page before a visitor reached a number. These are the prices in
          the FabricAID proposal: one setup fee, then a monthly plan. */}
      <section className="proj-section" id="pricing">
        <h2 className="section-title">What a Website Costs</h2>
        <p className="page-lead" style={{ marginTop: "-4px" }}>
          One setup fee to design, launch and get the site found on Google. Then a monthly
          plan, picked by how often you expect to want changes. Every price is here, so you
          can decide before you speak to me.
        </p>
        <motion.div className="price-grid" variants={container} initial="hidden" animate="show">
          {SERVICE_PACKAGES.map((p) => (
            <PriceCard
              key={p.id}
              name={p.name}
              tagline={p.tagline}
              amount={
                p.from
                  ? `$${p.from.toLocaleString("en-US")}+`
                  : `$${p.flat.toLocaleString("en-US")}`
              }
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
        <p className="price-note">
          Prices in USD. Half on signature, half on launch — the second half is due when
          the site is live, not on a date. Paid by OMT, Whish Money or bank transfer.
        </p>
      </section>

      {/* ── Ready-made sites ─────────────────────────────────── */}
      <section className="proj-section" id="store">
        <div className="storehead">
          <span className="storehead__flag">Free source · Something new every week</span>
          <h2 className="storehead__title">
            A gallery of finished websites.
            <br />
            <span className="storehead__accent">Take one, free.</span>
          </h2>
          <p className="storehead__lede">
            Every card is the real site running, not a screenshot. Open it, and if it fits,
            download it.
          </p>
        </div>

        {/* Most of the library, free and downloadable one at a time, then the
            single tile that opens the membership. No second button revealing
            the rest for free: that is what the membership is. */}
        <motion.div className="tpl-grid" variants={container} initial="hidden" animate="show">
          {TEMPLATES.slice(0, GALLERY_PREVIEW_COUNT).map((t) => (
            <TemplateCard key={t.slug} t={t} onBuy={setBuying} />
          ))}
          <MemberCard onOpen={() => setJoining(true)} />
        </motion.div>
      </section>

      <section className="proj-section">
        <div className="storehead storehead--sig">
          <h2 className="proj-section__title">Take One, or Take the Lot</h2>
          <p className="storehead__lede">
            One template costs nothing. The membership is the whole library, the fonts
            with it, and whatever ships next week.
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
                ) : subscribeUrl(p.id) ? (
                  /* Label reads off the plan's own period rather than its id,
                     so the yearly card doesn't say "monthly" and a future
                     quarterly tier needs no change here. */
                  <SubscribeAction
                    id={p.id}
                    label={
                      p.period?.includes("year") ? "Subscribe yearly" : "Subscribe monthly"
                    }
                  />
                ) : (
                  /* No hosted checkout yet, so the card opens the same
                     window the gallery gate opens — Whish, OMT or a
                     transfer. Sending somebody ready to pay off to book a
                     meeting instead was losing the sale at the till. */
                  <button className="btn-book" onClick={() => setJoining(true)}>
                    Become a member
                  </button>
                )
              }
            />
          ))}
        </motion.div>
        <p className="price-note">
          More on{" "}
          <Link className="link" to="/website-design-lebanon">
            website design in Lebanon
          </Link>{" "}
          and{" "}
          <Link className="link" to="/restaurant-website-lebanon">
            restaurant websites
          </Link>
          . Want something that isn&apos;t here? I build custom sites from scratch too.{" "}
          <Link className="link" to="/work-with-me">
            see how we&apos;d work together <span className="plus">+</span>
          </Link>
        </p>
      </section>
      {/* The monthly half of the same deal. Mirrors §5.1 of the Website Build
          & Hosting Agreement — if a price or an edit allowance moves here, it
          moves in the contract too. */}
      <section className="proj-section">
        <h2 className="section-title">Monthly Care</h2>
        <p className="page-lead" style={{ marginTop: "-4px" }}>
          Every plan keeps the site online, secure, backed up and monitored. What separates
          them is how changes are handled and how fast I answer. Already have a site built
          elsewhere? These work on that too.
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
              guarantee={p.guarantee}
              action={<SubscribeAction id={p.id} />}
            />
          ))}
        </motion.div>
        {/* The pay-as-you-go rates, printed next to the plans on purpose: they
            are what make the crossover checkable instead of a claim. Seven
            small changes on Online costs $100 — the price of Managed, which
            includes five of them and answers three working days sooner. */}
        <motion.div className="card rate-card" variants={cardIn} initial="hidden" animate="show">
          <h3 className="rate-card__title">On Online, every change is billed</h3>
          <ul className="rate-card__rows">
            {WEBSITE_CHANGE_RATES.map((r) => (
              <li key={r.what}>
                <span>{r.what}</span>
                <strong>{r.price}</strong>
              </li>
            ))}
          </ul>
          <p className="rate-card__note">
            Seven small text changes in a month on Online costs $30 plus $70 — exactly what
            Managed costs, except Managed includes five of them, answers three working days
            sooner and sends you a report. A single new page is $120, more than a whole
            month of Managed.
          </p>
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
        <h2 className="proj-section__title">Send a Message</h2>
        <motion.div className="card work-message" variants={cardIn} initial="hidden" animate="show">
          <p className="card-body">
            Took a template, want one built, or just have a question? Write it here and
            I&apos;ll get back to you.
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
      <MemberModalHost open={joining} onClose={() => setJoining(false)} />
    </Page>
  );
}
