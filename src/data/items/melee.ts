import type { Item } from "../types";

export const MELEE: Item[] = [
  {
    slug: "fists",
    name: "Punhos",
    category: "melee",
    icon: "hand-fist",
    rarity: "common",
    loot: [],
    summary: "Sempre disponível — dano mínimo, não consome durabilidade.",
    description:
      "Hipotermia em fresh-spawn? Lutar com mãos é último recurso. Concussão em hits sucessivos.",
    stats: { damage: 8 },
    tags: ["spawn"],
  },
  {
    slug: "long-stick-bayonet",
    name: "Lança Improvisada",
    category: "melee",
    icon: "drumstick",
    rarity: "common",
    loot: [],
    summary:
      "Long stick + bayonet ou knife — alcance estendido, mata infectado em 1-2 hits.",
    description: "Crafte rápido em PvE inicial.",
    stats: { slots: { w: 1, h: 4 }, weightG: 500, damage: 35 },
    relations: {
      producedByRecipes: [{ to: "craft-improvised-spear" }],
    },
    tags: ["craft", "lanca"],
  },
  {
    slug: "sks-bayonet",
    name: "SKS Bayonet",
    category: "attachment",
    icon: "knife",
    rarity: "common",
    loot: ["village"],
    summary: "Baioneta dobrável da SKS — corpo a corpo de emergência.",
    description:
      "Já vem montada na SKS — alterne via teclado pra modo melee.",
    stats: { slots: { w: 1, h: 1 }, weightG: 250, damage: 25 },
    relations: { compatibleWith: [{ to: "sks" }] },
    tags: ["baioneta"],
  },
  {
    slug: "crowbar",
    name: "Pé de Cabra",
    category: "melee",
    icon: "tools",
    rarity: "common",
    loot: ["industrial"],
    summary: "Arma branca pesada + abre certas portas/caixas.",
    description: "Dano alto em melee. Útil pra abrir portas trancadas casuais.",
    stats: { slots: { w: 2, h: 4 }, weightG: 2000, damage: 50 },
    tags: ["arma-branca", "industrial"],
  },
  {
    slug: "baseball-bat",
    name: "Taco de Beisebol",
    category: "melee",
    icon: "drumstick",
    rarity: "common",
    loot: ["village"],
    summary: "Clássico — dano médio, durabilidade alta.",
    description:
      "Versão Nailed (com prego) aumenta dano e causa sangramento.",
    stats: { slots: { w: 1, h: 4 }, weightG: 1100, damage: 35 },
    tags: ["arma-branca"],
  },
];
