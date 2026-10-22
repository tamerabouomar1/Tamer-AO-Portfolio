import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import Page, { container, cardIn } from "../components/Page";
import SplitHeading from "../components/SplitHeading";
import PriceCard from "../components/PriceCard";
import FreeOffers from "../components/FreeOffers";
import MessageForm from "../components/MessageForm";
import { TrustedBy } from "../components/SocialProof";
import {
  CONTACT,
  SERVICE_PACKAGES,
  DIGITAL_MARKETING,
  SOCIAL_PACKAGES,
  SOCIAL_GUARANTEE,
  SERVICE_CATEGORIES,
} from "../siteData";

/* Services, kept minimal on purpose (2026-10-07). The page used to carry the
   full sales argument for every offer: value stacks, phases, guarantees,
   testimonials and an embedded calendar. Each section now says what it is,
   what it costs and how to start, and the long version lives in the
   conversation. Prices still come from siteData, so the summary tiles and the
   sections can never quote different numbers. */

const money = (n) => "$" + n.toLocaleString("en-US");

/* Social cards show their first three features here; the rest come up on
   the call. The website packages show everything, because what separates the
   three tiers is the list itself. */
const FEATURES_SHOWN = 3;

const GLANCE = [
  { id: "free", name: "Start free", what: "A template, a brand teardown, your first reel or an hour of coaching", price: "$0" },
  { id: "packages", name: "Website packages", what: "The site, then Google and social, then everything", price: SERVICE_PACKAGES.map((p) => money(p.flat)).join(" · ") },
  { id: "marketing", name: "Digital marketing", what: "Google profile, ads, photos, training, WhatsApp", price: "from $90" },
  { id: "social", name: "Social media", what: "Reels-first content, every month", price: `from ${SOCIAL_PACKAGES[0].price}/mo` },
  { id: "one-off", name: "One-off work", what: "Logos, identities, apparel and print", price: "quoted per job" },
];

const bookCall = (label = "Book a free call") => (
  <a className="btn-book" href={CONTACT.calendly} target="_blank" rel="noreferrer noopener">
    {label}
  </a>
);

