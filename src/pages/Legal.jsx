import { Link } from "react-router-dom";
import Page from "../components/Page";
import { LEGAL_PAGES, legalBySlug, LEGAL_UPDATED } from "../legalData";
import SplitHeading from "../components/SplitHeading";

/* One component for all four policy pages.
 *
 * They differ only in their words, so four near-identical files would be four
 * places to forget to change something. The route passes a slug and the
 * content comes from legalData.js.
 *
 * Deliberately NOT animated with the stagger the rest of the site uses. These
 * pages are read, not browsed, and somebody who has come here to find out how
 * to delete their data should not have to wait for paragraphs to fade in one
 * by one. The Page wrapper's single fade is kept so navigation still feels
 * like the rest of the site.
 *
 * The measure is capped in CSS at ~68 characters. Legal text is the longest
 * unbroken prose on the site and full-width lines are where people give up.
 */
export default function Legal({ slug }) {
  const doc = legalBySlug(slug);

  // A route only exists for slugs in LEGAL_PAGES, so this cannot fire from
  // navigation. It is here so a typo in a route definition shows up as a
  // visible message rather than a blank white page.
  if (!doc) return null;

  return (
    <Page className="legal">
      <header className="topbar">
        <div>
          <SplitHeading>{doc.title}</SplitHeading>
          <p className="topbar__sub">Last updated {LEGAL_UPDATED}</p>
        </div>
        <Link className="link" to="/">
          Back home <span className="plus">+</span>
        </Link>
      </header>

      <div className="legal-doc">
        <p className="legal-lede">{doc.lede}</p>

        {doc.sections.map((s) => (
          <section className="legal-section" key={s.h}>
            <h2 className="legal-h">{s.h}</h2>

            {s.p?.map((para) => (
              <p className="legal-p" key={para.slice(0, 40)}>
                {para}
              </p>
            ))}

            {s.list && (
              <ul className="legal-list">
                {s.list.map((li) => (
                  <li key={li.slice(0, 40)}>{li}</li>
                ))}
              </ul>
            )}

            {/* Paragraphs that belong AFTER the bullets. Without this the only
                way to write "here is a list, and here is the caveat on it" was
                a second section with a heading nobody needed. */}
            {s.after?.map((para) => (
              <p className="legal-p" key={para.slice(0, 40)}>
                {para}
              </p>
            ))}
          </section>
        ))}

        {/* The other three policies, from wherever you are. Somebody reading
            the privacy policy is often one click from wanting the cookie one,
            and making them go back to the footer to find it is the kind of
            thing that makes people give up and email you instead. */}
        <nav className="legal-more" aria-label="Other policies">
          <h2 className="legal-h">The other policies</h2>
          <ul className="legal-list">
            {LEGAL_PAGES.filter((d) => d.slug !== slug).map((d) => (
              <li key={d.slug}>
                <Link className="link" to={`/${d.slug}`}>
                  {d.title}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </Page>
  );
}
