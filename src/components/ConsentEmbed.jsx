import { useState } from "react";
import { Link } from "react-router-dom";

/* A placeholder that becomes a third-party embed when you ask it to.
 *
 * ── The problem this solves ───────────────────────────────────────────────
 * Two things on this site come from other companies: Instagram posts and the
 * Calendly calendar. Both used to load on their own. The moment either did,
 * the visitor's browser connected to Meta or to Calendly and handed over an
 * IP address, and both set cookies in the process.
 *
 * Under the ePrivacy rules, storing or reading anything on someone's device
 * that is not strictly necessary needs consent BEFORE it happens. A visitor
 * who never scrolled to the Instagram section had still been announced to
 * Meta by the time they left, and there was no point in the page where they
 * had been asked.
 *
 * ── Why a facade rather than a cookie banner ──────────────────────────────
 * The two ways to fix that are opposite in cost:
 *
 *   A banner asks every visitor, on every visit, about something most of them
 *   will never touch. It costs a consent-management platform, an interruption
 *   on first paint, and a measurable share of visitors who bounce off the
 *   overlay. It also has to be honest, which means a working "reject" that
 *   then has to gate the embeds anyway.
 *
 *   A facade asks nobody. Nothing third-party loads, so there is nothing to
 *   consent to, so there is no banner. The visitor who wants the calendar
 *   clicks the calendar, and that click IS the consent: specific, informed,
 *   and unmistakably an affirmative action, which is a better-quality consent
 *   than a blanket "Accept all" ever produces.
 *
 * The facade is also faster. An Instagram embed is several hundred kilobytes
 * and a Calendly widget more, and this page pays for neither until asked.
 *
 * ── Scope of the consent ──────────────────────────────────────────────────
 * Deliberately NOT remembered. No localStorage, no cookie recording that you
 * consented, because storing a record of consent in order to avoid asking for
 * consent is the snake eating itself. It lasts as long as the component is
 * mounted. The cost is clicking again on a later visit; the benefit is that
 * this component stores nothing on anyone's device, which is the entire claim
 * the Cookie Policy makes.
 */
export default function ConsentEmbed({
  /* Rendered once the visitor opts in. A function, not an element: passing an
     element would build the iframe on every render and defeat the point, and
     the whole component's job is that the child does not exist yet. */
  children,
  /* Who receives the data. Named in the button and in the notice, because
     "load content" tells a visitor nothing about who is being told they are
     here. */
  provider,
  /* What they get by clicking, e.g. "the booking calendar". */
  label,
  className = "",
}) {
  const [loaded, setLoaded] = useState(false);

  if (loaded) return children();

  return (
    <div className={`consent-embed ${className}`.trim()}>
      <div className="consent-embed__inner">
        <p className="consent-embed__what">{label}</p>
        <p className="consent-embed__why">
          This is loaded from {provider}. Opening it lets {provider} see your IP address and
          set their own cookies, the same as visiting them directly. Nothing is sent to them
          until you press the button.
        </p>
        <button
          type="button"
          className="btn-book consent-embed__btn"
          onClick={() => setLoaded(true)}
        >
          Load {label.toLowerCase()}
        </button>
        <p className="consent-embed__note">
          Applies to this one for this visit. <Link to="/cookies">Cookie Policy</Link>
        </p>
      </div>
    </div>
  );
}
