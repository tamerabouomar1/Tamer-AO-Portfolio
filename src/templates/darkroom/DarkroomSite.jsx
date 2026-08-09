import useTemplateFont from "../useTemplateFont";
import "./tokens.css";
import "./darkroom.css";

/* ── Darkroom — Product Story (Signature) ──────────────────────
   A single object treated like a museum artifact. Warm near-black canvas
   (#100904, never pure black), cream type (#ffedd7, never pure white), and
   one orange that appears only in credit lines.

   The typographic system has exactly two modes and the switch between them
   IS the information design:
     - UPPERCASE weight 500 for everything: nav, headings, labels, legal.
     - Mixed case weight 400 at 29px for body copy, and nothing else.
   When the reader sees mixed case, they know they are being talked to rather
   than labelled.

   Display sizes sit at line-height 0.9, which is tight enough that uppercase
   lines overlap their boxes and stack as a solid block. That is deliberate.

   The product is rendered in CSS rather than shipped as a photograph, so the
   template carries no licensed imagery and a buyer swaps one element. */

const NAV = ["Intro", "Features", "Product", "Contact"];

const REVEALS = [
  {
    heading: "Isn't just a coaster.",
    body: "Designed to lift, insulate, and grip in all the right ways. Darkroom makes the simplest moment feel considered.",
  },
  {
    heading: "Cut from one sheet.",
    body: "A single pressed layer, chamfered at the edge so it releases from the table instead of sticking to the base of the cup.",
  },
];

const SPECS = [
  ["Material", "Pressed cork, 4mm"],
  ["Diameter", "98 mm"],
  ["Finish", "Raw, unsealed"],
  ["Origin", "Made in Portugal"],
];

/* The artifact. Warm rim light from upper right, one soft contact shadow —
   built from gradients so there is no image to license or optimise. */
function Artifact({ angle = 0 }) {
  return (
    <div className="drk-object" style={{ "--tilt": `${angle}deg` }} aria-hidden="true">
      <div className="drk-disc">
        <div className="drk-disc-face" />
        <div className="drk-disc-edge" />
      </div>
      <div className="drk-contact" />
    </div>
  );
}

export default function DarkroomSite() {
  useTemplateFont(
    "https://fonts.googleapis.com/css2?family=Inter:wght@400;500&display=swap"
  );

  return (
    <div className="drk">
      <header className="drk-nav">
        <span className="drk-mark">Darkroom</span>
        <nav>
          {NAV.map((l, i) => (
            <a key={l} href="#top" className={i === 0 ? "is-on" : ""}>{l}</a>
          ))}
        </nav>
      </header>

      <span className="drk-side" aria-hidden="true">Darkroom 1-Model</span>

      <section className="drk-hero">
        <div className="drk-hero-plate" aria-hidden="true" />
        <div className="drk-hero-lock">
          <span className="drk-tag">Made for mugs, built for tables.</span>
          <h1 className="drk-display">Darkroom</h1>
        </div>

        <div className="drk-card">
          <span className="drk-tag">Designed in studio, pressed by hand.</span>
          <hr className="drk-rule" />
          <p className="drk-fine">
            A coaster with the same care usually reserved for the cup that sits on it.
          </p>
        </div>

        <div className="drk-thumb" aria-hidden="true">
          <span>Darkroom</span>
          <svg viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z" /></svg>
        </div>
      </section>

      {REVEALS.map((r, i) => (
        <section className="drk-reveal" key={r.heading}>
          <h2 className="drk-heading">{r.heading}</h2>
          <Artifact angle={i === 0 ? 0 : -18} />
          <p className="drk-body">{r.body}</p>
        </section>
      ))}

      <section className="drk-specs">
        <h2 className="drk-heading">The whole of it.</h2>
        <dl>
          {SPECS.map(([k, v]) => (
            <div key={k}>
              <dt>{k}</dt>
              <dd>{v}</dd>
            </div>
          ))}
        </dl>
      </section>

      <footer className="drk-foot">
        <button className="drk-pill" type="button">Buy the object</button>
        <button className="drk-ghost" type="button">Read the notes</button>
        <p className="drk-credit">
          Designed by <a href="#top">Darkroom Studio</a>
        </p>
        <p className="drk-legal">* Rendered in CSS. No photography used.</p>
      </footer>
    </div>
  );
}
