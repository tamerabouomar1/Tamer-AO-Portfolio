# Getting tamerao.is-a.dev live

Two jobs, both in the browser. No terminal, no git commands.

("Fork" just means GitHub quietly makes you your own copy of someone else's
project so you can suggest a change. You don't have to do it yourself — the
link below triggers it automatically.)

---

## Job 1 — Claim the name (~3 minutes, then a wait)

**Be signed in to GitHub first.**

### Step 1
Open this link:

https://github.com/is-a-dev/register/new/main/domains

It opens a blank file, already in the right folder. GitHub will show a yellow
note saying it made you a copy — that's the "fork", and it's fine.

### Step 2
In the filename box at the top, type exactly:

```
tamerao.json
```

Whatever goes before `.json` becomes your address, so this gives you
`tamerao.is-a.dev`.

### Step 3
Paste this into the big text area:

```json
{
  "owner": {
    "username": "tamerabouomar1",
    "email": "tamerabouomar1@gmail.com"
  },
  "records": {
    "CNAME": "tamerabouomar1.github.io"
  }
}
```

### Step 4
Green **Commit changes...** button, top right → **Propose changes**.

### Step 5
Next page: **Create pull request** → then **Create pull request** again.

Done. A volunteer merges it, usually within 2–12 hours on a weekday. You get
an email when it happens.

---

## Job 2 — Turn on GitHub Pages (~1 minute)

In your own `Tamer-AO-Portfolio` repo:

**Settings** → **Pages** (left sidebar) → under **Source**, pick
**GitHub Actions**.

That's the whole job. Every push to `main` now builds and publishes the site,
the same way Cloudflare has been doing.

---

## After the pull request is merged

Back in your repo: **Settings** → **Pages** → **Custom domain** → type
`tamerao.is-a.dev` → **Save**. Tick **Enforce HTTPS** once it lets you (the
certificate takes a few minutes to appear).

Then tell me, and I'll repoint the site's internal links and search-engine
tags at the new address.

---

## If the name is taken

Visit https://tamerao.is-a.dev first. If something loads, it's gone — pick
another and name the file to match (`tamer-ao.json`, `tameraodesign.json`).
Tell me which, because the `public/CNAME` file has to match exactly.

---

## What this costs

Nothing, ever. GitHub Pages is free and unmetered for public repos; is-a.dev
is funded by Cloudflare sponsorship. There is no renewal date.

## Why not .com

Verisign charges every registrar about $9.59/year for any .com, so a free one
can't exist — "free .com" offers are bundled with paid hosting you don't need.
Cheapest honest price is Cloudflare Registrar at $10.46/year, at cost, with no
renewal hike. Worth doing once you've made a sale; `tamerao.com` will always
outrank a subdomain. This gets you a real, stable, professional address today
for nothing.

## The Cloudflare Worker

Leave it running. It's the fallback while DNS propagates. Delete it only after
the new address has worked for a week.
