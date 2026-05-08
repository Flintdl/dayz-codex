#!/usr/bin/env node
/**
 * Baixa imagens do Fandom Wiki (DayZ) para /public/items/<slug>.<ext>.
 *
 * Estratégia:
 *  1. Parse src/data/items/*.ts pra extrair { slug, name }.
 *  2. Pra cada item, tenta variações de query: nome exato, nome com tag "DayZ",
 *     versões com underscores. Usa MediaWiki search API.
 *  3. Pega top-1 hit, busca página com prop=pageimages → thumbnail original.
 *  4. Fallback: parse <meta property="og:image"> do HTML da página.
 *  5. Baixa, valida tamanho mínimo, salva.
 *
 * Resumível: pula slugs que já têm imagem.
 *
 * Uso:
 *   node scripts/fetch-wiki-images.mjs            # tenta tudo
 *   node scripts/fetch-wiki-images.mjs --only=m4-a1,akm   # subset
 *   node scripts/fetch-wiki-images.mjs --force    # ignora existentes
 */

import { promises as fs } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");
const itemsDir = path.join(root, "src", "data", "items");
const outDir = path.join(root, "public", "items");

const WIKI_API = "https://dayz.fandom.com/api.php";
const WIKI_BASE = "https://dayz.fandom.com/wiki/";
const UA = "DayZ-Codex-Local-Guide/0.1 (personal use)";
const POLITE_DELAY_MS = 350;
const MIN_IMG_BYTES = 1200;

const args = process.argv.slice(2);
const FORCE = args.includes("--force");
const ONLY = (args.find((a) => a.startsWith("--only="))?.slice(7) ?? "")
  .split(",")
  .filter(Boolean);

await fs.mkdir(outDir, { recursive: true });

// ─── 1. Parse items dos arquivos .ts ────────────────────────────
const itemFiles = (await fs.readdir(itemsDir)).filter(
  (f) => f.endsWith(".ts") && f !== "index.ts",
);

