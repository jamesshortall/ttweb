#!/bin/bash
#
# Daily transfer bonus sync. Install with:
#
#   chmod +x /root/ttweb/scripts/sync-transfer-bonuses.sh
#   /root/ttweb/scripts/sync-transfer-bonuses.sh          # test by hand first
#   crontab -e
#   13 6 * * * /root/ttweb/scripts/sync-transfer-bonuses.sh >> /var/log/ttweb-transfer-sync.log 2>&1
#
# 6:13am catches overnight announcements before clients are up, and an odd
# minute avoids the top-of-hour crush every other cron on every other server
# joins. The request goes to 127.0.0.1 so the job does not depend on DNS or
# nginx being healthy, and never leaves the machine.
set -euo pipefail

ENV_FILE=${TTWEB_ENV_FILE:-/root/ttweb/.env.production.local}
ENDPOINT=${TTWEB_SYNC_URL:-http://127.0.0.1:3000/api/transfer-bonuses/sync}

if [[ ! -r "$ENV_FILE" ]]; then
  echo "$(date -Is) cannot read $ENV_FILE" >&2
  exit 1
fi

# Read the secret with grep rather than `source`. Sourcing executes the file as
# bash: the env file already contains a comment with backticks, which makes
# `source` fail outright, and a VALUE containing backticks or $(...) would be
# executed as a command.
#
# The LAST definition wins, not the first. Next.js parses .env files with
# dotenv, which assigns each key as it reads, so a duplicated variable takes
# its final value. An earlier version used `grep -m1` and took the first, so a
# duplicated secret made the script and the app disagree — and the only
# symptom was a bare 401.
SECRET=$(grep '^TRANSFER_BONUS_CRON_SECRET=' "$ENV_FILE" | tail -1 | cut -d= -f2- || true)

if [[ -z "$SECRET" ]]; then
  echo "$(date -Is) TRANSFER_BONUS_CRON_SECRET is not set in $ENV_FILE" >&2
  exit 1
fi

echo "$(date -Is) starting transfer bonus sync"

BODY=$(mktemp)
trap 'rm -f "$BODY"' EXIT

# Deliberately NOT `curl -f`: that discards the response body, which is the
# only place the reason for a failure appears. An earlier version used it, and
# a failed run reported nothing but "error: 502" — the actual cause had to be
# dug out of pm2 logs. Capture the body and the status separately instead, so
# the log holds the diagnosis AND cron still sees a non-zero exit.
# The fallback sits OUTSIDE the substitution: curl already prints "000" via
# -w when it cannot connect, so an `|| echo "000"` within would concatenate
# into "000000" and defeat the check below.
STATUS=$(curl -sS -m 180 -X POST \
  -H "Authorization: Bearer ${SECRET}" \
  -o "$BODY" -w '%{http_code}' \
  "$ENDPOINT") || STATUS="000"

cat "$BODY"
echo ""

if [[ "$STATUS" != "200" ]]; then
  # 000 means curl never got a reply at all — the app is down or unreachable.
  if [[ "$STATUS" == "000" ]]; then
    echo "$(date -Is) sync failed: no response from $ENDPOINT" >&2
  else
    echo "$(date -Is) sync failed: HTTP $STATUS (see the body above for the reason)" >&2
  fi
  exit 1
fi

echo "$(date -Is) finished"
