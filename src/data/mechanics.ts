/**
 * Mecânicas de jogo — sistemas que não cabem em "stat" ou "doença".
 * Cobre damage zones, combate, hunting, persistência, veículos, etc.
 *
 * Renderizado em /sobrevivencia como segunda metade da página.
 */

export interface MechanicSection {
  slug: string;
  title: string;
  icon: string;
  /** Tone das badges/header — alinha com tipo de risco */
  tone: "olive" | "brass" | "blood" | "rust" | "radiation";
  intro: string;
  /** Lista de bullets — cada um é uma regra/observação técnica */
  rules: string[];
  /** Tabela opcional pra dados estruturados (zonas de dano, tipo sanguíneo, etc) */
  table?: {
    columns: string[];
    rows: Array<string[]>;
  };
}

export const MECHANICS: MechanicSection[] = [
  {
    slug: "damage-zones",
    title: "Zonas de Dano",
    icon: "shield",
    tone: "blood",
    intro:
      "Onde acerta importa MUITO — DayZ tem hitbox detalhado. Headshot mata; perna atinge stamina e movement.",
    rules: [
      "Cabeça: mata one-shot com qualquer rifle. Capacete reduz mas não anula.",
      "Torso (peito/abdômen): dano alto. Plate Carrier com plate cerâmica absorve até 5.56/7.62.",
      "Braços: causa shock + drop de arma se severo.",
      "Pernas: 'leg broken' = não corre. Tala ou morfina obrigatória.",
      "Mãos: sangramento + animation longa pra bandage.",
      "Dano extra em pés se descalço (pisar em vidro, contaminação).",
    ],
    table: {
      columns: ["Zona", "Multiplicador", "Efeitos especiais"],
      rows: [
        ["Cabeça (sem capacete)", "×3.0", "One-shot kill"],
        ["Cabeça (com capacete)", "×1.5", "Pode sobreviver tiro 5.56"],
        ["Torso (sem vest)", "×1.0", "Sangramento garantido"],
        ["Torso (Plate Carrier+plate)", "×0.4", "Plate degrada por tiro"],
        ["Pernas", "×0.7", "Broken legs em 30+ dano"],
        ["Braços", "×0.7", "Shock alto, drop de arma"],
      ],
    },
  },
  {
    slug: "blood-shock-system",
    title: "Sangue × Shock",
    icon: "first-aid",
    tone: "blood",
    intro:
      "Dois sistemas separados. SHOCK regenera; SANGUE não. Confusão mata sobreviventes — entenda a diferença.",
    rules: [
      "Sangue: 5000 max. Cai por sangramento, hit, doença. NÃO regenera passivamente — só com saline IV, blood bag, comida+hidratação alta + saúde alta.",
      "Shock: causado por hits (mesmo sem sangrar). Regenera passivamente em ~2-5 min. Quando shock > sangue → unconscious.",
      "Tela preto-e-branco = sangue baixo (<3000). Tela borrada = shock alto.",
      "Painkillers reduzem tremor da câmera (efeito visual de shock alto).",
      "Epinephrine remove unconscious imediatamente — emergency-use-only.",
      "Reservar saline IV: aplica sem precisar saber tipo sanguíneo, ganha 500 sangue + hidratação.",
    ],
  },
  {
    slug: "blood-types",
    title: "Tipos Sanguíneos",
    icon: "first-aid",
    tone: "blood",
    intro:
      "Transfusão de tipo errado = anafilaxia + morte. SEMPRE confirme antes de aplicar Blood Bag.",
    rules: [
      "Blood Test Kit revela tipo (papel impresso). Salve numa caixa.",
      "O- é doador universal: pode doar pra TODOS, mas só recebe O-.",
      "AB+ é receptor universal: recebe TODOS, mas só doa pra AB+.",
      "Sem certeza? Use SALINE IV (não tem antígeno, sem risco).",
      "Reação errada: tela vermelha + 1500 sangue perdido + chance de morte.",
    ],
    table: {
      columns: [
        "Tipo Receptor",
        "Aceita doadores",
        "Pode doar para",
      ],
      rows: [
        ["O-", "O-", "Todos (universal)"],
        ["O+", "O-, O+", "O+, A+, B+, AB+"],
        ["A-", "O-, A-", "A-, A+, AB-, AB+"],
        ["A+", "O-, O+, A-, A+", "A+, AB+"],
        ["B-", "O-, B-", "B-, B+, AB-, AB+"],
        ["B+", "O-, O+, B-, B+", "B+, AB+"],
        ["AB-", "O-, A-, B-, AB-", "AB-, AB+"],
        ["AB+", "Todos (universal receptor)", "AB+"],
      ],
    },
  },
  {
    slug: "stamina-system",
    title: "Estamina & Carga",
    icon: "bolt",
    tone: "olive",
    intro:
      "Peso afeta stamina drasticamente. Acima de 15kg, sprint é punido. Conheça o seu limite.",
    rules: [
      "Sprint drena stamina ~10/seg. Andar parado regenera ~3/seg.",
      "Saltar gasta ~30 stamina por jump.",
      "Carga ≤15kg = full stamina. 15-25kg = -25%. 25kg+ = quase sem sprint.",
      "Comer e beber regularmente mantém stamina alta. Hungry/Thirsty cortam regen pela metade.",
      "Frio também afeta — tremores gastam energia.",
      "Coyote/Mountain backpacks pesam vazias 4-8kg — conta no total.",
    ],
  },
  {
    slug: "weapon-noise",
    title: "Som de Armas",
    icon: "volume-mute",
    tone: "brass",
    intro:
      "Cada calibre tem alcance de detecção diferente. Map awareness começa pelo ouvido.",
    rules: [
      "Pistolas (9mm/.45): ~300m raio audível.",
      "5.56 (M4) sem supressor: ~700m.",
      "7.62 (AKM, Mosin) sem supressor: 1200m+.",
      "Supressor reduz ~70% do raio (5.56 sup: ~200m).",
      "Subsônica (9×39 VSS, .45 ACP padrão): naturalmente quieta, sem supressor.",
      "Atalho: tirar tiro = todos players num círculo de 1km vão olhar pro mapa.",
    ],
  },
  {
    slug: "vehicle-checklist",
    title: "Ligar um Veículo",
    icon: "shield",
    tone: "rust",
    intro:
      "Sem 1 componente o carro não anda. Checklist obrigatório:",
    rules: [
      "1. Bateria de Carro instalada (engine bay, com chave de fenda).",
      "2. Spark Plug (gasolina) OU Glow Plug (M3S diesel).",
      "3. Engine Oil — verificado e cheio.",
      "4. Brake Fluid — sem ele, freio não atua.",
      "5. Radiator + água (encha com canteen no radiator).",
      "6. Combustível no tanque — use fuel can.",
      "7. 4 rodas instaladas (carros). Tractor usa rodas grandes específicas.",
      "8. Ada 4×4 também precisa de Headlights pra dirigir à noite com segurança.",
      "9. Em modo dirigir: F → ligar motor. Painel mostra RPM + temp + fuel.",
    ],
    table: {
      columns: ["Veículo", "Combustível", "Componentes únicos"],
      rows: [
        ["Ada 4×4", "Gasolina", "Bateria, Vela, Radiator, Wheel ×4"],
        ["Sarka 120", "Gasolina", "Mesma da Ada"],
        ["Olga 24", "Gasolina", "Mesma; mais leve"],
        ["Gunter 2", "Gasolina", "Mesma"],
        ["Hatchback 02", "Gasolina", "Mesma"],
        ["Sedan 02", "Gasolina", "Mesma"],
        ["M3S (caminhão)", "Diesel", "Glow Plug em vez de Spark Plug"],
        ["Tractor", "Gasolina", "Wheels grandes específicas"],
      ],
    },
  },
  {
    slug: "hunting-skinning",
    title: "Caça & Esquartejamento",
    icon: "knife",
    tone: "olive",
    intro:
      "Caçar é a principal fonte de calorias em PvE longo. Saiba abater + esquartejar.",
    rules: [
      "Animais grandes (vaca/cervo/javali): 1 tiro de rifle no torso ou cabeça mata.",
      "Pistola pesada (.357, .45) = 3-5 tiros no torso.",
      "Lobo: cuidado — caça em matilha. Use rifle, mate o líder primeiro.",
      "Urso (Livonia/Sakhal): boss. Aguenta múltiplos tiros 7.62. Usa rifle bolt-action high-cal.",
      "Galinhas/coelhos: 1 hit melee suficiente.",
      "Skin/quarter: use Knife (ou Hatchet) no animal abatido → 'Skin' → 'Quarter'.",
      "Vaca rende 8-10 steaks + Cow Pelt grande. Cervo: 6-8 + Deer Pelt.",
      "Coelho: 1-2 raw rabbit + Rabbit Pelt (importante pra mochila improv).",
      "Galinha: 1 Raw Chicken + 2-3 feathers + chance de Egg.",
      "TODA carne crua = doença. Cozinhe SEMPRE.",
    ],
  },
  {
    slug: "persistence-rules",
    title: "Persistência & Server Reset",
    icon: "shield",
    tone: "olive",
    intro:
      "Itens NA MÃO desaparecem em logout? Itens em base sobrevivem? Entenda persistence.",
    rules: [
      "Inventário do personagem PERSISTE em logout — você volta com tudo.",
      "Items dropados no chão: vida útil ~30 min (lifetime by server config).",
      "Tents, Sea Chests, Wooden Crates, Barrel: persistem ~7 dias se INTERAGIDOS pelo menos 1×.",
      "Fences/Watchtowers: persistem ~45 dias (precisa interagir pelo menos 1× a cada ~7 dias pra reset timer).",
      "Garden plot: persiste mas plantas morrem se não regadas.",
      "Carros: persistem por inatividade de jogador, não tempo. Saia DENTRO do carro pra não despawnar.",
      "Server reset (3-4h em vanilla): respawna loot, NÃO remove builds/storage.",
      "ItemDespawnTimer reseta toda vez que algo é guardado/retirado da container.",
    ],
  },
  {
    slug: "weather-temperature",
    title: "Clima & Temperatura",
    icon: "thermometer-half",
    tone: "rust",
    intro:
      "Hipotermia mata mais que zumbi em Sakhal. Conheça os fatores.",
    rules: [
      "Temperatura corpo ideal: 36-37°C. Abaixo = tremor; acima = heatstroke.",
      "Roupa molhada drena temperatura ~3× mais rápido. Seque perto de campfire.",
      "Travessar rio = encharca todas roupas. Plan accordingly.",
      "Chuva + sem cobertura = -1°C/min em corpo.",
      "Noite Chernarus: -2 a +5°C dependendo da estação.",
      "Sakhal: blizzards podem cair pra -15°C. Snowshoes + Winter Coat + Thermal Blanket essenciais.",
      "Campfire dá +10°C de calor num raio de 5m.",
      "Comida quente (steak cozido recém) dá warmth temporário interno.",
    ],
  },
  {
    slug: "inventory-tetris",
    title: "Inventário & Slots",
    icon: "boxes",
    tone: "olive",
    intro:
      "Slot management = mochila quebrada vs survivor preparado. Cada item ocupa W×H slots.",
    rules: [
      "Personagem base: Pants (limited), Vest (depends), Backpack (largest).",
      "Plate Carrier sem pouches: 4×4. Com pouches: até 4×6.",
      "Mountain Backpack: 6×10 (60 slots) — top tier.",
      "Items 'fitting': use sticks 1×3, mags 1×1, food 1×1, rifles 6×3 vertical.",
      "Truques: stack de mags em STANAG 1×2 economiza espaço.",
      "Container nesting: ammo box dentro de mochila — aceita só ammo/mags.",
      "Dropping itens não-críticos pra carregar arma + mag + bandage minimum.",
    ],
  },
  {
    slug: "infected-zombies",
    title: "Infectados (Zumbis)",
    icon: "biohazard",
    tone: "blood",
    intro:
      "Z's são fácil sozinhos, devastadores em grupo. Conheça padrões.",
    rules: [
      "Detectam: visão (cone ~30m), audição (tiro = 200m+), olfato (sangue na arma).",
      "Walking infected: lento, fácil melee. Running infected: corre tão rápido quanto você.",
      "Hits: chance de causar wound infection se sangrar — desinfetante ANTES de bandagem.",
      "Headshot kills 1-shot até com pistola .22.",
      "Body shots: 5.56/7.62 mata em 1-2; pistola fraca = 3-5.",
      "Crouch + sneak reduz visão deles em ~50%.",
      "Hordes em zonas militares: 5-15 z's. Use silenciado ou melee em corredor estreito.",
      "Special infected (Cleric, Soldier): mais HP, drop loot melhor.",
    ],
  },
  {
    slug: "keybinds-essential",
    title: "Keybinds Essenciais",
    icon: "settings",
    tone: "brass",
    intro:
      "Padrões vanilla — customize em Settings → Controls. Conhece eles de cor.",
    rules: [
      "Tab: inventário",
      "G: chat de voz proximity (use!)",
      "F: interagir / pegar item / entrar veículo",
      "X: trocar postura (de pé / agachado / deitado)",
      "C: agachar (toggle)",
      "B: levantar arma (raise weapons / aim down)",
      "Mouse2: aim (segura)",
      "R: recarregar (segura para acessar mags do inventário)",
      "T: trocar firing mode (semi/full auto)",
      "M: mapa (se tiver mapa físico no inventário)",
      "Space: pular (gasta stamina)",
      "Shift: sprint (gasta stamina)",
      "1-3: hotbar quick-equip",
      "F1-F4: emoticons rápidos (waving, stop, follow)",
    ],
  },
  {
    slug: "loot-economy",
    title: "Loot Tier System",
    icon: "boxes",
    tone: "brass",
    intro:
      "Vanilla classifica zonas em tiers 1-4. Cada tier tem seu pool. Não vai pra Tier 4 esperando achar bandage.",
    rules: [
      "Tier 1 (litoral): comida básica, roupas civis, IJ-70, Sporter 22.",
      "Tier 2 (interior, vilas): SKS, Mosin, Hunter clothes, basic medical.",
      "Tier 3 (military bases pequenas): AKM, KA-M, Press Vest, AKM mags.",
      "Tier 4 (Tisy, NWAF, heli): M4-A1, Plate Carrier, ACOG, VSS, LAR.",
      "Loot respawna gradualmente em zonas vazias (não imediato no server reset).",
      "'Dynamic events' (heli crashes, contamination zones) substituem loot estático em locais.",
      "Sakhal/Livonia têm tier-bonus em zonas específicas (Livonia bunker, Sakhal volcano).",
    ],
  },
];
