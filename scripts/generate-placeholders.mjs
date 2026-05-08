#!/usr/bin/env node
/**
 * Gera SVG placeholder pra itens sem imagem real. Mantém consistência
 * visual e cobertura 100% — assim sempre tem algo no card do item.
 *
 * Roda APÓS scraper. Detecta slugs sem .png/.jpg/.webp/.gif/.svg em
 * /public/items/ e cria <slug>.svg estilizado.
 *
 * Estilo: militar tactical card com nome, categoria e ícone Flaticon
 * referenciado por <use> (ou texto fallback).
 *
 * Uso:
 *   node scripts/generate-placeholders.mjs            # tudo faltante
 *   node scripts/generate-placeholders.mjs --force    # regenera todos placeholders
 *   node scripts/generate-placeholders.mjs --only=foo,bar
 */

import { promises as fs } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");
const itemsDir = path.join(root, "src", "data", "items");
const outDir = path.join(root, "public", "items");

const args = process.argv.slice(2);
const FORCE = args.includes("--force");
const ONLY = (args.find((a) => a.startsWith("--only="))?.slice(7) ?? "")
  .split(",")
  .filter(Boolean);

await fs.mkdir(outDir, { recursive: true });

// ─── Carrega slug + name + category + icon ──────────────────────
const itemFiles = (await fs.readdir(itemsDir)).filter(
  (f) => f.endsWith(".ts") && f !== "index.ts",
);
const items = [];
for (const f of itemFiles) {
  const content = await fs.readFile(path.join(itemsDir, f), "utf8");
  // Match block-level: slug, name, category, icon (em qualquer ordem nos próximos 200 chars)
  const re = /\{\s*slug:\s*"([^"]+)"[^}]*?name:\s*"([^"]+)"[^}]*?category:\s*"([^"]+)"[^}]*?icon:\s*"([^"]+)"/gs;
  let m;
  while ((m = re.exec(content))) {
    items.push({ slug: m[1], name: m[2], category: m[3], icon: m[4] });
  }
}
const seen = new Set();
const unique = items.filter((i) => {
  if (seen.has(i.slug)) return false;
  seen.add(i.slug);
  return true;
});
console.log(`>> ${unique.length} itens parseados.`);

// ─── Helpers ────────────────────────────────────────────────────
async function hasImage(slug) {
  for (const ext of ["png", "jpg", "jpeg", "webp", "gif"]) {
    try {
      await fs.access(path.join(outDir, `${slug}.${ext}`));
      return ext;
    } catch {}
  }
  return null;
}

const CATEGORY_COLOR = {
  weapon: { fg: "#9aaa66", bg: "#1a1f17" },
  melee: { fg: "#b6a26a", bg: "#1a1d17" },
  ammo: { fg: "#c89c4e", bg: "#1c1812" },
  magazine: { fg: "#c89c4e", bg: "#1c1812" },
  attachment: { fg: "#9aaa66", bg: "#1a1f17" },
  food: { fg: "#9aaa66", bg: "#161a14" },
  drink: { fg: "#6e7a4a", bg: "#0f1316" },
  medical: { fg: "#c8412e", bg: "#1d1413" },
  tool: { fg: "#b6a26a", bg: "#1a1f17" },
  clothing: { fg: "#9aaa66", bg: "#161a14" },
  container: { fg: "#9a5b2c", bg: "#1a1612" },
  component: { fg: "#8a8675", bg: "#161714" },
  consumable: { fg: "#d8e84a", bg: "#1a1c14" },
  building: { fg: "#b6a26a", bg: "#1a1f17" },
};

function svgEscape(s) {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

function makeSvg({ slug, name, category, icon }) {
  const c = CATEGORY_COLOR[category] ?? CATEGORY_COLOR.component;
  // Quebra nome em até 2 linhas se for muito longo
  const nameClean = name.replace(/\(.*?\)/g, "").trim();
  let line1 = nameClean;
  let line2 = "";
  if (nameClean.length > 14) {
    const words = nameClean.split(/\s+/);
    let acc = "";
    let i = 0;
    while (i < words.length && (acc + " " + words[i]).trim().length <= 16) {
      acc = (acc + " " + words[i]).trim();
      i++;
    }
    line1 = acc;
    line2 = words.slice(i).join(" ");
  }
  const truncate = (s, n) => (s.length > n ? s.slice(0, n - 1) + "…" : s);
  line1 = truncate(line1, 18);
  line2 = truncate(line2, 18);
  const catLabel = category.toUpperCase();

  // Símbolo SVG simples por categoria (sem dependência de Flaticon font)
  const SHAPE = {
    weapon: '<rect x="78" y="120" width="100" height="16" fill="currentColor"/><rect x="120" y="100" width="14" height="20" fill="currentColor"/>',
    melee: '<polygon points="128,80 138,128 128,170 118,128" fill="currentColor"/>',
    ammo: '<rect x="118" y="100" width="20" height="56" rx="4" fill="currentColor"/>',
    magazine: '<rect x="100" y="100" width="56" height="60" fill="currentColor"/><rect x="106" y="106" width="44" height="6" fill="#07080a"/>',
    attachment: '<circle cx="128" cy="128" r="36" fill="none" stroke="currentColor" stroke-width="6"/><circle cx="128" cy="128" r="4" fill="currentColor"/>',
    food: '<circle cx="128" cy="128" r="40" fill="currentColor"/>',
    drink: '<rect x="108" y="90" width="40" height="80" rx="6" fill="currentColor"/>',
    medical: '<rect x="108" y="118" width="40" height="20" fill="currentColor"/><rect x="118" y="108" width="20" height="40" fill="currentColor"/>',
    tool: '<polygon points="100,160 130,90 145,95 115,165" fill="currentColor"/>',
    clothing: '<path d="M100,100 L156,100 L160,170 L96,170 Z" fill="currentColor"/>',
    container: '<path d="M90,110 L166,110 L160,170 L96,170 Z M105,110 Q105,90 128,90 Q151,90 151,110" fill="none" stroke="currentColor" stroke-width="5"/>',
    component: '<rect x="100" y="100" width="56" height="56" fill="none" stroke="currentColor" stroke-width="5"/>',
    consumable: '<polygon points="118,90 138,90 130,128 145,128 122,170 130,134 115,134" fill="currentColor"/>',
    building: '<path d="M100,160 L100,120 L128,100 L156,120 L156,160 Z" fill="none" stroke="currentColor" stroke-width="5"/>',
  };
  const shape = SHAPE[category] ?? SHAPE.component;

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" width="256" height="256">
  <defs>
    <pattern id="g-${slug}" x="0" y="0" width="16" height="16" patternUnits="userSpaceOnUse">
      <path d="M 16 0 L 0 0 0 16" fill="none" stroke="${c.fg}22" stroke-width="0.5"/>
    </pattern>
  </defs>
  <rect width="256" height="256" fill="${c.bg}"/>
  <rect width="256" height="256" fill="url(#g-${slug})"/>
  <rect x="0" y="0" width="256" height="32" fill="${c.fg}18"/>
  <text x="12" y="20" font-family="JetBrains Mono, monospace" font-size="11" fill="${c.fg}" letter-spacing="1.5">${svgEscape(catLabel)}</text>
  <text x="244" y="20" font-family="JetBrains Mono, monospace" font-size="9" fill="${c.fg}80" text-anchor="end">N/A</text>
  <g color="${c.fg}80" transform="translate(0, -10)">${shape}</g>
  <line x1="40" y1="190" x2="216" y2="190" stroke="${c.fg}40" stroke-width="1"/>
  <text x="128" y="212" font-family="Black Ops One, sans-serif" font-size="14" fill="${c.fg}" text-anchor="middle" letter-spacing="2">${svgEscape(line1.toUpperCase())}</text>
  ${line2 ? `<text x="128" y="232" font-family="Black Ops One, sans-serif" font-size="12" fill="${c.fg}cc" text-anchor="middle" letter-spacing="1.5">${svgEscape(line2.toUpperCase())}</text>` : ""}
</svg>`;
}

// ─── Loop ──────────────────────────────────────────────────────
let gen = 0, skip = 0;
const filtered = ONLY.length > 0 ? unique.filter((i) => ONLY.includes(i.slug)) : unique;

for (const it of filtered) {
  if (!FORCE) {
    const ext = await hasImage(it.slug);
    if (ext) {
      skip++;
      continue;
    }
  }
  const svg = makeSvg(it);
  await fs.writeFile(path.join(outDir, `${it.slug}.svg`), svg);
  gen++;
}

console.log(`>> Placeholders gerados: ${gen}`);
console.log(`>> Já tinham imagem: ${skip}`);
console.log(`>> Total cobertura: ${gen + skip} / ${filtered.length} (${Math.round(((gen + skip) / filtered.length) * 100)}%)`);
console.log(`\n>> Rode 'npm run manifest' pra incluir no manifest e 'npm run build'.`);
