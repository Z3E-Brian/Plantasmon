import { BottomNav } from "@/src/components/profile/BottomNav"
import { SyncStatusIndicator } from "@/src/components/SyncStatusIndicator"
import { onAuthChange } from "@/src/services/authService"
import { seedAchievements } from "@/src/services/userAchievementsService"
import { seedMissions } from "@/src/services/missionService"
import { seedObtenibles } from "@/src/services/obteniblesService"
import { setupAutoSync } from "@/src/services/syncService"
import { Stack, usePathname, useRouter } from "expo-router"
import { User } from "firebase/auth"
import { useEffect, useState } from "react"
import { ActivityIndicator, View } from "react-native"
import { SafeAreaProvider } from "react-native-safe-area-context"
import Toast from "react-native-toast-message"

export default function RootLayout() {
  const [user, setUser] = useState<User | null>(null)
  const [initialized, setInitialized] = useState(false)
  const router = useRouter()
  const pathname = usePathname()
  const showNav = user && pathname !== "/login" && pathname !== "/register" && pathname !== "/camera"

  useEffect(() => {
    const unsubscribe = onAuthChange((firebaseUser) => {
      console.log("[Auth] onAuthChange ->", firebaseUser?.uid ?? "null")
      setUser(firebaseUser)
      setInitialized(true)
    })
    return unsubscribe
  }, [])

  useEffect(() => {
    if (!initialized) return
    console.log("[Auth] Redirect effect: user=", user?.uid ?? "null", "path=", pathname)
    if (!user && pathname !== "/login" && pathname !== "/register") {
      console.log("[Auth] -> redirect to /login")
      router.replace("/login")
    } else if (user && pathname === "/login") {
      console.log("[Auth] -> redirect to /")
      router.replace("/")
    }
  }, [user, initialized, pathname])

  useEffect(() => {
    if (!user) return
    const unsubscribe = setupAutoSync(
      process.env.EXPO_PUBLIC_API_URL || "https://plantasmon.onrender.com"
    )
    seedAchievements()
    seedMissions()
    seedObtenibles()
    return unsubscribe
  }, [user])

  if (!initialized) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    )
  }

  return (
    <SafeAreaProvider>
    <View style={{ flex: 1 }}>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="camera" />
        <Stack.Screen name="calendar" />
        <Stack.Screen name="explore" />
        <Stack.Screen name="identify" />
        <Stack.Screen name="journal" />
        <Stack.Screen name="profile" />
        <Stack.Screen name="login" />
        <Stack.Screen name="register" />
        <Stack.Screen name="editProfile" />
        <Stack.Screen name="companionPlant" options={{ headerShown: false }} />
      </Stack>
      {showNav && (
        <View style={{ paddingHorizontal: 16, paddingBottom: 8 }}>
          <SyncStatusIndicator />
        </View>
      )}
      {showNav && <BottomNav />}
      <Toast />
    </View>
    </SafeAreaProvider>
  )
}
