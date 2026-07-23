import { useState } from "react";
import { motion } from "framer-motion";
import Page, { container, cardIn } from "../components/Page";
import { CONTACT, SOCIAL_PACKAGES, SERVICE_CATEGORIES } from "../siteData";

// Calendly inline embed, themed to match the site.
const CALENDLY_EMBED =
  CONTACT.calendly +
  "?embed_type=Inline&hide_gdpr_banner=1&background_color=101010&text_color=ffffff&primary_color=64cefb" +
  "&embed_domain=" +
  (typeof window !== "undefined" ? window.location.hostname : "tamer-ao-portfolio.netlify.app");

/* Contact form posts to Netlify Forms (static mirror lives in index.html). */
function MessageForm() {
  const [status, setStatus] = useState("idle");

  async function handleSubmit(e) {
    e.preventDefault();
    setStatus("sending");
    const body = new URLSearchParams(new FormData(e.target)).toString();
    try {
      const res = await fetch("/", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body,
      });
      if (!res.ok) throw new Error();
      setStatus("sent");
    } catch {
      setStatus("error");
    }
  }

  if (status === "sent") {
    return (
      <p className="form-status form-status--ok">
        Message sent. I&apos;ll get back to you soon.
      </p>
    );
  }

  return (
    <form className="msg-form" name="contact" onSubmit={handleSubmit}>
      <input type="hidden" name="form-name" value="contact" />
      <p className="hp" aria-hidden="true">
        <input name="bot-field" tabIndex={-1} autoComplete="off" />
      </p>
      <div className="msg-form__row">
        <input name="name" type="text" placeholder="Your name" required />
        <input name="email" type="email" placeholder="Your email" required />
      </div>
      <textarea
        name="message"
        rows={5}
        placeholder="What do you have in mind?"
        required
      />
      <div className="msg-form__foot">
        <button className="btn-book" type="submit" disabled={status === "sending"}>
          {status === "sending" ? "Sending…" : "Send message"}
        </button>
        {status === "error" && (
          <span className="form-status form-status--err">
            Couldn&apos;t send. Email me instead:{" "}
            <a href={`mailto:${CONTACT.email}`}>{CONTACT.email}</a>
          </span>
        )}
      </div>
    </form>
  );
}

export default function WorkWithMe() {
  return (
    <Page>
      <header className="topbar">
        <div>
          <h2 className="topbar__title">Work With Me</h2>
          <p className="topbar__sub">Social media, branding &amp; digital design</p>
        </div>
      </header>

      {/* Hero: book the meeting */}
      <motion.section
        className="card work-booking work-booking--hero"
        variants={cardIn}
        initial="hidden"
        animate="show"
      >
        <div className="work-booking__head">
          <h3 className="card-title">Book a free 30-min meeting</h3>
          <p className="card-body">
            Content that sells and design that stands out. Pick a time and let&apos;s plan
            it together.
          </p>
        </div>
        <iframe
          className="calendly-frame"
          src={CALENDLY_EMBED}
          title="Book a free 30-minute meeting with Tamer"
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
          or send a message below.
        </p>
      </motion.section>

      {/* Social media */}
      <section className="proj-section">
        <h3 className="proj-section__title">Social media</h3>
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
              {p.save && <span className="price-card__save">{p.save}</span>}
              <ul className="price-card__features">
                {p.features.map((f) => (
                  <li key={f}>
                    <span className="tick" aria-hidden="true" />
                    {f}
                  </li>
                ))}
                {p.bonus && (
                  <li className="price-card__bonus">
                    <span className="tick tick--gift" aria-hidden="true" />
                    {p.bonus}
                  </li>
                )}
              </ul>
              <a
                className="btn-book"
                href="#top"
                onClick={(e) => {
                  e.preventDefault();
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
              >
                {p.cta}
              </a>
            </motion.article>
          ))}
        </motion.div>
        <p className="price-note">
          Prices in USD, month-to-month, cancel anytime. Prepay 3 months and save 15%.
        </p>
      </section>

      {/* Design & identities, Clothing */}
      <section className="proj-section">
        <h3 className="proj-section__title">One-off work</h3>
        <motion.div
          className="cat-grid"
          variants={container}
          initial="hidden"
          animate="show"
        >
          {SERVICE_CATEGORIES.map((c) => (
            <motion.article className="card work-cat" key={c.name} variants={cardIn}>
              <h4 className="work-cat__name">{c.name}</h4>
              <p className="work-cat__desc">{c.desc}</p>
              <div className="chip-row">
                {c.chips.map((chip) => (
                  <span className="chip" key={chip}>
                    {chip}
                  </span>
                ))}
              </div>
            </motion.article>
          ))}
        </motion.div>
        <p className="price-note">Monthly clients get a discount on all one-off work.</p>
      </section>

      {/* Message form */}
      <section className="proj-section">
        <h3 className="proj-section__title">Send a message</h3>
        <motion.div
          className="card work-message"
          variants={cardIn}
          initial="hidden"
          animate="show"
        >
          <p className="card-body">
            Tell me what you need and I&apos;ll get back to you.
          </p>
          <MessageForm />
        </motion.div>
      </section>
    </Page>
  );
}
