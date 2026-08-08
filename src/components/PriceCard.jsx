import { motion } from "framer-motion";
import { cardIn } from "./Page";

/* One pricing card, shared by Work With Me, Fitness and the website store.
 *
 * It exists because the three pages had drifted: the same card rendered a
 * "save" value as a corner pill on one page and a left-hand pill on another,
 * so the same idea looked like two different components. Everything about how
 * a price is presented now lives here.
 *
 * `was` + `anchorNote` are the price comparison. Pass them ONLY where the
 * comparison is real and checkable — the same thing bought the other way — not
 * as a place to put a slogan. Slogans go in `badge`.
 *
 * `action` is the card's footer: a link, a button, or nothing. Each page owns
 * its own call to action, so the card does not try to guess it.
 */
export default function PriceCard({
  name,
  tagline,
  amount,
  period,
  was,
  anchorNote,
  badge,
  featured,
  features = [],
  bonus,
  guarantee,
  action,
}) {
  return (
    <motion.article
      className={"card price-card" + (featured ? " price-card--featured" : "")}
      variants={cardIn}
    >
      {badge && <span className="price-card__badge">{badge}</span>}

      <div className="price-card__head">
        <h4 className="price-card__name">{name}</h4>
        {tagline && <p className="price-card__tagline">{tagline}</p>}
      </div>

      <div className="price-card__price">
        {was && <s className="price-card__was">{was}</s>}
        <span className="price-card__amount">{amount}</span>
        {period && <span className="price-card__period">{period}</span>}
        {was && anchorNote && (
          <span className="price-card__anchor-note">vs {anchorNote}</span>
        )}
      </div>

      <ul className="price-card__features">
        {features.map((f) => (
          <li key={f}>
            <span className="tick" aria-hidden="true" />
            {f}
          </li>
        ))}
        {bonus && (
          <li>
            <span className="tick tick--gift" aria-hidden="true" />
            <span className="price-card__bonus">{bonus}</span>
          </li>
        )}
      </ul>

      {guarantee && <p className="price-card__guarantee">{guarantee}</p>}

      {action}
    </motion.article>
  );
}
