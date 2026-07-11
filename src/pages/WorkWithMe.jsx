import { motion } from "framer-motion";
import Page, { container, cardIn } from "../components/Page";
import {
  CONTACT,
  MESSAGE_MAILTO,
  SOCIAL_PACKAGES,
  EXTRA_SERVICES,
} from "../siteData";

// Calendly inline embed, themed to match the site.
const CALENDLY_EMBED =
  CONTACT.calendly +
  "?embed_type=Inline&hide_gdpr_banner=1&background_color=101010&text_color=ffffff&primary_color=64cefb" +
  "&embed_domain=" +
  (typeof window !== "undefined" ? window.location.hostname : "tamer-ao-portfolio.netlify.app");

export default function WorkWithMe() {
  // Every "book a meeting" action scrolls to the embedded calendar below —
  // booking happens inside the portfolio, no new tab.
  const scrollToBook = (e) => {
    e.preventDefault();
    document.getElementById("book")?.scrollIntoView({ behavior: "smooth" });
  };
  const bookProps = { href: "#book", onClick: scrollToBook };

  return (
    <Page>
      <header className="topbar">
        <div>
          <h2 className="topbar__title">Work With Me</h2>
          <p className="topbar__sub">Social media, branding &amp; digital design</p>
        </div>
        <a className="link" {...bookProps}>
          Book a meeting <span className="plus">+</span>
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
          means business. Not sure what you need? Book a free 30-minute meeting right here
          on this page, or send me an email.
        </p>
        <div className="work-intro__actions">
          <a className="link" {...bookProps}>
            Book a meeting <span className="plus">+</span>
          </a>
          <a className="link" href={MESSAGE_MAILTO}>
            Send an email <span className="plus">+</span>
          </a>
        </div>
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
              <a className="btn-book" {...bookProps}>
                {p.cta}
              </a>
            </motion.article>
          ))}
        </motion.div>
        <p className="price-note">
          Prices in USD. Every package is tailored to your brand — we&apos;ll shape the
          right one together in a free meeting. Need more volume or extra platforms? It
          scales; just ask.
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
        <p className="price-note">
          For any of these, book a meeting below or send an email with what you have in
          mind.
        </p>
      </section>

      {/* Booking — embedded in the portfolio */}
      <section className="proj-section" id="book">
        <h3 className="proj-section__title">Book a meeting</h3>
        <motion.div
          className="card work-booking"
          variants={cardIn}
          initial="hidden"
          animate="show"
        >
          <p className="card-body">
            A free 30-minute meeting — no pressure, no commitment. Pick a time that works
            for you and we&apos;ll talk through your goals.
          </p>
          <iframe
            className="calendly-frame"
            src={CALENDLY_EMBED}
            title="Book a free 30-minute meeting with Tamer"
            loading="lazy"
          />
          <p className="price-note">
            Calendar not loading?{" "}
            <a className="work-booking__fallback" href={CONTACT.calendly} target="_blank" rel="noreferrer">
              Open Calendly in a new tab
            </a>{" "}
            or{" "}
            <a className="work-booking__fallback" href={MESSAGE_MAILTO}>
              send an email
            </a>
            .
          </p>
        </motion.div>
      </section>

      {/* Send a message */}
      <section className="work-cta-row">
        <motion.article
          className="card work-cta"
          variants={cardIn}
          initial="hidden"
          animate="show"
        >
          <h3 className="card-title">Something else in mind?</h3>
          <p className="card-body">
            A logo, a full brand identity, apparel, motion, a website — or anything
            digital. Send me a message and I&apos;ll get back to you.
          </p>
          <div className="contact-list">
            <a href={MESSAGE_MAILTO}>
              <span className="dot" />
              {CONTACT.email}
            </a>
            <a href={CONTACT.phoneHref}>
              <span className="dot" />
              {CONTACT.phone}
            </a>
          </div>
          <a className="btn-book" href={MESSAGE_MAILTO}>
            Send a message
          </a>
        </motion.article>

        <motion.article
          className="card work-cta"
          variants={cardIn}
          initial="hidden"
          animate="show"
        >
          <h3 className="card-title">Prefer to talk it through?</h3>
          <p className="card-body">
            The fastest way to figure out what you need — a free 30-minute meeting, booked
            right here on the page.
          </p>
          <a className="btn-book btn-book--lg" {...bookProps}>
            Book a meeting
          </a>
        </motion.article>
      </section>
    </Page>
  );
}
