import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import Page, { container, cardIn } from "../components/Page";
import MessageForm from "../components/MessageForm";
import { TrustedBy } from "../components/SocialProof";
import { CONTACT, SERVICE_PAGES } from "../siteData";

/* One page per thing people actually search for.
 *
 * The rest of the site is organised the way Tamer thinks about his work:
 * Projects, Websites, Media, Free. Nobody types any of those into Google.
 * They type "website design lebanon" and "restaurant website lebanon", and
 * until these existed the site had no page that answered those directly.
 *
 * All three share this component and differ only in SERVICE_PAGES data, so a
 * fourth is a data entry rather than a new file. The FAQ block is rendered
 * twice on purpose: once as visible copy, once as FAQPage structured data.
 * They are generated from the same array, which is the only way to be sure
 * the marked-up answer is the answer actually on the page.
 */
/* `slug` arrives as a prop, not from useParams.
 *
 * App.jsx registers one literal route per page (/website-design-lebanon and
 * friends) rather than a /:slug wildcard, so there is no route parameter to
 * read — useParams() returns an empty object, the lookup misses, and the
 * component renders null. Which it silently did: the pages built, prerendered
 * and deployed as an empty shell. */
export default function ServicePage({ slug }) {
  const p = SERVICE_PAGES.find((x) => x.slug === slug);
  if (!p) return null;

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: p.faqs.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };

  return (
    <Page>
      <header className="topbar">
        <div>
          <h1 className="topbar__title">{p.h1}</h1>
          <p className="topbar__sub">{p.kicker}</p>
        </div>
        <a className="link" href={CONTACT.calendly} target="_blank" rel="noreferrer noopener">
          Book a free call <span className="plus">+</span>
        </a>
      </header>

      <motion.section className="card svc-lede" variants={cardIn} initial="hidden" animate="show">
        <p className="svc-lede__body">{p.lede}</p>
        <div className="svc-lede__acts">
          <Link className="btn-book" to={p.cta.to}>
            {p.cta.label}
          </Link>
          <a
            className="btn-book buy-alt"
            href={CONTACT.calendly}
            target="_blank"
            rel="noreferrer noopener"
          >
            Book a free 30-minute call
          </a>
        </div>
      </motion.section>

      <section className="proj-section">
        <motion.div
          className="svc-grid"
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-40px" }}
        >
          {p.sections.map((s) => (
            <motion.article className="card svc-block" key={s.title} variants={cardIn}>
              <h2 className="svc-block__title">{s.title}</h2>
              <p className="card-body">{s.body}</p>
            </motion.article>
          ))}
        </motion.div>
      </section>

      <section className="proj-section">
        <h2 className="proj-section__title">Already Built</h2>
        <motion.div
          className="svc-proof"
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-40px" }}
        >
          {p.proof.map((c) => (
            <motion.div className="card svc-proof__item" key={c.name} variants={cardIn}>
              <span className="svc-proof__name">{c.name}</span>
              <span className="svc-proof__what">{c.what}</span>
            </motion.div>
          ))}
        </motion.div>
        <p className="price-note">
          See the work:{" "}
          <Link className="link" to="/websites">
            client sites <span className="plus">+</span>
          </Link>{" "}
          <Link className="link" to="/projects">
            branding &amp; design <span className="plus">+</span>
          </Link>
        </p>
      </section>

      <TrustedBy />

      <section className="proj-section">
        <h2 className="proj-section__title">Questions People Ask</h2>
        <motion.div
          className="svc-faqs"
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-40px" }}
        >
          {p.faqs.map((f) => (
            <motion.div className="card svc-faq" key={f.q} variants={cardIn}>
              <h3 className="svc-faq__q">{f.q}</h3>
              <p className="svc-faq__a">{f.a}</p>
            </motion.div>
          ))}
        </motion.div>
      </section>

      <section className="proj-section">
        <h2 className="proj-section__title">Send a Message</h2>
        <motion.div className="card work-message" variants={cardIn} initial="hidden" animate="show">
          <p className="card-body">
            Tell me what you need and I&apos;ll get back to you.
          </p>
          <MessageForm placeholder="What are you working on?" />
        </motion.div>
      </section>

      {/* Rendered into the markup rather than injected from an effect, so it
          is present in the prerendered HTML that crawlers read. */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
    </Page>
  );
}
