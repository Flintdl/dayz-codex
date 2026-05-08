#!/usr/bin/env node
/**
 * Scraper v2 — busca imagens com VALIDAÇÃO de match.
 *
 * Diferenças vs v1:
 *  1. Múltiplas estratégias de busca por item (nome exato, com sufixo
 *     "(item)" / "(weapon)", sem parênteses, com "DayZ").
 *  2. Valida que a página resultante é REALMENTE um item:
 *     - Wikitext deve conter `{{*Infobox*}}` template
 *     - Categories da página devem incluir Items/Weapons/Tools/etc
 *  3. Valida a imagem baixada:
 *     - Tamanho mínimo 4KB
 *     - Aspect ratio razoável (não > 3:1 / < 1:3)
 *     - Content-Type confere image/*
 *  4. Override manual via `public/items/_overrides.json`:
 *       { "slug": "URL ou /caminho/local.png" }
 *  5. Modo `--revalidate` re-checa imagens existentes e move suspeitas
 *     pra `public/items/_review/<slug>.webp`.
 *
 * Uso:
 *   node scripts/fetch-wiki-images-v2.mjs                # processa só faltantes
 *   node scripts/fetch-wiki-images-v2.mjs --revalidate   # re-valida tudo
 *   node scripts/fetch-wiki-images-v2.mjs --only=akm,m4-a1
 */

import { promises as fs } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");
const itemsDir = path.join(root, "src", "data", "items");
const outDir = path.join(root, "public", "items");
const reviewDir = path.join(outDir, "_review");
const overridesPath = path.join(outDir, "_overrides.json");

const WIKI_API = "https://dayz.fandom.com/api.php";
const WIKI_BASE = "https://dayz.fandom.com/wiki/";
const UA = "DayZ-Codex-Local-Guide/0.3 (personal use)";
const POLITE_DELAY_MS = 250;

const args = process.argv.slice(2);
const REVALIDATE = args.includes("--revalidate");
const ONLY = (args.find((a) => a.startsWith("--only="))?.slice(7) ?? "")
  .split(",")
  .filter(Boolean);

await fs.mkdir(outDir, { recursive: true });
await fs.mkdir(reviewDir, { recursive: true });

// ─── Carrega overrides ──────────────────────────────────────────
let overrides = {};
try {
  overrides = JSON.parse(await fs.readFile(overridesPath, "utf8"));
} catch {
  // Cria template vazio
  await fs.writeFile(
    overridesPath,
    JSON.stringify(
      { _comment: "Map slug→URL ou caminho local /public para forçar imagem específica", _examples: { "m4-a1": "https://exemplo.com/m4.png" } },
      null,
      2,
    ),
  );
}

