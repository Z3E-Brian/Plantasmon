export const USER = {
  name: "Fern Greenleaf",
  handle: "#PlantWhisperer",
  level: 47,
  joinDate: new Date("2024-06-15"),
  plantsOwned: 47,
  plantsDiscovered: 213,
  totalScans: 1259,
  xp: 32315,
  bio: "Plant parent, nature lover, and aspiring botanist. On a mission to identify every plant in my neighborhood. Currently obsessed with tropical aroids and rare succulents.",
  location: "Portland, OR",
  streak: 12,
  careScore: 94,
  rarestFind: "Ghost Orchid",
  achievements: 4,
  totalAchievements: 8,
}

export interface Plant {
  id: number
  name: string
  scientificName: string
  image: string
  waterLevel: "low" | "medium" | "high"
  sunlight: "shade" | "partial" | "full"
  health: "thriving" | "good" | "needs-care"
  lastWatered: string
  daysOwned: number
  favorite: boolean
}

export const PLANTS: Plant[] = [
  {
    id: 1,
    name: "Monstera Deliciosa",
    scientificName: "Monstera deliciosa",
    image: "https://images.unsplash.com/photo-1614594975525-e45190c55d0b?w=400",
    waterLevel: "medium",
    sunlight: "partial",
    health: "thriving",
    lastWatered: "2 days ago",
    daysOwned: 342,
    favorite: true,
  },
  {
    id: 2,
    name: "Boston Fern",
    scientificName: "Nephrolepis exaltata",
    image: "https://images.unsplash.com/photo-1459411552884-841db9b3cc2a?w=400",
    waterLevel: "high",
    sunlight: "shade",
    health: "good",
    lastWatered: "1 day ago",
    daysOwned: 210,
    favorite: false,
  },
  {
    id: 3,
    name: "Echeveria Collection",
    scientificName: "Echeveria elegans",
    image: "https://images.unsplash.com/photo-1509423350716-97f9360b4e09?w=400",
    waterLevel: "low",
    sunlight: "full",
    health: "thriving",
    lastWatered: "5 days ago",
    daysOwned: 178,
    favorite: true,
  },
  {
    id: 4,
    name: "Golden Pothos",
    scientificName: "Epipremnum aureum",
    image: "https://images.unsplash.com/photo-1572688484438-313a6e50c333?w=400",
    waterLevel: "medium",
    sunlight: "partial",
    health: "thriving",
    lastWatered: "3 days ago",
    daysOwned: 420,
    favorite: false,
  },
  {
    id: 5,
    name: "Fiddle Leaf Fig",
    scientificName: "Ficus lyrata",
    image: "https://images.unsplash.com/photo-1459411552884-841db9b3cc2a?w=400",
    waterLevel: "medium",
    sunlight: "partial",
    health: "needs-care",
    lastWatered: "4 days ago",
    daysOwned: 95,
    favorite: true,
  },
  {
    id: 6,
    name: "Snake Plant",
    scientificName: "Dracaena trifasciata",
    image: "https://images.unsplash.com/photo-1593482892290-f54927ae1bb6?w=400",
    waterLevel: "low",
    sunlight: "partial",
    health: "thriving",
    lastWatered: "7 days ago",
    daysOwned: 510,
    favorite: false,
  },
]

export interface Activity {
  id: number
  type: "identified" | "watered" | "added" | "achievement" | "milestone"
  title: string
  description: string
  time: string
  iconType: "camera" | "water" | "leaf" | "award" | "sparkles"
}

export const ACTIVITIES: Activity[] = [
  {
    id: 1,
    type: "identified",
    title: "Identified a new plant",
    description: "Used camera to identify Calathea orbifolia in the wild",
    time: "2 hours ago",
    iconType: "camera",
  },
  {
    id: 2,
    type: "watered",
    title: "Watered Monstera Deliciosa",
    description: "Regular watering schedule maintained",
    time: "5 hours ago",
    iconType: "water",
  },
  {
    id: 3,
    type: "added",
    title: "Added Snake Plant to collection",
    description: "Dracaena trifasciata joined the family",
    time: "1 day ago",
    iconType: "leaf",
  },
  {
    id: 4,
    type: "achievement",
    title: "Earned 'Green Thumb' badge",
    description: "Successfully cared for 40+ plants",
    time: "2 days ago",
    iconType: "award",
  },
  {
    id: 5,
    type: "milestone",
    title: "200 plants identified!",
    description: "Reached a major milestone in plant identification",
    time: "3 days ago",
    iconType: "sparkles",
  },
]

export interface Achievement {
  id: number
  name: string
  description: string
  earned: boolean
  emoji: string
}

export const ACHIEVEMENTS: Achievement[] = [
  { id: 1, name: "First Leaf", description: "Identified your first plant", earned: true, emoji: "sprout" },
  { id: 2, name: "Green Thumb", description: "Care for 40+ plants", earned: true, emoji: "thumb" },
  { id: 3, name: "Plant Hunter", description: "Discover 100 species", earned: true, emoji: "magnify" },
  { id: 4, name: "Biome Explorer", description: "Discover 200 species", earned: true, emoji: "globe" },
  { id: 5, name: "Water Master", description: "Keep a 30-day watering streak", earned: false, emoji: "water" },
  { id: 6, name: "Rare Finder", description: "Identify 10 rare plants", earned: false, emoji: "star" },
  { id: 7, name: "Botanist Pro", description: "Identify 500 species", earned: false, emoji: "crown" },
  { id: 8, name: "Forest Keeper", description: "1 year of active plant care", earned: false, emoji: "tree" },
]

export function getAccountAge(joinDate: Date): number {
  const now = new Date()
  const diff = now.getTime() - joinDate.getTime()
  return Math.floor(diff / (1000 * 60 * 60 * 24))
}
