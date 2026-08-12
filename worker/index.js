/* The only server-side code on the site.
 *
 * Everything else is static and served straight from Cloudflare's edge. This
 * exists for one job: when somebody takes a free website template, keep a
 * record of who took it. The WhatsApp hand-off is still there and still the
 * fastest way to actually start a conversation, but it only produces a lead if
 * the person goes through with sending the message. This does not depend on
 * that, so nobody is ever downloaded-and-lost.
 *
 * `run_worker_first` in wrangler.jsonc is what routes /api/* here; every other
 * path is served by the asset handler before this script is ever invoked.
 */

const MAX = 200; // per field, plenty for a name or an email
const MAX_MESSAGE = 4000; // a contact message needs far more room than a name

// Nothing legitimate posted here is large: the biggest possible record is a
// name, a contact and one 4000-character message. Anything past this is either
// broken or hostile, and refusing it before request.json() means a hostile
// body is never parsed or held in memory at all.
const MAX_BODY = 16 * 1024;

// Rate limit, per IP per endpoint. The forms are unauthenticated by design —
// anyone can post — so the only thing standing between a script and an
// unbounded number of KV writes is this. Generous enough that a real person
// filling in a form twice never sees it.
const RATE_LIMIT = 10; // writes allowed...
const RATE_WINDOW = 600; // ...per this many seconds

// Requests are only accepted from the site itself. This is not a CSRF defence
// in the session sense (there is no session and no cookie to ride on) — it
// stops other people's pages from quietly posting into your storage, which is
// the cheap way to fill a KV namespace from a browser that isn't yours.
const ALLOWED_ORIGINS = [
  "https://portfolio.tamerao.workers.dev",
  "https://tamerao.com",
  "https://www.tamerao.com",
];

const json = (body, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { "content-type": "application/json", "cache-control": "no-store" },
  });

function clean(v) {
  return typeof v === "string" ? v.trim().slice(0, MAX) : "";
}

/* Same-origin check for the POST endpoints.
 *
 * Origin is sent by every browser on a cross-origin POST and cannot be forged
 * by page script, which is what makes it worth checking. A missing Origin is
 * allowed through: non-browser clients (curl, a health check) omit it, and
 * they are not the thing being defended against here. */
function originAllowed(request) {
  const origin = request.headers.get("origin");
  if (!origin) return true;
  if (ALLOWED_ORIGINS.includes(origin)) return true;
  // Wrangler dev and local preview builds.
  return /^http:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(origin);
}

/* Read the body with a hard ceiling, before any parsing happens. */
async function readJson(request) {
  const declared = Number(request.headers.get("content-length") || 0);
  if (declared > MAX_BODY) return null;
  const text = await request.text();
  // Content-Length can lie or be absent under chunked encoding, so the real
  // length is checked too rather than trusted from the header.
  if (text.length > MAX_BODY) return null;
  try {
    const parsed = JSON.parse(text);
    // A JSON body that is an array or a string would make every body.foo read
    // undefined further down; requiring a plain object keeps the handlers'
    // assumptions true.
    return parsed && typeof parsed === "object" && !Array.isArray(parsed) ? parsed : null;
  } catch {
    return null;
  }
}

/* Per-IP write budget, kept in the same KV namespace under a `rl:` prefix.
 *
 * Deliberately approximate: two requests landing in the same instant can both
 * read the same count and both be allowed. That race costs one extra write at
 * the margin, which does not matter — the job is stopping thousands of writes,
 * not tens. The keys expire on their own, so nothing accumulates. */
async function overLimit(env, request, bucket) {
  const ip = request.headers.get("cf-connecting-ip");
  if (!ip || !env.LEADS) return false;

  const key = `rl:${bucket}:${ip}`;
  const current = Number((await env.LEADS.get(key)) || 0);
  if (current >= RATE_LIMIT) return true;

  await env.LEADS.put(key, String(current + 1), { expirationTtl: RATE_WINDOW });
  return false;
}

/* Constant-time string comparison for the read token.
 *
 * `a !== b` returns as soon as it finds a differing byte, so how long it takes
 * leaks how much of the token was right. Over the public internet that signal
 * is buried in jitter, but the constant-time version costs nothing and removes
 * the question entirely. */
