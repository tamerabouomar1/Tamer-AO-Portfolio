import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import Page, { container, cardIn } from "../components/Page";
import { TrustedBy, Testimonials } from "../components/SocialProof";

const MotionLink = motion.create(Link);

export default function Home() {
  return (
    <Page>
      <header className="topbar">
        <div>
          <h2 className="topbar__title">Graphic Designer</h2>
          <p className="topbar__sub">Student Athlete</p>
        </div>
        <Link className="link" to="/work-with-me">
          Work with me <span className="plus">+</span>
        </Link>
      </header>

      {/* Intent routing — visitors arrive for different things, so let them
          pick their path in the first screen instead of scrolling to find it. */}
      <motion.div className="paths" variants={container} initial="hidden" animate="show">
        <MotionLink className="card path" to="/projects" variants={cardIn}>
          <span className="path__label">Design &amp; Branding</span>
          <span className="path__desc">Logos, identities, apparel &amp; print</span>
          <span className="path__go">See the work <span className="plus">+</span></span>
        </MotionLink>
        {/* "from $109" was left over from when templates were priced one at a
            time. Every template is free now, so the line was quoting a price
            that no longer exists anywhere on the site. */}
        <MotionLink className="card path path--store" to="/websites" variants={cardIn}>
          <span className="path__label">Websites</span>
          <span className="path__desc">21 ready-made sites, free to download</span>
          <span className="path__go">
            See the sites <span className="plus">+</span>
            <span className="path__flag">Free</span>
          </span>
        </MotionLink>
        <MotionLink className="card path" to="/fitness" variants={cardIn}>
          <span className="path__label">Self-Defense &amp; Coaching</span>
          <span className="path__desc">Defend yourself in 90 days, or keep training free</span>
          <span className="path__go">
            See the program <span className="plus">+</span>
            <span className="path__flag">6 seats</span>
          </span>
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
      <Testimonials />
    </Page>
  );
}
