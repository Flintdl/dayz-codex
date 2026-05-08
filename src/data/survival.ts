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
      "Vômito frequente (perde água+kcal)",
      "Drenagem rápida de hidratação",
      "Saúde cai contínua",
    ],
    causes: [
      "Beber água crua de rios/lagos sem desinfetar",
      "Comer com mãos sujas (sangue de animal)",
    ],
    cures: ["tetracycline", "charcoal-tablets"],
    prevention: ["water-purification-tablets", "cooking-pot", "matches"],
    description:
      "Doença bacteriana clássica do início. Trate com Tetra + reidratação contínua. Sem tratamento: morte em ~30min.",
  },
  {
    slug: "salmonella",
    name: "Salmonella",
    icon: "biohazard",
    severity: "moderate",
    symptoms: ["Vômito intermitente", "Fraqueza", "Sangramento intestinal leve"],
    causes: [
      "Comer carne crua (steak, frango, peixe)",
      "Comer comida apodrecida (rotten)",
    ],
    cures: ["tetracycline", "charcoal-tablets"],
    prevention: ["campfire", "cooking-pot"],
    description:
      "Sintomas severos mas tratáveis. Carvão ativado lida com casos leves.",
  },
  {
    slug: "wound-infection",
    name: "Infecção de Ferida",
    icon: "band-aid",
    severity: "moderate",
    symptoms: ["Sangue cai contínua", "Saúde cai por dias"],
    causes: [
      "Bandagem com rags (sem desinfetante)",
      "Sangramento prolongado sem cuidado",
    ],
    cures: ["tetracycline"],
    prevention: ["bandage", "disinfectant-spray", "alcohol-tincture"],
    description:
      "Use spray desinfetante na ferida ANTES de bandagem para reduzir risco.",
  },
  {
    slug: "common-cold",
    name: "Resfriado",
    icon: "leaf",
    severity: "mild",
    symptoms: ["Espirros (denuncia posição)", "Estamina cai mais rápido"],
    causes: ["Hipotermia leve", "Roupa molhada por horas"],
    cures: ["vitamins", "tetracycline"],
    prevention: ["ushanka", "fireplace-kit"],
    description:
      "Mais incômodo do que perigoso. Espirrar perto de inimigos = denúncia.",
  },
  {
    slug: "influenza",
    name: "Gripe",
    icon: "virus",
    severity: "moderate",
    symptoms: [
      "Tosse forte",
      "Febre (temperatura sobe sem aquecimento)",
      "Saúde cai",
    ],
    causes: ["Resfriado não tratado", "Hipotermia severa"],
    cures: ["tetracycline", "vitamins"],
    prevention: ["roupas quentes", "hidratação alta"],
    description: "Variante viral — Tetra ajuda mas vitaminas são chave.",
  },
  {
    slug: "hemolytic-reaction",
    name: "Reação Hemolítica",
    icon: "biohazard",
    severity: "severe",
    symptoms: ["Sangue cai rapidamente", "Calafrios + tremor"],
    causes: ["Transfusão de Blood Bag de tipo errado"],
    cures: ["epinephrine"],
    prevention: ["blood-test-kit", "saline-iv"],
    description:
      "EVITE: prefira Saline IV se não tiver certeza do tipo sanguíneo.",
  },
  {
    slug: "kuru",
    name: "Kuru",
    icon: "biohazard",
    severity: "severe",
    symptoms: ["Risadas involuntárias", "Tremor severo", "Estamina cai"],
    causes: ["Comer carne humana"],
    cures: [],
    prevention: ["não comer carne humana"],
    description:
      "Doença incurável vinda do canibalismo. Permanente. Existe pra punir comportamento.",
  },
  {
    slug: "contamination",
    name: "Contaminação Química",
    icon: "biohazard",
    severity: "severe",
    symptoms: ["Saúde cai contínua", "Tosse com sangue"],
    causes: [
      "Andar em zonas contaminadas (Tisy, NW Heli, certas missões dinâmicas) sem máscara/filtro",
    ],
    cures: ["tetracycline", "saline-iv"],
    prevention: ["gas-mask", "gas-mask-filter", "ng-suit (opcional)"],
    description:
      "Filtro tem durabilidade — troque antes de zerar. Passou direto sem máscara? Saia da zona JÁ.",
  },
];
