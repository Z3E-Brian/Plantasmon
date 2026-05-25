// auth importada para obtener el UID real del usuario autenticado
// en lugar del CURRENT_USER_ID = "u_001" hardcodeado (Phase 1: Authentication Foundation)
import { auth, db } from "@/src/config/firebase";
import {
  Timestamp,
  doc,
  getDoc,
  updateDoc,
  setDoc,
  serverTimestamp,
} from "firebase/firestore";

// Reemplaza CURRENT_USER_ID = "u_001". Obtiene el UID del usuario autenticado
// desde Firebase Auth, asi cada usuario ve sus propios datos (HOME-01, PROF-01).
export function getCurrentUserId(): string | null {
  return auth.currentUser?.uid ?? null;
}

export function requireUserId(userId?: string): string {
  const uid = userId ?? getCurrentUserId();
  if (!uid) throw new Error("Usuario no autenticado");
  return uid;
}

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
  longestStreak: number;
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

export async function getUserProfile(userId?: string): Promise<UserProfile | null> {
  const resolvedUserId = userId ?? getCurrentUserId();
  if (!resolvedUserId) return null;
  try {
    const ref = doc(db, "users", resolvedUserId);
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
      longestStreak: data.stats?.longestStreak ?? 0,
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
  userId?: string,
  settings: Partial<{ themeId: string; titleId: string; frameId: string; notificationsEnabled: boolean }>
): Promise<void> {
  try {
    const resolvedUserId = requireUserId(userId);
    const ref = doc(db, "users", resolvedUserId);
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
  userId?: string,
  data: Partial<{ bio: string; location: string }>
): Promise<void> {
  try {
    const resolvedUserId = requireUserId(userId);
    const ref = doc(db, "users", resolvedUserId);
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

/**
 * Fire-and-forget: report 'water' mission progress event.
 * Uses late import to avoid circular dependency with useMissionProgress.
 * This import is resolved at call time, not module evaluation time, via
 * inline require() so Metro/CJS bundlers handle the circular dep correctly.
 */
function reportWaterMissionProgress(userId: string): void {
  try {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const { reportMissionProgress } = require("@/src/hooks/useMissionProgress");
    reportMissionProgress("water", userId).catch((err: unknown) =>
      console.error("Error in reportMissionProgress(water):", err)
    );
  } catch (error) {
    console.error("Error reporting water mission progress:", error);
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
  userId?: string
): Promise<void> {
  try {
    const resolvedUserId = requireUserId(userId);
    const ref = doc(db, "users", resolvedUserId);
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
        "stats.longestStreak": 1,
      });

      // Fire-and-forget: report water mission progress (D-08)
      reportWaterMissionProgress(resolvedUserId);

      // Log watering activity — Phase 9: D-02
      try {
        // eslint-disable-next-line @typescript-eslint/no-var-requires
        const { logActivity } = require("@/src/services/activityService");
        logActivity(resolvedUserId, {
          type: "water",
          title: "💧 Riego registrado",
          description: `Riego registrado el ${toDateStr(today)}`,
          iconType: "water",
          metadata: { plantName: undefined },
        }).catch((err: unknown) => console.error("Error logging water activity:", err));
      } catch (e) {
        /* silent — logging must not block watering */
      }

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

    // Track longest streak (historical max) per D-18
    const currentLongestStreak: number = data.stats?.longestStreak ?? 0;
    const updatedLongestStreak =
      newStreak > currentLongestStreak ? newStreak : currentLongestStreak;

    await updateDoc(ref, {
      "stats.lastWateredDate": today.toISOString(),
      "stats.streakDays": newStreak,
      "stats.longestStreak": updatedLongestStreak,
    });

    // Fire-and-forget: report water mission progress (D-08)
    reportWaterMissionProgress(resolvedUserId);

    // Log watering activity — Phase 9: D-02
    try {
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      const { logActivity } = require("@/src/services/activityService");
      logActivity(resolvedUserId, {
        type: "water",
        title: "💧 Riego registrado",
        description: `Riego registrado el ${toDateStr(today)}`,
        iconType: "water",
        metadata: { plantName: undefined },
      }).catch((err: unknown) => console.error("Error logging water activity:", err));
    } catch (e) {
      /* silent — logging must not block watering */
    }
  } catch (error) {
    console.error("Error registrando actividad de riego:", error);
    throw error;
  }
}

function toDateStr(d: Date): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

// Crea el documento del usuario en Firestore tras el registro (AUTH-01).
// Se llama desde registerScreen.tsx con el uid devuelto por Firebase Auth.
// Los campos coinciden con lo que esperan HomeScreen, ProfileScreen, etc.
export async function createUserDocument(uid: string, email: string, displayName?: string): Promise<void> {
  try {
    const ref = doc(db, "users", uid);
    const snapshot = await getDoc(ref);
    if (snapshot.exists()) {
      console.log("El documento del usuario ya existe:", uid);
      return;
    }
    const name = displayName || email.split("@")[0] || "";
    await setDoc(ref, {
      displayName: name,
      email,
      username: "",
      aboutme: "Amante de las plantas",
      location: "Sin ubicacion",
      avatarUrl: "",
      rarestFind: "Por descubrir",
      careScore: 0,
      createdAt: serverTimestamp(),
      stats: {
        level: 1,
        xp: 0,
        xpToNextLevel: 1000,
        plantsIdentified: 0,
        streakDays: 0,
        lastWateredDate: null,
        longestStreak: 0,
      },
      missions: {
        assignedDailyIds: [],
        assignedWeeklyIds: [],
        missionProgress: [],
        lastDailyRefresh: null,
        lastWeeklyRefresh: null,
      },
      obtainedItems: [],
      settings: {
        themeId: "theme_forest",
        titleId: "",
        frameId: "",
      },
      userPlants: [],
      userAchievements: [],
    });
    console.log("Documento de usuario creado:", uid);
  } catch (error) {
    console.error("Error creando documento de usuario:", error);
    throw error;
  }
}