function safeEqual(a, b) {
  if (typeof a !== "string" || typeof b !== "string" || a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}

/* Ask Cloudflare whether a Turnstile token is genuine.
 *
 * This is the half of Turnstile that does the work. The widget on the page
 * only produces a token; until it is checked here it proves nothing, because
 * anyone posting straight at this endpoint never loads the widget at all. A
 * site with the widget and no siteverify call has the appearance of spam
 * protection and none of the substance.
 *
 * Deliberately fail-OPEN when TURNSTILE_SECRET is not configured. The
 * alternative is that the day the secret is missing or rotated, every form on
 * the site silently rejects real people and the enquiries are simply lost —
 * and a lost client enquiry is a worse outcome than an accepted spam one. The
 * rate limit, origin check and honeypot all still apply in that state.
 *
 * Once the secret IS set, a missing or bad token is refused.
 */
async function verifyTurnstile(request, env, token) {
  if (!env.TURNSTILE_SECRET) return { ok: true, skipped: true };
  if (!token || typeof token !== "string") return { ok: false };

  const body = new FormData();
  body.append("secret", env.TURNSTILE_SECRET);
  body.append("response", token);
  const ip = request.headers.get("cf-connecting-ip");
  if (ip) body.append("remoteip", ip);

  try {
    const res = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
      method: "POST",
      body,
    });
    const data = await res.json();
    return { ok: data.success === true };
  } catch {
    // Cloudflare unreachable. Same reasoning as above: do not lose the
    // enquiry over an outage in the spam checker.
    return { ok: true, skipped: true };
  }
}

/* Neutralise spreadsheet formulas in exported CSV.
 *
 * A visitor who types `=HYPERLINK("http://evil","click")` — or the far worse
 * `=cmd|'/c calc'!A1` — into a name field has written a formula that Excel and
 * Numbers execute when the export is opened, on your machine, with your
 * permissions. The value is data, so it gets a leading apostrophe and stays
 * data. */
function csvSafe(v) {
  const s = String(v ?? "");
  return /^[=+\-@\t\r]/.test(s) ? `'${s}` : s;
}

/* Push a notification to Telegram the moment something is submitted.
 *
 * KV is the record; this is only the tap on the shoulder. So it must never be
 * able to fail a submission: it is always started with ctx.waitUntil(), which
 * lets the visitor get their response immediately while this finishes in the
 * background, and every error is swallowed. A notification that does not
 * arrive is an annoyance; a form that 500s because Telegram was slow loses a
 * client.
 *
 * Silently does nothing when the bot token or chat id is unset, so the site
 * runs fine without them.
 */
function tgEscape(v) {
  // Telegram's HTML mode understands a small tag set; anything else with a
  // stray < or & in it is rejected outright and the notification is lost.
  return String(v ?? "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

async function notify(env, title, fields) {
  if (!env.TELEGRAM_BOT_TOKEN || !env.TELEGRAM_CHAT_ID) return;

  const lines = [`<b>${tgEscape(title)}</b>`];
  for (const [label, value] of fields) {
    if (value) lines.push(`<b>${tgEscape(label)}:</b> ${tgEscape(value)}`);
  }

  try {
    await fetch(`https://api.telegram.org/bot${env.TELEGRAM_BOT_TOKEN}/sendMessage`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        chat_id: env.TELEGRAM_CHAT_ID,
        text: lines.join("\n"),
        parse_mode: "HTML",
        disable_web_page_preview: true,
      }),
    });
  } catch {
    /* Telegram unreachable. The record is already safe in KV. */
  }
}

async function saveLead(body, request, env, ctx) {
  if (!env.LEADS) return json({ ok: false, error: "storage unavailable" }, 503);

  const name = clean(body.name);
  const reach = clean(body.reach);
  const template = clean(body.template);
  if (!name || !reach) return json({ ok: false, error: "name and contact required" }, 400);

  const at = new Date().toISOString();
  const lead = {
    name,
    reach,
    template,
    at,
    // Rough origin, useful for knowing which templates travel. Cloudflare adds
    // these; no cookies, no tracking pixel, nothing stored beyond this record.
    country: request.headers.get("cf-ipcountry") || "",
    referer: clean(request.headers.get("referer") || ""),
  };

  // Sorts chronologically when listed, and the suffix keeps two people who
  // download in the same millisecond from overwriting each other.
  const key = `lead:${at}:${crypto.randomUUID().slice(0, 8)}`;
  await env.LEADS.put(key, JSON.stringify(lead));

  ctx.waitUntil(
    notify(env, "📥 Template downloaded", [
      ["Name", name],
      ["Contact", reach],
      ["Template", template],
      ["Country", lead.country],
    ])
  );

  return json({ ok: true });
}

/* The "Send a message" form on /work-with-me.
 *
 * It used to POST to "/" for Netlify Forms to intercept. That stopped existing
 * the day the site moved to Cloudflare: Workers answered the POST with 405 and
 * every message a visitor sent was lost, on the one page that exists to get
 * people to make contact. Messages are stored next to the template leads now,
 * and read back through the same /api/leads endpoint. */
