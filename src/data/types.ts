/**
 * Tipos canônicos do Codex DayZ.
 *
 * Conceito-chave: todo item carrega `slug` único e listas tipadas de
 * referências cruzadas (`relations`) — outras páginas e componentes
 * navegam por slug, permitindo a "cadeia tipo dataminer" (item X usa
 * item Y → clique → item Y).
 *
 * Stats numéricos são da versão 1.27 do jogo (verificar wiki oficial
 * antes de competitive). Valores marcados como aproximados quando
 * variam por server config.
 */

export type ItemCategory =
  | "weapon" // armas de fogo
  | "melee" // armas brancas
  | "ammo" // munição
  | "magazine" // carregadores
  | "attachment" // miras, lanternas, supressores, grips
  | "food" // alimentos
  | "drink" // bebidas
  | "medical" // remédios e cirúrgicos
  | "tool" // ferramentas
  | "clothing" // vestuário
  | "container" // mochilas, bolsas
  | "component" // matéria-prima de craft (rope, plank…)
  | "building" // peças de base building
  | "consumable"; // outros consumíveis (combustível, baterias)

export type Rarity = "common" | "uncommon" | "rare" | "very_rare" | "legendary";

export type LootTier =
  | "civilian"
  | "village"
  | "town"
  | "industrial"
  | "police"
  | "firefighter"
  | "hunting"
  | "farm"
  | "medical"
  | "military"
  | "military_high"
  | "tier1"
  | "tier2"
  | "tier3"
  | "tier4";

export interface ItemRelation {
  /** Slug do item-alvo */
  to: string;
  /** Texto curto descrevendo a relação no contexto deste item */
  note?: string;
}

export interface ItemStats {
  /** Slots ocupados no inventário (largura x altura) */
  slots?: { w: number; h: number };
  /** Peso em gramas */
  weightG?: number;
  /** Durabilidade máxima em pontos (cosmético/orientativo) */
  durability?: number;
  /** Para armas: dano por projétil em pontos de health */
  damage?: number;
  /** Para armas: distância de zero (m) */
  rangeM?: number;
  /** Para armas: cadência aproximada (RPM) */
  rpm?: number;
  /** Para armas: capacidade nativa (sem mag) ou mag default */
  magCapacity?: number;
  /** Calibres aceitos por arma — slugs de ammo */
  caliber?: string[];
  /** Para comida: calorias absorvidas */
  energyKcal?: number;
  /** Para comida/bebida: hidratação (mL) */
  hydrationMl?: number;
  /** Para medical: efeito breve em texto */
  medicalEffect?: string;
}

export interface Item {
  slug: string;
  name: string;
  /** Subcategoria visual: ex "rifle", "pistol", "antibiotico" */
  subcategory?: string;
  category: ItemCategory;
  /** Ícone Flaticon UICons (sem prefixo "fi-rr-") — fallback quando não há imageUrl */
  icon: string;
  /**
   * Caminho para arte/foto do item (relativo a /public).
   * Convenção: /items/<slug>.png — o usuário pode dropar arquivos lá ou rodar
   * scripts/fetch-item-images.sh para baixar do DayZ Wiki.
   * Se ausente, o componente <ItemImage> renderiza o `icon` Flaticon.
   */
  imageUrl?: string;
  rarity: Rarity;
  /** Onde costuma spawnar */
  loot: LootTier[];
  /** Resumo curto (1 linha) — usado em tooltip e card */
  summary: string;
  /** Texto longo em parágrafos — usado na página de detalhe */
  description: string;
  stats?: ItemStats;
  /** Cuidados / quirks (avisos cinzas) */
  notes?: string[];
  /** Relações inbound/outbound */
  relations?: {
    /** Itens necessários para usar/operar este (ex: arma → munição) */
    requires?: ItemRelation[];
    /** Itens que CRIAM ou REPARAM este */
    repairedBy?: ItemRelation[];
    /** Itens que este ITEM repara/opera */
    repairs?: ItemRelation[];
    /** Compatibilidades (atachments para armas, mags para arma…) */
    compatibleWith?: ItemRelation[];
    /** Receitas que usam este (preenchido automático de recipes) */
    usedInRecipes?: ItemRelation[];
    /** Receitas que produzem este (auto) */
    producedByRecipes?: ItemRelation[];
    /** Itens que você obtém ao desmanchar este (ex: rasgar camisa = panos) */
    yields?: ItemRelation[];
  };
  /** Tags livres pra busca */
  tags?: string[];
}

