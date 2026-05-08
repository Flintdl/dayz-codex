import type { BuildingPiece } from "./types";

export const BUILDING_PIECES: BuildingPiece[] = [
  {
    slug: "wooden-fence",
    name: "Cerca de Madeira",
    icon: "fence",
    tier: "wooden",
    description:
      "Estrutura modular de defesa. 4 estágios: kit → posts → frame → walls.",
    hp: 40000,
    stages: [
      {
        label: "1. Kit no chão",
        materials: [
          { itemSlug: "plank", qty: 4 },
          { itemSlug: "nails", qty: 1 },
          { itemSlug: "rope", qty: 1 },
        ],
        tools: ["hammer"],
        notes: "Combine no inventário primeiro.",
      },
      {
        label: "2. Postes",
        materials: [
          { itemSlug: "plank", qty: 2 },
          { itemSlug: "nails", qty: 1 },
        ],
        tools: ["hammer"],
      },
      {
        label: "3. Frame inferior + superior",
        materials: [
          { itemSlug: "plank", qty: 4 },
          { itemSlug: "nails", qty: 2 },
        ],
        tools: ["hammer"],
      },
      {
        label: "4. Paredes",
        materials: [
          { itemSlug: "plank", qty: 4 },
          { itemSlug: "nails", qty: 2 },
        ],
        tools: ["hammer"],
      },
    ],
    raid: [
      "Hatchet/Pickaxe: ~15 min de hits seguidos",
      "Sledgehammer: ~7 min",
      "Explosivos modados (vanilla não tem)",
    ],
  },
  {
    slug: "wooden-gate",
    name: "Portão de Madeira",
    icon: "fence",
    tier: "wooden",
    description: "Porta com fechadura por código (4 dígitos).",
    hp: 50000,
    stages: [
      {
        label: "1. Kit",
        materials: [
          { itemSlug: "plank", qty: 4 },
          { itemSlug: "nails", qty: 1 },
          { itemSlug: "rope", qty: 1 },
        ],
        tools: ["hammer"],
      },
      {
        label: "2. Frame de portão",
        materials: [
          { itemSlug: "plank", qty: 4 },
          { itemSlug: "nails", qty: 2 },
        ],
        tools: ["hammer", "screwdriver"],
      },
      {
        label: "3. Combination Lock",
        materials: [{ itemSlug: "combination-lock", qty: 1 }],
        notes:
          "Combine cadeado no portão. Anote o código — perdeu = arrombar com dolly.",
      },
    ],
    raid: ["Hacksaw no cadeado: 30+ min", "Pickaxe na porta: ~20 min"],
  },
  {
    slug: "watchtower-kit",
    name: "Torre de Vigia",
    icon: "broadcast-tower",
    tier: "wooden",
    description: "Posto de observação alto — multiplica visão de base.",
    hp: 60000,
    stages: [
      {
        label: "1. Kit",
        materials: [
          { itemSlug: "plank", qty: 6 },
          { itemSlug: "nails", qty: 2 },
          { itemSlug: "rope", qty: 2 },
        ],
        tools: ["hammer"],
      },
      {
        label: "2. Nível inferior",
        materials: [
          { itemSlug: "plank", qty: 4 },
          { itemSlug: "nails", qty: 2 },
        ],
        tools: ["hammer"],
      },
      {
        label: "3. Nível médio",
        materials: [
          { itemSlug: "plank", qty: 4 },
          { itemSlug: "nails", qty: 2 },
        ],
        tools: ["hammer"],
      },
      {
        label: "4. Plataforma topo",
        materials: [
          { itemSlug: "plank", qty: 4 },
          { itemSlug: "nails", qty: 2 },
        ],
        tools: ["hammer"],
      },
    ],
  },
  {
    slug: "underground-stash",
    name: "Esconderijo Subterrâneo (Stash)",
    icon: "package",
    tier: "improvised",
    description:
      "Buraco coberto. Inventário compartilhado com mochila ou caixa enterrada.",
    hp: 5000,
    stages: [
      {
        label: "Cavar buraco",
        materials: [],
        tools: ["shovel", "pickaxe"],
        notes: "Use a pá em terreno apropriado (não urbano).",
      },
      {
        label: "Esconder item",
        materials: [],
        notes:
          "Pode esconder mochila inteira ou ammo box. Cobre com sticks/leaves.",
      },
    ],
  },
  {
    slug: "improvised-shelter",
    name: "Abrigo Improvisado",
    icon: "tents",
    tier: "improvised",
    description: "Tenda básica para descanso/storage temporário.",
    hp: 3000,
    stages: [
      {
        label: "1. Frame",
        materials: [
          { itemSlug: "long-stick", qty: 8 },
          { itemSlug: "rope", qty: 2 },
        ],
      },
      {
        label: "2. Cobertura",
        materials: [
          { itemSlug: "rope", qty: 4 },
        ],
        notes: "Use folhas (em árvores) ou tarp para cobrir.",
      },
    ],
  },
  {
    slug: "metal-fence",
    name: "Cerca Metálica",
    icon: "fence",
    tier: "metal",
    description: "Estrutura mais resistente — chapa metálica.",
    hp: 80000,
    stages: [
      {
        label: "1. Kit",
        materials: [
          { itemSlug: "metal-sheet", qty: 4 },
          { itemSlug: "nails", qty: 2 },
          { itemSlug: "metal-wire", qty: 1 },
        ],
        tools: ["hammer", "pliers"],
      },
      {
        label: "2. Estrutura completa",
        materials: [{ itemSlug: "metal-sheet", qty: 4 }],
        tools: ["hammer"],
      },
    ],
    raid: ["Pickaxe: ~30 min", "Sledgehammer: ~15 min"],
  },
  {
    slug: "tarp-shelter",
    name: "Lean-To Shelter (Tarp)",
    icon: "tents",
    tier: "improvised",
    description:
      "Abrigo lateral apoiado em árvore — bloqueia chuva e vento sem persistência forte.",
    hp: 4000,
    stages: [
      {
        label: "1. Estrutura básica",
        materials: [
          { itemSlug: "long-stick", qty: 6 },
          { itemSlug: "rope", qty: 2 },
        ],
        notes: "Apoia em árvore — ângulo ~45°.",
      },
      {
        label: "2. Cobertura",
        materials: [{ itemSlug: "tarp", qty: 1 }],
        notes:
          "Sem tarp, use folhas (action 'Cover with leaves' em árvores).",
      },
    ],
    raid: ["Hatchet: ~3 min", "Faca: ~6 min"],
  },
  {
    slug: "barrel-storage",
    name: "Barril Metálico",
    icon: "package",
    tier: "metal",
    description:
      "Storage 42 slots + acende fogo dentro pra aquecimento sem fumaça vertical denunciante.",
    hp: 25000,
    stages: [
      {
        label: "Posicionar",
        materials: [{ itemSlug: "barrel", qty: 1 }],
        notes: "Encontre no mapa em zonas industriais.",
      },
      {
        label: "Acender (opcional)",
        materials: [{ itemSlug: "wooden-stick", qty: 4 }],
        tools: ["matches"],
        notes: "Vira heat source pra base + cooking.",
      },
    ],
    raid: ["Pickaxe: ~10 min — barril aceita pouco abuso."],
  },
  {
    slug: "wooden-crate",
    name: "Caixa de Madeira",
    icon: "package",
    tier: "wooden",
    description: "Storage 16 slots — visível mas barato e persistente.",
    hp: 8000,
    stages: [
      {
        label: "1. Crafte",
        materials: [
          { itemSlug: "plank", qty: 4 },
          { itemSlug: "nails", qty: 2 },
        ],
        tools: ["hammer"],
      },
      {
        label: "2. Posicionar no chão",
        materials: [],
        notes: "Visible — esconda atrás de cerca/tent.",
      },
    ],
    raid: ["Hatchet: ~4 min"],
  },
  {
    slug: "garden-plot",
    name: "Plot de Plantação",
    icon: "leaf",
    tier: "improvised",
    description:
      "Hortícola — 9 slots de plantio. Sementes → plantar → regar → composto → colher.",
    hp: 5000,
    stages: [
      {
        label: "1. Cavar",
        materials: [],
        tools: ["shovel", "pickaxe"],
        notes: "Use pá em terra (não asfalto). Cria 9 slots de cultivo.",
      },
      {
        label: "2. Plantar",
        materials: [{ itemSlug: "tomato-seeds", qty: 1 }],
        notes:
          "Use sementes diversas (tomato, pepper, pumpkin, potato, zucchini).",
      },
      {
        label: "3. Regar + Composto",
        materials: [{ itemSlug: "canteen", qty: 1 }],
        notes:
          "Regar com canteen + adicionar fertilizer/composto acelera. ~30 min até maduro.",
      },
      {
        label: "4. Colher",
        materials: [],
        notes: "Action 'Harvest' nos vegetais maduros.",
      },
    ],
    raid: ["Pode ser pisado/destruído por veículos."],
  },
  {
    slug: "greenhouse",
    name: "Estufa (Greenhouse)",
    icon: "leaf",
    tier: "wooden",
    description:
      "Plot indoor protegido — plantação não morre por chuva/frio Sakhal.",
    hp: 30000,
    stages: [
      {
        label: "1. Frame",
        materials: [
          { itemSlug: "plank", qty: 8 },
          { itemSlug: "nails", qty: 4 },
        ],
        tools: ["hammer"],
      },
      {
        label: "2. Cobertura",
        materials: [{ itemSlug: "tarp", qty: 2 }],
      },
      {
        label: "3. Plot interno",
        materials: [],
        tools: ["shovel"],
      },
    ],
    raid: ["Hatchet: ~12 min"],
  },
  {
    slug: "wooden-wall",
    name: "Parede de Madeira (Wall)",
    icon: "fence",
    tier: "wooden",
    description:
      "Diferente de Fence — wall é estrutura modular maior, comum em walled compounds.",
    hp: 60000,
    stages: [
      {
        label: "1. Frame base",
        materials: [
          { itemSlug: "plank", qty: 4 },
          { itemSlug: "nails", qty: 2 },
        ],
        tools: ["hammer"],
      },
      {
        label: "2. Cross planks (rigidez)",
        materials: [
          { itemSlug: "plank", qty: 2 },
          { itemSlug: "nails", qty: 1 },
        ],
        tools: ["hammer"],
      },
      {
        label: "3. Painel completo",
        materials: [
          { itemSlug: "plank", qty: 6 },
          { itemSlug: "nails", qty: 3 },
        ],
        tools: ["hammer"],
      },
    ],
    raid: [
      "Hatchet/Pickaxe: ~20 min",
      "Sledgehammer: ~10 min",
    ],
  },
  {
    slug: "improvised-locker",
    name: "Locker (Armário Improvisado)",
    icon: "package",
    tier: "metal",
    description:
      "Armário metálico — storage com cadeado integrado. Resistente a raid casual.",
    hp: 50000,
    stages: [
      {
        label: "1. Posicionar",
        materials: [],
        notes: "Encontre em barracks militares, casas industriais.",
      },
      {
        label: "2. Trancar com cadeado",
        materials: [{ itemSlug: "combination-lock", qty: 1 }],
        notes: "Anote o código.",
      },
    ],
    raid: ["Hacksaw no cadeado: 30 min", "Pickaxe no armário: 15 min"],
  },
  {
    slug: "tripwire-trap",
    name: "Armadilha Tripwire",
    icon: "shield",
    tier: "improvised",
    description:
      "Aviso/dano em invasor — combine grenade + wire pra explosivo automático.",
    hp: 1000,
    stages: [
      {
        label: "1. Wire setup",
        materials: [
          { itemSlug: "metal-wire", qty: 2 },
          { itemSlug: "wooden-stick", qty: 2 },
        ],
        tools: ["pliers"],
      },
      {
        label: "2. Carga (opcional)",
        materials: [{ itemSlug: "rgd-5", qty: 1 }],
        notes:
          "Granada de fragmentação ativa quando alguém tropeça. Pode pegar você mesmo!",
      },
    ],
    raid: [
      "Player atento pode disparar/detectar",
      "Wire é frágil (1 tiro destrói)",
    ],
  },
  {
    slug: "smokehouse",
    name: "Fumeiro (Smokehouse)",
    icon: "campfire",
    tier: "wooden",
    description:
      "Cura carne pra durar mais — preserva alimentação em base de longo prazo.",
    hp: 12000,
    stages: [
      {
        label: "1. Estrutura",
        materials: [
          { itemSlug: "plank", qty: 6 },
          { itemSlug: "nails", qty: 3 },
        ],
        tools: ["hammer"],
      },
      {
        label: "2. Câmara superior",
        materials: [{ itemSlug: "plank", qty: 4 }],
        tools: ["hammer"],
        notes: "Onde a carne é pendurada.",
      },
      {
        label: "3. Acender",
        materials: [{ itemSlug: "wooden-stick", qty: 4 }],
        tools: ["matches", "lighter"],
        notes: "Carne fica 'cured', não estraga em ~5 horas in-game.",
      },
    ],
  },
  {
    slug: "camo-net",
    name: "Camo Net",
    icon: "leaf",
    tier: "improvised",
    description:
      "Cobre tents/veículos contra vista aérea — denuncia menos posição base.",
    hp: 2000,
    stages: [
      {
        label: "Crafte",
        materials: [
          { itemSlug: "burlap-sack", qty: 4 },
          { itemSlug: "rope", qty: 2 },
        ],
      },
      {
        label: "Posicionar",
        materials: [],
        notes: "Cobre tent/car. Reutilizável.",
      },
    ],
    raid: ["Faca rasga em segundos."],
  },
  {
    slug: "fence-with-camo",
    name: "Fence + Camo Net",
    icon: "fence",
    tier: "wooden",
    description:
      "Fence reforçada com Camo Net por cima — visual reduzido a 100m.",
    hp: 42000,
    stages: [
      {
        label: "1. Construir Fence",
        materials: [],
        tools: [],
        notes: "Veja receita 'wooden-fence' (4 estágios).",
      },
      {
        label: "2. Aplicar Camo",
        materials: [{ itemSlug: "burlap-sack", qty: 2 }],
        notes: "Reduz silhueta da base.",
      },
    ],
    raid: ["Mesmo raid time da Fence base."],
  },
];
