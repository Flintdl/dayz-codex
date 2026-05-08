/**
 * Quiz interativo — testes situacionais comuns no DayZ.
 * Cada questão tem múltipla escolha + explicação detalhada.
 */

export interface QuizQuestion {
  id: string;
  scenario: string;
  question: string;
  options: Array<{
    label: string;
    correct: boolean;
    explanation: string;
  }>;
  difficulty: "fresh" | "intermediate" | "veteran";
}

export const QUIZ: QuizQuestion[] = [
  {
    id: "fresh-spawn-elektro",
    difficulty: "fresh",
    scenario:
      "Você spawnou em Elektro (costa SE). Tem fome 'Hungry', sede 'Thirsty', sem mochila, com camisa azul.",
    question: "Qual a primeira ação?",
    options: [
      {
        label: "Entra na cidade procurando loot",
        correct: false,
        explanation:
          "Elektro é hot zone — geared players caçam fresh spawns aqui. ~70% chance de morrer no primeiro prédio.",
      },
      {
        label: "Sai da cidade pelo Norte rumo a vila menor",
        correct: true,
        explanation:
          "Correto. Vilas menores (Pulkovo, Khelm) têm loot suficiente sem PvP. Saia da costa em 5 min máximo.",
      },
      {
        label: "Espera outro fresh spawn pra duar",
        correct: false,
        explanation:
          "Risco enorme — outro fresh spawn pode ser bandit, e ficar parado em Elektro = denúncia ao snipe.",
      },
      {
        label: "Segue a costa pra Berezino",
        correct: false,
        explanation:
          "Costa = death sentence. Toda cidade litorânea tem PvP ativo. Vá pro interior.",
      },
    ],
  },
  {
    id: "broken-leg-mid-fight",
    difficulty: "intermediate",
    scenario:
      "Você tomou tiro de Mosin que NÃO matou mas quebrou perna. Sangrando, no chão. Tem 1 bandage, 1 rag, 0 morfina, 0 splint, 1 wooden stick.",
    question: "O que faz?",
    options: [
      {
        label: "Aplica bandage primeiro",
        correct: true,
        explanation:
          "Sangramento mata mais rápido que perna quebrada. Estanca primeiro. Depois pensa em mobilidade.",
      },
      {
        label: "Crafta splint com stick + rag",
        correct: false,
        explanation:
          "Splint precisa de 2 sticks + rag + bandage. Você só tem 1 stick. Estanque sangramento primeiro de qualquer forma.",
      },
      {
        label: "Saca pistola e atira de volta sem tratar",
        correct: false,
        explanation:
          "Sangrar até unconscious dura ~30s. Inimigo sabe disso e vai aproximar pra finalizar. Trate ou perdeu.",
      },
      {
        label: "Logout combat (alt+F4)",
        correct: false,
        explanation:
          "Vanilla aplica timer de 30s no logout. Inimigo te mata mesmo offline. Tradição feia + bana em servers oficiais.",
      },
    ],
  },
  {
    id: "blood-transfusion-unknown",
    difficulty: "veteran",
    scenario:
      "Aliado caído com sangue 800 (perigo). Você tem Blood Bag tipo A+, IV Start Kit, Saline IV. NÃO sabe o tipo do aliado.",
    question: "Qual aplicar?",
    options: [
      {
        label: "Saline IV — sem risco",
        correct: true,
        explanation:
          "CORRETO. Saline (salina) não tem antígeno → nunca causa reação hemolítica. +500 sangue + hidratação. Use Saline em qualquer dúvida.",
      },
      {
        label: "Blood Bag A+ direto — 50% chance ele aceitar",
        correct: false,
        explanation:
          "Tipo errado = ANAFILAXIA. Sangue cai 1500 + chance de matar. Não vale a aposta.",
      },
      {
        label: "Espera ele acordar pra aplicar Blood Test Kit",
        correct: false,
        explanation:
          "Sangue 800 = ele NÃO vai acordar sem ajuda. Saline IV imediato é a resposta.",
      },
      {
        label: "Aplica Epinephrine pra acordar",
        correct: false,
        explanation:
          "Epi remove unconscious mas não trata sangue baixo. Ele vai cair de novo em segundos.",
      },
    ],
  },
  {
    id: "stash-or-tent",
    difficulty: "intermediate",
    scenario: "Achou loot top tier (M4 + ACOG + Plate Carrier). Sem squad. Quer guardar pra próxima sessão.",
    question: "Onde armazena?",
    options: [
      {
        label: "Underground stash em mata densa, longe de cidades",
        correct: true,
        explanation:
          "Best practice. Pá enterra mochila inteira invisível. Marque coords no mapa físico — esquecer = perda total.",
      },
      {
        label: "Tent persistente em fazenda abandonada",
        correct: false,
        explanation:
          "Visível ao radar dos players. Precisa interagir a cada 7 dias pra reset persistence. Fácil de raidar.",
      },
      {
        label: "Logout dentro do prédio do loot",
        correct: false,
        explanation:
          "Outro player que entrar te encontra dormindo. Inventário persiste mas você morre dormindo.",
      },
      {
        label: "Carrega tudo no inventário",
        correct: false,
        explanation:
          "Tudo carregado = -50% stamina + perda total se morrer. Sempre tenha plano B.",
      },
    ],
  },
  {
    id: "wolves-encounter",
    difficulty: "intermediate",
    scenario:
      "Você está num campo aberto. Ouve uivo de matilha de lobos a ~80m. Tem M4-A1 com 30 rounds + Hatchet.",
    question: "Reação ideal?",
    options: [
      {
        label: "Atira no líder primeiro com tap-fire",
        correct: true,
        explanation:
          "Líder geralmente é o que vai puxar o pack. Mate ele e os outros podem fugir. Tap-fire mantém precisão.",
      },
      {
        label: "Corre pra árvore alta",
        correct: false,
        explanation:
          "Lobos não escalam, mas DayZ não tem 'escalar árvore'. Lobos chegam em 8s — sem distância pra correr 80m.",
      },
      {
        label: "Saca melee — economiza ammo",
        correct: false,
        explanation:
          "Matilha de 4-6 lobos vai te derrubar em 3 hits. Suicídio com hatchet só.",
      },
      {
        label: "Ignora e segue caminho",
        correct: false,
        explanation:
          "Lobos perseguem ativamente. Não dá pra ignorar.",
      },
    ],
  },
  {
    id: "raw-meat-emergency",
    difficulty: "fresh",
    scenario: "Você tá com fome 'Starving'. Achou raw-steak (bife cru). Sem fogueira nem matches.",
    question: "Come?",
    options: [
      {
        label: "Sim, comer crua é melhor que morrer",
        correct: false,
        explanation:
          "Cru = Salmonella garantida. Vai vomitar (perde água + kcal) e morrer mesmo. Pior que fome.",
      },
      {
        label: "Não — procura comida cooked/enlatada",
        correct: true,
        explanation:
          "Correto. Mesmo Starving demora ~10 min pra matar. Vá pra primeira casa, ache feijão/atum.",
      },
      {
        label: "Acende com pedra + galho (improvisado)",
        correct: false,
        explanation:
          "DayZ vanilla não tem 'fire by friction'. Precisa de matches/lighter/hand drill (mod).",
      },
      {
        label: "Espera chover e bebe água",
        correct: false,
        explanation:
          "Chuva não enche cantil automático. Precisa de plastic bottle/canteen/cisterna.",
      },
    ],
  },
  {
    id: "contamination-zone-prep",
    difficulty: "veteran",
    scenario:
      "Você quer ir pra Rify (zona contaminada NE Chernarus) pegar M4-A1 endgame.",
    question: "Equipment mínimo?",
    options: [
      {
        label: "Gas Mask + 2-3 filtros + roupa cobrindo todo corpo",
        correct: true,
        explanation:
          "Filtro tem ~20 min de uso ativo. Roupa exposta = dano de contaminação cumulativo. Plano: entra rápido, loot, sai antes do filtro acabar.",
      },
      {
        label: "Só Gas Mask (filtro novo)",
        correct: false,
        explanation:
          "Filtro novo dura ~20 min. Você precisa de extras pra emergência ou demora maior.",
      },
      {
        label: "NBC suit (não existe vanilla)",
        correct: false,
        explanation:
          "Vanilla DayZ NÃO tem hazmat suit. Modless = só Gas Mask + roupa coberta. Mods (NBC) sim.",
      },
      {
        label: "Saline IV pré-aplicado",
        correct: false,
        explanation:
          "Saline cura sangue após dano, não previne contaminação. Você ainda morre.",
      },
    ],
  },
];
