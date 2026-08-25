#!/bin/bash
# One-button publish.
#
# Written to be run by Tamer, not by a developer: every message is plain
# English, every failure says what to do next, and the one secret it creates is
# saved somewhere he can actually find it again.
#
#   bash scripts/publish.sh
#
# It sets up the password for reading template leads (first run only), builds
# the site, and puts it live on Cloudflare.

set -u

cd "$(dirname "$0")/.." || exit 1

PASSFILE="$HOME/Desktop/portfolio-leads-password.txt"
# Read the live URL out of the deploy itself rather than hardcoding it. The
# account subdomain changed once (tamerabouomar1 -> tamerao) and the old value
# sat in here handing out a dead link long after the site was fine. Falls back
# to the current known URL only if the deploy output cannot be parsed.
SITE_FALLBACK="https://tamerabouomar.com"
SITE="$SITE_FALLBACK"

line() { printf '\n────────────────────────────────────────\n'; }

line
echo "PUBLISHING YOUR PORTFOLIO"
echo "This takes about a minute. Don't close the window."
line

# ── 0. signed in? ───────────────────────────────────────────────
# Checked up front and with `whoami`, which reports rather than launching a
# browser sign-in half way through a publish and looking like a freeze.
echo
echo "STEP 1 of 4 — Checking you are signed in to Cloudflare..."
if npx --yes wrangler whoami >/tmp/portfolio-who.log 2>&1; then
  echo "  Signed in."
else
  echo
  echo "  ! You are not signed in to Cloudflare yet, so nothing was published."
  echo "    Press Run on the sign-in command Claude gave you, approve it in"
  echo "    the browser window that opens, then press Run on this one again."
  echo
  exit 1
fi

# ── 1. the password for reading your leads ──────────────────────
# Only needs doing once. If it already exists we leave it alone, so re-running
# this script never changes a password you have already written down.
echo
echo "STEP 2 of 4 — Checking your leads password..."

if npx --yes wrangler secret list 2>/dev/null | grep -q "LEADS_TOKEN"; then
  echo "  Already set up. Leaving it as it is."
  if [ -f "$PASSFILE" ]; then
    TOKEN=$(cat "$PASSFILE" | tail -1)
  else
    TOKEN=""
  fi
else
  echo "  Creating one for the first time..."
  TOKEN=$(LC_ALL=C tr -dc 'a-zA-Z0-9' </dev/urandom | head -c 40)
  if echo "$TOKEN" | npx --yes wrangler secret put LEADS_TOKEN >/dev/null 2>&1; then
    printf '%s\n' "$TOKEN" > "$PASSFILE"
    echo "  Done. Saved to your Desktop as:"
    echo "     portfolio-leads-password.txt"
  else
    echo
    echo "  ! Could not set it up. This usually means you need to log in to"
    echo "    Cloudflare first. Run this, approve it in the browser, then run"
    echo "    this publish script again:"
    echo
    echo "        cd ~/Desktop/claude/portfolio-app && npx wrangler login"
    echo
    exit 1
  fi
fi

# ── 2. build ────────────────────────────────────────────────────
echo
echo "STEP 3 of 4 — Building the site..."
if npm run build >/tmp/portfolio-build.log 2>&1; then
  echo "  Done."
else
  echo
  echo "  ! The build failed. Nothing was published, your live site is untouched."
  echo "    Send Claude the last few lines below:"
  echo
  tail -20 /tmp/portfolio-build.log
  exit 1
fi

# ── 3. publish ──────────────────────────────────────────────────
echo
echo "STEP 4 of 4 — Putting it live..."
if npx --yes wrangler deploy >/tmp/portfolio-deploy.log 2>&1; then
  echo "  Done."
  # Take the URL Cloudflare actually published to, so this can never drift
  # from reality again.
  DEPLOYED=$(grep -oE 'https://[a-z0-9.-]+\.workers\.dev' /tmp/portfolio-deploy.log | tail -1)
  [ -n "$DEPLOYED" ] && SITE="$DEPLOYED"
else
  echo
  echo "  ! Publishing failed. Your live site is untouched (still the old version)."
  echo "    Send Claude the last few lines below:"
  echo
  tail -20 /tmp/portfolio-deploy.log
  exit 1
fi

# ── done ────────────────────────────────────────────────────────
line
echo "YOUR SITE IS LIVE"
line
echo
echo "Your portfolio:"
echo "   $SITE"
echo
echo "To see who downloaded your free website templates,"
echo "open this link (it is your private list, don't share it):"
echo
if [ -n "$TOKEN" ]; then
  echo "   $SITE/api/leads?token=$TOKEN&format=csv"
  echo
  echo "That downloads a spreadsheet you can open in Excel or Numbers."
  echo "The same link is saved on your Desktop in:"
  echo "   portfolio-leads-password.txt"
  {
    echo ""
    echo "Your private leads link (opens a spreadsheet of everyone who"
    echo "downloaded a free template). Do not share this link."
    echo ""
    echo "$SITE/api/leads?token=$TOKEN&format=csv"
  } >> "$PASSFILE"
else
  echo "   $SITE/api/leads?token=YOUR_PASSWORD&format=csv"
  echo
  echo "Your password is in portfolio-leads-password.txt on your Desktop."
fi
echo
