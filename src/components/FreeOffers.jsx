import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { container, cardIn } from "./Page";
import { CONTACT, FREE_OFFERS } from "../siteData";

/* The free half of the site, in one place.
 *
 * Stage 0 of the scaling roadmap is a single instruction: get people to try
 * your stuff for free. So each service line gets a card here, the card says
 * what arrives and how fast, and the paid step sits underneath it in plain
 * words rather than waiting to ambush anyone.
 *
 * Three of the four offers need a conversation to start, so they open the
 * claim form below. The templates need nothing — they are a download — so
 * that card links straight into the store instead of collecting a form first.
 */

const waNumber = CONTACT.phoneHref.replace(/[^0-9]/g, "");

/** One free offer. `compact` drops the paid line, for the homepage band. */
function OfferCard({ offer, onClaim, compact }) {
  const body = (
    <>
      <div className="freecard__head">
        <span className="freecard__kicker">{offer.kicker}</span>
        <span className="freecard__free">Free</span>
      </div>
      <h4 className="freecard__name">{offer.name}</h4>
      <p className="card-body freecard__blurb">{offer.blurb}</p>
      <ul className="freecard__meta">
        <li>{offer.turnaround}</li>
        <li>{offer.proof}</li>
      </ul>
    </>
  );

  return (
    <motion.article className="card freecard" variants={cardIn}>
      {body}

      {offer.kind === "download" ? (
        <Link className="btn-book freecard__go" to={offer.to}>
          {offer.cta}
        </Link>
      ) : offer.kind === "call" ? (
        <a
          className="btn-book freecard__go"
          href={CONTACT.calendly}
          target="_blank"
          rel="noreferrer noopener"
        >
          {offer.cta}
        </a>
      ) : (
        <button className="btn-book freecard__go" onClick={() => onClaim(offer)}>
          {offer.cta}
        </button>
      )}

      {!compact && (
        <p className="freecard__paid">
          <span className="freecard__paid-label">{offer.paid.label}</span>
          {offer.paid.detail}
        </p>
      )}
    </motion.article>
  );
}

/** The claim form, for the offers that need something sent in. */
function ClaimModal({ offer, onClose }) {
  const [who, setWho] = useState({ name: "", reach: "", about: "" });
  const [status, setStatus] = useState("idle");

  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  if (!offer) return null;

  const message =
    `Hi Tamer, I'd like to claim the free ${offer.name.toLowerCase()}.\n` +
    `Name: ${who.name || "(not given)"}\n` +
    `Best contact: ${who.reach || "(this WhatsApp)"}\n\n` +
    (who.about ? `${who.about}\n\n` : "") +
    `Here's what I'm working with: `;

  const wa = `https://wa.me/${waNumber}?text=${encodeURIComponent(message)}`;

  async function handleSubmit(e) {
    e.preventDefault();
    setStatus("sending");

    // File the claim first so it survives whether or not the WhatsApp tab
    // makes it past a popup blocker. Same fire-and-forget shape the template
    // download uses: a claim is never lost because a third party misbehaved.
    try {
      const res = await fetch("/api/claim", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          name: who.name,
          reach: who.reach,
          about: who.about,
          offer: offer.name,
        }),
        keepalive: true,
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok || !data.ok) throw new Error();
      setStatus("sent");
    } catch {
      // Storage being down is not the visitor's problem, and the WhatsApp
      // hand-off still reaches Tamer. Say it went through, open the thread.
      setStatus("sent");
    }
    window.open(wa, "_blank", "noopener,noreferrer");
  }

  return (
    <motion.div
      className="lightbox"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        className="card buy claim"
        initial={{ scale: 0.96, opacity: 0, y: 12 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.96, opacity: 0 }}
        transition={{ type: "spring", stiffness: 260, damping: 26 }}
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label={`Claim the free ${offer.name}`}
      >
        <div className="buy__head">
          <div>
            <span className="web-card__tag">{offer.kicker}</span>
            <h3 className="buy__title">{offer.name}</h3>
            <p className="buy__sub">
              Free, and it stays free. {offer.turnaround.toLowerCase()}, sent straight
              back to you.
            </p>
          </div>
          <button className="weblb__close" onClick={onClose} aria-label="Close">
            ×
          </button>
        </div>

        {status === "sent" ? (
          <div className="claim__done" role="status">
            <p className="card-body">
              Claimed. I&apos;ll come back to you {offer.turnaround.toLowerCase()}.
            </p>
            <p className="price-note">
              A WhatsApp thread just opened so you can send what you have. If it
              didn&apos;t,{" "}
              <a className="link" href={wa} target="_blank" rel="noreferrer noopener">
                open it here
              </a>{" "}
              or email <a className="link" href={`mailto:${CONTACT.email}`}>{CONTACT.email}</a>.
            </p>
          </div>
        ) : (
          <form className="buy__grab" onSubmit={handleSubmit}>
            <div className="buy__fields">
              <label className="buy__field">
                <span>Your name</span>
                <input
                  type="text"
                  required
                  autoComplete="name"
                  placeholder="Jane Haddad"
                  value={who.name}
                  onChange={(e) => setWho((w) => ({ ...w, name: e.target.value }))}
                />
              </label>
              <label className="buy__field">
                <span>Email or WhatsApp</span>
                <input
                  type="text"
                  required
                  autoComplete="email"
                  placeholder="jane@company.com"
                  value={who.reach}
                  onChange={(e) => setWho((w) => ({ ...w, reach: e.target.value }))}
                />
              </label>
            </div>
            <label className="buy__field">
              <span>What are you working on? (optional)</span>
              <textarea
                rows={3}
                placeholder="A link, a handle, or a line about the business."
                value={who.about}
                onChange={(e) => setWho((w) => ({ ...w, about: e.target.value }))}
              />
            </label>
            <button className="btn-book buy-go" type="submit" disabled={status === "sending"}>
              {status === "sending" ? "Sending…" : offer.cta}
            </button>
          </form>
        )}

        <p className="price-note buy__note">
          No payment and no card. You are not signing up for anything, and there is
          no obligation to buy afterwards.
        </p>
      </motion.div>
    </motion.div>
  );
}

/**
 * The grid of free offers.
 *
 * `compact` is the homepage treatment: the same cards without the paid line
 * underneath, because the homepage's job is to get someone to take something,
 * not to sell them the step after it.
 */
export default function FreeOffers({
  title = "Start with something",
  accent = "free",
  lede = "Every line of work here has a way in that costs nothing. Take it, use it, and decide about the rest afterwards.",
  flag = "No card · No obligation",
  compact = false,
  offers = FREE_OFFERS,
}) {
  const [claiming, setClaiming] = useState(null);

  return (
    <section className="proj-section freeblock">
      <div className="storehead">
        {flag && <span className="storehead__flag">{flag}</span>}
        <h3 className="storehead__title">
          {title} {accent && <span className="storehead__accent">{accent}</span>}
        </h3>
        <p className="storehead__lede">{lede}</p>
      </div>

      <motion.div
        className="free-grid"
        variants={container}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-60px" }}
      >
        {offers.map((o) => (
          <OfferCard key={o.id} offer={o} onClaim={setClaiming} compact={compact} />
        ))}
      </motion.div>

      <AnimatePresence>
        {claiming && <ClaimModal offer={claiming} onClose={() => setClaiming(null)} />}
      </AnimatePresence>
    </section>
  );
}
