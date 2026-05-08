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
];
