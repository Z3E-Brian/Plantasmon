import { useThemedStyles } from "@/src/styles/themedStyles"
import { Text, View } from "react-native"

export interface ActivityData {
  id: number
  type: "identified" | "watered" | "added" | "achievement" | "milestone"
  title: string
  description: string
  time: string
  iconType: "camera" | "water" | "leaf" | "award" | "sparkles"
}

export function ActivityFeed({ activities }: { activities: ActivityData[] }) {
  const { theme, styles } = useThemedStyles("activityFeed")
  
  return (
    <View style={styles.container}>
      <View style={styles.timelineLine} />

      {activities.map((activity) => (
        <ActivityItem key={activity.id} activity={activity} />
      ))}
    </View>
  )
}

function ActivityItem({ activity }: { activity: ActivityData }) {
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
