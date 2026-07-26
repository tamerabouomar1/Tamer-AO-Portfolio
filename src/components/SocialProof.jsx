import { motion } from "framer-motion";
import { cardIn, container } from "./Page";
import { CLIENTS, TESTIMONIALS } from "../siteData";

/**
 * "Trusted by" — the real client roster. Nothing here is decorative:
 * every name maps to delivered work shown elsewhere on the site.
 */
export function TrustedBy({ title = "Trusted by" }) {
  if (!CLIENTS.length) return null;
  return (
    <section className="proj-section trusted">
      <h3 className="trusted__title">{title}</h3>
      <motion.ul
        className="trusted__row"
        variants={container}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-40px" }}
      >
        {CLIENTS.map((name) => (
          <motion.li className="trusted__item" key={name} variants={cardIn}>
            {name}
          </motion.li>
        ))}
      </motion.ul>
    </section>
  );
}

/**
 * Client testimonials. Renders nothing until real quotes exist in
 * TESTIMONIALS, so the page never shows an empty "reviews" shell.
 */
export function Testimonials({ title = "What clients say" }) {
  if (!TESTIMONIALS.length) return null;
  return (
    <section className="proj-section">
      <h3 className="proj-section__title">{title}</h3>
      <motion.div
        className="quote-grid"
        variants={container}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-40px" }}
      >
        {TESTIMONIALS.map((t) => (
          <motion.figure className="card quote" key={t.name + t.quote.slice(0, 12)} variants={cardIn}>
            <blockquote className="quote__text">{t.quote}</blockquote>
            <figcaption className="quote__who">
              <span className="quote__name">{t.name}</span>
              {(t.role || t.project) && (
                <span className="quote__role">
                  {[t.role, t.project].filter(Boolean).join(" · ")}
                </span>
              )}
            </figcaption>
          </motion.figure>
        ))}
      </motion.div>
    </section>
  );
}
