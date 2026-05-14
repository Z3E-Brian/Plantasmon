import { Pressable, Text, View } from "react-native"
import { Image } from "expo-image"
import { useFocusEffect, useRouter } from "expo-router"
import * as Haptics from "expo-haptics"
import { useCallback, useState } from "react"
import { Badge } from "@/src/components/ui/badge"
import { useThemedStyles } from "@/src/styles/themedStyles"
import { getLastIdentification } from "@/src/services/userPlantsService"

interface LastIdentifiedProps {
  onPress?: (plantId: string) => void
}

function formatRelativeDate(date: Date): string {
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffMin = Math.floor(diffMs / (1000 * 60))
  if (diffMin < 1) return "Ahora"
  if (diffMin < 60) return `Hace ${diffMin} min`
  const diffHr = Math.floor(diffMin / 60)
  if (diffHr < 24) return `Hace ${diffHr}h`
  const diffDays = Math.floor(diffHr / 24)
  if (diffDays === 1) return "Ayer"
  return `Hace ${diffDays} días`
}

export function LastIdentified({ onPress }: LastIdentifiedProps) {
  const { styles } = useThemedStyles("lastIdentified")
  const router = useRouter()
  const [plant, setPlant] = useState<{
    plantId: string
    plantName: string
    image: string
    date: Date
  } | null>(null)
  const [loading, setLoading] = useState(true)

  useFocusEffect(
    useCallback(() => {
      let cancelled = false
      async function fetch() {
        setLoading(true)
        try {
          const result = await getLastIdentification()
          if (!cancelled) setPlant(result)
        } catch {
          if (!cancelled) setPlant(null)
        } finally {
          if (!cancelled) setLoading(false)
        }
      }
      fetch()
      return () => { cancelled = true }
    }, [])
  )

  if (loading || !plant) return null

  const handlePress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
    if (onPress) {
      onPress(plant.plantId)
    } else {
      router.push(`/plant/${plant.plantId}` as any)
    }
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
          <Text style={styles.name}>{plant.plantName}</Text>
          <Text style={styles.time}>{formatRelativeDate(plant.date)}</Text>
        </View>
        <Text style={styles.chevron}>→</Text>
      </Pressable>
    </View>
  )
}
