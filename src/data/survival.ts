import type { SurvivalStat, Disease } from "./types";

export const SURVIVAL_STATS: SurvivalStat[] = [
  {
    slug: "blood",
    name: "Sangue",
    icon: "heart",
    tone: "blood",
    range: { min: 0, max: 5000, unit: "pts" },
    increases: [
      "Comer alimentos saudáveis (saturated)",
      "Hidratação alta",
      "Bolsa de sangue (saiba o tipo)",
      "Saline IV (sem risco de tipo)",
    ],
    decreases: [
      "Sangramento de qualquer wound",
      "Tiros, mordidas de infectado, queda",
      "Doenças avançadas",
    ],
    thresholds: [
      { level: "ok", label: "Healthy (4500+)", description: "Tudo certo." },
      {
        level: "warning",
        label: "Low Blood (3000–4500)",
        description: "Pulso visível, tela levemente esmaecida.",
      },
      {
        level: "critical",
        label: "Critical (1000–3000)",
        description:
          "Tela preto-e-branco, risco de unconscious. Pare sangramento JÁ.",
      },
      {
        level: "death",
        label: "0 — Morte",
        description: "Game over.",
      },
    ],
    keyItems: ["bandage", "rags", "saline-iv", "blood-bag", "iv-start-kit"],
  },
  {
    slug: "health",
    name: "Saúde",
    icon: "band-aid",
    tone: "olive",
    range: { min: 0, max: 100, unit: "%" },
    increases: [
      "Hidratação + saciedade altas + sangue cheio",
      "Imunidade Strong",
      "Repouso longo (não sprint)",
    ],
    decreases: [
      "Fome/sede prolongadas",
      "Doenças bacterianas/virais",
      "Hipotermia",
      "Sangramento contínuo",
    ],
    thresholds: [
      { level: "ok", label: "Saudável", description: "100% — regen ativo." },
      {
        level: "warning",
        label: "Doente",
        description: "Tosse, fraqueza, vômito.",
      },
      {
        level: "critical",
        label: "Grave",
        description: "Movimento lento, choque iminente.",
      },
      { level: "death", label: "0", description: "Morte." },
    ],
    keyItems: [
      "tetracycline",
      "vitamins",
      "charcoal-tablets",
      "painkillers",
      "saline-iv",
    ],
  },
  {
    slug: "energy",
    name: "Energia (Fome)",
    icon: "drumstick-bite",
    tone: "brass",
    range: { min: 0, max: 5000, unit: "kcal" },
    increases: [
      "Comer alimentos cozidos preferencialmente",
      "Fillets de peixe e steak cozidos = ~250 kcal/refeição",
      "Powdered milk reidratado é denso",
    ],
    decreases: [
      "Sprint contínuo",
      "Frio (gasta energia mantendo temperatura)",
      "Doenças",
    ],
    thresholds: [
      { level: "ok", label: "Energized", description: "100% sprint." },
      {
        level: "warning",
        label: "Hungry",
        description: "Notificação verbal — coma logo.",
      },
      {
        level: "critical",
        label: "Starving",
        description: "Sangue/saúde caem.",
      },
      { level: "death", label: "0", description: "Morte por inanição." },
    ],
    keyItems: [
      "tuna-can",
      "beans-can",
      "cooked-steak",
      "rice-bag",
      "apple",
      "powdered-milk",
    ],
  },
  {
    slug: "water",
    name: "Hidratação (Sede)",
    icon: "bottle",
    tone: "olive",
    range: { min: 0, max: 5000, unit: "mL" },
    increases: [
      "Beber água potável (canteen, water bottle)",
      "Frutas com hidratação alta (laranja, tomate)",
      "Soda/Kvass — açúcar acelera regen mas drena depois",
    ],
    decreases: ["Sprint", "Calor", "Vômito (doença)", "Sangramento"],
    thresholds: [
      { level: "ok", label: "Hydrated", description: "100%." },
      { level: "warning", label: "Thirsty", description: "Beba já." },
      {
        level: "critical",
        label: "Dehydrated",
        description: "Saúde cai rapidamente.",
      },
      { level: "death", label: "0", description: "Morte." },
    ],
    keyItems: ["canteen", "water-bottle", "soda-can", "soda-pipsi"],
  },
  {
    slug: "temperature",
    name: "Temperatura",
    icon: "thermometer-half",
    tone: "rust",
    range: { min: 30, max: 42, unit: "°C" },
    increases: [
      "Roupas pesadas (Hunter Pants, Combat Boots, Ushanka)",
      "Ficar perto de campfire",
      "Sprint moderado",
    ],
    decreases: [
      "Chuva / roupa molhada",
      "Travessias de rio",
      "Ar frio noturno",
      "Zonas montanhosas (Black Mountain)",
    ],
    thresholds: [
      {
        level: "ok",
        label: "Comfy (36–37°C)",
        description: "Sem efeito.",
      },
      {
        level: "warning",
        label: "Cold/Hot",
        description: "Tremor ou suor — fica de olho.",
      },
      {
        level: "critical",
        label: "Hypothermia/Heatstroke",
        description: "Saúde cai — busque abrigo + fogo.",
      },
      { level: "death", label: "<30 ou >42", description: "Morte." },
    ],
    keyItems: ["fireplace-kit", "matches", "lighter", "ushanka", "hunter-pants"],
  },
  {
    slug: "stamina",
    name: "Estamina",
    icon: "bolt",
    tone: "olive",
    range: { min: 0, max: 100, unit: "%" },
    increases: ["Andar parado", "Comer/beber regularmente", "Carga leve"],
    decreases: ["Sprint", "Saltos", "Carga acima de 15kg afeta regen"],
    thresholds: [
      { level: "ok", label: "100%", description: "Sprint disponível." },
      {
        level: "warning",
        label: "<50%",
        description: "Sprint limitado a curtas distâncias.",
      },
      { level: "critical", label: "0%", description: "Walk forçado." },
      { level: "death", label: "—", description: "—" },
    ],
    keyItems: [],
  },
  {
    slug: "immunity",
    name: "Imunidade",
    icon: "shield",
    tone: "olive",
    range: { min: 0, max: 100, unit: "%" },
    increases: [
      "Vitaminas",
      "Saúde acima de 90% por tempo prolongado",
      "Boa nutrição contínua",
    ],
    decreases: [
      "Doenças (cholera, salmonella)",
      "Wound infection",
      "Hipotermia recorrente",
    ],
    thresholds: [
      { level: "ok", label: "Strong (>80%)", description: "Resistência alta." },
      {
        level: "warning",
        label: "Weakened",
        description: "Suscetível a doenças.",
      },
      {
        level: "critical",
        label: "Compromised",
        description: "Pega doenças facilmente.",
      },
      { level: "death", label: "—", description: "—" },
    ],
    keyItems: ["vitamins", "tetracycline"],
  },
];

