import { View, Text, ScrollView, ActivityIndicator } from "react-native"
import { useLocalSearchParams, useRouter } from "expo-router"
import { useEffect, useState } from "react"
import { doc, getDoc } from "firebase/firestore"
import { db } from "@/src/config/firebase"
import { Image } from "expo-image"
import ScreenWrapper from "@/src/components/screenWrapper/ScreenWrapper"
import { useThemedStyles } from "@/src/styles/themedStyles"
import { Pressable } from "react-native"

interface PlantDetail {
  id: string
  commonName: string
  scientificName: string
  image: string
  description: string
  difficulty: string
  light: string
  wateringDays: number
  rarity: string
  tips: string[]
}

export default function PlantDetail() {
  const { id } = useLocalSearchParams<{ id: string }>()
  const router = useRouter()
  const { theme, styles } = useThemedStyles("exploreScreen")
  const [plant, setPlant] = useState<PlantDetail | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function load() {
      if (!id) {
        setError("Planta no encontrada")
        setLoading(false)
        return
      }
      try {
        const ref = doc(db, "plants", id)
        const snap = await getDoc(ref)
        if (!snap.exists()) {
          setError("Planta no encontrada en el catálogo")
          setLoading(false)
          return
        }
        const data = snap.data()
        setPlant({
          id,
          commonName: data.commonName ?? "Planta desconocida",
          scientificName: data.scientificName ?? "",
          image: data.image || `https://picsum.photos/seed/${id}/600/400`,
          description: data.description ?? "",
          difficulty: data.difficulty ?? "Media",
          light: data.light ?? "partial",
          wateringDays: data.wateringDays ?? 7,
          rarity: data.rarity ?? "common",
          tips: data.tips ?? [],
        })
      } catch (e) {
        console.error("Error loading plant:", e)
        setError("Error al cargar la planta")
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [id])

  if (loading) {
    return (
      <ScreenWrapper>
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
        </View>
      </ScreenWrapper>
    )
  }

  if (error || !plant) {
    return (
      <ScreenWrapper>
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center", padding: 20 }}>
          <Text style={{ fontSize: 16, color: theme.colors.textPrimary, textAlign: "center", marginBottom: 16 }}>
            {error ?? "Planta no encontrada"}
          </Text>
          <Pressable
            onPress={() => router.back()}
            style={{
              backgroundColor: theme.colors.primary,
              borderRadius: theme.radius.sm,
              paddingHorizontal: 16,
              paddingVertical: 10,
            }}
          >
            <Text style={{ color: theme.colors.primaryForeground, fontWeight: "600" }}>Volver</Text>
          </Pressable>
        </View>
      </ScreenWrapper>
    )
  }

  const RARITY_LABELS: Record<string, string> = {
    common: "Común", uncommon: "Poco Común", rare: "Rara", legendary: "Legendaria",
  }

  return (
    <ScreenWrapper>
      <ScrollView contentContainerStyle={{ padding: 20 }}>
        <Image
          source={{ uri: plant.image }}
          style={{ width: "100%", height: 240, borderRadius: theme.radius.md, marginBottom: 16 }}
          contentFit="cover"
        />
        <Text style={{ fontSize: 24, fontWeight: "700", color: theme.colors.textPrimary, marginBottom: 4 }}>
          {plant.commonName}
        </Text>
        <Text style={{ fontSize: 14, fontStyle: "italic", color: theme.colors.textSecondary, marginBottom: 16 }}>
          {plant.scientificName}
        </Text>

        <View style={{ flexDirection: "row", gap: 8, marginBottom: 20 }}>
          <View style={{ backgroundColor: theme.colors.primarySoft, borderRadius: theme.radius.sm, paddingHorizontal: 10, paddingVertical: 4 }}>
            <Text style={{ fontSize: 12, color: theme.colors.primary, fontWeight: "600" }}>
              {RARITY_LABELS[plant.rarity] ?? plant.rarity}
            </Text>
          </View>
          <View style={{ backgroundColor: theme.colors.surfaceMuted, borderRadius: theme.radius.sm, paddingHorizontal: 10, paddingVertical: 4 }}>
            <Text style={{ fontSize: 12, color: theme.colors.textSecondary, fontWeight: "600" }}>
              {plant.difficulty}
            </Text>
          </View>
          <View style={{ backgroundColor: theme.colors.surfaceMuted, borderRadius: theme.radius.sm, paddingHorizontal: 10, paddingVertical: 4 }}>
            <Text style={{ fontSize: 12, color: theme.colors.textSecondary }}>💧 {plant.wateringDays}d</Text>
          </View>
        </View>

        {plant.description ? (
          <View style={{ marginBottom: 20 }}>
            <Text style={{ fontSize: 16, fontWeight: "600", color: theme.colors.textPrimary, marginBottom: 8 }}>Descripción</Text>
            <Text style={{ fontSize: 14, color: theme.colors.textSecondary, lineHeight: 20 }}>{plant.description}</Text>
          </View>
        ) : null}

        {plant.tips.length > 0 ? (
          <View style={{ marginBottom: 20 }}>
            <Text style={{ fontSize: 16, fontWeight: "600", color: theme.colors.textPrimary, marginBottom: 8 }}>💡 Tips de cuidado</Text>
            {plant.tips.map((tip, i) => (
              <View key={i} style={{ flexDirection: "row", gap: 8, marginBottom: 6 }}>
                <Text style={{ color: theme.colors.primary }}>•</Text>
                <Text style={{ fontSize: 14, color: theme.colors.textSecondary, flex: 1 }}>{tip}</Text>
              </View>
            ))}
          </View>
        ) : null}
      </ScrollView>
    </ScreenWrapper>
  )
}
