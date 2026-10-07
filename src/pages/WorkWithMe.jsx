import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import ConsentEmbed from "../components/ConsentEmbed";
import Page, { container, cardIn } from "../components/Page";
import SplitHeading from "../components/SplitHeading";
import PriceCard from "../components/PriceCard";
import FreeOffers from "../components/FreeOffers";
import MessageForm from "../components/MessageForm";
import OfferProgram from "../components/OfferProgram";
import { TrustedBy, Testimonials } from "../components/SocialProof";
import {
  CONTACT,
  PRESENCE,
  GOOGLE_PROFILE,
  SOCIAL_PACKAGES,
  SOCIAL_GUARANTEE,
  SERVICE_CATEGORIES,
} from "../siteData";

// Calendly inline embed, themed to match the site.
const CALENDLY_EMBED =
  CONTACT.calendly +
  "?embed_type=Inline&hide_gdpr_banner=1&background_color=101010&text_color=ffffff&primary_color=64cefb" +
  "&embed_domain=" +
  (typeof window !== "undefined" ? window.location.hostname : "tamerabouomar.com");

/* The summary at the top of the page. Prices come from the same objects the
   sections below render, so the card can never quote a different number. */
const GLANCE = [
  { id: "free", name: "Start free", what: "A website template, a brand teardown, your first reel or an hour of coaching", price: "$0" },
  { id: "online-presence", name: "The whole online presence", what: "Website, Google profile and content, run as one thing", price: `$${PRESENCE.price} in one day, then $${PRESENCE.monthly.price}/mo` },
  { id: "google-profile", name: "Just the Google profile", what: "The map listing people see before any website", price: `$${GOOGLE_PROFILE.price}, set up in one day` },
  { id: "social", name: "Social media", what: "Reels-first content, every month", price: `from ${SOCIAL_PACKAGES[0].price}/mo` },
  { id: "one-off", name: "One-off work", what: "Logos, identities, apparel and print", price: "quoted per job" },
];

