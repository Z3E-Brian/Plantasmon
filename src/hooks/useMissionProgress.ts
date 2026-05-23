import { useCallback } from "react"
import { getCurrentUserId } from "@/src/services/userService"
import {
  getUserMissions,
  updateMissionProgress,
  getMissionDefinitions,
  type MissionDefinition,
} from "@/src/services/missionService"

export type ProgressEvent = "identify" | "water" | "scan" | "share" | "streak"

export function useMissionProgress() {
  const userId = getCurrentUserId()

  const reportProgress = useCallback(
    async (eventType: ProgressEvent) => {
      if (!userId) return
      try {
        const { daily, weekly } = await getUserMissions(userId)
        const allMissions = [...daily, ...weekly]

        const defs = await getMissionDefinitions()

        const eventMatch: Record<ProgressEvent, string[]> = {
          identify: ["identifications", "scans"],
          water: ["waterings"],
          scan: ["scans", "identifications"],
          share: ["shares"],
          streak: ["streak_maintain"],
        }

        const updatePromises = allMissions.map(async (mission) => {
          const def: MissionDefinition | undefined = defs.find(
            (d) => d.id === mission.id
          )
          if (!def) return
          if (mission.completed || mission.claimed) return

          const requirementType = def.requirement.type
          const matchingTypes = eventMatch[eventType] ?? []
          if (!matchingTypes.includes(requirementType)) return

          await updateMissionProgress(userId, mission.id)
        })

        await Promise.all(updatePromises)
      } catch (error) {
        console.error("Error reporting mission progress:", error)
      }
    },
    [userId]
  )

  return { reportProgress }
}
