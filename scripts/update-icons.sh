#!/bin/bash
# Atualiza o subset de ícones Flaticon UIcons baseado no que é usado.
# Vasculha:
#  1) classes "fi-rr-NAME" literais no JSX/TS
#  2) campo `icon: "NAME"` nos arquivos de dados (src/data/**)
# Gera só o CSS necessário pra evitar carregar 4MB.

set -e

PROJ_DIR="$(cd "$(dirname "$0")/.." && pwd)"
OUT_DIR="$PROJ_DIR/public/fonts/uicons"
CSS_OUT="$OUT_DIR/uicons.css"
FONT_OUT="$OUT_DIR/uicons-regular-rounded.woff2"
CDN="https://cdn-uicons.flaticon.com/2.6.0/uicons-regular-rounded"
TMP="/tmp/uicons-full.css"

mkdir -p "$OUT_DIR"

if [ ! -d "$PROJ_DIR/src" ]; then
  echo ">> AVISO: $PROJ_DIR/src não existe ainda — pulando geração de ícones."
  exit 0
fi

echo ">> Vasculhando ícones..."

# 1) literais fi-rr-X no código (JSX inline)
LITERALS=$(grep -roh 'fi-rr-[a-z0-9-]*' "$PROJ_DIR/src" --include="*.tsx" --include="*.ts" 2>/dev/null \
  | sort -u | sed 's/^fi-rr-//' || true)

# 2) campo `icon: "X"` em src/data/** (catálogo de itens)
DATA_ICONS=$(grep -rohP 'icon:\s*"\K[a-z0-9-]+(?=")' "$PROJ_DIR/src/data" 2>/dev/null \
  | sort -u || true)

ICONS=$(echo -e "$LITERALS\n$DATA_ICONS" | grep -v '^$' | sort -u)
COUNT=$(echo "$ICONS" | wc -l)
echo "   $COUNT ícones únicos."

if [ ! -f "$TMP" ] || [ ! -s "$TMP" ]; then
  echo ">> Baixando CSS completo do CDN..."
  if ! curl -fsSL "$CDN/css/uicons-regular-rounded.css" -o "$TMP"; then
    echo "   AVISO: falha ao baixar CSS. Mantendo CSS atual."
    [ -f "$CSS_OUT" ] || echo "/* offline */" > "$CSS_OUT"
    exit 0
  fi
fi

if [ ! -f "$FONT_OUT" ]; then
  echo ">> Baixando font woff2..."
  curl -fsSL "$CDN/webfonts/uicons-regular-rounded.woff2" -o "$FONT_OUT" \
    || echo "   AVISO: falha woff2."
fi

echo ">> Gerando subset CSS..."
cat > "$CSS_OUT" << 'EOF'
@font-face {
  font-family: "uicons-regular-rounded";
  src: url("/fonts/uicons/uicons-regular-rounded.woff2") format("woff2");
  font-display: swap;
}
i[class^="fi-rr-"]:before,
i[class*=" fi-rr-"]:before {
  font-family: uicons-regular-rounded !important;
  font-style: normal;
  font-weight: normal !important;
  font-variant: normal;
  text-transform: none;
  line-height: 1;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
EOF

MISSING=0
MISSING_LIST=""
for icon in $ICONS; do
  MATCH=$(grep -A2 "\.fi-rr-${icon}:before {" "$TMP" | head -3 || true)
  if [ -n "$MATCH" ]; then
    echo "$MATCH" >> "$CSS_OUT"
  else
    MISSING=$((MISSING + 1))
    MISSING_LIST="$MISSING_LIST $icon"
  fi
done

SIZE=$(wc -c < "$CSS_OUT")
echo ""
echo ">> Pronto!"
echo "   CSS: $CSS_OUT ($SIZE bytes)"
echo "   Ícones encontrados: $((COUNT - MISSING)) / $COUNT"
if [ "$MISSING" -gt 0 ]; then
  echo "   Faltando ($MISSING):$MISSING_LIST"
  echo "   → Substitua por nomes válidos do Flaticon UIcons (https://www.flaticon.com/uicons)"
fi
