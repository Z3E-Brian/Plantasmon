import { BottomNav } from "@/src/components/profile/BottomNav"
import { onAuthChange } from "@/src/services/authService"
import { Stack, usePathname, useRouter, useSegments } from "expo-router"
import { User } from "firebase/auth"
import { useEffect, useState } from "react"
import { ActivityIndicator, View } from "react-native"
import Toast from "react-native-toast-message"

export default function RootLayout() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const segments = useSegments()
  const pathname = usePathname()
  const showNav = user && pathname !== "/login" && pathname !== "/camera"

  useEffect(() => {
    const unsubscribe = onAuthChange((firebaseUser) => {
      setUser(firebaseUser)
      setLoading(false)
    })
    return unsubscribe
  }, [])

  useEffect(() => {
    if (loading) return
    const inLoginScreen = segments[0] === "login"
    if (!user && !inLoginScreen) {
      router.replace("/login")
    } else if (user && inLoginScreen) {
      router.replace("/")
    }
  }, [user, loading, segments])

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    )
  }

  return (
    <View style={{ flex: 1 }}>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="camera" />
        <Stack.Screen name="explore" />
        <Stack.Screen name="identify" />
        <Stack.Screen name="journal" />
        <Stack.Screen name="profile" />
        <Stack.Screen name="login" />
        <Stack.Screen name="editProfile" />
        <Stack.Screen name="companionPlant" options={{ headerShown: false }} />
      </Stack>
      {showNav && <BottomNav />}
      <Toast />
    </View>
  )
}