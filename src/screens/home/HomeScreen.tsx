import * as Haptics from "expo-haptics"
import { useRouter, useFocusEffect } from "expo-router"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import { useEffect, useState, useCallback } from "react"
import { Alert, ScrollView, TouchableOpacity, Text, View } from "react-native"

import { DailyMissions, type MissionDisplay } from "@/src/components/home/DailyMissions"
import { WeeklyMissions } from "@/src/components/home/WeeklyMissions"
import { HomeHeader } from "@/src/components/home/HomeHeader"
import { LastIdentified } from "@/src/components/home/LastIdentified"
import { RecentAchievement } from "@/src/components/home/RecentAchievement"
import { StatsBar } from "@/src/components/home/StatsBar"
import { TipCard } from "@/src/components/home/TipCard"
import { UserProgress } from "@/src/components/home/UserProgress"
import ScreenWrapper from "@/src/components/screenWrapper/ScreenWrapper"
import { useThemedStyles } from "@/src/styles/themedStyles"
import { useMissionProgress } from "@/src/hooks/useMissionProgress"
import { getCurrentUserId, getUserProfile } from "@/src/services/userService"
import {
  getUserMissions,
  assignDailyMissions,
  assignWeeklyMissions,
  getMissionDefinitions,
  claimMissionReward,
  getExpiredMissions,
  type AssignedMission,
} from "@/src/services/missionService"
import type { MissionDefinition } from "@/src/constants/missionsData"
import { getUserAchievements } from "@/src/services/userAchievementsService"
import { InfoBottomSheet } from "@/src/components/ui/InfoBottomSheet"
import { CelebrationSheet } from "@/src/components/ui/CelebrationSheet"
import { usePopupDismissal } from "@/src/hooks/usePopupDismissal"

