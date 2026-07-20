#!/usr/bin/env bash
# Clear Gatekeeper quarantine so an unsigned/ad-hoc aeri build can open.
set -euo pipefail
APP="${1:-/Applications/aeri.app}"
if [[ ! -d "$APP" ]]; then
  echo "App not found: $APP" >&2
  echo "Usage: $0 [/path/to/aeri.app]" >&2
  exit 1
fi
xattr -cr "$APP"
echo "Cleared quarantine on $APP — open it from Applications."
