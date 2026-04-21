#!/usr/bin/env bash
# check-secrets.sh — pre-commit regex scan for matter-forge.
#
# Sweeps staged files for patterns that look like API keys, tokens, or
# other secrets. Blocks commit if any match, unless the match is inside a
# known placeholder (████).
#
# Install as a git hook:
#   ln -s ../../scripts/check-secrets.sh .git/hooks/pre-commit
# Or run manually:
#   ./scripts/check-secrets.sh

set -euo pipefail

# Patterns. Each one a regex that matches a known secret shape.
declare -a PATTERNS=(
  'AIza[0-9A-Za-z_-]{35}'            # Google API (incl. Gemini)
  'sk-[A-Za-z0-9]{32,}'              # OpenAI-style
  'ghp_[A-Za-z0-9]{36}'              # GitHub PAT (classic)
  'github_pat_[A-Za-z0-9_]{82}'      # GitHub fine-grained
  'eyJ[A-Za-z0-9_-]+\.eyJ[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+'  # JWT
  'xox[baprs]-[A-Za-z0-9-]{10,}'     # Slack
  '-----BEGIN [A-Z ]+PRIVATE KEY-----'  # PEM private keys
)

# Placeholder that means "known redacted" — never flags this.
PLACEHOLDER='████'

# Collect staged files (added, modified, copied, renamed). Skip deletes.
mapfile -t STAGED_FILES < <(git diff --cached --name-only --diff-filter=ACMR || true)

if [ ${#STAGED_FILES[@]} -eq 0 ]; then
  exit 0
fi

violations=0

for file in "${STAGED_FILES[@]}"; do
  # Skip if file disappeared between staging and check.
  [ -f "$file" ] || continue

  # Skip binary files (approximate check).
  if file --brief --mime "$file" | grep -q 'charset=binary'; then
    continue
  fi

  # Skip .env.local and anything under .vault-private (they should not be
  # staged anyway; this is a safety net).
  case "$file" in
    .env.local|.env|.vault-private/*) continue ;;
  esac

  for pattern in "${PATTERNS[@]}"; do
    # Find matches; exclude lines that contain the placeholder.
    if matches=$(grep --extended-regexp --line-number --only-matching \
         "$pattern" "$file" 2>/dev/null | grep -v "$PLACEHOLDER" || true); then
      if [ -n "$matches" ]; then
        echo "❌ secret-like pattern in $file:"
        echo "$matches" | sed 's/^/   /'
        violations=$((violations + 1))
      fi
    fi
  done
done

if [ $violations -gt 0 ]; then
  echo ""
  echo "Blocked: $violations file(s) contain secret-like patterns."
  echo "Replace real values with ████ (U+2588) in committed files;"
  echo "store real values in .env.local or .vault-private/ (gitignored)."
  exit 1
fi

exit 0