export default function WorkWithMe() {
  return (
    <Page>
      <header className="topbar">
        <div>
          {/* Start Free was merged in here; /free 301s to #free. */}
          <SplitHeading>Your Whole Online Presence</SplitHeading>
          <p className="topbar__sub">Start free, or have it all done</p>
        </div>
      </header>

      <motion.section className="card freehero glance-hero" variants={cardIn} initial="hidden" animate="show">
        <h2 className="freehero__title">Take the work first. Pay when it&apos;s worth it.</h2>
        <nav className="glance" aria-label="On this page">
          {GLANCE.map((g) => (
            <a className="glance__item" href={`#${g.id}`} key={g.id}>
              <span className="glance__name">{g.name}</span>
              <span className="glance__what">{g.what}</span>
              <span className="glance__price">{g.price}</span>
            </a>
          ))}
        </nav>
        <div className="freehero__acts">
          {bookCall("Book a free 30-min call")}
          <a className="btn-book buy-alt" href="#message">
            Or send a message
          </a>
        </div>
      </motion.section>

      <div id="free" className="anchor" />
      <FreeOffers title="Start free" accent="free" compact />

      <TrustedBy />

      {/* Three website packages, set by Tamer 2026-10-22. */}
      <section className="proj-section" id="packages">
        <h2 className="proj-section__title">Website Packages</h2>
        <p className="page-lead" style={{ marginTop: "-4px" }}>
          Every package goes live in one day. Half up front, half on launch day.
        </p>
        <motion.div className="price-grid" variants={container} initial="hidden" whileInView="show" viewport={{ once: true, margin: "-40px" }}>
          {SERVICE_PACKAGES.map((p) => (
            <PriceCard
              key={p.id}
              name={p.name}
              tagline={p.tagline}
              amount={money(p.flat)}
              period={p.period}
              badge={p.badge}
              featured={p.featured}
              features={p.features}
              bonus={p.bonus}
              guarantee={p.guarantee}
              action={bookCall(p.featured ? "Book a free call" : "Get a quote")}
            />
          ))}
        </motion.div>
        <p className="price-note">
          Prices in USD, by OMT, Whish Money or bank transfer. Hosting and edits after launch from $30 a month.
        </p>
      </section>

      {/* Anchor kept for old links to the presence and Google sections. */}
      <div id="online-presence" className="anchor" />
      <div id="google-profile" className="anchor" />
      <section className="proj-section" id="marketing">
        <h2 className="proj-section__title">Digital Marketing</h2>
        <p className="page-lead" style={{ marginTop: "-4px" }}>
          Bought on its own, or added to any package.
        </p>
        <motion.div className="mk-grid" variants={container} initial="hidden" whileInView="show" viewport={{ once: true, margin: "-40px" }}>
          {DIGITAL_MARKETING.map((m) => (
            <motion.article className="card mk-item" key={m.id} variants={cardIn}>
              <h3 className="mk-item__name">{m.name}</h3>
              <p className="mk-item__what">{m.what}</p>
              <p className="mk-item__price">
                <strong>{m.price}</strong> <span>{m.period}</span>
              </p>
            </motion.article>
          ))}
        </motion.div>
        <p className="price-note">
          Not sure what you need? <a className="link" href="#message">Tell me about the business</a> and I&apos;ll say which of these would move the needle first.
        </p>
      </section>

      <section className="proj-section" id="social">
        <h2 className="proj-section__title">Social Media</h2>
        <p className="page-lead" style={{ marginTop: "-4px" }}>
          Reels-first. 855K+ views on my own. Your first reel is free.
        </p>
        <motion.div className="price-grid" variants={container} initial="hidden" whileInView="show" viewport={{ once: true, margin: "-40px" }}>
          {SOCIAL_PACKAGES.map((p) => (
            <PriceCard
              key={p.name}
              name={p.name}
              tagline={p.tagline}
              amount={p.price}
              period={p.period}
              badge={p.featured ? "Most popular" : undefined}
              featured={p.featured}
              features={p.features.slice(0, FEATURES_SHOWN)}
              action={
                <a className="btn-book" href="#message">
                  {p.cta}
                </a>
              }
            />
          ))}
        </motion.div>
        <p className="price-note">
          {SOCIAL_GUARANTEE.title}. Month to month, cancel anytime. Single reels $65.
        </p>
      </section>

      <section className="proj-section" id="one-off">
        <h2 className="proj-section__title">One-off Work</h2>
        <motion.div className="cat-grid" variants={container} initial="hidden" whileInView="show" viewport={{ once: true, margin: "-40px" }}>
          {SERVICE_CATEGORIES.map((c) => (
            <motion.article className="card work-cat" key={c.name} variants={cardIn}>
              <h3 className="work-cat__name">{c.name}</h3>
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
        <p className="price-note">
          Quoted per job. More on{" "}
          <Link className="link" to="/logo-design-beirut">logo design</Link>,{" "}
          <Link className="link" to="/website-design-lebanon">websites</Link> and{" "}
          <Link className="link" to="/social-media-management-lebanon">social media</Link>.
        </p>
      </section>

      {/* One close: a call or a message. The embedded calendar is gone; the
          Calendly link opens it in a new tab without loading anything here. */}
      <section className="proj-section" id="message">
        <h2 className="proj-section__title">Get a Quote</h2>
        <motion.div className="card work-message" variants={cardIn} initial="hidden" whileInView="show" viewport={{ once: true, margin: "-40px" }}>
          <p className="card-body">
            Tell me what you need, or {" "}
            <a className="link" href={CONTACT.calendly} target="_blank" rel="noreferrer noopener">
              book a free 30-minute call
            </a>
            .
          </p>
          <MessageForm placeholder="What do you need?" />
        </motion.div>
      </section>
    </Page>
  );
}
