import { UserAchievement } from "@/src/services/userAchievementsService"
import { useThemedStyles } from "@/src/styles/themedStyles"
import * as Haptics from "expo-haptics"
import { Pressable, Text, View } from "react-native"

const EARNED_COLORS = ["#40916C", "#74C69D", "#52B788", "#95D5B2"]

const CATEGORY_ORDER: string[] = ["collection", "streak", "usage", "special"]
const CATEGORY_LABELS: Record<string, string> = {
  collection: "Colección",
  streak: "Racha y Cuidado",
  usage: "Uso",
  special: "Especiales",
}

const EMOJI_MAP: Record<string, string> = {
  sprout: "🌱",
  thumb: "👍",
  magnify: "🔍",
  globe: "🌍",
  water: "💧",
  star: "⭐",
  crown: "👑",
  tree: "🌳",
  fire: "🔥",
  calendar: "📅",
  camera: "📸",
  trophy: "🏆",
  paint: "🎨",
  book: "📖",
}

interface AchievementsProps {
  achievements: UserAchievement[]
}

export function Achievements({ achievements }: AchievementsProps) {
  const { theme, styles } = useThemedStyles("achievements")
  const earned = achievements.filter((a) => a.earned).length
  const total = achievements.length

  // Group achievements by category following defined order
  const grouped = CATEGORY_ORDER.map((cat) => ({
    category: cat,
    label: CATEGORY_LABELS[cat],
    items: achievements.filter((a) => a.category === cat),
  })).filter((g) => g.items.length > 0)

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>
          {earned}/{total} desbloqueados
        </Text>
      </View>

      {grouped.map((group) => (
        <View key={group.category} style={{ marginBottom: 12 }}>
          {/* Category divider */}
          <View style={styles.categoryDivider}>
            <View style={styles.categoryDividerLine} />
            <Text style={styles.categoryDividerText}>{group.label}</Text>
            <View style={styles.categoryDividerLine} />
          </View>

          {/* Achievement grid */}
          <View style={styles.grid}>
            {group.items.map((achievement, index) => (
              <AchievementBadge
                key={achievement.id}
                achievement={achievement}
                color={EARNED_COLORS[index % EARNED_COLORS.length]}
                theme={theme}
                styles={styles}
              />
            ))}
          </View>
        </View>
      ))}
    </View>
  )
}

function AchievementBadge({
  achievement,
  color,
  theme,
  styles,
}: {
  achievement: UserAchievement
  color: string
  theme: any
  styles: any
}) {
  const handlePress = () => {
    if (achievement.earned) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
    }
  }

  const showProgress =
    !achievement.earned &&
    achievement.progress != null &&
    achievement.target != null &&
    achievement.target > 0

  const progressPercent = showProgress
    ? Math.min((achievement.progress! / achievement.target!) * 100, 100)
    : 0

  return (
    <Pressable
      onPress={handlePress}
      style={[
        styles.badge,
        achievement.earned ? styles.badgeEarned : styles.badgeLocked,
      ]}
    >
      <View
        style={[
          styles.badgeIcon,
          {
            backgroundColor: achievement.earned
              ? color + "20"
              : theme.colors.surfaceMuted,
          },
        ]}
      >
        <BadgeIcon emoji={achievement.emoji} earned={achievement.earned} />
      </View>
      <Text
        style={[
          styles.badgeName,
          {
            color: achievement.earned
              ? theme.colors.textPrimary
              : theme.colors.textTertiary,
          },
        ]}
        numberOfLines={2}
      >
        {achievement.name}
      </Text>

      {/* Earned check badge */}
      {achievement.earned && (
        <View style={styles.earnedBadge}>
          <Text style={styles.earnedBadgeText}>✓</Text>
        </View>
      )}

      {/* Progress bar for in-progress achievements */}
      {showProgress && (
        <View style={styles.progressBarContainer}>
          <View
            style={[styles.progressBarFill, { width: `${progressPercent}%` }]}
          />
        </View>
      )}
    </Pressable>
  )
}

function BadgeIcon({ emoji, earned }: { emoji: string; earned: boolean }) {
  return (
    <Text style={{ fontSize: 16, opacity: earned ? 1 : 0.3 }}>
      {earned ? (EMOJI_MAP[emoji] ?? "🏅") : "❓"}
    </Text>
  )
}
