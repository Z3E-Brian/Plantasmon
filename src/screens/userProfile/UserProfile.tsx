import { useState } from "react"
import {
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    View,
    useColorScheme
} from "react-native"
import { useSafeAreaInsets } from "react-native-safe-area-context"

import { Achievements } from "@/src/components/profile/Achievements"
import { ActivityFeed } from "@/src/components/profile/ActivityFeed"
import { PlantCollection } from "@/src/components/profile/PlantCollection"
import { ProfileAbout } from "@/src/components/profile/ProfileAbout"
import { ProfileHero } from "@/src/components/profile/ProfileHero"
import ScreenWrapper from "@/src/components/screenWrapper/ScreenWrapper"
import { BG_THEMES, COLORS } from "@/src/constants/theme"
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

  const currentBg = BG_THEMES[bgTheme]

  return (
    <ScreenWrapper>
      <View style={styles.container}>
        {/* Background gradient */}
        <View
          style={[StyleSheet.absoluteFill, { backgroundColor: currentBg.colors[1] }]}
        />

        {/* Background pattern */}
        <View style={StyleSheet.absoluteFill} pointerEvents="none">
          <BackgroundPattern pattern={currentBg.pattern} color={currentBg.patternColor} />
        </View>

        {/* Vignette overlay */}
        <View
          style={[StyleSheet.absoluteFill, styles.vignette]}
          pointerEvents="none"
        />

        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={[
            styles.scrollContent,
            { paddingTop: insets.top, paddingBottom: 55+ insets.bottom },
          ]}
          showsVerticalScrollIndicator={false}
        >
          {/* Hero Section */}
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
          />

          {/* Content section with own background */}
          <View style={[
            styles.contentSection,
            { backgroundColor: colorScheme === 'dark' 
              ? 'rgba(15, 30, 20, 0.7)'  // fondo oscuro
              : 'rgba(240, 245, 242, 0.9)'  // fondo claro
            }
          ]}>
            {/* Divider with leaf */}
            <View style={styles.divider}>
              <View style={styles.dividerLine} />
              <View style={styles.dividerIcon}>
                <Text style={{ fontSize: 10, color: COLORS.primary }}>🌿</Text>
              </View>
              <View style={styles.dividerLine} />
            </View>

            {/* About Section */}
            <ProfileAbout />

            {/* Tabs */}
            <View style={styles.tabsContainer}>
            <View style={styles.tabsList}>
              {(["collection", "activity", "badges"] as TabKey[]).map((tab) => (
                <Pressable
                  key={tab}
                  onPress={() => setActiveTab(tab)}
                  style={[
                    styles.tabButton,
                    activeTab === tab && styles.tabButtonActive,
                  ]}
                >
                  <TabIcon type={tab} active={activeTab === tab} />
                  <Text
                    style={[
                      styles.tabText,
                      activeTab === tab && styles.tabTextActive,
                    ]}
                  >
                    {tab.charAt(0).toUpperCase() + tab.slice(1)}
                  </Text>
                </Pressable>
              ))}
            </View>

            {/* Tab Content */}
            <View style={styles.tabContent}>
              {activeTab === "collection" && <PlantCollection />}
              {activeTab === "activity" && <ActivityFeed />}
              {activeTab === "badges" && <Achievements />}
            </View>
          </View>
          </View>
        </ScrollView>
      </View>
    </ScreenWrapper>
  )
}

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
  // Pattern simplificado
  return null
}