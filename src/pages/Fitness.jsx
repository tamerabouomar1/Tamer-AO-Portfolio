import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import Page, { container, cardIn } from "../components/Page";
import PriceCard from "../components/PriceCard";
import OfferProgram from "../components/OfferProgram";

/* Still used by the PT price cards below; the offer block's own copy moved
   into OfferProgram with the rest of that markup. */
const money = (n) => "$" + n.toLocaleString("en-US");
import { CONTACT, SCHEDULE, PT_PACKAGES, DEFENSE_PROGRAM } from "../siteData";

export default function Fitness() {
  return (
    <Page>
      <header className="topbar">
        <div>
          <h2 className="topbar__title">Your Ultimate Coach</h2>
          <p className="topbar__sub">
            Self-defense, strength and martial arts — Beirut
          </p>
        </div>
        <a className="link" href={CONTACT.calendly} target="_blank" rel="noreferrer">
          Book the free session <span className="plus">+</span>
        </a>
      </header>

      {/* The offer, first. */}
      <OfferProgram program={DEFENSE_PROGRAM} id="defense-program" />

      {/* Then the reasons to believe it. */}
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

      {/* The credential behind the nutrition plans inside the program and the
          packages below. Stated as qualifications held, not as a term-by-term
          course diary: a client is buying the expertise, not my transcript. */}
      <section className="proj-section" style={{ marginTop: 0 }}>
        <motion.div className="card cta" variants={cardIn} initial="hidden" animate="show" style={{ minHeight: 0 }}>
          <h3 className="card-title">University-Trained in Nutrition &amp; Exercise Science</h3>
          <p className="card-body">
            Most trainers guess at nutrition. I studied it at the American University of Beirut —
            Nutrition (NFSC 220) and Physical Activity, Nutrition and Health (NFSC 223). So your
            plan is built on how your body actually uses food and training.
          </p>
        </motion.div>
      </section>

      {/* Workshops Given — the two programs the tracks grew out of. */}
      <section className="proj-section" style={{ marginTop: 0 }}>
        <h3 className="section-title">Where the tracks came from</h3>
        <p className="page-lead" style={{ marginTop: "-4px" }}>
          The women&apos;s and teens&apos; tracks aren&apos;t new ideas. They are the two programs
          I already run at Combat Sports Academy, rebuilt as something you can finish.
        </p>
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

      {/* Ongoing training, for people not doing the 90 days. */}
      <section className="proj-section">
        <h3 className="section-title">Not ready for the 90 days?</h3>
        <p className="page-lead" style={{ marginTop: "-4px" }}>
          Train with me week to week instead. Same coaching, no finish line.
        </p>
        <motion.div className="price-grid" variants={container} initial="hidden" animate="show">
          {PT_PACKAGES.map((p) => (
            <PriceCard
              key={p.name}
              name={p.name}
              tagline={p.tagline}
              amount={p.price}
              period={p.period}
              was={p.anchor ? money(p.anchor) : undefined}
              anchorNote={p.anchorNote}
              badge={p.featured ? "Most popular" : undefined}
              featured={p.featured}
              features={p.features}
              bonus={p.bonus}
              action={
                <a className="btn-book" href={CONTACT.calendly} target="_blank" rel="noreferrer">
                  {p.cta}
                </a>
              }
            />
          ))}
        </motion.div>
        {/* Was "new clients: first session just $25", which contradicted the
            free hour on /free — two different prices for the same first
            session, on the same site. */}
        <p className="price-note">
          Prices in USD. Sessions are one-on-one, tailored to your goals and level. Never
          trained with me before?{" "}
          <Link className="link" to="/free">
            Your first hour is free <span className="plus">+</span>
          </Link>
        </p>
      </section>

      {/* classes given */}
      <section className="proj-section">
        <motion.div className="card cta" variants={cardIn} initial="hidden" animate="show" style={{ minHeight: 0 }}>
          <h3 className="card-title">Classes Given</h3>
          <p className="card-body">
            As a martial arts instructor and personal trainer, I have given classes at the International
            College (IC), at Academies (CSA), and at Private Clubs (Yarz leisure club).
          </p>
        </motion.div>
      </section>
    </Page>
  );
}
