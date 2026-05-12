/**
 * Catálogo de perfis de mod — mapeia mods comuns do DayZ pra recomendações
 * curadas: dicas de sobrevivência, itens-chave, mecânicas extras e avisos.
 *
 * O matching é case-insensitive substring contra `match[]`. Cada item de
 * match é um keyword normalizado (lowercase, sem caracteres especiais).
 *
 * Critério de inclusão: só mods que MUDAM gameplay de forma notável.
 * Frameworks puros (CF, DabsFramework, CommunityFramework) ficam de fora —
 * não geram recomendação útil pro jogador.
 */

export interface ModProfile {
  slug: string;
  name: string;
  /** Substrings (lowercase) — qualquer match no nome do mod do server ativa o perfil */
  match: string[];
  /** Flaticon UICon sem prefixo */
  icon: string;
  /** Cor do badge — usa tokens CSS do tema */
  tone?: "olive" | "blood" | "brass" | "rust";
  summary: string;
  tips: string[];
  /** Slugs de items que ganham relevância (cross-link com /itens) */
  recommendedItems?: string[];
  /** Mecânicas novas que o player precisa entender */
  mechanics?: string[];
  /** Avisos contextuais (PvP intenso, dificuldade aumentada, etc.) */
  warnings?: string[];
}

export const MOD_PROFILES: ModProfile[] = [
  // ─── Namalsk / Frigid maps ────────────────────────────
  {
    slug: "namalsk",
    name: "Namalsk Island",
    match: ["namalsk", "namalskcrafting", "namalsksurvival", "athena"],
    icon: "snowflake",
    tone: "rust",
    summary:
      "Mapa Sakhal-like (DayZ Mod-era) — frio extremo, anomalias, EVR storms e a estação Athena.",
    tips: [
      "Layer-up obrigatório: thermal underwear + sweater + parka. Botas duplas (wool-socks dentro).",
      "Fogueira a cada 10 min em movimento — temperatura corporal cai constante.",
      "Carregue 2-3 hand-warmers pra emergências em snow storms.",
      "Athena station = endgame loot, mas radiação. Levar charcoal-tablets + máscara.",
      "EVR storm = abrigue-se em building. Ao ar livre = morte por blizzard.",
    ],
    recommendedItems: [
      "thermal-underwear-top",
      "thermal-underwear-bottom",
      "parka-green",
      "balaclava-thermal",
      "fur-mittens",
      "insulated-canteen",
      "hand-warmer-chemical",
      "wool-socks",
      "crampons",
      "snow-goggles",
    ],
    mechanics: [
      "EVR storms ciclam a cada ~2h — alarme audível 5min antes",
      "Anomalias: zonas com partículas distorcidas — atravesse só com Bolts (de Anomaly Detector)",
      "Athena tem geradores que controlam radiação por setor",
    ],
    warnings: [
      "Hipotermia 3× mais rápida que vanilla — checagem visual constante",
      "Hot drinks são CRÍTICOS, não opcional",
    ],
  },

  // ─── DayZ Expansion (currency, vehicles, missions) ────
  {
    slug: "expansion",
    name: "DayZ Expansion",
    match: ["expansion", "dayzexpansion"],
    icon: "settings",
    tone: "olive",
    summary:
      "Suite massiva: helicópteros, mercado, currency, missions, territory flag refinado, base building expandida.",
    tips: [
      "Procure Trader City (marker no mapa Expansion) — safezone garantida.",
      "Currency = moedas físicas no inventário; perdeu PvP = perdeu wallet.",
      "Helicopters spawnam em military zones — peças caras pra reparar.",
      "Missions ativas geram crates de loot — chegue cedo, PvP esperado.",
      "Territory flag agora protege construções; sem flag = despawn em 3-5 dias.",
    ],
    recommendedItems: [
      "territory-flag-pole",
      "car-engine",
      "car-transmission",
      "car-battery",
      "truck-cargo",
    ],
    mechanics: [
      "Marketplace (loja) aceita só Expansion currency; pesquisa o tipo no chat",
      "Air-vehicles: rotor sound carrega ~1km — não pouse perto de NWAF",
      "Quests do Expansion Mission System dão XP + currency",
    ],
  },

  // ─── Trader (Trader Plus etc.) ────────────────────────
  {
    slug: "trader",
    name: "Trader / Trader Plus",
    match: ["traderplus", "dr.jones trader", "drjones", " trader"],
    icon: "boxes",
    tone: "brass",
    summary:
      "Sistema de comércio NPC — vende loot por currency e compra tier alto. Safe-zone em torno do trader.",
    tips: [
      "Não atire dentro da safe-zone — friendly fire bloqueado, mas você ainda pode ser expulso.",
      "Venda tier alto (M4, Plate Carrier) por currency, recompre downgrades + currency reserva.",
      "Trader spec de cada server varia — checa preços no chat antes de viajar 5km.",
      "Stock rotaciona — nem todo trader tem todo item sempre.",
    ],
    recommendedItems: ["plate-carrier", "m4-a1", "akm", "mountain-backpack"],
    mechanics: [
      "Safe-zone bloqueia damage outgoing E incoming em raio ~50m",
      "Currency stack varia (ruble, copper, knspect dollar) — só uma per server",
      "Alguns traders compram só pristine — wear matters",
    ],
    warnings: [
      "Bandits campam saída do trader — saia por rota alternativa, não a estrada principal",
    ],
  },

  // ─── Helicópteros ─────────────────────────────────────
  {
    slug: "helicopters",
    name: "Helicópteros",
    match: ["helicopter", "ka-50", "ka50", "uh-1h", "uh1", "littlebird", "mi-8", "mi8"],
    icon: "shield",
    tone: "olive",
    summary:
      "Modos de transporte vertical — Ka-50 (russo), UH-1H (americano), MI-8 (transporte), LittleBird (recon).",
    tips: [
      "Rotor sound: 800-1200m. Não pouse em military zones — pouso na floresta 500m antes.",
      "Combustível raro — carregue jerry-can como backup.",
      "Partes (rotor, transmission) só em workshops industriais raros.",
      "Auto-rotation se motor falhar — DayZ-Expansion permite landing emergencial.",
    ],
    recommendedItems: ["small-gas-canister", "duct-tape", "wrench", "screwdriver-philips"],
    mechanics: [
      "Helicopter parts spawnam em factory + heli crashes",
      "Vento afeta controle em altitudes >300m",
      "Sem rotor blade pristine = autorotação não funciona",
    ],
    warnings: ["Você é o alvo mais visível do mapa quando voando — espere fogo AA"],
  },

  // ─── Base Building Plus (BBP) ─────────────────────────
  {
    slug: "bbp",
    name: "Base Building Plus",
    match: ["basebuildingplus", "bbp", "buildingplus"],
    icon: "fence",
    tone: "olive",
    summary:
      "Expansão de base building — mais variantes de wall, gate, roof, windows funcionais e bunkers.",
    tips: [
      "Watchtower agora tem ladder retraível — anti-raid mais agressivo.",
      "Gates 5-dígitos disponíveis (vs 4 vanilla) — bruteforce 10× mais difícil.",
      "Windows funcionais: dá pra atirar de dentro sem expor.",
      "Concrete tier exige cimento — só em construction yards.",
    ],
    recommendedItems: [
      "watchtower-kit",
      "wooden-fence-kit",
      "metal-gate",
      "combination-lock",
      "barbed-wire",
    ],
    mechanics: [
      "Stages adicionais por estrutura (até 6 vs 4 vanilla)",
      "Concrete walls não cedem a hatchet — só sledgehammer",
      "Some BBP servers permitem stacking de fence (paredão duplo)",
    ],
  },

  // ─── Mods de armas (MMG, SNAFU, etc.) ─────────────────
  {
    slug: "extra-weapons",
    name: "Pack de armas extras",
    match: ["snafu", "mmg", "munghard", "weaponredux", "armagedron"],
    icon: "bullet",
    tone: "olive",
    summary:
      "Adiciona armas (M249, MG3, MP7, Glock-18, Galil, etc.) e attachments além do vanilla.",
    tips: [
      "Pesquisa o spawn de calibres novos — 5.7mm, .50 BMG não compartilham com vanilla.",
      "Attachments podem ou não ser cross-compatíveis com vanilla — testa antes de carregar peso.",
      "LMGs (M249) drenam ammo rápido — só vale se você tem 200+ rounds.",
    ],
    recommendedItems: ["weapon-cleaning-kit", "duct-tape"],
    mechanics: [
      "Algumas armas modded ignoram body armor vanilla — verifica patch notes",
      "Spawn rates costumam ser MAIS BAIXOS que vanilla pra balance",
    ],
  },

  // ─── Vehicle packs ────────────────────────────────────
  {
    slug: "extra-vehicles",
    name: "Pack de veículos",
    match: ["vehiclepack", "vehiclepacks", "morevehicles", "trucks", "humvee"],
    icon: "shield",
    tone: "olive",
    summary:
      "Adiciona Humvee, V3S, BMW, Lada Niva, motos. Geralmente exige peças adicionais.",
    tips: [
      "Humvee/V3S = caminhão militar com bagagem enorme — mas combustível Diesel especial.",
      "Motos: rápido + stealth, mas zero proteção.",
      "Cada vehicle modded tem peças únicas — não troca com base game.",
    ],
    recommendedItems: ["car-engine", "car-transmission", "car-battery", "spark-plug", "glow-plug"],
    mechanics: [
      "Diesel vs Gasoline: confira tipo de combustível por veículo",
      "Cargo capacity varia muito — Humvee carrega 80+ slots, BMW 12",
    ],
  },

  // ─── Code Lock / lockpicking ─────────────────────────
  {
    slug: "codelock",
    name: "Code Lock",
    match: ["codelock", "code lock", "lockpick"],
    icon: "shield",
    tone: "brass",
    summary:
      "Combination locks com 4-6 dígitos + lockpicking funcional como mecânica de raid.",
    tips: [
      "Lockpick reduz bruteforce de 1h pra 10-15 min — mas quebra 30% das tentativas.",
      "Codes 6-dígitos: 1M combinações vs 10k. Brute solo = inviável.",
      "Mude o code semanalmente — alguns mods loggam tentativas pro admin.",
    ],
    recommendedItems: ["lockpick", "combination-lock", "screwdriver-philips"],
    mechanics: [
      "Code change requer ferramenta específica (screwdriver vanilla, ou wrench modded)",
      "Lockpick é single-use 70% das vezes — leve 3-5",
    ],
  },

  // ─── Banking / ATM ────────────────────────────────────
  {
    slug: "banking",
    name: "Banking / ATM",
    match: ["banking", "atm", "banksystem"],
    icon: "boxes",
    tone: "brass",
    summary:
      "Sistema de depósito persistente — não perde currency em morte, só o que está no inventário.",
    tips: [
      "Deposite TUDO antes de raid/PvP — só leve o necessário no inventário.",
      "ATMs ficam em traders + cities — não rural.",
      "Algumas versões cobram taxa por saque — leia o servidor.",
    ],
  },

  // ─── Party / Group system ─────────────────────────────
  {
    slug: "party",
    name: "Group / Party",
    match: ["partyme", "schanagroup", "groupplayers"],
    icon: "user",
    summary:
      "HUD mostra teammates no mapa, marca friendlies em verde. Reduz friendly-fire.",
    tips: [
      "Crie party antes da raid — marcadores ajudam coordenação.",
      "Friendly indicators evitam KOS acidental.",
      "Não diga senha do server no chat group — vaza pra spectadors.",
    ],
  },

  // ─── Auto-run / convenience ──────────────────────────
  {
    slug: "autorun",
    name: "Auto-Run / Convenience",
    match: ["simpleautorun", "autorun", "autosprint", "autowalk"],
    icon: "settings",
    summary:
      "Hotkey pra correr/andar sem segurar W. QoL massivo em servers com mapas grandes.",
    tips: [
      "Bind tecla pra auto-run (default varia) — descanse os dedos em viagens longas.",
      "Não funciona com weight overload — drena stamina mesmo em auto.",
    ],
  },

  // ─── AI bandits / NPCs ───────────────────────────────
  {
    slug: "ai",
    name: "AI / Bandits NPC",
    match: ["expansion-ai", "redfalcon", "ai bandit", "aibandits"],
    icon: "skull",
    tone: "blood",
    summary:
      "NPCs hostis spawnam em loot zones e patrulham. Difficulty varia por mod.",
    tips: [
      "AI usa tiers de equipamento — bandits civilian em vilas, military em tier 3.",
      "Som de tiro AI revela sua posição também — fight = expose.",
      "Tier alto AI dropa loot decente — vale o engage se você está geared.",
    ],
    recommendedItems: ["plate-carrier", "ballistic-helmet", "press-vest", "saline-iv"],
    warnings: [
      "AI tem aimbot relativo em alguns mods — cobertura sólida é mandatória",
      "Aggro range: 50-150m dependendo do mod",
    ],
  },

  // ─── DayZ Dog ────────────────────────────────────────
  {
    slug: "dog",
    name: "DayZ Dog Companion",
    match: ["dayz-dog", "dogcompanion", "domesticdog"],
    icon: "shield",
    summary:
      "Cães domesticáveis que seguem o player, atacam infectados e alertam de threats.",
    tips: [
      "Tame cachorro com raw-steak pristine. Pode levar 3-5 tentativas.",
      "Dog cura por dormir — não fica patrulhando quando dorme.",
      "Som de latido revela posição em PvP — comando 'silent' antes de ambush.",
    ],
    recommendedItems: ["raw-rabbit-meat"],
  },

  // ─── Zombies++ / harder Z ────────────────────────────
  {
    slug: "harder-zombies",
    name: "Zombies modificados",
    match: ["pvzmod", "infectedz", "smarterzombies", "zenfectedmod"],
    icon: "skull",
    tone: "blood",
    summary:
      "Zumbis mais rápidos, agressivos, com sprint contínuo ou ataques especiais.",
    tips: [
      "Hatchet/Knife não basta — leve uma 9mm pra emergência.",
      "Não corra reto — Z's modificados perseguem por mais tempo que vanilla.",
      "Cidades grandes ficam impraticáveis solo — vá em duo.",
    ],
    recommendedItems: ["fireaxe", "machete", "cr-75", "mp5k"],
    warnings: ["Aggro de tiro pode chamar 10+ Z's em modded city"],
  },

  // ─── Build Anywhere ──────────────────────────────────
  {
    slug: "buildanywhere",
    name: "Build Anywhere",
    match: ["buildanywhere", "bbplus build", "gamelabs build"],
    icon: "fence",
    summary:
      "Permite construção fora dos slots vanilla — inclusive dentro de prédios.",
    tips: [
      "Bunker em apartment building = anti-raid forte mas óbvio.",
      "Construir em military zones violado regra de alguns servers — leia rules.",
      "Stash dentro de building = não despawna por terra remoção.",
    ],
  },

  // ─── PvE servers ─────────────────────────────────────
  {
    slug: "pve",
    name: "PvE Rules",
    match: ["pve only", "pve server", "pve-only", "no-pvp", "nopvp"],
    icon: "shield-check",
    tone: "olive",
    summary:
      "Servidores onde PvP é proibido por regra (player kill = ban). Foco em survival + base building.",
    tips: [
      "Cooperação é norm — call out friendly cedo em interactions.",
      "Stash não precisa ser escondida; foque em capacity vs camouflage.",
      "Algumas zonas (Tisy, NWAF) podem manter PvP — leia rules.",
    ],
  },
];

/**
 * Casa um perfil contra um mod name do servidor. Match: substring lowercase
 * (normaliza espaços + remove caracteres especiais comuns de nomenclatura).
 */
export function matchProfiles(modNames: readonly string[]): ModProfile[] {
  const norm = modNames.map((m) =>
    m
      .toLowerCase()
      .replace(/[_\-.\s]+/g, " ")
      .trim(),
  );
  const matched = new Set<string>();
  for (const profile of MOD_PROFILES) {
    if (matched.has(profile.slug)) continue;
    for (const keyword of profile.match) {
      const k = keyword.toLowerCase().replace(/[_\-.\s]+/g, " ").trim();
      if (norm.some((m) => m.includes(k))) {
        matched.add(profile.slug);
        break;
      }
    }
  }
  return MOD_PROFILES.filter((p) => matched.has(p.slug));
}
