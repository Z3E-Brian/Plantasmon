import { db } from "@/src/config/firebase";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
} from "firebase/firestore";
import { CURRENT_USER_ID } from "./userService";

export interface UserAchievement {
  id: string;
  name: string;
  description: string;
  earned: boolean;
  emoji: string;
  progress?: number;
  target?: number;
  xpReward: number;
}

export interface AchievementDefinition {
  id: string;
  name: string;
  description: string;
  category: "collection" | "streak" | "usage" | "special";
  icon: string;
  requirement: { type: string; count: number };
  isSecret: boolean;
}

export const INITIAL_ACHIEVEMENTS: AchievementDefinition[] = [
  // ── Collection ──────────────────────────────────────────────
  {
    id: "first_plant",
    name: "Primera Planta Identificada",
    description: "Identifica tu primera planta",
    category: "collection",
    icon: "sprout",
    requirement: { type: "identifications", count: 1 },
    isSecret: false,
  },
  {
    id: "five_plants",
    name: "5 Plantas Identificadas",
    description: "Identifica 5 plantas",
    category: "collection",
    icon: "magnify",
    requirement: { type: "identifications", count: 5 },
    isSecret: false,
  },
  {
    id: "ten_plants",
    name: "10 Plantas Identificadas",
    description: "Identifica 10 plantas",
    category: "collection",
    icon: "magnify",
    requirement: { type: "identifications", count: 10 },
    isSecret: false,
  },
  {
    id: "twentyfive_plants",
    name: "25 Plantas Identificadas",
    description: "Identifica 25 plantas",
    category: "collection",
    icon: "crown",
    requirement: { type: "identifications", count: 25 },
    isSecret: false,
  },
  {
    id: "fifty_plants",
    name: "50 Plantas Identificadas",
    description: "Identifica 50 plantas",
    category: "collection",
    icon: "crown",
    requirement: { type: "identifications", count: 50 },
    isSecret: false,
  },
  {
    id: "three_species",
    name: "3 Especies Diferentes",
    description: "Identifica 3 especies diferentes",
    category: "collection",
    icon: "globe",
    requirement: { type: "species", count: 3 },
    isSecret: false,
  },
  {
    id: "five_species",
    name: "5 Especies Diferentes",
    description: "Identifica 5 especies diferentes",
    category: "collection",
    icon: "globe",
    requirement: { type: "species", count: 5 },
    isSecret: false,
  },
  {
    id: "ten_species",
    name: "10 Especies Diferentes",
    description: "Identifica 10 especies diferentes",
    category: "collection",
    icon: "globe",
    requirement: { type: "species", count: 10 },
    isSecret: false,
  },

  // ── Streak / Care ───────────────────────────────────────────
  {
    id: "first_water",
    name: "Primer Riego Registrado",
    description: "Registra tu primer riego",
    category: "streak",
    icon: "water",
    requirement: { type: "waterings", count: 1 },
    isSecret: false,
  },
  {
    id: "streak_3",
    name: "Racha de 3 Días",
    description: "Mantén una racha de riego de 3 días",
    category: "streak",
    icon: "water",
    requirement: { type: "streak", count: 3 },
    isSecret: false,
  },
  {
    id: "streak_7",
    name: "Racha de 7 Días",
    description: "Mantén una racha de riego de 7 días",
    category: "streak",
    icon: "fire",
    requirement: { type: "streak", count: 7 },
    isSecret: false,
  },
  {
    id: "streak_14",
    name: "Racha de 14 Días",
    description: "Mantén una racha de riego de 14 días",
    category: "streak",
    icon: "fire",
    requirement: { type: "streak", count: 14 },
    isSecret: false,
  },
  {
    id: "streak_30",
    name: "Racha de 30 Días",
    description: "Mantén una racha de riego de 30 días",
    category: "streak",
    icon: "star",
    requirement: { type: "streak", count: 30 },
    isSecret: false,
  },
  {
    id: "ten_waterings",
    name: "10 Riegos",
    description: "Realiza 10 riegos en total",
    category: "streak",
    icon: "water",
    requirement: { type: "waterings", count: 10 },
    isSecret: false,
  },
  {
    id: "fifty_waterings",
    name: "50 Riegos",
    description: "Realiza 50 riegos en total",
    category: "streak",
    icon: "water",
    requirement: { type: "waterings", count: 50 },
    isSecret: false,
  },
  {
    id: "hundred_waterings",
    name: "100 Riegos",
    description: "Realiza 100 riegos en total",
    category: "streak",
    icon: "water",
    requirement: { type: "waterings", count: 100 },
    isSecret: false,
  },

  // ── Usage ───────────────────────────────────────────────────
  {
    id: "first_day",
    name: "Primer Día en la App",
    description: "Usa la app por primera vez",
    category: "usage",
    icon: "calendar",
    requirement: { type: "days_active", count: 1 },
    isSecret: false,
  },
  {
    id: "seven_days",
    name: "7 Días Activo",
    description: "Está activo 7 días",
    category: "usage",
    icon: "calendar",
    requirement: { type: "days_active", count: 7 },
    isSecret: false,
  },
  {
    id: "thirty_days",
    name: "30 Días Activo",
    description: "Está activo 30 días",
    category: "usage",
    icon: "calendar",
    requirement: { type: "days_active", count: 30 },
    isSecret: false,
  },
  {
    id: "fifty_photos",
    name: "50 Fotos Tomadas",
    description: "Toma 50 fotos de plantas",
    category: "usage",
    icon: "camera",
    requirement: { type: "identifications", count: 50 },
    isSecret: false,
  },
  {
    id: "hundred_photos",
    name: "100 Fotos Tomadas",
    description: "Toma 100 fotos de plantas",
    category: "usage",
    icon: "camera",
    requirement: { type: "identifications", count: 100 },
    isSecret: false,
  },

  // ── Special ─────────────────────────────────────────────────
  {
    id: "rare_plant",
    name: "Identifica una Planta Rara",
    description: "Identifica una planta rara",
    category: "special",
    icon: "star",
    requirement: { type: "rare_find", count: 1 },
    isSecret: true,
  },
  {
    id: "all_missions",
    name: "Completa Todas las Misiones",
    description: "Completa todas las misiones diarias",
    category: "special",
    icon: "trophy",
    requirement: { type: "daily_missions", count: 1 },
    isSecret: true,
  },
  {
    id: "customize_profile",
    name: "Personaliza tu Perfil",
    description: "Personaliza tu perfil",
    category: "special",
    icon: "paint",
    requirement: { type: "customization", count: 1 },
    isSecret: false,
  },
  {
    id: "five_facts",
    name: "Ve 5 Datos Curiosos",
    description: "Ve 5 datos curiosos sobre plantas",
    category: "special",
    icon: "book",
    requirement: { type: "fun_facts", count: 5 },
    isSecret: true,
  },
];

