import * as Google from "expo-auth-session/providers/google"
import { useRouter } from "expo-router"
import { useEffect, useMemo, useState } from "react"
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native"
import { useSafeAreaInsets } from "react-native-safe-area-context"

import ScreenWrapper from "@/src/components/screenWrapper/ScreenWrapper"
import { Button } from "@/src/components/ui/button"
import { useAppTheme } from "@/src/constants/designSystem"
import { login, resetPassword } from "../../services/authService"

export default function LoginScreen() {
  const theme = useAppTheme()
  const insets = useSafeAreaInsets()
  const router = useRouter()

  // ── Estado del formulario ──
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [googleLoading, setGoogleLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [resetSent, setResetSent] = useState(false)

  // ── Google Auth ──
  const [request, response, promptAsync] = Google.useIdTokenAuthRequest({
    androidClientId: "675783066748-t4sb8dm8rotuu5g0q07c9tahk4kdl0jj.apps.googleusercontent.com",
  })

  useEffect(() => {
    if (!response) return
    if (response.type === "success") {
      const { id_token } = response.params
      handleGoogleToken(id_token)
    } else if (response.type === "error") {
      setError("Error al autenticar con Google.")
      setGoogleLoading(false)
    } else {
      // cancel u otro caso
      setGoogleLoading(false)
    }
  }, [response])

  const handleGoogleToken = async (idToken: string) => {
    setGoogleLoading(true)
    setError(null)
    try {
      // TODO: Implement loginWithGoogle or handle Google login here
      throw new Error("loginWithGoogle no está implementado.")
      // el observer del _layout redirige automáticamente
    } catch (err: any) {
      setError(err.message ?? "Error al iniciar sesión con Google.")
    } finally {
      setGoogleLoading(false)
    }
  }

  const handleGooglePress = () => {
    setError(null)
    setGoogleLoading(true)
    promptAsync().catch((e) => {
      console.error("Error al iniciar sesión con Google:", e)
      setGoogleLoading(false)
    })
  }

  // ── Login email/password ──
  const handleLogin = async () => {
    if (!email.trim() || !password.trim()) {
      setError("Por favor completa todos los campos.")
      return
    }
    setError(null)
    setLoading(true)
    try {
      await login(email.trim(), password)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  // ── Recuperar contraseña ──
  const handleForgotPassword = async () => {
    if (!email.trim()) {
      setError("Ingresa tu correo para recuperar la contraseña.")
      return
    }
    setError(null)
    try {
      await resetPassword(email.trim())
      setResetSent(true)
    } catch (err: any) {
      setError(err.message)
    }
  }

  const styles = useMemo(
    () =>
      StyleSheet.create({
        container: {
          flex: 1,
          backgroundColor: theme.colors.background,
        },
        content: {
          flexGrow: 1,
          justifyContent: "center",
          paddingHorizontal: 20,
          paddingTop: insets.top + theme.spacing.lg,
          paddingBottom: theme.spacing.xl,
        },
        brandBlock: {
          alignItems: "center",
          marginBottom: theme.spacing.xl,
        },
        logoBadge: {
          width: 64,
          height: 64,
          borderRadius: 32,
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: theme.colors.primarySoft,
          marginBottom: theme.spacing.md,
          borderWidth: 1,
          borderColor: theme.colors.border,
        },
        logoEmoji: {
          fontSize: 30,
        },
        title: {
          fontSize: 30,
          fontWeight: "800",
          color: theme.colors.textPrimary,
          marginBottom: theme.spacing.xs,
        },
        subtitle: {
          fontSize: 14,
          color: theme.colors.textSecondary,
          textAlign: "center",
        },
        formCard: {
          backgroundColor: theme.colors.surface,
          borderRadius: theme.radius.lg,
          borderWidth: 1,
          borderColor: theme.colors.border,
          padding: theme.spacing.lg,
          gap: theme.spacing.md,
        },
        field: {
          gap: theme.spacing.sm,
        },
        label: {
          fontSize: 13,
          fontWeight: "700",
          color: theme.colors.textPrimary,
        },
        input: {
          height: 46,
          borderRadius: theme.radius.sm,
          borderWidth: 1,
          borderColor: theme.colors.border,
          backgroundColor: theme.colors.surfaceMuted,
          color: theme.colors.textPrimary,
          paddingHorizontal: theme.spacing.md,
          fontSize: 14,
        },
        inputError: {
          borderColor: "#ef4444",
        },
        errorBox: {
          backgroundColor: "rgba(239, 68, 68, 0.1)",
          borderRadius: theme.radius.sm,
          borderWidth: 1,
          borderColor: "rgba(239, 68, 68, 0.3)",
          padding: theme.spacing.sm,
        },
        errorText: {
          color: "#ef4444",
          fontSize: 13,
          textAlign: "center",
        },
        successBox: {
          backgroundColor: "rgba(64, 145, 108, 0.1)",
          borderRadius: theme.radius.sm,
          borderWidth: 1,
          borderColor: "rgba(64, 145, 108, 0.3)",
          padding: theme.spacing.sm,
        },
        successText: {
          color: "#40916c",
          fontSize: 13,
          textAlign: "center",
        },
        forgotButton: {
          alignSelf: "flex-end",
        },
        forgotText: {
          color: theme.colors.primary,
          fontWeight: "700",
          fontSize: 13,
        },
        loginButton: {
          marginTop: theme.spacing.sm,
          minHeight: 46,
          borderRadius: theme.radius.sm,
        },
        // ── Divisor "o continúa con" ──
        dividerRow: {
          flexDirection: "row",
          alignItems: "center",
          gap: theme.spacing.sm,
          marginVertical: theme.spacing.xs,
        },
        dividerLine: {
          flex: 1,
          height: 1,
          backgroundColor: theme.colors.border,
        },
        dividerText: {
          fontSize: 12,
          color: theme.colors.textTertiary,
          fontWeight: "600",
        },
        // ── Botón Google ──
        googleButton: {
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
          gap: theme.spacing.sm,
          height: 46,
          borderRadius: theme.radius.sm,
          borderWidth: 1,
          borderColor: theme.colors.border,
          backgroundColor: theme.colors.surfaceMuted,
        },
        googleButtonDisabled: {
          opacity: 0.6,
        },
        googleLogo: {
          fontSize: 18,
        },
        googleText: {
          fontSize: 14,
          fontWeight: "700",
          color: theme.colors.textPrimary,
        },
        registerRow: {
          marginTop: theme.spacing.lg,
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
          gap: theme.spacing.xs,
        },
        registerText: {
          color: theme.colors.textSecondary,
          fontSize: 13,
        },
        registerLink: {
          color: theme.colors.primary,
          fontSize: 13,
          fontWeight: "700",
        },
      }),
    [theme, insets.top]
  )

  return (
    <ScreenWrapper>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView
          style={styles.container}
          contentContainerStyle={styles.content}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Brand */}
          <View style={styles.brandBlock}>
            <View style={styles.logoBadge}>
              <Text style={styles.logoEmoji}>🌿</Text>
            </View>
            <Text style={styles.title}>Plantasmon</Text>
            <Text style={styles.subtitle}>Inicia sesión para continuar tu colección</Text>
          </View>

          <View style={styles.formCard}>

            {/* Error */}
            {error && (
              <View style={styles.errorBox}>
                <Text style={styles.errorText}>{error}</Text>
              </View>
            )}

            {/* Reset enviado */}
            {resetSent && (
              <View style={styles.successBox}>
                <Text style={styles.successText}>
                  ✅ Te enviamos un correo para recuperar tu contraseña.
                </Text>
              </View>
            )}

            {/* Email */}
            <View style={styles.field}>
              <Text style={styles.label}>Correo electrónico</Text>
              <TextInput
                placeholder="tu@email.com"
                placeholderTextColor={theme.colors.textTertiary}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
                style={[styles.input, error && styles.inputError]}
                value={email}
                onChangeText={(text) => {
                  setEmail(text)
                  setError(null)
                  setResetSent(false)
                }}
              />
            </View>

            {/* Password */}
            <View style={styles.field}>
              <Text style={styles.label}>Contraseña</Text>
              <TextInput
                placeholder="••••••••"
                placeholderTextColor={theme.colors.textTertiary}
                secureTextEntry
                style={[styles.input, error && styles.inputError]}
                value={password}
                onChangeText={(text) => {
                  setPassword(text)
                  setError(null)
                }}
              />
            </View>

            {/* Forgot password */}
            <Pressable style={styles.forgotButton} onPress={handleForgotPassword}>
              <Text style={styles.forgotText}>¿Olvidaste tu contraseña?</Text>
            </Pressable>

            {/* Login button */}
            <Button
              style={styles.loginButton}
              onPress={handleLogin}
              disabled={loading || googleLoading}
            >
              {loading
                ? <ActivityIndicator color="#fff" />
                : "Entrar"
              }
            </Button>

            {/* Divisor */}
            <View style={styles.dividerRow}>
              <View style={styles.dividerLine} />
              <Text style={styles.dividerText}>o continúa con</Text>
              <View style={styles.dividerLine} />
            </View>

            {/* Botón Google */}
            <Pressable
              style={[styles.googleButton, (googleLoading || !request) && styles.googleButtonDisabled]}
              onPress={handleGooglePress}
              disabled={googleLoading || !request}
            >
              {googleLoading ? (
                <ActivityIndicator size="small" color={theme.colors.textPrimary} />
              ) : (
                <>
                  <Text style={styles.googleLogo}>G</Text>
                  <Text style={styles.googleText}>Continuar con Google</Text>
                </>
              )}
            </Pressable>

            {/* Register link */}
            <View style={styles.registerRow}>
              <Text style={styles.registerText}>¿No tienes cuenta?</Text>
              <Pressable onPress={() => { /* router.push("/auth/register") */ }}>
                <Text style={styles.registerLink}>Crear cuenta</Text>
              </Pressable>
            </View>

          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </ScreenWrapper>
  )
}