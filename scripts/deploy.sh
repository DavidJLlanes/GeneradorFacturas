#!/usr/bin/env bash
# Despliegue manual: actualiza el código, construye y publica en la carpeta web.
# Uso: scripts/deploy.sh [DESTINO]
# DESTINO por defecto: /var/www/djl.com.es/factura
set -euo pipefail

DEST="${1:-/var/www/djl.com.es/factura}"
REPO_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"

if [[ -z "$DEST" || "$DEST" == "/" ]]; then
  echo "Destino no válido: '$DEST'" >&2
  exit 1
fi

cd "$REPO_DIR"

echo "→ Actualizando código"
git pull --ff-only

echo "→ Instalando dependencias"
npm ci

echo "→ Construyendo"
npm run build

echo "→ Publicando en $DEST"
mkdir -p "$DEST"
find "$DEST" -mindepth 1 -maxdepth 1 -exec rm -rf {} +
cp -a dist/. "$DEST"/

echo "✓ Desplegado: $(git rev-parse --short HEAD) en $DEST"
