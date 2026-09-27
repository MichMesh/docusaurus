#!/bin/sh
# Waits until the live site serves version.txt containing the expected
# commit, and fails if it never does. Run by the publish workflow after
# committing build/ to master, so a missed webhook delivery, a stopped listener or a
# broken server config shows up as a failed run instead of a stale site.
#
#   scripts/wait-for-deploy.sh <expected sha>
#   SITE, ATTEMPTS and INTERVAL (seconds) override the defaults.

expected="$1"
site="${SITE:-https://michmesh.com}"
attempts="${ATTEMPTS:-40}"
interval="${INTERVAL:-15}"
served=""

[ -n "$expected" ] || { echo "usage: $0 <expected sha>" >&2; exit 2; }

i=1
while [ "$i" -le "$attempts" ]; do
  served=$(curl -fsS -H 'Cache-Control: no-cache' "$site/version.txt?t=$(date +%s)" 2>/dev/null | tr -d '[:space:]')
  if [ "$served" = "$expected" ]; then
    echo "$site is serving $expected"
    exit 0
  fi
  echo "Waiting ($i/$attempts): $site serves '${served:-nothing}', expecting $expected"
  i=$((i + 1))
  [ "$i" -le "$attempts" ] && sleep "$interval"
done

echo "::error title=$site did not update::After $((attempts * interval))s $site still serves '${served:-nothing}', not $expected. Check the webhook's Recent Deliveries on GitHub, and 'journalctl -u michmesh-webhook' and 'git -C /var/www/MichMesh status' on the server."
exit 1