const items = [];
for (const f of itemFiles) {
  const content = await fs.readFile(path.join(itemsDir, f), "utf8");
  // slug: "x-y",\n  name: "Display"
  const re = /slug:\s*"([^"]+)",\s*\n\s*name:\s*"([^"]+)"/g;
  let m;
  while ((m = re.exec(content))) {
    items.push({ slug: m[1], name: m[2], file: f });
  }
}
console.log(`>> ${items.length} itens parseados de ${itemFiles.length} arquivos.`);

// ─── 2. Helpers ────────────────────────────────────────────────
async function existingImage(slug) {
  for (const ext of ["png", "jpg", "jpeg", "webp", "gif"]) {
    try {
      await fs.access(path.join(outDir, `${slug}.${ext}`));
      return ext;
    } catch {}
  }
  return null;
}

async function api(params) {
  const u = new URL(WIKI_API);
  for (const [k, v] of Object.entries(params)) u.searchParams.set(k, v);
  u.searchParams.set("format", "json");
  u.searchParams.set("origin", "*");
  const res = await fetch(u, { headers: { "user-agent": UA } });
  if (!res.ok) throw new Error(`api ${res.status}`);
  return res.json();
}

async function searchWiki(q) {
  const j = await api({ action: "query", list: "search", srsearch: q, srlimit: "3" });
  return j.query?.search ?? [];
}

async function pageImage(title) {
  const j = await api({
    action: "query",
    prop: "pageimages",
    pithumbsize: "512",
    piprop: "thumbnail|name|original",
    titles: title,
  });
  const page = Object.values(j.query?.pages ?? {})[0];
  return page?.original?.source ?? page?.thumbnail?.source ?? null;
}

async function ogImage(title) {
  const url = WIKI_BASE + encodeURIComponent(title.replace(/ /g, "_"));
  const res = await fetch(url, { headers: { "user-agent": UA } });
  if (!res.ok) return null;
  const html = await res.text();
  const m = html.match(
    /<meta[^>]+property=["']og:image["'][^>]+content=["']([^"']+)["']/i,
  );
  return m?.[1] ?? null;
}

function genQueries(name) {
  // Variações tentadas em ordem
  const base = name
    .replace(/\([^)]*\)/g, "") // remove parênteses
    .replace(/[×x]/g, "x")
    .trim();
  const tries = new Set([
    base,
    `${base} DayZ`,
    base.replace(/\s+/g, "_"),
    base.replace(/-/g, " "),
    base.replace(/\.\d+/g, ""), // tira "9.0" etc
  ]);
  return [...tries];
}

async function downloadImage(url, slug) {
  const res = await fetch(url, { headers: { "user-agent": UA } });
  if (!res.ok) throw new Error(`fetch image ${res.status}`);
  const buf = Buffer.from(await res.arrayBuffer());
  if (buf.length < MIN_IMG_BYTES) throw new Error(`tiny ${buf.length}b`);
  // Detecta ext do Content-Type ou URL
  const ct = res.headers.get("content-type") ?? "";
  const ext = ct.includes("png")
    ? "png"
    : ct.includes("webp")
    ? "webp"
    : ct.includes("gif")
    ? "gif"
    : ct.includes("jpeg") || ct.includes("jpg")
    ? "jpg"
    : (url.match(/\.(png|jpe?g|webp|gif)/i)?.[1].toLowerCase() ?? "png");
  const out = path.join(outDir, `${slug}.${ext === "jpeg" ? "jpg" : ext}`);
  await fs.writeFile(out, buf);
  return { ext, bytes: buf.length };
}

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

// ─── 3. Loop principal ──────────────────────────────────────────
let ok = 0;
let skip = 0;
let fail = 0;
const failures = [];

const filtered = ONLY.length > 0 ? items.filter((i) => ONLY.includes(i.slug)) : items;

console.log(`>> Processando ${filtered.length} itens. Delay: ${POLITE_DELAY_MS}ms.\n`);

for (let i = 0; i < filtered.length; i++) {
  const it = filtered[i];
  const prefix = `[${(i + 1).toString().padStart(3)}/${filtered.length}] ${it.slug.padEnd(28)}`;

  if (!FORCE) {
    const ext = await existingImage(it.slug);
    if (ext) {
      console.log(`${prefix} ${"SKIP".padEnd(6)} já tem .${ext}`);
      skip++;
      continue;
    }
  }

  try {
    let imageUrl = null;
    let matchedTitle = null;

    for (const q of genQueries(it.name)) {
      const hits = await searchWiki(q);
      if (hits.length === 0) {
        await sleep(POLITE_DELAY_MS);
        continue;
      }
      // Prefere match exato por título (normalizado), depois prefixo, depois top-1
      const norm = (s) => s.toLowerCase().replace(/[^a-z0-9]+/g, "");
      const want = norm(it.name);
      const exact = hits.find((h) => norm(h.title) === want);
      const prefix = hits.find((h) => norm(h.title).startsWith(want));
      const title = (exact ?? prefix ?? hits[0]).title;
      matchedTitle = title;
      imageUrl = await pageImage(title);
      if (!imageUrl) {
        await sleep(POLITE_DELAY_MS);
        imageUrl = await ogImage(title);
      }
      if (imageUrl) break;
      await sleep(POLITE_DELAY_MS);
    }

    if (!imageUrl) {
      console.log(`${prefix} ${"MISS".padEnd(6)} sem imagem`);
      fail++;
      failures.push({ slug: it.slug, name: it.name, reason: "no image" });
      await sleep(POLITE_DELAY_MS);
      continue;
    }

    const r = await downloadImage(imageUrl, it.slug);
    console.log(
      `${prefix} ${"OK".padEnd(6)} ${matchedTitle ?? "?"} → .${r.ext} (${r.bytes}b)`,
    );
    ok++;
  } catch (e) {
    console.log(`${prefix} ${"ERR".padEnd(6)} ${e.message}`);
    fail++;
    failures.push({ slug: it.slug, name: it.name, reason: e.message });
  }

  await sleep(POLITE_DELAY_MS);
}

// ─── 4. Resumo ──────────────────────────────────────────────────
console.log("");
console.log(`>> Resultado:`);
console.log(`   OK:   ${ok}`);
console.log(`   SKIP: ${skip}`);
console.log(`   FAIL: ${fail}`);

if (failures.length > 0) {
  const failPath = path.join(root, "public", "items", "_failures.json");
  await fs.writeFile(failPath, JSON.stringify(failures, null, 2));
  console.log(`   Failures gravadas em ${failPath}`);
  console.log(`   Para esses, adicione PNG manualmente em /public/items/<slug>.png`);
}

console.log(`\n>> Próximo passo: rode 'npm run build' para regenerar manifest e testar.`);
