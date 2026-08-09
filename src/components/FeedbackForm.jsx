import { useState } from "react";
import { motion } from "framer-motion";
import { cardIn } from "./Page";

/* The two questions Stage 0 is actually built on.
 *
 * The roadmap's instruction for the free stage is not just "give it away" —
 * it is give it away, then ask what they thought and what would make it
 * better. That is the whole point of the free stage: it buys information you
 * cannot get any other way, from people with no reason to flatter you.
 *
 * So this is deliberately two questions and a contact field, not a survey.
 * Anything longer gets abandoned, and an abandoned form teaches nothing.
 *
 * Answers land in the same KV store as leads and messages, readable at
 * /api/leads?token=... alongside everything else.
 */
export default function FeedbackForm({
  what = "",
  title = "You took something free. What did you think?",
  lede = "Two questions, honestly answered, are worth more to me right now than a sale. Tell me what missed and I'll fix it.",
}) {
  const [form, setForm] = useState({ verdict: "", better: "", reach: "" });
  const [status, setStatus] = useState("idle");

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  async function handleSubmit(e) {
    e.preventDefault();
    setStatus("sending");
    try {
      const res = await fetch("/api/feedback", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ ...form, what }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok || !data.ok) throw new Error();
      setStatus("sent");
    } catch {
      setStatus("error");
    }
  }

  if (status === "sent") {
    return (
      <motion.div className="card feedback" variants={cardIn} initial="hidden" animate="show">
        <p className="form-status form-status--ok">
          Got it, thank you. This is the part that actually changes what gets built next.
        </p>
      </motion.div>
    );
  }

  return (
    <motion.div
      className="card feedback"
      variants={cardIn}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "-40px" }}
    >
      <h3 className="card-title">{title}</h3>
      <p className="card-body">{lede}</p>

      <form className="msg-form feedback__form" onSubmit={handleSubmit}>
        <label className="buy__field">
          <span>What did you think of it?</span>
          <textarea
            rows={3}
            required
            placeholder="Straight answers welcome. Especially the unflattering ones."
            value={form.verdict}
            onChange={set("verdict")}
          />
        </label>
        <label className="buy__field">
          <span>What would make it better?</span>
          <textarea
            rows={3}
            required
            placeholder="The thing you wished it did, or the bit that got in your way."
            value={form.better}
            onChange={set("better")}
          />
        </label>
        <label className="buy__field">
          <span>Where can I reach you? (optional)</span>
          <input
            type="text"
            placeholder="Only if you want an answer back."
            value={form.reach}
            onChange={set("reach")}
          />
        </label>

        <div className="msg-form__foot">
          <button className="btn-book" type="submit" disabled={status === "sending"}>
            {status === "sending" ? "Sending…" : "Send it"}
          </button>
          {status === "error" && (
            <span className="form-status form-status--err">
              Couldn&apos;t send that. Try again in a moment.
            </span>
          )}
        </div>
      </form>
    </motion.div>
  );
}
