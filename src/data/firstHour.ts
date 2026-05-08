/**
 * Guia "Primeira Hora" — passo-a-passo desde fresh spawn até primeiro
 * loadout viável. Decisões críticas em cada fase.
 */

export interface PhaseStep {
  goal: string;
  actions: string[];
  watchOut: string[];
  /** Slugs de itens-chave dessa fase */
  keyItems: string[];
}

export interface Phase {
  slug: string;
  number: number;
  title: string;
  duration: string;
  intro: string;
  steps: PhaseStep[];
}

export const FIRST_HOUR: Phase[] = [
  {
    slug: "spawn",
    number: 1,
    title: "Fresh Spawn (0-5min)",
    duration: "≈ 5 min",
    intro:
      "Você acabou de spawnar na costa. Sem armas, sem mochila, sem proteção. PRIORIDADE: sair da costa antes do primeiro KOS.",
    steps: [
      {
        goal: "Identificar localização",
        actions: [
          "Olhe a placa da estação de trem ou hospital (têm nome).",
          "Use sol como referência: nasce E, põe O.",
          "Costa Sul = Kamenka → Cherno → Elektro → Berezino (W→E).",
        ],
        watchOut: [
          "Som de tiros = corra na direção OPOSTA.",
          "Outros fresh spawns podem te matar com punho — é raro mas existe.",
        ],
        keyItems: [],
      },
      {
        goal: "Mover pra interior",
        actions: [
          "Saia da cidade-spawn em 5 min máximo.",
          "Vá pro Norte (interior) — todo geared player tá indo pro Norte também, mas você passa por menos PvP do que ficar na costa.",
          "Pegue estradas secundárias, evite rodovias principais.",
        ],
        watchOut: [
          "Não fique na praia esperando achar item — costa é death sentence.",
          "Não entre em prédio onde ouviu passo — fresh-spawn-on-fresh-spawn melee é vacas-loucas.",
        ],
        keyItems: [],
      },
    ],
  },
  {
    slug: "village",
    number: 2,
    title: "Primeira Vila (5-20min)",
    duration: "≈ 15 min",
    intro:
      "Você saiu da costa. Agora precisa de comida, água, faca, fonte de fogo. Vilas pequenas dão tudo isso sem PvP.",
    steps: [
      {
        goal: "Loot básico de cozinha",
        actions: [
          "Entre em casas amarelas/vermelhas (residenciais).",
          "Cozinha = faca, abridor, panela, fogão (se quiser cozinhar).",
          "Drone Pego: enlatados, frutas (apple/pear caem perto de árvores).",
        ],
        watchOut: [
          "Comida estragada (rotten) causa intoxicação. Veja status no item.",
          "Bebida em cisternas pública é segura. Lago/rio = Cholera sem purificação.",
        ],
        keyItems: ["kitchen-knife", "can-opener", "matches", "lighter", "apple", "tuna-can"],
      },
      {
        goal: "Hidratação imediata",
        actions: [
          "Encontre cisterna pública (poço comunitário) — água potável.",
          "Encha plastic-bottle ou canteen.",
          "Beba até 'Stuffed' antes de seguir.",
        ],
        watchOut: ["Cisterna em zona aberta = exposição. Vá rápido."],
        keyItems: ["plastic-bottle", "canteen", "water-bottle"],
      },
      {
        goal: "Roupas básicas",
        actions: [
          "Camisa + calça civil (color a gosto, vai trocar).",
          "Botas pra reduzir dano de queda.",
          "Mochila SCHOLAR (Field Backpack) ou improvisada (rip clothing).",
        ],
        watchOut: [
          "Plate Carrier não vai estar aqui. Não procure.",
          "Sem mochila? Tente Improvised Backpack (rabbit-pelt + 2 long sticks + rope).",
        ],
        keyItems: ["field-backpack", "improvised-backpack", "combat-boots"],
      },
    ],
  },
  {
    slug: "tools-fire",
    number: 3,
    title: "Ferramentas + Fogo (20-35min)",
    duration: "≈ 15 min",
    intro:
      "Sobreviver requer cortar madeira (fogueira), abrir latas, esquartejar caça. Pegue tools agora.",
    steps: [
      {
        goal: "Hatchet ou Combat Knife",
        actions: [
          "Hatchet: galpões/casas em vilas. Multi-uso (corta logs + esquarteja).",
          "Casa de caça (lodge): Hunting Backpack + Hatchet + às vezes Hunting Scope.",
        ],
        watchOut: ["Knife esquarteja mas é mais lenta. Hatchet > Knife pra long-term."],
        keyItems: ["hatchet", "fire-axe", "hunting-backpack"],
      },
      {
        goal: "Fonte de fogo",
        actions: [
          "Matches: comum em casas. Limita ~10 tentativas.",
          "Lighter: melhor — quase ilimitado.",
          "Crafte campfire: 4 sticks + 1 rag + ignite.",
        ],
        watchOut: ["Chuva drasticamente reduz chance de pegar fogo. Procure abrigo."],
        keyItems: ["matches", "lighter", "campfire", "fireplace-kit"],
      },
      {
        goal: "Comer carne (proteína densa)",
        actions: [
          "Mate galinha em fazenda → 1 hit melee → cooked-chicken via campfire.",
          "Coelho com armadilha (snare) ou mira no rifle .22 se tiver.",
          "Cozinhe SEMPRE. Cru = doença garantida.",
        ],
        watchOut: ["Bife cru = Salmonella. Frango cru = Salmonella. Peixe cru = Parasitas."],
        keyItems: ["cooked-chicken", "raw-steak", "cooked-steak"],
      },
    ],
  },
  {
    slug: "first-weapon",
    number: 4,
    title: "Primeira Arma (35-50min)",
    duration: "≈ 15 min",
    intro:
      "Sem arma você é alvo. Procure casa policial OU casa de caça pra primeiro firearm. NÃO vá pra base militar ainda.",
    steps: [
      {
        goal: "Casa de Caça (Hunting Lodge)",
        actions: [
          "Mosin 9130 + munição 7.62×54R, ou SKS + 7.62×39.",
          "Pode achar PU Scope (mira histórica).",
          "Geralmente em mato isolado — sem PvP.",
        ],
        watchOut: ["Mosin é bolt-action — recarga lenta. Pratique antes de PvP."],
        keyItems: ["mosin-9130", "sks", "762x54r", "762x39", "pu-scope"],
      },
      {
        goal: "Polícia (alternativa)",
        actions: [
          "CR-75 + Press Vest + ammo 9×19 + algemas.",
          "Encontre em delegacia (Cherno/Elektro/Berezino — risco PvP médio).",
          "Press Vest = proteção contra pistola. Não para 5.56+.",
        ],
        watchOut: [
          "Polícia em cidade grande = PvP risk. Escolha cidade média (Zelenogorsk).",
        ],
        keyItems: ["cr-75", "press-vest", "9x19", "cr75-mag"],
      },
    ],
  },
  {
    slug: "transition",
    number: 5,
    title: "Transição p/ Tier 2 (50-60min)",
    duration: "≈ 10 min",
    intro:
      "Você tá viável. Agora consolida: kit médico, mochila maior, planejamento pra base militar pequena.",
    steps: [
      {
        goal: "Kit médico mínimo",
        actions: [
          "Bandage ×2 ou rags ×6 (rasga camiseta).",
          "Tetracycline (cura bacteriana).",
          "Painkillers (remove tremor pré-firefight).",
          "Charcoal Tablets (intoxicação alimentar).",
        ],
        watchOut: ["Saline IV se achar é GAME CHANGER. Não use blood bag sem tipo."],
        keyItems: ["bandage", "rags", "tetracycline", "painkillers", "charcoal-tablets"],
      },
      {
        goal: "Mochila maior",
        actions: [
          "Hunting Backpack: 35 slots. Encontre em hunting lodges.",
          "Assault Backpack: 30 slots. Polícia/military pequeno.",
          "Mountain Backpack: 60 slots. Tisy/NWAF — endgame.",
        ],
        watchOut: [
          "Mochila grande pesa muito. Cuidado com stamina.",
        ],
        keyItems: ["hunting-backpack", "assault-backpack", "mountain-backpack"],
      },
      {
        goal: "Planejar próximo move",
        actions: [
          "Vybor Military ou Myshkino Tents = Tier 2 sem hot zone.",
          "Altar Military: interior, less crowded.",
          "Heli crash dinâmico: alto risco/recompensa — só se ouvir o helicóptero recente.",
        ],
        watchOut: ["NWAF/Tisy = morte garantida sem squad. Adie pro tier 3.", "Reabasteça antes — viagem pode levar 30-60min."],
        keyItems: ["vybor-military", "myshkino-tents"],
      },
    ],
  },
];
