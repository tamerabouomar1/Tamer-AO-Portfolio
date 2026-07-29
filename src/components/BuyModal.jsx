import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CONTACT, TEMPLATE_PACKAGES } from "../siteData";

/* The purchase step, shared by the store grid and the live preview bar.
   There is no card processor wired up yet, so checkout hands off to a
   prefilled WhatsApp thread (fastest reply) with email as the fallback and
   Calendly for the quoted Custom tier. Swap `href` on .buy-go for a Stripe
   payment link later and nothing else here has to change. */

const waNumber = CONTACT.phoneHref.replace(/[^0-9]/g, "");

function priceOf(tpl, pkg) {
  if (pkg.from) return { label: `from $${pkg.from}`, amount: pkg.from };
  return { label: `$${tpl.price + pkg.add}`, amount: tpl.price + pkg.add };
}

export default function BuyModal({ template, onClose }) {
  const [picked, setPicked] = useState(
    TEMPLATE_PACKAGES.find((p) => p.featured)?.id ?? TEMPLATE_PACKAGES[0].id
  );

  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  if (!template) return null;

  const pkg = TEMPLATE_PACKAGES.find((p) => p.id === picked);
  const price = priceOf(template, pkg);

  const message =
    `Hi Tamer, I'd like the "${template.name}" website template.\n` +
    `Package: ${pkg.name} (${price.label})\n\n` +
    `Here's a bit about my business: `;

  const wa = `https://wa.me/${waNumber}?text=${encodeURIComponent(message)}`;
  const mail =
    `mailto:${CONTACT.email}` +
    `?subject=${encodeURIComponent(`${template.name} template: ${pkg.name}`)}` +
    `&body=${encodeURIComponent(message)}`;

  return (
    <motion.div
      className="lightbox"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        className="card buy"
        initial={{ scale: 0.96, opacity: 0, y: 12 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.96, opacity: 0 }}
        transition={{ type: "spring", stiffness: 260, damping: 26 }}
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label={`Buy the ${template.name} template`}
      >
        <div className="buy__head">
          <div>
            <span className="web-card__tag">{template.tag}</span>
            <h3 className="buy__title">{template.name}</h3>
            <p className="buy__sub">Pick how you want it delivered.</p>
          </div>
          <button className="weblb__close" onClick={onClose} aria-label="Close">
            ×
          </button>
        </div>

        <div className="buy__tiers">
          {TEMPLATE_PACKAGES.map((p) => {
            const pr = priceOf(template, p);
            const on = p.id === picked;
            return (
              <button
                key={p.id}
                type="button"
                className={`buy-tier${on ? " is-on" : ""}${p.featured ? " is-featured" : ""}`}
                onClick={() => setPicked(p.id)}
                aria-pressed={on}
              >
                {p.save && <span className="buy-tier__badge">{p.save}</span>}
                <span className="buy-tier__name">{p.name}</span>
                <span className="buy-tier__tagline">{p.tagline}</span>
                <span className="buy-tier__price">{pr.label}</span>
              </button>
            );
          })}
        </div>

        <ul className="price-card__features buy__features">
          {pkg.features.map((f) => (
            <li key={f}>
              <span className="tick" />
              {f}
            </li>
          ))}
          {pkg.bonus && (
            <li>
              <span className="tick tick--gift" />
              <span className="price-card__bonus">{pkg.bonus}</span>
            </li>
          )}
        </ul>

        <div className="buy__actions">
          <a className="btn-book buy-go" href={wa} target="_blank" rel="noreferrer noopener">
            {pkg.from ? `Get a quote, ${price.label}` : `Buy on WhatsApp for ${price.label}`}
          </a>
          <a className="btn-book buy-alt" href={mail}>
            Email instead
          </a>
          {pkg.from && (
            <a
              className="btn-book buy-alt"
              href={CONTACT.calendly}
              target="_blank"
              rel="noreferrer noopener"
            >
              Book a call
            </a>
          )}
        </div>

        <p className="price-note buy__note">
          Payment by bank transfer, Whish or Western Union once we agree the scope. Source
          Files are delivered as a zip plus a private Git repo. Nothing is charged before
          you approve the quote.
        </p>
      </motion.div>
    </motion.div>
  );
}

/** Small helper so callers can animate the modal in and out. */
export function BuyModalHost({ template, onClose }) {
  return (
    <AnimatePresence>
      {template && <BuyModal template={template} onClose={onClose} />}
    </AnimatePresence>
  );
}
