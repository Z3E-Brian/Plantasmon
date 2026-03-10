import { Text, View } from "react-native"
import { useThemedStyles } from "@/src/styles/themedStyles"
import { DAILY_TIP } from "@/src/constants/data"

export function TipCard() {
  const { styles } = useThemedStyles("tipCard")

  return (
    <View style={styles.container}>
      <Text style={styles.icon}>{DAILY_TIP.icon}</Text>
      <View style={styles.content}>
        <Text style={styles.text}>
          <Text style={styles.bold}>{DAILY_TIP.title}:</Text> {DAILY_TIP.description}
        </Text>
      </View>
    </View>
  )
}
