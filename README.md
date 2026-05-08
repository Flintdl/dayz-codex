# DayZ Codex

Manual de campo para sobreviventes — **320 itens vanilla**, crafting, mecânicas
de sobrevivência, base building, mapas estáticos e **mapa interativo** com
markers customizáveis. Cadeia tipo dataminer entre todos os itens.

## Stack

- **Next.js 16** (Turbopack, App Router, RSC, output standalone para self-host)
- **React 19**
- **TypeScript** strict
- **Tailwind CSS 4** (`@theme inline` tokens, design system militar)
- **Leaflet** (mapa interativo client-side)
- **Zod** (validação de input/storage)
- **Flaticon UIcons** (subset CSS gerado automático)

## Comandos

```bash
npm install              # instala deps
npm run dev              # http://localhost:3000
npm run build            # build estático (gera 320+ páginas)
npm run start            # serve build
npm run fetch:images     # baixa imagens dos itens via Wiki Fandom
npm run optimize:images  # comprime imagens (requer cwebp ou ImageMagick)
npm run manifest         # regenera src/lib/imageManifest.ts
npm run audit:ci         # falha em CVE HIGH/CRITICAL
npm run analyze          # bundle analysis (ANALYZE=true)
```

## Deploy

### Vercel (recomendado)

1. Push para GitHub
2. `vercel --prod` ou conectar repo no dashboard Vercel
3. Setar env var: `NEXT_PUBLIC_SITE_URL=https://seu-dominio.vercel.app`
4. Vercel detecta Next.js automaticamente — usa `vercel.json` desta repo
5. Imagens em `/public/items/` são commitadas no repo e servidas pela CDN
6. Bunds estática: ~3-5MB (sem fontes externas), TTI < 2s

### Self-hosted (Docker)

```bash
npm run docker:up        # build + up (porta 3000)
npm run docker:logs      # tail logs
npm run docker:down      # stop
```

`docker-compose.yml` inclui:
- Healthcheck via `/api/health` (30s interval)
- Limites de memória (128MB res, 512MB max)
- `no-new-privileges` + tmpfs `/tmp`
- Logs rotativos (10MB × 3 arquivos)

### Self-hosted (manual)

```bash
npm run build
node .next/standalone/server.js
```

`output: "standalone"` gera bundle de ~150MB com tudo embutido.

## Estrutura

```
src/
  app/
    page.tsx                        # HOME
    itens/                          # catálogo + ficha cross-link
    crafting/                       # receitas vanilla
    sobrevivencia/                  # status + doenças
    base-building/                  # construções
    mapas/                          # mapas + zonas (texto)
    mapa-interativo/                # mapa Leaflet com markers
    api/health/                     # healthcheck endpoint
    sitemap.ts robots.ts            # SEO/crawler control
  components/
    Header Footer ItemCard
    ItemImage GlobalSearch InteractiveMap
  data/
    types.ts                        # tipos canônicos
    items/{weapons,ammo,...}.ts     # 320 itens em 13 arquivos
    recipes.ts survival.ts maps.ts baseBuilding.ts
  lib/
    imageManifest.ts                # AUTO — slugs com imagem
    markers.ts                      # Zod schema + localStorage
public/
  items/<slug>.<ext>                # imagens dos itens
  maps/<slug>.svg                   # SVG dos mapas (chernarus, livonia, sakhal)
  fonts/uicons/                     # subset Flaticon
scripts/
  update-icons.sh                   # CSS subset baseado em uso
  build-image-manifest.mjs          # mapa slug → ext
  fetch-wiki-images.mjs             # scraper Fandom Wiki
  optimize-images.mjs               # cwebp/convert
```

## Adicionar itens novos

1. Edite o arquivo de categoria apropriado em `src/data/items/`
2. Use `slug` único kebab-case
3. Preencha `category`, `icon` (Flaticon name), `rarity`, `loot`, `summary`, `description`
4. Adicione `relations.requires/compatibleWith/repairedBy/yields` — todos os slugs viram links navegáveis automaticamente
5. Coloque imagem em `/public/items/<slug>.png|.webp` (256×256 transparente)
6. Rode `npm run build` — aparece automático no catálogo, busca, recipe index

## Adicionar/editar ícones Flaticon

1. `<i className="fi-rr-NOME" />` no JSX **OU** `icon: "NOME"` em `data/`
2. `bash scripts/update-icons.sh` (também em predev/prebuild)
3. CSS subset em `public/fonts/uicons/uicons.css` regenera

Nomes válidos: https://www.flaticon.com/uicons (UIcons Regular Rounded).

## Imagens

Site funciona 100% sem imagens — fallback Flaticon automático. Para adicionar:

- **Manual**: drop PNG/WebP em `/public/items/<slug>.<ext>`
- **Em massa**: `npm run fetch:images` (Wiki Fandom — ~70-80% cobertura)
- **Otimizar**: `npm run optimize:images` (requer `cwebp` ou ImageMagick)

## Segurança

Modelo completo em [`SECURITY.md`](./SECURITY.md). Resumo:

- Site **estático** sem backend → maioria das classes OWASP é N/A
- CSP estrita em prod, headers OWASP completos
- localStorage com schema Zod (markers customizados)
- Renderização via `textContent`, nunca `innerHTML`
- `npm run audit:ci` no CI pra CVEs

## Stats

- **320 itens** vanilla (armas, melee, ammo, mags, attachments, comida, bebida, médico, ferramentas, vestuário, mochilas, componentes, consumíveis, veículos, peças, granadas, animais, Sakhal, construção)
- **15+ receitas** de crafting com cross-links
- **7 status** + **8 doenças** com cura/prevenção linkadas
- **3 mapas** com **14 zonas notáveis** + mapa interativo
- **6 peças** de base building com raid times
- **Busca global** indexa 350+ entradas (atalho `/`)
- **332 páginas estáticas** geradas no build

## Próximas evoluções

- Self-host Google Fonts (remove dep de gstatic.com)
- Subresource Integrity em assets externos
- PWA install + offline cache
- Mais itens vanilla (variantes de cor, peças finais)
- Calculadora de carregamento (peso/slots vs limite)
- Sistema de blood type chart visual