export default function HomeScreen() {
  const insets = useSafeAreaInsets()
  const router = useRouter()
  const { styles, theme } = useThemedStyles("homeScreen")
  const [userName, setUserName] = useState<string | undefined>()
  const [userPlants, setUserPlants] = useState<number>(0)
  const [userStreak, setUserStreak] = useState<number>(0)
  const [userXp, setUserXp] = useState<number>(0)
  const [recentAchievement, setRecentAchievement] = useState<{ name: string; description: string; icon: string; id: number; unlockedAt: string } | null>(null)

  const [dailyMissions, setDailyMissions] = useState<MissionDisplay[]>([])
  const [weeklyMissions, setWeeklyMissions] = useState<MissionDisplay[]>([])
  const [expiredMissions, setExpiredMissions] = useState<MissionDisplay[]>([])

  const { reportProgress } = useMissionProgress()
  const missionsPopup = usePopupDismissal({ popupKey: "missions_first_use" })
  const [claimedCelebration, setClaimedCelebration] = useState<{ title: string; message: string; icon: string } | null>(null)
  const [showMissionInfo, setShowMissionInfo] = useState(false)

  const toDisplay = (
    assigned: AssignedMission[],
    defs: MissionDefinition[]
  ): MissionDisplay[] => {
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

  const loadMissions = useCallback(async () => {
    const uid = getCurrentUserId()
    if (!uid) return
    try {
      const result = await getUserMissions(uid)
      const allDefs = await getMissionDefinitions()

      // Refresh assignments if needed
      if (result.needsRefresh.daily) {
        await assignDailyMissions(uid)
        const refreshed = await getUserMissions(uid)
        setDailyMissions(toDisplay(refreshed.daily, allDefs))
      } else {
        setDailyMissions(toDisplay(result.daily, allDefs))
      }

      if (result.needsRefresh.weekly) {
        await assignWeeklyMissions(uid)
        const refreshed = await getUserMissions(uid)
        setWeeklyMissions(toDisplay(refreshed.weekly, allDefs))
      } else {
        setWeeklyMissions(toDisplay(result.weekly, allDefs))
      }

      // Grace period: load yesterday's unclaimed
      const expired = await getExpiredMissions(uid)
      setExpiredMissions(
        toDisplay(expired, allDefs).map((m) => ({ ...m, expired: true }))
      )
    } catch (error) {
      console.error("Error loading missions:", error)
    }
  }, [])

  const handleClaim = async (missionId: string) => {
    const uid = getCurrentUserId()
    if (!uid) return
    try {
      await claimMissionReward(uid, missionId)
      // Show celebration popup per D-09
      setClaimedCelebration({
        title: "¡Misión completada! 🎉",
        message: "Has ganado XP por completar la misión. ¡Seguí así!",
        icon: "⭐",
      })
      // Reload missions to reflect claimed state
      await loadMissions()
      // Reload user profile to update XP display
      const profile = await getUserProfile(uid)
      if (profile) {
        setUserXp(profile.xp)
        setUserStreak(profile.streak)
        setUserPlants(profile.plantsOwned)
      }
    } catch (error) {
      console.error("Error claiming reward:", error)
      Alert.alert("Error", "No se pudo reclamar la recompensa. Intenta de nuevo.")
    }
  }

  useEffect(() => {
    const uid = getCurrentUserId()
    if (!uid) return
    loadMissions()
    getUserProfile(uid).then((profile) => {
      if (profile) {
        setUserName(profile.name)
        setUserPlants(profile.plantsOwned)
        setUserStreak(profile.streak)
        setUserXp(profile.xp)
      }
    })
    getUserAchievements(uid).then((result) => {
      const earned = result.achievements.filter((a) => a.earned)
      if (earned.length > 0) {
        const last = earned[earned.length - 1]
        setRecentAchievement({
          name: last.name,
          description: last.description,
          icon: last.emoji || "🏆",
          id: 0,
          unlockedAt: new Date().toISOString(),
        })
      }
    })
  }, [loadMissions])

  // Re-check mission progress when screen gets focus (user may have performed actions elsewhere)
  useFocusEffect(
    useCallback(() => {
      loadMissions()
    }, [loadMissions])
  )

  const handlePlantPress = (plantId: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
    router.push(`/plant/${plantId}` as any)
  }

  return (
    <ScreenWrapper>
      <ScrollView
        style={styles.container}
        contentContainerStyle={[
          styles.scrollContent,
          { paddingTop: insets.top },
        ]}
        showsVerticalScrollIndicator={false}
      >
        {/* Header con saludo y stats */}
        <HomeHeader name={userName} />

        {/* Barra de estadísticas rápidas (Fase 4) */}
        <StatsBar />

        {/* Planta del día oculto (D-02) — reemplazar cuando haya catálogo suficiente */}
        {/* <PlantOfTheDay onLearnMore={handleLearnMore} /> */}

        {/* Última planta identificada */}
        <LastIdentified onPress={handlePlantPress} />

        {/* Progreso del usuario */}
        <UserProgress xp={userXp} />

        {/* Misiones diarias */}
        <View style={{ flexDirection: "row", alignItems: "center", paddingHorizontal: 16, marginBottom: 8 }}>
          <Text style={{ fontSize: 18, fontWeight: "700", color: theme.colors.textPrimary, flex: 1 }}>
            📋 Misiones diarias
          </Text>
          <TouchableOpacity onPress={() => setShowMissionInfo(true)}>
            <Text style={{ fontSize: 18, color: theme.colors.textSecondary }}>ℹ️</Text>
          </TouchableOpacity>
        </View>
        <DailyMissions
          missions={dailyMissions}
          expiredMissions={expiredMissions}
          onClaim={handleClaim}
        />

        {/* Misiones semanales */}
        <WeeklyMissions missions={weeklyMissions} onClaim={handleClaim} />

        {/* Logro reciente (condicional) */}
        <RecentAchievement achievement={recentAchievement} />

        {/* Tip del día */}
        <TipCard />
      </ScrollView>

      <InfoBottomSheet
        visible={showMissionInfo}
        title="🏠 Misiones diarias"
        message="Completá misiones para ganar experiencia y desbloquear logros. Tocá una misión para ver más detalles. Las misiones se renuevan todos los días."
        icon="📋"
        onDismiss={() => setShowMissionInfo(false)}
      />

      <InfoBottomSheet
        visible={missionsPopup.visible}
        title="🏠 Misiones diarias"
        message="Completá misiones para ganar experiencia y desbloquear logros. Tocá una misión para ver más detalles. Las misiones se renuevan todos los días."
        icon="📋"
        showDontShowAgain={true}
        onDismiss={missionsPopup.dismiss}
        onDontShowAgain={missionsPopup.dismissForeverFn}
      />

      {claimedCelebration && (
        <CelebrationSheet
          visible={!!claimedCelebration}
          title={claimedCelebration.title}
          message={claimedCelebration.message}
          icon={claimedCelebration.icon}
          onDismiss={() => setClaimedCelebration(null)}
        />
      )}
    </ScreenWrapper>
  )
}
