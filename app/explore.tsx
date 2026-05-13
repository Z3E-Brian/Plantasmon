import React, { useState, useEffect, useMemo, useCallback } from "react"
import {
  View,
  Text,
  TextInput,
  FlatList,
  Pressable,
  RefreshControl,
  ActivityIndicator,
} from "react-native"
import { router } from "expo-router"
import { Image } from "expo-image"
import * as Haptics from "expo-haptics"
import ScreenWrapper from "@/src/components/screenWrapper/ScreenWrapper"
import { useThemedStyles } from "@/src/styles/themedStyles"
import {
  getAllPlants,
  CatalogPlant,
  CatalogPlantRarity,
} from "@/src/services/plantCatalogService"

const RARITY_COLORS: Record<
  CatalogPlantRarity,
  { bg: string; text: string; border: string }
> = {
  common: {
    bg: "rgba(64, 145, 108, 0.15)",
    text: "#40916c",
    border: "rgba(64, 145, 108, 0.3)",
  },
  uncommon: {
    bg: "rgba(59, 130, 246, 0.15)",
    text: "#60a5fa",
    border: "rgba(59, 130, 246, 0.3)",
  },
  rare: {
    bg: "rgba(168, 85, 247, 0.15)",
    text: "#c084fc",
    border: "rgba(168, 85, 247, 0.3)",
  },
  legendary: {
    bg: "rgba(245, 158, 11, 0.15)",
    text: "#fbbf24",
    border: "rgba(245, 158, 11, 0.3)",
  },
}

const RARITY_LABELS: Record<CatalogPlantRarity, string> = {
  common: "Común",
  uncommon: "Poco Común",
  rare: "Rara",
  legendary: "Legendaria",
}

function getWaterDropCount(wateringDays: number): number {
  if (wateringDays <= 5) return 3
  if (wateringDays <= 10) return 2
  return 1
}

function getSunOpacity(light: string): number {
  const normalized = light.toLowerCase().trim()
  if (
    normalized.includes("low") ||
    normalized.includes("shade") ||
    normalized.includes("sombra")
  )
    return 0.2
  if (
    normalized.includes("medium") ||
    normalized.includes("partial") ||
    normalized.includes("media")
  )
    return 0.6
  return 1.0
}

const SKELETON_ROWS = 3

function SkeletonGrid() {
  return (
    <>
      {Array.from({ length: SKELETON_ROWS }).map((_, rowIndex) => (
        <View
          key={`skeleton-row-${rowIndex}`}
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            marginBottom: 12,
          }}
        >
          <View style={{ width: "48%" }}>
            <SkeletonCard />
          </View>
          <View style={{ width: "48%" }}>
            <SkeletonCard />
          </View>
        </View>
      ))}
    </>
  )
}

function SkeletonCard() {
  return (
    <View
      style={{
        backgroundColor: "#233026",
        borderRadius: 16,
        overflow: "hidden",
        opacity: 0.5,
      }}
    >
      <View
        style={{
          height: 112,
          backgroundColor: "#233026",
          borderTopLeftRadius: 16,
          borderTopRightRadius: 16,
        }}
      />
      <View style={{ padding: 10 }}>
        <View
          style={{
            height: 12,
            width: "80%",
            backgroundColor: "#233026",
            borderRadius: 4,
            marginTop: 8,
            marginHorizontal: 10,
          }}
        />
        <View
          style={{
            height: 12,
            width: "50%",
            backgroundColor: "#233026",
            borderRadius: 4,
            marginTop: 6,
            marginHorizontal: 10,
          }}
        />
      </View>
    </View>
  )
}

