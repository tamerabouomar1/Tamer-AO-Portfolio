import { useState } from "react";
import { motion } from "framer-motion";
import Page, { container, cardIn } from "../components/Page";
import { DONATION } from "../siteData";

/* Small inline icons, matching the site's 24x24 / currentColor convention. */
const MethodIcon = {
  whish: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="4" y="6" width="16" height="12" rx="3" />
      <path d="M4 10h16" />
      <circle cx="16.5" cy="14" r="1.2" fill="currentColor" stroke="none" />
    </svg>
  ),
  omt: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 21s-7-4.5-7-10a7 7 0 0 1 14 0c0 5.5-7 10-7 10Z" />
      <circle cx="12" cy="11" r="2.4" />
    </svg>
  ),
  crypto: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="9" />
      <path d="M9 8h4.2a2.4 2.4 0 0 1 0 4.8H9V8Zm0 4.8h4.6a2.4 2.4 0 0 1 0 4.8H9v-4.8ZM11 6v12" />
    </svg>
  ),
};

const ShareIcon = {
  whatsapp: (
    <svg viewBox="0 0 24 24" fill="currentColor">
      <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2 22l5.25-1.38a9.9 9.9 0 0 0 4.79 1.22h.01c5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.82 9.82 0 0 0 12.04 2Zm5.8 14.06c-.24.68-1.42 1.32-1.95 1.36-.5.04-.97.24-3.27-.66-2.76-1.09-4.5-3.9-4.63-4.08-.14-.18-1.1-1.46-1.1-2.79s.7-1.98.94-2.25c.24-.27.53-.34.7-.34.18 0 .35 0 .5.01.16.01.38-.06.6.46.23.55.77 1.9.84 2.03.07.14.11.3.02.48-.09.18-.14.3-.27.46-.14.16-.29.36-.41.48-.14.14-.28.28-.12.55.16.27.72 1.18 1.54 1.91 1.06.95 1.96 1.24 2.23 1.38.27.14.43.11.59-.07.16-.18.68-.79.86-1.06.18-.27.36-.23.6-.14.24.09 1.55.73 1.82.86.27.14.45.2.51.32.07.11.07.64-.17 1.32Z" />
    </svg>
  ),
  link: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M10 13a5 5 0 0 0 7 0l3-3a5 5 0 0 0-7-7l-1 1" />
      <path d="M14 11a5 5 0 0 0-7 0l-3 3a5 5 0 0 0 7 7l1-1" />
    </svg>
  ),
  share: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="18" cy="5" r="3" />
      <circle cx="6" cy="12" r="3" />
      <circle cx="18" cy="19" r="3" />
      <path d="m8.6 13.5 6.8 4M15.4 6.5 8.6 10.5" />
    </svg>
  ),
};

const SHARE_TEXT =
  "Help fund a student athlete in Beirut — the whole ask is $1. Give and share:";

