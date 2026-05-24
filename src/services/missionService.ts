import { db } from "@/src/config/firebase";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import { getCurrentUserId } from "./userService";
import {
  DAILY_MISSIONS,
  WEEKLY_MISSIONS,
  type MissionDefinition,
} from "@/src/constants/missionsData";

// ─── Types ──────────────────────────────────────────────────────

export type MissionType = "daily" | "weekly";

export interface AssignedMission {
  id: string;
  type: MissionType;
  progress: number;
  target: number;
  completed: boolean;
  claimed: boolean;
  claimedAt?: string;
}

export interface MissionProgress {
  existing: { id: string; progress: number }[];
  currentValue: number;
}

// ─── Helpers ─────────────────────────────────────────────────────

function toDateStr(d: Date): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

function getWeekNumber(date: Date): number {
  const startOfYear = new Date(date.getFullYear(), 0, 1);
  const diff =
    (date.getTime() - startOfYear.getTime() +
      (startOfYear.getDay() + 1) * 86400000) /
    86400000;
  return Math.ceil(diff / 7);
}

/**
 * Deterministic pseudo-random pick from an array using a seed string.
 * Same seed + same array → same selection every time.
 */
function deterministicPick<T>(items: T[], count: number, seed: string): T[] {
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    hash = (hash * 31 + seed.charCodeAt(i)) | 0;
  }

  const shuffled = [...items];
  for (let i = shuffled.length - 1; i > 0; i--) {
    hash = (hash * 1103515245 + 12345) | 0;
    const j = Math.abs(hash) % (i + 1);
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }

  return shuffled.slice(0, count);
}

// ─── Seed Missions ───────────────────────────────────────────────

/**
 * Seeds the Firestore `missions` collection with 25 daily + 10 weekly
 * mission definitions if the collection is empty.
 */
export async function seedMissions(): Promise<void> {
  try {
    const missionsRef = collection(db, "missions");
    const snapshot = await getDocs(missionsRef);

    if (!snapshot.empty) {
      console.log(
        "La colección 'missions' ya tiene datos. Omitiendo seed."
      );
      return;
    }

    for (const mission of DAILY_MISSIONS) {
      await setDoc(
        doc(db, "missions", mission.id),
        { ...mission, type: "daily" },
        { merge: true }
      );
      console.log(`Misión diaria creada: ${mission.id} — ${mission.title}`);
    }

    for (const mission of WEEKLY_MISSIONS) {
      await setDoc(
        doc(db, "missions", mission.id),
        { ...mission, type: "weekly" },
        { merge: true }
      );
      console.log(
        `Misión semanal creada: ${mission.id} — ${mission.title}`
      );
    }

    console.log(
      `Seed completado: ${DAILY_MISSIONS.length + WEEKLY_MISSIONS.length} misiones creadas.`
    );
  } catch (error) {
    console.error("Error durante el seed de misiones:", error);
    throw error;
  }
}

// ─── Get Mission Definitions ─────────────────────────────────────

/**
 * Fetches all mission definitions from the `missions` collection.
 */
export async function getMissionDefinitions(): Promise<MissionDefinition[]> {
  try {
    const missionsRef = collection(db, "missions");
    const snapshot = await getDocs(missionsRef);

    if (snapshot.empty) {
      console.warn("La colección 'missions' está vacía");
      return [];
    }

    return snapshot.docs.map((doc) => doc.data() as MissionDefinition);
  } catch (error) {
    console.error("Error obteniendo definiciones de misiones:", error);
    throw error;
  }
}

// ─── Assign Missions (Deterministic, day/week seeded) ───────────

/**
 * Picks 5 random daily missions for the user based on the current date.
 * Stored in user doc under `missions.assignedDailyIds`.
 */
