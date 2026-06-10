import { COLORS } from "@/src/constants/theme"
import * as Haptics from "expo-haptics"
import { Pressable, StyleSheet, Text } from "react-native"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import { useRouter } from "expo-router"

export function ChatFab() {
  const insets = useSafeAreaInsets()
  const router = useRouter()

  const handlePress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
    router.push("/chat")
  }

  return (
    <Pressable
      onPress={handlePress}
      style={[
        styles.fab,
        { bottom: insets.bottom + 24, backgroundColor: "#2E5739" },
      ]}
    >
      <Text style={styles.icon}>💬</Text>
    </Pressable>
  )
}

const styles = StyleSheet.create({
  fab: {
    position: "absolute",
    right: 20,
    width: 58,
    height: 58,
    borderRadius: 29,
    alignItems: "center",
    justifyContent: "center",
    elevation: 6,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  icon: {
    fontSize: 26,
  },
})
