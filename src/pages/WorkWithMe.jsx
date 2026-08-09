import { useState } from "react";
import { motion } from "framer-motion";
import Page, { container, cardIn } from "../components/Page";
import PriceCard from "../components/PriceCard";
import { TrustedBy, Testimonials } from "../components/SocialProof";
import {
  CONTACT,
  SOCIAL_PACKAGES,
  SOCIAL_GUARANTEE,
  SERVICE_CATEGORIES,
} from "../siteData";

// Calendly inline embed, themed to match the site.
const CALENDLY_EMBED =
  CONTACT.calendly +
  "?embed_type=Inline&hide_gdpr_banner=1&background_color=101010&text_color=ffffff&primary_color=64cefb" +
  "&embed_domain=" +
  (typeof window !== "undefined" ? window.location.hostname : "portfolio.tamerao.workers.dev");

/* Contact form posts to the site's own Worker (worker/index.js), which files
 * the message in KV next to the template leads. Read them back at
 * /api/leads?token=... — same endpoint, newest first.
 *
 * It posted to "/" for Netlify Forms until the move to Cloudflare, where that
 * POST answers 405 and the message goes nowhere. */
function MessageForm() {
  const [status, setStatus] = useState("idle");

  async function handleSubmit(e) {
    e.preventDefault();
    setStatus("sending");
    const body = Object.fromEntries(new FormData(e.target).entries());
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      // Only call it sent if the server actually said so. Reporting success on
      // a failed post is worse than showing the error: the message is lost and
      // nobody knows to follow up.
      const data = await res.json().catch(() => ({}));
      if (!res.ok || !data.ok) throw new Error();
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
          <h2 className="topbar__title">Services &amp; Pricing</h2>
          <p className="topbar__sub">Social media, branding, websites &amp; design</p>
        </div>
      </header>

      {/* Hero: book the meeting */}
      <motion.section
        className="card work-booking work-booking--hero"
        variants={cardIn}
        initial="hidden"
        animate="show"
      >
        <div className="work-booking__grid">
          <div className="work-booking__head">
            <h3 className="card-title">Book a free 30-min call</h3>
            <p className="card-body">
              Content that sells and design that stands out. Pick a time and we&apos;ll
              plan it together. No pitch, no obligation.
            </p>
            <a
              className="btn-book work-booking__direct"
              href={CONTACT.calendly}
              target="_blank"
              rel="noreferrer"
            >
              Open in Calendly
            </a>
          </div>
          <iframe
            className="calendly-frame"
            src={CALENDLY_EMBED}
            title="Book a free 30-minute meeting with Tamer"
          />
        </div>
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

      {/* Credibility before the ask */}
      <TrustedBy />
      <Testimonials />

      {/* Social media */}
      <section className="proj-section">
        <h3 className="proj-section__title">Social media</h3>
        <p className="page-lead" style={{ marginTop: "-4px" }}>
          Reels are what actually reach people. Mine have done 830K+ views, with five past 30,000
          and a best post at 219,000. Every plan is built reels-first to get you seen.
        </p>
        <motion.div
          className="price-grid"
          variants={container}
          initial="hidden"
          animate="show"
        >
          {SOCIAL_PACKAGES.map((p) => (
            <PriceCard
              key={p.name}
              name={p.name}
              tagline={p.tagline}
              amount={p.price}
              period={p.period}
              was={p.anchor ? `$${p.anchor.toLocaleString("en-US")}` : undefined}
              anchorNote={p.anchorNote}
              badge={p.featured ? "Most popular" : undefined}
              featured={p.featured}
              features={p.features}
              bonus={p.bonus}
              action={
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
              }
            />
          ))}
        </motion.div>

        {/* Risk reversal under the tier row, where the "what if it doesn't
            work" objection actually lands. This replaced a 15% prepay
            discount: cutting the price to win the deal trains people to wait
            for a cut, where taking the risk off them costs nothing unless the
            work genuinely fails. */}
        <motion.div
          className="card offer-guarantee"
          variants={cardIn}
          initial="hidden"
          animate="show"
          style={{ marginTop: "var(--gap)" }}
        >
          <h4 className="offer-guarantee__title">{SOCIAL_GUARANTEE.title}</h4>
          <p className="offer-guarantee__body">{SOCIAL_GUARANTEE.body}</p>
        </motion.div>

        <p className="price-note">
          Prices in USD, month-to-month, cancel anytime. Single reels without a package are
          $65 each.
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
        {/* Was "monthly clients get a discount on all one-off work". Framing a
            perk as a discount teaches people the list price is soft; framing
            the same perk as access does not. */}
        <p className="price-note">
          Monthly clients go to the front of the queue on one-off work, at their member rate.
        </p>
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
