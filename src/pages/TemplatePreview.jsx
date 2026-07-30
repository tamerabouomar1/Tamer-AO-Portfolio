import { Suspense, useEffect, useState } from "react";
import { Link, Navigate, useParams } from "react-router-dom";
import { BuyModalHost } from "../components/BuyModal";
import { TEMPLATE_VIEWS } from "../templates/registry";
import { TEMPLATES } from "../siteData";

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

  if (!tpl || !View) return <Navigate to="/templates" replace />;

  return (
    <div className="tplview">
      <Suspense fallback={<Loader tpl={tpl} />}>
        <View />
      </Suspense>

      {!embedded && (
      <div className={`tplview__bar${hidden ? " is-hidden" : ""}`}>
        <Link className="tplview__back" to="/templates">
          ‹ Store
        </Link>
        <span className="tplview__name">
          {tpl.name}
          <em>Live preview</em>
        </span>
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