const PlantCard = React.memo(function PlantCard({
  plant,
  onPress,
}: {
  plant: CatalogPlant
  onPress: (p: CatalogPlant) => void
}) {
  const { styles } = useThemedStyles("exploreScreen")
  const rarity = RARITY_COLORS[plant.rarity]
  const label = RARITY_LABELS[plant.rarity]
  const waterDrops = getWaterDropCount(plant.wateringDays)
  const sunOpacity = getSunOpacity(plant.light)

  return (
    <Pressable
      style={styles.card}
      onPress={() => onPress(plant)}
      android_ripple={{ color: "rgba(64,145,108,0.15)" }}
    >
      <View style={styles.cardImageContainer}>
        <Image
          source={{ uri: plant.image }}
          style={styles.cardImage}
          contentFit="cover"
        />
        <View
          style={[
            styles.rarityBadge,
            {
              backgroundColor: rarity.bg,
              borderColor: rarity.border,
            },
          ]}
        >
          <Text
            style={[styles.rarityText, { color: rarity.text }]}
            numberOfLines={1}
          >
            {label}
          </Text>
        </View>
      </View>
      <View style={styles.cardInfo}>
        <Text style={styles.cardName} numberOfLines={1}>
          {plant.commonName}
        </Text>
        <Text style={styles.cardScientific} numberOfLines={1}>
          {plant.scientificName}
        </Text>
        <View style={styles.careRow}>
          <View style={styles.careIcons}>
            <View style={styles.waterDrops}>
              {Array.from({ length: 3 }).map((_, i) => (
                <Text key={i} style={{ opacity: i < waterDrops ? 1 : 0.2 }}>
                  💧
                </Text>
              ))}
            </View>
            <Text style={{ opacity: sunOpacity }}>☀️</Text>
          </View>
          <Text
            style={{
              fontSize: 9,
              fontWeight: "600",
              color: "#95A796",
            }}
          >
            {plant.difficulty}
          </Text>
        </View>
      </View>
    </Pressable>
  )
})

