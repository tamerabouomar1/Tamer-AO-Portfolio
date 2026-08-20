import { useEffect } from "react";

/* The MyChatBot assistant ("Portfolio Assistant", trained on this site).
 *
 * The vendor's copy-paste snippet is two <script> tags and an inline
 * MyChatBot.mount(...) call. That inline call cannot be used here: public/_headers
 * ships `script-src 'self' …` with no 'unsafe-inline', so an inline script is
 * silently dropped and the bubble simply never appears. Loading the file from a
 * component and calling mount() from our own bundle is the same thing, done in
 * a way the policy allows. storage.googleapis.com is added to script-src and
 * style-src for the two vendor files — that is the whole exception.
 *
 * WHERE IT APPEARS is ours, not theirs. mount() ignores the container it is
 * given and portals the launcher to <body> as #mcb-widget-portal, fixed to the
 * bottom-right. The two rules in index.css under "AI assistant launcher" move
 * it: into the empty part of the sidebar on desktop, and above the tab bar in
 * the bottom-right corner on a phone. Repositioning their launcher rather than
 * building our own is deliberate — if their markup changes, the worst case is a
 * bubble back in the default corner, where building our own button on top of
 * their internals would leave a dead control and no way to reach the chat.
 */
const CSS_URL = "https://storage.googleapis.com/mychatbot-widget-assets/v1/style.css";
const JS_URL = "https://storage.googleapis.com/mychatbot-widget-assets/v1/widget.js";

const CONFIG = {
  account_id: "86bddae7-ba5a-4c11-8d1c-4d41e927f249",
  widget_id: "demo-86bddae7-ba5a-4c11-8d1c-4d41e927f249",
  api_url: "https://api.mychatbot.app",
  assistant_name: "Portfolio Assistant",
  color: "#64cefb",
  lang: "en",
};

// Module-level, not component state: React 18 StrictMode mounts every effect
// twice in development, and mounting the widget twice gives two bubbles.
let started = false;

/* `hidden` is for the full-bleed template previews. Unmounting this component
 * is NOT enough to get rid of the launcher: mount() portals it to <body>,
 * outside React's tree, so it stays on screen after the route changes and ends
 * up floating over the template — which reads as the template shipping with a
 * chatbot, on a page whose whole job is to show the buyer their own site. So
 * the route hides it with a class instead, and a visitor who lands straight on
 * a preview never downloads the vendor bundle at all. */
export default function ChatWidget({ hidden = false }) {
  useEffect(() => {
    document.documentElement.classList.toggle("mcb-hidden", hidden);
  }, [hidden]);

  useEffect(() => {
    if (hidden || started) return;
    started = true;

    if (!document.querySelector(`link[href="${CSS_URL}"]`)) {
      const css = document.createElement("link");
      css.rel = "stylesheet";
      css.href = CSS_URL;
      document.head.appendChild(css);
    }

    const mount = () => {
      // Their bundle is ~530KB and loads from a CDN, so it can fail on a bad
      // connection or be blocked by an extension. Everything else on the page
      // must survive that: no throw, no error overlay, just no bubble.
      try {
        window.MyChatBot?.mount("#my-chat-widget-container", CONFIG);
      } catch {
        /* the site works fine without the assistant */
      }
    };

    if (window.MyChatBot) {
      mount();
      return;
    }

    const script = document.createElement("script");
    script.src = JS_URL;
    script.async = true;
    script.addEventListener("load", mount);
    document.head.appendChild(script);
  }, [hidden]);

  // mount() portals the real UI to <body>; this is only the anchor it asks for.
  return <div id="my-chat-widget-container" />;
}
