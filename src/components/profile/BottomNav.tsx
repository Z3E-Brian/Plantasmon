import { useThemedStyles } from "@/src/styles/themedStyles"
import * as Haptics from "expo-haptics"
import { Pressable, Text, View } from "react-native"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import { useRouter, usePathname, Href } from "expo-router"

type NavItem = {
  icon: string
  label: string
  route: string
  isCenter?: boolean
}

const NAV_ITEMS: NavItem[] = [
  { icon: "home",   label: "Home",     route: "/"         },
  { icon: "search", label: "Explore",  route: "/explore"  },
  { icon: "camera", label: "Identify", route: "/camera", isCenter: true },
  { icon: "book",   label: "Journal",  route: "/journal"  },
  { icon: "user",   label: "Profile",  route: "/profile"  },
]

export function BottomNav() {
  const insets = useSafeAreaInsets()
  const { theme, styles } = useThemedStyles("bottomNav")
  const router = useRouter()
  const pathname = usePathname()

  const handlePress = (route: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
    router.push(route as Href)
  }

  return (
    <View style={[styles.container, { paddingBottom: Math.max(insets.bottom, 8) }]}>
      <View style={styles.navRow}>
        {NAV_ITEMS.map((item) => {
          const isActive = pathname === item.route

          return (
            <Pressable
              key={item.label}
              onPress={() => handlePress(item.route)}
              style={[styles.navItem, item.isCenter && styles.navItemCenter]}
            >
              {item.isCenter ? (
                <View style={styles.centerButton}>
                  <NavIcon icon={item.icon} active={true} theme={theme} />
                </View>
              ) : (
                <NavIcon icon={item.icon} active={isActive} theme={theme} />
              )}
              <Text
                style={[
                  styles.navLabel,
                  isActive && styles.navLabelActive,
                  item.isCenter && styles.navLabelCenter,
                ]}
              >
                {item.label}
              </Text>
            </Pressable>
          )
        })}
      </View>
    </View>
  )
}

const NAV_EMOJI: Record<string, string> = {
  home:   "🏠",
  search: "🔍",
  camera: "📷",
  book:   "📖",
  user:   "👤",
}

function NavIcon({ icon, active, theme }: { icon: string; active: boolean; theme: any }) {
  return (
    <Text style={{ fontSize: 20, opacity: active ? 1 : theme.mode === "light" ? 0.35 : 0.5 }}>
      {NAV_EMOJI[icon] ?? "🌿"}
    </Text>
  )
}
