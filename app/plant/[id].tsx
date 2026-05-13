import { View, Text, StyleSheet } from "react-native";
import { useLocalSearchParams } from "expo-router";
import ScreenWrapper from "@/src/components/screenWrapper/ScreenWrapper";
import { COLORS } from "@/src/constants/theme";

export default function PlantDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const plantName = id ? `Planta #${id}` : "Planta desconocida";

  return (
    <ScreenWrapper>
      <View style={styles.container}>
        <Text style={styles.title}>{plantName}</Text>
        <Text style={styles.subtitle}>Próximamente: Detalle de planta</Text>
      </View>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: COLORS.foreground,
    marginBottom: 12,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 16,
    color: COLORS.foreground,
    opacity: 0.7,
    textAlign: "center",
  },
});
