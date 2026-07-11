import { motion } from "framer-motion";
import Page, { container, cardIn } from "../components/Page";
import { CONTACT, MESSAGE_MAILTO, SOCIAL_PACKAGES, EXTRA_SERVICES } from "../siteData";

// Calendly inline embed, themed to match the site.
const CALENDLY_EMBED =
  CONTACT.calendly +
  "?embed_type=Inline&hide_gdpr_banner=1&background_color=101010&text_color=ffffff&primary_color=64cefb" +
  "&embed_domain=" +
  (typeof window !== "undefined" ? window.location.hostname : "tamer-ao-portfolio.netlify.app");

export default function WorkWithMe() {
  // Package CTAs scroll to the embedded calendar below — booking stays on the page.
  const scrollToBook = (e) => {
    e.preventDefault();
    document.getElementById("book")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <Page>
      <header className="topbar">
        <div>
          <h2 className="topbar__title">Work With Me</h2>
          <p className="topbar__sub">Social media, branding &amp; digital design</p>
        </div>
      </header>

      <motion.p
        className="page-lead"
        variants={cardIn}
        initial="hidden"
        animate="show"
      >
        Monthly social media management or one-off design work — pick a package, then book
        a free 30-minute meeting below.
      </motion.p>

      {/* Social media packages */}
      <section className="proj-section">
        <h3 className="proj-section__title">Social media packages</h3>
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
              <a className="btn-book" href="#book" onClick={scrollToBook}>
                {p.cta}
              </a>
            </motion.article>
          ))}
        </motion.div>
        <p className="price-note">
          Prices in USD — every package gets tailored to your brand on our first meeting.
        </p>
      </section>

      {/* One-off work — one compact line */}
      <section className="proj-section">
        <h3 className="proj-section__title">One-off work</h3>
        <motion.div
          className="card work-oneoff"
          variants={cardIn}
          initial="hidden"
          animate="show"
        >
          <div className="chip-row">
            {EXTRA_SERVICES.map((s) => (
              <span className="chip" key={s}>
                {s}
              </span>
            ))}
          </div>
          <a className="link" href={MESSAGE_MAILTO}>
            Send a message <span className="plus">+</span>
          </a>
        </motion.div>
      </section>

      {/* Booking — embedded in the portfolio */}
      <section className="proj-section" id="book">
        <h3 className="proj-section__title">Book a free 30-min meeting</h3>
        <motion.div
          className="card work-booking"
          variants={cardIn}
          initial="hidden"
          animate="show"
        >
          <iframe
            className="calendly-frame"
            src={CALENDLY_EMBED}
            title="Book a free 30-minute meeting with Tamer"
            loading="lazy"
          />
          <p className="price-note">
            Calendar not loading?{" "}
            <a
              className="work-booking__fallback"
              href={CONTACT.calendly}
              target="_blank"
              rel="noreferrer"
            >
              Open Calendly in a new tab
            </a>{" "}
            — or email{" "}
            <a className="work-booking__fallback" href={MESSAGE_MAILTO}>
              {CONTACT.email}
            </a>
            .
          </p>
        </motion.div>
      </section>
    </Page>
  );
}
