import { Pressable, Text, View, StyleSheet } from "react-native"
import { Badge } from "@/src/components/ui/badge"
import { useThemedStyles } from "@/src/styles/themedStyles"
import { COLORS } from "@/src/constants/theme"

export interface MissionDisplay {
  id: string
  title: string
  icon: string
  xpReward: number
  progress: number
  target: number
  completed: boolean
  claimed: boolean
  claimedAt?: string
  expired?: boolean
}

export function DailyMissions({
  missions,
  expiredMissions,
  onClaim,
}: {
  missions: MissionDisplay[]
  expiredMissions: MissionDisplay[]
  onClaim: (missionId: string) => Promise<void>
}) {
  const { styles, theme } = useThemedStyles("dailyMissions")

  const renderMission = (mission: MissionDisplay, isExpired = false) => {
    const pct = mission.target > 0 ? (mission.progress / mission.target) * 100 : 0

    return (
      <View key={mission.id} style={ls.missionCard}>
        {/* Top row: icon, title, badge */}
        <View style={ls.topRow}>
          <Text style={styles.missionIcon}>{mission.icon}</Text>
          <Text
            style={[
              styles.missionText,
              mission.completed && styles.missionComplete,
            ]}
            numberOfLines={1}
          >
            {mission.title}
          </Text>
          <Badge variant={mission.completed ? "default" : "outline"}>
            +{mission.xpReward} XP
          </Badge>
        </View>

        {/* Progress bar */}
        <View style={ls.progressRow}>
          <View style={ls.progressContainer}>
            <View
              style={[
                ls.progressFill,
                {
                  width: `${Math.min(pct, 100)}%`,
                  backgroundColor:
                    mission.completed || isExpired
                      ? theme.colors.primary
                      : theme.colors.textTertiary,
                },
              ]}
            />
          </View>
          <Text style={ls.progressText}>
            {mission.progress}/{mission.target}
          </Text>
        </View>

        {/* Claim / claimed / expired actions */}
        {isExpired && !mission.completed && (
          <Text style={[ls.expiredLabel, { color: COLORS.destructive }]}>
            Expirada
          </Text>
        )}
        {mission.completed && !mission.claimed && (
          <Pressable
            style={[ls.claimButton, { backgroundColor: theme.colors.primary }]}
            onPress={() => onClaim(mission.id)}
          >
            <Text style={[ls.claimText, { color: theme.colors.primaryForeground }]}>
              {isExpired ? "Reclamar" : "¡Reclamar!"}
            </Text>
          </Pressable>
        )}
        {mission.claimed && (
          <Text style={[ls.claimedText, { color: theme.colors.textTertiary }]}>
            ✓ Reclamado
          </Text>
        )}
      </View>
    )
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>🎯 Misiones diarias</Text>

      <View style={styles.missionsList}>
        {missions.map((m) => renderMission(m))}
      </View>

      {expiredMissions.length > 0 && (
        <View style={ls.expiredSection}>
          <Text style={ls.expiredHeader}>⏰ Misiones del día anterior</Text>
          <View style={{ opacity: 0.6 }}>
            {expiredMissions.map((m) => renderMission(m, true))}
          </View>
        </View>
      )}
    </View>
  )
}

const ls = StyleSheet.create({
  missionCard: {
    paddingVertical: 8,
  },
  topRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  progressRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginTop: 6,
    marginLeft: 32, // align with text after icon (icon width ~24 + gap 8)
  },
  progressContainer: {
    flex: 1,
    height: 6,
    backgroundColor: "rgba(128,128,128,0.2)",
    borderRadius: 3,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    borderRadius: 3,
  },
  progressText: {
    fontSize: 11,
    fontWeight: "600",
    color: "#888",
    minWidth: 30,
    textAlign: "right",
  },
  claimButton: {
    alignSelf: "flex-start",
    marginTop: 6,
    marginLeft: 32,
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 6,
  },
  claimText: {
    fontSize: 13,
    fontWeight: "700",
  },
  claimedText: {
    fontSize: 12,
    fontWeight: "600",
    marginTop: 6,
    marginLeft: 32,
  },
  expiredSection: {
    marginTop: 16,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: "rgba(128,128,128,0.2)",
  },
  expiredHeader: {
    fontSize: 14,
    fontWeight: "600",
    color: "#888",
    marginBottom: 8,
  },
  expiredLabel: {
    fontSize: 11,
    fontWeight: "700",
    marginTop: 6,
    marginLeft: 32,
    textTransform: "uppercase",
  },
})
