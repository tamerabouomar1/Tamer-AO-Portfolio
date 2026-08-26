import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import Page, { container, cardIn } from "../components/Page";
import { CONTACT } from "../siteData";

const BADGES = [
  { big: "Gold", label: "Martial arts Medalist", gold: true },
  { big: "AUB", label: "Student" },
  { big: "2×", label: "Athletic Scholarships" },
  { big: "7 yrs", label: "Total Working Experience" },
];

export default function About() {
  return (
    <Page>
      <header className="topbar">
        <div>
          <h1 className="topbar__title">About Tamer Abou Omar</h1>
          <p className="topbar__sub">What do I do</p>
        </div>
        <Link className="link" to="/work-with-me">
          Work with me <span className="plus">+</span>
        </Link>
      </header>

      <div className="about-grid">
        <motion.div className="about-bio" variants={container} initial="hidden" animate="show">
          <motion.div className="about-badges" variants={cardIn}>
            {BADGES.map((b) => (
              <div className="card badge" key={b.label}>
                <span className={"badge__big" + (b.gold ? " badge__big--gold" : "")}>{b.big}</span>
                <span className="badge__label">{b.label}</span>
              </div>
            ))}
          </motion.div>

          <motion.p variants={cardIn}>
            As a martial arts instructor and personal trainer, I help people get in shape and build
            confidence, empowering the mind through the body. <span style={{ color: "var(--shiny)" }}>@Combat Sports Academy</span>
          </motion.p>
          <motion.p variants={cardIn}>
            I work as a freelance graphic designer in Beirut, Lebanon, building brand identities,
            logos, logo motion, social-media design and apparel (rashguards and fight kits for OKIRO
            and 10th Planet Jiu Jitsu), alongside coaching martial arts classes and private sessions.
          </motion.p>
        </motion.div>

        <motion.aside className="card cta" variants={cardIn} initial="hidden" animate="show" style={{ minHeight: 0 }}>
          <h2 className="card-title">Get In Touch</h2>
          <div className="contact-list">
            <a href={CONTACT.phoneHref}><span className="dot" />{CONTACT.phone}</a>
            <a href={`mailto:${CONTACT.email}`}><span className="dot" />{CONTACT.email}</a>
            <a href={CONTACT.instagram} target="_blank" rel="noreferrer">
              <span className="dot" />Instagram
            </a>
          </div>
        </motion.aside>
      </div>
    </Page>
  );
}
