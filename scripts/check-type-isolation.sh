#!/usr/bin/env bash
# Comprueba que añadir un tipo de documento solo toca su carpeta.
# Uso: scripts/check-type-isolation.sh <tipo> [referencia-base]   (base por defecto: origin/main)
set -euo pipefail

tipo="${1:?Uso: $0 <tipo> [referencia-base]}"
base="${2:-origin/main}"
carpeta="src/documents/${tipo}/"

cambiados="$( { git diff --name-only "$base"; git ls-files --others --exclude-standard; } | sort -u)"
fuera="$(printf '%s\n' "$cambiados" | grep -v '^$' | grep -v "^${carpeta}" || true)"

if [ -n "$fuera" ]; then
  echo "✗ Añadir '${tipo}' toca archivos fuera de ${carpeta}:" >&2
  printf '  %s\n' $fuera >&2
  echo "  Un tipo nuevo solo añade su carpeta. Si necesita algo del núcleo, amplía el núcleo en otra iteración." >&2
  exit 1
fi
echo "✓ '${tipo}' solo toca ${carpeta}"
