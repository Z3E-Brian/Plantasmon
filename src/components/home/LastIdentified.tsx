import { Pressable, Text, View } from "react-native"
import { Image } from "expo-image"
import * as Haptics from "expo-haptics"
import { Badge } from "@/src/components/ui/badge"
import { useThemedStyles } from "@/src/styles/themedStyles"
import { getLastIdentifiedPlant } from "@/src/constants/data"

interface LastIdentifiedProps {
  onPress?: (plantId: number) => void
}

export function LastIdentified({ onPress }: LastIdentifiedProps) {
  const { styles } = useThemedStyles("lastIdentified")
  const plant = getLastIdentifiedPlant()

  if (!plant) return null

  const handlePress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
    onPress?.(plant.id)
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>📸 Tu última identificación</Text>
      </View>

      <Pressable style={styles.content} onPress={handlePress}>
        <Image 
          source={{ uri: plant.image }}
          style={styles.image}
          contentFit="cover"
        />
        <View style={styles.info}>
          <Badge variant="default" style={{ alignSelf: "flex-start", marginBottom: 4 }}>
            Nueva!
          </Badge>
          <Text style={styles.name}>{plant.name}</Text>
          <Text style={styles.time}>Identificada hace 2h</Text>
        </View>
        <Text style={styles.chevron}>→</Text>
      </Pressable>
    </View>
  )
}
