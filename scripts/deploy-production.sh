#!/usr/bin/env bash
#
# Production deploy for relationshiplc.com.
#
#   ./scripts/deploy-production.sh
#
# WHY THIS SCRIPT EXISTS. Deploying this site by hand has two traps, and both
# have bitten:
#
#   1. `netlify deploy --build` builds against the CLI's *dev* env context and
#      cannot read secret values, so SUPABASE_SERVICE_ROLE_KEY arrives masked and
#      the build dies on the pages that read the Knowledge Base. The build has to
#      run --offline, against .env.local, which has the real key.
#
#   2. `netlify deploy --no-build` then publishes `publish = ".next"` from
#      netlify.toml — the RAW Next output. The Next plugin stages the real
#      publish root at .netlify/static, where assets live under _next/. Deploying
#      .next means every /_next/static/* request 404s: pages still render,
#      because the server function produces the HTML, but the site loads with no
#      CSS at all. That shipped three times undetected because the checks were
#      grepping page TEXT, which is present either way.
#
# So: build offline, deploy .netlify/static, and verify ASSETS, not just words.
set -euo pipefail

cd "$(dirname "$0")/.."

say() { printf "\n\033[1m%s\033[0m\n" "$*"; }
fail() { printf "\033[31m✗ %s\033[0m\n" "$*"; exit 1; }

# --- 1. env parity ----------------------------------------------------------
# A local build bakes every NEXT_PUBLIC_* value. If .env.local disagrees with the
# Netlify production context, the deploy silently ships different feature flags —
# including NEXT_PUBLIC_COMPANION_ENABLED, which would take the paid Companion
# offline.
say "1/5  Checking public flag parity with the Netlify production context"
python3 - <<'PY'
import json, subprocess, sys
net = json.loads(subprocess.run(
    ["npx","netlify","env:list","--context","production","--json"],
    capture_output=True, text=True).stdout)
local = {}
for line in open(".env.local"):
    line = line.strip()
    if not line or line.startswith("#") or "=" not in line: continue
    k, v = line.split("=", 1)
    local[k.strip()] = v.strip().strip('"').strip("'")
bad = [k for k in sorted(set(list(net) + list(local)))
       if k.startswith("NEXT_PUBLIC_")
       and (net.get(k) if isinstance(net.get(k), str) else None) != local.get(k)]
if bad:
    print("  MISMATCH: " + ", ".join(bad))
    print("  A local build would bake the .env.local value. Reconcile before deploying.")
    sys.exit(1)
if not local.get("SUPABASE_SERVICE_ROLE_KEY"):
    print("  SUPABASE_SERVICE_ROLE_KEY missing from .env.local — the build cannot read the database.")
    sys.exit(1)
print("  parity clean")
PY

# --- 2. build ---------------------------------------------------------------
say "2/5  Building offline against .env.local"
rm -rf .next
npx netlify build --offline --context production

[ -d .netlify/static/_next/static ] || fail ".netlify/static/_next/static missing — the Next plugin did not stage assets."

# --- 3. pre-flight on the built output --------------------------------------
say "3/5  Checking the built output"
css_count=$(find .netlify/static/_next/static/css -name '*.css' 2>/dev/null | wc -l | tr -d ' ')
[ "$css_count" -gt 0 ] || fail "No CSS in the build output."
echo "  $css_count stylesheet(s) staged"
grep -q "Getting Back to Yourself" .next/server/app/recovery.html \
  || fail "Recovery did not render from the Knowledge Base."
grep -q "Coming soon" .next/server/app/relationship-companion.html \
  && fail "Companion built as disabled — NEXT_PUBLIC_COMPANION_ENABLED is wrong."
echo "  Recovery is Knowledge Base sourced; Companion is enabled"

# --- 4. deploy --------------------------------------------------------------
# --dir is the whole point: without it netlify.toml's publish=".next" wins.
say "4/5  Deploying .netlify/static to production"
npx netlify deploy --prod --no-build --dir .netlify/static

# --- 5. verify the LIVE site, assets included -------------------------------
say "5/5  Verifying production"
sleep 5
html=$(curl -fsS https://relationshiplc.com/)

assets=$(printf '%s' "$html" | grep -oE '/_next/static/(css|chunks)/[^"]+\.(css|js)' | sort -u | head -8)
[ -n "$assets" ] || fail "No hashed assets referenced in the homepage HTML."
for a in $assets; do
  code=$(curl -s -o /dev/null -w '%{http_code}' "https://relationshiplc.com$a")
  [ "$code" = "200" ] || fail "asset $a returned $code — the publish directory is wrong."
done
echo "  $(printf '%s' "$assets" | wc -l | tr -d ' ')+ assets served 200"

for p in / /framework /recovery /learn /snapshot /relationship-companion; do
  code=$(curl -s -o /dev/null -w '%{http_code}' "https://relationshiplc.com$p")
  [ "$code" = "200" ] || fail "page $p returned $code"
done
echo "  public pages 200"

curl -s https://relationshiplc.com/relationship-companion | grep -q "Coming soon" \
  && fail "Companion is showing as disabled on the live site."
echo "  Companion live"

printf "\n\033[32m✓ Deployed and verified.\033[0m\n"
