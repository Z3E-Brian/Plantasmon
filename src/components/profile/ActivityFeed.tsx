import { ACTIVITIES, Activity } from "@/src/constants/data"
import { useThemedStyles } from "@/src/styles/themedStyles"
import { Text, View } from "react-native"

export function ActivityFeed() {
  const { theme, styles } = useThemedStyles("activityFeed")
  
  return (
    <View style={styles.container}>
      {/* Timeline line */}
      <View style={styles.timelineLine} />

      {ACTIVITIES.map((activity) => (
        <ActivityItem key={activity.id} activity={activity} />
      ))}
    </View>
  )
}

function ActivityItem({ activity }: { activity: Activity }) {
  const { styles } = useThemedStyles("activityFeed")
  
  return (
    <View style={styles.item}>
      {/* Timeline dot */}
      <View style={styles.dotContainer}>
        <ActivityIcon type={activity.iconType} />
      </View>

      {/* Content */}
      <View style={styles.content}>
        <Text style={styles.title}>{activity.title}</Text>
        <Text style={styles.description}>{activity.description}</Text>
        <Text style={styles.time}>{activity.time}</Text>
      </View>
    </View>
  )
}

const ACTIVITY_EMOJI: Record<string, string> = {
  camera: "📷",
  water: "💧",
  leaf: "🌿",
  award: "🏅",
  sparkles: "✨",
}

function ActivityIcon({ type }: { type: string; color?: string }) {
  const { styles } = useThemedStyles("activityFeed")
  
  return (
    <View style={styles.iconContainer}>
      <Text style={{ fontSize: 16 }}>{ACTIVITY_EMOJI[type] ?? "🌿"}</Text>
    </View>
  )
}
