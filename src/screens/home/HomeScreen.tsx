import * as Haptics from "expo-haptics"
import { useRouter } from "expo-router"
import { useSafeAreaInsets } from "react-native-safe-area-context"

import { DailyMissions } from "@/src/components/home/DailyMissions"
import { HomeHeader } from "@/src/components/home/HomeHeader"
import { LastIdentified } from "@/src/components/home/LastIdentified"
import { PlantOfTheDay } from "@/src/components/home/PlantOfTheDay"
import { RecentAchievement } from "@/src/components/home/RecentAchievement"
import { TipCard } from "@/src/components/home/TipCard"
import { UserProgress } from "@/src/components/home/UserProgress"
import ScreenWrapper from "@/src/components/screenWrapper/ScreenWrapper"
import { useThemedStyles } from "@/src/styles/themedStyles"
import { ScrollView } from "react-native"

export default function HomeScreen() {
  const insets = useSafeAreaInsets()
  const router = useRouter()
  const { styles, theme } = useThemedStyles("homeScreen")

  const handlePlantPress = (plantId: number) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
    // Stack navigation: profundizar al detalle de la planta
    // router.push(`/plant/${plantId}`)
    console.log("Navigate to plant detail:", plantId)
  }

  const handleLearnMore = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
    // Stack navigation: profundizar a detalle de planta del día
    // router.push("/plant-of-day")
    console.log("Navigate to plant of the day detail")
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

        {/* Planta del día - Hero Section */}
        <PlantOfTheDay onLearnMore={handleLearnMore} />

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
