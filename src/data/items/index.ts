import type { Item } from "../types";
import { WEAPONS } from "./weapons";
import { AMMO } from "./ammo";
import { MAGAZINES, ATTACHMENTS } from "./magazines";
import { FOOD_DRINK } from "./food";
import { MEDICAL } from "./medical";
import { TOOLS } from "./tools";
import { CLOTHING } from "./clothing";
import { COMPONENTS, FUEL_BATTERIES } from "./components";
import { MELEE } from "./melee";
import { VEHICLES, VEHICLE_PARTS } from "./vehicles";
import { EXPLOSIVES, ANIMALS } from "./explosives";
import { SAKHAL } from "./sakhal";
import { EXPANSION_BASE } from "./expansion-base";
import { EXP_WEAPONS, EXP_MELEE, EXP_BACKPACKS } from "./expansion-weapons";
import { EXP_MEDICAL, EXP_FOOD, EXP_TOOLS } from "./expansion-misc";
import { AUTO_WIKI_ITEMS } from "./_auto-wiki";

/**
 * Catálogo completo. Itens manualmente curados (com relações cruzadas, fotos
 * e descrições ricas) **têm prioridade**. Itens auto-extraídos da Wiki entram
 * apenas como complemento — preenchem gaps e dão cobertura ampla.
 *
 * Merge resolution: por slug, primeiro ganha. Como CURATED vem antes em
 * `ALL_ITEMS_BY_PRIORITY`, ele vence em conflito.
 *
 * Index helpers:
 *  - `ITEMS` — lista final (curated + auto, dedup por slug)
 *  - `ITEMS_BY_SLUG` — lookup O(1)
 *  - `getItem(slug)` — undefined se não existir
 *  - `getItemOrThrow(slug)` — crash em ref quebrada
 */

const CURATED: Item[] = [
  ...WEAPONS,
  ...EXP_WEAPONS,
  ...MELEE,
  ...EXP_MELEE,
  ...AMMO,
  ...MAGAZINES,
  ...ATTACHMENTS,
  ...FOOD_DRINK,
  ...EXP_FOOD,
  ...ANIMALS,
  ...MEDICAL,
  ...EXP_MEDICAL,
  ...TOOLS,
  ...EXP_TOOLS,
  ...CLOTHING,
  ...EXP_BACKPACKS,
  ...COMPONENTS,
  ...FUEL_BATTERIES,
  ...VEHICLES,
  ...VEHICLE_PARTS,
  ...EXPLOSIVES,
  ...SAKHAL,
  ...EXPANSION_BASE,
];

const _seen = new Set<string>();
const _merged: Item[] = [];
for (const it of [...CURATED, ...AUTO_WIKI_ITEMS]) {
  if (_seen.has(it.slug)) continue;
  _seen.add(it.slug);
  _merged.push(it);
}
export const ITEMS: Item[] = _merged;

export const ITEMS_BY_SLUG: Record<string, Item> = Object.fromEntries(
  ITEMS.map((i) => [i.slug, i]),
);

export function getItem(slug: string): Item | undefined {
  return ITEMS_BY_SLUG[slug];
}

export function getItemOrThrow(slug: string): Item {
  const it = ITEMS_BY_SLUG[slug];
  if (!it) {
    throw new Error(`[dayz-codex] Item slug não encontrado: ${slug}`);
  }
  return it;
}

/**
 * Categorias para roteamento e filtros.
 * A ordem aqui é a ordem de exibição no catálogo.
 */
export const CATEGORY_META: Array<{
  key: import("../types").ItemCategory;
  label: string;
  icon: string;
  intro: string;
}> = [
  {
    key: "weapon",
    label: "Armas de Fogo",
    icon: "bullet",
    intro:
      "Rifles, pistolas e carabinas — calibres, capacidade e attachments compatíveis.",
  },
  {
    key: "melee",
    label: "Corpo a Corpo",
    icon: "axe",
    intro: "Lâminas, contundentes e improvisados — uso em PvE silencioso.",
  },
  {
    key: "ammo",
    label: "Munição",
    icon: "shield",
    intro:
      "Cartuchos por calibre. Consulte qual arma usa antes de carregar mochila.",
  },
  {
    key: "magazine",
    label: "Carregadores",
    icon: "boxes",
    intro: "Capacidade e compatibilidade de carregadores.",
  },
  {
    key: "attachment",
    label: "Attachments",
    icon: "settings",
    intro: "Óticas, supressores, lanternas e handguards.",
  },
  {
    key: "food",
    label: "Alimentos",
    icon: "apple-whole",
    intro: "Calorias, hidratação e como abrir cada item sem desperdício.",
  },
  {
    key: "drink",
    label: "Bebidas",
    icon: "bottle",
    intro: "Hidratação e recipientes recarregáveis.",
  },
  {
    key: "medical",
    label: "Medical",
    icon: "band-aid",
    intro: "Kit de primeiros socorros, cirúrgicos e farmacológicos.",
  },
  {
    key: "tool",
    label: "Ferramentas",
    icon: "tools",
    intro: "Multifuncionais — corte, reparo, fogo, navegação, cozinha.",
  },
  {
    key: "clothing",
    label: "Vestuário",
    icon: "vest",
    intro: "Coletes balísticos, capacetes, calças e botas — slots e proteção.",
  },
  {
    key: "container",
    label: "Mochilas",
    icon: "backpack",
    intro: "Capacidade de carga — escolha pelo seu loadout.",
  },
  {
    key: "component",
    label: "Componentes",
    icon: "drumstick",
    intro: "Matéria-prima de craft — corda, plank, prego, log.",
  },
  {
    key: "consumable",
    label: "Consumíveis",
    icon: "battery-full",
    intro: "Combustíveis, baterias e fluidos.",
  },
  {
    key: "building",
    label: "Construção",
    icon: "tools",
    intro: "Peças de base building — referenciadas em /base-building.",
  },
];
