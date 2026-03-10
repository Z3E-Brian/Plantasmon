import { Text, View } from "react-native"
import { Badge } from "@/src/components/ui/badge"
import { useThemedStyles } from "@/src/styles/themedStyles"
import { DAILY_MISSIONS } from "@/src/constants/data"

export function DailyMissions() {
  const { styles } = useThemedStyles("dailyMissions")

  return (
    <View style={styles.container}>
      <Text style={styles.title}>🎯 Misiones diarias</Text>

      <View style={styles.missionsList}>
        {DAILY_MISSIONS.map((mission) => (
          <View key={mission.id} style={styles.missionItem}>
            <Text style={styles.missionIcon}>{mission.completed ? "✓" : "○"}</Text>
            <Text style={[styles.missionText, mission.completed && styles.missionComplete]}>
              {mission.title}
            </Text>
            <Badge variant={mission.completed ? "default" : "outline"}>
              +{mission.xpReward} XP
            </Badge>
          </View>
        ))}
      </View>
    </View>
  )
}
