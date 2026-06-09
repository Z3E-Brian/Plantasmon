import { JournalCalendarSection } from "@/src/components/calendar/JournalCalendarSection"
import { DailyMissions, type MissionDisplay } from "@/src/components/home/DailyMissions"
import { UserProgress } from "@/src/components/home/UserProgress"
import ScreenWrapper from "@/src/components/screenWrapper/ScreenWrapper"
import { InfoBottomSheet } from "@/src/components/ui/InfoBottomSheet"
import type { MissionDefinition } from "@/src/constants/missionsData"
import { usePopupDismissal } from "@/src/hooks/usePopupDismissal"
import {
  assignDailyMissions,
  getExpiredMissions,
  getMissionDefinitions,
  getUserMissions,
  type AssignedMission,
} from "@/src/services/missionService"
import { getUserAchievements, UserAchievement } from "@/src/services/userAchievementsService"
import { getUserPlants, UserPlant } from "@/src/services/userPlantsService"
import { getCurrentUserId, getUserProfile } from "@/src/services/userService"
import { useThemedStyles } from "@/src/styles/themedStyles"
import * as Haptics from "expo-haptics"
import { Image } from "expo-image"
import { router } from "expo-router"
import { useCallback, useEffect, useState } from "react"
import {
  Pressable, RefreshControl,
  ScrollView,
  Text,
  View,
} from "react-native"

function toDisplay(
  assigned: AssignedMission[],
  defs: MissionDefinition[]
): MissionDisplay[] {
  return assigned.map((a) => {
    const def = defs.find((d) => d.id === a.id)
    return {
      id: a.id,
      title: def?.title ?? a.id,
      icon: def?.icon ?? "📋",
      xpReward: def?.xpReward ?? 0,
      progress: a.progress,
      target: a.target,
      completed: a.completed,
      claimed: a.claimed,
      claimedAt: a.claimedAt,
    }
  })
}

