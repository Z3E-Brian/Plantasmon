import { Text, View } from "react-native"
import { useThemedStyles } from "@/src/styles/themedStyles"
import { RECENT_ACHIEVEMENT } from "@/src/constants/data"

export function RecentAchievement() {
  const { styles } = useThemedStyles("recentAchievement")

  if (!RECENT_ACHIEVEMENT) return null

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.badge}>{RECENT_ACHIEVEMENT.icon}</Text>
        <View style={styles.info}>
          <Text style={styles.label}>¡Logro desbloqueado!</Text>
          <Text style={styles.name}>{RECENT_ACHIEVEMENT.name}</Text>
        </View>
      </View>
    </View>
  )
}
