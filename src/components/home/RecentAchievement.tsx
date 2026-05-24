import { Text, View } from "react-native"
import { useThemedStyles } from "@/src/styles/themedStyles"

export interface RecentAchievementData {
  id: number
  name: string
  description: string
  icon: string
  unlockedAt: string
}

export function RecentAchievement({ achievement }: { achievement: RecentAchievementData | null }) {
  const { styles } = useThemedStyles("recentAchievement")

  if (!achievement) return null

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.badge}>{achievement.icon}</Text>
        <View style={styles.info}>
          <Text style={styles.label}>¡Logro desbloqueado!</Text>
          <Text style={styles.name}>{achievement.name}</Text>
        </View>
      </View>
    </View>
  )
}
