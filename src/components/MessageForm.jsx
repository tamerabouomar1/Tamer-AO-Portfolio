import { useState } from "react";
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
 */
export default function MessageForm({
  placeholder = "What do you have in mind?",
  cta = "Send message",
  rows = 5,
}) {
  const [status, setStatus] = useState("idle");

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
      <p className="form-status form-status--ok">
        Message sent. I&apos;ll get back to you soon.
      </p>
    );
  }

  return (
    <form className="msg-form" name="contact" onSubmit={handleSubmit}>
      <p className="hp" aria-hidden="true">
        <input name="bot-field" tabIndex={-1} autoComplete="off" />
      </p>
      <div className="msg-form__row">
        <input name="name" type="text" placeholder="Your name" required />
        {/* Deliberately type="text", not type="email". This form used to demand
            an address, and a browser silently refuses to submit a phone number
            into type="email" — so anyone who reaches for WhatsApp first, which
            here is most people, simply could not send the message. The other
            forms have always taken either. */}
        <input
          name="email"
          type="text"
          placeholder="Your email or WhatsApp"
          autoComplete="email"
          required
        />
      </div>
      <textarea name="message" rows={rows} placeholder={placeholder} required />
      {/* No onToken needed: this form submits via new FormData(e.target), and
          Turnstile writes its own hidden cf-turnstile-response input into the
          form, so the token is collected with everything else. */}
      <Turnstile />

      <div className="msg-form__foot">
        <button className="btn-book" type="submit" disabled={status === "sending"}>
          {status === "sending" ? "Sending…" : cta}
        </button>
        {status === "error" && (
          <span className="form-status form-status--err">
            Couldn&apos;t send. Email me instead:{" "}
            <a href={`mailto:${CONTACT.email}`}>{CONTACT.email}</a>
          </span>
        )}
      </div>
    </form>
  );
}
