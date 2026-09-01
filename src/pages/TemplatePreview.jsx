import { Suspense, useEffect, useState } from "react";
import { Link, Navigate, useParams } from "react-router-dom";
import { BuyModalHost } from "../components/BuyModal";
import { TEMPLATE_VIEWS } from "../templates/registry";
import { TEMPLATES } from "../siteData";
import usePageMeta from "../lib/usePageMeta";

/* A template rendered full-bleed — no sidebar, no video background, nothing
   of the portfolio's chrome — because the point is to see the site exactly
   as a visitor of that site would. The only thing laid over it is a slim
   bar to get back to the store or buy what you're looking at.

   The template itself arrives as its own lazy chunk, so this route is the
   first moment any of that code is downloaded. */

function Loader({ tpl }) {
  return (
    <div className="tplview__loading" style={{ background: tpl?.bg || "#0c0c0c" }}>
      <span className="tplview__spinner" style={{ borderTopColor: tpl?.accent || "#fff" }} />
      <p style={{ color: tpl?.ink || "#fff" }}>Loading {tpl?.name || "preview"}…</p>
    </div>
  );
}

export default function TemplatePreview() {
  const { slug } = useParams();
  const [buying, setBuying] = useState(null);
  const [hidden, setHidden] = useState(false);

  // This same route is what the store's card thumbnails embed. Inside an
  // iframe the Store/Buy bar would be scaled-down furniture sitting on top of
  // the design, so it only renders when the route is the actual page.
  const embedded = typeof window !== "undefined" && window.self !== window.top;

  const tpl = TEMPLATES.find((t) => t.slug === slug);
  const View = TEMPLATE_VIEWS[slug];

  // Neighbours for the prev/next links in the bar. Wraps, so the first and
  // last template are as reachable as the ones in the middle.
  const at = TEMPLATES.findIndex((t) => t.slug === slug);
  const prev = TEMPLATES[(at - 1 + TEMPLATES.length) % TEMPLATES.length] || tpl;
  const next = TEMPLATES[(at + 1) % TEMPLATES.length] || tpl;

  /* Every one of these pages used to inherit index.html's canonical, which
     points at the home page — so all 36 of them told Google "I am a duplicate
     of the site root" and none could ever be indexed. They are the site's
     largest body of unique content, so they get their own title, description
     and canonical. Embedded thumbnails are the same route inside an iframe;
     they run this too, but the iframe has its own document, so nothing the
     hook writes can reach the parent page's head. */
  usePageMeta(
    tpl ? `${tpl.name} — ${tpl.kicker}, free website template` : null,
    tpl ? `${tpl.desc} Free ${tpl.stack} source, live preview, and a deploy guide. ${tpl.bestFor}.` : null,
    tpl ? `/templates/${tpl.slug}` : null
  );

  // Templates set their own page background; without this the portfolio's
  // black body shows through anything shorter than the viewport.
  useEffect(() => {
    if (!tpl) return;
    const prev = document.body.style.background;
    document.body.style.background = tpl.bg;
    return () => {
      document.body.style.background = prev;
    };
  }, [tpl]);

  if (!tpl || !View) return <Navigate to="/websites" replace />;

  return (
    <div className="tplview">
      <Suspense fallback={<Loader tpl={tpl} />}>
        <View />
      </Suspense>

      {!embedded && (
      <div className={`tplview__bar${hidden ? " is-hidden" : ""}`}>
        <Link className="tplview__back" to="/websites">
          ‹ Store
        </Link>
        {/* Neighbour links, in TEMPLATES order and wrapping at both ends.
            They are the natural way to browse a gallery one design at a time,
            and they also fix the audit's "page has only one dofollow incoming
            internal link" on all 42 of these: each template was reachable
            from the store grid and nowhere else. Now every one is reachable
            from its two neighbours as well. Rendered here AND in the
            prerendered stub in prerender-head.mjs, so a crawler and a visitor
            follow exactly the same links. */}
        <Link className="tplview__step" to={`/templates/${prev.slug}`} title={`Previous: ${prev.name}`}>
          ‹
        </Link>
        <span className="tplview__name">
          {tpl.name}
          <em>Live preview</em>
        </span>
        <Link className="tplview__step" to={`/templates/${next.slug}`} title={`Next: ${next.name}`}>
          ›
        </Link>
        <button className="tplview__buy" onClick={() => setBuying(tpl)}>
          Get it free
        </button>
        <button
          className="tplview__hide"
          onClick={() => setHidden(true)}
          aria-label="Hide this bar"
          title="Hide this bar"
        >
          ×
        </button>
      </div>
      )}

      {!embedded && hidden && (
        <button className="tplview__show" onClick={() => setHidden(false)}>
          Show preview bar
        </button>
      )}

      <BuyModalHost template={buying} onClose={() => setBuying(null)} />
    </div>
  );
}
