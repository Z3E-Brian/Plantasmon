import { USER } from "@/src/constants/data"
import { useThemedStyles } from "@/src/styles/themedStyles"
import { Pressable, Text, View } from "react-native"

export function ProfileAbout() {
  const { theme, styles } = useThemedStyles("profileAbout")
  
  return (
    <View style={styles.container}>
      {/* Section header */}
      <View style={styles.header}>
        <Text style={styles.title}>ABOUT ME</Text>
        <Pressable style={styles.editButton}>
          <Text style={{ fontSize: 12, color: theme.colors.primary }}>✏️</Text>
          <Text style={styles.editText}>Edit</Text>
        </Pressable>
      </View>

      <Text style={styles.bio}>{USER.bio}</Text>

      {/* Location & date chips */}
      <View style={styles.chips}>
        <View style={styles.chip}>
          <Text style={styles.chipEmoji}>📍</Text>
          <Text style={styles.chipText}>{USER.location}</Text>
        </View>
        <View style={styles.chip}>
          <Text style={styles.chipEmoji}>⭐</Text>
          <Text style={styles.chipText}>
            Joined {USER.joinDate.toLocaleDateString("en-US", { month: "short", year: "numeric" })}
          </Text>
        </View>
      </View>

      {/* Divider */}
      <View style={styles.divider} />

      {/* Quick stats grid */}
      <View style={styles.statsGrid}>
        <QuickStat
          icon="streak"
          title="ID Streak"
          value={`${USER.streak} days`}
          subtitle="Keep it going!"
        />
        <QuickStat
          icon="care"
          title="Care Score"
          value={`${USER.careScore}%`}
          subtitle="Excellent caretaker"
        />
        <QuickStat
          icon="rare"
          title="Rarest Find"
          value={USER.rarestFind}
          subtitle="Ultra rare species"
        />
        <QuickStat
          icon="badges"
          title="Badges"
          value={`${USER.achievements}/${USER.totalAchievements}`}
          subtitle="4 more to collect"
        />
      </View>
    </View>
  )
}

function QuickStat({
  icon,
  title,
  value,
  subtitle,
}: {
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