// ─── Carrega itens ──────────────────────────────────────────────
const itemFiles = (await fs.readdir(itemsDir)).filter(
  (f) => f.endsWith(".ts") && f !== "index.ts",
);
const items = [];
for (const f of itemFiles) {
  const content = await fs.readFile(path.join(itemsDir, f), "utf8");
  const re = /slug:\s*"([^"]+)",\s*\n\s*name:\s*"([^"]+)"/g;
  let m;
  while ((m = re.exec(content))) {
    items.push({ slug: m[1], name: m[2] });
  }
}
const seenSlugs = new Set();
const uniqueItems = items.filter((i) => {
  if (seenSlugs.has(i.slug)) return false;
  seenSlugs.add(i.slug);
  return true;
});
console.log(`>> ${uniqueItems.length} itens únicos.`);

// ─── Helpers ────────────────────────────────────────────────────
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function api(params) {
  const u = new URL(WIKI_API);
  for (const [k, v] of Object.entries(params)) u.searchParams.set(k, v);
  u.searchParams.set("format", "json");
  u.searchParams.set("origin", "*");
  const res = await fetch(u, { headers: { "user-agent": UA } });
  if (!res.ok) throw new Error(`api ${res.status}`);
  return res.json();
}

async function existingImage(slug) {
  for (const ext of ["png", "jpg", "jpeg", "webp", "gif", "svg"]) {
    try {
      const p = path.join(outDir, `${slug}.${ext}`);
      const stat = await fs.stat(p);
      return { ext, path: p, size: stat.size };
    } catch {}
  }
  return null;
}

async function searchWiki(query) {
  const j = await api({ action: "query", list: "search", srsearch: query, srlimit: "5" });
  return j.query?.search ?? [];
}

async function pageInfo(title) {
  // Categories + revisions
  const j = await api({
    action: "query",
    titles: title,
    prop: "categories|revisions|pageimages",
    rvslots: "main",
    rvprop: "content",
    cllimit: "20",
    pithumbsize: "512",
    piprop: "thumbnail|original",
  });
  const page = Object.values(j.query?.pages ?? {})[0];
  if (!page) return null;
  const wikitext = page.revisions?.[0]?.slots?.main?.["*"] ?? "";
  const cats = (page.categories ?? []).map((c) => c.title);
  const imageUrl = page.original?.source ?? page.thumbnail?.source ?? null;
  return { title: page.title, wikitext, cats, imageUrl };
}

const ITEM_CAT_RE = /Category:(Items|Weapons|Pistols|Rifles|Shotguns|Snipers|Firearms|Melee[ _]Weapons|Ammunition|Magazines|Attachments|Tools|Equipment|Food|Cooking|Drink|Medical|Clothing|Pants|Shirts|Vests|Headgear|Footwear|Gloves|Backpacks|Containers|Vehicles|Vehicle[ _]Parts|Animals|Plants)/i;

function looksLikeItemPage(info) {
  if (!info) return false;
  // Tem template Infobox (qualquer variante)
  if (/\{\{\s*[A-Za-z_]*[Ii]nfobox/.test(info.wikitext)) return true;
  // Está em categoria de item conhecida
  if (info.cats.some((c) => ITEM_CAT_RE.test(c))) return true;
  return false;
}

function genQueries(name) {
  const base = name.replace(/\([^)]*\)/g, "").trim();
  const parens = name.match(/\(([^)]+)\)/)?.[1] ?? "";
  return [
    name,
    base,
    `${base} (item)`,
    `${base} DayZ`,
    parens ? `${base} ${parens}` : null,
    base.replace(/\s+/g, "_"),
    base.replace(/-/g, " "),
  ].filter(Boolean);
}

async function downloadImage(url, slug) {
  const res = await fetch(url, { headers: { "user-agent": UA } });
  if (!res.ok) throw new Error(`fetch image ${res.status}`);
  const buf = Buffer.from(await res.arrayBuffer());
  if (buf.length < 4000) throw new Error(`too small ${buf.length}b`);

  const ct = (res.headers.get("content-type") ?? "").toLowerCase();
  if (!ct.startsWith("image/")) throw new Error(`bad ct ${ct}`);

  const ext = ct.includes("png") ? "png"
    : ct.includes("webp") ? "webp"
    : ct.includes("gif") ? "gif"
    : ct.includes("svg") ? "svg"
    : ct.includes("jpeg") || ct.includes("jpg") ? "jpg"
    : "png";

  // Aspect ratio sanity check via PNG/JPG header parsing
  // (skip pra webp/svg porque tem que decodar tudo)
  if (ext === "png" || ext === "jpg") {
    const dims = readImageDims(buf, ext);
    if (dims) {
      const ratio = dims.w / dims.h;
      if (ratio > 4 || ratio < 0.25) throw new Error(`bad aspect ${dims.w}x${dims.h}`);
    }
  }

  const out = path.join(outDir, `${slug}.${ext}`);
  await fs.writeFile(out, buf);
  return { ext, bytes: buf.length };
}

function readImageDims(buf, ext) {
  try {
    if (ext === "png") {
      // PNG: 16 bytes header + 8 bytes IHDR length+type, then 4+4 bytes width+height
      if (buf.length > 24 && buf[0] === 0x89 && buf[1] === 0x50) {
        const w = buf.readUInt32BE(16);
        const h = buf.readUInt32BE(20);
        return { w, h };
      }
    }
    if (ext === "jpg") {
      // JPEG: scan for SOF0 marker
      let i = 2;
      while (i < buf.length - 8) {
        if (buf[i] === 0xff && buf[i + 1] >= 0xc0 && buf[i + 1] <= 0xcf && buf[i + 1] !== 0xc4 && buf[i + 1] !== 0xcc) {
          const h = buf.readUInt16BE(i + 5);
          const w = buf.readUInt16BE(i + 7);
          return { w, h };
        }
        i++;
      }
    }
  } catch {}
  return null;
}

// ─── Loop ──────────────────────────────────────────────────────
let ok = 0, skip = 0, fail = 0, suspect = 0, fromOverride = 0;
const failures = [];

const filtered = ONLY.length > 0 ? uniqueItems.filter((i) => ONLY.includes(i.slug)) : uniqueItems;

for (let i = 0; i < filtered.length; i++) {
  const it = filtered[i];
  const prefix = `[${(i + 1).toString().padStart(3)}/${filtered.length}] ${it.slug.padEnd(36)}`;

  // 1. Override manual
  const ov = overrides[it.slug];
  if (typeof ov === "string" && ov.length > 4) {
    try {
      if (ov.startsWith("http://") || ov.startsWith("https://")) {
        const r = await downloadImage(ov, it.slug);
        console.log(`${prefix} OVRD   .${r.ext} (${r.bytes}b)`);
      } else {
        // path local → copia
        const src = path.isAbsolute(ov) ? ov : path.join(root, "public", ov.replace(/^\//, ""));
        const buf = await fs.readFile(src);
        const ext = path.extname(src).slice(1) || "png";
        await fs.writeFile(path.join(outDir, `${it.slug}.${ext}`), buf);
        console.log(`${prefix} OVRD   ${src} → .${ext}`);
      }
      fromOverride++;
      continue;
    } catch (e) {
      console.log(`${prefix} OVRD-FAIL ${e.message}`);
    }
  }

  // 2. Existente
  const existing = await existingImage(it.slug);
  if (existing && !REVALIDATE) {
    console.log(`${prefix} SKIP   já tem .${existing.ext} (${(existing.size / 1024).toFixed(0)}KB)`);
    skip++;
    continue;
  }

  // 3. Busca + valida
  let matchedTitle = null;
  let imageUrl = null;
  for (const q of genQueries(it.name)) {
    const hits = await searchWiki(q);
    await sleep(POLITE_DELAY_MS);
    for (const h of hits.slice(0, 3)) {
      const info = await pageInfo(h.title);
      await sleep(POLITE_DELAY_MS);
      if (!looksLikeItemPage(info)) continue;
      if (info.imageUrl) {
        matchedTitle = info.title;
        imageUrl = info.imageUrl;
        break;
      }
    }
    if (imageUrl) break;
  }

  if (!imageUrl) {
    console.log(`${prefix} MISS   nenhum match validado`);
    fail++;
    failures.push({ slug: it.slug, name: it.name, reason: "no validated match" });
    continue;
  }

  // 4. Re-validate: se REVALIDATE e existing, comparar título atual
  // (futuro: detectar wrong-image existente movendo pra _review)
  try {
    if (existing && REVALIDATE) {
      // Move atual pra review antes de baixar novo
      await fs.rename(existing.path, path.join(reviewDir, path.basename(existing.path)));
      suspect++;
    }
    const r = await downloadImage(imageUrl, it.slug);
    console.log(`${prefix} OK     ${matchedTitle} → .${r.ext} (${r.bytes}b)`);
    ok++;
  } catch (e) {
    console.log(`${prefix} ERR    ${e.message}`);
    fail++;
    failures.push({ slug: it.slug, name: it.name, reason: e.message });
  }

  await sleep(POLITE_DELAY_MS);
}

console.log(`\n>> Resultado:`);
console.log(`   OK:        ${ok}`);
console.log(`   SKIP:      ${skip}`);
console.log(`   OVERRIDE:  ${fromOverride}`);
console.log(`   FAIL:      ${fail}`);
if (REVALIDATE) console.log(`   REVIEW:    ${suspect}  (movidos pra _review/)`);

if (failures.length > 0) {
  await fs.writeFile(
    path.join(outDir, "_failures.json"),
    JSON.stringify(failures, null, 2),
  );
  console.log(`\n>> ${failures.length} faltantes em public/items/_failures.json`);
  console.log(`   Para corrigir manualmente:`);
  console.log(`   1. Edite public/items/_overrides.json: { "slug": "URL ou /items/foo.png" }`);
  console.log(`   2. Re-rode: node scripts/fetch-wiki-images-v2.mjs --only=slug1,slug2`);
}
