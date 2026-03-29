import { Text, View } from "react-native"
import { useThemedStyles } from "@/src/styles/themedStyles"

interface ProfileAboutProps {
  bio: string
  location: string
  streak: number
  careScore: number
  rarestFind: string
  achievements: number
  totalAchievements: number
}

export function ProfileAbout({
  bio,
  location,
  streak,
  careScore,
  rarestFind,
  achievements,
  totalAchievements,
}: ProfileAboutProps) {
  const { styles } = useThemedStyles("profileAbout")

  return (
    <View style={styles.container}>
      {/* Section header */}
      <View style={styles.header}>
        <Text style={styles.title}>ABOUT ME</Text>
      </View>

      <Text style={styles.bio}>{bio}</Text>

      {/* Location chip */}
      <View style={styles.chips}>
        <View style={styles.chip}>
          <Text style={styles.chipEmoji}>📍</Text>
          <Text style={styles.chipText}>{location}</Text>
        </View>
      </View>

      <View style={styles.divider} />

      {/* Quick stats grid */}
      <View style={styles.statsGrid}>
        <QuickStat icon="streak" title="ID Streak"   value={`${streak} days`}                       subtitle="Keep it going!"      />
        <QuickStat icon="care"   title="Care Score"  value={`${careScore}%`}                        subtitle="Excellent caretaker" />
        <QuickStat icon="rare"   title="Rarest Find" value={rarestFind}                             subtitle="Ultra rare species"  />
        <QuickStat icon="badges" title="Badges"      value={`${achievements}/${totalAchievements}`} subtitle="Keep collecting!"    />
      </View>
    </View>
  )
}

function QuickStat({ icon, title, value, subtitle }: {
  icon: string
  title: string
  value: string
  subtitle: string
}) {
  const { styles } = useThemedStyles("profileAbout")
  return (
    <View style={styles.statCard}>
      <View style={styles.statIconContainer}>
        <Text style={styles.statEmoji}>
          {icon === "streak" ? "🌿" : icon === "care" ? "💧" : icon === "rare" ? "☀️" : "🏅"}
        </Text>
      </View>
      <View style={styles.statInfo}>
        <Text style={styles.statTitle}>{title}</Text>
        <Text style={styles.statValue}>{value}</Text>
        <Text style={styles.statSubtitle}>{subtitle}</Text>
      </View>
    </View>
  )
}