function mapEmoji(category: string, name: string): string {
  if (name.toLowerCase().includes("primera") || name.toLowerCase().includes("first")) return "sprout";
  if (category === "identification" && name.toLowerCase().includes("maestro")) return "crown";
  if (category === "identification") return "magnify";
  if (category === "care") return "water";
  if (category === "collection") return "globe";
  return "sprout";
}

export async function getUserAchievements(userId: string = CURRENT_USER_ID): Promise<{
  achievements: UserAchievement[];
  earned: number;
  total: number;
}> {
  try {
    // 1. Leer el documento del usuario para obtener el array userAchievements
    const userRef = doc(db, "users", userId);
    const userSnap = await getDoc(userRef);

    if (!userSnap.exists()) {
      console.warn("Usuario no encontrado:", userId);
      return { achievements: [], earned: 0, total: 0 };
    }

    const userData = userSnap.data();

    // Soporta "subcollections.userAchievements" o "userAchievements" directo
    const userAchievements: any[] =
      userData.subcollections?.userAchievements ??
      userData.userAchievements ??
      [];

    // 2. Leer colección global achievements
    const achSnap = await getDocs(collection(db, "achievements"));

    if (achSnap.empty) {
      console.warn("Colección achievements vacía");
      return { achievements: [], earned: 0, total: 0 };
    }

    // Map de progreso del usuario por id para lookup rápido
    const userAchMap = new Map(
      userAchievements.map((a: any) => [a.id, a])
    );

    // 3. Combinar datos globales + progreso del usuario
    const achievements: UserAchievement[] = achSnap.docs.map((achDoc) => {
      const global = achDoc.data();
      const userAch = userAchMap.get(achDoc.id);

      return {
        id: achDoc.id,
        name: global.name,
        description: global.description,
        earned: userAch?.unlocked ?? false,
        emoji: mapEmoji(global.category, global.name),
        progress: userAch?.progress,
        target: userAch?.target ?? global.target,
        xpReward: global.xpReward,
      };
    });

    const earned = achievements.filter((a) => a.earned).length;

    return { achievements, earned, total: achievements.length };
  } catch (error) {
    console.error("Error obteniendo logros:", error);
    return { achievements: [], earned: 0, total: 0 };
  }
}

export async function seedAchievements(): Promise<void> {
  try {
    const achievementsRef = collection(db, "achievements");
    const snapshot = await getDocs(achievementsRef);

    if (!snapshot.empty) {
      console.log(
        "La colección 'achievements' ya tiene datos. Omitiendo seed."
      );
      return;
    }

    for (const achievement of INITIAL_ACHIEVEMENTS) {
      await setDoc(doc(db, "achievements", achievement.id), achievement, {
        merge: true,
      });
      console.log(`Logro creado: ${achievement.id} — ${achievement.name}`);
    }

    console.log(
      `Seed completado: ${INITIAL_ACHIEVEMENTS.length} logros creados.`
    );
  } catch (error) {
    console.error("Error durante el seed de logros:", error);
    throw error;
  }
}
