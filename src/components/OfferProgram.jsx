import { motion } from "framer-motion";
import { cardIn } from "./Page";
import { CONTACT } from "../siteData";

/* One Grand Slam offer, rendered.
 *
 * This was the DefenseProgram function inside Fitness.jsx. It is out here
 * because the websites page now leads with an offer of exactly the same shape,
 * and two copies of this markup would have drifted the moment either page was
 * touched. The data lives in siteData.js — DEFENSE_PROGRAM and
 * WEBSITE_PROGRAM — and both objects carry the same fields.
 *
 * The order is the argument, and it is not arbitrary: what you get, who it is
 * for, how it runs, what it is worth, what it costs, what happens if it
 * doesn't work, and why you cannot have it whenever you feel like it. A page
 * that opens with credentials asks a visitor to be impressed before they have
 * been told what is on sale.
 */

const money = (n) => "$" + n.toLocaleString("en-US");

export default function OfferProgram({ program, id, phasesTitle = "How the 90 days run" }) {
  const p = program;
  const stackTotal =
    p.stack.reduce((sum, s) => sum + s.value, 0) +
    p.bonuses.reduce((sum, b) => sum + b.value, 0);

  return (
    /* An id starting with a digit is legal HTML but is not a valid CSS
       selector, so #90-day-program throws rather than matching. */
    <section className="proj-section" id={id}>
      <motion.article className="card offer" variants={cardIn} initial="hidden" animate="show">
        <header>
          <p className="offer__kicker">{p.kicker}</p>
          <h2 className="offer__name">{p.name}</h2>
          <p className="offer__promise">{p.promise}</p>
          <p className="offer__proof">{p.proof}</p>
        </header>

        {/* Three tracks. Same program, three different people walking in. */}
        <div className="offer__tracks">
          {p.tracks.map((t) => (
            <div className="offer-track" key={t.id}>
              <span className="offer-track__who">{t.who}</span>
              <h3 className="offer-track__name">{t.name}</h3>
              <p className="offer-track__pain">&ldquo;{t.pain}&rdquo;</p>
              <p className="offer-track__outcome">{t.outcome}</p>
              <p className="offer-track__note">{t.note}</p>
            </div>
          ))}
        </div>

        {/* The route to the outcome, so 90 days reads as a plan not a guess. */}
        <div>
          <h3 className="section-title" style={{ fontSize: "clamp(18px,1.7vw,24px)" }}>
            {phasesTitle}
          </h3>
          <div className="offer__phases">
            {p.phases.map((ph) => (
              <div className="offer-phase" key={ph.weeks}>
                <span className="offer-phase__weeks">{ph.weeks}</span>
                <h4 className="offer-phase__title">{ph.title}</h4>
                <p className="offer-phase__body">{ph.body}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="offer__stack-wrap">
          {/* Everything included, priced at what it costs bought separately. */}
          <div>
            <h3 className="section-title" style={{ fontSize: "clamp(18px,1.7vw,24px)" }}>
              Everything you get
            </h3>
            <div className="offer-stack">
              {p.stack.map((s) => (
                <div className="offer-stack__row" key={s.item}>
                  <span className="offer-stack__item">{s.item}</span>
                  <span className="offer-stack__value">{money(s.value)}</span>
                </div>
              ))}
              {p.bonuses.map((b) => (
                <div className="offer-stack__row offer-stack__row--bonus" key={b.name}>
                  <span className="offer-stack__item">
                    <span className="offer-stack__tag">Bonus</span>
                    {b.name}
                    <span className="offer-bonus__body">{b.body}</span>
                  </span>
                  <span className="offer-stack__value">{money(b.value)}</span>
                </div>
              ))}
              <div className="offer-stack__total">
                <span>Total value</span>
                <s>{money(stackTotal)}</s>
              </div>
            </div>
          </div>

          {/* The close. */}
          <div className="offer-close">
            <div>
              <div className="offer-close__price">
                <span className="offer-close__amount">{money(p.price)}</span>
              </div>
              <p className="offer-close__period" style={{ marginTop: 6 }}>
                {p.period}
              </p>
            </div>

            <div className="offer-guarantee">
              <h3 className="offer-guarantee__title">{p.guarantee.title}</h3>
              <p className="offer-guarantee__body">{p.guarantee.body}</p>
            </div>

            <p className="offer-close__seats">
              <strong>{p.intake.label}</strong> {p.intake.cadence} {p.intake.reason}
            </p>

            <a
              className="btn-book offer-close__btn"
              href={CONTACT.calendly}
              target="_blank"
              rel="noreferrer noopener"
            >
              {p.cta}
            </a>

            {/* Only the website program carries terms today. Stating the catch
                on the page beats letting a buyer find it in the agreement. */}
            {p.terms && <p className="offer-close__terms">{p.terms}</p>}
          </div>
        </div>
      </motion.article>
    </section>
  );
}