export default function WorkWithMe() {
  return (
    <Page>
      <header className="topbar">
        <div>
          {/* Services and Start Free used to be two pages that said the same
              thing twice: the free offers, the client logos, the testimonials
              and the message form all appeared on both. They are one page now.
              The free work still comes before any price, and /free 301s here
              to #free. */}
          <SplitHeading>Your Whole Online Presence</SplitHeading>
          <p className="topbar__sub">Start free, or have it all done</p>
        </div>
      </header>

      {/* The whole page in one card: what is free, what each paid thing
          costs, and a jump to it. Someone who reads only this knows the full
          menu and where to tap. */}
      <motion.section className="card freehero glance-hero" variants={cardIn} initial="hidden" animate="show">
        <h2 className="freehero__title">
          I would rather you had the work
          <br />
          <span className="storehead__accent">than a sales pitch about it.</span>
        </h2>
        <p className="card-body freehero__body">
          Take something free first. If you want it done properly after that, every price is
          below, and the whole thing goes live in one day.
        </p>
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
          <a className="btn-book" href={CONTACT.calendly} target="_blank" rel="noreferrer noopener">
            Book a free 30-min call
          </a>
          <a className="btn-book buy-alt" href="#message">
            Or send a message
          </a>
        </div>
      </motion.section>

      <div id="free" className="anchor" />
      <FreeOffers
        title="Start free"
        accent="free"
        lede="Each one is finished work you keep. The line under each card says what the paid next step costs, if you ever want it."
      />

      {/* Credibility between the free work and the first price. */}
      <TrustedBy />
      <Testimonials />

      {/* The flagship, and the only thing on this page sold as an outcome
          rather than a deliverable. It sits after the free offers and before
          the component pricing on purpose: a visitor who wants the whole thing
          handled sees it first, and a visitor who only wants one piece scrolls
          two seconds to reach the piece they want. It does NOT bury the
          numbers the way the old website flagship did, because it carries its
          own price and its own monthly in the close. */}
      <OfferProgram program={PRESENCE} id="online-presence" phasesTitle="How the day runs" />

      {/* Google Business Profile on its own. It belongs beside the bundle
          rather than buried in it, because it is the cheapest, fastest thing
          Tamer sells: the map listing sits above the organic results for a
          nearby search, and it can be set up in a day without touching the
          website. It is also the natural first sale to someone not ready to
          commit to a build. */}
      <section className="proj-section" id="google-profile">
        <h2 className="proj-section__title">Just the Google Profile</h2>
        <p className="page-lead" style={{ marginTop: "-4px" }}>
          Want to start smaller? Start with your Google listing. When
          somebody nearby looks for what you sell, the map listing is what they see first,
          above every website on the page. Most are wrong, empty, or still unclaimed.
        </p>
        <motion.div className="price-grid" variants={container} initial="hidden" whileInView="show" viewport={{ once: true, margin: "-40px" }}>
          <PriceCard
            name={GOOGLE_PROFILE.name}
            tagline={GOOGLE_PROFILE.tagline}
            amount={`$${GOOGLE_PROFILE.price}`}
            period={GOOGLE_PROFILE.period}
            features={GOOGLE_PROFILE.features}
            bonus={GOOGLE_PROFILE.bonus}
            guarantee={GOOGLE_PROFILE.guarantee}
            featured
            badge="Fastest win"
            action={
              <a className="btn-book" href={CONTACT.calendly} target="_blank" rel="noreferrer noopener">
                Book a free call
              </a>
            }
          />
        </motion.div>
        <p className="price-note">
          More on{" "}
          <Link className="link" to="/google-business-profile-lebanon">
            getting found on Google in Lebanon <span className="plus">+</span>
          </Link>
        </p>
      </section>

      {/* Social media */}
      <section className="proj-section" id="social">
        <h2 className="proj-section__title">Social Media</h2>
        <p className="page-lead" style={{ marginTop: "-4px" }}>
          Reels reach more people than any other post. Mine have done 855K+ views, with six past 20,000
          and a best post at 219,000. Every plan is built reels-first to get you seen.
        </p>
        <p className="page-lead" style={{ marginTop: 0 }}>
          The first reel is free and it is the same work as the ones in these plans. What you
          are paying for below is volume, consistency and the strategy around them.
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
                <a className="btn-book" href="#book">
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
          <h3 className="offer-guarantee__title">{SOCIAL_GUARANTEE.title}</h3>
          <p className="offer-guarantee__body">{SOCIAL_GUARANTEE.body}</p>
        </motion.div>

        <p className="price-note">
          Prices in USD, month-to-month, cancel anytime. Single reels without a package are
          $65 each.
        </p>
      </section>

      {/* Design & identities, Clothing */}
      <section className="proj-section" id="one-off">
        <h2 className="proj-section__title">One-off Work</h2>
        <motion.div
          className="cat-grid"
          variants={container}
          initial="hidden"
          animate="show"
        >
          {SERVICE_CATEGORIES.map((c) => (
            <motion.article className="card work-cat" key={c.name} variants={cardIn}>
              <h3 className="work-cat__name">{c.name}</h3>
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
          More on{" "}
          <Link className="link" to="/logo-design-beirut">
            logo design &amp; brand identity in Beirut
          </Link>{" "}
          and{" "}
          <Link className="link" to="/website-design-lebanon">
            website design in Lebanon
          </Link>
          , and{" "}
          <Link className="link" to="/social-media-management-lebanon">
            social media management in Lebanon
          </Link>
          .
        </p>
      </section>

      {/* The close: book a time, or write. The calendar used to open the
          page; it sits at the end now, where someone who has read the prices
          is ready to use it, and the summary card at the top links straight
          to Calendly for anyone who already is. */}
      <section className="proj-section" id="book">
        <h2 className="proj-section__title">Book a Call</h2>
        <motion.section className="card work-booking" variants={cardIn} initial="hidden" whileInView="show" viewport={{ once: true, margin: "-40px" }}>
          <div className="work-booking__grid">
            <div className="work-booking__head">
              <h3 className="card-title">Free 30 minutes</h3>
              <p className="card-body">
                Pick a time and we&apos;ll plan it together. No pitch, no obligation.
              </p>
              <a className="btn-book work-booking__direct" href={CONTACT.calendly} target="_blank" rel="noreferrer">
                Open in Calendly
              </a>
            </div>
            {/* Gated, so Calendly only loads for someone who asks for it. */}
            <ConsentEmbed provider="Calendly" label="Booking calendar" className="consent-embed--calendly">
              {() => <iframe className="calendly-frame" src={CALENDLY_EMBED} title="Book a free 30-minute meeting with Tamer" />}
            </ConsentEmbed>
          </div>
        </motion.section>
      </section>

      <section className="proj-section" id="message">
        <h2 className="proj-section__title">Send a Message</h2>
        <motion.div className="card work-message" variants={cardIn} initial="hidden" whileInView="show" viewport={{ once: true, margin: "-40px" }}>
          <p className="card-body">
            Took something free, want the paid version, or just have a question? Write it here
            and I&apos;ll get back to you.
          </p>
          <MessageForm placeholder="What do you need?" />
        </motion.div>
      </section>
    </Page>
  );
}
