import { Text, View } from "react-native"
import { Badge } from "@/src/components/ui/badge"
import { Progress } from "@/src/components/ui/progress"
import { useThemedStyles } from "@/src/styles/themedStyles"
import { getLevelProgress } from "@/src/constants/data"

export function UserProgress({ xp }: { xp: number }) {
  const { styles, theme } = useThemedStyles("userProgress")
  const { currentLevel, xpForNextLevel, progressPercentage } = getLevelProgress(xp)

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
