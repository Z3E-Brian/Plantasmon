import { Text, View, StyleSheet } from "react-native"
import ScreenWrapper from "@/src/components/screenWrapper/ScreenWrapper"
import { COLORS } from "@/src/constants/theme"

export default function Explore() {
  return (
    <ScreenWrapper>
      <View style={styles.container}>
        <Text style={styles.title}>🔍 Explorar</Text>
        <Text style={styles.subtitle}>Próximamente...</Text>
      </View>
    </ScreenWrapper>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: COLORS.foreground,
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 16,
    color: COLORS.foreground,
    opacity: 0.7,
  },
})
