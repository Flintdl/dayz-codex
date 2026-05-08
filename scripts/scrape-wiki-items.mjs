#!/usr/bin/env node
/**
 * Scraper de itens vanilla DayZ via DayZ Fandom Wiki.
 *
 * Pega TODAS as páginas das categorias de itens, parseia o infobox
 * (template {{Infobox ...}}), extrai campos estruturados e gera um
 * arquivo TypeScript com a coleção completa.
 *
 * Items manualmente curados em src/data/items/* têm prioridade — o
 * arquivo gerado tem prefixo `_auto-` e é mergeado por slug em
 * `index.ts` (curado vence em conflito).
 *
 * Uso:
 *   node scripts/scrape-wiki-items.mjs
 *   node scripts/scrape-wiki-items.mjs --only=Weapons,Tools  # subset
 */

import { promises as fs } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");
const outFile = path.join(root, "src", "data", "items", "_auto-wiki.ts");

const WIKI_API = "https://dayz.fandom.com/api.php";
const UA = "DayZ-Codex-Local-Guide/0.2 (personal use)";
const POLITE_DELAY_MS = 250;

const args = process.argv.slice(2);
const ONLY = (args.find((a) => a.startsWith("--only="))?.slice(7) ?? "")
  .split(",")
  .filter(Boolean);

// Categorias que valem extrair, mapeadas pra nossa Category enum.
const CATEGORIES = [
  { wiki: "Weapons", our: "weapon" },
  { wiki: "Pistols", our: "weapon" },
  { wiki: "Rifles", our: "weapon" },
  { wiki: "Shotguns", our: "weapon" },
  { wiki: "Snipers", our: "weapon" },
  { wiki: "Firearms", our: "weapon" },
  { wiki: "Melee_Weapons", our: "melee" },
  { wiki: "Ammunition", our: "ammo" },
  { wiki: "Magazines", our: "magazine" },
  { wiki: "Attachments", our: "attachment" },
  { wiki: "Tools", our: "tool" },
  { wiki: "Equipment", our: "tool" },
  { wiki: "Food", our: "food" },
  { wiki: "Cooking", our: "food" },
  { wiki: "Drink", our: "drink" },
  { wiki: "Medical_Supplies", our: "medical" },
  { wiki: "Medical", our: "medical" },
  { wiki: "Clothing", our: "clothing" },
  { wiki: "Pants", our: "clothing" },
  { wiki: "Shirts", our: "clothing" },
  { wiki: "Vests", our: "clothing" },
  { wiki: "Headgear", our: "clothing" },
  { wiki: "Footwear", our: "clothing" },
  { wiki: "Gloves", our: "clothing" },
  { wiki: "Backpacks", our: "container" },
  { wiki: "Containers", our: "container" },
  { wiki: "Vehicles", our: "consumable" },
  { wiki: "Vehicle_Parts", our: "consumable" },
  { wiki: "Animals", our: "food" },
  { wiki: "Plants", our: "component" },
];

const filtered = ONLY.length > 0
  ? CATEGORIES.filter((c) => ONLY.includes(c.wiki))
  : CATEGORIES;

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

async function listCategoryMembers(catTitle) {
  const all = [];
  let cont = "";
  do {
    const params = {
      action: "query",
      list: "categorymembers",
      cmtitle: `Category:${catTitle}`,
      cmlimit: "500",
      cmtype: "page",
    };
    if (cont) params.cmcontinue = cont;
    const j = await api(params);
    all.push(...(j.query?.categorymembers ?? []));
    cont = j.continue?.cmcontinue ?? "";
  } while (cont);
  return all;
}

async function pageWikitext(title) {
  const j = await api({
    action: "query",
    titles: title,
    prop: "revisions",
    rvslots: "main",
    rvprop: "content",
  });
  const page = Object.values(j.query?.pages ?? {})[0];
  return page?.revisions?.[0]?.slots?.main?.["*"] ?? null;
}

// ─── Parsers ─────────────────────────────────────────────────────

function slugify(s) {
  return s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
    .slice(0, 60);
}

/**
 * Extrai infobox principal do wikitext e devolve mapa de campo→valor.
 *
 * Wiki DayZ usa `{{InfoboxWeapon`, `{{InfoboxItem`, `{{InfoboxFood`, etc.
 * (sem espaço, CamelCase). Suportamos qualquer prefixo "Infobox".
 */
