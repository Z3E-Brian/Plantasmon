import { Image } from "expo-image"
import { useRouter } from "expo-router"
import { Pressable, StyleSheet, Text, View } from "react-native"
import { COLORS } from "@/src/constants/theme"
import { UserPlant } from "@/src/services/userPlantsService"

interface CompanionPlantCardProps {
  plant: UserPlant & {
    nickname?: string
    personality?: string
    location?: string
    lastWatered?: string | null
    daysOwned: number
  }
}

const PERSONALITY_EMOJI: Record<string, string> = {
  resistente:    "💪",
  delicada:      "🌸",
  dramatica:     "🎭",
  independiente: "😎",
}

const LOCATION_EMOJI: Record<string, string> = {
  ventana:     "🪟",
  cochera:     "🚗",
  patio:       "🌳",
  patio_pilas: "🪣",
  otro:        "📍",
}

export function CompanionPlantCard({ plant }: CompanionPlantCardProps) {
  const router = useRouter()

  const personalityEmoji = plant.personality
    ? PERSONALITY_EMOJI[plant.personality] ?? "✨"
    : null
  const locationEmoji = plant.location
    ? LOCATION_EMOJI[plant.location] ?? "📍"
    : null

  return (
    <Pressable
      style={styles.card}
      onPress={() => router.push("/companionPlant")}
      android_ripple={{ color: "rgba(64,145,108,0.15)" }}
    >
      {/* Badge */}
      <View style={styles.badge}>
        <Text style={styles.badgeText}>🌿 Planta compañera</Text>
      </View>

      <View style={styles.row}>
        {/* Imagen */}
        <View style={styles.imageWrapper}>
          <Image
            source={plant.image}
            style={styles.image}
            contentFit="cover"
          />
          <View style={styles.imageOverlay} />
        </View>

        {/* Info */}
        <View style={styles.info}>
          <Text style={styles.nickname} numberOfLines={1}>
            {plant.nickname || plant.name}
          </Text>
          <Text style={styles.species} numberOfLines={1}>
            {plant.name}
          </Text>
          <Text style={styles.scientific} numberOfLines={1}>
            {plant.scientificName}
          </Text>

          <View style={styles.chips}>
            {personalityEmoji && plant.personality && (
              <View style={styles.chip}>
                <Text style={styles.chipText}>
                  {personalityEmoji} {plant.personality}
                </Text>
              </View>
            )}
            {locationEmoji && plant.location && plant.location !== "otro" && (
              <View style={styles.chip}>
                <Text style={styles.chipText}>
                  {locationEmoji} {plant.location.replace("_", " ")}
                </Text>
              </View>
            )}
          </View>

          <View style={styles.stats}>
            <View style={styles.stat}>
              <Text style={styles.statValue}>{plant.daysOwned}</Text>
              <Text style={styles.statLabel}>días juntos</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.stat}>
              <Text style={styles.statValue}>{plant.lastWatered ?? "—"}</Text>
              <Text style={styles.statLabel}>último riego</Text>
            </View>
          </View>
        </View>
      </View>

      {/* Tap hint */}
      <View style={styles.footer}>
        <Text style={styles.footerText}>Ver pasaporte completo →</Text>
      </View>
    </Pressable>
  )
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.card,
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: COLORS.primary + "50",
    marginBottom: 16,
    overflow: "hidden",
  },
  badge: {
    backgroundColor: COLORS.primary + "22",
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.primary + "30",
  },
  badgeText: {
    color: COLORS.primary,
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 0.5,
    textTransform: "uppercase",
  },
  row: {
    flexDirection: "row",
    padding: 14,
    gap: 14,
  },
  imageWrapper: {
    width: 90,
    height: 110,
    borderRadius: 10,
    overflow: "hidden",
  },
  image: {
    width: "100%",
    height: "100%",
  },
  imageOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.08)",
  },
  info: {
    flex: 1,
    gap: 3,
  },
  nickname: {
    color: COLORS.foreground,
    fontSize: 18,
    fontWeight: "800",
    letterSpacing: -0.3,
  },
  species: {
    color: COLORS.primary,
    fontSize: 13,
    fontWeight: "600",
  },
  scientific: {
    color: COLORS.mutedForeground,
    fontSize: 11,
    fontStyle: "italic",
    marginBottom: 6,
  },
  chips: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 6,
    marginBottom: 10,
  },
  chip: {
    backgroundColor: COLORS.secondary,
    borderRadius: 20,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  chipText: {
    color: COLORS.secondaryForeground,
    fontSize: 11,
    fontWeight: "500",
    textTransform: "capitalize",
  },
  stats: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  stat: {
    alignItems: "center",
  },
  statValue: {
    color: COLORS.foreground,
    fontSize: 14,
    fontWeight: "700",
  },
  statLabel: {
    color: COLORS.mutedForeground,
    fontSize: 10,
  },
  statDivider: {
    width: 1,
    height: 24,
    backgroundColor: COLORS.border,
  },
  footer: {
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    paddingHorizontal: 14,
    paddingVertical: 8,
    alignItems: "flex-end",
  },
  footerText: {
    color: COLORS.primary,
    fontSize: 12,
    fontWeight: "600",
  },
})