export const DISEASES: Disease[] = [
  {
    slug: "cholera",
    name: "Cólera",
    icon: "biohazard",
    severity: "severe",
    symptoms: [
      "Vômito frequente (perde ~200 mL água + 100 kcal por episódio)",
      "Drenagem rápida de hidratação até dehydrated",
      "Saúde cai contínua enquanto sintomática",
      "Estamina drain agressiva — sprint indisponível",
    ],
    causes: [
      "Beber água não fervida de fonte parada (poças, fontes urbanas, valas)",
      "Comer com mãos sujas após esfolar animal ou manipular cadáver",
      "Compartilhar canteen contaminada com squad infectado",
    ],
    cures: ["tetracycline", "charcoal-tablets", "saline-iv"],
    prevention: [
      "Ferver água em cooking-pot sobre campfire antes de beber",
      "Usar water-purification-tablets em canteen suspeita",
      "Lavar mãos em pia/pump antes de comer crua",
    ],
    description:
      "Doença bacteriana clássica do início de wipe. Trate com Tetra + reidratação contínua via canteen e saline. Sem tratamento, drena hidratação e mata em ~30 min real-time.",
  },
  {
    slug: "salmonella",
    name: "Salmonella",
    icon: "biohazard",
    severity: "moderate",
    symptoms: [
      "Vômito intermitente (perde água e kcal)",
      "Fraqueza geral — estamina regen reduzida",
      "Sangramento intestinal leve (sangue cai devagar)",
      "Dor abdominal visual (animação curvada)",
    ],
    causes: [
      "Comer carne crua (steak, frango, peixe) sem cozinhar",
      "Comer comida apodrecida (status rotten)",
      "Comer fruta caída do chão sem lavar",
    ],
    cures: ["tetracycline", "charcoal-tablets"],
    prevention: [
      "Cozinhar toda carne em campfire ou cooking-pot até cooked",
      "Descartar qualquer item com status rotten",
      "Comer apenas frutas colhidas direto da árvore",
    ],
    description:
      "Variante leve de intoxicação alimentar. Charcoal tablets lidam com casos brandos; Tetra resolve quadros avançados. Raramente fatal mas drena recursos.",
  },
  {
    slug: "wound-infection",
    name: "Infecção de Ferida",
    icon: "band-aid",
    severity: "moderate",
    symptoms: [
      "Sangue cai contínua mesmo sem sangramento ativo",
      "Saúde cai progressivamente por horas in-game",
      "Imunidade weakened persistente",
      "Risco de sepse se ignorado por dias",
    ],
    causes: [
      "Bandagem com rags sujas (sem desinfetar antes)",
      "Sangramento prolongado sem cuidado adequado",
      "Suturar com sewing-kit sem alcohol-tincture",
    ],
    cures: ["tetracycline", "alcohol-tincture"],
    prevention: [
      "Aplicar disinfectant-spray na rags antes de bandagear",
      "Preferir bandage limpa a rags improvisadas",
      "Tratar sangramento imediatamente — não andar bleeding",
    ],
    description:
      "Use disinfectant-spray ou alcohol-tincture na ferida ANTES da bandagem para reduzir risco. Já infectado, Tetra é o tratamento padrão.",
  },
  {
    slug: "common-cold",
    name: "Resfriado",
    icon: "leaf",
    severity: "mild",
    symptoms: [
      "Espirros audíveis (denuncia posição em 30m)",
      "Estamina cai mais rápido durante sprint",
      "Nariz escorrendo (efeito sonoro contínuo)",
      "Leve queda de imunidade",
    ],
    causes: [
      "Hipotermia leve repetida (cold persistente)",
      "Roupa molhada por horas sem secar",
      "Dormir ao relento em mapa frio sem fogueira",
    ],
    cures: ["vitamins", "tetracycline"],
    prevention: [
      "Trocar roupa molhada imediatamente após chuva ou river",
      "Manter fireplace-kit + matches sempre na mochila",
      "Vestir ushanka e roupas quentes em mapas frios",
    ],
    description:
      "Mais incômodo do que perigoso. Espirrar perto de inimigos = denúncia da sua posição. Geralmente passa sozinho com vitaminas e calor, mas se ignorado evolui pra influenza.",
  },
  {
    slug: "influenza",
    name: "Gripe",
    icon: "virus",
    severity: "moderate",
    symptoms: [
      "Tosse forte (denuncia posição em 40m+)",
      "Febre — temperatura corporal sobe sem fonte de calor",
      "Saúde cai progressivamente",
      "Fraqueza — estamina regen reduzida ~30%",
    ],
    causes: [
      "Resfriado não tratado por dias in-game",
      "Hipotermia severa repetida",
      "Imunidade compromised + exposição a outro infectado",
    ],
    cures: ["tetracycline", "vitamins"],
    prevention: [
      "Tratar common-cold cedo com vitamins",
      "Manter imunidade alta com nutrição contínua",
      "Evitar exposição prolongada a temperaturas <5°C",
    ],
    description:
      "Variante viral mais severa que resfriado. Tetra ajuda mas vitaminas são chave pra recuperar imunidade. Tosse traiçoeira em PvP — não fique perto de inimigos.",
  },
  {
    slug: "hemolytic-reaction",
    name: "Reação Hemolítica",
    icon: "biohazard",
    severity: "severe",
    symptoms: [
      "Sangue cai rapidamente (~500 pts/min)",
      "Calafrios + tremor visual na tela",
      "Tela esmaecida pra preto-e-branco",
      "Risco alto de unconscious imediato",
    ],
    causes: [
      "Transfusão de Blood Bag de tipo sanguíneo errado",
      "Squad fez transfusão sem testar com blood-test-kit",
    ],
    cures: ["epinephrine", "saline-iv"],
    prevention: [
      "Testar tipo sanguíneo com blood-test-kit antes de transfusão",
      "Preferir saline-iv quando não souber tipo sanguíneo",
      "Anotar tipo de cada membro do squad no início do wipe",
    ],
    description:
      "Reação severa por incompatibilidade ABO. EVITE: prefira Saline IV se não tiver certeza do tipo. Epinephrine reverte o choque mas não reverte a perda de sangue — precisa de IV em sequência.",
  },
  {
    slug: "kuru",
    name: "Kuru",
    icon: "biohazard",
    severity: "severe",
    symptoms: [
      "Risadas involuntárias audíveis em 50m+",
      "Tremor severo na tela e nas mãos (aim sway alto)",
      "Estamina cai constantemente",
      "Aim impreciso — mira tremula em todas as armas",
    ],
    causes: [
      "Comer human-steak (carne humana cozida)",
      "Comer fat humano ou outros derivados de cadáver",
    ],
    cures: [],
    prevention: [
      "Nunca esfolar nem cozinhar cadáveres de jogadores",
      "Verificar origem da carne antes de comer (humanflesh aparece no nome)",
      "Recusar comida oferecida por strangers sem inspeção",
    ],
    description:
      "Doença prion incurável vinda do canibalismo. Permanente até a morte do personagem. Existe como mecânica de punição pra desencorajar canibalismo casual.",
  },
  {
    slug: "contamination",
    name: "Contaminação Química",
    icon: "biohazard",
    severity: "severe",
    symptoms: [
      "Saúde cai contínua enquanto na zona",
      "Tosse com sangue (animação visível)",
      "Visão verde-amarelada com partículas",
      "Imunidade cai rápido pra compromised",
    ],
    causes: [
      "Andar em zonas contaminadas (Tisy, NW Heli crash, dynamic contaminated areas) sem gas-mask",
      "Filtro de gas-mask zerado dentro da zona",
      "Roupa contaminada usada após sair da zona sem trocar",
    ],
    cures: ["tetracycline", "saline-iv", "charcoal-tablets"],
    prevention: [
      "Equipar gas-mask + gas-mask-filter antes de entrar",
      "Trocar filtro antes da durabilidade zerar (~10 min de uso)",
      "Sair da zona JÁ se passou sem máscara — não loote",
    ],
    description:
      "Exposição a agente químico militar. Filtro tem durabilidade limitada — monitore e troque antes de zerar. Sem máscara, saia da zona imediatamente; cada segundo a mais drena saúde irreversivelmente.",
  },
  {
    slug: "broken-leg",
    name: "Perna Quebrada",
    icon: "skull",
    severity: "severe",
    symptoms: [
      "Movimento limitado a crawl",
      "Sem sprint",
      "Som de gemido contínuo",
      "Dor visual a cada movimento",
    ],
    causes: [
      "Queda de altura >3m",
      "Tiro na perna sem proteção",
      "Atropelado por veículo",
    ],
    cures: ["splint", "morphine"],
    prevention: [
      "Não pular de prédios >2 andares",
      "Andar devagar em telhados",
      "Sempre carregar splint material (sticks + rags)",
    ],
    description:
      "Fratura de perna — torna o jogador praticamente imóvel até talas. Comum em PvP (tiro no membro) ou parkour falho. Sem tratamento, pode demorar 30+ min real-time pra cicatrizar.",
  },
  {
    slug: "concussion",
    name: "Concussão",
    icon: "user",
    severity: "moderate",
    symptoms: [
      "Visão embaçada/duplicada",
      "Aim sway aumentado",
      "Ouvido zumbindo (tinnitus)",
      "Náusea ocasional",
    ],
    causes: [
      "Tiro na cabeça sem capacete (sobrevive mas com concussion)",
      "Explosão próxima (granada, molotov)",
      "Pancada melee na cabeça",
    ],
    cures: ["painkillers"],
    prevention: [
      "Capacete balístico em PvP",
      "Distância mínima 10m de explosivos",
      "Cobertura sólida em firefights",
    ],
    description:
      "Trauma cerebral leve após impacto. Não é fatal mas degrada precisão e mira por ~5-15 min. Painkillers reduzem visualmente os efeitos mas não curam — só tempo cura.",
  },
  {
    slug: "shock",
    name: "Choque",
    icon: "heart",
    severity: "severe",
    symptoms: [
      "Tela cinza/dessaturada",
      "Unconscious iminente",
      "Pulso fraco visível",
      "Stamina 0 permanente até resolver",
    ],
    causes: [
      "Blood loss agudo (<2500 sangue)",
      "Trauma severo combinado (múltiplos wounds)",
      "Hipotermia avançada",
    ],
    cures: ["saline-iv", "blood-bag", "epinephrine"],
    prevention: [
      "Parar sangramento JÁ ao ver alerta",
      "Manter sangue >3500 sempre",
      "Carregar saline + IV start kit",
    ],
    description:
      "Estado crítico pré-morte por sangue baixo + trauma. Sem reversão em ~60s, jogador apaga. Epinephrine é a janela de salvação se você estiver duo.",
  },
  {
    slug: "hypothermia",
    name: "Hipotermia",
    icon: "snowflake",
    severity: "severe",
    symptoms: [
      "Tremores violentos na tela",
      "Stamina drain 50%",
      "Temperatura corporal <30°C",
      "Risco de unconscious",
    ],
    causes: [
      "Roupa molhada (chuva, river crossing)",
      "Exposição prolongada a -5°C ou menos",
      "Sakhal (mapa frio) sem casaco",
    ],
    cures: ["thermometer"],
    prevention: [
      "Trocar roupa molhada imediatamente",
      "Carregar matches + sticks pra fogueira de emergência",
      "Roupas wool/leather em vez de cotton em Sakhal",
    ],
    description:
      "Queda crítica de temperatura corporal. Avança rápido em Sakhal e Chernarus inverno. Sem fogueira em 5 min, leva a unconscious; sem reversão, morte. Roupa MOLHADA é o gatilho mais comum — mesmo dia normal.",
  },
];
