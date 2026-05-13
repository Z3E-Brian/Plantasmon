import { useState, useEffect, useCallback } from "react"
import {
  View, Text, ScrollView, Pressable, RefreshControl,
} from "react-native"
import { router } from "expo-router"
import { Image } from "expo-image"
import * as Haptics from "expo-haptics"
import ScreenWrapper from "@/src/components/screenWrapper/ScreenWrapper"
import { useThemedStyles } from "@/src/styles/themedStyles"
import { getUserPlants, UserPlant } from "@/src/services/userPlantsService"
import { getUserAchievements, UserAchievement } from "@/src/services/userAchievementsService"
import { DailyMissions } from "@/src/components/home/DailyMissions"
import { UserProgress } from "@/src/components/home/UserProgress"

export default function Journal() {
  const { theme, styles } = useThemedStyles("journalScreen")
  const [userPlants, setUserPlants] = useState<UserPlant[]>([])
  const [achievements, setAchievements] = useState<UserAchievement[]>([])
  const [failedImages, setFailedImages] = useState<Record<string, boolean>>({})
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleImageError = useCallback((plantId: string) => {
    setFailedImages((prev) => ({ ...prev, [plantId]: true }))
  }, [])

  const fetchData = useCallback(async (isRefresh = false) => {
    // Guard: prevent concurrent refreshes
    if (isRefresh && refreshing) return

    if (isRefresh) setRefreshing(true)
    else setLoading(true)
    setError(null)

    // Individual service calls — only show error if BOTH fail
    let plants: UserPlant[] = []
    let achList: UserAchievement[] = []
    let hasError = false

    try {
      plants = await getUserPlants()
    } catch (e) {
      hasError = true
      console.error("Plants fetch error:", e)
    }

    try {
      const result = await getUserAchievements()
      achList = result.achievements
    } catch (e) {
      hasError = true
      console.error("Achievements fetch error:", e)
    }

    setUserPlants(plants)
    setAchievements(achList)

    if (hasError && plants.length === 0 && achList.length === 0) {
      setError("No pudimos cargar tus datos")
    }

    setLoading(false)
    setRefreshing(false)
  }, [refreshing])

  useEffect(() => { fetchData() }, [fetchData])

  const recentAchievement = achievements.find((a) => a.earned)

  // ─── Loading skeleton ─────────────────────────────────────────────────
  if (loading && !refreshing) {
    return (
      <ScreenWrapper>
        <View style={styles.container}>
          <Text style={styles.screenTitle}>📖 Tu Diario</Text>
          <View style={styles.skeletonCard} />
          <View style={styles.skeletonCard} />
          <View style={styles.skeletonCard} />
        </View>
      </ScreenWrapper>
    )
  }

  // ─── Full error state (no data at all) ───────────────────────────────
  if (error && userPlants.length === 0 && achievements.length === 0) {
    return (
      <ScreenWrapper>
        <View style={styles.container}>
          <Text style={styles.screenTitle}>📖 Tu Diario</Text>
          <View style={styles.errorCard}>
            <Text style={styles.errorText}>{error}</Text>
            <Pressable
              style={styles.retryButton}
              onPress={() => fetchData()}
              android_ripple={{ color: "rgba(64,145,108,0.15)" }}
            >
              <Text style={styles.retryText}>Reintentar</Text>
            </Pressable>
          </View>
        </View>
      </ScreenWrapper>
    )
  }

  // ─── Empty state ─────────────────────────────────────────────────────
  if (!loading && !error && userPlants.length === 0 && achievements.length === 0) {
    return (
      <ScreenWrapper>
        <View style={styles.container}>
          <Text style={styles.screenTitle}>📖 Tu Diario</Text>
          <View style={styles.emptyContainer}>
            <Text style={{ fontSize: 48 }}>📖</Text>
            <Text style={styles.emptyTitle}>Tu diario está vacío</Text>
            <Text style={styles.emptyBody}>
              Identifica tus primeras plantas para ver tu actividad aquí.
            </Text>
          </View>
        </View>
      </ScreenWrapper>
    )
  }

  // ─── Main content ────────────────────────────────────────────────────
  const visiblePlants = userPlants.slice(0, 4)
  const remainingPlants = userPlants.length > 4 ? userPlants.length - 4 : 0

  return (
    <ScreenWrapper>
      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={() => fetchData(true)}
            tintColor={theme.colors.primary}
          />
        }
        contentContainerStyle={{
          paddingTop: theme.spacing.md,
          paddingBottom: 100,
        }}
      >
        <Text style={styles.screenTitle}>📖 Tu Diario</Text>

        {/* Error toast when partial data fetch fails */}
        {error && (
          <View style={styles.errorCard}>
            <Text style={styles.errorText}>{error}</Text>
            <Pressable
              style={styles.retryButton}
              onPress={() => fetchData()}
              android_ripple={{ color: "rgba(64,145,108,0.15)" }}
            >
              <Text style={styles.retryText}>Reintentar</Text>
            </Pressable>
          </View>
        )}

        {/* ═══════ Card 1: Tus Plantas Analizadas ═══════ */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle}>🌱 Tus Plantas Analizadas</Text>
            <View style={styles.countBadge}>
              <Text style={styles.countBadgeText}>
                {userPlants.length} plantas
              </Text>
            </View>
          </View>

          {userPlants.length > 0 ? (
            <>
              <View style={styles.plantRowItem}>
                {visiblePlants.map((plant) =>
                  failedImages[plant.id] ? (
                    <View
                      key={plant.id}
                      style={[
                        styles.plantRowImage,
                        {
                          alignItems: "center",
                          justifyContent: "center",
                          backgroundColor: theme.colors.primarySoft,
                        },
                      ]}
                    >
                      <Text style={{ fontSize: 20 }}>🌱</Text>
                    </View>
                  ) : (
                    <Image
                      key={plant.id}
                      source={{ uri: plant.image }}
                      style={styles.plantRowImage}
                      contentFit="cover"
                      onError={() => handleImageError(plant.id)}
                    />
                  )
                )}
                {remainingPlants > 0 && (
                  <View
                    style={{
                      width: 48,
                      height: 48,
                      borderRadius: theme.radius.sm,
                      backgroundColor: theme.colors.primarySoft,
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <Text
                      style={{
                        fontSize: 12,
                        fontWeight: "600",
                        color: theme.colors.textSecondary,
                      }}
                    >
                      +{remainingPlants}
                    </Text>
                  </View>
                )}
              </View>

              <Pressable
                onPress={() => {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
                  router.push("/profile")
                }}
                android_ripple={{ color: "rgba(64,145,108,0.15)" }}
              >
                <Text style={styles.footerLink}>Ver todas →</Text>
              </Pressable>
            </>
          ) : (
            <Text
              style={{
                fontSize: 14,
                color: theme.colors.textSecondary,
                textAlign: "center",
                paddingVertical: theme.spacing.md,
              }}
            >
              Aún no has identificado plantas. ¡Usa la cámara para empezar!
            </Text>
          )}
        </View>

        {/* ═══════ Card 2: Objetivos de Hoy ═══════ */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle}>🎯 Objetivos de Hoy</Text>
          </View>
          <DailyMissions />
        </View>

        {/* ═══════ Card 3: Tu Progreso ═══════ */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle}>📊 Tu Progreso</Text>
          </View>
          <UserProgress />
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-around",
              marginTop: theme.spacing.md,
            }}
          >
            <Text
              style={{
                fontSize: 14,
                color: theme.colors.textSecondary,
              }}
            >
              {userPlants.length} plantas
            </Text>
          </View>
        </View>

        {/* ═══════ Card 4: Logros Recientes (conditional) ═══════ */}
        {recentAchievement && (
          <Pressable
            style={styles.achievementCard}
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
              router.push("/profile")
            }}
            android_ripple={{ color: "rgba(64,145,108,0.15)" }}
          >
            <View style={styles.achievementContent}>
              <Text style={styles.achievementIcon}>
                {recentAchievement.emoji || "🏆"}
              </Text>
              <View style={styles.achievementInfo}>
                <Text
                  style={{
                    fontSize: 14,
                    fontWeight: "600",
                    color: theme.colors.textPrimary,
                    marginBottom: 4,
                  }}
                >
                  🏆 Logros Recientes
                </Text>
                <Text style={styles.achievementLabel}>¡Desbloqueado!</Text>
                <Text
                  style={styles.achievementName}
                  numberOfLines={1}
                >
                  {recentAchievement.name}
                </Text>
                {recentAchievement.description && (
                  <Text
                    style={{
                      fontSize: 14,
                      color: theme.colors.textSecondary,
                      marginTop: 4,
                    }}
                    numberOfLines={2}
                  >
                    {recentAchievement.description}
                  </Text>
                )}
              </View>
            </View>
          </Pressable>
        )}
      </ScrollView>
    </ScreenWrapper>
  )
}
