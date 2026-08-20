import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CONTACT, PAYMENT_METHODS, TEMPLATE_PACKAGES, subscribeUrl } from "../siteData";

/* The membership window, opened by "See the full gallery" under the store.

   The gallery shows a handful of templates to anyone. Everything past that is
   the membership, so the plus sign has to land somewhere that can actually
   take the money rather than on a waiting list.

   Two ways through, in order of how little they ask of the buyer:

     1. A hosted checkout, if SUBSCRIBE_LINKS has a real URL for the plan. That
        is a plain link to the processor's own domain, so no card details ever
        touch this site.
     2. Whish, OMT or a bank transfer — which is how money actually moves in
        Lebanon. Pick a plan, pick a method, send the amount, then one tap
        opens WhatsApp with the plan, the amount and the method already
        written out so nothing has to be re-typed or remembered.

   Deliberately NOT here: any field that takes a card number, an IBAN or a
   payment confirmation code. This site never collects those — see SECURITY.md.
   Method 2 tells someone where to send money and then gets out of the way. */

const waNumber = CONTACT.phoneHref.replace(/[^0-9]/g, "");
const PLANS = TEMPLATE_PACKAGES.filter((p) => p.subscription);

export default function MemberModal({ onClose }) {
  const [planId, setPlanId] = useState(PLANS.find((p) => p.featured)?.id ?? PLANS[0]?.id);
  const [methodId, setMethodId] = useState(null);

  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  const plan = PLANS.find((p) => p.id === planId) ?? PLANS[0];
  const method = PAYMENT_METHODS.find((m) => m.id === methodId);
  const checkout = subscribeUrl(plan?.id);
  if (!plan) return null;

  const amount = `$${plan.flat}`;
  const per = plan.period?.includes("year") ? "a year" : "a month";

  const message =
    `Hi Tamer, I'd like the ${plan.name}, ${amount} ${per}.\n` +
    (method ? `Paying by: ${method.name}\n` : "") +
    `\nHere's my name and the email to open the library on: `;
  const wa = `https://wa.me/${waNumber}?text=${encodeURIComponent(message)}`;

  return (
    <motion.div
      className="lightbox"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        className="card buy member"
        initial={{ scale: 0.96, opacity: 0, y: 12 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.96, opacity: 0 }}
        transition={{ type: "spring", stiffness: 260, damping: 26 }}
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label="Become a member"
      >
        <div className="buy__head">
          <div>
            <span className="web-card__tag">Membership</span>
            <h3 className="buy__title">Open the full gallery</h3>
            <p className="buy__sub">
              Every template and every font in one download, plus whatever ships next
              week. Cancel any time and keep what you took.
            </p>
          </div>
          <button className="weblb__close" onClick={onClose} aria-label="Close">
            ×
          </button>
        </div>

        {/* Step 1 — the plan */}
        <div className="buy__tiers">
          {PLANS.map((p) => (
            <button
              key={p.id}
              type="button"
              className={
                "buy-tier" +
                (p.id === planId ? " is-on" : "") +
                (p.featured ? " is-featured" : "")
              }
              onClick={() => setPlanId(p.id)}
              aria-pressed={p.id === planId}
            >
              {p.badge && <span className="buy-tier__badge">{p.badge}</span>}
              <span className="buy-tier__name">{p.name}</span>
              <span className="buy-tier__tagline">{p.tagline}</span>
              <span className="buy-tier__price">
                ${p.flat}
                <em className="buy-tier__per">
                  {p.period?.includes("year") ? " / year" : " / month"}
                </em>
              </span>
            </button>
          ))}
        </div>

        <ul className="price-card__features buy__features">
          {plan.features.map((f) => (
            <li key={f}>
              <span className="tick" aria-hidden="true" />
              {f}
            </li>
          ))}
        </ul>

        {/* Step 2 — how it gets paid. A hosted checkout takes precedence when
            one exists; the local methods stay underneath it either way, since
            plenty of people here would rather send Whish than use a card. */}
        {checkout && (
          <a
            className="btn-book buy-go"
            href={checkout}
            target="_blank"
            rel="noreferrer noopener"
          >
            Pay by card, {amount} {per}
          </a>
        )}

        <div className="member__pay">
          <p className="member__pay-title">
            {checkout ? "Or pay locally" : `Pay ${amount} ${per} by`}
          </p>
          <div className="member__methods">
            {PAYMENT_METHODS.map((m) => (
              <button
                key={m.id}
                type="button"
                className={"member__method" + (m.id === methodId ? " is-on" : "")}
                onClick={() => setMethodId(m.id === methodId ? null : m.id)}
                aria-pressed={m.id === methodId}
              >
                <span className="member__method-name">{m.name}</span>
                <span className="member__method-blurb">{m.blurb}</span>
              </button>
            ))}
          </div>

          {method && (
            <div className="member__detail">
              {method.detail ? (
                <p className="member__detail-line">
                  <span className="member__detail-label">{method.detailLabel}</span>
                  <strong>{method.detail}</strong>
                </p>
              ) : null}
              <p className="member__detail-note">{method.note}</p>
            </div>
          )}
        </div>

        <a className="btn-book buy-go" href={wa} target="_blank" rel="noreferrer noopener">
          {method ? `Send the details on WhatsApp` : `Start on WhatsApp, ${amount} ${per}`}
        </a>

        <p className="price-note buy__note">
          Access is opened by hand the same day the payment lands, usually within the
          hour. Nothing on this site asks for a card number or an account number. You
          pay in your own app or at the counter, and I never see the details.
        </p>
      </motion.div>
    </motion.div>
  );
}

/** Small helper so callers can animate the modal in and out. */
export function MemberModalHost({ open, onClose }) {
  return <AnimatePresence>{open && <MemberModal onClose={onClose} />}</AnimatePresence>;
}
