# Reporting a security problem

If you have found a security problem with this site, please report it privately
rather than opening a public issue. A public issue tells everyone how to exploit
the problem before there is a fix in place.

**Email:** tamerabouomar1@gmail.com

Please include what you found, and the steps to reproduce it. I will confirm I
have received your report and let you know once it is fixed.

Please do not run automated scanners, load tests, or anything that would degrade
the site for its visitors.

## What is covered

The live sites and the code in this repository:

- https://tamerabouomar.com
- https://fitness.tamerao.workers.dev

Third-party services embedded in the pages (Calendly, Google Fonts, Cloudflare)
should be reported to those companies directly.

## How this site is protected

- Every page is served with a Content-Security-Policy that blocks inline and
  third-party scripts, along with clickjacking, MIME-sniffing and referrer
  protections.
- The form endpoints are rate limited per visitor and only accept submissions
  originating from this site.
- The stored-leads endpoint requires a secret token, compared in constant time.
- No credentials or keys are stored in this repository; the Worker's token is
  held by Cloudflare (`wrangler secret put`).
- Dependencies and commit history are scanned automatically on every push and
  weekly (see `.github/workflows/security.yml`).
