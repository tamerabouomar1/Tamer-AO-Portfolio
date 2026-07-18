import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import Page, { container, cardIn } from "../components/Page";
import { CONTACT } from "../siteData";

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
          Let's work together <span className="plus">+</span>
        </Link>
      </header>

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
            <a className="link" href={`mailto:${CONTACT.email}`}>
              Get in touch <span className="plus">+</span>
            </a>
          </motion.article>

          <motion.article className="card cta" variants={cardIn}>
            <h3 className="card-title">Fitness on the side</h3>
            <p className="card-body">
              As a martial arts instructor and personal trainer, I help people get in shape and build
              confidence, empowering the mind through the body.
            </p>
            <Link className="link" to="/fitness">
              Book a session <span className="plus">+</span>
            </Link>
          </motion.article>
        </div>
      </motion.section>
    </Page>
  );
}
