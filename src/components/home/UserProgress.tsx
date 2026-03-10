import { Text, View } from "react-native"
import { Badge } from "@/src/components/ui/badge"
import { Progress } from "@/src/components/ui/progress"
import { useThemedStyles } from "@/src/styles/themedStyles"
import { USER, getLevelProgress } from "@/src/constants/data"

export function UserProgress() {
  const { styles, theme } = useThemedStyles("userProgress")
  const { currentLevel, xpForNextLevel, progressPercentage } = getLevelProgress(USER.xp)

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>📊 Tu progreso</Text>
        <Badge variant="default">Nivel {currentLevel}</Badge>
      </View>

      <Progress value={progressPercentage} />

      <Text style={styles.progressText}>
        {xpForNextLevel.toLocaleString()} XP para nivel {currentLevel + 1}
      </Text>
    </View>
  )
}
