import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import Page, { container, cardIn } from "../components/Page";
import FreeOffers from "../components/FreeOffers";
import FeedbackForm from "../components/FeedbackForm";
import { TrustedBy, Testimonials } from "../components/SocialProof";
import { CONTACT, FREE_OFFERS } from "../siteData";

/* The free page — the front door of the site.
 *
 * Everything above the fold is something you can have without paying, and the
 * ladder underneath it says out loud what the paid steps are and what each one
 * costs. That ordering is the whole strategy: give the work away first, let
 * people decide it is good, and put the price where they can see it rather
 * than where it can ambush them.
 */
export default function Free() {
  return (
    <Page>
      <header className="topbar">
        <div>
          <h2 className="topbar__title">Start Free</h2>
          <p className="topbar__sub">Take the work first, decide afterwards</p>
        </div>
        <Link className="link" to="/work-with-me">
          See the paid work <span className="plus">+</span>
        </Link>
      </header>

      <motion.section
        className="card freehero"
        variants={cardIn}
        initial="hidden"
        animate="show"
      >
        <h3 className="freehero__title">
          I would rather you had the work
          <br />
          <span className="storehead__accent">than a sales pitch about it.</span>
        </h3>
        <p className="card-body freehero__body">
          A finished website, a teardown of your brand, your first reel cut, or an hour
          of coaching. Pick whichever one is useful and take it. No card, no trial that
          quietly starts charging, no email course. If it turns out to be good, you know
          where I am.
        </p>
        <div className="freehero__acts">
          <a className="btn-book" href="#offers">
            See what&apos;s free
          </a>
          <a
            className="btn-book buy-alt"
            href={CONTACT.calendly}
            target="_blank"
            rel="noreferrer noopener"
          >
            Or just book a call
          </a>
        </div>
      </motion.section>

      {/* Compact here on purpose: this page carries a full ladder section
          lower down, so repeating the paid step on every card as well would
          say the same thing twice on one screen. */}
      <div id="offers" />
      <FreeOffers
        title="Four ways in, all of them"
        accent="free"
        lede="Each one is real work, actually delivered. Take whichever is useful; the paid steps are further down the page if you ever want them."
        compact
      />

      <TrustedBy title="Who I have done this for" />

      {/* The ladder, stated plainly. Nothing here is a surprise later. */}
      <section className="proj-section">
        <h3 className="proj-section__title">And When You Want More Than the Free One</h3>
        <p className="page-lead" style={{ marginTop: "-4px" }}>
          The free version is not a crippled demo. It is the actual thing. What you pay
          for is speed, volume and it being done for you rather than by you.
        </p>
        <motion.div
          className="ladder-grid"
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-40px" }}
        >
          {FREE_OFFERS.map((o) => (
            <motion.article className="card ladder" key={o.id} variants={cardIn}>
              <span className="freecard__kicker">{o.kicker}</span>
              <div className="ladder__rung">
                <span className="ladder__free">Free</span>
                <span className="ladder__what">{o.name}</span>
              </div>
              <span className="ladder__arrow" aria-hidden="true">
                ↓
              </span>
              <div className="ladder__rung ladder__rung--paid">
                <span className="ladder__label">{o.paid.label}</span>
                <span className="ladder__detail">{o.paid.detail}</span>
              </div>
            </motion.article>
          ))}
        </motion.div>
        <p className="price-note">
          Prices in USD.{" "}
          <Link className="link" to="/work-with-me">
            full pricing <span className="plus">+</span>
          </Link>
        </p>
      </section>

      <Testimonials title="What people said afterwards" />

      <section className="proj-section">
        <FeedbackForm what="free offers page" />
      </section>
    </Page>
  );
}