function parseInfobox(wikitext) {
  if (!wikitext) return null;
  // Strip comentários HTML (também `<!--- --->` tripla-traço usada na Wiki DayZ)
  const clean = wikitext.replace(/<!--+[\s\S]*?-+->/g, "");
  // DayZ Wiki tem 2 padrões: `{{InfoboxWeapon` (Infobox no início) e
  // `{{MeleeInfobox` / `{{FoodInfobox` (Infobox no fim). Aceita ambos.
  const start = clean.search(/\{\{\s*[A-Za-z_]*[Ii]nfobox/);
  if (start < 0) return null;
  let depth = 0;
  let end = -1;
  for (let i = start; i < clean.length - 1; i++) {
    if (clean[i] === "{" && clean[i + 1] === "{") {
      depth++;
      i++;
    } else if (clean[i] === "}" && clean[i + 1] === "}") {
      depth--;
      i++;
      if (depth === 0) {
        end = i + 1;
        break;
      }
    }
  }
  if (end < 0) return null;
  const body = clean.slice(start + 2, end - 2); // sem {{ e }}
  const fields = {};
  // Split por '|' top-level (depth de [[...]] e {{...}})
  let bracket = 0;
  let brace = 0;
  let chunks = [""];
  for (let i = 0; i < body.length; i++) {
    const ch = body[i];
    const nxt = body[i + 1];
    if (ch === "[" && nxt === "[") {
      bracket++;
      chunks[chunks.length - 1] += ch;
      continue;
    }
    if (ch === "]" && nxt === "]") {
      bracket = Math.max(0, bracket - 1);
      chunks[chunks.length - 1] += ch;
      continue;
    }
    if (ch === "{" && nxt === "{") {
      brace++;
      chunks[chunks.length - 1] += ch;
      continue;
    }
    if (ch === "}" && nxt === "}") {
      brace = Math.max(0, brace - 1);
      chunks[chunks.length - 1] += ch;
      continue;
    }
    if (ch === "|" && bracket === 0 && brace === 0) {
      chunks.push("");
    } else {
      chunks[chunks.length - 1] += ch;
    }
  }
  // chunks[0] é o nome do template (e.g. "InfoboxWeapon\n"); descarta
  for (const c of chunks.slice(1)) {
    const eq = c.indexOf("=");
    if (eq < 0) continue;
    const k = c.slice(0, eq).trim().toLowerCase().replace(/\s+/g, "");
    const v = c.slice(eq + 1).trim();
    if (k && v) fields[k] = v;
  }
  return fields;
}

function stripWiki(s) {
  if (!s) return "";
  return s
    .replace(/\[\[[^|\]]+\|([^\]]+)\]\]/g, "$1") // [[Page|alias]] → alias
    .replace(/\[\[([^\]]+)\]\]/g, "$1") // [[Page]] → Page
    .replace(/'''([^']+)'''/g, "$1") // bold
    .replace(/''([^']+)''/g, "$1") // italic
    .replace(/<[^>]+>/g, "") // tags
    .replace(/\{\{[^}]+\}\}/g, "") // sub-templates
    .replace(/\s+/g, " ")
    .trim();
}

function parseSlots(s) {
  if (!s) return null;
  const m = stripWiki(s).match(/(\d+)\s*[×xX]\s*(\d+)/);
  if (m) return { w: parseInt(m[1], 10), h: parseInt(m[2], 10) };
  return null;
}

function parseWeight(s) {
  if (!s) return null;
  const t = stripWiki(s).toLowerCase();
  const kg = t.match(/([\d.]+)\s*kg/);
  if (kg) return Math.round(parseFloat(kg[1]) * 1000);
  const g = t.match(/([\d.]+)\s*g\b/);
  if (g) return Math.round(parseFloat(g[1]));
  // Bare number — DayZ Wiki convenção: gramas (e.g. "2276" pra M4-A1)
  const num = t.match(/^[\d.]+$/);
  if (num) return Math.round(parseFloat(num[0]));
  return null;
}

function parseRarity(s) {
  if (!s) return "common";
  const t = stripWiki(s).toLowerCase();
  if (/legend|epic|extreme/.test(t)) return "legendary";
  if (/very rare/.test(t)) return "very_rare";
  if (/\brare\b/.test(t)) return "rare";
  if (/uncommon/.test(t)) return "uncommon";
  return "common";
}

function parseLoot(s) {
  if (!s) return [];
  const t = stripWiki(s).toLowerCase();
  const tiers = [];
  if (t.includes("military")) tiers.push("military");
  if (/heli|crash/.test(t)) tiers.push("military_high");
  if (t.includes("police")) tiers.push("police");
  if (t.includes("hospital") || t.includes("medical")) tiers.push("medical");
  if (/firefight|fire station/.test(t)) tiers.push("firefighter");
  if (t.includes("hunting")) tiers.push("hunting");
  if (t.includes("farm")) tiers.push("farm");
  if (t.includes("industrial") || t.includes("factory")) tiers.push("industrial");
  if (t.includes("village") || t.includes("residential")) tiers.push("village");
  if (t.includes("town")) tiers.push("town");
  return [...new Set(tiers)];
}

function inferIcon(category, name) {
  const n = name.toLowerCase();
  if (category === "weapon") return /pistol|revolver|magnum|glock|deagle|cr-?75|kolt/.test(n) ? "bullet" : "bullet";
  if (category === "melee") {
    if (/ax|axe|hatchet/.test(n)) return "axe";
    if (/knife|machete|bayonet/.test(n)) return "knife";
    return "tools";
  }
  if (category === "ammo") return "shield";
  if (category === "magazine") return "boxes";
  if (category === "attachment") return /scope|sight|optic/.test(n) ? "search" : "settings";
  if (category === "food") {
    if (/apple|banana|orange|pear|fruit/.test(n)) return "apple-whole";
    if (/fish|tuna|sardine/.test(n)) return "fish";
    if (/meat|steak|chicken|drumstick|pork|beef/.test(n)) return "drumstick-bite";
    if (/mushroom|berry|seed|herb|plant/.test(n)) return "leaf";
    return "bowl-rice";
  }
  if (category === "drink") return "bottle";
  if (category === "medical") {
    if (/syringe|inject|saline|blood/.test(n)) return "first-aid";
    if (/pill|tablet|capsule/.test(n)) return "pills";
    return "band-aid";
  }
  if (category === "tool") {
    if (/saw|axe|hatch/.test(n)) return "axe";
    if (/knife/.test(n)) return "knife";
    if (/hammer|wrench|plier|screwdriver/.test(n)) return "tools";
    if (/bottle|canteen/.test(n)) return "bottle";
    if (/match|lighter|fire/.test(n)) return "campfire";
    if (/binocular|scope/.test(n)) return "search";
    if (/compass/.test(n)) return "cardinal-compass";
    if (/map/.test(n)) return "map";
    return "tools";
  }
  if (category === "clothing") {
    if (/vest|carrier|armor/.test(n)) return "vest";
    if (/hat|helmet|cap|hood|mask/.test(n)) return "helmet-battle";
    if (/boot|shoe/.test(n)) return "boot";
    if (/pants|trouser/.test(n)) return "family-pants";
    if (/glove/.test(n)) return "shield";
    return "vest";
  }
  if (category === "container") return "backpack";
  if (category === "component") return "box";
  if (category === "consumable") return /battery|bulb/.test(n) ? "battery-full" : "shield";
  return "box";
}

function fmt(s) {
  // Prepara string pra TS literal — escapa aspas e quebra linhas
  return s.replace(/\\/g, "\\\\").replace(/"/g, '\\"').replace(/\n/g, " ").trim();
}

// ─── Loop principal ─────────────────────────────────────────────

const seen = new Set();
const items = [];

for (const cat of filtered) {
  console.log(`>> Categoria: ${cat.wiki}`);
  let members = [];
  try {
    members = await listCategoryMembers(cat.wiki);
  } catch (e) {
    console.log(`   ERRO list: ${e.message}`);
    continue;
  }
  console.log(`   ${members.length} páginas`);

  for (const m of members) {
    if (seen.has(m.title)) continue;
    seen.add(m.title);

    // Filtra páginas óbvias não-itens
    if (/^(Category:|File:|Template:|User:|Talk:)/.test(m.title)) continue;
    if (/disambiguation|category|list/i.test(m.title)) continue;

    let wt;
    try {
      wt = await pageWikitext(m.title);
    } catch {
      await sleep(POLITE_DELAY_MS);
      continue;
    }
    const fields = parseInfobox(wt);
    if (!fields) {
      await sleep(POLITE_DELAY_MS);
      continue;
    }

    const name = stripWiki(fields.name ?? m.title);
    const slug = slugify(m.title);
    if (!slug || slug.length < 2) continue;

    // DayZ Wiki usa nomes de campo variados — mapeamos aliases
    const subcategory = stripWiki(
      fields.category ?? fields.type ?? fields.classification ?? fields.subtype ?? "",
    ) || undefined;
    const summary = stripWiki(fields.description ?? fields.summary ?? fields.flavor ?? "")
      .slice(0, 220) || `Item ${name} catalogado da DayZ Wiki.`;
    const description = summary;
    const stats = {};
    const slots = parseSlots(fields.size ?? fields.slots ?? fields.dimensions);
    if (slots) stats.slots = slots;
    const weight = parseWeight(fields.weight);
    if (weight !== null && weight > 0 && weight < 200000) stats.weightG = weight;
    // Capacidade pode vir como "30 rounds" ou "30"
    const capRaw = stripWiki(fields.capacity ?? fields.ammocapacity ?? "");
    const capMatch = capRaw.match(/(\d+)/);
    const cap = capMatch ? parseInt(capMatch[1], 10) : NaN;
    if (Number.isFinite(cap) && cap > 0 && cap < 1000) stats.magCapacity = cap;
    // Damage / dano
    const dmg = parseInt(stripWiki(fields.damage ?? "").replace(/[^\d]/g, ""), 10);
    if (Number.isFinite(dmg) && dmg > 0) stats.damage = dmg;
    // Cadência
    const rpm = parseInt(stripWiki(fields.rateoffire ?? fields.rpm ?? "").replace(/[^\d]/g, ""), 10);
    if (Number.isFinite(rpm) && rpm > 0 && rpm < 5000) stats.rpm = rpm;

    const item = {
      slug,
      name,
      category: cat.our,
      subcategory,
      icon: inferIcon(cat.our, name),
      rarity: parseRarity(fields.rarity ?? fields.spawn ?? ""),
      loot: parseLoot(fields.location ?? fields.spawn ?? fields.locations ?? ""),
      summary,
      description,
      stats: Object.keys(stats).length ? stats : undefined,
    };
    items.push(item);

    if (items.length % 25 === 0) console.log(`   ... ${items.length} itens`);
    await sleep(POLITE_DELAY_MS);
  }
}

console.log(`\n>> Total de itens scrapped: ${items.length}`);

// Sort por slug pra diff estável
items.sort((a, b) => a.slug.localeCompare(b.slug));

// Gera TS
const lines = [
  "// AUTO-GERADO por scripts/scrape-wiki-items.mjs — não edite à mão.",
  "// Itens manualmente curados em outros arquivos têm prioridade no merge.",
  "// Última geração: " + new Date().toISOString(),
  "",
  'import type { Item } from "../types";',
  "",
  "export const AUTO_WIKI_ITEMS: Item[] = [",
];
for (const it of items) {
  lines.push("  {");
  lines.push(`    slug: "${it.slug}",`);
  lines.push(`    name: "${fmt(it.name)}",`);
  lines.push(`    category: "${it.category}",`);
  if (it.subcategory) lines.push(`    subcategory: "${fmt(it.subcategory)}",`);
  lines.push(`    icon: "${it.icon}",`);
  lines.push(`    rarity: "${it.rarity}",`);
  lines.push(`    loot: ${JSON.stringify(it.loot)},`);
  lines.push(`    summary: "${fmt(it.summary)}",`);
  lines.push(`    description: "${fmt(it.description)}",`);
  if (it.stats) {
    lines.push(`    stats: ${JSON.stringify(it.stats)},`);
  }
  lines.push("  },");
}
lines.push("];");
lines.push("");

await fs.writeFile(outFile, lines.join("\n"), "utf8");
console.log(`>> Escrito: ${outFile}`);
console.log(`>> Próximo: rode 'npm run build' e 'npm run fetch:images' nos novos slugs.`);
