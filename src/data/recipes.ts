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

  // ─── COOKING — carne por tipo ───────────────────────────
  {
    slug: "cook-chicken",
    output: { itemSlug: "cooked-chicken", qty: 1 },
    inputs: [{ itemSlug: "raw-chicken", qty: 1 }],
    tools: ["long-stick", "campfire"],
    method: "Espete frango cru → grelhe sobre campfire ~60s.",
    durationS: 60,
    category: "food",
    notes: "Cru = Salmonella garantida. Sempre cozinhe.",
  },
  {
    slug: "cook-fish",
    output: { itemSlug: "fish-fillet-cooked", qty: 1 },
    inputs: [{ itemSlug: "raw-fish", qty: 1 }],
    tools: ["long-stick", "campfire"],
    method: "Filete o peixe (knife) → grelhe ou cozinhe na panela.",
    durationS: 60,
    category: "food",
    notes: "Cru = parasitas. Filé cozido = top calorias.",
  },
  {
    slug: "cook-rabbit",
    output: { itemSlug: "raw-rabbit", qty: 1 },
    inputs: [{ itemSlug: "raw-rabbit", qty: 1 }],
    tools: ["long-stick", "campfire"],
    method: "Espete coelho → grelhe ~50s.",
    durationS: 50,
    category: "food",
  },
  {
    slug: "cook-mushroom",
    output: { itemSlug: "boletus-mushroom", qty: 1 },
    inputs: [{ itemSlug: "boletus-mushroom", qty: 1 }],
    tools: ["frying-pan", "campfire"],
    method: "Frigideira sobre fogueira — cozinha cogumelo (anula intoxicação).",
    durationS: 30,
    category: "food",
  },
  {
    slug: "cook-potato",
    output: { itemSlug: "potato", qty: 1 },
    inputs: [{ itemSlug: "potato", qty: 1 }],
    tools: ["campfire"],
    method: "Coloque batata direto na fogueira → ~120s.",
    durationS: 120,
    category: "food",
    notes: "NUNCA crua — intoxicação garantida.",
  },
  {
    slug: "boil-water",
    output: { itemSlug: "canteen", qty: 1 },
    inputs: [{ itemSlug: "canteen", qty: 1 }],
    tools: ["cooking-pot", "campfire"],
    method:
      "Coloque canteen com água crua dentro da panela sobre campfire → ferve em ~60s.",
    durationS: 60,
    category: "food",
    notes: "Alternativa às tablets de purificação.",
  },
  {
    slug: "cook-egg",
    output: { itemSlug: "egg", qty: 1 },
    inputs: [{ itemSlug: "egg", qty: 1 }],
    tools: ["frying-pan", "campfire"],
    method: "Frigideira → ovo frito (~30s).",
    durationS: 30,
    category: "food",
  },
  {
    slug: "rehydrate-milk",
    output: { itemSlug: "powdered-milk", qty: 1 },
    inputs: [
      { itemSlug: "powdered-milk", qty: 1 },
      { itemSlug: "canteen", qty: 1 },
    ],
    method: "Combine pó de leite + canteen com água → milkshake reidratado.",
    durationS: 5,
    category: "food",
    notes: "Misturar evita pico de fome do leite seco puro.",
  },

  // ─── FIRE — fogueiras detalhadas ─────────────────────────
  {
    slug: "fireplace-from-kit",
    output: { itemSlug: "campfire", qty: 1 },
    inputs: [{ itemSlug: "fireplace-kit", qty: 1 }],
    method:
      "Coloque o kit no chão → ação 'Position Fireplace' → adicione kindling + ignite.",
    durationS: 8,
    category: "fire",
    notes: "Mais rápido que armar do zero. Reutilizável.",
  },
  {
    slug: "ignite-with-matches",
    output: { itemSlug: "campfire", qty: 1 },
    inputs: [
      { itemSlug: "campfire", qty: 1 },
      { itemSlug: "matches", qty: 1 },
    ],
    tools: [],
    method: "Use matches no campfire — consome 1 match por tentativa.",
    durationS: 3,
    category: "fire",
    notes: "Chuva drasticamente reduz chance de pegar.",
  },
  {
    slug: "ignite-with-lighter",
    output: { itemSlug: "campfire", qty: 1 },
    inputs: [{ itemSlug: "campfire", qty: 1 }],
    tools: ["lighter"],
    method: "Use lighter no campfire — quase sempre acende.",
    durationS: 2,
    category: "fire",
  },
  {
    slug: "torch-craft",
    output: { itemSlug: "long-stick-bayonet", qty: 1 },
    inputs: [
      { itemSlug: "long-stick", qty: 1 },
      { itemSlug: "rags", qty: 1 },
    ],
    method: "Combine long stick + rag (ou bandagem) — depois acenda.",
    durationS: 5,
    category: "fire",
    notes: "Tocha dura ~10min, ilumina caverna/bunker.",
  },
  {
    slug: "add-firewood",
    output: { itemSlug: "campfire", qty: 1 },
    inputs: [
      { itemSlug: "campfire", qty: 1 },
      { itemSlug: "wooden-stick", qty: 8 },
    ],
    method: "Adicione sticks/long sticks/planks/logs ao campfire ativo.",
    durationS: 5,
    category: "fire",
    notes: "Tree log queima ~2h, mais que sticks.",
  },

  // ─── TRAPS — caça passiva ────────────────────────────────
  {
    slug: "rabbit-snare",
    output: { itemSlug: "rabbit-pelt", qty: 1 },
    inputs: [
      { itemSlug: "wooden-stick", qty: 1 },
      { itemSlug: "rope", qty: 1 },
    ],
    method:
      "Combine stick + rope → coloque no chão em mata. Confira após 20-30 min.",
    durationS: 10,
    category: "tool",
    notes: "Coelho pega passivamente. Não desliga ao deslogar.",
  },
  {
    slug: "fish-trap-craft",
    output: { itemSlug: "fish-trap", qty: 1 },
    inputs: [
      { itemSlug: "metal-wire", qty: 2 },
      { itemSlug: "rope", qty: 1 },
    ],
    tools: ["pliers"],
    method:
      "Combine wires + rope → arme em água (lago/rio). Coleta 1-2 fish a cada ~30 min.",
    durationS: 20,
    category: "tool",
    notes: "Sakhal: ice axe pra cortar gelo + fish trap em buraco.",
  },
  {
    slug: "fishing-rod-craft",
    output: { itemSlug: "fishing-rod", qty: 1 },
    inputs: [
      { itemSlug: "long-stick", qty: 1 },
      { itemSlug: "rope", qty: 1 },
      { itemSlug: "fishing-hook", qty: 1 },
    ],
    method: "Combine long stick + rope + hook.",
    durationS: 8,
    category: "tool",
    notes: "Use isca (worm/minhoca) pra aumentar chance.",
  },
  {
    slug: "improvised-knife-stone",
    output: { itemSlug: "stone-knife", qty: 1 },
    inputs: [
      { itemSlug: "wooden-stick", qty: 1 },
    ],
    tools: ["sharpening-stone"],
    method: "Use stone numa wooden stick → faca primitiva.",
    durationS: 12,
    category: "tool",
    notes: "Primeira lâmina garantida sem loot.",
  },

  // ─── MEDICAL ──────────────────────────────────────────
  {
    slug: "rip-shirt-into-rags",
    output: { itemSlug: "rags", qty: 6 },
    inputs: [{ itemSlug: "rags", qty: 0 }],
    tools: ["kitchen-knife"],
    method: "Knife em camiseta/blusa → 'Tear into Rags'.",
    durationS: 10,
    category: "medical",
    notes: "Camiseta = 6 rags. Calça = 8. Casaco = 10+.",
  },
  {
    slug: "improvised-bandage",
    output: { itemSlug: "rags", qty: 1 },
    inputs: [{ itemSlug: "rags", qty: 1 }],
    method: "Aplica rag direto em ferida — para sangramento.",
    durationS: 5,
    category: "medical",
    notes: "30% chance de causar wound infection. Use bandagem real se tiver.",
  },
  {
    slug: "sterilize-rag",
    output: { itemSlug: "rags", qty: 1 },
    inputs: [{ itemSlug: "rags", qty: 1 }],
    tools: ["alcohol-tincture"],
    method: "Combine rag + alcohol tincture → rag esterilizado.",
    durationS: 3,
    category: "medical",
    notes: "Reduz infection chance pra próximo da bandagem.",
  },
  {
    slug: "saline-iv-prep",
    output: { itemSlug: "saline-iv", qty: 1 },
    inputs: [
      { itemSlug: "saline-iv", qty: 1 },
      { itemSlug: "iv-start-kit", qty: 1 },
    ],
    method:
      "Conecte IV start kit ao saline → aplique no braço (alvo: você ou aliado).",
    durationS: 30,
    category: "medical",
    notes: "Aliado em pé/sentado ajuda velocidade. Soro = +500 sangue.",
  },
  {
    slug: "blood-transfusion",
    output: { itemSlug: "blood-bag", qty: 1 },
    inputs: [
      { itemSlug: "blood-bag", qty: 1 },
      { itemSlug: "iv-start-kit", qty: 1 },
    ],
    method:
      "Confirme tipo sanguíneo (Blood Test Kit) → conecte IV → aplique.",
    durationS: 30,
    category: "medical",
    notes: "TIPO ERRADO = ANAFILAXIA. Saline IV é mais seguro se em dúvida.",
  },
  {
    slug: "blood-test",
    output: { itemSlug: "blood-test-kit", qty: 1 },
    inputs: [{ itemSlug: "blood-test-kit", qty: 1 }],
    method: "Aplique kit em si mesmo ou aliado → resultado em papel.",
    durationS: 15,
    category: "medical",
    notes: "Tipos: A+ A- B+ B- AB+ AB- O+ O-. O- doa pra todos.",
  },

  // ─── CLOTHING / VESTUÁRIO ─────────────────────────────
  {
    slug: "repair-fabric",
    output: { itemSlug: "field-backpack", qty: 1 },
    inputs: [{ itemSlug: "field-backpack", qty: 1 }],
    tools: ["sewing-kit"],
    method: "Combine kit de costura com peça danificada de tecido.",
    durationS: 8,
    category: "clothing",
    notes: "1 kit = ~3 reparos. Não funciona em couro.",
  },
  {
    slug: "repair-leather",
    output: { itemSlug: "hunting-backpack", qty: 1 },
    inputs: [{ itemSlug: "hunting-backpack", qty: 1 }],
    tools: ["leather-sewing-kit"],
    method: "Combine kit de couro com peça de couro.",
    durationS: 8,
    category: "clothing",
  },
  {
    slug: "ghillie-suit-craft",
    output: { itemSlug: "ghillie-suit", qty: 1 },
    inputs: [
      { itemSlug: "burlap-sack", qty: 4 },
      { itemSlug: "rope", qty: 1 },
    ],
    tools: ["kitchen-knife"],
    method:
      "Combine 4 burlap sacks + rope + knife → 'Craft Ghillie Suit'.",
    durationS: 20,
    category: "clothing",
    notes: "Camuflagem total em mata. Pode pintar com colors variantes.",
  },
  {
    slug: "patch-fabric",
    output: { itemSlug: "rags", qty: 1 },
    inputs: [{ itemSlug: "rags", qty: 1 }],
    tools: ["sewing-kit"],
    method:
      "Use sewing kit em peça 'Damaged' → recupera durabilidade pra 'Worn'.",
    durationS: 5,
    category: "clothing",
  },

  // ─── WEAPONS / IMPROVISED ───────────────────────────
  {
    slug: "craft-arrow-improvised",
    output: { itemSlug: "improvised-arrow", qty: 1 },
    inputs: [{ itemSlug: "long-stick", qty: 1 }],
    tools: ["kitchen-knife"],
    method: "Knife em long stick → seta improvisada (sem feather).",
    durationS: 6,
    category: "ammo",
    notes: "Dano inferior à seta com feather. Recuperável após disparo.",
  },
  {
    slug: "saw-shotgun-mp43",
    output: { itemSlug: "sawed-off-mp43", qty: 1 },
    inputs: [{ itemSlug: "mp-43", qty: 1 }],
    tools: ["hacksaw"],
    method: "Hacksaw na MP-43 → versão sawed-off.",
    durationS: 30,
    category: "weapon",
    notes: "Reduz alcance, aumenta concealment. Irreversível.",
  },
  {
    slug: "saw-mosin",
    output: { itemSlug: "sawed-off-mosin", qty: 1 },
    inputs: [{ itemSlug: "mosin-9130", qty: 1 }],
    tools: ["hacksaw"],
    method: "Hacksaw na Mosin → 'pistola' .54R serrada.",
    durationS: 30,
    category: "weapon",
    notes: "Vira pistola pesada. Usado em estilo bandit.",
  },
  {
    slug: "improvised-suppressor-craft",
    output: { itemSlug: "improvised-suppressor", qty: 1 },
    inputs: [
      { itemSlug: "plastic-bottle", qty: 1 },
      { itemSlug: "duct-tape", qty: 1 },
    ],
    method: "Combine garrafa plástica + duct tape em pistola compatível.",
    durationS: 8,
    category: "weapon",
    notes: "Durabilidade BAIXA — quebra em ~10 tiros.",
  },
  {
    slug: "molotov-cocktail",
    output: { itemSlug: "improvised-explosive", qty: 1 },
    inputs: [
      { itemSlug: "glass-bottle", qty: 1 },
      { itemSlug: "fuel-can", qty: 1 },
      { itemSlug: "rags", qty: 1 },
    ],
    method:
      "Encha garrafa de vidro com gasolina → enfia rag no gargalo → acenda → arremesse.",
    durationS: 12,
    category: "weapon",
    notes: "Cuidado: dano em área. Pode queimar você mesmo.",
  },

  // ─── BASE BUILDING ────────────────────────────────
  {
    slug: "saw-log-into-planks",
    output: { itemSlug: "plank", qty: 4 },
    inputs: [{ itemSlug: "tree-log", qty: 1 }],
    tools: ["saw", "hatchet"],
    method:
      "Saw ou Hatchet num tree log → 4 planks. ~40s com saw, ~60s com hatchet.",
    durationS: 40,
    category: "base",
  },
  {
    slug: "fence-stage-1",
    output: { itemSlug: "wooden-fence", qty: 1 },
    inputs: [{ itemSlug: "wooden-fence-kit", qty: 1 }],
    method: "Coloque kit no chão → 'Position Fence Kit'.",
    durationS: 10,
    category: "base",
    notes: "Estágio 1 de 4. Continue com posts/frame/walls.",
  },
  {
    slug: "fence-stage-2-posts",
    output: { itemSlug: "wooden-fence", qty: 1 },
    inputs: [
      { itemSlug: "plank", qty: 2 },
      { itemSlug: "nails", qty: 1 },
    ],
    tools: ["hammer"],
    method: "Adicione 2 planks no fence kit → posts levantados.",
    durationS: 30,
    category: "base",
  },
  {
    slug: "fence-stage-3-frame",
    output: { itemSlug: "wooden-fence", qty: 1 },
    inputs: [
      { itemSlug: "plank", qty: 4 },
      { itemSlug: "nails", qty: 2 },
    ],
    tools: ["hammer"],
    method: "Adicione planks no estágio frame.",
    durationS: 45,
    category: "base",
  },
  {
    slug: "fence-stage-4-walls",
    output: { itemSlug: "wooden-fence", qty: 1 },
    inputs: [
      { itemSlug: "plank", qty: 4 },
      { itemSlug: "nails", qty: 2 },
    ],
    tools: ["hammer"],
    method: "Última camada — paredes completas. Block visão.",
    durationS: 45,
    category: "base",
  },
  {
    slug: "watchtower-stage-1",
    output: { itemSlug: "watchtower-kit", qty: 1 },
    inputs: [{ itemSlug: "watchtower-kit", qty: 1 }],
    method: "Posicione kit → estágio 1 de 4.",
    durationS: 10,
    category: "base",
    notes: "Cada estágio 4 planks + 2 nails. Topo = 360° visão.",
  },
  {
    slug: "barrel-fire",
    output: { itemSlug: "barrel", qty: 1 },
    inputs: [
      { itemSlug: "barrel", qty: 1 },
      { itemSlug: "wooden-stick", qty: 4 },
    ],
    tools: ["matches"],
    method: "Coloque sticks no barril + acenda → fogo de base sem fumaça vertical.",
    durationS: 15,
    category: "fire",
    notes: "Aquecimento + cooking sem denunciar localização.",
  },
  {
    slug: "garden-plot",
    output: { itemSlug: "wooden-fence-kit", qty: 1 },
    inputs: [],
    tools: ["shovel", "pickaxe"],
    method:
      "Use pá em terra → cava 9 slots de plantio. Adicione sementes + água + composto.",
    durationS: 60,
    category: "base",
    notes: "Plantation cycle: ~30 min até colheita. Harvest com mãos.",
  },
  {
    slug: "stash-underground",
    output: { itemSlug: "underground-stash", qty: 1 },
    inputs: [],
    tools: ["shovel"],
    method:
      "Pá em terra (não urbana) → cava buraco → coloque mochila/bag → cobre.",
    durationS: 90,
    category: "base",
    notes: "Esconderijo invisível. Marque coords no mapa de campo.",
  },
  {
    slug: "deploy-tent",
    output: { itemSlug: "medium-tent", qty: 1 },
    inputs: [{ itemSlug: "medium-tent", qty: 1 }],
    method: "Posicione tent no chão → 'Pitch'. Setup ~30s.",
    durationS: 30,
    category: "base",
    notes:
      "Persistente após server reset. Pode ser raidada com pliers (rasga lona).",
  },
  {
    slug: "deploy-sea-chest",
    output: { itemSlug: "sea-chest", qty: 1 },
    inputs: [{ itemSlug: "sea-chest", qty: 1 }],
    tools: ["shovel"],
    method:
      "Coloque sea chest no chão → use pá pra enterrar (esconde da vista).",
    durationS: 45,
    category: "base",
    notes: "25 slots rígidos. Persistente.",
  },

  // ─── TRAVERSAL / VEHICLES ────────────────────────────
  {
    slug: "vehicle-start-checklist",
    output: { itemSlug: "ada-4x4", qty: 1 },
    inputs: [
      { itemSlug: "battery-car", qty: 1 },
      { itemSlug: "spark-plug", qty: 1 },
      { itemSlug: "fuel-can", qty: 1 },
      { itemSlug: "engine-oil", qty: 1 },
      { itemSlug: "brake-fluid", qty: 1 },
      { itemSlug: "car-radiator", qty: 1 },
      { itemSlug: "car-wheel", qty: 4 },
    ],
    tools: ["screwdriver", "wrench"],
    method:
      "Instale TODOS componentes (use wrench/screwdriver) → encha radiator com água → ligue.",
    durationS: 600,
    category: "traversal",
    notes:
      "Sem 1 componente = não liga. Diesel (M3S) usa Glow Plug em vez de Spark Plug.",
  },
  {
    slug: "refuel-vehicle",
    output: { itemSlug: "ada-4x4", qty: 1 },
    inputs: [{ itemSlug: "fuel-can", qty: 1 }],
    method:
      "Use fuel can em tanque do veículo → enche até completar.",
    durationS: 30,
    category: "traversal",
    notes: "Tanque cheio = 30-50 km dependendo do modelo.",
  },

  // ─── SAKHAL ESPECÍFICO ──────────────────────────────
  {
    slug: "ice-fishing-setup",
    output: { itemSlug: "raw-fish", qty: 1 },
    inputs: [{ itemSlug: "fish-trap", qty: 1 }],
    tools: ["ice-axe"],
    method:
      "Use ice axe num lago congelado → buraco → coloque fish trap → aguarde.",
    durationS: 30,
    category: "food",
    notes: "Sakhal-only. Single source de pesca em mapas frios.",
  },
  {
    slug: "snow-shelter",
    output: { itemSlug: "improvised-shelter", qty: 1 },
    inputs: [
      { itemSlug: "long-stick", qty: 6 },
      { itemSlug: "tarp", qty: 1 },
    ],
    tools: ["shovel"],
    method:
      "Combine sticks + tarp + cave neve → abrigo improvisado contra hipotermia.",
    durationS: 90,
    category: "base",
    notes: "Sakhal essencial. Aquecedor + bloqueio de vento.",
  },

  // ─── COMPONENTS ────────────────────────────────────
  {
    slug: "craft-wooden-stick-from-bush",
    output: { itemSlug: "wooden-stick", qty: 4 },
    inputs: [],
    method: "Use mãos em arbusto pequeno → 4 sticks por bush.",
    durationS: 8,
    category: "tool",
    notes: "Sem ferramenta. Bushes são abundantes.",
  },
  {
    slug: "craft-long-stick-from-tree",
    output: { itemSlug: "long-stick", qty: 1 },
    inputs: [],
    tools: ["kitchen-knife", "hatchet"],
    method: "Knife/hatchet em árvore pequena → long stick.",
    durationS: 12,
    category: "tool",
  },
  {
    slug: "fell-log",
    output: { itemSlug: "tree-log", qty: 1 },
    inputs: [],
    tools: ["hatchet", "fire-axe"],
    method: "Machado em árvore grande → 1 log a cada ~40s.",
    durationS: 40,
    category: "base",
    notes: "Fire-axe é mais rápido (~25s/log).",
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