export default function Journal() {
  const { theme, styles } = useThemedStyles("journalScreen")
  const [userPlants, setUserPlants] = useState<UserPlant[]>([])
  const [achievements, setAchievements] = useState<UserAchievement[]>([])
  const [userXp, setUserXp] = useState<number>(0)
  const [dailyMissions, setDailyMissions] = useState<MissionDisplay[]>([])
  const [expiredMissions, setExpiredMissions] = useState<MissionDisplay[]>([])
  const [failedImages, setFailedImages] = useState<Record<string, boolean>>({})
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const journalPopup = usePopupDismissal({ popupKey: "journal_first_use" })

  const handleImageError = useCallback((plantId: string) => {
    setFailedImages((prev) => ({ ...prev, [plantId]: true }))
  }, [])

  const fetchData = useCallback(async (isRefresh = false) => {
    if (isRefresh && refreshing) return
    if (isRefresh) setRefreshing(true)
    else setLoading(true)
    setError(null)

    let plants: UserPlant[] = []
    let achList: UserAchievement[] = []
    let hasError = false
    let xp = 0

    try { plants = await getUserPlants() }
    catch (e) { hasError = true; console.error("Plants fetch error:", e) }

    try {
      const result = await getUserAchievements()
      achList = result.achievements
    } catch (e) { hasError = true; console.error("Achievements fetch error:", e) }

    try {
      const uid = getCurrentUserId()
      if (uid) {
        const profile = await getUserProfile(uid)
        if (profile) xp = profile.xp
      }
    } catch (e) { console.error("Profile fetch error:", e) }

    try {
      const uid = getCurrentUserId()
      if (uid) {
        const result = await getUserMissions(uid)
        const allDefs = await getMissionDefinitions()
        if (result.needsRefresh.daily) {
          await assignDailyMissions(uid)
          const refreshed = await getUserMissions(uid)
          setDailyMissions(toDisplay(refreshed.daily, allDefs))
        } else {
          setDailyMissions(toDisplay(result.daily, allDefs))
        }
        const expired = await getExpiredMissions(uid)
        setExpiredMissions(
          toDisplay(expired, allDefs).map((m) => ({ ...m, expired: true }))
        )
      }
    } catch (e) { console.error("Missions fetch error:", e) }

    setUserPlants(plants)
    setAchievements(achList)
    setUserXp(xp)

    if (hasError && plants.length === 0 && achList.length === 0)
      setError("No pudimos cargar tus datos")

    setLoading(false)
    setRefreshing(false)
  }, [refreshing])

  useEffect(() => { fetchData() }, [fetchData])

  const recentAchievement = achievements.find((a) => a.earned)

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

  if (error && userPlants.length === 0 && achievements.length === 0) {
    return (
      <ScreenWrapper>
        <View style={styles.container}>
          <Text style={styles.screenTitle}>📖 Tu Diario</Text>
          <View style={styles.errorCard}>
            <Text style={styles.errorText}>{error}</Text>
            <Pressable style={styles.retryButton} onPress={() => fetchData()} android_ripple={{ color: "rgba(64,145,108,0.15)" }}>
              <Text style={styles.retryText}>Reintentar</Text>
            </Pressable>
          </View>
        </View>
      </ScreenWrapper>
    )
  }

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
        contentContainerStyle={{ paddingTop: theme.spacing.md, paddingBottom: 100 }}
      >
        <Text style={styles.screenTitle}>📖 Tu Diario</Text>

        {error && (
          <View style={styles.errorCard}>
            <Text style={styles.errorText}>{error}</Text>
            <Pressable style={styles.retryButton} onPress={() => fetchData()} android_ripple={{ color: "rgba(64,145,108,0.15)" }}>
              <Text style={styles.retryText}>Reintentar</Text>
            </Pressable>
          </View>
        )}

        {/* ═══════ Card 1: Tus Plantas ═══════ */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle}>🌱 Tus Plantas Analizadas</Text>
            <View style={styles.countBadge}>
              <Text style={styles.countBadgeText}>{userPlants.length} plantas</Text>
            </View>
          </View>

          {userPlants.length > 0 ? (
            <>
              <View style={styles.plantRowItem}>
                {visiblePlants.map((plant) =>
                  failedImages[plant.id] ? (
                    <View key={plant.id} style={[styles.plantRowImage, { alignItems: "center", justifyContent: "center", backgroundColor: theme.colors.primarySoft }]}>
                      <Text style={{ fontSize: 20 }}>🌱</Text>
                    </View>
                  ) : (
                    <Image key={plant.id} source={{ uri: plant.image }} style={styles.plantRowImage} contentFit="cover" onError={() => handleImageError(plant.id)} />
                  )
                )}
                {remainingPlants > 0 && (
                  <View style={{ width: 48, height: 48, borderRadius: theme.radius.sm, backgroundColor: theme.colors.primarySoft, alignItems: "center", justifyContent: "center" }}>
                    <Text style={{ fontSize: 12, fontWeight: "600", color: theme.colors.textSecondary }}>+{remainingPlants}</Text>
                  </View>
                )}
              </View>
              <Pressable onPress={() => { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); router.push("/profile") }} android_ripple={{ color: "rgba(64,145,108,0.15)" }}>
                <Text style={styles.footerLink}>Ver todas →</Text>
              </Pressable>
            </>
          ) : (
            <Text style={{ fontSize: 14, color: theme.colors.textSecondary, textAlign: "center", paddingVertical: theme.spacing.md }}>
              Aún no has identificado plantas. ¡Usa la cámara para empezar!
            </Text>
          )}
        </View>

        {/* ═══════ Card 2: Calendario extendido ═══════ */}
        <View style={styles.card}>
          <JournalCalendarSection />
        </View>

        {/* ═══════ Card 3: Objetivos de Hoy ═══════ */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle}>🎯 Objetivos de Hoy</Text>
          </View>
          <DailyMissions missions={dailyMissions} expiredMissions={expiredMissions} onClaim={async () => {}} />
          <Text style={{ fontSize: 13, color: theme.colors.textSecondary, marginTop: theme.spacing.sm, paddingHorizontal: 4, lineHeight: 18 }}>
            Completá misiones diarias para ganar XP y desbloquear logros. ¡Volvé mañana para nuevas misiones!
          </Text>
        </View>

        {/* ═══════ Card 4: Tu Progreso ═══════ */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle}>📊 Tu Progreso</Text>
          </View>
          <UserProgress xp={userXp} />
          <View style={{ flexDirection: "row", justifyContent: "space-around", marginTop: theme.spacing.md }}>
            <Text style={{ fontSize: 14, color: theme.colors.textSecondary }}>{userPlants.length} plantas</Text>
          </View>
        </View>

        {/* ═══════ Card 5: Logros Recientes ═══════ */}
        {recentAchievement && (
          <Pressable
            style={styles.achievementCard}
            onPress={() => { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); router.push("/profile") }}
            android_ripple={{ color: "rgba(64,145,108,0.15)" }}
          >
            <View style={styles.achievementContent}>
              <Text style={styles.achievementIcon}>{recentAchievement.emoji || "🏆"}</Text>
              <View style={styles.achievementInfo}>
                <Text style={{ fontSize: 14, fontWeight: "600", color: theme.colors.textPrimary, marginBottom: 4 }}>🏆 Logros Recientes</Text>
                <Text style={styles.achievementLabel}>¡Desbloqueado!</Text>
                <Text style={styles.achievementName} numberOfLines={1}>{recentAchievement.name}</Text>
                {recentAchievement.description && (
                  <Text style={{ fontSize: 14, color: theme.colors.textSecondary, marginTop: 4 }} numberOfLines={2}>{recentAchievement.description}</Text>
                )}
              </View>
            </View>
          </Pressable>
        )}
      </ScrollView>

      <InfoBottomSheet
        visible={journalPopup.visible}
        title="📖 Tu diario de plantas"
        message="Acá vas a encontrar un resumen de tu actividad: las plantas que identificaste, tu calendario de cuidados, misiones activas y logros obtenidos."
        icon="🌿"
        showDontShowAgain={true}
        onDismiss={journalPopup.dismiss}
        onDontShowAgain={journalPopup.dismissForeverFn}
      />
    </ScreenWrapper>
  )
}