import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import Page, { cardIn } from "../components/Page";
import FreeOffers from "../components/FreeOffers";
import MessageForm from "../components/MessageForm";
import { TrustedBy, Testimonials } from "../components/SocialProof";
import { CONTACT } from "../siteData";

/* The free page — the front door of the site.
 *
 * Everything here is something you can have without paying, and each card says
 * out loud what the paid step after it costs. That ordering is the whole
 * strategy: give the work away first, let people decide it is good, and put
 * the price where they can see it rather than where it can ambush them.
 */
export default function Free() {
  return (
    <Page>
      <header className="topbar">
        <div>
          <h1 className="topbar__title">Free Websites, Branding &amp; Coaching</h1>
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
          A finished website, a teardown of your brand, your first reel cut, or an hour of
          coaching. Take whichever one is useful. No card, no trial that quietly starts
          charging, no email course.
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

      {/* NOT compact. This page used to show the four offers stripped of
          their paid line, then repeat all four again lower down as a ladder
          purely to say what the paid step was — the same four things twice on
          one page. The card carries its own paid line, so the ladder is gone
          and the offers say it once. */}
      <div id="offers" />
      <FreeOffers
        title="Four ways in, all of them"
        accent="free"
        lede="Each one is real work, actually delivered. The line under each card is what it costs if you ever want the step after it."
      />

      <TrustedBy title="Who I have done this for" />

      <Testimonials title="What people said afterwards" />

      {/* Was a two-question survey asking what someone thought of the free
          work. Being asked to rate something is one more task in the way of
          the thing they actually came to say, so the page ends the way every
          other page does: a name, a way to reach them, and a message. */}
      <section className="proj-section">
        <h3 className="proj-section__title">Send a Message</h3>
        <motion.div className="card work-message" variants={cardIn} initial="hidden" animate="show">
          <p className="card-body">
            Took something, want the paid version, or just have a question? Write it here
            and I&apos;ll get back to you.
          </p>
          <MessageForm placeholder="What do you need?" />
        </motion.div>
      </section>
    </Page>
  );
}
