import type { Recipe } from "./types";

/**
 * Receitas vanilla mais usadas. Cada recipe carrega ferramentas (não consumidas)
 * e inputs (consumidos). Categorias agrupam pra UI.
 */
export const RECIPES: Recipe[] = [
  // ─── Fogo / Survival inicial ─────────────────────────
  {
    slug: "craft-rope",
    output: { itemSlug: "rope", qty: 1 },
    inputs: [{ itemSlug: "rags", qty: 6 }],
    method: "Combine 6 rags no inventário → ação 'Make Rope'",
    durationS: 5,
    category: "tool",
    notes: "Sem ferramenta — só ação rápida no inventário.",
  },
  {
    slug: "rip-clothing-into-rags",
    output: { itemSlug: "rags", qty: 6 },
    inputs: [],
    tools: ["kitchen-knife"],
    method:
      "Use Knife em peça de roupa → 'Tear into Rags' (varia 4-6 por peça).",
    durationS: 10,
    category: "clothing",
    notes: "Camiseta = 6 rags; calça = 8.",
  },
  {
    slug: "craft-splint",
    output: { itemSlug: "splint", qty: 1 },
    inputs: [
      { itemSlug: "wooden-stick", qty: 2 },
      { itemSlug: "rags", qty: 1 },
    ],
    method: "Combine 2 sticks + 1 rag → ação 'Craft Splint'",
    durationS: 5,
    category: "medical",
  },
  {
    slug: "craft-improvised-backpack",
    output: { itemSlug: "improvised-backpack", qty: 1 },
    inputs: [
      { itemSlug: "rabbit-pelt", qty: 1 },
      { itemSlug: "long-stick", qty: 2 },
      { itemSlug: "rope", qty: 1 },
    ],
    method:
      "Combine pelt + 2 long sticks + rope. Pode usar pele de cervo/vaca também.",
    durationS: 8,
    category: "clothing",
    notes: "Substitua rabbit-pelt por deer/cow pelt — slots resultantes podem variar.",
  },
  {
    slug: "craft-fence-kit",
    output: { itemSlug: "wooden-fence-kit", qty: 1 },
    inputs: [
      { itemSlug: "plank", qty: 4 },
      { itemSlug: "nails", qty: 1 },
      { itemSlug: "rope", qty: 1 },
    ],
    tools: ["hammer"],
    method:
      "Combine no inventário → coloque o kit no terreno → use planks adicionais para erguer estágios.",
    durationS: 10,
    category: "base",
  },
  {
    slug: "craft-watchtower-kit",
    output: { itemSlug: "watchtower-kit", qty: 1 },
    inputs: [
      { itemSlug: "plank", qty: 6 },
      { itemSlug: "nails", qty: 2 },
      { itemSlug: "rope", qty: 2 },
    ],
    tools: ["hammer"],
    method: "Plant kit, então construa em estágios (3 níveis).",
    durationS: 15,
    category: "base",
  },
  {
    slug: "saw-log",
    output: { itemSlug: "plank", qty: 4 },
    inputs: [{ itemSlug: "tree-log", qty: 1 }],
    tools: ["saw"],
    method: "Use Saw em tree log → 4 planks.",
    durationS: 40,
    category: "base",
  },
  {
    slug: "fell-tree",
    output: { itemSlug: "tree-log", qty: 1 },
    inputs: [],
    tools: ["hatchet", "fire-axe"],
    method: "Use machado em árvore grande → 'Chop Tree'. ~40s por log.",
    durationS: 40,
    category: "base",
  },
  {
    slug: "craft-bow",
    output: { itemSlug: "improvised-bow", qty: 1 },
    inputs: [
      { itemSlug: "long-stick", qty: 1 },
      { itemSlug: "rope", qty: 1 },
    ],
    method: "Combine 1 long stick + 1 rope.",
    durationS: 5,
    category: "weapon",
  },
  {
    slug: "craft-arrow",
    output: { itemSlug: "arrow", qty: 1 },
    inputs: [
      { itemSlug: "long-stick", qty: 1 },
      { itemSlug: "feather", qty: 1 },
    ],
    tools: ["kitchen-knife"],
    method: "Combine long stick + feather + use knife.",
    durationS: 8,
    category: "ammo",
    notes: "Sem feather, use improvised-arrow.",
  },
  {
    slug: "craft-improvised-spear",
    output: { itemSlug: "long-stick-bayonet", qty: 1 },
    inputs: [{ itemSlug: "long-stick", qty: 1 }],
    tools: ["kitchen-knife"],
    method: "Combine long stick + faca/baioneta.",
    durationS: 5,
    category: "weapon",
  },
  {
    slug: "campfire-build",
    output: { itemSlug: "campfire", qty: 1 },
    inputs: [
      { itemSlug: "wooden-stick", qty: 4 },
      { itemSlug: "rags", qty: 1 },
    ],
    method:
      "Coloque 4 sticks no chão + 1 rag (kindling) → use lighter ou matches.",
    durationS: 10,
    category: "fire",
  },
  {
    slug: "cook-steak",
    output: { itemSlug: "cooked-steak", qty: 1 },
    inputs: [{ itemSlug: "raw-steak", qty: 1 }],
    tools: ["long-stick", "campfire"],
    method:
      "Espete carne em long stick → coloque sobre campfire ou use cooking pot.",
    durationS: 60,
    category: "food",
  },
  {
    slug: "craft-barbed-wire",
    output: { itemSlug: "barbed-wire", qty: 1 },
    inputs: [{ itemSlug: "metal-wire", qty: 2 }],
    tools: ["pliers"],
    method: "Combine 2 metal wire com pliers.",
    durationS: 8,
    category: "base",
  },
  {
    slug: "purify-water",
    output: { itemSlug: "canteen", qty: 1 },
    inputs: [
      { itemSlug: "canteen", qty: 1 },
      { itemSlug: "water-purification-tablets", qty: 1 },
    ],
    method:
      "Coloque tablet dentro do canteen com água crua → aguarde 5 min.",
    durationS: 300,
    category: "food",
    notes: "Alternativa: ferver em cooking pot por 1min.",
  },
];

export const RECIPES_BY_SLUG: Record<string, Recipe> = Object.fromEntries(
  RECIPES.map((r) => [r.slug, r]),
);

/**
 * Cross-link reverso: para cada item do catálogo, retorna recipes que o
 * usam como input ou produzem como output. Auto-calculado.
 */
export function buildRecipeIndex() {
  const usedIn: Record<string, string[]> = {};
  const producedBy: Record<string, string[]> = {};
  for (const r of RECIPES) {
    for (const inp of r.inputs) {
      (usedIn[inp.itemSlug] ??= []).push(r.slug);
    }
    (producedBy[r.output.itemSlug] ??= []).push(r.slug);
  }
  return { usedIn, producedBy };
}
