# Getting tamerao.is-a.dev live

Two steps. Both need your GitHub account, so they're the parts I can't do.

## 1 — Claim the name (free, forever)

Go to **https://github.com/is-a-dev/register**, fork it, and add one file:

`domains/tamerao.json`

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

Open a pull request. Merged in 2–12 hours on weekdays.

Want a different name? Change the filename — `tamerao.json` becomes
`tamerao.is-a.dev`. Check it's free first by visiting the address.

## 2 — Turn on GitHub Pages

In the `Tamer-AO-Portfolio` repo: **Settings → Pages → Source → GitHub Actions**.

That's it. The workflow in `.github/workflows/deploy.yml` builds and deploys
on every push to `main`, exactly like Cloudflare does now.

Once the PR merges, add the domain under **Settings → Pages → Custom domain**
and tick **Enforce HTTPS** (the certificate takes a few minutes).

## What this costs

Nothing, ever. GitHub Pages is free and unmetered for public repos, and
is-a.dev is funded by Cloudflare's sponsorship. There is no renewal.

## Why not .com

Verisign charges every registrar ~$9.59/year for any .com, so a free one
cannot exist — "free .com" offers are bundled with paid hosting. The cheapest
honest price is Cloudflare Registrar at $10.46/year, at cost, with no renewal
increase. Worth doing eventually; `tamerao.com` will always outrank a
subdomain in search. But this gets you a real, stable, professional address
today for nothing.

## The Cloudflare Worker

Left running deliberately. It keeps serving while DNS propagates, and it is
the fallback if anything here goes wrong. Delete it only once the new address
has been working for a week.
