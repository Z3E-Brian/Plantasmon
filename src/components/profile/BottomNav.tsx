import { useThemedStyles } from "@/src/styles/themedStyles"
import * as Haptics from "expo-haptics"
import { Pressable, Text, View } from "react-native"
import { useSafeAreaInsets } from "react-native-safe-area-context"

const NAV_ITEMS = [
  { icon: "home", label: "Home", active: false },
  { icon: "search", label: "Explore", active: false },
  { icon: "camera", label: "Identify", active: false, isCenter: true },
  { icon: "book", label: "Journal", active: false },
  { icon: "user", label: "Profile", active: true },
]

export function BottomNav() {
  const insets = useSafeAreaInsets()
  const { theme, styles } = useThemedStyles("bottomNav")

  const handlePress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
  }

  return (
    <View style={[styles.container, { paddingBottom: Math.max(insets.bottom, 8) }]}>
      <View style={styles.navRow}>
        {NAV_ITEMS.map((item) => (
          <Pressable
            key={item.label}
            onPress={handlePress}
            style={[styles.navItem, item.isCenter && styles.navItemCenter]}
          >
            {item.isCenter ? (
              <View style={styles.centerButton}>
                <NavIcon icon={item.icon} active={true} theme={theme} />
              </View>
            ) : (
              <NavIcon icon={item.icon} active={item.active} theme={theme} />
            )}
            <Text
              style={[
                styles.navLabel,
                item.active && styles.navLabelActive,
                item.isCenter && styles.navLabelCenter,
              ]}
            >
              {item.label}
            </Text>
          </Pressable>
        ))}
      </View>
    </View>
  )
}

const NAV_EMOJI: Record<string, string> = {
  home: "🏠",
  search: "🔍",
  camera: "📷",
  book: "📖",
  user: "👤",
}

function NavIcon({ icon, active, theme }: { icon: string; active: boolean; theme: any }) {
  return (
    <Text 
      style={{ 
        fontSize: 20, 
        opacity: active ? 1 : theme.mode === "light" ? 0.35 : 0.5
      }}
    >
      {NAV_EMOJI[icon] ?? "🌿"}
    </Text>
  )
}