async function saveMessage(body, request, env, ctx) {
  if (!env.LEADS) return json({ ok: false, error: "storage unavailable" }, 503);

  // The honeypot: a field hidden from people and irresistible to bots. Anything
  // that fills it gets a cheerful 200 and is dropped on the floor.
  if (clean(body["bot-field"])) return json({ ok: true });

  const name = clean(body.name);
  const email = clean(body.email);
  const message =
    typeof body.message === "string" ? body.message.trim().slice(0, MAX_MESSAGE) : "";
  if (!name || !email || !message) {
    return json({ ok: false, error: "name, email and message required" }, 400);
  }

  const at = new Date().toISOString();
  const key = `msg:${at}:${crypto.randomUUID().slice(0, 8)}`;
  await env.LEADS.put(
    key,
    JSON.stringify({
      kind: "message",
      name,
      reach: email,
      message,
      at,
      country: request.headers.get("cf-ipcountry") || "",
      referer: clean(request.headers.get("referer") || ""),
    })
  );

  ctx.waitUntil(
    notify(env, "💬 New message", [
      ["From", name],
      ["Email", email],
      ["Message", message],
    ])
  );

  return json({ ok: true });
}

/* Somebody claiming one of the free offers that isn't a download — the brand
 * teardown, the first reel. The WhatsApp hand-off still opens in the browser,
 * but as with the template downloads, the claim is recorded here first so it
 * exists whether or not that message is ever sent. */
async function saveClaim(body, request, env, ctx) {
  if (!env.LEADS) return json({ ok: false, error: "storage unavailable" }, 503);

  if (clean(body["bot-field"])) return json({ ok: true });

  const name = clean(body.name);
  const reach = clean(body.reach);
  const offer = clean(body.offer);
  const about =
    typeof body.about === "string" ? body.about.trim().slice(0, MAX_MESSAGE) : "";
  if (!name || !reach) return json({ ok: false, error: "name and contact required" }, 400);

  const at = new Date().toISOString();
  const key = `claim:${at}:${crypto.randomUUID().slice(0, 8)}`;
  await env.LEADS.put(
    key,
    JSON.stringify({
      kind: "claim",
      name,
      reach,
      template: offer, // shares the leads CSV column with template downloads
      message: about,
      at,
      country: request.headers.get("cf-ipcountry") || "",
      referer: clean(request.headers.get("referer") || ""),
    })
  );

  ctx.waitUntil(
    notify(env, "🎁 Free offer claimed", [
      ["Name", name],
      ["Contact", reach],
      ["Offer", offer],
      ["About", about],
    ])
  );

  return json({ ok: true });
}

/* The answers to the two Stage 0 questions: what did you think, and what
 * would make it better.
 *
 * Contact is optional here on purpose. Tying feedback to an identity is the
 * fastest way to stop getting the unflattering kind, and the unflattering kind
 * is the entire reason the work is being given away. */
async function saveFeedback(body, request, env, ctx) {
  if (!env.LEADS) return json({ ok: false, error: "storage unavailable" }, 503);

  if (clean(body["bot-field"])) return json({ ok: true });

  const text = (v) => (typeof v === "string" ? v.trim().slice(0, MAX_MESSAGE) : "");
  const verdict = text(body.verdict);
  const better = text(body.better);
  if (!verdict && !better) return json({ ok: false, error: "nothing to save" }, 400);

  const at = new Date().toISOString();
  const key = `fb:${at}:${crypto.randomUUID().slice(0, 8)}`;
  await env.LEADS.put(
    key,
    JSON.stringify({
      kind: "feedback",
      name: "",
      reach: clean(body.reach),
      template: clean(body.what),
      // Kept in one field so it lands in the existing CSV column rather than
      // widening every other row with two mostly-empty ones.
      message: `What they thought: ${verdict || "(blank)"}\nWhat would make it better: ${
        better || "(blank)"
      }`,
      at,
      country: request.headers.get("cf-ipcountry") || "",
      referer: clean(request.headers.get("referer") || ""),
    })
  );

  ctx.waitUntil(
    notify(env, "📝 Feedback received", [
      ["What they thought", verdict],
      ["What would make it better", better],
      ["Contact", clean(body.reach)],
    ])
  );

  return json({ ok: true });
}

/* Read the list back. Protected by a secret so it is not a public dump of
   people's contact details:  wrangler secret put LEADS_TOKEN
   then open /api/leads?token=... (or send Authorization: Bearer ...). */