export async function assignDailyMissions(
  userId: string
): Promise<string[]> {
  try {
    const today = new Date();
    const todayStr = toDateStr(today);
    const seed = `${userId}_daily_${todayStr}`;

    const picked = deterministicPick(
      DAILY_MISSIONS.map((m) => m.id),
      5,
      seed
    );

    const userRef = doc(db, "users", userId);
    const userSnap = await getDoc(userRef);

    if (!userSnap.exists()) {
      console.warn("Usuario no encontrado para assignDailyMissions:", userId);
      return [];
    }

    const userData = userSnap.data();
    const existingProgress = userData.missions?.missionProgress ?? [];

    // Create initial progress entries for newly assigned missions
    const newProgress = picked.map((id: string) => {
      const alreadyExists = existingProgress.find(
        (m: any) => m.id === id
      );
      if (alreadyExists) return alreadyExists;

      const definition =
        DAILY_MISSIONS.find((m) => m.id === id) ?? WEEKLY_MISSIONS.find((m) => m.id === id);
      return {
        id,
        progress: 0,
        target: definition?.requirement.count ?? 1,
        completed: false,
        claimed: false,
        assignedDate: today.toISOString(),
      };
    });

    // Merge existing progress entries that aren't part of new assignment
    const keptProgress = existingProgress.filter(
      (m: any) => !picked.includes(m.id)
    );

    await updateDoc(userRef, {
      "missions.assignedDailyIds": picked,
      "missions.lastDailyRefresh": today.toISOString(),
      "missions.missionProgress": [...keptProgress, ...newProgress],
    });

    return picked;
  } catch (error) {
    console.error("Error asignando misiones diarias:", error);
    throw error;
  }
}

/**
 * Picks 2 random weekly missions for the user based on the current week number.
 * Stored in user doc under `missions.assignedWeeklyIds`.
 */
export async function assignWeeklyMissions(
  userId: string
): Promise<string[]> {
  try {
    const today = new Date();
    const week = getWeekNumber(today);
    const seed = `${userId}_weekly_${today.getFullYear()}_W${week}`;

    const picked = deterministicPick(
      WEEKLY_MISSIONS.map((m) => m.id),
      2,
      seed
    );

    const userRef = doc(db, "users", userId);
    const userSnap = await getDoc(userRef);

    if (!userSnap.exists()) {
      console.warn(
        "Usuario no encontrado para assignWeeklyMissions:",
        userId
      );
      return [];
    }

    const userData = userSnap.data();
    const existingProgress = userData.missions?.missionProgress ?? [];

    // Create initial progress entries for newly assigned missions
    const newProgress = picked.map((id: string) => {
      const alreadyExists = existingProgress.find(
        (m: any) => m.id === id
      );
      if (alreadyExists) return alreadyExists;

      const definition = WEEKLY_MISSIONS.find((m) => m.id === id);
      return {
        id,
        progress: 0,
        target: definition?.requirement.count ?? 1,
        completed: false,
        claimed: false,
        assignedDate: today.toISOString(),
      };
    });

    const keptProgress = existingProgress.filter(
      (m: any) => !picked.includes(m.id)
    );

    await updateDoc(userRef, {
      "missions.assignedWeeklyIds": picked,
      "missions.lastWeeklyRefresh": week,
      "missions.missionProgress": [...keptProgress, ...newProgress],
    });

    return picked;
  } catch (error) {
    console.error("Error asignando misiones semanales:", error);
    throw error;
  }
}

// ─── Refresh Checks ──────────────────────────────────────────────

/**
 * Returns true if daily missions need to be refreshed (new day).
 */
export function needsDailyRefresh(userDoc: any): boolean {
  const lastRefresh: string | null =
    userDoc.missions?.lastDailyRefresh ?? null;
  if (!lastRefresh) return true;

  const today = toDateStr(new Date());
  const last = toDateStr(new Date(lastRefresh));
  return today !== last;
}

/**
 * Returns true if weekly missions need to be refreshed (new week).
 */
