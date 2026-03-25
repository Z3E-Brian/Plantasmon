import { UserAchievement } from "@/src/services/userAchievementsService"
import { useThemedStyles } from "@/src/styles/themedStyles"
import * as Haptics from "expo-haptics"
import { Pressable, Text, View } from "react-native"

const EARNED_COLORS = ["#40916C", "#74C69D", "#52B788", "#95D5B2"]

interface AchievementsProps {
  achievements: UserAchievement[]
}

export function Achievements({ achievements }: AchievementsProps) {
  const { theme, styles } = useThemedStyles("achievements")
  const earned = achievements.filter((a) => a.earned).length

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>{earned}/{achievements.length} earned</Text>
      </View>

      <View style={styles.grid}>
        {achievements.map((achievement, index) => (
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
          { backgroundColor: achievement.earned ? color + "20" : theme.colors.surfaceMuted },
        ]}
      >
        <BadgeIcon emoji={achievement.emoji} earned={achievement.earned} />
      </View>
      <Text
        style={[
          styles.badgeName,
          { color: achievement.earned ? theme.colors.textPrimary : theme.colors.textTertiary },
        ]}
        numberOfLines={2}
      >
        {achievement.name}
      </Text>
    </Pressable>
  )
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
}

function BadgeIcon({ emoji, earned }: { emoji: string; earned: boolean }) {
  return (
    <Text style={{ fontSize: 16, opacity: earned ? 1 : 0.3 }}>
      {EMOJI_MAP[emoji] ?? "🏅"}
    </Text>
  )
}