async function listLeads(request, env) {
  const url = new URL(request.url);
  const given =
    url.searchParams.get("token") ||
    (request.headers.get("authorization") || "").replace(/^Bearer\s+/i, "");

  // Rate limited like the write endpoints, for a different reason: this is the
  // one guessable thing on the site, and a budget per IP is what turns "guess
  // the token" from a background job into an impossibility.
  if (await overLimit(env, request, "read")) return json({ ok: false, error: "slow down" }, 429);

  if (!env.LEADS_TOKEN || !safeEqual(given, env.LEADS_TOKEN)) {
    return json({ ok: false, error: "unauthorized" }, 401);
  }

  // Every kind lives in the same namespace: "lead:" is a template download,
  // "msg:" is somebody writing in from /work-with-me, "claim:" is a free offer
  // being taken, "fb:" is an answer to the two feedback questions. Listing all
  // four keeps one URL as the single place to check for anything a visitor
  // sent.
  const batches = await Promise.all(
    ["lead:", "msg:", "claim:", "fb:"].map((prefix) =>
      env.LEADS.list({ prefix, limit: 1000 })
    )
  );
  const keys = batches.flatMap((b) => b.keys);
  const leads = await Promise.all(
    keys.map((k) => env.LEADS.get(k.name, "json").catch(() => null))
  );
  // Keys are timestamp-prefixed, so sorting on the record's own date puts
  // downloads and messages into one correct newest-first stream.
  const rows = leads.filter(Boolean).sort((a, b) => String(b.at).localeCompare(String(a.at)));

  if (url.searchParams.get("format") === "csv") {
    // csvSafe first (defuse formulas), then quote for CSV. Both are needed:
    // the quoting makes the file parse, csvSafe makes it inert once parsed.
    const esc = (v) => `"${csvSafe(v).replace(/"/g, '""')}"`;
    const csv = [
      "date,kind,name,contact,offer,message,country",
      ...rows.map((l) =>
        [l.at, l.kind || "download", l.name, l.reach, l.template, l.message, l.country]
          .map(esc)
          .join(",")
      ),
    ].join("\n");
    return new Response(csv, {
      headers: {
        "content-type": "text/csv; charset=utf-8",
        "content-disposition": 'attachment; filename="leads.csv"',
        "cache-control": "no-store",
      },
    });
  }

  return json({ ok: true, count: rows.length, leads: rows });
}

/* Google Search Console's HTML-file check wants this exact URL to answer 200
   with the token as its body. The asset handler's default html_handling strips
   the .html extension, so it was answering 307 -> /googlecdc160a1620c12b8 and
   Google does not follow a redirect for this check — verification could never
   pass. Served here instead of turning html_handling off globally, which also
   governs how index.html is resolved at "/". */
const GSC_TOKEN = "googlecdc160a1620c12b8";

export default {
  async fetch(request, env, ctx) {
    const { pathname } = new URL(request.url);

    if (pathname === `/${GSC_TOKEN}.html`) {
      return new Response(`google-site-verification: ${GSC_TOKEN}.html`, {
        headers: { "content-type": "text/html; charset=utf-8" },
      });
    }

    if (pathname === "/api/leads" && request.method === "GET") return listLeads(request, env);

    /* Every write goes through one gate.
     *
     * Origin check, body parse and spam check all happen here rather than
     * inside the four handlers. Repeated in four places, the real failure
     * mode is not that one of them is wrong — it is that a fifth endpoint
     * gets added later and quietly skips one. Here that cannot happen: a new
     * route in the table below is checked before its handler ever runs. */
    const writers = {
      "/api/lead": { fn: saveLead, bucket: "lead" },
      "/api/claim": { fn: saveClaim, bucket: "claim" },
      "/api/feedback": { fn: saveFeedback, bucket: "fb" },
      "/api/contact": { fn: saveMessage, bucket: "msg" },
    };
    const route = Object.hasOwn(writers, pathname) ? writers[pathname] : null;
    if (route && request.method === "POST") {
      if (!env.LEADS) return json({ ok: false, error: "storage unavailable" }, 503);

      // Cheapest checks first, deliberately. The origin check is a header
      // comparison, the rate limit is one KV read; the Turnstile check is an
      // outbound request to Cloudflare. Verifying before rate limiting would
      // let a flood spend an API call per request on traffic that was going
      // to be refused anyway.
      if (!originAllowed(request)) return json({ ok: false, error: "forbidden" }, 403);
      if (await overLimit(env, request, route.bucket)) {
        return json({ ok: false, error: "slow down" }, 429);
      }

      const body = await readJson(request);
      if (!body) return json({ ok: false, error: "bad json" }, 400);

      const check = await verifyTurnstile(request, env, body["cf-turnstile-response"]);
      if (!check.ok) {
        return json({ ok: false, error: "failed the spam check, please try again" }, 403);
      }

      return route.fn(body, request, env, ctx);
    }

    // Anything else under /api that we don't serve.
    if (pathname.startsWith("/api/")) return json({ ok: false, error: "not found" }, 404);

    // Should be unreachable given run_worker_first, but if the routing config
    // ever changes, fall through to the static site rather than 500.
    return env.ASSETS.fetch(request);
  },
};
