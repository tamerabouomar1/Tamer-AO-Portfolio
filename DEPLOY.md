# Deploying the portfolio (live + editable)

> **Where it actually lives now:** Cloudflare Workers, at
> `tamerabouomar.com`, configured by `wrangler.jsonc`.
> The Netlify instructions further down are kept as a fallback only. To publish:
>
> ```bash
> npm run build && npx wrangler deploy
> ```

## Free template downloads and leads (one-time setup)

The store gives the template source away free and records who took it. Two things
to do once, then it looks after itself:

1. **Set the password that lets you read your leads.** Pick anything long:
   ```bash
   npx wrangler secret put LEADS_TOKEN
   ```
2. **Read them** any time, newest first, at:
   - `https://<your-site>/api/leads?token=YOUR_TOKEN` (on screen)
   - `https://<your-site>/api/leads?token=YOUR_TOKEN&format=csv` (opens in Excel/Sheets)

   Without the token the endpoint returns 401, so nobody else can read your list.

Leads are stored in the `portfolio-leads` KV namespace (already created and wired up
in `wrangler.jsonc`). Each record is the name, the email or WhatsApp they gave, which
template they took, the date, and their country.

**After changing any template**, rebuild the downloadable zips or people will get
stale code:

```bash
npm run build:zips
```

---

This is a Vite + React app. To keep it **live and editable**, host it on a service
that auto-rebuilds when you push code changes. The original setup below was
**GitHub + Netlify** (free).

## Membership templates (how to let someone in)

Thirty templates download free. The twelve Canvas/WebGL builds listed in
`src/premium.js` are the $19 membership, and the Worker refuses their zips to
anyone without a live access code. That refusal is the paywall — the padlock in
the store is only the label on it.

**Whenever you change which templates are paid, edit `src/premium.js` and
nothing else.** The store and the Worker both read that one list, which is why
it is its own file.

### When someone pays

They send the money by Whish, OMT or transfer exactly as before, then you mint
them a code:

```bash
curl -X POST https://tamerabouomar.com/api/member \
  -H "authorization: Bearer $LEADS_TOKEN" \
  -H "content-type: application/json" \
  -d '{"note":"Rami, Whish, monthly","days":31}'
```

That returns something like `{"ok":true,"code":"PQ2HQMGY6WZJ","days":31}`. Send
the code in the same WhatsApp thread. They type it once into the "Already a
member?" box on any membership template and every membership download works
from then on, on that device.

`days` defaults to **31**, so a membership that is not renewed stops working by
itself. That is deliberate: a missed cancellation cannot quietly stay open for
months. Renewing is just minting a new code.

### To cut someone off early

```bash
npx wrangler kv key delete --binding LEADS "member:THEIRCODE" --remote
```

It takes effect on their next download. There is no session to expire and no
secret to rotate — the cookie holds the code itself, and the code is checked
against KV on every request.

### `LEADS_TOKEN` is required

Minting codes uses the same bearer token as the leads export. If you have not
set it yet:

```bash
npx wrangler secret put LEADS_TOKEN
```

Without it, `/api/member` answers 401 and you cannot let anyone in.

## One-time setup

### 1. Put the code on GitHub
1. Make a free account at https://github.com
2. Create a new **empty** repository (no README) — e.g. `tamer-portfolio`.
3. In a terminal, from this folder (`portfolio-app`), run the commands GitHub shows you,
   which look like:
   ```bash
   git remote add origin https://github.com/<your-username>/tamer-portfolio.git
   git branch -M main
   git push -u origin main
   ```
   (The repo is already initialised and committed locally.)

### 2. Connect Netlify
1. Make a free account at https://netlify.com (sign in with GitHub).
2. **Add new site → Import an existing project → GitHub →** pick `tamer-portfolio`.
3. Netlify auto-detects the settings from `netlify.toml`:
   - Build command: `npm run build`
   - Publish directory: `dist`
4. Click **Deploy**. ~1 minute later you get a live URL like
   `https://tamer-portfolio.netlify.app`.

## Editing after it's live (this is the "keep it editable" part)
Every time you change the code and push, Netlify rebuilds and the live site updates
automatically (~1 min). Workflow:
```bash
# make edits (e.g. in src/siteData.js), then:
git add -A
git commit -m "update content"
git push
```
- Most **content** (projects, descriptions, contact links, schedule) lives in
  **`src/siteData.js`** — easy to edit without touching the design.
- You can edit locally in an editor (VS Code), or directly on github.com (pencil icon).

## Custom domain (optional)
In Netlify → Domain settings → add a domain (e.g. `tamerao.com`). Buy it from any
registrar (Namecheap/Google Domains) and point it to Netlify per their instructions.

## Alternatives
- **Vercel** (vercel.com) works the same way — import the GitHub repo, it auto-detects Vite.
- **Quick test, no GitHub:** run `npm run build`, then drag the `dist` folder onto
  https://app.netlify.com/drop. Downside: you must re-drag to update (not auto-editable).
