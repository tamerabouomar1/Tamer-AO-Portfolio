# The $1 Fund — standalone donation page

A self-contained, single-file donation page for funding student athletes. It is
**independent of the portfolio** — no personal name, photo, or navigation. It
reads as a cause ("Fund a Student Athlete"), not as any one person's page.

## Edit the payment details

Open `index.html` and edit the `METHODS` array near the bottom (inside
`<script>`). Set each `value` to your real account:

- **Whish** — the phone number registered to your Whish account.
- **OMT** — your OMT beneficiary name/number.
- **USDT (TRC-20)** — paste your real Tron wallet address (replace the `TXXXX…`
  placeholder). This is the most private option; the others reveal the
  recipient at the moment of payment.

Nothing else needs changing — copy buttons, WhatsApp share, native share, and
copy-link all pick up the values automatically.

## Deploy it (its own URL, not tied to the portfolio)

**Option A — Netlify (recommended):** New site → connect this repo → set
**Base directory** to `fund`. No build command; publish directory `.`. You get
a separate URL like `student-athlete-fund.netlify.app`.

**Option B — drag & drop:** Zip the `fund/` folder (or just the `index.html`)
and drop it on <https://app.netlify.com/drop>. Instant, no repo link.

**Option C — anywhere:** It's one static HTML file. Any static host works
(GitHub Pages, Cloudflare Pages, Vercel, etc.).

## Preview locally

```sh
# from the fund/ folder
python3 -m http.server 8000
# open http://localhost:8000
```
