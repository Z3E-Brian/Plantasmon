import styles from "@/src/components/profile/ProfileHero.styles"
import * as Haptics from "expo-haptics"
import { Image } from "expo-image"
import { useEffect, useRef } from "react"
import {
  Animated,
  Easing,
  Pressable,
  Text,
  View
} from "react-native"

import { USER, getAccountAge } from "@/src/constants/data"
import { BG_THEMES, COLORS, FLAG_THEMES, TIER_COLORS, TITLE_OPTIONS, TierKey } from "@/src/constants/theme"

interface ProfileHeroProps {
  flagTheme: number
  bgTheme: number
  titleIndex: number
  showSettings: boolean
  activeSettingsTab: "banner" | "background" | "title"
  onFlagThemeChange: (index: number) => void
  onBgThemeChange: (index: number) => void
  onTitleChange: (index: number) => void
  onToggleSettings: () => void
  onSettingsTabChange: (tab: "banner" | "background" | "title") => void
}

export function ProfileHero({
  flagTheme,
  bgTheme,
  titleIndex,
  showSettings,
  activeSettingsTab,
  onFlagThemeChange,
  onBgThemeChange,
  onTitleChange,
  onToggleSettings,
  onSettingsTabChange,
}: ProfileHeroProps) {
  const accountAge = getAccountAge(USER.joinDate)
  const colors = FLAG_THEMES[flagTheme].colors
  const currentTitle = TITLE_OPTIONS[titleIndex].title
  const currentTier = TITLE_OPTIONS[titleIndex].tier as TierKey

  const floatAnim = useRef(new Animated.Value(0)).current
  const spinAnim = useRef(new Animated.Value(0)).current

  useEffect(() => {
    // Float animation
    Animated.loop(
      Animated.sequence([
        Animated.timing(floatAnim, {
          toValue: -6,
          duration: 1500,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(floatAnim, {
          toValue: 0,
          duration: 1500,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ])
    ).start()

    // Spin animation
    Animated.loop(
      Animated.timing(spinAnim, {
        toValue: 1,
        duration: 20000,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    ).start()
  }, [])

  const spinInterpolate = spinAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "360deg"],
  })

  const handlePress = (callback: () => void) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
    callback()
  }

  return (
    <View style={styles.container}>
      {/* Header bar */}
      <View style={styles.header}>
        <Pressable
          onPress={() => handlePress(onToggleSettings)}
          style={[styles.settingsButton, showSettings && styles.settingsButtonActive]}
        >
          <Text style={{ fontSize: 18, color: showSettings ? COLORS.primary : COLORS.foreground }}>⚙</Text>
        </Pressable>
      </View>

      {/* Settings Panel */}
      {showSettings && (
        <View style={styles.settingsPanel}>
          <View style={styles.settingsTabs}>
            {(["banner", "background", "title"] as const).map((tab) => (
              <Pressable
                key={tab}
                onPress={() => handlePress(() => onSettingsTabChange(tab))}
                style={[
                  styles.settingsTab,
                  activeSettingsTab === tab && styles.settingsTabActive,
                ]}
              >
                <Text
                  style={[
                    styles.settingsTabText,
                    activeSettingsTab === tab && styles.settingsTabTextActive,
                  ]}
                >
                  {tab.toUpperCase()}
                </Text>
              </Pressable>
            ))}
          </View>

          {activeSettingsTab === "banner" && (
            <View>
              <Text style={styles.settingsLabel}>CHOOSE YOUR BANNER COLORS</Text>
              <View style={styles.themeGrid}>
                {FLAG_THEMES.map((theme, idx) => (
                  <Pressable
                    key={theme.name}
                    onPress={() => handlePress(() => onFlagThemeChange(idx))}
                    style={[
                      styles.themeOption,
                      flagTheme === idx && styles.themeOptionActive,
                    ]}
                  >
                    {flagTheme === idx && (
                      <View style={styles.checkBadge}>
                        <Text style={styles.checkText}>✓</Text>
                      </View>
                    )}
                    <View style={styles.colorStrip}>
                      {theme.colors.map((c, i) => (
                        <View key={i} style={[styles.colorBlock, { backgroundColor: c }]} />
                      ))}
                    </View>
                    <Text style={styles.themeName}>{theme.name}</Text>
                  </Pressable>
                ))}
              </View>
            </View>
          )}

          {activeSettingsTab === "background" && (
            <View>
              <Text style={styles.settingsLabel}>CHOOSE YOUR BACKGROUND STYLE</Text>
              <View style={styles.bgGrid}>
                {BG_THEMES.map((theme, idx) => (
                  <Pressable
                    key={theme.name}
                    onPress={() => handlePress(() => onBgThemeChange(idx))}
                    style={[
                      styles.bgOption,
                      bgTheme === idx && styles.bgOptionActive,
                    ]}
                  >
                    {bgTheme === idx && (
                      <View style={styles.checkBadge}>
                        <Text style={styles.checkText}>✓</Text>
                      </View>
                    )}
                    <View
                      style={[styles.bgPreview, { backgroundColor: theme.colors[1] }]}
                    />
                    <Text style={styles.themeName}>{theme.name}</Text>
                  </Pressable>
                ))}
              </View>
            </View>
          )}

          {activeSettingsTab === "title" && (
            <View>
              <Text style={styles.settingsLabel}>CHOOSE YOUR TITLE</Text>
              <View style={styles.titleGrid}>
                {TITLE_OPTIONS.map((opt, idx) => {
                  const tier = TIER_COLORS[opt.tier as TierKey]
                  return (
                    <Pressable
                      key={opt.title}
                      onPress={() => handlePress(() => onTitleChange(idx))}
                      style={[
                        styles.titleOption,
                        titleIndex === idx && styles.titleOptionActive,
                      ]}
                    >
                      {titleIndex === idx && (
                        <View style={styles.checkBadge}>
                          <Text style={styles.checkText}>✓</Text>
                        </View>
                      )}
                      <TitleIcon icon={opt.icon} />
                      <View style={styles.titleInfo}>
                        <Text style={styles.titleText}>{opt.title}</Text>
                        <View style={[styles.tierBadge, { backgroundColor: tier.bg, borderColor: tier.border }]}>
                          <Text style={[styles.tierText, { color: tier.text }]}>
                            {opt.tier.toUpperCase()}
                          </Text>
                        </View>
                      </View>
                    </Pressable>
                  )
                })}
              </View>
            </View>
          )}
        </View>
      )}

      {/* Username and handle */}
      <View style={styles.userInfo}>
        <Text style={styles.userName}>{USER.name}</Text>
        <View style={styles.handleRow}>
          <Text style={styles.userHandle}>{USER.handle}</Text>
          <Pressable style={styles.copyButton}>
            <Text style={{ fontSize: 12, color: "rgba(255,255,255,0.5)" }}>⎘</Text>
          </Pressable>
        </View>
        <Pressable style={[styles.identifyButton, { borderColor: colors[2] + "50", backgroundColor: colors[1] + "30" }]}>
          <Text style={{ fontSize: 14 }}>📷</Text>
          <Text style={[styles.identifyText, { color: colors[2] }]}>Identify</Text>
        </Pressable>
      </View>

      {/* Avatar with frame */}
      <Animated.View style={[styles.avatarContainer, { transform: [{ translateY: floatAnim }] }]}>
        {/* Glow effect */}
        <View style={[styles.avatarGlow, { backgroundColor: colors[2] + "40" }]} />

        {/* Spinning ring */}
        <Animated.View style={[styles.spinningRing, { transform: [{ rotate: spinInterpolate }] }]}>
          <Image
            source={require("@/assets/images/spinning-ring.png")}
            style={styles.spinningRingImage}
            contentFit="contain"
          />
        </Animated.View>

        {/* Avatar image */}
        <View
          style={[styles.avatarFrame, { backgroundColor: colors[1] }]}
        >
          <View style={styles.avatarInner}>
            <Image
              source="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200"
              style={styles.avatarImage}
              contentFit="cover"
            />
          </View>
        </View>

        {/* Level badge */}
        <View
          style={[styles.levelBadge, { backgroundColor: colors[2] }]}
        >
          <Text style={styles.levelText}>{USER.level}</Text>
        </View>
      </Animated.View>

      {/* Banner ribbon */}
      <BannerRibbon title={currentTitle} colors={colors} tier={currentTier} />

      {/* Plant emblem */}
      <PlantEmblem colors={colors} />

      {/* Stats row */}
      <View style={styles.statsRow}>
        <StatItem icon="leaf" value={accountAge} label="Days" />
        <StatItem icon="pot" value={USER.plantsOwned} label="Owned" />
        <StatItem icon="scan" value={USER.plantsDiscovered} label="Found" />
        <StatItem icon="star" value={USER.xp.toLocaleString()} label="XP" />
      </View>

      {/* Decorative sawtooth border */}
      <View style={styles.sawtoothContainer}>
        {Array.from({ length: 5 }).map((_, i) => (
          <View key={i} style={styles.sawtoothTriangle} />
        ))}
      </View>
    </View>
  )
}

const TITLE_EMOJI: Record<string, string> = {
  shield: "🛡️",
  flower: "🌸",
  root: "🌿",
  petal: "🌺",
  spore: "🔵",
  tree: "🌳",
  seed: "🌱",
  moss: "🍃",
}

function TitleIcon({ icon }: { icon: string }) {
  return (
    <View style={styles.titleIconContainer}>
      <Text style={{ fontSize: 14 }}>{TITLE_EMOJI[icon] ?? "🌿"}</Text>
    </View>
  )
}

function BannerRibbon({ title, colors, tier }: { title: string; colors: readonly string[]; tier: TierKey }) {
  const tierGlow: Record<string, string> = {
    rare: "#3b82f6",
    epic: "#a855f7",
    legendary: "#f59e0b",
    mythic: "#f43f5e",
  }
  const glowColor = tierGlow[tier] || colors[2]

  return (
    <View style={styles.bannerContainer}>
      <View style={[styles.bannerGlow, { backgroundColor: glowColor }]} />
      <View
        style={[styles.bannerRibbon, { backgroundColor: colors[1] }]}
      >
        <Text style={styles.bannerText}>{title.toUpperCase()}</Text>
      </View>
    </View>
  )
}

function PlantEmblem({ colors }: { colors: readonly string[] }) {
  return (
    <View style={styles.emblemContainer}>
      <View style={styles.emblemRow}>
        <Text style={styles.emblemLeaf}>🌿</Text>
        <View style={[styles.emblemDiamond, { backgroundColor: colors[2] }]} />
        <Text style={styles.emblemLeaf}>🌿</Text>
      </View>
    </View>
  )
}

function StatItem({ icon, value, label }: { icon: string; value: string | number; label: string }) {
  const iconColor = {
    leaf: COLORS.primary,
    pot: COLORS.chart3,
    scan: COLORS.chart2,
    star: COLORS.accent,
  }[icon] || COLORS.primary

  return (
    <View style={styles.statItem}>
      <View style={styles.statIcon}>
        <Text style={{ fontSize: 14 }}>
          {icon === "leaf" ? "🌿" : icon === "pot" ? "🪴" : icon === "scan" ? "🔍" : "⭐"}
        </Text>
      </View>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  )
}
