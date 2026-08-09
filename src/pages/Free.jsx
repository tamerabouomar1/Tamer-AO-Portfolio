import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import Page, { container, cardIn } from "../components/Page";
import { TrustedBy } from "../components/SocialProof";
import { CONTACT, FREE_OFFERS } from "../siteData";

/* The four free offers, on one page.
 *
 * This is the landing spot for "Start free" and for the hero card on Home. It
 * is deliberately the least defensive page on the site: no price, no tier
 * comparison, no form before the value. The only job here is to get something
 * of Tamer's into someone's hands, because a person who has held the work has
 * stopped wondering whether it is any good.
 *
 * Each card names its own catch. A free offer with an unstated motive reads
 * as a trick, and the reader spends the whole card hunting for the hook
 * instead of considering the offer.
 */
export default function Free() {
  return (
    <Page>
      <header className="topbar">
        <div>
          <h2 className="topbar__title">Start free</h2>
          <p className="topbar__sub">Four things, no card, no obligation</p>
        </div>
        <Link className="link" to="/work-with-me">
          See the paid work <span className="plus">+</span>
        </Link>
      </header>

      <motion.p
        className="page-lead"
        variants={cardIn}
        initial="hidden"
        animate="show"
        style={{ maxWidth: "68ch" }}
      >
        Take a finished website, a brand teardown, your first reel, or an hour of coaching.
        All four cost nothing. Decide about the paid work afterwards, once you have seen what
        mine looks like.
      </motion.p>

      <motion.div
        className="free-grid"
        variants={container}
        initial="hidden"
        animate="show"
      >
        {FREE_OFFERS.map((o) => (
          <motion.article className="card free-card" key={o.id} variants={cardIn}>
            <span className="free-card__worth">{o.worth}</span>
            <h3 className="free-card__name">{o.name}</h3>
            <p className="free-card__lede">{o.lede}</p>

            <ul className="price-card__features">
              {o.features.map((f) => (
                <li key={f}>
                  <span className="tick" aria-hidden="true" />
                  {f}
                </li>
              ))}
            </ul>

            <p className="free-card__catch">
              <span className="free-card__catch-label">The catch</span>
              {o.catch}
            </p>

            {o.calendly ? (
              <a
                className="btn-book"
                href={CONTACT.calendly}
                target="_blank"
                rel="noreferrer"
              >
                {o.cta}
              </a>
            ) : (
              <Link className="btn-book" to={o.to}>
                {o.cta}
              </Link>
            )}
          </motion.article>
        ))}
      </motion.div>

      <TrustedBy />
    </Page>
  );
}
