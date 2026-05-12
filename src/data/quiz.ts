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
  {
    id: "thirst-vs-hunger-priority",
    difficulty: "fresh",
    scenario:
      "Spawnou com 'Hungry' e 'Thirsty' ao mesmo tempo. Tem 1 maçã no chão e uma cisterna a 50m.",
    question: "Qual atender primeiro?",
    options: [
      {
        label: "Água — sede mata em ~45 min, fome em ~90 min",
        correct: true,
        explanation:
          "Correto. Hidratação degrada mais rápido que kcal. Sem água, regen para e healing trava. Cisterna primeiro, depois a maçã no caminho.",
      },
      {
        label: "Comida — kcal é mais escasso que água",
        correct: false,
        explanation:
          "Errado. Água é mais escasso no fresh spawn (precisa cisterna/pump/bottle). Maçã não resolve sede.",
      },
      {
        label: "Tanto faz, come a maçã enquanto anda",
        correct: false,
        explanation:
          "Maçã com sede 'Thirsty' piora hidratação (-30 water). Resolve fome mas acelera dehydration.",
      },
      {
        label: "Espera até virar 'Starving' pra economizar",
        correct: false,
        explanation:
          "Esperar status piorar nunca compensa em DayZ. Mensagens 'Energized'/'Hydrated' destrancam regen de sangue/HP.",
      },
    ],
  },
  {
    id: "raw-meat-when-acceptable",
    difficulty: "fresh",
    scenario:
      "Você matou frango/galinha com hatchet. Não tem fogueira ainda. Hunger 'Hungry' (não Starving).",
    question: "Come carne crua?",
    options: [
      {
        label: "Nunca — risco de Salmonella é certo",
        correct: true,
        explanation:
          "Carne crua (pork, chicken, mutton) = Salmonella garantida. Vomita kcal/water e fica pior. Faça fogueira primeiro.",
      },
      {
        label: "Sim se for frango — aves não dão doença",
        correct: false,
        explanation:
          "Mentira de fórum. Toda carne crua animal dá Salmonella. Frango não é exceção.",
      },
      {
        label: "Só se já tiver tetracycline (antibiótico)",
        correct: false,
        explanation:
          "Tetracycline trata Cholera, não Salmonella. Charcoal Tabs é o tratamento certo — mas evite o risco.",
      },
      {
        label: "Sim, dá perda de água mas vale o kcal",
        correct: false,
        explanation:
          "Vômito remove o kcal que você ingeriu + água. Saldo líquido NEGATIVO. Cozinhar é mandatório.",
      },
    ],
  },
  {
    id: "safe-water-source",
    difficulty: "fresh",
    scenario:
      "Você precisa beber. Tem 3 opções no entorno: water pump de vila, lago próximo a campo, poça de chuva no asfalto.",
    question: "Fonte mais segura?",
    options: [
      {
        label: "Water pump de vila — água tratada, sem risco",
        correct: true,
        explanation:
          "Water pumps (cisternas vermelhas/azuis) dão água limpa direto. Aperte 'Drink' sem risco de Cholera. Padrão fresh spawn.",
      },
      {
        label: "Lago — natural e abundante",
        correct: false,
        explanation:
          "Lagos/rios/poças = ~20% chance de Cholera por gole. Precisa ferver (cooking pot + fogueira) ou usar water purification tablets.",
      },
      {
        label: "Poça de chuva — água da chuva é potável",
        correct: false,
        explanation:
          "Poças não existem como fonte interativa em vanilla. E se existissem, contaminação certa.",
      },
      {
        label: "Qualquer uma — DayZ não simula contaminação",
        correct: false,
        explanation:
          "Errado. Vanilla simula Cholera em água não-tratada desde 1.0. Pump é o único ponto seguro sem cozinhar.",
      },
    ],
  },
  {
    id: "knife-weapon-or-tool",
    difficulty: "fresh",
    scenario:
      "Encontrou Kitchen Knife no fresh spawn. Você não tem outra arma nem ferramenta.",
    question: "Prioridade de uso?",
    options: [
      {
        label: "Ferramenta — skin animal/zumbi pra rags e carne",
        correct: true,
        explanation:
          "Knife é primariamente tool: skin de carcaça gera fat/guts/pelt + rags de roupa. Dano melee é fraco (~10 HP). Use pra economia, não combate.",
      },
      {
        label: "Arma — atacar infectado de surpresa",
        correct: false,
        explanation:
          "Knife dá ~3-4 hits pra matar infected normal. Cada hit te expõe a hit de volta. Hatchet ou pipe é melhor pra combate.",
      },
      {
        label: "Larga — peso desnecessário",
        correct: false,
        explanation:
          "Knife pesa <0.3kg e é essencial pra skinning. Largar = não acessar carne/rags. Sempre carregue.",
      },
      {
        label: "Guarda pra craft de spear",
        correct: false,
        explanation:
          "Spear precisa long stick + knife mas é melee inferior ao próprio knife em DPS. Não vale o tempo.",
      },
    ],
  },
  {
    id: "fresh-vs-fresh-beach",
    difficulty: "fresh",
    scenario:
      "Você é fresh spawn em Kamyshovo. Vê outro fresh spawn andando na praia, ~40m de distância, também sem mochila.",
    question: "Ação?",
    options: [
      {
        label: "Ignora e continua rota oposta",
        correct: true,
        explanation:
          "Fresh vs fresh raramente compensa — ninguém tem loot. Risco de ele ter pistola escondida ou ser bait pra geared friend.",
      },
      {
        label: "KOS com punho — elimina ameaça",
        correct: false,
        explanation:
          "Punho dá ~5-8 hits pra knockout. Ele revida ou foge gritando, atraindo PvP. Sem ganho.",
      },
      {
        label: "Voice chat oferecendo team-up",
        correct: false,
        explanation:
          "Pode funcionar mas 50%+ dos fresh spawns viram bandit no primeiro spawn de loot. Risco-benefício ruim.",
      },
      {
        label: "Segue ele de longe pra ver pra onde vai",
        correct: false,
        explanation:
          "Stalking fresh spawn = waste de tempo. Você precisa sair da costa, não fazer recon.",
      },
    ],
  },
  {
    id: "bleeding-bandage-vs-rags",
    difficulty: "fresh",
    scenario:
      "Caiu de escada e está sangrando (1 ferida). Inventário: 1 Bandage limpa, 3 Rags limpas (de camisa).",
    question: "O que usa?",
    options: [
      {
        label: "Rag — bandage guarda pra emergência maior",
        correct: true,
        explanation:
          "Rag estanca sangramento igual bandage (1 ferida = 1 item). Bandage limpa é mais raro e tem chance menor de infecção. Use rag em ferimentos leves.",
      },
      {
        label: "Bandage — mais eficaz que rag",
        correct: false,
        explanation:
          "Mesma eficácia pra estancar (1 wound = 1 item). Diferença é só taxa de infecção (~5% rag vs 0% bandage limpa). Não vale gastar.",
      },
      {
        label: "Espera parar sozinho",
        correct: false,
        explanation:
          "Sangramento NUNCA para sozinho em DayZ. Você perde ~100 sangue/min até unconscious. Trate sempre.",
      },
      {
        label: "Aplica os 2 pra garantir",
        correct: false,
        explanation:
          "1 wound = 1 item. O segundo é desperdiçado. Não acumula efeito.",
      },
    ],
  },
  {
    id: "wet-clothes-rain",
    difficulty: "fresh",
    scenario:
      "Está chovendo forte. Sua roupa está 'Wet'/'Soaked'. Temperatura ~10°C.",
    question: "Maior perigo imediato?",
    options: [
      {
        label: "Hipotermia — temperatura corporal cai rápido com roupa molhada",
        correct: true,
        explanation:
          "Roupa Soaked drena temp corporal ~3x mais rápido. 'Cold' → 'Freezing' em 10-15 min. Procure abrigo e fogueira ASAP.",
      },
      {
        label: "Doença respiratória (resfriado)",
        correct: false,
        explanation:
          "Resfriado vem DEPOIS de frio prolongado, não direto da roupa. Risco secundário. Foque hipotermia primeiro.",
      },
      {
        label: "Perda de stamina por peso da água",
        correct: false,
        explanation:
          "Roupa molhada não muda peso em vanilla DayZ. É só o frio que importa.",
      },
      {
        label: "Visibilidade reduzida pela chuva",
        correct: false,
        explanation:
          "Chuva afeta visão sim, mas não é ameaça à vida imediata como hipotermia.",
      },
    ],
  },
  {
    id: "apple-tree-raw",
    difficulty: "fresh",
    scenario:
      "Achou macieira (apple tree) na vila. Animação 'Search' devolveu 2 apples.",
    question: "Pode comer sem cozinhar?",
    options: [
      {
        label: "Sim — frutas vanilla são seguras cruas",
        correct: true,
        explanation:
          "Apple/Pear/Plum são seguras direto da árvore. ~50 kcal cada + pequena hidratação. Pilar do fresh spawn survival.",
      },
      {
        label: "Não — toda comida crua causa doença",
        correct: false,
        explanation:
          "Regra de carne crua, não fruta. Frutas não têm risco de Salmonella/Cholera em vanilla.",
      },
      {
        label: "Só se lavar primeiro em water pump",
        correct: false,
        explanation:
          "Não existe mecânica de 'lavar fruta'. Pode comer direto.",
      },
      {
        label: "Sim mas perde água ao mastigar",
        correct: false,
        explanation:
          "Apple ADD water (~10), não remove. Boa fonte combinada de kcal+water no early game.",
      },
    ],
  },
  {
    id: "distant-shot-300m",
    difficulty: "intermediate",
    scenario:
      "Você está em Stary Sobor. Ouve 1 disparo isolado (Mosin) ~300m a Leste. Você tem AK + Plate Carrier.",
    question: "Próximo minuto?",
    options: [
      {
        label: "Cover imediato + escuta — esperar segundo tiro pra direção",
        correct: true,
        explanation:
          "1 tiro = direção incerta. Cover + listen 30-60s revela follow-up shot ou movement. Pânico = morre. Calma posiciona.",
      },
      {
        label: "Sprint na direção oposta",
        correct: false,
        explanation:
          "Sprint te expõe + revela sua posição pelo som. Atirador pode estar EM qualquer ângulo de 300m — você pode correr direto pra ele.",
      },
      {
        label: "Atira AK no ar pra mostrar que tá armado",
        correct: false,
        explanation:
          "Insano. Você grita sua posição pra todo mundo + atrai infected. Suicídio tático.",
      },
      {
        label: "Continua looting sem mudar comportamento",
        correct: false,
        explanation:
          "Ignorar contato sonoro = morrer. Mosin a 300m pode chegar a 600m via gear no atirador. Reaja sempre.",
      },
    ],
  },
  {
    id: "vest-tier-choice",
    difficulty: "intermediate",
    scenario:
      "Numa mesma sala você acha: Plate Carrier (sem placa), Press Vest, UK Assault Vest. Só pode levar 1.",
    question: "Qual escolhe?",
    options: [
      {
        label: "UK Assault Vest — sem proteção mas +slots utilitários",
        correct: false,
        explanation:
          "UK Assault tem só 8 slots e ZERO armor. Pior dos 3. Skip.",
      },
      {
        label: "Plate Carrier vazio — usa como base pra adicionar plate depois",
        correct: true,
        explanation:
          "Plate Carrier base tem 8 slots + suporta Plate (que para 7.62x39 1 vez). Achar plate é comum em military. Investimento de longo prazo.",
      },
      {
        label: "Press Vest — armor leve embutida",
        correct: false,
        explanation:
          "Press Vest reduz dano mínimo (~10%) e tem só 6 slots. Não para tiro de rifle. Inferior ao Plate Carrier com plate.",
      },
      {
        label: "Nenhum — vest faz barulho ao correr",
        correct: false,
        explanation:
          "Vests não fazem barulho extra em vanilla. Sempre leve um vest pra slots + futuro armor.",
      },
    ],
  },
  {
    id: "cooked-vs-canned",
    difficulty: "intermediate",
    scenario:
      "Inventário cheio. Tem que escolher entre Cooked Steak (carne grelhada) ou Canned Beans (feijão enlatado).",
    question: "Qual é mais eficiente em kcal/slot?",
    options: [
      {
        label: "Cooked Steak — ~500 kcal por slot pequeno",
        correct: true,
        explanation:
          "Steak cozido dá ~500-700 kcal num slot 1x1. Beans dão ~300 kcal num slot 1x1. Carne ganha em densidade quando você tem fogo.",
      },
      {
        label: "Canned Beans — kcal fixo e não estraga",
        correct: false,
        explanation:
          "Beans dão ~300 kcal mas em 1 slot. Carne cozida fresca dá ~2x kcal. Persistence: ambos duram >24h.",
      },
      {
        label: "Empate — DayZ não diferencia",
        correct: false,
        explanation:
          "Diferencia sim. Cada item tem 'nutritionalIndex' próprio. Steak é o mais denso fora de fat cooked.",
      },
      {
        label: "Beans pq dá hidratação extra",
        correct: false,
        explanation:
          "Beans dão ~50 water, steak dá ~30. Diferença mínima, kcal é o que separa.",
      },
    ],
  },
  {
    id: "m4-ammo-organize",
    difficulty: "intermediate",
    scenario:
      "Você tem 4 mags M4 (30 rounds capacity cada) + 80 balas 5.56 soltas. Vai pra NWAF.",
    question: "Como organiza antes de sair?",
    options: [
      {
        label: "Carrega os 4 mags + deixa 80 soltas no chão",
        correct: false,
        explanation:
          "80 balas valem em troca/refill. Largar = waste enorme. NWAF não tem 5.56 garantido.",
      },
      {
        label: "Enche os 4 mags (120) + carrega 0 solta",
        correct: false,
        explanation:
          "Você deixaria 80 balas no chão. Carregue o resto no inventário pra refill em batalha.",
      },
      {
        label: "Enche 4 mags (120) + carrega 80 soltas no inv",
        correct: true,
        explanation:
          "Ideal. 4 mags prontos = 120 tiros imediatos. 80 soltas = 2-3 refills pós-combate. Total 200 rounds pra contato extendido.",
      },
      {
        label: "1 mag carregado + 80 soltas + 3 mags vazios",
        correct: false,
        explanation:
          "Reload sob fogo = recarregar mag round-by-round (3s cada). Em combate você morre antes do 5º tiro. Pre-load os mags.",
      },
    ],
  },
  {
    id: "sick-ai-helper",
    difficulty: "intermediate",
    scenario:
      "Membro do squad pegou Influenza (tosse + temperatura alta). Vocês têm Tetracycline (4 pills) e Multivitamin.",
    question: "Decisão?",
    options: [
      {
        label: "Aplica Tetracycline imediatamente",
        correct: true,
        explanation:
          "Tetracycline cura Influenza, Salmonella, Cholera, Brucellosis. 4 pills = curso completo (1 a cada 30s). Espera viralizar pro squad.",
      },
      {
        label: "Isola ele e segue sem tratar",
        correct: false,
        explanation:
          "Influenza piora pra unconscious em ~1h sem tratamento. Você perde o squad member. Trate.",
      },
      {
        label: "Multivitamin resolve",
        correct: false,
        explanation:
          "Multivit ajuda imune mas NÃO cura doença ativa. Tetracycline é necessária pra Influenza.",
      },
      {
        label: "Espera 'Healthy' status retornar naturalmente",
        correct: false,
        explanation:
          "Influenza não cura sozinha em DayZ vanilla. Sem ATB você morre.",
      },
    ],
  },
  {
    id: "hypothermia-mild",
    difficulty: "intermediate",
    scenario:
      "Status 'Cold' apareceu (hipotermia leve). Você está em vila, à noite, sem fogueira pronta.",
    question: "Solução mais rápida?",
    options: [
      {
        label: "Entra em casa + acende fogueira interna ou bebe chá quente",
        correct: false,
        explanation:
          "Fogueira interna funciona mas demora craftear (paper+sticks+matches). Solução existe mais rápida.",
      },
      {
        label: "Sprint contínuo gera calor corporal",
        correct: true,
        explanation:
          "Movimento (sprint/jogging) gera heat metabólico. 'Cold' → 'Warm' em ~2-3 min de jog. Fix instantâneo e gratuito.",
      },
      {
        label: "Come comida quente",
        correct: false,
        explanation:
          "Comida quente ajuda mas é marginal (+5°C interno). Sprint é muito mais eficaz pra mild hypothermia.",
      },
      {
        label: "Tira roupa pra evaporar suor",
        correct: false,
        explanation:
          "Tirar roupa em hipotermia = piora rápido. Mantém todas as camadas, especialmente em frio.",
      },
    ],
  },
  {
    id: "car-passing-react",
    difficulty: "intermediate",
    scenario:
      "Você está em estrada perto de Krasnostav. Ouve motor de carro passando a ~150m. Você é solo, com AK.",
    question: "Janela de reação?",
    options: [
      {
        label: "~10-15 segundos antes de te avistar visualmente",
        correct: true,
        explanation:
          "Carro a 60 km/h cobre 150m em ~9s. Som chega 1-2s antes do contato visual. Cover IMEDIATO antes deles enxergarem.",
      },
      {
        label: "1-2 minutos — carros são lentos em DayZ",
        correct: false,
        explanation:
          "Carros vanilla atingem 70-90 km/h em estrada. Lentos não são. Você tem ~10s.",
      },
      {
        label: "Sem janela — eles já te viram pelo som do seu movimento",
        correct: false,
        explanation:
          "Dentro do carro o som externo é abafado. Você ainda tem chance se reagir rápido. Não desista.",
      },
      {
        label: "Atira no motor enquanto passa",
        correct: false,
        explanation:
          "Atirar revela sua posição + carro tem armor decente. Eles param e revidam em vantagem numérica. Esconder>atirar.",
      },
    ],
  },
  {
    id: "combination-lock-solo",
    difficulty: "intermediate",
    scenario:
      "Você achou base vazia (sem players online) com Combination Lock de 4 dígitos. Quer raidar solo.",
    question: "Tempo médio pra bruteforce?",
    options: [
      {
        label: "~3-5 minutos — só 10000 combinações",
        correct: false,
        explanation:
          "Cada tentativa demora ~1.5-2s no anim de discar. 10000 × 2s = 5h33min worst case. Não é viável solo num pull só.",
      },
      {
        label: "~30 min a ~3h dependendo da sorte",
        correct: true,
        explanation:
          "Avg ~2h30min (50% das combos = 5000 × 2s). Best case raro <30min, worst case ~5h. Combo locks são fortes solo — use sledge.",
      },
      {
        label: "Impossível — DayZ bloqueia após 5 erros",
        correct: false,
        explanation:
          "Não tem lockout em vanilla. Você pode tentar infinito. Só limitação é tempo + risco de ser pego.",
      },
      {
        label: "~10 min se você focar",
        correct: false,
        explanation:
          "Subestima. Mesmo focado a anim mecânica é fixa. Matemática não bate.",
      },
    ],
  },
  {
    id: "double-sniper-ping",
    difficulty: "intermediate",
    scenario:
      "Você caminha em Pavlovo. Ouve 2 disparos sniper QUASE simultâneos (gap <0.5s), ângulos ligeiramente diferentes.",
    question: "Interpretação mais provável?",
    options: [
      {
        label: "1 sniper + spotter coordenando 2 alvos",
        correct: true,
        explanation:
          "Squad sniper com spotter: dois snipers chamando alvos diferentes. Gap <0.5s humano é raro mas treinado existe. Cover IMEDIATO + assume múltiplos hostis.",
      },
      {
        label: "Mesmo atirador, eco do som no relevo",
        correct: false,
        explanation:
          "Eco vanilla é leve e mesmo ângulo. Ângulos diferentes = posições diferentes = atiradores diferentes.",
      },
      {
        label: "Glitch de áudio do server",
        correct: false,
        explanation:
          "Não conta com isso. Assuma pior caso = squad caçando você.",
      },
      {
        label: "Disparo + ricochete na parede",
        correct: false,
        explanation:
          "Ricochet não gera 2 sons de gunshot. Gera 1 shot + 1 impact sound diferente. Dois shots = dois trigger pulls.",
      },
    ],
  },
  {
    id: "iv-saline-order",
    difficulty: "intermediate",
    scenario:
      "Aliado caído com sangue ~2000 (Low). Você tem: IV Start Kit, Saline Bag, Blood Bag (tipo conhecido = match).",
    question: "Ordem correta de aplicação?",
    options: [
      {
        label: "IV Start Kit primeiro, depois Saline OU Blood na linha",
        correct: true,
        explanation:
          "IV Start Kit cria o acesso venoso. Sem ele, nem Saline nem Blood entram. Combine IV Kit + Saline (rápido, sem risco) ou IV Kit + Blood (cura mais).",
      },
      {
        label: "Saline direto sem IV Kit",
        correct: false,
        explanation:
          "Saline Bag SOZINHO não aplica. Você precisa do IV Start Kit pra linkar bag ao paciente.",
      },
      {
        label: "Blood Bag primeiro pois cura mais sangue",
        correct: false,
        explanation:
          "Ainda precisa do IV Kit. Blood + IV é a sequência. Sem IV, bag fica no inventário.",
      },
      {
        label: "Epi primeiro pra acordar, depois trata",
        correct: false,
        explanation:
          "Epi acorda mas não trata sangue baixo. Ele cai de novo em segundos. Trate sangue primeiro.",
      },
    ],
  },
  {
    id: "wooden-fence-raid",
    difficulty: "veteran",
    scenario:
      "Você quer raidar uma wooden fence (cerca de madeira de base) solo. Tem Sledgehammer e Hatchet disponíveis.",
    question: "Qual ferramenta + tempo aproximado?",
    options: [
      {
        label: "Sledgehammer — ~3-5 min por painel, mais barulho",
        correct: true,
        explanation:
          "Sledge é a ferramenta primária pra raid: ~3-5 min/painel wooden. Hatchet também funciona mas demora ~2x mais. Barulho é o trade-off.",
      },
      {
        label: "Hatchet — silencioso e rápido",
        correct: false,
        explanation:
          "Hatchet funciona mas demora ~8-10 min/painel. Não é mais silencioso (mesmo som de impacto). Sledge é melhor se você tem.",
      },
      {
        label: "Sledgehammer — instantâneo, 1 hit",
        correct: false,
        explanation:
          "Wooden fence tem ~120 HP. Sledge dá ~15-20 dmg/hit. Não é instantâneo, precisa dezenas de hits.",
      },
      {
        label: "Nenhum — wooden fence precisa de explosivo",
        correct: false,
        explanation:
          "Wooden fence (não wall) cede a melee tools. Plast Explosive/Cans of Beans são pra metal gates, não wooden fences.",
      },
    ],
  },
  {
    id: "tisy-heli-empty",
    difficulty: "veteran",
    scenario:
      "Você chegou em heli crash em Tisy. Loot já foi pego (carcaças vazias). Server tem ~2h de uptime.",
    question: "Vale revisitar depois?",
    options: [
      {
        label: "Sim — heli crashes respawnam a cada ~20-40min em local aleatório",
        correct: false,
        explanation:
          "Respawn é random no mapa todo, não no MESMO local. Revisitar o exato spot é waste.",
      },
      {
        label: "Não — esse spot específico fica vazio até server restart",
        correct: true,
        explanation:
          "Crash sites NÃO respawnam no mesmo local. Sistema escolhe outro random. Mude pra zonas militares (Tisy base) ou outros crash sites conhecidos.",
      },
      {
        label: "Sim — loot persistence reseta em 20 min",
        correct: false,
        explanation:
          "Lifetime do loot de crash é longo (>1h) mas o crash em si não reaparece no spot. Outros locais > revisitar.",
      },
      {
        label: "Depende — só se chover (heli aparece no chão molhado)",
        correct: false,
        explanation:
          "Chuva não influencia crash spawn. Mito de fórum.",
      },
    ],
  },
  {
    id: "full-server-nwaf-alt",
    difficulty: "veteran",
    scenario:
      "Server 60/60. Você é tier 3 (AK + plate). Quer continuar loot militar mas NWAF está congestionado (multiple shots heard).",
    question: "Rota alternativa?",
    options: [
      {
        label: "Tisy Military Base (NW) — menos populado, tier comparável",
        correct: true,
        explanation:
          "Tisy é NW remoto, mesmo tier que NWAF (M4, AK, plates) mas com menos PvP médio. Trade-off: rota longa pra costa (death = far walk).",
      },
      {
        label: "Berezino Tents — costa loot militar",
        correct: false,
        explanation:
          "Berezino tents são tier 2 max (SKS, vest leve). Downgrade de quem já é tier 3.",
      },
      {
        label: "Espera servidor esvaziar",
        correct: false,
        explanation:
          "60/60 demora horas pra cair. Você perde uptime de loot que respawnou. Ação > espera.",
      },
      {
        label: "Solnichniy oil rig (offshore)",
        correct: false,
        explanation:
          "Solnichniy não tem oil rig em vanilla Chernarus. Pode estar pensando em Livonia (sem rig também). Tisy é a resposta.",
      },
    ],
  },
  {
    id: "unknown-blood-risk",
    difficulty: "veteran",
    scenario:
      "Aliado em sangue crítico (~500). Você tem Blood Bag A+ mas NÃO sabe o tipo dele. Tem também IV Kit e 0 Saline.",
    question: "Decisão?",
    options: [
      {
        label: "Aplica Blood Test Kit primeiro (se tiver) ou desiste",
        correct: false,
        explanation:
          "Sem Saline e sem Test Kit, opções acabam. Mas há ainda outra ação válida — pense em despertar e procurar Saline.",
      },
      {
        label: "Aposta no A+ — 33% chance de match",
        correct: false,
        explanation:
          "Tipos sanguíneos em DayZ: A+/A-/B+/B-/AB+/AB-/O+/O-. A+ match com A+ e AB+ apenas (~25% pop). Mismatch = -1500 sangue + risco morte. Aposta ruim.",
      },
      {
        label: "Epi pra acordar + busca Saline imediato em casa próxima",
        correct: true,
        explanation:
          "Epi acorda ele (consciência) mesmo com sangue baixo curto prazo. Se ele acordar e estabilizar deitado, você corre buscar Saline. Risco menor que mismatch.",
      },
      {
        label: "Aplica Blood Bag A+ — DayZ não verifica tipo",
        correct: false,
        explanation:
          "Verifica SIM. Vanilla 1.x tem sistema de blood type estrito. Mismatch é fatal.",
      },
    ],
  },
  {
    id: "stamina-sprint-recovery",
    difficulty: "veteran",
    scenario:
      "Você sprintou ~400m e stamina zerou (bar vermelha cheia). Tem AK + mochila tier 3 + plate.",
    question: "Recovery timing pra full stamina?",
    options: [
      {
        label: "~30-45 seg parado, ~60-90 seg andando",
        correct: true,
        explanation:
          "Stamina full recovery parado é ~30-45s vanilla. Andando regen é mais lento (~60-90s). Encurtar = morrer cansado em PvP.",
      },
      {
        label: "Instantâneo após parar de correr",
        correct: false,
        explanation:
          "Stamina regen é gradual, não instantâneo. Forçar sprint sem regen total = exhaustion cap mais baixo.",
      },
      {
        label: "~5-10 seg parado",
        correct: false,
        explanation:
          "Subestima. Carga total (rifle + plate + bag tier 3) torna regen lento. Sub 30s é otimista.",
      },
      {
        label: "Depende só de hunger/thirst, não tem timer fixo",
        correct: false,
        explanation:
          "Hunger/thirst MODIFICAM regen sim, mas há timer base. Hydrated + Energized = 30s, Thirsty/Hungry = ~60s+.",
      },
    ],
  },
  {
    id: "restart-loot-run",
    difficulty: "veteran",
    scenario:
      "Server restart em 8 min. Você está a 2 min de Vybor Military. Tem AK + 2 mags.",
    question: "Plano ótimo?",
    options: [
      {
        label: "Sprint até Vybor, loot 5 min, sair antes do restart",
        correct: true,
        explanation:
          "Loot pré-restart é prime: respawn fresco logo após reboot mas pre-restart spots têm cumulative loot. 2min ida + 5min loot + 1min saída = janela usável. Cuidado com squads esperando.",
      },
      {
        label: "Evita — restart desconecta com risco de duplication bug",
        correct: false,
        explanation:
          "Vanilla 1.x corrigiu dupe issues. Logout antes do restart é seguro pro inventário. Aproveite o tempo.",
      },
      {
        label: "Fica no bush esperando o restart",
        correct: false,
        explanation:
          "Você perde 8 min de uptime potencial. Pre-restart é momento de RISCO mas alto reward.",
      },
      {
        label: "Combat log durante restart",
        correct: false,
        explanation:
          "Restart != combat log. Não existe vantagem em disconnect manual. Aproveite o tempo de jogo.",
      },
    ],
  },
  {
    id: "bear-no-ak",
    difficulty: "veteran",
    scenario:
      "Você encontra urso (bear) no NW Chernarus. Você tem Mosin (1 round chamber, 0 spare), Hatchet, 800 sangue.",
    question: "Engajar ou fugir?",
    options: [
      {
        label: "Fuga lateral — bears perdem trail em curvas e elevação",
        correct: true,
        explanation:
          "Bear tem ~600 HP. Mosin 1 shot causa ~200 dmg na cabeça. 1 round = você morre se errar. Fuga zig-zag com elevação quebra pathing. Não engaje sem ammo.",
      },
      {
        label: "Engaja com headshot Mosin — 1 tiro mata",
        correct: false,
        explanation:
          "Mosin headshot causa ~200 dmg. Bear tem ~600 HP. Você precisa 3+ tiros. Com 1 round, você morre tentando.",
      },
      {
        label: "Hatchet melee — distrai e mata",
        correct: false,
        explanation:
          "Bear claw faz ~100 dmg/hit + bleeding. Você cai em 2 hits com 800 sangue. Suicídio.",
      },
      {
        label: "Fica parado — bears ignoram alvos imóveis",
        correct: false,
        explanation:
          "Bears DayZ usam detecção por visão+som independente de movimento. Parado não te salva.",
      },
    ],
  },
];
