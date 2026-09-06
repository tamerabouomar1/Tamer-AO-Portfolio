import { useEffect, useState } from "react";
import useFocusTrap from "../lib/useFocusTrap";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { CONTACT, TEMPLATE_PACKAGES, templateZip } from "../siteData";
import { isPremium } from "../premium";
import Turnstile from "./Turnstile";

/* The delivery step, shared by the store grid and the live preview bar.

   Source Files are free, so that tier is not a checkout at all: it is a short
   form that starts the zip download and, in the same click, opens a prefilled
   WhatsApp message so the person who took it is someone Tamer can actually
   follow up with. The download fires either way — the value is given whether
   or not they finish saying hello.

   The membership tiers hand off to a prefilled WhatsApp thread, with email as
   the fallback. There is no card processor wired up yet; swap `href` on
   .buy-go for a Stripe SUBSCRIPTION link (not a one-off payment link) when one
   exists, and nothing else here has to change. */

const waNumber = CONTACT.phoneHref.replace(/[^0-9]/g, "");

function priceOf(tpl, pkg) {
  if (pkg.free) return { label: "Free", amount: 0 };
  if (pkg.from) return { label: `from $${pkg.from}`, amount: pkg.from };
  return { label: `$${pkg.flat}`, amount: pkg.flat };
}