export default function Explore() {
  const { theme, styles } = useThemedStyles("exploreScreen")
  const [plants, setPlants] = useState<CatalogPlant[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [refreshing, setRefreshing] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [debouncedQuery, setDebouncedQuery] = useState("")

  // Debounce search query (300ms)
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(searchQuery)
    }, 300)
    return () => clearTimeout(timer)
  }, [searchQuery])

  // Fetch plants on mount
  const fetchPlants = useCallback(async (isRefresh = false) => {
    try {
      if (isRefresh) {
        setRefreshing(true)
      } else {
        setLoading(true)
      }
      setError(null)
      const data = await getAllPlants()
      setPlants(data)
    } catch (err) {
      console.error("Error fetching plants:", err)
      setError("No pudimos cargar las plantas")
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }, [])

  useEffect(() => {
    fetchPlants()
  }, [fetchPlants])

  // Filtered plants based on debounced search
  const filteredPlants = useMemo(() => {
    if (!debouncedQuery.trim()) return plants
    const q = debouncedQuery.toLowerCase().trim()
    return plants.filter(
      (p) =>
        p.commonName.toLowerCase().includes(q) ||
        p.scientificName.toLowerCase().includes(q)
    )
  }, [plants, debouncedQuery])

  const handleRefresh = useCallback(() => {
    setSearchQuery("")
    setDebouncedQuery("")
    fetchPlants(true)
  }, [fetchPlants])

  const handleRetry = useCallback(() => {
    fetchPlants()
  }, [fetchPlants])

  const handleCardPress = useCallback(async (plant: CatalogPlant) => {
    try {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
    } catch {
      // Haptics not available on all devices
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    router.push(`/plant/${plant.id}` as any)
  }, [])

  const renderSearchBar = () => {
    if (loading && plants.length === 0) return null
    return (
      <View style={styles.searchContainer}>
        <Text style={styles.searchIcon}>🔍</Text>
        <TextInput
          style={styles.searchInput}
          placeholder="Buscar plantas..."
          placeholderTextColor={theme.colors.textTertiary}
          value={searchQuery}
          onChangeText={setSearchQuery}
          autoFocus={false}
          autoCorrect={false}
        />
        {searchQuery.length > 0 && (
          <Pressable
            style={styles.clearButton}
            onPress={() => setSearchQuery("")}
            accessibilityLabel="Limpiar búsqueda"
            android_ripple={{ color: "rgba(64,145,108,0.15)" }}
          >
            <Text style={styles.clearButtonText}>✕</Text>
          </Pressable>
        )}
      </View>
    )
  }

  const renderEmptyState = () => {
    if (loading && plants.length === 0) return null

    // No search results
    if (debouncedQuery.trim() && filteredPlants.length === 0) {
      return (
        <View style={styles.empty}>
          <View style={styles.emptyIcon}>
            <Text style={{ fontSize: 24 }}>🌿</Text>
          </View>
          <Text style={styles.emptyTitle}>
            No hay resultados para "{debouncedQuery}"
          </Text>
          <Text style={styles.emptySubtitle}>Prueba con otro término</Text>
        </View>
      )
    }

    // Catalog is truly empty
    if (!loading && plants.length === 0) {
      return (
        <View style={styles.empty}>
          <View style={styles.emptyIcon}>
            <Text style={{ fontSize: 24 }}>🌿</Text>
          </View>
          <Text style={styles.emptyTitle}>
            El catálogo aún no tiene plantas
          </Text>
        </View>
      )
    }

    return null
  }

  const renderPlantCard = useCallback(
    ({ item }: { item: CatalogPlant }) => {
      return <PlantCard plant={item} onPress={handleCardPress} />
    },
    [handleCardPress]
  )

  // Error state
  if (error && !loading && plants.length === 0) {
    return (
      <ScreenWrapper>
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center", padding: 20 }}>
          <View
            style={{
              width: 48,
              height: 48,
              borderRadius: 24,
              backgroundColor: "rgba(239, 68, 68, 0.15)",
              alignItems: "center",
              justifyContent: "center",
              marginBottom: 12,
            }}
          >
            <Text style={{ fontSize: 24 }}>⚠️</Text>
          </View>
          <Text
            style={{
              fontSize: 14,
              fontWeight: "700",
              color: theme.colors.textPrimary,
              textAlign: "center",
              marginBottom: 8,
            }}
          >
            {error}
          </Text>
          <Text
            style={{
              fontSize: 12,
              color: theme.colors.textSecondary,
              textAlign: "center",
              marginBottom: 16,
            }}
          >
            Revisa tu conexión e inténtalo de nuevo
          </Text>
          <Pressable
            style={{
              backgroundColor: theme.colors.primary,
              borderRadius: theme.radius.sm,
              paddingHorizontal: 16,
              paddingVertical: 10,
            }}
            onPress={handleRetry}
            android_ripple={{ color: "rgba(255,255,255,0.2)" }}
          >
            <Text
              style={{
                fontSize: 14,
                fontWeight: "600",
                color: theme.colors.primaryForeground,
              }}
            >
              Reintentar
            </Text>
          </Pressable>
        </View>
      </ScreenWrapper>
    )
  }

  // Loading state (initial)
  if (loading && plants.length === 0) {
    return (
      <ScreenWrapper>
        <View style={styles.container}>
          <View
            style={{
              padding: 20,
              paddingBottom: 0,
            }}
          >
            <Text
              style={{
                fontSize: 28,
                fontWeight: "700",
                color: theme.colors.textPrimary,
                marginBottom: 16,
              }}
            >
              🔍 Explorar
            </Text>
          </View>
          <View style={{ paddingHorizontal: 20 }}>
            <SkeletonGrid />
          </View>
        </View>
      </ScreenWrapper>
    )
  }

  return (
    <ScreenWrapper>
      <View style={styles.container}>
        <FlatList
          data={filteredPlants}
          renderItem={renderPlantCard}
          keyExtractor={(item) => item.id}
          numColumns={2}
          columnWrapperStyle={styles.row}
          contentContainerStyle={styles.flatList}
          showsVerticalScrollIndicator={false}
          ListHeaderComponent={renderSearchBar}
          ListEmptyComponent={renderEmptyState}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={handleRefresh}
              tintColor={theme.colors.primary}
            />
          }
          ListFooterComponent={
            loading && plants.length > 0 ? (
              <View style={{ paddingVertical: 20, alignItems: "center" }}>
                <ActivityIndicator size="small" color={theme.colors.primary} />
              </View>
            ) : null
          }
        />
      </View>
    </ScreenWrapper>
  )
}
