import { Pressable, Text, View } from "react-native"
import { Image } from "expo-image"
import * as Haptics from "expo-haptics"
import { Button } from "@/src/components/ui/button"
import { useThemedStyles } from "@/src/styles/themedStyles"
import { PLANT_OF_THE_DAY } from "@/src/constants/data"

interface PlantOfTheDayProps {
  onLearnMore?: () => void
}

export function PlantOfTheDay({ onLearnMore }: PlantOfTheDayProps) {
  const { styles } = useThemedStyles("plantOfTheDay")

  const handleLearnMore = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
    onLearnMore?.()
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerBadge}>🌟 PLANTA DEL DÍA</Text>
      </View>

      <Image 
        source={{ uri: PLANT_OF_THE_DAY.image }}
        style={styles.image}
        contentFit="cover"
      />

      <View style={styles.content}>
        <Text style={styles.name}>{PLANT_OF_THE_DAY.name}</Text>
        <Text style={styles.scientificName}>{PLANT_OF_THE_DAY.scientificName}</Text>

        <View style={styles.factBox}>
          <Text style={styles.factTitle}>💡 ¿Sabías que?</Text>
          <Text style={styles.factText}>{PLANT_OF_THE_DAY.fact}</Text>
        </View>

        <Button variant="outline" onPress={handleLearnMore}>
          <Text>🔍 Aprende más</Text>
        </Button>
      </View>
    </View>
  )
}