export default function BuyModal({ template, onClose }) {
  const trapRef = useFocusTrap(!!template);

  /* Two ladders now.
     The thirty free templates open on the free tier, for the same reason as
     before: burying a free file behind a click on a paid plan wastes the point
     of giving it away. The twelve animation-heavy ones are the membership, so
     the free tier is not offered at all rather than shown and then refused —
     a disabled option someone has already chosen reads as a bait. */
  const locked = !!template && isPremium(template.slug);
  const tiers = locked ? TEMPLATE_PACKAGES.filter((p) => !p.free) : TEMPLATE_PACKAGES;

  const [picked, setPicked] = useState(
    (locked ? tiers.find((p) => p.featured) : tiers.find((p) => p.free))?.id ?? tiers[0].id
  );
  const [who, setWho] = useState({ name: "", reach: "" });
  const [sent, setSent] = useState(false);
  const [token, setToken] = useState("");
  const [code, setCode] = useState("");
  const [unlock, setUnlock] = useState("");

  /* Reset the ladder whenever a different template opens this.
     useState's initialiser runs once for the life of the component, and the
     modal is kept mounted between openings — so without this, closing a
     membership template and opening a free one leaves the $19 tier selected
     and the free download nowhere on screen. The per-template state below is
     cleared for the same reason: a name typed for one template, or a rejected
     code, has no business surviving into the next one. */
  useEffect(() => {
    if (!template) return;
    const list = isPremium(template.slug)
      ? TEMPLATE_PACKAGES.filter((p) => !p.free)
      : TEMPLATE_PACKAGES;
    const want = isPremium(template.slug)
      ? list.find((p) => p.featured)
      : list.find((p) => p.free);
    setPicked((want ?? list[0]).id);
    setSent(false);
    setUnlock("");
  }, [template?.slug]);

  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  /* Hand over the file. The <a download> is what actually saves it; the worker
     has already decided whether this request is allowed to have it. */
  function saveZip() {
    const a = document.createElement("a");
    a.href = templateZip(template.slug);
    a.download = "";
    document.body.appendChild(a);
    a.click();
    a.remove();
  }

  /* An existing member typing their code. The cookie is set by the worker, so
     nothing here can mint access on its own — a wrong code fails at the edge
     whatever this component believes. */
  async function handleUnlock(e) {
    e.preventDefault();
    setUnlock("checking");
    try {
      const res = await fetch("/api/unlock", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ code }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok || !data.ok) {
        setUnlock(data.error || "that code is not active");
        return;
      }
      setUnlock("ok");
      saveZip();
    } catch {
      setUnlock("could not check that just now — try again in a moment");
    }
  }

  if (!template) return null;

  const pkg = tiers.find((p) => p.id === picked) ?? tiers[0];
  const price = priceOf(template, pkg);

  // The membership is not about the template that opened this modal, so it gets
  // its own opening line rather than asking for one site by name.
  const message = pkg.free
    ? `Hi Tamer, I just downloaded the free "${template.name}" template.\n` +
      `Name: ${who.name || "(not given)"}\n` +
      `Best contact: ${who.reach || "(this WhatsApp)"}\n\n` +
      `What I'm building: `
    : pkg.subscription
      ? `Hi Tamer, I'd like the ${pkg.name} (${price.label}) - the whole library plus the new one each week.\n\n` +
        `Here's a bit about my business: `
      : `Hi Tamer, I'd like the "${template.name}" website template.\n` +
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
        /* Focus moves in on open, Tab cycles inside, and focus goes
           back where it came from on close. tabIndex={-1} makes this
           element itself a valid focus target for the fallback case
           where the dialog has nothing focusable in it yet. */
        ref={trapRef}
        tabIndex={-1}
      >
        <div className="buy__head">
          <div>
            <span className="web-card__tag">{template.tag}</span>
            <h3 className="buy__title">{template.name}</h3>
            <p className="buy__sub">
              {locked
                ? "This one is part of the membership. Thirty other templates in the gallery are free to take right now."
                : "The files are free. Join the membership if you want every new one the week it ships."}
            </p>
          </div>
          <button className="weblb__close" onClick={onClose} aria-label="Close">
            ×
          </button>
        </div>

        <div className="buy__tiers">
          {tiers.map((p) => {
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
                {p.badge && <span className="buy-tier__badge">{p.badge}</span>}
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

        {pkg.free ? (
          <form
            className="buy__grab"
            onSubmit={(e) => {
              e.preventDefault();
              setSent(true);

              // Record the lead first, so it survives whether or not they go
              // through with the WhatsApp message. Fire-and-forget on purpose:
              // if the endpoint is down or blocked, they still get the file.
              // keepalive lets it finish even though we navigate a moment later.
              fetch("/api/lead", {
                method: "POST",
                headers: { "content-type": "application/json" },
                body: JSON.stringify({
                  name: who.name,
                  reach: who.reach,
                  template: template.name,
                  consent: "yes",
                  "cf-turnstile-response": token,
                }),
                keepalive: true,
              }).catch(() => {});

              // Say hello in one tab, hand over the file in this one. The
              // download is not conditional on the WhatsApp tab surviving a
              // popup blocker.
              window.open(wa, "_blank", "noopener,noreferrer");
              const a = document.createElement("a");
              a.href = templateZip(template.slug);
              a.download = "";
              a.click();
            }}
          >
            <div className="buy__fields">
              <label className="buy__field">
                <span>Your name</span>
                <input
                  type="text"
                  name="name"
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
                  name="reach"
                  required
                  autoComplete="email"
                  placeholder="jane@company.com"
                  value={who.reach}
                  onChange={(e) => setWho((w) => ({ ...w, reach: e.target.value }))}
                />
              </label>
            </div>
            <Turnstile onToken={setToken} />

            {/* Same reasoning as the other two forms: this stores a name and a
                contact, so it asks first. See MessageForm.jsx. */}
            <div className="msg-form__consent">
              <input id="buy-consent" type="checkbox" required />
              <label htmlFor="buy-consent">
                I&apos;m happy for Tamer to store my details in order to send this and
                reply. See the <Link to="/privacy">Privacy Policy</Link>.
              </label>
            </div>

            <button className="btn-book buy-go" type="submit">
              {sent ? "Download again" : `Download ${template.name}, free`}
            </button>
            {sent && (
              <p className="buy__done" role="status">
                Downloaded. Unzip it, run <code>npm install</code> then{" "}
                <code>npm run dev</code>, and it is running on your machine.
              </p>
            )}
          </form>
        ) : (
          <div className="buy__actions">
            <a className="btn-book buy-go" href={wa} target="_blank" rel="noreferrer noopener">
              {pkg.from ? `Get a quote, ${price.label}` : `Get started, ${price.label}`}
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
        )}

        {/* Someone who already paid should not have to go through WhatsApp
            again to get a second file. Access is opened by hand, so the code
            is what a member holds; this exchanges it for the cookie once and
            every later download just works. */}
        {locked && (
          <form className="buy__unlock" onSubmit={handleUnlock}>
            <label className="buy__field">
              <span>Already a member? Enter your access code</span>
              <input
                type="text"
                value={code}
                onChange={(e) => {
                  setCode(e.target.value.toUpperCase());
                  setUnlock("");
                }}
                placeholder="e.g. K7RMQ2XPTB94"
                autoComplete="off"
                spellCheck="false"
              />
            </label>
            <button className="btn-book buy-alt" type="submit" disabled={!code || unlock === "checking"}>
              {unlock === "checking" ? "Checking…" : "Unlock the download"}
            </button>
            {unlock && unlock !== "checking" && (
              <p
                className={unlock === "ok" ? "buy__done" : "buy__error"}
                role="status"
              >
                {unlock === "ok"
                  ? "Unlocked. The download has started, and every other membership template will download straight away from now on."
                  : unlock}
              </p>
            )}
          </form>
        )}

        <p className="price-note buy__note">
          {pkg.free
            ? "No payment and no card. The zip is a complete React project with a deploy guide, free for personal and client work. The demo photos, video and fonts belong to their owners, so swap those before you launch."
            : locked
              ? "Membership templates are the Canvas and WebGL builds — the ones that take days rather than hours. $19 a month gets all twelve plus every new one, and you keep whatever you have downloaded if you cancel. The demo photos, video and fonts belong to their owners, so swap those before you launch."
              : "Payment by bank transfer, Whish or Western Union once we agree the scope, and nothing is charged before you approve the quote. The source files stay free either way."}
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