export function needsWeeklyRefresh(userDoc: any): boolean {
  const lastWeek: number | null =
    userDoc.missions?.lastWeeklyRefresh ?? null;
  if (lastWeek === null || lastWeek === undefined) return true;

  const currentWeek = getWeekNumber(new Date());
  return currentWeek !== lastWeek;
}

// ─── Get User Missions ───────────────────────────────────────────

/**
 * Fetches the user's assigned missions with full definitions and progress.
 * Also returns whether daily/weekly refresh is needed.
 */
export async function getUserMissions(
  userId?: string
): Promise<{
  daily: AssignedMission[];
  weekly: AssignedMission[];
  needsRefresh: { daily: boolean; weekly: boolean };
}> {
  try {
    const resolvedUserId = userId ?? getCurrentUserId();
    if (!resolvedUserId) {
      return {
        daily: [],
        weekly: [],
        needsRefresh: { daily: false, weekly: false },
      };
    }

    const userRef = doc(db, "users", resolvedUserId);
    const userSnap = await getDoc(userRef);

    if (!userSnap.exists()) {
      console.warn("Usuario no encontrado:", userId);
      return {
        daily: [],
        weekly: [],
        needsRefresh: { daily: false, weekly: false },
      };
    }

    const userData = userSnap.data();
    const missions = userData.missions ?? {};
    const missionProgress: any[] = missions.missionProgress ?? [];
    const assignedDailyIds: string[] = missions.assignedDailyIds ?? [];
    const assignedWeeklyIds: string[] = missions.assignedWeeklyIds ?? [];

    // Fetch definitions from Firestore to get current data
    const definitions = await getMissionDefinitions();

    // Map daily missions
    const daily: AssignedMission[] = assignedDailyIds
      .map((id: string) => {
        const progress = missionProgress.find((m) => m.id === id);
        const def = definitions.find((d) => d.id === id);
        return {
          id,
          type: "daily" as MissionType,
          progress: progress?.progress ?? 0,
          target: def?.requirement.count ?? progress?.target ?? 1,
          completed: progress?.completed ?? false,
          claimed: progress?.claimed ?? false,
          claimedAt: progress?.claimedAt,
        };
      })
      .filter((m) => m.id); // remove any undefined entries

    // Map weekly missions
    const weekly: AssignedMission[] = assignedWeeklyIds
      .map((id: string) => {
        const progress = missionProgress.find((m) => m.id === id);
        const def = definitions.find((d) => d.id === id);
        return {
          id,
          type: "weekly" as MissionType,
          progress: progress?.progress ?? 0,
          target: def?.requirement.count ?? progress?.target ?? 1,
          completed: progress?.completed ?? false,
          claimed: progress?.claimed ?? false,
          claimedAt: progress?.claimedAt,
        };
      })
      .filter((m) => m.id);

    return {
      daily,
      weekly,
      needsRefresh: {
        daily: needsDailyRefresh(userData),
        weekly: needsWeeklyRefresh(userData),
      },
    };
  } catch (error) {
    console.error("Error obteniendo misiones del usuario:", error);
    return {
      daily: [],
      weekly: [],
      needsRefresh: { daily: false, weekly: false },
    };
  }
}

// ─── Update Mission Progress ─────────────────────────────────────

/**
 * Increments progress for a specific mission.
 * Marks completed if progress >= target.
 */
export async function updateMissionProgress(
  userId: string,
  missionId: string,
  increment = 1
): Promise<void> {
  try {
    const resolvedUserId = userId ?? getCurrentUserId();
    if (!resolvedUserId) return;

    const userRef = doc(db, "users", resolvedUserId);
    const userSnap = await getDoc(userRef);

    if (!userSnap.exists()) return;

    const userData = userSnap.data();
    const missionProgress: any[] = [
      ...(userData.missions?.missionProgress ?? []),
    ];

    const idx = missionProgress.findIndex((m: any) => m.id === missionId);
    if (idx === -1) {
      console.warn(
        `Misión ${missionId} no encontrada en el progreso del usuario`
      );
      return;
    }

    const mission = { ...missionProgress[idx] };
    mission.progress = (mission.progress ?? 0) + increment;

    if (mission.progress >= mission.target) {
      mission.completed = true;
    }

    missionProgress[idx] = mission;

    await updateDoc(userRef, {
      "missions.missionProgress": missionProgress,
    });
  } catch (error) {
    console.error("Error actualizando progreso de misión:", error);
    throw error;
  }
}

