import { PLANTS, Plant } from "@/src/constants/data"
import { COLORS } from "@/src/constants/theme"
import { useThemedStyles } from "@/src/styles/themedStyles"
import * as Haptics from "expo-haptics"
import { Image } from "expo-image"
import { useState } from "react"
import {
  FlatList,
  Pressable,
  Text,
  TextInput,
  View,
} from "react-native"

const HEALTH_COLORS = {
  thriving: { bg: "rgba(64, 145, 108, 0.2)", text: COLORS.primary, border: "rgba(64, 145, 108, 0.3)" },
  good: { bg: "rgba(45, 138, 112, 0.2)", text: COLORS.chart2, border: "rgba(45, 138, 112, 0.3)" },
  "needs-care": { bg: "rgba(239, 68, 68, 0.2)", text: COLORS.destructive, border: "rgba(239, 68, 68, 0.3)" },
}

const WATER_COUNT = { low: 1, medium: 2, high: 3 }

type FilterType = "all" | "favorites" | "needs-care"

export function PlantCollection() {
  const { theme, styles } = useThemedStyles("plantCollection")
  const [filter, setFilter] = useState<FilterType>("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [favorites, setFavorites] = useState<Set<number>>(
    new Set(PLANTS.filter((p) => p.favorite).map((p) => p.id))
  )

  const filtered = PLANTS.filter((plant) => {
    const matchesFilter =
      filter === "all" ||
      (filter === "favorites" && favorites.has(plant.id)) ||
      (filter === "needs-care" && plant.health === "needs-care")
    const matchesSearch =
      plant.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      plant.scientificName.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesFilter && matchesSearch
  })

  const toggleFavorite = (id: number) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
    setFavorites((prev) => {
      const next = new Set(prev)
      if (next.has(id)) {
        next.delete(id)
      } else {
        next.add(id)
      }
      return next
    })
  }

  const handleFilterPress = (f: FilterType) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
    setFilter(f)
  }

  return (
    <View style={styles.container}>
      {/* Search */}
      <View style={styles.searchContainer}>
        <Text style={[styles.searchIcon, { fontSize: 14, color: theme.colors.textTertiary }]}>🔍</Text>
        <TextInput
          style={styles.searchInput}
          placeholder="Search your garden..."
          placeholderTextColor={theme.colors.textTertiary}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      {/* Filters */}
      <View style={styles.filters}>
        {(["all", "favorites", "needs-care"] as FilterType[]).map((f) => (
          <Pressable
            key={f}
            onPress={() => handleFilterPress(f)}
            style={[styles.filterButton, filter === f && styles.filterButtonActive]}
          >
            <Text style={[styles.filterText, filter === f && styles.filterTextActive]}>
              {f === "all" ? "All" : f === "favorites" ? "Favorites" : "Needs Care"}
            </Text>
          </Pressable>
        ))}
      </View>

      {/* Cards */}
      {filtered.length > 0 ? (
        <FlatList
          data={filtered}
          keyExtractor={(item) => item.id.toString()}
          numColumns={2}
          columnWrapperStyle={styles.row}
          scrollEnabled={false}
          renderItem={({ item }) => (
            <PlantCard
              plant={item}
              isFavorite={favorites.has(item.id)}
              onToggleFavorite={() => toggleFavorite(item.id)}
              styles={styles}
            />
          )}
        />
      ) : (
        <View style={styles.empty}>
          <View style={styles.emptyIcon}>
            <Text style={{ fontSize: 20 }}>🌿</Text>
          </View>
          <Text style={styles.emptyTitle}>No plants found</Text>
          <Text style={styles.emptySubtitle}>Try adjusting your search or filters</Text>
        </View>
      )}
    </View>
  )
}

function PlantCard({
  plant,
  isFavorite,
  onToggleFavorite,
  styles,
}: {
  plant: Plant
  isFavorite: boolean
  onToggleFavorite: () => void
  styles: any
}) {
  const healthStyle = HEALTH_COLORS[plant.health]

  return (
    <View style={styles.card}>
      {/* Image */}
      <View style={styles.cardImageContainer}>
        <Image source={plant.image} style={styles.cardImage} contentFit="cover" />

        {/* Favorite button */}
        <Pressable onPress={onToggleFavorite} style={styles.favoriteButton}>
          <Text style={{ fontSize: 12 }}>{isFavorite ? "❤️" : "🤍"}</Text>
        </Pressable>

        {/* Health tag */}
        <View
          style={[
            styles.healthTag,
            { backgroundColor: healthStyle.bg, borderColor: healthStyle.border },
          ]}
        >
          <Text style={[styles.healthText, { color: healthStyle.text }]}>
            {plant.health === "needs-care" ? "Needs Care" : plant.health}
          </Text>
        </View>
      </View>

      {/* Info */}
      <View style={styles.cardInfo}>
        <Text style={styles.cardName} numberOfLines={1}>
          {plant.name}
        </Text>
        <Text style={styles.cardScientific} numberOfLines={1}>
          {plant.scientificName}
        </Text>

        {/* Care row */}
        <View style={styles.careRow}>
          <View style={styles.careIcons}>
            {/* Water drops */}
            <View style={styles.waterDrops}>
              {Array.from({ length: 3 }).map((_, i) => (
                <Text key={i} style={{ fontSize: 10, opacity: i < WATER_COUNT[plant.waterLevel] ? 1 : 0.2 }}>💧</Text>
              ))}
            </View>
            {/* Sun */}
            <Text style={{ fontSize: 12, opacity: plant.sunlight === "shade" ? 0.2 : plant.sunlight === "partial" ? 0.6 : 1 }}>☀️</Text>
          </View>
          <Text style={styles.daysOwned}>{plant.daysOwned}d</Text>
        </View>
      </View>
    </View>
  )
}