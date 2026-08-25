/* Build-time rendering entry. Never shipped to a browser.
 *
 * The site's HTML used to contain a title, a description and an empty
 * <div id="root">: about 340 characters of indexable text per page, with the
 * client work, the offer, the gallery and every price reachable only by
 * running the JavaScript. Google's renderer does run it, but rendering is
 * queued separately from crawling and is the first thing dropped under crawl
 * pressure — and Bing, WhatsApp, Slack and the AI crawlers that increasingly
 * send referrals mostly do not render at all. To all of those the site was
 * eight near-empty pages.
 *
 * So prerender-head.mjs calls this at build time and writes the result into
 * dist/<route>/index.html. The runtime is untouched: main.jsx still mounts
 * with createRoot, which replaces this markup wholesale rather than hydrating
 * it. That is deliberate — hydration would tie every future render to
 * matching this output exactly, and the win here is indexable text, not a
 * faster first paint. Framer Motion renders its `initial` state, so the
 * animated blocks arrive at opacity 0 exactly as they do at runtime and
 * there is no flash of content before the app takes over.
 */
import { renderToString } from "react-dom/server";
import { StaticRouter } from "react-router-dom/server";
import App from "./App.jsx";

export function render(url) {
  return renderToString(
    <StaticRouter location={url} future={{ v7_relativeSplatPath: true }}>
      <App />
    </StaticRouter>
  );
}