// ─── Claim Mission Reward ────────────────────────────────────────

/**
 * Claims the XP reward for a completed mission.
 * Returns the XP amount awarded, or 0 if already claimed / not completed.
 */
export async function claimMissionReward(
  userId: string,
  missionId: string
): Promise<number> {
  try {
    const resolvedUserId = userId ?? getCurrentUserId();
    if (!resolvedUserId) return 0;

    const userRef = doc(db, "users", resolvedUserId);
    const userSnap = await getDoc(userRef);

    if (!userSnap.exists()) return 0;

    const userData = userSnap.data();
    const missionProgress: any[] = [
      ...(userData.missions?.missionProgress ?? []),
    ];

    const idx = missionProgress.findIndex((m: any) => m.id === missionId);
    if (idx === -1) return 0;

    const mission = { ...missionProgress[idx] };

    if (mission.claimed) return 0;
    if (!mission.completed) return 0;

    mission.claimed = true;
    mission.claimedAt = new Date().toISOString();
    missionProgress[idx] = mission;

    // Look up XP reward from missions collection
    const missionDefRef = doc(db, "missions", missionId);
    const missionDefSnap = await getDoc(missionDefRef);
    const xpReward: number =
      (missionDefSnap.exists()
        ? (missionDefSnap.data().xpReward ?? 0)
        : 0);

    const currentXp: number = userData.stats?.xp ?? 0;

    await updateDoc(userRef, {
      "missions.missionProgress": missionProgress,
      "stats.xp": currentXp + xpReward,
    });

    return xpReward;
  } catch (error) {
    console.error("Error reclamando recompensa de misión:", error);
    throw error;
  }
}

// ─── Get Expired Missions (Grace Period) ─────────────────────────

/**
 * Returns missions from previous assignments that are completed but not claimed.
 * These are visible during the grace period (until midnight of the next day).
 */
export async function getExpiredMissions(
  userId?: string
): Promise<AssignedMission[]> {
  try {
    const resolvedUserId = userId ?? getCurrentUserId();
    if (!resolvedUserId) return [];

    const userRef = doc(db, "users", resolvedUserId);
    const userSnap = await getDoc(userRef);

    if (!userSnap.exists()) return [];

    const userData = userSnap.data();
    const missions = userData.missions ?? {};
    const missionProgress: any[] = missions.missionProgress ?? [];
    const assignedDailyIds: string[] = missions.assignedDailyIds ?? [];

    // Compute yesterday's date string for grace-period cutoff
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = toDateStr(yesterday);

    // Filter: completed, not claimed, NOT in today's assignments,
    // AND assignedDate matches yesterday (grace period per D-10/D-11)
    // Missions without assignedDate are excluded (cannot be claimed)
    const expired = missionProgress
      .filter(
        (m: any) =>
          m.completed &&
          !m.claimed &&
          !assignedDailyIds.includes(m.id) &&
          m.assignedDate &&
          toDateStr(new Date(m.assignedDate)) === yesterdayStr
      )
      .map((m: any) => ({
        id: m.id,
        type: "daily" as MissionType,
        progress: m.progress ?? 0,
        target: m.target ?? 1,
        completed: m.completed,
        claimed: m.claimed,
        claimedAt: m.claimedAt,
      }));

    return expired;
  } catch (error) {
    console.error("Error obteniendo misiones expiradas:", error);
    throw error;
  }
}
