import { Text, View } from "react-native"
import { Badge } from "@/src/components/ui/badge"
import { useThemedStyles } from "@/src/styles/themedStyles"
import { USER } from "@/src/constants/data"

export function HomeHeader() {
  const { styles } = useThemedStyles("homeHeader")

  return (
    <View style={styles.container}>
      <Text style={styles.greeting}>¡Hola, {USER.name.split(" ")[0]}! 🌿</Text>
      
      <View style={styles.statsRow}>
        <Badge variant="outline">
          🌱 {USER.plantsOwned}
        </Badge>
        <Badge variant="outline">
          📸 2 hoy
        </Badge>
        <Badge variant="default">
          🔥 {USER.streak} días
        </Badge>
      </View>
    </View>
  )
}
