import { motion } from "framer-motion";
import Page, { container, cardIn } from "../components/Page";
import { CONTACT, SCHEDULE } from "../siteData";

export default function Fitness() {
  return (
    <Page>
      <header className="topbar">
        <div>
          <h2 className="topbar__title">Your Ultimate Coach</h2>
          <p className="topbar__sub">2× Athletic Scholarships</p>
        </div>
        <a className="link" href={`mailto:${CONTACT.email}`}>
          Get in touch <span className="plus">+</span>
        </a>
      </header>

      {/* stats — exactly as in the Figma (no fabricated numbers) */}
      <motion.div className="stat-row" variants={container} initial="hidden" animate="show">
        <motion.article className="card stat" variants={cardIn}>
          <span className="stat-num">100+</span>
          <span className="stat-label">Students Coached</span>
        </motion.article>
        <motion.article className="card stat" variants={cardIn}>
          <span className="stat-line">
            <span className="stat-num">10+</span>
            <span className="stat-unit">Years</span>
          </span>
          <span className="stat-label">Fitness Experience</span>
        </motion.article>
        <motion.article className="card stat stat--center" variants={cardIn}>
          <span className="stat-text" style={{ fontSize: "clamp(16px,1.5vw,21px)" }}>
            Blue Belt BJJ
          </span>
          <span className="stat-label">4th Degree Blackbelt Taekwondo</span>
        </motion.article>
      </motion.div>

      <p className="card-body" style={{ margin: "var(--gap) 0", maxWidth: "70ch" }}>
        With more than 100 students coached across several sports, fitness and self-improvement have
        become my passion.
      </p>

      {/* Workshops Given — heading above the training photos (as in the Figma) */}
      <section className="proj-section" style={{ marginTop: 0 }}>
        <h3 className="section-title">Workshops Given</h3>
        <motion.div className="fit-photos" variants={container} initial="hidden" animate="show">
          <motion.div className="card fit-photo" variants={cardIn}>
            <img
              src="/assets/projects/workshop-antibullying.jpg"
              alt="Combat Sports Academy Kids & Teenagers Anti-Bullying Program"
              loading="lazy"
              style={{ objectFit: "contain" }}
            />
          </motion.div>
          <motion.div className="card fit-photo" variants={cardIn}>
            <img
              src="/assets/projects/workshop-women.jpg"
              alt="Combat Sports Academy Women Empowerment Program"
              loading="lazy"
              style={{ objectFit: "contain" }}
            />
          </motion.div>
        </motion.div>
      </section>

      {/* schedule */}
      <section className="proj-section">
        <h3 className="section-title">Classes Schedule</h3>
        <motion.div className="card" variants={cardIn} initial="hidden" animate="show" style={{ padding: "clamp(16px,1.8vw,28px)" }}>
          <div className="schedule-grid">
            {SCHEDULE.map((d) => (
              <div className="sched-day" key={d.day}>
                <div className="sched-day__name">{d.day}</div>
                {d.classes.map((c, i) => (
                  <div className={"sched-slot" + (c === "REST" ? " sched-slot--rest" : "")} key={i}>
                    {c}
                  </div>
                ))}
              </div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* classes given */}
      <section className="proj-section">
        <motion.div className="card cta" variants={cardIn} initial="hidden" animate="show" style={{ minHeight: 0 }}>
          <h3 className="card-title">Classes Given</h3>
          <p className="card-body">
            As a martial arts Instructor and a personal Trainer, I have given classes at the International
            College (IC), at Academies (CSA), and at Private Clubs (Yarz leisure club).
          </p>
          <a className="link" href={CONTACT.calendly} target="_blank" rel="noreferrer">
            Book a session <span className="plus">+</span>
          </a>
        </motion.div>
      </section>
    </Page>
  );
}
