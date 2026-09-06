import { useId, useState } from "react";
import { Link } from "react-router-dom";
import Turnstile from "./Turnstile";
import { CONTACT } from "../siteData";

/* The site's one contact form, shared by every page that wants "send me a
 * message" rather than a survey.
 *
 * It posts to the site's own Worker (worker/index.js), which files the message
 * in KV next to the template leads. Read them back at /api/leads?token=... —
 * same endpoint, newest first. The Worker also records the referer, so which
 * page a message came from is already known without asking for it.
 *
 * It posted to "/" for Netlify Forms until the move to Cloudflare, where that
 * POST answers 405 and the message goes nowhere.
 *
 * ── Why there are <label>s now, when placeholders looked fine ──────────────
 * A placeholder is not a label, and the difference is not cosmetic:
 *
 *   1. It disappears the moment you type. Anyone interrupted mid-form comes
 *      back to three filled boxes with nothing saying what they are.
 *   2. Browsers expose the placeholder as an accessible name only as a LAST
 *      resort, and some assistive tech ignores it entirely, so a screen
 *      reader user could reach a required field announced as "edit, blank".
 *   3. WCAG 3.3.2 (Labels or Instructions) requires a persistent label on
 *      any input needing one. Placeholder-only forms are the single most
 *      common finding in accessibility complaints against small sites.
 *
 * The labels are visually hidden (.sr-only) rather than drawn, so the form
 * looks exactly as it did while being announced correctly. That is a
 * deliberate compromise: a visible label above every field would change a
 * layout that works. Every field keeps its placeholder as well, so nothing is
 * lost for a sighted user.
 *
 * ── Why there is a consent checkbox ───────────────────────────────────────
 * The form collects a name and a contact and stores them for up to 24 months.
 * Under GDPR that needs a lawful basis, and for an unsolicited enquiry the
 * honest one is consent: freely given, specific, informed, and by a clear
 * affirmative action. "Informed" is why the box carries a link to the privacy
 * policy rather than just asserting one exists, and "affirmative action" is
 * why it starts unchecked. A pre-ticked box is explicitly not consent.
 */
export default function MessageForm({
  placeholder = "What do you have in mind?",
  cta = "Send message",
  rows = 5,
}) {
  const [status, setStatus] = useState("idle");

  /* useId, not a hardcoded string. This component renders more than once on
     some pages, and duplicate ids would point every label at the first
     form's fields — which is worse than no label, because the browser
     believes it worked. */
  const id = useId();
  const nameId = `${id}-name`;
  const reachId = `${id}-reach`;
  const msgId = `${id}-message`;
  const consentId = `${id}-consent`;

  async function handleSubmit(e) {
    e.preventDefault();
    setStatus("sending");
    const body = Object.fromEntries(new FormData(e.target).entries());
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      // Only call it sent if the server actually said so. Reporting success on
      // a failed post is worse than showing the error: the message is lost and
      // nobody knows to follow up.
      const data = await res.json().catch(() => ({}));
      if (!res.ok || !data.ok) throw new Error();
      setStatus("sent");
    } catch {
      setStatus("error");
    }
  }

  if (status === "sent") {
    return (
      /* role="status" so this is announced. Replacing the form with a
         confirmation is a visual change a sighted user cannot miss and a
         screen reader user would otherwise never be told about: focus stays
         where the submit button used to be, on an element that no longer
         exists, and nothing speaks. */
      <p className="form-status form-status--ok" role="status">
        Message sent. I&apos;ll get back to you soon.
      </p>
    );
  }

  return (
    <form className="msg-form" name="contact" onSubmit={handleSubmit}>
      <p className="hp" aria-hidden="true">
        {/* tabIndex={-1} keeps this out of the tab order, which is what makes
            it safe to sit inside aria-hidden: a focusable element inside a
            hidden subtree is an ARIA error, an unfocusable one is not. */}
        <input name="bot-field" tabIndex={-1} autoComplete="off" />
      </p>

      <div className="msg-form__row">
        <div className="msg-form__field">
          <label className="sr-only" htmlFor={nameId}>
            Your name
          </label>
          <input
            id={nameId}
            name="name"
            type="text"
            placeholder="Your name"
            autoComplete="name"
            required
          />
        </div>

        <div className="msg-form__field">
          <label className="sr-only" htmlFor={reachId}>
            Your email address or WhatsApp number
          </label>
          {/* Deliberately type="text", not type="email". This form used to demand
              an address, and a browser silently refuses to submit a phone number
              into type="email" — so anyone who reaches for WhatsApp first, which
              here is most people, simply could not send the message. The other
              forms have always taken either. */}
          <input
            id={reachId}
            name="email"
            type="text"
            placeholder="Your email or WhatsApp"
            autoComplete="email"
            required
          />
        </div>
      </div>

      <label className="sr-only" htmlFor={msgId}>
        Your message
      </label>
      <textarea id={msgId} name="message" rows={rows} placeholder={placeholder} required />

      {/* No onToken needed: this form submits via new FormData(e.target), and
          Turnstile writes its own hidden cf-turnstile-response input into the
          form, so the token is collected with everything else. */}
      <Turnstile />

      {/* Required, and unchecked by default. `required` means the browser
          blocks submission and points at the box itself, which is the clearest
          possible statement that this is not a formality. */}
      <div className="msg-form__consent">
        <input id={consentId} name="consent" type="checkbox" value="yes" required />
        <label htmlFor={consentId}>
          I&apos;m happy for Tamer to store this message and my contact details in order to reply.
          See the <Link to="/privacy">Privacy Policy</Link>.
        </label>
      </div>

      <div className="msg-form__foot">
        <button className="btn-book" type="submit" disabled={status === "sending"}>
          {status === "sending" ? "Sending…" : cta}
        </button>

        {/* role="alert" rather than role="status": a failed send is the one
            message here somebody must not miss, and alert interrupts rather
            than waiting for a pause. The live region is always in the DOM so
            the announcement fires on content change; an element that appears
            AND changes in the same tick is announced unreliably. */}
        <span className="form-status form-status--err" role="alert">
          {status === "error" && (
            <>
              Couldn&apos;t send. Email me instead:{" "}
              <a href={`mailto:${CONTACT.email}`}>{CONTACT.email}</a>
            </>
          )}
        </span>
      </div>
    </form>
  );
}
