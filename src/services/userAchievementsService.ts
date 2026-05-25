import { db } from "@/src/config/firebase";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
} from "firebase/firestore";
// Reemplaza CURRENT_USER_ID por getCurrentUserId() (Phase 1: Authentication Foundation)
// para que cada usuario vea sus propios logros (PROF-03).
import { getAccountAge, getCurrentUserId } from "./userService";

export interface UserAchievement {
  id: string;
  name: string;
  description: string;
  category: string;
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
  rewardItemId?: string; // NEW: optional item granted on unlock (D-21)
}

export function logAchievementUnlockActivity(
  userId: string,
  achievement: { id: string; name?: string }
): void {
  try {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const { logActivity } = require("@/src/services/activityService");
    logActivity(userId, {
      type: "achievement",
      title: "🏅 Logro desbloqueado",
      description: `Desbloqueaste "${achievement.name || "nuevo logro"}"`,
      iconType: "award",
      metadata: { achievementId: achievement.id || undefined },
    }).catch((err: unknown) => console.error("Error logging achievement activity:", err));
  } catch (e) {
    /* silent */
  }
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

  // ── Streak (longestStreak / historical max) ────────────────
  {
    id: "longest_streak_3",
    name: "3 Días de Racha Máxima",
    description: "Alcanza una racha histórica de 3 días",
    category: "streak",
    icon: "fire",
    requirement: { type: "longest_streak", count: 3 },
    isSecret: false,
  },
  {
    id: "longest_streak_7",
    name: "7 Días de Racha Máxima",
    description: "Alcanza una racha histórica de 7 días",
    category: "streak",
    icon: "fire",
    requirement: { type: "longest_streak", count: 7 },
    isSecret: false,
  },
  {
    id: "longest_streak_14",
    name: "14 Días de Racha Máxima",
    description: "Alcanza una racha histórica de 14 días",
    category: "streak",
    icon: "star",
    requirement: { type: "longest_streak", count: 14 },
    isSecret: false,
  },
  {
    id: "longest_streak_30",
    name: "30 Días de Racha Máxima",
    description: "Alcanza una racha histórica de 30 días",
    category: "streak",
    icon: "crown",
    requirement: { type: "longest_streak", count: 30 },
    isSecret: false,
  },

  // ── Account Age (D-19) ──────────────────────────────────────
  {
    id: "account_100_days",
    name: "100 Días Activo",
    description: "Celebra 100 días desde tu registro",
    category: "usage",
    icon: "calendar",
    requirement: { type: "account_age_days", count: 100 },
    isSecret: false,
  },
  {
    id: "account_1_year",
    name: "1 Año Activo",
    description: "Celebra 1 año desde tu registro",
    category: "usage",
    icon: "calendar",
    requirement: { type: "account_age_days", count: 365 },
    isSecret: false,
  },

  // ── Weekly Active (D-20) ────────────────────────────────────
  {
    id: "weekly_all_complete",
    name: "Semana Completa",
    description: "Completa todas las misiones semanales",
    category: "special",
    icon: "trophy",
    requirement: { type: "weekly_missions", count: 1 },
    isSecret: false,
  },
];

function mapEmoji(category: string, name: string): string {
  const lower = name.toLowerCase();
  if (lower.includes("primera") || lower.includes("first")) return "sprout";
  if (lower.includes("rara") || lower.includes("rare")) return "star";
  if (lower.includes("maestro") || lower.includes("master")) return "crown";
  if (lower.includes("racha máxima")) {
    if (lower.includes("30")) return "crown";
    return "fire";
  }
  if (lower.includes("semana completa")) return "trophy";
  if (category === "collection") {
    if (lower.includes("especies") || lower.includes("species")) return "globe";
    return "magnify";
  }
  if (category === "streak") {
    if (lower.includes("racha") && (lower.includes("7") || lower.includes("14") || lower.includes("30"))) return "fire";
    return "water";
  }
  if (category === "usage") {
    if (lower.includes("foto") || lower.includes("photo") || lower.includes("cámara") || lower.includes("camera")) return "camera";
    return "calendar";
  }
  if (category === "special") {
    if (lower.includes("mision") || lower.includes("mission") || lower.includes("trophy")) return "trophy";
    if (lower.includes("pint") || lower.includes("personaliza") || lower.includes("customize")) return "paint";
    if (lower.includes("dato") || lower.includes("fact") || lower.includes("book")) return "book";
    return "star";
  }
  return "sprout";
}

