import { useState } from "react"
import {
  ActivityIndicator,
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  useColorScheme,
  View,
} from "react-native"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import { signOut } from "firebase/auth"
import { auth } from "@/src/config/firebase"

import { Achievements } from "@/src/components/profile/Achievements"
import { ActivityFeed } from "@/src/components/profile/ActivityFeed"
import { PlantCollection } from "@/src/components/profile/PlantCollection"
import { ProfileAbout } from "@/src/components/profile/ProfileAbout"
import { ProfileHero } from "@/src/components/profile/ProfileHero"
import ScreenWrapper from "@/src/components/screenWrapper/ScreenWrapper"
import { BG_THEMES, COLORS } from "@/src/constants/theme"
import { useProfile } from "@/src/hooks/useProfile"
import styles from "@/src/screens/userProfile/UserProfile.styles"
import { useRouter } from "expo-router"

type TabKey = "collection" | "activity" | "badges"

export default function UserProfile() {
  const router      = useRouter()
  const insets      = useSafeAreaInsets()
  const colorScheme = useColorScheme()
  const [flagTheme,        setFlagTheme       ] = useState(0)
  const [bgTheme,          setBgTheme         ] = useState(0)
  const [titleIndex,       setTitleIndex      ] = useState(0)
  const [showSettings,     setShowSettings    ] = useState(false)
  const [activeSettingsTab, setActiveSettingsTab] = useState<"banner" | "background" | "title">("banner")
  const [activeTab,        setActiveTab       ] = useState<TabKey>("collection")
  const [signingOut,       setSigningOut      ] = useState(false)

  const { user, plants, achievements, loading } = useProfile()
  const currentBg = BG_THEMES[bgTheme]

  const handleSignOut = () => {
    Alert.alert(
      "Cerrar sesión",
      "¿Estás seguro que querés cerrar sesión?",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Cerrar sesión",
          style: "destructive",
          onPress: async () => {
            setSigningOut(true)
            try {
              await signOut(auth)
              // Expo Router redirige automáticamente si tenés guards de auth
              // Si no, navegá manualmente:
              router.replace("/login")
            } catch (error) {
              Alert.alert("Error", "No se pudo cerrar sesión. Intenta de nuevo.")
            } finally {
              setSigningOut(false)
            }
          },
        },
      ]
    )
  }

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
            {
              backgroundColor: colorScheme === "dark"
                ? "rgba(15, 30, 20, 0.7)"
                : "rgba(240, 245, 242, 0.9)",
            },
          ]}>
            <View style={styles.divider}>
              <View style={styles.dividerLine} />
              <View style={styles.dividerIcon}>
                <Text style={{ fontSize: 10, color: COLORS.primary }}>🌿</Text>
              </View>
              <View style={styles.dividerLine} />
            </View>

            {/* Fila de acciones: Editar perfil + Cerrar sesión */}
            <View style={localStyles.actionsRow}>
              <Pressable
                onPress={() => router.push("/editProfile")}
                style={localStyles.editBtn}
              >
                <Text style={localStyles.editBtnText}>✏️ Editar perfil</Text>
              </Pressable>

              <Pressable
                onPress={handleSignOut}
                style={localStyles.signOutBtn}
                disabled={signingOut}
              >
                {signingOut
                  ? <ActivityIndicator size="small" color={COLORS.destructive} />
                  : <Text style={localStyles.signOutBtnText}>🚪 Salir</Text>
                }
              </Pressable>
            </View>

            <ProfileAbout
              bio={user.bio}
              location={user.location}
              streak={user.streak}
              careScore={user.careScore}
              rarestFind={user.rarestFind}
              achievements={user.achievements}
              totalAchievements={user.totalAchievements}
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
                {activeTab === "activity"   && <ActivityFeed />}
                {activeTab === "badges"     && <Achievements achievements={achievements} />}
              </View>
            </View>
          </View>
        </ScrollView>
      </View>
    </ScreenWrapper>
  )
}

const localStyles = StyleSheet.create({
  actionsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    marginBottom: 12,
    gap: 10,
  },
  editBtn: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    backgroundColor: "rgba(64,145,108,0.15)",
    borderWidth: 1,
    borderColor: COLORS.primary,
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 7,
  },
  editBtnText: {
    fontSize: 13,
    color: COLORS.primary,
    fontWeight: "600",
  },
  signOutBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(239,68,68,0.1)",
    borderWidth: 1,
    borderColor: COLORS.destructive + "60",
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 7,
    minWidth: 80,
  },
  signOutBtnText: {
    fontSize: 13,
    color: COLORS.destructive,
    fontWeight: "600",
  },
})

const TAB_EMOJI: Record<TabKey, string> = {
  collection: "🌿",
  activity:   "🕒",
  badges:     "⭐",
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
