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

// ─── Hook ────────────────────────────────────────────────────────

/**
 * useMissionProgress
 *
 * Returns a `reportProgress` function that checks the user's currently
 * assigned daily/weekly missions and increments progress for any whose
 * requirement type matches the given event.
 *
 * Designed to be called after relevant user actions (identify, water,
 * scan, share) to fulfill D-08 event-based completion detection.
 */
export function useMissionProgress() {
  const userId = getCurrentUserId();

  const reportProgress = useCallback(
    async (eventType: ProgressEvent) => {
      if (!userId) return;
      try {
        // 1. Get user's current mission assignments + progress
        const { daily, weekly } = await getUserMissions(userId);
        const allMissions = [...daily, ...weekly];

        // 2. Get mission definitions to check requirement types
        const defs = await getMissionDefinitions();

        // 3. For each assigned mission, check if this event affects it
        const updatePromises = allMissions.map(async (mission) => {
          const def = defs.find((d: MissionDefinition) => d.id === mission.id);
          if (!def) return;
          if (mission.completed || mission.claimed) return;

          // Map event type to mission requirement type
          const matchingTypes = EVENT_MISSION_MAP[eventType] ?? [];
          if (!matchingTypes.includes(def.requirement.type)) return;

          // 4. Increment progress for matching missions
          await updateMissionProgress(userId, mission.id);
        });

        await Promise.all(updatePromises);
      } catch (error) {
        console.error("Error reporting mission progress:", error);
      }
    },
    [userId]
  );

  return { reportProgress };
}
