import { Text, View } from "react-native"
import { useThemedStyles } from "@/src/styles/themedStyles"

const TIP = {
  icon: "💡",
  title: "Tip del día",
  description: "Las fotos con buena iluminación natural mejoran la precisión de identificación hasta un 40%. Intenta fotografiar tus plantas cerca de una ventana o al aire libre.",
}

export function TipCard() {
  const { styles } = useThemedStyles("tipCard")

  return (
    <View style={styles.container}>
      <Text style={styles.icon}>{TIP.icon}</Text>
      <View style={styles.content}>
        <Text style={styles.text}>
          <Text style={styles.bold}>{TIP.title}:</Text> {TIP.description}
        </Text>
      </View>
    </View>
  )
}
