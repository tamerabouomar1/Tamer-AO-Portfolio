import { motion } from "framer-motion";
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
          <h2 className="topbar__title">Your Ultimate Student Athlete</h2>
          <p className="topbar__sub">What do I do</p>
        </div>
        <a className="link" href={`mailto:${CONTACT.email}`}>
          Lets work together <span className="plus">+</span>
        </a>
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
            Martial Arts Instructor and a Personal Trainer, I help people get in shape. Empowering the
            mind through the body. <span style={{ color: "var(--shiny)" }}>@Combat Sports Academy</span>
          </motion.p>
          <motion.p variants={cardIn}>
            I work as a freelance graphic designer in Beirut, Lebanon — building brand identities,
            logos, logo motion, social-media design and apparel (rashguards and fight kits for OKIRO
            and 10th Planet Jiu Jitsu), alongside coaching martial arts classes and private sessions.
          </motion.p>
        </motion.div>

        <motion.aside className="card cta" variants={cardIn} initial="hidden" animate="show" style={{ minHeight: 0 }}>
          <h3 className="card-title">Get In Touch</h3>
          <div className="contact-list">
            <a href={CONTACT.phoneHref}><span className="dot" />{CONTACT.phone}</a>
            <a href={CONTACT.calendly}><span className="dot" />Book a call</a>
            <a href={`mailto:${CONTACT.email}`}><span className="dot" />{CONTACT.email}</a>
          </div>
          <a className="link" href={`mailto:${CONTACT.email}`}>
            Lets work together <span className="plus">+</span>
          </a>
        </motion.aside>
      </div>
    </Page>
  );
}
