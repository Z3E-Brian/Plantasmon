import { useEffect, useState } from "react"
import { ActivityIndicator, StyleSheet, Text, View } from "react-native"

import { ActivityFeed, type ActivityData } from "@/src/components/profile/ActivityFeed"
import { getRecentActivities, toActivityData } from "@/src/services/activityService"
import { getCurrentUserId } from "@/src/services/userService"
import { useThemedStyles } from "@/src/styles/themedStyles"

export function HomeTimeline() {
  const { theme } = useThemedStyles("homeTimeline")
  const [activities, setActivities] = useState<ActivityData[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const uid = getCurrentUserId()
    if (!uid) {
      setLoading(false)
      return
    }

    getRecentActivities(uid, 7)
      .then((events) => {
        const mapped = events.map((event) => toActivityData(event)).slice(0, 5)
        setActivities(mapped)
      })
      .catch((err) => console.error("Error loading timeline:", err))
      .finally(() => setLoading(false))
  }, [])

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator color={theme.colors.textSecondary} />
      </View>
    )
  }

  if (activities.length === 0) return null

  return (
    <View style={styles.container}>
      <Text style={[styles.title, { color: theme.colors.textPrimary }]}>🕐 Actividad reciente</Text>
      <ActivityFeed activities={activities} />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    marginTop: 8,
    marginBottom: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 8,
  },
  loadingContainer: {
    height: 60,
    justifyContent: "center",
    alignItems: "center",
  },
})
