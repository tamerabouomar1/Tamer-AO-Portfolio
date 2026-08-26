import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import Page, { cardIn, RevealGroup, RevealCard } from "../components/Page";
import PriceCard from "../components/PriceCard";
import OfferProgram from "../components/OfferProgram";
import {
  CONTACT,
  SCHEDULE,
  PT_PACKAGES,
  DEFENSE_PROGRAM,
  FITNESS,
} from "../siteData";

/* ============================================================================
   /fitness — the coaching funnel.

   Same page as the standalone fitness site, brought back into the portfolio:
   white rather than black (the light theme is scoped to `.fitpage` in
   index.css, so nothing else on the site moves), everything revealed on scroll
   rather than on load, and ordered the way the offer is actually sold.

   The order is the argument. The free hour sits above every price, because
   nobody is asked to decide on money before they have trained with me once.
   Then the reasons to believe it, then how it runs, then the prices in the
   open, then the 90-day program, then the risk moved onto me. Credentials come
   after the offer, not before it: a page that opens with a CV asks a stranger
   to be impressed before they have been told what is for sale.
   ============================================================================ */

const money = (n) => "$" + n.toLocaleString("en-US");

export default function Fitness() {
  return (
    <Page className="fitpage">
      {/* ── HERO ─────────────────────────────────────────────────────── */}
      <header className="fit-hero">
        <span className="fit-eyebrow">{FITNESS.eyebrow}</span>
        <h1 className="fit-hero__title">{FITNESS.title}</h1>
        <p className="fit-hero__sub">{FITNESS.sub}</p>

        {/* The free hour, as the first thing that can be clicked. */}
        <motion.div
          className="card freebox"
          variants={cardIn}
          initial="hidden"
          animate="show"
        >
          <span className="freebox__flag">{FITNESS.freeFlag}</span>
          <span className="freebox__title">{FITNESS.freeTitle}</span>
          <span className="freebox__body">{FITNESS.freeBody}</span>
          <a
            className="btn-book freebox__go"
            href={CONTACT.calendly}
            target="_blank"
            rel="noreferrer"
          >
            {FITNESS.freeCta} <span className="plus">+</span>
          </a>
        </motion.div>

        <a className="link fit-hero__jump" href="#prices">
          {FITNESS.secondaryCta} ↓
        </a>
      </header>

      {/* ── PROOF ────────────────────────────────────────────────────── */}
      <RevealGroup className="stat-row">
        <motion.article className="card stat" variants={cardIn}>
          <span className="stat-num">100+</span>
          <span className="stat-label">Students coached</span>
        </motion.article>
        <motion.article className="card stat" variants={cardIn}>
          <span className="stat-line">
            <span className="stat-num">10+</span>
            <span className="stat-unit">Years</span>
          </span>
          <span className="stat-label">Training &amp; coaching</span>
        </motion.article>
        <motion.article className="card stat stat--center" variants={cardIn}>
          <span className="stat-text" style={{ fontSize: "clamp(16px,1.5vw,21px)" }}>
            Blue Belt BJJ
          </span>
          <span className="stat-label">4th degree black belt, Taekwondo</span>
        </motion.article>
        <motion.article className="card stat stat--center" variants={cardIn}>
          <span className="stat-text" style={{ fontSize: "clamp(16px,1.5vw,21px)" }}>
            AUB
          </span>
          <span className="stat-label">Nutrition &amp; exercise science coursework</span>
        </motion.article>
      </RevealGroup>

      <div className="taught">
        <span className="taught__label">Coached at</span>
        <div className="taught__row">
          {FITNESS.taughtAt.map((t) => (
            <span className="chip" key={t}>
              {t}
            </span>
          ))}
        </div>
      </div>

      {/* ── HOW THE FREE HOUR WORKS ──────────────────────────────────── */}
      <section className="proj-section">
        <h2 className="section-title">How the Free Hour Works</h2>
        <RevealGroup className="steps">
          {FITNESS.steps.map((s) => (
            <motion.article className="card step" variants={cardIn} key={s.n}>
              <span className="step__n">{s.n}</span>
              <h3 className="step__title">{s.title}</h3>
              <p className="step__body">{s.body}</p>
            </motion.article>
          ))}
        </RevealGroup>
      </section>

      {/* ── PRICES ───────────────────────────────────────────────────── */}
      <section className="proj-section" id="prices">
        <h2 className="section-title">What It Costs After That</h2>
        <p className="page-lead" style={{ marginTop: "-4px" }}>
          Every price is here, so you can decide before you speak to me. Sessions are
          one-on-one, in Beirut, and tailored to your goals and level.
        </p>
        <RevealGroup className="price-grid">
          {PT_PACKAGES.map((p) => (
            <PriceCard
              key={p.name}
              name={p.name}
              tagline={p.tagline}
              amount={p.price}
              period={p.period}
              was={p.anchor ? money(p.anchor) : undefined}
              anchorNote={p.anchorNote}
              badge={p.featured ? "Most popular" : p.free ? "Start here" : undefined}
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
        </RevealGroup>
        <p className="price-note">
          Prices in USD. Nothing is charged on this site — packages are arranged with me
          directly. Never trained with me before?{" "}
          <Link className="link" to="/free">
            Your first hour is free <span className="plus">+</span>
          </Link>
        </p>
      </section>

      {/* ── THE 90-DAY PROGRAM ───────────────────────────────────────── */}
      <OfferProgram program={DEFENSE_PROGRAM} id="defense-program" />

      {/* ── GUARANTEE + SCARCITY ─────────────────────────────────────── */}
      <section className="proj-section">
        <RevealGroup className="promise">
          <motion.div className="card promise__main" variants={cardIn}>
            <span className="promise__seal">{FITNESS.guarantee.days}</span>
            <h2 className="promise__title">{FITNESS.guarantee.title}</h2>
            <p className="promise__body">{FITNESS.guarantee.body}</p>
            <p className="promise__small">{FITNESS.guarantee.small}</p>
          </motion.div>
          <motion.div className="card promise__side" variants={cardIn}>
            <span className="promise__dot" aria-hidden="true" />
            <p className="promise__scarcity">{FITNESS.scarcity.line}</p>
            <p className="promise__sub">{FITNESS.scarcity.sub}</p>
            <a
              className="btn-book"
              href={CONTACT.calendly}
              target="_blank"
              rel="noreferrer"
            >
              Take a slot
            </a>
          </motion.div>
        </RevealGroup>
      </section>

      {/* ── CREDENTIAL ───────────────────────────────────────────────────
          Stated as qualifications held, not as a term-by-term course diary:
          a client is buying the expertise, not my transcript. */}
      <section className="proj-section">
        <RevealCard className="card cta" style={{ minHeight: 0 }}>
          <h2 className="card-title">Most Trainers Guess at Nutrition</h2>
          <p className="card-body">
            I studied it at the American University of Beirut — Nutrition (NFSC 220) and
            Physical Activity, Nutrition and Health (NFSC 223). So your plan is built on how
            your body actually uses food. It also survives Lebanese food, Ramadan and exam
            season, which a template does not.
          </p>
        </RevealCard>
      </section>

      {/* ── WORKSHOPS ────────────────────────────────────────────────── */}
      <section className="proj-section">
        <h2 className="section-title">Where the tracks came from</h2>
        <p className="page-lead" style={{ marginTop: "-4px" }}>
          The women&apos;s and teens&apos; tracks aren&apos;t new ideas. They are the two
          programs I already run at Combat Sports Academy, rebuilt as something you can
          finish.
        </p>
        <RevealGroup className="fit-photos">
          <motion.div className="card fit-photo" variants={cardIn}>
            <img
              src="/assets/projects/workshop-antibullying.webp"
              alt="Combat Sports Academy Kids & Teenagers Anti-Bullying Program"
              loading="lazy"
              style={{ objectFit: "contain" }}
            />
          </motion.div>
          <motion.div className="card fit-photo" variants={cardIn}>
            <img
              src="/assets/projects/workshop-women.webp"
              alt="Combat Sports Academy Women Empowerment Program"
              loading="lazy"
              style={{ objectFit: "contain" }}
            />
          </motion.div>
        </RevealGroup>
      </section>

      {/* ── SCHEDULE ─────────────────────────────────────────────────── */}
      <section className="proj-section">
        <h2 className="section-title">Classes Schedule</h2>
        <RevealCard className="card" style={{ padding: "clamp(16px,1.8vw,28px)" }}>
          <div className="schedule-grid">
            {SCHEDULE.map((d) => (
              <div className="sched-day" key={d.day}>
                <div className="sched-day__name">{d.day}</div>
                {d.classes.map((c, i) => (
                  <div
                    className={"sched-slot" + (c === "REST" ? " sched-slot--rest" : "")}
                    key={i}
                  >
                    {c}
                  </div>
                ))}
              </div>
            ))}
          </div>
        </RevealCard>
      </section>

      {/* ── CLASSES GIVEN ────────────────────────────────────────────── */}
      <section className="proj-section">
        <RevealCard className="card cta" style={{ minHeight: 0 }}>
          <h2 className="card-title">Classes Given</h2>
          <p className="card-body">
            As a martial arts instructor and personal trainer, I have given classes at the
            International College (IC), at Academies (CSA), and at Private Clubs (Yarz
            leisure club).
          </p>
        </RevealCard>
      </section>

      {/* ── FAQ ──────────────────────────────────────────────────────── */}
      <section className="proj-section">
        <h2 className="section-title">Questions I Get Asked</h2>
        <RevealGroup className="faq">
          {FITNESS.faq.map((f) => (
            <motion.details className="card qa" variants={cardIn} key={f.q}>
              <summary>
                {f.q}
                <span className="qa__plus" aria-hidden="true" />
              </summary>
              <p>{f.a}</p>
            </motion.details>
          ))}
        </RevealGroup>
      </section>

      {/* ── CLOSE ────────────────────────────────────────────────────── */}
      <section className="proj-section">
        <RevealCard className="card fit-close">
          <h2 className="card-title">{FITNESS.close.title}</h2>
          <p className="card-body">{FITNESS.close.body}</p>
          <div className="fit-close__row">
            <a
              className="btn-book btn-book--lg"
              href={CONTACT.calendly}
              target="_blank"
              rel="noreferrer"
            >
              {FITNESS.close.cta}
            </a>
            <Link className="btn-book btn-book--lg btn-book--ghost" to="/free">
              See what else is free
            </Link>
          </div>
        </RevealCard>
      </section>
    </Page>
  );
}
