import { Text, View } from "react-native"
import { useThemedStyles } from "@/src/styles/themedStyles"

interface HomeHeaderProps {
  name?: string
}

export function HomeHeader({ name }: HomeHeaderProps) {
  const { styles } = useThemedStyles("homeHeader")

  return (
    <View style={styles.container}>
      <Text style={styles.greeting}>¡Hola, {name || "PlantLover"}! 🌿</Text>
    </View>
  )
}