export async function getUserAchievements(userId?: string): Promise<{
  achievements: UserAchievement[];
  earned: number;
  total: number;
}> {
  const resolvedUserId = userId ?? getCurrentUserId();
  if (!resolvedUserId) return { achievements: [], earned: 0, total: 0 };
  try {
    // 1. Leer el documento del usuario para obtener el array userAchievements
    const userRef = doc(db, "users", resolvedUserId);
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
      console.warn("Colección achievements vacía — usando definiciones locales");
      const localAch = userAchievements.length > 0
        ? userAchievements.map((a: any) => {
            const def = INITIAL_ACHIEVEMENTS.find((d) => d.id === a.id)
            return {
              id: a.id,
              name: def?.name ?? a.id,
              description: def?.description ?? "",
              category: def?.category ?? "special",
              earned: a.unlocked ?? false,
              emoji: mapEmoji(def?.category ?? "special", def?.name ?? ""),
              progress: a.progress,
              target: a.target ?? def?.requirement.count ?? 1,
              xpReward: def?.xpReward ?? 0,
            } as UserAchievement
          })
        : INITIAL_ACHIEVEMENTS.map((def) => ({
            id: def.id,
            name: def.name,
            description: def.description,
            category: def.category,
            earned: false,
            emoji: mapEmoji(def.category, def.name),
            progress: 0,
            target: def.requirement.count,
            xpReward: def.xpReward ?? 0,
          } as UserAchievement))
      const earned = localAch.filter((a: UserAchievement) => a.earned).length
      return { achievements: localAch, earned, total: localAch.length }
    }

    // Map de progreso del usuario por id para lookup rápido
    const userAchMap = new Map(
      userAchievements.map((a: any) => [a.id, a])
    );

    // 3. Combinar datos globales + progreso del usuario
    const achievements: UserAchievement[] = [];

    for (const achDoc of achSnap.docs) {
      const global = achDoc.data();
      const userAch = userAchMap.get(achDoc.id);

      // Handle longest_streak achievements (D-18) — computed from stats.longestStreak
      if (global.requirement?.type === "longest_streak" && !userAch) {
        const longestStreak = userData.stats?.longestStreak ?? 0;
        const target = global.requirement.count;
        const earned = longestStreak >= target;
        achievements.push({
          id: achDoc.id,
          name: global.name,
          description: global.description,
          category: global.category,
          earned,
          emoji: mapEmoji(global.category, global.name),
          progress: Math.min(longestStreak, target),
          target,
          xpReward: global.xpReward ?? 0,
        });
        continue;
      }

      // Handle account_age_days achievements (D-19) — computed from createdAt
      if (global.requirement?.type === "account_age_days" && !userAch) {
        const createdAt = userData.createdAt;
        const ageDays = createdAt
          ? getAccountAge(createdAt.toDate?.() ?? new Date(createdAt))
          : 0;
        const target = global.requirement.count;
        const earned = ageDays >= target;
        achievements.push({
          id: achDoc.id,
          name: global.name,
          description: global.description,
          category: global.category,
          earned,
          emoji: mapEmoji(global.category, global.name),
          progress: Math.min(ageDays, target),
          target,
          xpReward: global.xpReward ?? 0,
        });
        continue;
      }

      // Handle weekly_missions achievements (D-20) — computed from missions data
      if (global.requirement?.type === "weekly_missions" && !userAch) {
        const missions = userData.missions;
        const weeklyProgress = missions?.missionProgress ?? [];
        const weeklyIds = missions?.assignedWeeklyIds ?? [];
        const weeklyCompleted =
          weeklyIds.length > 0 &&
          weeklyIds.every((id: string) =>
            weeklyProgress.find(
              (p: any) => p.id === id && p.completed && p.claimed
            )
          );
        const earned = weeklyCompleted;
        achievements.push({
          id: achDoc.id,
          name: global.name,
          description: global.description,
          category: global.category,
          earned,
          emoji: mapEmoji(global.category, global.name),
          progress: earned ? 1 : 0,
          target: 1,
          xpReward: global.xpReward ?? 0,
        });
        continue;
      }

      // Default: use existing mapping for standard achievements
      achievements.push({
        id: achDoc.id,
        name: global.name,
        description: global.description,
        category: global.category,
        earned: userAch?.unlocked ?? false,
        emoji: mapEmoji(global.category, global.name),
        progress: userAch?.progress,
        target: userAch?.target ?? global.target,
        xpReward: global.xpReward ?? 0,
      });
    }

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
