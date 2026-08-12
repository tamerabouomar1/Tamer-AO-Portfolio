import { useEffect, useRef } from "react";

/* Cloudflare Turnstile — the spam check on every form that writes to storage.
 *
 * It replaces a CAPTCHA: almost nobody ever sees a puzzle, because it decides
 * from how the browser behaves rather than by making a person prove anything.
 * Most visitors just see a small box tick itself.
 *
 * The important half of this is NOT here. This component only produces a
 * token; the token means nothing until the Worker asks Cloudflare whether it
 * is genuine (see verifyTurnstile in worker/index.js). A widget on the page
 * with no server-side check is decoration — it looks like protection and
 * stops nothing, because anyone posting directly to the endpoint simply never
 * loads this script.
 *
 * The sitekey is public by design; it identifies the widget and is visible to
 * anyone who views the page. The matching secret lives only in Cloudflare.
 */
const SITEKEY = "0x4AAAAAAENzUGY1hcfJgbho";
const SCRIPT_SRC = "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";

/* One shared promise for the script tag, so four forms on one page do not
   each append their own copy. */
let scriptPromise = null;
function loadScript() {
  if (scriptPromise) return scriptPromise;
  scriptPromise = new Promise((resolve, reject) => {
    if (window.turnstile) return resolve();
    const s = document.createElement("script");
    s.src = SCRIPT_SRC;
    s.async = true;
    s.defer = true;
    s.onload = () => resolve();
    s.onerror = () => reject(new Error("turnstile failed to load"));
    document.head.appendChild(s);
  });
  return scriptPromise;
}

/**
 * Renders the widget.
 *
 * Turnstile also writes its own hidden <input name="cf-turnstile-response">
 * into the surrounding form, so a form that submits with `new FormData(form)`
 * picks the token up on its own and needs no onToken at all. Pass onToken only
 * when the form builds its JSON body by hand:
 *
 *   onToken(token)  — a fresh token, the form may now submit
 *   onToken("")     — expired or errored; no longer verified
 */
export default function Turnstile({ onToken }) {
  const boxRef = useRef(null);
  // Kept in a ref so the effect never re-runs (and never re-renders the
  // widget) just because the parent passed a new function identity.
  const cb = useRef(onToken);
  cb.current = onToken || (() => {});

  useEffect(() => {
    let widgetId = null;
    let cancelled = false;

    loadScript()
      .then(() => {
        if (cancelled || !boxRef.current || !window.turnstile) return;
        widgetId = window.turnstile.render(boxRef.current, {
          sitekey: SITEKEY,
          theme: "dark",
          // Tokens are single-use and expire after roughly five minutes.
          // Someone can easily sit on this page longer than that, so an
          // expired token is refreshed rather than left to fail on submit.
          "expired-callback": () => {
            cb.current("");
            if (widgetId !== null) window.turnstile.reset(widgetId);
          },
          "error-callback": () => cb.current(""),
          callback: (token) => cb.current(token),
        });
      })
      .catch(() => {
        /* Offline, or the script is blocked. The form stays usable: the
           Worker still has rate limiting, the origin check and the honeypot,
           and losing a real enquiry is worse than accepting one unverified. */
        cb.current("");
      });

    return () => {
      cancelled = true;
      if (widgetId !== null && window.turnstile) {
        try {
          window.turnstile.remove(widgetId);
        } catch {
          /* already gone */
        }
      }
    };
  }, []);

  return <div className="turnstile" ref={boxRef} />;
}
