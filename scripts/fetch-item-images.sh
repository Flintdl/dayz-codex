#!/bin/bash
# Baixa imagens de itens DayZ do Fandom Wiki para /public/items/<slug>.png
#
# IMPORTANTE: imagens do DayZ Wiki são propriedade da Bohemia Interactive
# (CC-BY-SA do Fandom para fan-content). Use só para guia comunitário e
# referencie a fonte. Não redistribua comercialmente.
#
# Uso:
#   ./scripts/fetch-item-images.sh
#
# O script lê os slugs do catálogo e tenta baixar imagens. Itens sem foto
# disponível ficam com fallback automático para o ícone Flaticon.

set -e

PROJ_DIR="$(cd "$(dirname "$0")/.." && pwd)"
OUT_DIR="$PROJ_DIR/public/items"
WIKI_BASE="https://dayz.fandom.com/wiki/Special:FilePath"

mkdir -p "$OUT_DIR"

if [ ! -d "$PROJ_DIR/src/data/items" ]; then
  echo ">> AVISO: src/data/items não existe."
  exit 1
fi

echo ">> Coletando slugs do catálogo..."
SLUGS=$(grep -rh "slug:" "$PROJ_DIR/src/data/items" --include="*.ts" \
  | grep -oP '"\K[a-z0-9-]+(?=")' | sort -u)
COUNT=$(echo "$SLUGS" | wc -l)
echo "   $COUNT slugs únicos."

OK=0
FAIL=0
SKIP=0
for slug in $SLUGS; do
  OUT="$OUT_DIR/$slug.png"
  if [ -f "$OUT" ]; then
    SKIP=$((SKIP + 1))
    continue
  fi

  # Tenta capitalizar slug -> CamelCase pra match com Wiki
  WIKI_NAME=$(echo "$slug" | awk -F'-' '{for(i=1;i<=NF;i++) $i=toupper(substr($i,1,1))substr($i,2)}1' OFS='_')

  for variant in "${WIKI_NAME}.png" "${WIKI_NAME}_icon.png" "${slug}.png"; do
    URL="${WIKI_BASE}/${variant}"
    if curl -fsSL --max-time 15 "$URL" -o "$OUT" 2>/dev/null; then
      # Filtro mínimo de validade — wiki retorna placeholder pequeno em 404
      SIZE=$(wc -c < "$OUT")
      if [ "$SIZE" -gt 2000 ]; then
        OK=$((OK + 1))
        break
      else
        rm -f "$OUT"
      fi
    fi
  done

  if [ ! -f "$OUT" ]; then
    FAIL=$((FAIL + 1))
  fi
done

echo ""
echo ">> Resultado:"
echo "   Baixadas: $OK"
echo "   Já existiam: $SKIP"
echo "   Não encontradas: $FAIL  (esses usam fallback de ícone Flaticon)"
echo ""
echo ">> Para adicionar manualmente:"
echo "   coloque uma imagem em $OUT_DIR/<slug>.png e o site usa automático."
