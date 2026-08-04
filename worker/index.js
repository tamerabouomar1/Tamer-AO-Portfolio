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

const json = (body, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { "content-type": "application/json", "cache-control": "no-store" },
  });

function clean(v) {
  return typeof v === "string" ? v.trim().slice(0, MAX) : "";
}

async function saveLead(request, env) {
  if (!env.LEADS) return json({ ok: false, error: "storage unavailable" }, 503);

  let body;
  try {
    body = await request.json();
  } catch {
    return json({ ok: false, error: "bad json" }, 400);
  }

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

  return json({ ok: true });
}

/* The "Send a message" form on /work-with-me.
 *
 * It used to POST to "/" for Netlify Forms to intercept. That stopped existing
 * the day the site moved to Cloudflare: Workers answered the POST with 405 and
 * every message a visitor sent was lost, on the one page that exists to get
 * people to make contact. Messages are stored next to the template leads now,
 * and read back through the same /api/leads endpoint. */
async function saveMessage(request, env) {
  if (!env.LEADS) return json({ ok: false, error: "storage unavailable" }, 503);

  let body;
  try {
    body = await request.json();
  } catch {
    return json({ ok: false, error: "bad json" }, 400);
  }

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

  if (!env.LEADS_TOKEN || given !== env.LEADS_TOKEN) {
    return json({ ok: false, error: "unauthorized" }, 401);
  }

  // Both kinds live in the same namespace: "lead:" is a template download,
  // "msg:" is somebody writing in from /work-with-me. Listing both keeps one
  // URL as the single place to check for anything a visitor sent.
  const batches = await Promise.all(
    ["lead:", "msg:"].map((prefix) => env.LEADS.list({ prefix, limit: 1000 }))
  );
  const keys = batches.flatMap((b) => b.keys);
  const leads = await Promise.all(
    keys.map((k) => env.LEADS.get(k.name, "json").catch(() => null))
  );
  // Keys are timestamp-prefixed, so sorting on the record's own date puts
  // downloads and messages into one correct newest-first stream.
  const rows = leads.filter(Boolean).sort((a, b) => String(b.at).localeCompare(String(a.at)));

  if (url.searchParams.get("format") === "csv") {
    const esc = (v) => `"${String(v ?? "").replace(/"/g, '""')}"`;
    const csv = [
      "date,kind,name,contact,template,message,country",
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

export default {
  async fetch(request, env) {
    const { pathname } = new URL(request.url);

    if (pathname === "/api/lead" && request.method === "POST") return saveLead(request, env);
    if (pathname === "/api/contact" && request.method === "POST") return saveMessage(request, env);
    if (pathname === "/api/leads" && request.method === "GET") return listLeads(request, env);

    // Anything else under /api that we don't serve.
    if (pathname.startsWith("/api/")) return json({ ok: false, error: "not found" }, 404);

    // Should be unreachable given run_worker_first, but if the routing config
    // ever changes, fall through to the static site rather than 500.
    return env.ASSETS.fetch(request);
  },
};
