import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import Page, { container, cardIn } from "../components/Page";
import MessageForm from "../components/MessageForm";
import { TrustedBy } from "../components/SocialProof";
import { CONTACT, SERVICE_PAGES, SERVICE_UI } from "../siteData";
import SplitHeading from "../components/SplitHeading";

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
const DEFAULT_WORK = [
  { label: "client sites", to: "/websites" },
  { label: "branding & design", to: "/projects" },
];

/* `lang` is "ar" on the /ar/<slug> routes. The Arabic copy is an `ar` block
   on the same SERVICE_PAGES entry, laid over the English one, so anything the
   Arabic block does not set (slug, the sibling list) is shared rather than
   copied. The whole page body goes right-to-left; the sidebar stays English
   and left-to-right, because it is the same sidebar on every page. */
export default function ServicePage({ slug, lang = "en" }) {
  const base = SERVICE_PAGES.find((x) => x.slug === slug);
  if (!base) return null;
  const ar = lang === "ar" && Boolean(base.ar);
  const p = ar ? { ...base, ...base.ar } : base;
  const t = SERVICE_UI[ar ? "ar" : "en"];
  // The switch is a real link between two prerendered URLs, not a toggle
  // that swaps text in place: Google indexes URLs, and a translation that
  // only exists after a click is a translation it never sees.
  const otherLang = base.ar ? (ar ? `/${slug}` : `/ar/${slug}`) : null;
  const waNumber = CONTACT.phoneHref.replace(/\D/g, "");

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    inLanguage: ar ? "ar" : "en",
    mainEntity: p.faqs.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };

  return (
    <Page className={ar ? "svc-rtl" : ""} dir={ar ? "rtl" : undefined} lang={ar ? "ar" : undefined}>
      <header className="topbar">
        <div>
          {/* Whole words for Arabic: split into single letters, Arabic
              script loses its joins and every word falls apart mid-animation. */}
          <SplitHeading type={ar ? "words" : "chars"}>{p.h1}</SplitHeading>
          <p className="topbar__sub">{p.kicker}</p>
        </div>
        <div className="svc-topacts">
          {otherLang && (
            <Link
              className="link lang-switch"
              to={otherLang}
              lang={t.switchLang}
              hrefLang={t.switchLang}
            >
              {t.switchTo}
            </Link>
          )}
          <a className="link" href={CONTACT.calendly} target="_blank" rel="noreferrer noopener">
            {t.bookCall} <span className="plus">+</span>
          </a>
        </div>
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
            {t.bookCallLong}
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
              {/* A section could only ever be one paragraph, because `body`
                  was a plain string. That is fine for an argument and wrong
                  for a list: the price sections were reading out five or six
                  separate figures in running prose, and the Google Profile
                  page listed seven deliverables as sentences — the hardest
                  thing on the site to scan, while the same numbers already
                  appear as bulleted PriceCards on /websites. `bullets` is
                  optional, so every section that is genuinely prose is
                  untouched. */}
              {s.bullets && (
                <ul className="svc-block__list">
                  {s.bullets.map((b) => (
                    <li key={b}>{b}</li>
                  ))}
                </ul>
              )}
            </motion.article>
          ))}
        </motion.div>
      </section>

      <section className="proj-section">
        <h2 className="proj-section__title">{t.built}</h2>
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
        {/* `work` is optional and overrides where "See the work" points. The
            default pair suits every page about sites or branding; the video
            page's work lives on /media, and sending that visitor to a gallery
            of websites would be answering a question they did not ask. */}
        <p className="price-note">
          {t.seeWork}{" "}
          {(p.work || DEFAULT_WORK).map((w, i) => (
            <span key={w.to}>
              {i > 0 && " "}
              <Link className="link" to={w.to}>
                {w.label} <span className="plus">+</span>
              </Link>
            </span>
          ))}
        </p>
      </section>

      <TrustedBy title={t.trusted} />

      <section className="proj-section">
        <h2 className="proj-section__title">{t.faqs}</h2>
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

      {/* Cross-links between the service pages.
          Until this existed each one was an island: reachable from /websites
          or /work-with-me, linking to nothing but the store. A crawler reads
          links to decide what a cluster of pages is about and which of them
          matters, and a visitor who lands on the salon page from Google is
          often the same person who needs the social one. Generated from
          SERVICE_PAGES so a sixth page joins the block with no edit here. */}
      <section className="proj-section">
        <h2 className="proj-section__title">{t.also}</h2>
        <motion.div
          className="svc-proof"
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-40px" }}
        >
          {SERVICE_PAGES.filter((x) => x.slug !== p.slug).map((x) => (
            <motion.div
              className="card svc-proof__item"
              key={x.slug}
              variants={cardIn}
              lang={ar ? "en" : undefined}
              dir={ar ? "ltr" : undefined}
            >
              <Link className="svc-proof__name link" to={`/${x.slug}`}>
                {x.h1} <span className="plus">+</span>
              </Link>
              <span className="svc-proof__what">{x.kicker}</span>
            </motion.div>
          ))}
        </motion.div>
      </section>

      <section className="proj-section">
        <h2 className="proj-section__title">{t.contact}</h2>
        {/* The message form's labels, consent wording and errors are English,
            and half-translating a consent line is worse than not offering the
            form. The Arabic page offers WhatsApp and a call instead, which is
            how most people here would reach out first anyway. */}
        {ar ? (
          <motion.div className="card work-message" variants={cardIn} initial="hidden" animate="show">
            <p className="card-body">{t.contactBody}</p>
            <div className="svc-lede__acts">
              <a
                className="btn-book"
                href={`https://wa.me/${waNumber}?text=${encodeURIComponent(t.whatsappText)}`}
                target="_blank"
                rel="noreferrer noopener"
              >
                {t.whatsapp}
              </a>
              <a className="btn-book buy-alt" href={CONTACT.phoneHref}>
                {t.call} <span dir="ltr">{CONTACT.phone}</span>
              </a>
            </div>
          </motion.div>
        ) : (
          <motion.div className="card work-message" variants={cardIn} initial="hidden" animate="show">
            <p className="card-body">
              Tell me what you need and I&apos;ll get back to you.
            </p>
            <MessageForm placeholder="What are you working on?" />
          </motion.div>
        )}
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
