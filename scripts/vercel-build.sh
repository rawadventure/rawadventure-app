#!/usr/bin/env bash
# Build web Vercel (F-12 audit Lou) : export Expo avec source maps, upload
# des source maps vers Sentry, puis suppression des .map du dist déployé
# (le code source ne doit pas être exposé publiquement).
#
# Sans SENTRY_AUTH_TOKEN (build local, fork) l'upload est sauté ; un échec
# d'upload n'empêche jamais le déploiement de l'app.
set -euo pipefail

npx expo export --platform web --source-maps
cp -r public/* dist/ 2>/dev/null || true

RELEASE="rawadventure@$(node -p "require('./package.json').version")"

if [ -n "${SENTRY_AUTH_TOKEN:-}" ]; then
  {
    npx @sentry/cli sourcemaps inject dist &&
    npx @sentry/cli sourcemaps upload \
      --org=adventure-limitedraw \
      --project=rawadventure \
      --release="$RELEASE" \
      dist
  } || echo "Sentry sourcemaps upload failed (non bloquant)"
else
  echo "SENTRY_AUTH_TOKEN absent - upload sourcemaps saute"
fi

find dist -name '*.map' -delete
