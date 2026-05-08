import type { DayZMap, MapZone } from "./types";

export const MAP_ZONES: MapZone[] = [
  // ─── Chernarus — Militar ──────────────────────────
  {
    slug: "tisy",
    name: "Tisy Military Base",
    type: "military",
    region: "NW Chernarus",
    loot: ["military_high"],
    risk: 5,
    description:
      "Base militar do extremo Norte — tier máximo. M4-A1, Plate Carrier, ACOG. Costuma ter snipers em torres.",
    grid: "032-026",
  },
  {
    slug: "north-west-airfield",
    name: "Aeroporto NW (NWAF)",
    type: "military",
    region: "NW Chernarus",
    loot: ["military_high", "military"],
    risk: 5,
    description:
      "Hot zone clássico — múltiplos hangares, controle de tráfego, barracks. Centro nevrálgico de PvP.",
    grid: "044-058",
  },
  {
    slug: "north-east-airfield",
    name: "Aeroporto NE (NEAF)",
    type: "military",
    region: "NE Chernarus",
    loot: ["military"],
    risk: 4,
    description:
      "Variante menor do NW. Bom risk/reward. Krasnostav perto pra reabastecer.",
    grid: "115-035",
  },
  {
    slug: "balota",
    name: "Balota Military",
    type: "military",
    region: "S Chernarus",
    loot: ["military"],
    risk: 4,
    description:
      "Aeroporto litorâneo + base militar. Loot sólido, perto de spawns — sempre ocupado.",
    grid: "048-127",
  },
  {
    slug: "myshkino-tents",
    name: "Tendas de Myshkino",
    type: "military",
    region: "Central Chernarus",
    loot: ["military"],
    risk: 4,
    description:
      "Acampamento militar improvisado. Alvo de heli crash perto.",
    grid: "057-098",
  },
  {
    slug: "vybor-military",
    name: "Vybor Military",
    type: "military",
    region: "Central Chernarus",
    loot: ["military"],
    risk: 3,
    description: "Base intermediária. Boa pra solo recém-saído do litoral.",
    grid: "065-067",
  },

  // ─── Polícia ──────────────────────────────────────
  {
    slug: "elektro-police",
    name: "Polícia Elektro",
    type: "police",
    region: "S Chernarus",
    loot: ["police"],
    risk: 3,
    description: "Pistolas, vest, ammo 9×19.",
    grid: "104-129",
  },
  {
    slug: "berezino-police",
    name: "Polícia Berezino",
    type: "police",
    region: "E Chernarus",
    loot: ["police"],
    risk: 3,
    description: "Loot policial + farmácia próxima.",
    grid: "129-098",
  },

  // ─── Hospitais ────────────────────────────────────
  {
    slug: "elektro-hospital",
    name: "Hospital Elektro",
    type: "hospital",
    region: "S Chernarus",
    loot: ["medical"],
    risk: 3,
    description: "Loot médico denso. Sempre vasculhado.",
    grid: "103-126",
  },
  {
    slug: "berezino-hospital",
    name: "Hospital Berezino",
    type: "hospital",
    region: "E Chernarus",
    loot: ["medical"],
    risk: 2,
    description: "Médico de bom retorno.",
    grid: "127-095",
  },

  // ─── Caça ──────────────────────────────────────────
  {
    slug: "lopatino-hunting",
    name: "Hunting Lodge — Lopatino",
    type: "hunting",
    region: "NW Chernarus",
    loot: ["hunting"],
    risk: 2,
    description: "Mosin, SKS, tools.",
  },

  // ─── Heli crash ──────────────────────────────────
  {
    slug: "heli-crash-static",
    name: "Heli Crash (rotativos)",
    type: "heli_crash",
    region: "Variável",
    loot: ["military_high"],
    risk: 5,
    description:
      "Spawns dinâmicos a cada ~30min. M4, AKM, LAR raro. Som visível a 1km. Atrai PvP.",
  },

  // ─── Contaminação ────────────────────────────────
  {
    slug: "rify-shipwreck",
    name: "Rify (Naufrágio)",
    type: "contamination",
    region: "NE Costa",
    loot: ["military_high"],
    risk: 5,
    description:
      "Navio encalhado contaminado. Loot tier máximo + zumbis especiais. Use Gas Mask + filtros.",
    grid: "147-022",
  },

  // ─── Bombeiros ───────────────────────────────────
  {
    slug: "novodmitrovsk-firestation",
    name: "Bombeiros Novodmitrovsk",
    type: "fire",
    region: "N Chernarus",
    loot: ["firefighter"],
    risk: 2,
    description: "Fire-axe garantida.",
  },
];

export const MAPS: DayZMap[] = [
  {
    slug: "chernarus",
    name: "Chernarus +",
    area: "225 km²",
    climate: "Temperado húmido (similar Europa Oriental)",
    description:
      "Mapa principal. Costa sul = spawns, interior = progressão, extremo norte = loot militar tier máximo.",
    features: [
      "Litoral SE com cidades (Elektro, Cherno, Berezino)",
      "Interior com fazendas, vilas e estradas",
      "Norte montanhoso (Black Mountain Pass)",
      "Aeroportos NW (NWAF) e NE (NEAF)",
      "Tisy no extremo NW = endgame",
      "Rify shipwreck no NE com contaminação",
    ],
    zoneSlugs: [
      "tisy",
      "north-west-airfield",
      "north-east-airfield",
      "balota",
      "myshkino-tents",
      "vybor-military",
      "elektro-police",
      "berezino-police",
      "elektro-hospital",
      "berezino-hospital",
      "lopatino-hunting",
      "heli-crash-static",
      "rify-shipwreck",
      "novodmitrovsk-firestation",
    ],
  },
  {
    slug: "livonia",
    name: "Livonia",
    area: "163 km²",
    climate: "Floresta densa do Leste Europeu",
    description:
      "DLC Livonia. Mais boscoso, mais fechado. Características únicas: ursos, mais animais de caça, sirenes de gás.",
    features: [
      "Florestas densas — visibilidade reduzida",
      "Ursos hostis (Brown Bear)",
      "Sirenes de gás contaminam zonas dinâmicas",
      "Bunkers subterrâneos com loot único",
      "Bilo Mountain — base militar central",
    ],
    zoneSlugs: [],
  },
  {
    slug: "sakhal",
    name: "Sakhal",
    area: "100 km²",
    climate: "Ártico — frio extremo",
    description:
      "DLC Frostline. Ilha vulcânica japonesa. Frio é o inimigo principal — Hipotermia mata em minutos sem roupa adequada.",
    features: [
      "Temperatura abaixo de 0°C constante",
      "Roupas térmicas obrigatórias",
      "Tempestades de neve — visibilidade zero",
      "Termal pools — único calor 'natural'",
      "Vulcão Sakhal — área endgame",
    ],
    zoneSlugs: [],
  },
];
