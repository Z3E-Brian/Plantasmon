import * as Haptics from "expo-haptics"
import { useRouter } from "expo-router"
import { useSafeAreaInsets } from "react-native-safe-area-context"

import { DailyMissions } from "@/src/components/home/DailyMissions"
import { HomeHeader } from "@/src/components/home/HomeHeader"
import { LastIdentified } from "@/src/components/home/LastIdentified"
import { RecentAchievement } from "@/src/components/home/RecentAchievement"
import { StatsBar } from "@/src/components/home/StatsBar"
import { TipCard } from "@/src/components/home/TipCard"
import { UserProgress } from "@/src/components/home/UserProgress"
import ScreenWrapper from "@/src/components/screenWrapper/ScreenWrapper"
import { useThemedStyles } from "@/src/styles/themedStyles"
import { ScrollView } from "react-native"

export default function HomeScreen() {
  const insets = useSafeAreaInsets()
  const router = useRouter()
  const { styles, theme } = useThemedStyles("homeScreen")

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
        <HomeHeader />

        {/* Barra de estadísticas rápidas (Fase 4) */}
        <StatsBar />

        {/* Planta del día oculto (D-02) — reemplazar cuando haya catálogo suficiente */}
        {/* <PlantOfTheDay onLearnMore={handleLearnMore} /> */}

        {/* Última planta identificada */}
        <LastIdentified onPress={handlePlantPress} />

        {/* Progreso del usuario */}
        <UserProgress />

        {/* Misiones diarias */}
        <DailyMissions />

        {/* Logro reciente (condicional) */}
        <RecentAchievement />

        {/* Tip del día */}
        <TipCard />
      </ScrollView>
    </ScreenWrapper>
  )
}