// ─── Crafting / Recipes ─────────────────────────────────────────────────
export interface RecipeIngredient {
  itemSlug: string;
  qty: number;
}

export interface Recipe {
  slug: string;
  /** Output do craft */
  output: RecipeIngredient;
  inputs: RecipeIngredient[];
  /** Ferramentas obrigatórias (Knife, Hatchet…) — não consumidas */
  tools?: string[];
  /** Ações em jogo: "Combine in inventory" / "Use Hatchet on log" / "Action wheel" */
  method: string;
  /** Tempo aproximado em segundos */
  durationS?: number;
  /** Nota técnica (campfire? bench? só action?) */
  notes?: string;
  /** Categoria pra agrupar UI: weapon, base, food, medical, traversal */
  category:
    | "weapon"
    | "ammo"
    | "tool"
    | "base"
    | "food"
    | "medical"
    | "traversal"
    | "fire"
    | "clothing";
}

// ─── Survival mechanics ─────────────────────────────────────────────────
export interface SurvivalStat {
  slug: string;
  name: string;
  icon: string;
  /** Cor para HUD bar */
  tone: "blood" | "olive" | "brass" | "rust" | "radiation";
  /** Faixa de valores (ex: 0–5000 kcal) */
  range: { min: number; max: number; unit: string };
  /** Como sobe / como desce */
  increases: string[];
  decreases: string[];
  /** Sintomas em níveis */
  thresholds: Array<{
    level: "ok" | "warning" | "critical" | "death";
    label: string;
    description: string;
  }>;
  /** Itens-chave (slugs) pra mitigar */
  keyItems: string[];
}

export interface Disease {
  slug: string;
  name: string;
  icon: string;
  severity: "mild" | "moderate" | "severe";
  symptoms: string[];
  causes: string[];
  cures: string[]; // slugs
  prevention: string[];
  description: string;
}

// ─── Maps ─────────────────────────────────────────────────────────────────
export interface MapZone {
  slug: string;
  name: string;
  type:
    | "military"
    | "police"
    | "industrial"
    | "town"
    | "village"
    | "hospital"
    | "fire"
    | "hunting"
    | "spawn"
    | "contamination"
    | "heli_crash";
  region: string;
  loot: LootTier[];
  /** Risco PvP / Infectado: 1-5 */
  risk: number;
  description: string;
  /** Coordenadas grid in-game (ex "075-098") */
  grid?: string;
}

export interface DayZMap {
  slug: string;
  name: string;
  area: string; // ex: "225 km²"
  climate: string;
  description: string;
  /** Highlights / features */
  features: string[];
  /** Hot zones — referenciam `MapZone` por slug */
  zoneSlugs: string[];
}

// ─── Base Building ────────────────────────────────────────────────────────
export interface BuildingPiece {
  slug: string;
  name: string;
  icon: string;
  tier:
    | "improvised" // barricadas/tarp
    | "wooden" // madeira (fence kit, watchtower)
    | "metal"; // metálico (gates reforçados)
  description: string;
  hp: number;
  /** Materiais necessários por estágio */
  stages: Array<{
    label: string;
    materials: RecipeIngredient[];
    tools?: string[];
    notes?: string;
  }>;
  /** Como destruir (raid) */
  raid?: string[];
}
