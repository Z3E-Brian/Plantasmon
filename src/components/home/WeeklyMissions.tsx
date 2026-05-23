import { Pressable, Text, View, StyleSheet } from "react-native"
import { Badge } from "@/src/components/ui/badge"
import { useThemedStyles } from "@/src/styles/themedStyles"
import type { MissionDisplay } from "@/src/components/home/DailyMissions"

export function WeeklyMissions({
  missions,
  onClaim,
}: {
  missions: MissionDisplay[]
  onClaim: (missionId: string) => Promise<void>
}) {
  const { styles, theme } = useThemedStyles("weeklyMissions")

  return (
    <View style={styles.container}>
      <Text style={styles.title}>🏆 Misiones semanales</Text>

      <View style={styles.missionsList}>
        {missions.map((mission) => {
          const pct =
            mission.target > 0
              ? (mission.progress / mission.target) * 100
              : 0

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
                        backgroundColor: mission.completed
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

              {/* Claim / claimed state */}
              {mission.completed && !mission.claimed && (
                <Pressable
                  style={[
                    ls.claimButton,
                    { backgroundColor: theme.colors.primary },
                  ]}
                  onPress={() => onClaim(mission.id)}
                >
                  <Text
                    style={[
                      ls.claimText,
                      { color: theme.colors.primaryForeground },
                    ]}
                  >
                    ¡Reclamar!
                  </Text>
                </Pressable>
              )}
              {mission.claimed && (
                <Text
                  style={[
                    ls.claimedText,
                    { color: theme.colors.textTertiary },
                  ]}
                >
                  ✓ Reclamado
                </Text>
              )}
            </View>
          )
        })}
      </View>
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
    marginLeft: 32,
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
})
