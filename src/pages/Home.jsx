import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import Page, { container, cardIn } from "../components/Page";
import FreeOffers from "../components/FreeOffers";
import { TrustedBy, Testimonials } from "../components/SocialProof";

const MotionLink = motion.create(Link);

export default function Home() {
  return (
    <Page>
      <header className="topbar">
        <div>
          <h1 className="topbar__title">Graphic Designer in Beirut</h1>
          <p className="topbar__sub">Student Athlete</p>
        </div>
        <Link className="link" to="/free">
          Start free <span className="plus">+</span>
        </Link>
      </header>

      {/* The free offers, above everything that costs money. Nobody can be
          talked out of "free", and someone who has already held the work has
          stopped wondering whether it is any good — which is most of the
          objection gone before the first price is shown. */}
      <MotionLink
        className="card freehero"
        to="/free"
        variants={cardIn}
        initial="hidden"
        animate="show"
      >
        <span className="freehero__badge">Free · no card · no obligation</span>
        {/* No hard <br /> in here. JSX drops the whitespace either side of a
            tag when it sits on its own line, so a <br> hidden by CSS on mobile
            left "teardown,your" run together. The line breaks are balanced by
            the browser instead. */}
        <h3 className="freehero__title">
          Take a finished website, a brand teardown, your first reel, or an hour of coaching.
        </h3>
        <p className="freehero__body">
          All four cost nothing. Decide about the paid work afterwards, once you have seen
          what mine looks like.
        </p>
        <span className="link freehero__go">
          See all four <span className="plus">+</span>
        </span>
      </MotionLink>

      {/* Intent routing — visitors arrive for different things, so let them
          pick their path in the first screen instead of scrolling to find it. */}
      <motion.div className="paths" variants={container} initial="hidden" animate="show">
        {/* The flag sits in the card's HEAD row, beside the label, rather than
            inside path__go with the chevron. On phones path__go collapses to
            just the "+", so a flag living inside it made that column a
            different width on every card — the chevrons stopped lining up and
            the pill read as part of the link ("+ FREE"). Out here, the flag is
            a badge on the title and the chevron column is a fixed width. */}
        <MotionLink className="card path" to="/projects" variants={cardIn}>
          <span className="path__head">
            <span className="path__label">Design &amp; Branding</span>
            <span className="path__flag">Free teardown</span>
          </span>
          <span className="path__desc">Logos, identities, apparel &amp; print</span>
          <span className="path__go">
            See the work <span className="plus">+</span>
          </span>
        </MotionLink>
        {/* "from $109" was left over from when templates were priced one at a
            time. Every template is free now, so the line was quoting a price
            that no longer exists anywhere on the site. */}
        <MotionLink className="card path path--store" to="/websites" variants={cardIn}>
          <span className="path__head">
            <span className="path__label">Websites</span>
            <span className="path__flag">Free source</span>
          </span>
          {/* Uncounted on purpose. The figure used to be printed here and in
              the store head, where it dates itself and invites "only that
              many?" — the gallery answers the question better than a number
              does. */}
          <span className="path__desc">Client builds &amp; a gallery of ready-made sites</span>
          <span className="path__go">See the sites <span className="plus">+</span></span>
        </MotionLink>
        <MotionLink className="card path" to="/fitness" variants={cardIn}>
          <span className="path__head">
            <span className="path__label">Self-Defense</span>
            <span className="path__flag">6 seats</span>
          </span>
          <span className="path__desc">Defend yourself in 90 days, guaranteed</span>
          <span className="path__go">See the program <span className="plus">+</span></span>
        </MotionLink>
      </motion.div>

      <motion.section className="bento" variants={container} initial="hidden" animate="show">
        <div className="row row-top">
          <div className="stats">
            <motion.article className="card stat" variants={cardIn}>
              <span className="stat-num">10+</span>
              <span className="stat-label">Completed Projects</span>
            </motion.article>
            <motion.article className="card stat stat--center" variants={cardIn}>
              <span className="stat-text">Adobe<br />Expert</span>
            </motion.article>
            <motion.article className="card stat" variants={cardIn}>
              <span className="stat-num">10+</span>
              <span className="stat-label">Satisfied Clients</span>
            </motion.article>
            <motion.article className="card stat" variants={cardIn}>
              <span className="stat-line">
                <span className="stat-num">2</span>
                <span className="stat-unit">Years</span>
              </span>
              <span className="stat-label">Design Experience</span>
            </motion.article>
          </div>

          <MotionLink className="card featured" to="/projects" variants={cardIn} aria-label="View all projects">
            <div className="featured-head">
              <h3 className="card-title">Featured Projects</h3>
              <span className="link featured-cta">View all<span className="plus">+</span></span>
            </div>
            <div className="featured-img">
              <img src="/assets/featured.jpg" alt="Featured project: Charbel Farah portfolio cover" />
            </div>
          </MotionLink>
        </div>

        <div className="row row-bottom">
          <motion.article className="card cta" variants={cardIn}>
            <h3 className="card-title">Your Ultimate Designer</h3>
            <p className="card-body">
              I'm Tamer Abou Omar, a graphic designer based in Beirut, Lebanon. I build brand
              identities, logos, logo motion, social-media design and apparel, whether static or
              moving, digital or physical, big or small.
            </p>
          </motion.article>

          {/* This card used to be headed "Fitness on the side", which told a
              visitor the coaching was a hobby before they had read a word of
              it. It is a $997 program with a guarantee on it. */}
          <motion.article className="card cta" variants={cardIn}>
            <h3 className="card-title">The 90-Day Self-Defense Program</h3>
            <p className="card-body">
              Three tracks — women, teens and adults — and one finish line: in 90 days you can
              break a grip, create distance and get yourself out. Pass the day-90 pressure test
              or keep training with me free until you do.{" "}
              <Link className="link" to="/fitness">
                See the program <span className="plus">+</span>
              </Link>
            </p>
          </motion.article>
        </div>
      </motion.section>

      <TrustedBy />

      {/* The full set, with the paid step under each one. The card at the top
          of this page is the hook; this is the detail behind it. */}
      <FreeOffers
        title="Everything you can have for"
        accent="nothing"
        lede="Pick whichever is useful. The line under each card is what it costs if you ever want the step after it."
        compact
      />

      <Testimonials />
    </Page>
  );
}
