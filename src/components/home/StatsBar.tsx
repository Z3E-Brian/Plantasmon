import { Text, View } from "react-native"
import { useFocusEffect } from "expo-router"
import { useCallback, useState } from "react"
import { useThemedStyles } from "@/src/styles/themedStyles"
import {
  getAccountAge,
  getUserProfile,
  CURRENT_USER_ID,
} from "@/src/services/userService"
import {
  getPhotosTodayCount,
  getLastIdentification,
} from "@/src/services/userPlantsService"

interface StatEntry {
  icon: string
  value: string | number
  label: string
}

function formatRelativeDate(date: Date): string {
  const now = new Date()
  const todayStr = [
    now.getFullYear(),
    String(now.getMonth() + 1).padStart(2, "0"),
    String(now.getDate()).padStart(2, "0"),
  ].join("-")

  const dateStr = [
    date.getFullYear(),
    String(date.getMonth() + 1).padStart(2, "0"),
    String(date.getDate()).padStart(2, "0"),
  ].join("-")

  if (dateStr === todayStr) return "Hoy"

  const yesterday = new Date(now)
  yesterday.setDate(yesterday.getDate() - 1)
  const yesterdayStr = [
    yesterday.getFullYear(),
    String(yesterday.getMonth() + 1).padStart(2, "0"),
    String(yesterday.getDate()).padStart(2, "0"),
  ].join("-")

  if (dateStr === yesterdayStr) return "Ayer"

  const diffMs = now.getTime() - date.getTime()
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))
  return `Hace ${diffDays} días`
}

export function StatsBar() {
  const { styles } = useThemedStyles("statsBar")
  const [stats, setStats] = useState<StatEntry[]>([])
  const [loading, setLoading] = useState(true)

  useFocusEffect(
    useCallback(() => {
      let cancelled = false

      async function fetchStats() {
        setLoading(true)

        let accountAge: number | null = null
        let photosToday: number | null = null
        let streakDays: number | null = null
        let lastIdentification: { plantName: string; date: Date } | null = null

        // Fetch profile (account age + streak) — single call
        try {
          const profile = await getUserProfile(CURRENT_USER_ID)
          if (profile && !cancelled) {
            accountAge = getAccountAge(profile.joinDate)
            streakDays = profile.streak
          }
        } catch {
          // Individual error per stat — shows "—"
        }

        // Photos today
        try {
          photosToday = await getPhotosTodayCount(CURRENT_USER_ID)
        } catch {
          // fallback
        }

        // Last identification
        try {
          lastIdentification = await getLastIdentification(CURRENT_USER_ID)
        } catch {
          // fallback
        }

        if (!cancelled) {
          setStats([
            { icon: "📅", value: accountAge ?? "—", label: "Días activo" },
            { icon: "📸", value: photosToday ?? "—", label: "Fotos hoy" },
            { icon: "🔥", value: streakDays ?? "—", label: "Racha de riego" },
            {
              icon: "🌱",
              value: lastIdentification
                ? formatRelativeDate(lastIdentification.date)
                : "—",
              label: "Última identificación",
            },
          ])
          setLoading(false)
        }
      }

      fetchStats()

      return () => {
        cancelled = true
      }
    }, [])
  )

  if (loading) {
    return (
      <View style={styles.container}>
        {[0, 1, 2, 3].map((i) => (
          <View key={i} style={styles.skeleton} />
        ))}
      </View>
    )
  }

  return (
    <View style={styles.container}>
      {stats.map((stat, index) => (
        <View key={index} style={styles.statItem}>
          <Text style={styles.statIcon}>{stat.icon}</Text>
          <Text style={styles.statValue}>{stat.value}</Text>
          <Text style={styles.statLabel}>{stat.label}</Text>
        </View>
      ))}
    </View>
  )
}
