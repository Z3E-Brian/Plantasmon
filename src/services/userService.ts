import { db } from "@/src/config/firebase";
import {
  Timestamp,
  doc,
  getDoc,
  updateDoc,
} from "firebase/firestore";

export const CURRENT_USER_ID = "u_001";

export interface UserProfile {
  // ProfileHero
  name: string;
  handle: string;
  level: number;
  xp: number;
  xpToNextLevel: number;
  plantsOwned: number;
  plantsDiscovered: number;
  joinDate: Date;
  avatarUrl: string;

  // ProfileAbout
  bio: string;
  location: string;
  streak: number;
  careScore: number;
  rarestFind: string;
  achievements: number;
  totalAchievements: number;

  // Settings
  themeId: string;
  titleId: string;
  frameId: string;
}

function safeParseDate(value: unknown): Date {
  if (!value) return new Date();
  if (value instanceof Timestamp) return value.toDate();
  if (value instanceof Date) return value;
  const d = new Date(value as any);
  return isNaN(d.getTime()) ? new Date() : d;
}

export async function getUserProfile(userId: string = CURRENT_USER_ID): Promise<UserProfile | null> {
  try {
    const ref = doc(db, "users", userId);
    const snapshot = await getDoc(ref);

    if (!snapshot.exists()) {
      console.warn("Usuario no encontrado:", userId);
      return null;
    }

    const data = snapshot.data();

    // Computar valores reales desde userPlants en vez de stats mockeados
    const userPlants: any[] =
      data.subcollections?.userPlants ?? data.userPlants ?? [];
    const realPlantCount = userPlants.length;

    // Computar racha real desde lastWateredDate
    const lastWateredStr: string | null = data.stats?.lastWateredDate ?? null;
    let realStreak = 0;
    if (lastWateredStr) {
      const lastWatered = safeParseDate(lastWateredStr);
      const today = new Date();
      const diffDays = Math.floor(
        (today.getTime() - lastWatered.getTime()) / (1000 * 60 * 60 * 24)
      );
      if (diffDays === 0) {
        realStreak = data.stats?.streakDays ?? 1;
      } else if (diffDays === 1) {
        realStreak = data.stats?.streakDays ?? 1;
      }
    }

    return {
      name: data.displayName ?? data.username ?? "Usuario",
      handle: `#${data.username ?? "PlantUser"}`,
      level: data.stats?.level ?? 1,
      xp: data.stats?.xp ?? 0,
      xpToNextLevel: data.stats?.xpToNextLevel ?? 1000,
      plantsOwned: realPlantCount,
      plantsDiscovered: realPlantCount,
      joinDate: safeParseDate(data.createdAt),
      avatarUrl: data.avatarUrl ?? "",

      // ✅ Firebase usa "aboutme", no "bio"
      bio: data.aboutme ?? "Amante de las plantas 🌿",
      location: data.location ?? "Sin ubicación",
      streak: realStreak,
      careScore: data.careScore ?? 90,
      rarestFind: data.rarestFind ?? "Por descubrir",
      achievements: 0,
      totalAchievements: 0,

      themeId: data.settings?.themeId ?? "theme_forest",
      titleId: data.settings?.titleId ?? "",
      frameId: data.settings?.frameId ?? "",
    };
  } catch (error) {
    console.error("Error obteniendo perfil:", error);
    return null;
  }
}

export async function updateUserSettings(
  userId: string = CURRENT_USER_ID,
  settings: Partial<{ themeId: string; titleId: string; frameId: string; notificationsEnabled: boolean }>
): Promise<void> {
  try {
    const ref = doc(db, "users", userId);
    await updateDoc(ref, {
      "settings.themeId": settings.themeId,
      "settings.titleId": settings.titleId,
      "settings.frameId": settings.frameId,
    });
  } catch (error) {
    console.error("Error actualizando settings:", error);
    throw error;
  }
}

export async function updateUserBio(
  userId: string = CURRENT_USER_ID,
  data: Partial<{ bio: string; location: string }>
): Promise<void> {
  try {
    const ref = doc(db, "users", userId);
    const updateData: Record<string, any> = {};

    // ✅ Escribir en "aboutme", que es el campo real en Firebase
    if (data.bio !== undefined)      updateData["aboutme"]  = data.bio;
    if (data.location !== undefined) updateData["location"] = data.location;

    await updateDoc(ref, updateData);
  } catch (error) {
    console.error("Error actualizando bio:", error);
    throw error;
  }
}

// ─── Helpers de StatsBar ─────────────────────────────────────────────────────

/**
 * Calcula los días transcurridos desde la fecha de creación de la cuenta.
 */
export function getAccountAge(joinDate: Date): number {
  const now = new Date();
  const diff = now.getTime() - joinDate.getTime();
  return Math.floor(diff / (1000 * 60 * 60 * 24));
}

/**
 * Registra una actividad de riego y actualiza la racha (streak).
 *
 * Lógica:
 * - Si lastWateredDate es hoy: no cambia (ya registrado)
 * - Si lastWateredDate fue ayer: incrementa streak en 1
 * - Si lastWateredDate es más antiguo: reinicia streak a 1
 * - Si no hay lastWateredDate: establece streak a 1
 */
export async function logWateringActivity(
  userId: string = CURRENT_USER_ID
): Promise<void> {
  try {
    const ref = doc(db, "users", userId);
    const snapshot = await getDoc(ref);

    if (!snapshot.exists()) {
      console.warn("Usuario no encontrado para logWateringActivity:", userId);
      return;
    }

    const data = snapshot.data();
    const today = new Date();
    const todayStr = toDateStr(today);

    const lastWateredDateStr: string | null = data.stats?.lastWateredDate ?? null;

    if (!lastWateredDateStr) {
      // Primera vez que riega
      await updateDoc(ref, {
        "stats.lastWateredDate": today.toISOString(),
        "stats.streakDays": 1,
      });
      return;
    }

    const lastWateredDate = new Date(lastWateredDateStr);
    const lastWateredStr = toDateStr(lastWateredDate);

    // Ya registrado hoy — no cambia
    if (lastWateredStr === todayStr) return;

    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = toDateStr(yesterday);

    const currentStreak: number = data.stats?.streakDays ?? 0;
    const newStreak = lastWateredStr === yesterdayStr ? currentStreak + 1 : 1;

    await updateDoc(ref, {
      "stats.lastWateredDate": today.toISOString(),
      "stats.streakDays": newStreak,
    });
  } catch (error) {
    console.error("Error registrando actividad de riego:", error);
    throw error;
  }
}

function toDateStr(d: Date): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}
