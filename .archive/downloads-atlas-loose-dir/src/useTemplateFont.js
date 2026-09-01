import { useEffect } from "react";

/* Templates use fonts the portfolio itself never needs (Kanit, Anton, PP
   Neue Montreal…). Shipping them in index.html would make every visitor pay
   for four typefaces to look at the home page, so instead each template
   injects its own <link> on mount. The tag is reference-counted and removed
   once the last component using it unmounts, so navigating back to the store
   leaves nothing behind.

   Fonts are requested with &display=swap: text paints immediately in the
   fallback and swaps in when the webfont lands — no invisible-text pause. */

const counts = new Map();

export default function useTemplateFont(href) {
  useEffect(() => {
    if (!href) return;

    const n = counts.get(href) || 0;
    counts.set(href, n + 1);

    if (n === 0) {
      // Warm the font host first so the CSS request doesn't pay for DNS+TLS.
      for (const [origin, cors] of [
        ["https://fonts.googleapis.com", false],
        ["https://fonts.gstatic.com", true],
      ]) {
        if (document.querySelector(`link[rel="preconnect"][href="${origin}"]`)) continue;
        const pre = document.createElement("link");
        pre.rel = "preconnect";
        pre.href = origin;
        pre.dataset.templateFont = href;
        if (cors) pre.crossOrigin = "anonymous";
        document.head.appendChild(pre);
      }

      const link = document.createElement("link");
      link.rel = "stylesheet";
      link.href = href;
      link.dataset.templateFont = href;
      document.head.appendChild(link);
    }

    return () => {
      const left = (counts.get(href) || 1) - 1;
      counts.set(href, left);
      if (left > 0) return;
      document
        .querySelectorAll(`link[data-template-font="${href}"]`)
        .forEach((el) => el.remove());
    };
  }, [href]);
}
