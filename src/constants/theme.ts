export const FLAG_THEMES = [
  { name: "Forest", colors: ["#1a472a", "#2d6a4f", "#40916c", "#52b788"] },
  { name: "Autumn", colors: ["#6b2e0f", "#bc6c25", "#dda15e", "#fefae0"] },
  { name: "Bloom", colors: ["#7b2d8e", "#a855f7", "#d946ef", "#f0abfc"] },
  { name: "Ocean", colors: ["#0c4a6e", "#0284c7", "#38bdf8", "#7dd3fc"] },
] as const

export const BG_THEMES = [
  {
    name: "Deep Forest",
    colors: ["#0d3320", "#0a1f14", "#06120d"],
    pattern: "leaf",
    patternColor: "#1a472a",
  },
  {
    name: "Midnight",
    colors: ["#0c2a3d", "#091a2a", "#060e18"],
    pattern: "stars",
    patternColor: "#1a3a5c",
  },
  {
    name: "Amber Dusk",
    colors: ["#3d2008", "#271505", "#140b03"],
    pattern: "dots",
    patternColor: "#5c3a10",
  },
  {
    name: "Mossy Stone",
    colors: ["#1a2e1a", "#131f13", "#0a120a"],
    pattern: "cross",
    patternColor: "#2a3e2a",
  },
  {
    name: "Tropical Night",
    colors: ["#0a2e2e", "#081e1e", "#050f0f"],
    pattern: "wave",
    patternColor: "#14524e",
  },
  {
    name: "Volcanic",
    colors: ["#2e1010", "#1a0a0a", "#0f0505"],
    pattern: "diamond",
    patternColor: "#5c2020",
  },
] as const

export const TITLE_OPTIONS = [
  { title: "Verdant Guardian", icon: "shield", tier: "legendary" },
  { title: "Bloom Keeper", icon: "flower", tier: "epic" },
  { title: "Root Whisperer", icon: "root", tier: "rare" },
  { title: "Petal Sage", icon: "petal", tier: "epic" },
  { title: "Spore Scholar", icon: "spore", tier: "rare" },
  { title: "Canopy Warden", icon: "tree", tier: "legendary" },
  { title: "Seed Sovereign", icon: "seed", tier: "mythic" },
  { title: "Moss Oracle", icon: "moss", tier: "epic" },
] as const

export const TIER_COLORS = {
  rare: { bg: "rgba(59, 130, 246, 0.15)", text: "#60a5fa", border: "rgba(59, 130, 246, 0.3)" },
  epic: { bg: "rgba(168, 85, 247, 0.15)", text: "#c084fc", border: "rgba(168, 85, 247, 0.3)" },
  legendary: { bg: "rgba(245, 158, 11, 0.15)", text: "#fbbf24", border: "rgba(245, 158, 11, 0.3)" },
  mythic: { bg: "rgba(244, 63, 94, 0.15)", text: "#fb7185", border: "rgba(244, 63, 94, 0.3)" },
} as const

export const COLORS = {
  background: "#0d3320",
  foreground: "#e8f5e9",
  card: "#163d28",
  cardForeground: "#e8f5e9",
  primary: "#40916c",
  primaryForeground: "#0a1f14",
  secondary: "#1e4d32",
  secondaryForeground: "#c8e6c9",
  muted: "#1a3d28",
  mutedForeground: "#81c784",
  accent: "#dda15e",
  accentForeground: "#3d2008",
  border: "#2d5a40",
  chart1: "#40916c",
  chart2: "#2d8a70",
  chart3: "#dda15e",
  chart4: "#2d6a80",
  chart5: "#52b788",
  destructive: "#ef4444",
} as const

export type FlagTheme = (typeof FLAG_THEMES)[number]
export type BgTheme = (typeof BG_THEMES)[number]
export type TitleOption = (typeof TITLE_OPTIONS)[number]
export type TierKey = keyof typeof TIER_COLORS
