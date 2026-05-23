export type RarityTier = "comun" | "raro" | "epico" | "legendario";

export interface ObtenibleDefinition {
  id: string;
  name: string;
  description: string;
  icon: string; // emoji
  rarity: RarityTier;
  category: "stamp" | "emblem" | "border" | "badge";
}

// ── Common (50% — 15 items) ──────────────────────────────────────
const COMUN: ObtenibleDefinition[] = [
  {
    id: "obt_helecho",
    name: "Hoja de Helecho",
    description: "Una hoja de helecho fresco encontrado en el bosque",
    icon: "🌿",
    rarity: "comun",
    category: "stamp",
  },
  {
    id: "obt_maceta",
    name: "Maceta Terracota",
    description: "Una maceta clásica de barro cocido",
    icon: "🪴",
    rarity: "comun",
    category: "badge",
  },
  {
    id: "obt_regadera",
    name: "Regadera",
    description: "Una pequeña regadera para tus plantas",
    icon: "🚿",
    rarity: "comun",
    category: "badge",
  },
  {
    id: "obt_tierra",
    name: "Tierra Abonada",
    description: "Puñado de tierra fértil para plantar",
    icon: "🫘",
    rarity: "comun",
    category: "stamp",
  },
  {
    id: "obt_semilla",
    name: "Semilla de Girasol",
    description: "Una semilla lista para germinar",
    icon: "🌻",
    rarity: "comun",
    category: "stamp",
  },
  {
    id: "obt_monstera",
    name: "Hoja de Monstera",
    description: "Una hoja de monstera con sus característicos agujeros",
    icon: "🪴",
    rarity: "comun",
    category: "stamp",
  },
  {
    id: "obt_cactus",
    name: "Cactus Pequeño",
    description: "Un cactus bebé en su maceta",
    icon: "🌵",
    rarity: "comun",
    category: "badge",
  },
  {
    id: "obt_flor_blanca",
    name: "Flor Blanca",
    description: "Una delicada flor de pétalos blancos",
    icon: "💮",
    rarity: "comun",
    category: "stamp",
  },
  {
    id: "obt_rosa_roja",
    name: "Rosa Roja",
    description: "Una rosa roja clásica y fragante",
    icon: "🌹",
    rarity: "comun",
    category: "stamp",
  },
  {
    id: "obt_tulipan",
    name: "Tulipán",
    description: "Un tulipán de colores vibrantes",
    icon: "🌷",
    rarity: "comun",
    category: "stamp",
  },
  {
    id: "obt_margarita",
    name: "Margarita",
    description: "Una margarita silvestre de campo",
    icon: "🌼",
    rarity: "comun",
    category: "stamp",
  },
  {
    id: "obt_lavanda",
    name: "Lavanda",
    description: "Ramo de lavanda con aroma relajante",
    icon: "💜",
    rarity: "comun",
    category: "badge",
  },
  {
    id: "obt_musgo",
    name: "Musgo",
    description: "Musgo suave que crece en piedras",
    icon: "🟢",
    rarity: "comun",
    category: "border",
  },
  {
    id: "obt_hiedra",
    name: "Hiedra",
    description: "Enredadera que trepa por las paredes",
    icon: "🌱",
    rarity: "comun",
    category: "border",
  },
  {
    id: "obt_trebol",
    name: "Trébol",
    description: "Un trébol de cuatro hojas para la suerte",
    icon: "🍀",
    rarity: "comun",
    category: "stamp",
  },
];

// ── Rare (25% — 8 items) ────────────────────────────────────────
const RARO: ObtenibleDefinition[] = [
  {
    id: "obt_orquidea",
    name: "Orquídea Púrpura",
    description: "Una orquídea exótica de color púrpura intenso",
    icon: "🌸",
    rarity: "raro",
    category: "stamp",
  },
  {
    id: "obt_bonsai",
    name: "Bonsái",
    description: "Un bonsái cuidadosamente podado",
    icon: "🎍",
    rarity: "raro",
    category: "badge",
  },
  {
    id: "obt_lirio_agua",
    name: "Lirio de Agua",
    description: "Un lirio flotando en un estanque sereno",
    icon: "🪷",
    rarity: "raro",
    category: "stamp",
  },
  {
    id: "obt_helecho_plateado",
    name: "Helecho Plateado",
    description: "Variedad rara de helecho con brillo plateado",
    icon: "🍃",
    rarity: "raro",
    category: "stamp",
  },
  {
    id: "obt_suculenta",
    name: "Suculenta Estrella",
    description: "Suculenta con forma de estrella perfecta",
    icon: "⭐",
    rarity: "raro",
    category: "badge",
  },
  {
    id: "obt_carnivora",
    name: "Planta Carnívora",
    description: "Una fascinante planta carnívora",
    icon: "🫦",
    rarity: "raro",
    category: "emblem",
  },
  {
    id: "obt_loto_rosa",
    name: "Loto Rosa",
    description: "Flor de loto de un rosa suave y elegante",
    icon: "🪷",
    rarity: "raro",
    category: "stamp",
  },
  {
    id: "obt_cactus_florido",
    name: "Cactus Florido",
    description: "Cactus que ha florecido con una hermosa flor",
    icon: "🌵",
    rarity: "raro",
    category: "badge",
  },
];

// ── Epic (15% — 4 items) ────────────────────────────────────────
const EPICO: ObtenibleDefinition[] = [
  {
    id: "obt_rosa_dorada",
    name: "Rosa Dorada",
    description: "Una rosa legendaria con pétalos dorados brillantes",
    icon: "🌹",
    rarity: "epico",
    category: "emblem",
  },
  {
    id: "obt_lirio_valle",
    name: "Lirio del Valle",
    description: "Ramo de lirios del valle con campanillas blancas",
    icon: "🏵️",
    rarity: "epico",
    category: "stamp",
  },
  {
    id: "obt_cerezo",
    name: "Flor de Cerezo",
    description: "Pétalos de cerezo en plena floración primaveral",
    icon: "🌸",
    rarity: "epico",
    category: "emblem",
  },
  {
    id: "obt_ave_paraiso",
    name: "Ave del Paraíso",
    description: "Exótica flor que parece un ave tropical",
    icon: "🦜",
    rarity: "epico",
    category: "emblem",
  },
];

// ── Legendary (10% — 3 items) ───────────────────────────────────
const LEGENDARIO: ObtenibleDefinition[] = [
  {
    id: "obt_loto_azul",
    name: "Flor de Loto Azul",
    description: "La mística flor de loto azul, símbolo de iluminación",
    icon: "💙",
    rarity: "legendario",
    category: "emblem",
  },
  {
    id: "obt_orquidea_fantasma",
    name: "Orquídea Fantasma",
    description: "Una orquídea tan rara que parece un fantasma",
    icon: "👻",
    rarity: "legendario",
    category: "emblem",
  },
  {
    id: "obt_arbol_milenario",
    name: "Árbol Milenario",
    description: "Representación de un árbol que ha vivido mil años",
    icon: "🌳",
    rarity: "legendario",
    category: "border",
  },
];

export const OBTENIBLES: ObtenibleDefinition[] = [
  ...COMUN,
  ...RARO,
  ...EPICO,
  ...LEGENDARIO,
];

// ── Runtime distribution check ──────────────────────────────────
export function getRarityDistribution(): Record<RarityTier, number> {
  return {
    comun: COMUN.length,
    raro: RARO.length,
    epico: EPICO.length,
    legendario: LEGENDARIO.length,
  };
}
