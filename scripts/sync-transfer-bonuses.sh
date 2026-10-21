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

if [[ ! -r "$ENV_FILE" ]]; then
  echo "$(date -Is) cannot read $ENV_FILE" >&2
  exit 1
fi

# Read the secret with grep rather than `source`. Sourcing executes the file as
# bash: the env file already contains a comment with backticks, which makes
# `source` fail outright, and a VALUE containing backticks or $(...) would be
# executed as a command.
SECRET=$(grep -m1 '^TRANSFER_BONUS_CRON_SECRET=' "$ENV_FILE" | cut -d= -f2- || true)

if [[ -z "$SECRET" ]]; then
  echo "$(date -Is) TRANSFER_BONUS_CRON_SECRET is not set in $ENV_FILE" >&2
  exit 1
fi

echo "$(date -Is) starting transfer bonus sync"

# -f makes a refused or failed run a non-zero exit, so the failure is visible
# in the cron log instead of buried in the body of a 200.
curl -fsS -m 180 -X POST \
  -H "Authorization: Bearer ${SECRET}" \
  "http://127.0.0.1:3000/api/transfer-bonuses/sync"

echo ""
echo "$(date -Is) finished"
