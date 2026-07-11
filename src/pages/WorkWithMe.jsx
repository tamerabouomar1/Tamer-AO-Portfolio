import { motion } from "framer-motion";
import Page, { container, cardIn } from "../components/Page";
import {
  CONTACT,
  INQUIRY_MAILTO,
  SOCIAL_PACKAGES,
  EXTRA_SERVICES,
} from "../siteData";

export default function WorkWithMe() {
  const bookProps = { target: "_blank", rel: "noreferrer" };

  return (
    <Page>
      <header className="topbar">
        <div>
          <h2 className="topbar__title">Work With Me</h2>
          <p className="topbar__sub">Social media, branding &amp; digital design</p>
        </div>
        <a className="link" href={CONTACT.calendly} {...bookProps}>
          Book a free call <span className="plus">+</span>
        </a>
      </header>

      {/* Intro — personalized */}
      <motion.section
        className="card cta work-intro"
        variants={cardIn}
        initial="hidden"
        animate="show"
        style={{ minHeight: 0 }}
      >
        <h3 className="card-title">Let&apos;s grow your brand</h3>
        <p className="card-body">
          I&apos;m Tamer, a Beirut-based graphic designer and Adobe expert. I run social
          media the way an athlete trains — consistent, sharp and built to perform. From a
          full monthly content plan to a single logo, I&apos;ll make your brand look like it
          means business. Not sure what you need? Book a free 30-minute call and we&apos;ll
          map it out together.
        </p>
        <a className="link" href={CONTACT.calendly} {...bookProps}>
          Book a free 30-min call <span className="plus">+</span>
        </a>
      </motion.section>

      {/* Social media packages */}
      <section className="proj-section">
        <h3 className="proj-section__title">
          Social Media Management — Monthly Packages
        </h3>
        <motion.div
          className="price-grid"
          variants={container}
          initial="hidden"
          animate="show"
        >
          {SOCIAL_PACKAGES.map((p) => (
            <motion.article
              className={"card price-card" + (p.featured ? " price-card--featured" : "")}
              key={p.name}
              variants={cardIn}
            >
              {p.featured && <span className="price-card__badge">Most popular</span>}
              <div className="price-card__head">
                <h4 className="price-card__name">{p.name}</h4>
                <p className="price-card__tagline">{p.tagline}</p>
              </div>
              <div className="price-card__price">
                <span className="price-card__amount">{p.price}</span>
                <span className="price-card__period">{p.period}</span>
              </div>
              <ul className="price-card__features">
                {p.features.map((f) => (
                  <li key={f}>
                    <span className="tick" aria-hidden="true" />
                    {f}
                  </li>
                ))}
              </ul>
              <a className="btn-book" href={CONTACT.calendly} {...bookProps}>
                {p.cta}
              </a>
            </motion.article>
          ))}
        </motion.div>
        <p className="price-note">
          Prices in USD. Every package is tailored to your brand — mix, match or scale it on
          our free call. Longer commitments and bundles get a better rate.
        </p>
      </section>

      {/* One-off / custom work */}
      <section className="proj-section">
        <h3 className="proj-section__title">One-off &amp; custom work</h3>
        <motion.div
          className="work-services"
          variants={container}
          initial="hidden"
          animate="show"
        >
          {EXTRA_SERVICES.map((s) => (
            <motion.article className="card work-service" key={s.name} variants={cardIn}>
              <h4 className="work-service__name">{s.name}</h4>
              <p className="work-service__desc">{s.desc}</p>
            </motion.article>
          ))}
        </motion.div>
      </section>

      {/* Booking + inquiry */}
      <section className="work-cta-row">
        <motion.article
          className="card work-cta"
          variants={cardIn}
          initial="hidden"
          animate="show"
        >
          <h3 className="card-title">Free 30-min discovery call</h3>
          <p className="card-body">
            A no-pressure Zoom call to talk through your goals and see if we&apos;re a fit.
            Come with questions, leave with a plan — no commitment.
          </p>
          <a className="btn-book btn-book--lg" href={CONTACT.calendly} {...bookProps}>
            Book your free call
          </a>
        </motion.article>

        <motion.article
          className="card work-cta"
          variants={cardIn}
          initial="hidden"
          animate="show"
        >
          <h3 className="card-title">Something else in mind?</h3>
          <p className="card-body">
            A logo, a full brand identity, apparel, motion, a website — or anything digital.
            Tell me what you&apos;re after and I&apos;ll get back to you.
          </p>
          <div className="contact-list">
            <a href={INQUIRY_MAILTO}>
              <span className="dot" />
              {CONTACT.email}
            </a>
            <a href={CONTACT.phoneHref}>
              <span className="dot" />
              {CONTACT.phone}
            </a>
          </div>
          <a className="link" href={INQUIRY_MAILTO}>
            Send an inquiry <span className="plus">+</span>
          </a>
        </motion.article>
      </section>
    </Page>
  );
}
