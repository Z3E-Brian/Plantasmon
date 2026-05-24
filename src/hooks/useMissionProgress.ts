import { useCallback } from "react";
import { getCurrentUserId } from "@/src/services/userService";
import {
  getUserMissions,
  updateMissionProgress,
  getMissionDefinitions,
  type MissionDefinition,
} from "@/src/services/missionService";

// ─── Types ──────────────────────────────────────────────────────

export type ProgressEvent = "identify" | "water" | "scan" | "share" | "streak";

// ─── Event-to-requirement mapping ───────────────────────────────

const EVENT_MISSION_MAP: Record<ProgressEvent, string[]> = {
  identify: ["identifications", "scans"],
  water: ["waterings"],
  scan: ["scans", "identifications"],
  share: ["shares"],
  streak: ["streak_maintain"],
};

// ─── Standalone Helper (callable from services) ─────────────────

/**
 * Standalone mission progress reporter.
 *
 * Checks the user's currently assigned daily/weekly missions and
 * increments progress for any whose requirement type matches the
 * given event.
 *
 * Designed to be called from non-React service code (e.g. after
 * identify, water actions) to fulfill D-08 event-based completion.
 *
 * Errors are logged but never thrown — fire-and-forget pattern.
 */
export async function reportMissionProgress(
  eventType: ProgressEvent,
  userId?: string
): Promise<void> {
  const resolvedUserId = userId ?? getCurrentUserId();
  if (!resolvedUserId) return;

  try {
    const { daily, weekly } = await getUserMissions(resolvedUserId);
    const allMissions = [...daily, ...weekly];

    const defs = await getMissionDefinitions();

    const updatePromises = allMissions.map(async (mission) => {
      const def = defs.find((d: MissionDefinition) => d.id === mission.id);
      if (!def) return;
      if (mission.completed || mission.claimed) return;

      const matchingTypes = EVENT_MISSION_MAP[eventType] ?? [];
      if (!matchingTypes.includes(def.requirement.type)) return;

      await updateMissionProgress(resolvedUserId, mission.id);
    });

    await Promise.all(updatePromises);
  } catch (error) {
    console.error("Error reporting mission progress:", error);
  }
}

// ─── Hook ────────────────────────────────────────────────────────

/**
 * React hook that returns a `reportProgress` function for use in
 * components. Internally delegates to the standalone
 * `reportMissionProgress` helper.
 */
export function useMissionProgress() {
  const userId = getCurrentUserId();

  const reportProgress = useCallback(
    async (eventType: ProgressEvent) => {
      await reportMissionProgress(eventType, userId ?? undefined);
    },
    [userId]
  );

  return { reportProgress };
}
