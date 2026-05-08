/**
 * Glossário de termos do DayZ. Cobre gírias da comunidade, mecânicas
 * implícitas e abreviações frequentes em chat/voice.
 */

export interface GlossaryTerm {
  term: string;
  abbr?: string;
  category: "comunidade" | "combate" | "loot" | "tecnico" | "social";
  definition: string;
  /** Slugs de itens/mecânicas relacionados pra cross-link */
  related?: string[];
}

export const GLOSSARY: GlossaryTerm[] = [
  // ─── COMUNIDADE / GÍRIA ──────────────────────────
  {
    term: "Bambi",
    category: "comunidade",
    definition:
      "Player fresh-spawn, sem equipamento, vulnerável. Vem de 'Bambi' (cervo bebê). Geralmente vestindo a roupa default da costa.",
  },
  {
    term: "Fresh Spawn",
    abbr: "FS",
    category: "comunidade",
    definition:
      "Personagem recém-criado, spawnou na costa sem nada. Primeiros 30 minutos de jogo até pegar loot básico.",
  },
  {
    term: "KOS",
    abbr: "Kill On Sight",
    category: "social",
    definition:
      "Atira em qualquer um que ver, sem perguntar. Comportamento padrão em servers high-pop. PvE servers proíbem.",
  },
  {
    term: "Friendly",
    category: "social",
    definition:
      "Player que NÃO atira primeiro. Falar 'I'm friendly!' no voice chat é o cumprimento universal — funciona ~50% das vezes.",
  },
  {
    term: "Bandit",
    category: "social",
    definition:
      "Player hostil que assalta, mata, escraviza. Termo do DayZ Mod onde havia karma visível.",
  },
  {
    term: "Hero",
    category: "social",
    definition: "Oposto de bandit — ajuda fresh spawns, doa loot, salva caídos.",
  },
  {
    term: "Server Hopper",
    abbr: "Hopper",
    category: "social",
    definition:
      "Pula entre servers pra encontrar loot raro respawnado. Considerado pegada-baixa pela comunidade.",
  },
  {
    term: "Cheeki Breeki",
    category: "comunidade",
    definition:
      "Gíria adotada do S.T.A.L.K.E.R. Personifica o squad russo agressivo. Frequente entre Adidas-clad bandits.",
  },
  {
    term: "Fresh Cherno",
    category: "comunidade",
    definition: "Fresh spawn que tomou Chernogorsk antes de vestir nada decente.",
  },
  {
    term: "Geared",
    category: "comunidade",
    definition: "Player full-equipado: M4/AK + Plate Carrier + Mountain Backpack + medic kit.",
  },

  // ─── COMBATE ─────────────────────────────────────
  {
    term: "1-Tap",
    abbr: "1T",
    category: "combate",
    definition: "Headshot que mata em 1 tiro. Mosin/SVD/M4 conseguem em qualquer alcance até 600m+.",
  },
  {
    term: "Tap-fire",
    category: "combate",
    definition:
      "Atirar em rajadas curtas (2-3 tiros) em vez de full-auto. Mantém precisão a média distância.",
    related: ["m4-a1", "akm"],
  },
  {
    term: "PvP",
    abbr: "Player vs Player",
    category: "combate",
    definition: "Combate entre players. Ocorre principalmente em hot zones (NWAF, Tisy, Heli crashes).",
  },
  {
    term: "Hot Zone",
    category: "combate",
    definition:
      "Área de alta probabilidade de PvP — alto loot value atrai players. Tisy, NWAF, Heli, Rify, Elektro.",
    related: ["tisy", "north-west-airfield"],
  },
  {
    term: "Heli Crash",
    abbr: "Heli",
    category: "loot",
    definition:
      "Spawn dinâmico de helicóptero abatido. Loot tier 4 garantido (M4, AKM, ACOG). Aparece a cada ~30 min em local random.",
  },
  {
    term: "Convoy",
    category: "loot",
    definition:
      "Comboio militar dinâmico em Sakhal/contamination zones. Tier máximo (LAR, Deagle, Plate Carrier).",
  },
  {
    term: "Combat Logging",
    abbr: "CL",
    category: "social",
    definition:
      "Desconectar durante PvP pra fugir da morte. Vanilla aplica timer 30s — inimigo pode te matar mesmo offline.",
  },
  {
    term: "Ghosting",
    category: "social",
    definition:
      "Trocar de server pra reposicionar atrás do inimigo. Considerado cheating em servers oficiais.",
  },
  {
    term: "Glitching",
    category: "social",
    definition:
      "Explorar bugs (wall glitch, item duplication, server crash). Bana em oficiais.",
  },
  {
    term: "Spray and Pray",
    category: "combate",
    definition:
      "Full-auto sem mira. Funciona em CQB; desperdiça ammo em distância.",
  },

  // ─── LOOT ───────────────────────────────────────
  {
    term: "Loot Tier",
    category: "loot",
    definition:
      "Sistema 1-4 que classifica raridade de spawn. Tier 1 = costa (IJ-70, comida). Tier 4 = Tisy/Heli (M4, ACOG).",
  },
  {
    term: "BIS",
    abbr: "Best In Slot",
    category: "loot",
    definition:
      "Item top da categoria. Ex: VSS é BIS sniper-suprimida; Plate Carrier é BIS vest.",
  },
  {
    term: "Stash",
    category: "loot",
    definition:
      "Esconderijo pessoal. Underground (com pá), Sea Chest, Wooden Crate, Tent. Persistente após server reset.",
    related: ["underground-stash", "sea-chest"],
  },
  {
    term: "Hopper Spawn",
    category: "loot",
    definition:
      "Loot que respawna em zonas vazias após algum tempo. Server hoppers exploram isso.",
  },
  {
    term: "Static Contamination",
    category: "loot",
    definition:
      "Zonas permanentemente contaminadas (Rify, Heli SE, NW). Loot tier 4 + zumbis especiais. Requer Gas Mask + filtros.",
    related: ["gas-mask", "gas-mask-filter"],
  },
  {
    term: "Dynamic Event",
    category: "loot",
    definition: "Spawn timed (heli crash, contamination zone, convoy) que aparece em local random.",
  },

  // ─── TÉCNICO ────────────────────────────────────
  {
    term: "1PP",
    abbr: "First Person Perspective",
    category: "tecnico",
    definition:
      "Modo só primeira pessoa. Hardcore. Sem peeking por câmera 3rd person — combate mais leal.",
  },
  {
    term: "3PP",
    abbr: "Third Person Perspective",
    category: "tecnico",
    definition:
      "Câmera atrás do personagem. Permite peeking sobre objetos sem exposição. Default em servers casual.",
  },
  {
    term: "Persistence",
    category: "tecnico",
    definition:
      "Sistema que mantém estado de items/builds após reset do server. Storage tem timer (30 dias se interagido).",
  },
  {
    term: "Server Reset",
    category: "tecnico",
    definition:
      "Restart programado (vanilla = 4h). Refaz spawn de loot, mantém persistence.",
  },
  {
    term: "Nightcycle",
    category: "tecnico",
    definition:
      "Vanilla servers tipicamente 16:1 dia:noite. Significa noite real curta in-game. Modded servers variam.",
  },
  {
    term: "Tickrate",
    category: "tecnico",
    definition:
      "Frequência de atualização do server (Hz). Vanilla = 30. Higher = combate mais responsivo, mas custa CPU server.",
  },
  {
    term: "Lifetime",
    category: "tecnico",
    definition:
      "Tempo até item ser despawnado (config types.xml). Loot solto: ~30min. Tents: ~7 dias. Fences: ~45 dias.",
  },
  {
    term: "Hive",
    category: "tecnico",
    definition:
      "Database compartilhada entre servers. Public Hive = personagem segue de server pra server (oficiais). Private Hive = isolado.",
  },
  {
    term: "Subsônica",
    category: "combate",
    definition:
      "Munição que viaja abaixo de 343 m/s. Naturalmente silenciosa. 9×39 (VSS), .45 ACP padrão, .22 LR.",
    related: ["vss", "ump45", "sporter-22"],
  },
  {
    term: "STANAG",
    category: "loot",
    definition:
      "Standardized magazine pattern OTAN para 5.56. M4-A1, KA-101 usam. Cap 30 default; existem 60rd drum.",
    related: ["stanag-mag", "m4-a1"],
  },

  // ─── SOCIAL / SERVER ────────────────────────────
  {
    term: "Squad",
    category: "social",
    definition: "Grupo organizado de players. Vanilla não tem sistema oficial — usa voice + cores de roupa.",
  },
  {
    term: "Clan",
    category: "social",
    definition: "Grupo permanente com nome, base, identidade. Comum em DayZ vanilla competitivo.",
  },
  {
    term: "RP Server",
    abbr: "Role-Playing",
    category: "social",
    definition:
      "Servers focados em interpretação. Personagem persistente, histórias longas. DayZRP é o maior.",
  },
  {
    term: "Whitelist",
    category: "social",
    definition:
      "Servers que requerem aprovação manual pra entrar. Reduz bandits, eleva qualidade do RP.",
  },
  {
    term: "Hardcore",
    category: "social",
    definition:
      "Server config: 1PP only, sem crosshair, ammo limitado, perma-death. Comunidade competitiva.",
  },
  {
    term: "PvE",
    category: "social",
    definition:
      "Server onde matar players é proibido (admin punido). Foco em build/explore. Common em communities casuais.",
  },
];

export const GLOSSARY_BY_CATEGORY = {
  comunidade: GLOSSARY.filter((t) => t.category === "comunidade"),
  combate: GLOSSARY.filter((t) => t.category === "combate"),
  loot: GLOSSARY.filter((t) => t.category === "loot"),
  tecnico: GLOSSARY.filter((t) => t.category === "tecnico"),
  social: GLOSSARY.filter((t) => t.category === "social"),
};
