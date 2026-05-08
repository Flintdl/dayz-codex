/**
 * Timeline DayZ Standalone — major releases. Foco em mudanças que
 * afetam o que está no Codex (itens renomeados, novos sistemas).
 */

export interface TimelineEntry {
  version: string;
  date: string;
  title: string;
  highlights: string[];
}

export const TIMELINE: TimelineEntry[] = [
  {
    version: "1.0",
    date: "Dec 2018",
    title: "Standalone Final Release",
    highlights: [
      "Saída do Early Access após 5 anos.",
      "Engine Enfusion estável.",
      "Server modding aberto à comunidade.",
    ],
  },
  {
    version: "1.04",
    date: "Jul 2019",
    title: "Vehicles + Hunting",
    highlights: [
      "Veículos persistentes melhorados.",
      "Sistema de armadilhas (snare, fish trap).",
      "Hatchet + Knife esquartejamento detalhado.",
    ],
  },
  {
    version: "1.06",
    date: "Mar 2020",
    title: "Livonia DLC",
    highlights: [
      "Mapa Livonia adicionado (DLC pago).",
      "Floresta densa, ursos hostis.",
      "Sirenes de gás dinâmicas.",
    ],
  },
  {
    version: "1.10",
    date: "Dec 2020",
    title: "Base Building Rework",
    highlights: [
      "Watchtower + Wooden Fence sistema modular 4 estágios.",
      "Combination Lock pra portões.",
      "Plate Carrier rework — placas separadas.",
    ],
  },
  {
    version: "1.13",
    date: "Aug 2021",
    title: "Static Contamination Zones",
    highlights: [
      "Rify naufrágio adicionado em Chernarus NE.",
      "NW e SE contamination zones.",
      "Gas Mask + filtros tornaram-se essenciais.",
    ],
  },
  {
    version: "1.17",
    date: "Mar 2022",
    title: "Cooking + Improvised",
    highlights: [
      "Cooking detalhado (frigideira, panela, tripé).",
      "Improvised suppressor (plastic bottle + tape).",
      "Repair de wear visual em armas.",
    ],
  },
  {
    version: "1.19",
    date: "Aug 2022",
    title: "Dynamic Events Expanded",
    highlights: [
      "Heli crashes em mais locais.",
      "Convoy events em Sakhal preview.",
      "Loot tier rebalance (M4 mais raro, AKM mais comum).",
    ],
  },
  {
    version: "1.22",
    date: "Aug 2023",
    title: "Map Tools",
    highlights: [
      "Mapa físico fragmentável (4 partes combine).",
      "Compass updates.",
      "GPS receiver (raro, military).",
    ],
  },
  {
    version: "1.23",
    date: "Dec 2023",
    title: "Fishing Overhaul",
    highlights: [
      "Fishing rod + hook system.",
      "Worms (isca) cavados com pá.",
      "Fish trap para passive fishing.",
    ],
  },
  {
    version: "1.24",
    date: "Apr 2024",
    title: "Modern Weapons",
    highlights: [
      "BK-12 (semi-auto shotgun) added.",
      "BK-43 (combo rifle) added.",
      "M70 Tundra refinada.",
    ],
  },
  {
    version: "1.25",
    date: "Sep 2024",
    title: "Frostline DLC (Sakhal)",
    highlights: [
      "Mapa Sakhal — ilha vulcânica fria.",
      "Hipotermia mecânica reformada.",
      "Snowshoes, Ice Axe, Fish Trap (gelo).",
      "Thermal Blanket pra emergência.",
    ],
  },
  {
    version: "1.26",
    date: "Mar 2025",
    title: "AKM → KA-M Rename",
    highlights: [
      "AKM renomeada KA-M (in-game), AKM-AK-101 → KA-101 etc.",
      "Adicionada Saiga MK-12 semi-auto shotgun.",
      "Improvised explosives (raid) tunados.",
    ],
  },
  {
    version: "1.27",
    date: "Out 2025",
    title: "Current — Stability + Tweaks",
    highlights: [
      "Vehicle reliability fixes (Olga, Ada).",
      "Garden plot rework — composto + fertilizer.",
      "Loot econ rebalance pós-Sakhal.",
      "VSS Vintorez + AS-VAL drop rates ajustados.",
    ],
  },
];
