import { motion } from "framer-motion";
import Page, { container, cardIn } from "../components/Page";
import PriceCard from "../components/PriceCard";
import { CONTACT, SCHEDULE, PT_PACKAGES, DEFENSE_PROGRAM } from "../siteData";

const money = (n) => "$" + n.toLocaleString("en-US");

/* The flagship offer, built to the $100M Offers structure and placed FIRST on
 * the page — before the credentials, before the schedule, before the price
 * list. The old page opened with stats and buried the packages at the bottom,
 * which asks a visitor to be impressed before they have been told what is on
 * sale. The order here is: what you get, why it will work, what it is worth,
 * what it costs, and what happens if it doesn't.
 */
function DefenseProgram() {
  const p = DEFENSE_PROGRAM;
  const stackTotal =
    p.stack.reduce((sum, s) => sum + s.value, 0) +
    p.bonuses.reduce((sum, b) => sum + b.value, 0);

  return (
    /* Not "90-day-program": an id starting with a digit is legal HTML but is
       not a valid CSS selector, so #90-day-program throws rather than matching. */
    <section className="proj-section" id="defense-program">
      <motion.article className="card offer" variants={cardIn} initial="hidden" animate="show">
        <header>
          <p className="offer__kicker">{p.kicker}</p>
          <h3 className="offer__name">{p.name}</h3>
          <p className="offer__promise">{p.promise}</p>
          <p className="offer__proof">{p.proof}</p>
        </header>

        {/* Three tracks. Same program, three different people walking in. */}
        <div className="offer__tracks">
          {p.tracks.map((t) => (
            <div className="offer-track" key={t.id}>
              <span className="offer-track__who">{t.who}</span>
              <h4 className="offer-track__name">{t.name}</h4>
              <p className="offer-track__pain">&ldquo;{t.pain}&rdquo;</p>
              <p className="offer-track__outcome">{t.outcome}</p>
              <p className="offer-track__note">{t.note}</p>
            </div>
          ))}
        </div>

        {/* The route to the outcome, so 90 days reads as a plan not a guess. */}
        <div>
          <h4 className="section-title" style={{ fontSize: "clamp(18px,1.7vw,24px)" }}>
            How the 90 days run
          </h4>
          <div className="offer__phases">
            {p.phases.map((ph) => (
              <div className="offer-phase" key={ph.weeks}>
                <span className="offer-phase__weeks">{ph.weeks}</span>
                <h5 className="offer-phase__title">{ph.title}</h5>
                <p className="offer-phase__body">{ph.body}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="offer__stack-wrap">
          {/* Everything included, priced at what it costs bought separately. */}
          <div>
            <h4 className="section-title" style={{ fontSize: "clamp(18px,1.7vw,24px)" }}>
              Everything you get
            </h4>
            <div className="offer-stack">
              {p.stack.map((s) => (
                <div className="offer-stack__row" key={s.item}>
                  <span className="offer-stack__item">{s.item}</span>
                  <span className="offer-stack__value">{money(s.value)}</span>
                </div>
              ))}
              {p.bonuses.map((b) => (
                <div className="offer-stack__row offer-stack__row--bonus" key={b.name}>
                  <span className="offer-stack__item">
                    <span className="offer-stack__tag">Bonus</span>
                    {b.name}
                    <span className="offer-bonus__body">{b.body}</span>
                  </span>
                  <span className="offer-stack__value">{money(b.value)}</span>
                </div>
              ))}
              <div className="offer-stack__total">
                <span>Total value</span>
                <s>{money(stackTotal)}</s>
              </div>
            </div>
          </div>

          {/* The close. */}
          <div className="offer-close">
            <div>
              <div className="offer-close__price">
                <span className="offer-close__amount">{money(p.price)}</span>
              </div>
              <p className="offer-close__period" style={{ marginTop: 6 }}>
                {p.period}
              </p>
            </div>

            <div className="offer-guarantee">
              <h4 className="offer-guarantee__title">{p.guarantee.title}</h4>
              <p className="offer-guarantee__body">{p.guarantee.body}</p>
            </div>

            <p className="offer-close__seats">
              <strong>{p.intake.seatsPerIntake} seats per intake.</strong>{" "}
              {p.intake.cadence} {p.intake.reason}
            </p>

            <a
              className="btn-book offer-close__btn"
              href={CONTACT.calendly}
              target="_blank"
              rel="noreferrer"
            >
              {p.cta}
            </a>
          </div>
        </div>
      </motion.article>
    </section>
  );
}

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
          Book a session <span className="plus">+</span>
        </a>
      </header>

      {/* The offer, first. */}
      <DefenseProgram />

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
        <p className="price-note">
          Prices in USD. Sessions are one-on-one, tailored to your goals and level. New
          clients: first session just $25.
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