export default function Fund() {
  const [copiedId, setCopiedId] = useState(null);

  const pageUrl =
    typeof window !== "undefined" ? window.location.origin + "/fund" : "";

  const copy = async (text, id) => {
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      // Fallback for browsers that block the async clipboard API.
      const el = document.createElement("textarea");
      el.value = text;
      el.style.position = "fixed";
      el.style.opacity = "0";
      document.body.appendChild(el);
      el.select();
      try {
        document.execCommand("copy");
      } catch {
        /* ignore — nothing else we can do */
      }
      document.body.removeChild(el);
    }
    setCopiedId(id);
    setTimeout(() => setCopiedId((c) => (c === id ? null : c)), 1800);
  };

  const nativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({ title: DONATION.title, text: SHARE_TEXT, url: pageUrl });
        return;
      } catch {
        /* user cancelled — fall through to copy */
      }
    }
    copy(`${SHARE_TEXT} ${pageUrl}`, "share-link");
  };

  const whatsappHref =
    "https://wa.me/?text=" + encodeURIComponent(`${SHARE_TEXT} ${pageUrl}`);

  return (
    <Page>
      <header className="topbar">
        <div>
          <h2 className="topbar__title">{DONATION.title}</h2>
          <p className="topbar__sub">{DONATION.tagline}</p>
        </div>
        <a className="link" href="#give">
          Give $1 <span className="plus">+</span>
        </a>
      </header>

      {/* headline numbers */}
      <motion.div className="stat-row" variants={container} initial="hidden" animate="show">
        <motion.article className="card stat" variants={cardIn}>
          <span className="stat-num">$1</span>
          <span className="stat-label">The whole ask</span>
        </motion.article>
        <motion.article className="card stat" variants={cardIn}>
          <span className="stat-num">100+</span>
          <span className="stat-label">Students Coached</span>
        </motion.article>
        <motion.article className="card stat" variants={cardIn}>
          <span className="stat-line">
            <span className="stat-num">2×</span>
            <span className="stat-unit">Scholarships</span>
          </span>
          <span className="stat-label">Earned as an athlete</span>
        </motion.article>
      </motion.div>

      {/* the story */}
      <section className="proj-section" style={{ marginTop: "var(--gap)" }}>
        <p className="card-body fund-lead">{DONATION.intro}</p>
      </section>

      {/* where the dollar goes */}
      <section className="proj-section">
        <h3 className="section-title">Where your dollar goes</h3>
        <motion.div className="stat-row" variants={container} initial="hidden" animate="show">
          {DONATION.usage.map((u) => (
            <motion.article className="card stat" variants={cardIn} key={u.label} style={{ gap: 10 }}>
              <span className="stat-text" style={{ fontSize: "clamp(17px,1.7vw,24px)" }}>
                {u.label}
              </span>
              <span className="stat-label" style={{ maxWidth: "26ch" }}>
                {u.detail}
              </span>
            </motion.article>
          ))}
        </motion.div>
      </section>

      {/* payment methods */}
      <section className="proj-section" id="give">
        <h3 className="section-title">Give $1 — choose a method</h3>
        <motion.div className="fund-methods" variants={container} initial="hidden" animate="show">
          {DONATION.methods.map((m) => (
            <motion.article className="card pay-card" variants={cardIn} key={m.id}>
              <div className="pay-card__head">
                <span className="pay-card__icon">{MethodIcon[m.id]}</span>
                <span className="pay-card__name">{m.name}</span>
              </div>
              <p className="pay-card__note">{m.note}</p>
              <div className="pay-value">
                <span className="pay-value__text">{m.value}</span>
                <button
                  className={"pay-copy" + (copiedId === m.id ? " is-copied" : "")}
                  onClick={() => copy(m.value, m.id)}
                  type="button"
                >
                  {copiedId === m.id ? "Copied ✓" : "Copy"}
                </button>
              </div>
            </motion.article>
          ))}
        </motion.div>
      </section>

      {/* share — the real growth engine */}
      <section className="proj-section">
        <motion.div className="card cta" variants={cardIn} initial="hidden" animate="show" style={{ minHeight: 0 }}>
          <h3 className="card-title">Can&apos;t give? Share instead.</h3>
          <p className="card-body">{DONATION.promise}</p>
          <div className="fund-share">
            <a className="share-btn share-btn--wa" href={whatsappHref} target="_blank" rel="noreferrer">
              {ShareIcon.whatsapp} Share on WhatsApp
            </a>
            <button className="share-btn" type="button" onClick={nativeShare}>
              {ShareIcon.share} Share…
            </button>
            <button
              className={"share-btn" + (copiedId === "share-link" ? " is-copied" : "")}
              type="button"
              onClick={() => copy(pageUrl, "share-link")}
            >
              {ShareIcon.link} {copiedId === "share-link" ? "Link copied ✓" : "Copy link"}
            </button>
          </div>
        </motion.div>
      </section>
    </Page>
  );
}
