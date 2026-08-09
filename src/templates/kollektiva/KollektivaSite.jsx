import { useState } from "react";
import useTemplateFont from "../useTemplateFont";
import "./kollektiva.css";

/* ── Kollektiva — Studio Team Switcher ─────────────────────────
   One viewport, eight people. Picking a face crossfades the full-bleed
   portrait behind everything and swaps the bio and the name in the footer.

   All eight portraits are mounted at once and toggled on opacity rather than
   swapped into a single <img>. Swapping the src would show a blank frame on
   every click until the new file decodes; stacking them means the crossfade
   is a real dissolve between two loaded images, and after the first pass
   every face is instant.

   The bio and the name are keyed on the person, so React remounts them and
   the CSS fade restarts. Without the key they would change text mid-fade and
   never animate at all.

   The headline never changes — only the right-hand column does. That is what
   keeps the composition still while the content moves. */

const PEOPLE = [
  {
    name: "Andrei Baranov",
    role: "Design Chief",
    img: "https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260727_225202_f9e684f3-dc19-469a-8142-eb391bfc601b.png&w=1280&q=85",
    desc: "Andrei sets the visual direction of every project. He turns rough ideas into clear, confident design languages that feel effortless yet leave a lasting impression.",
  },
  {
    name: "Daria Lebedeva",
    role: "Interface Expert",
    img: "https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260727_225149_7937e8ea-3b0a-46ab-919f-775627695a23.png&w=1280&q=85",
    desc: "Daria crafts interfaces people understand at first glance. Every screen she designs balances clarity and character, making complex products feel simple and warm.",
  },
  {
    name: "Ivan Sorokin",
    role: "Concept Chief",
    img: "https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260727_225153_f2b1fc04-776a-4f2e-879b-b764ea762e77.png&w=1280&q=85",
    desc: "Ivan shapes the ideas behind the work. He digs into every brief until the core story emerges, then builds concepts that give each project its reason to exist.",
  },
  {
    name: "Anna Fedorova",
    role: "Brand Consultant",
    img: "https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260727_225847_f456fd9c-8938-4103-836d-51b0e88a9510.png&w=1280&q=85",
    desc: "Anna helps brands find their voice. From positioning to tone, she builds identities that stay consistent everywhere and grow stronger with every appearance.",
  },
  {
    name: "Pavel Smirnov",
    role: "Movement Artist",
    img: "https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260727_225854_3958a522-6203-4f84-a7fa-3b3f1dcd7256.png&w=1280&q=85",
    desc: "Pavel brings stillness to life. His motion work adds rhythm and personality to every product, guiding attention with transitions that feel natural and precise.",
  },
  {
    name: "Olga Kravtsova",
    role: "UX Specialist",
    img: "https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260727_231111_fcefaa07-6851-4fdc-ac7b-98754ac9d5c4.png&w=1280&q=85",
    desc: "Olga studies how people actually use what we make. Her research keeps every decision grounded in real behavior, so the work serves users and not assumptions.",
  },
  {
    name: "Igor Zakharenko",
    role: "Graphic Creator",
    img: "https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260727_231124_9a1505aa-8c44-4046-aff8-1aa0bc7b3ef3.png&w=1280&q=85",
    desc: "Igor gives every project its finishing touch. From typography to illustration, he sweats the visual details that separate good work from unforgettable work.",
  },
  {
    name: "Ksenia Romanova",
    role: "Studio Head",
    img: "https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260727_230413_62e8b331-89be-4d35-84fe-330ba9b1b64f.png&w=1280&q=85",
    desc: "Ksenia keeps the studio moving as one. She connects people, plans, and priorities so every project ships on time without losing the craft it deserves.",
  },
];

export default function KollektivaSite() {
  useTemplateFont(
    "https://fonts.googleapis.com/css2?family=Geist:wght@300;400;500&display=swap"
  );

  const [active, setActive] = useState(0);
  const person = PEOPLE[active];

  return (
    <section className="kol">
      {/* Every portrait stays mounted; only opacity moves. */}
      <div className="kol-stage" aria-hidden="true">
        {PEOPLE.map((p, i) => (
          <div
            key={p.name}
            className={`kol-shot${i === active ? " is-on" : ""}`}
            style={{ backgroundImage: `url("${p.img}")` }}
          />
        ))}
        <div className="kol-veil" />
      </div>

      <div className="kol-content">
        <div className="kol-top">
          <h1 className="kol-title">
            Kollektiva is the talent you build with each&nbsp;day
          </h1>
          <p className="kol-desc" key={person.name}>
            {person.desc}
          </p>
        </div>

        <div className="kol-bottom">
          <div className="kol-faces">
            {PEOPLE.map((p, i) => (
              <button
                key={p.name}
                type="button"
                className="kol-face"
                aria-label={`Show ${p.name}`}
                aria-pressed={i === active}
                onClick={() => setActive(i)}
              >
                <span className={`kol-dot${i === active ? " is-on" : ""}`} />
                {/* Not lazy: all eight sit above the fold and are the only
                    control on the page, so deferring them leaves the picker
                    looking empty exactly when someone wants to use it. */}
                <span className="kol-avatar">
                  <img src={p.img} alt={p.name} decoding="async" />
                </span>
              </button>
            ))}
          </div>

          <footer className="kol-meta">
            <span className="kol-name" key={person.name}>
              {person.name}
            </span>
            <span className="kol-role" key={person.role}>
              {person.role}
            </span>
            <span className="kol-since">In the business since 2020</span>
            <a className="kol-wa" href="#top">
              WhatsApp
            </a>
          </footer>
        </div>
      </div>
    </section>
  );
}
