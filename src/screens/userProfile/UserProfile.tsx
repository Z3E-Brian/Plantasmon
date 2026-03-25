import { useState } from "react"
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  useColorScheme,
  View
} from "react-native"
import { useSafeAreaInsets } from "react-native-safe-area-context"

import { Achievements } from "@/src/components/profile/Achievements"
import { ActivityFeed } from "@/src/components/profile/ActivityFeed"
import { PlantCollection } from "@/src/components/profile/PlantCollection"
import { ProfileAbout } from "@/src/components/profile/ProfileAbout"
import { ProfileHero } from "@/src/components/profile/ProfileHero"
import ScreenWrapper from "@/src/components/screenWrapper/ScreenWrapper"
import { BG_THEMES, COLORS } from "@/src/constants/theme"
import { useProfile } from "@/src/hooks/useProfile"
import styles from "@/src/screens/userProfile/UserProfile.styles"

type TabKey = "collection" | "activity" | "badges"

export default function UserProfile() {
  const insets = useSafeAreaInsets()
  const colorScheme = useColorScheme()
  const [flagTheme, setFlagTheme] = useState(0)
  const [bgTheme, setBgTheme] = useState(0)
  const [titleIndex, setTitleIndex] = useState(0)
  const [showSettings, setShowSettings] = useState(false)
  const [activeSettingsTab, setActiveSettingsTab] = useState<"banner" | "background" | "title">("banner")
  const [activeTab, setActiveTab] = useState<TabKey>("collection")

  // Estado local para bio (se actualiza sin recargar toda la pantalla)
  const [localBio, setLocalBio] = useState<string | null>(null)

  const { user, plants, achievements, loading } = useProfile()

  const currentBg = BG_THEMES[bgTheme]

  if (loading) {
    return (
      <ScreenWrapper>
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
          <ActivityIndicator size="large" color={COLORS.primary} />
        </View>
      </ScreenWrapper>
    )
  }

  if (!user) return null

  return (
    <ScreenWrapper>
      <View style={styles.container}>
        <View style={[StyleSheet.absoluteFill, { backgroundColor: currentBg.colors[1] }]} />
        <View style={StyleSheet.absoluteFill} pointerEvents="none">
          <BackgroundPattern pattern={currentBg.pattern} color={currentBg.patternColor} />
        </View>
        <View style={[StyleSheet.absoluteFill, styles.vignette]} pointerEvents="none" />

        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={[
            styles.scrollContent,
            { paddingTop: insets.top, paddingBottom: 55 + insets.bottom },
          ]}
          showsVerticalScrollIndicator={false}
        >
          <ProfileHero
            flagTheme={flagTheme}
            bgTheme={bgTheme}
            titleIndex={titleIndex}
            showSettings={showSettings}
            activeSettingsTab={activeSettingsTab}
            onFlagThemeChange={setFlagTheme}
            onBgThemeChange={setBgTheme}
            onTitleChange={setTitleIndex}
            onToggleSettings={() => setShowSettings(!showSettings)}
            onSettingsTabChange={setActiveSettingsTab}
            name={user.name}
            handle={user.handle}
            level={user.level}
            xp={user.xp}
            xpToNextLevel={user.xpToNextLevel}
            plantsOwned={user.plantsOwned}
            avatarUrl={user.avatarUrl}
          />

          <View style={[
            styles.contentSection,
            { backgroundColor: colorScheme === 'dark'
              ? 'rgba(15, 30, 20, 0.7)'
              : 'rgba(240, 245, 242, 0.9)'
            }
          ]}>
            <View style={styles.divider}>
              <View style={styles.dividerLine} />
              <View style={styles.dividerIcon}>
                <Text style={{ fontSize: 10, color: COLORS.primary }}>🌿</Text>
              </View>
              <View style={styles.dividerLine} />
            </View>

            <ProfileAbout
              bio={localBio ?? user.bio}   // local tiene prioridad tras editar
              location={user.location}
              streak={user.streak}
              careScore={user.careScore}
              rarestFind={user.rarestFind}
              achievements={user.achievements}
              totalAchievements={user.totalAchievements}
              onBioUpdated={(newBio) => setLocalBio(newBio)}
            />

            <View style={styles.tabsContainer}>
              <View style={styles.tabsList}>
                {(["collection", "activity", "badges"] as TabKey[]).map((tab) => (
                  <Pressable
                    key={tab}
                    onPress={() => setActiveTab(tab)}
                    style={[styles.tabButton, activeTab === tab && styles.tabButtonActive]}
                  >
                    <TabIcon type={tab} active={activeTab === tab} />
                    <Text style={[styles.tabText, activeTab === tab && styles.tabTextActive]}>
                      {tab.charAt(0).toUpperCase() + tab.slice(1)}
                    </Text>
                  </Pressable>
                ))}
              </View>

              <View style={styles.tabContent}>
                {activeTab === "collection" && <PlantCollection plants={plants} />}
                {activeTab === "activity" && <ActivityFeed />}
                {activeTab === "badges" && <Achievements achievements={achievements} />}
              </View>
            </View>
          </View>
        </ScrollView>
      </View>
    </ScreenWrapper>
  )
}

// ─── Helpers ───────────────────────────────────────────────────────────────

const TAB_EMOJI: Record<TabKey, string> = {
  collection: "🌿",
  activity: "🕒",
  badges: "⭐",
}

function TabIcon({ type, active }: { type: TabKey; active: boolean }) {
  return (
    <Text style={{ fontSize: 14, opacity: active ? 1 : 0.6 }}>
      {TAB_EMOJI[type]}
    </Text>
  )
}

function BackgroundPattern({ pattern, color }: { pattern: string; color: string }) {
  return null
}
