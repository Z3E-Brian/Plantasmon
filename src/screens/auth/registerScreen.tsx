import { useRouter } from "expo-router"
import { useMemo, useState } from "react"
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
import { register } from "../../services/authService"
import { createUserDocument } from "../../services/userService"

export default function RegisterScreen() {
  const theme = useAppTheme()
  const insets = useSafeAreaInsets()
  const router = useRouter()

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // ── Validacion local ──
  const validate = (): string | null => {
    if (!email.trim()) return "Por favor ingresa tu correo electronico."
    if (!password) return "Por favor ingresa una contrasena."
    if (password.length < 6) return "La contrasena debe tener al menos 6 caracteres."
    if (password !== confirmPassword) return "Las contrasenas no coinciden."
    return null
  }

  // ── Registro ──
  const handleRegister = async () => {
    const validationError = validate()
    if (validationError) {
      setError(validationError)
      return
    }
    setError(null)
    setLoading(true)
    try {
      const user = await register(email.trim(), password)
      // Crear documento en Firestore con los campos que esperan Home, Profile, etc.
      await createUserDocument(user.uid, email.trim())
      router.replace("/")
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
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
        registerButton: {
          marginTop: theme.spacing.sm,
          minHeight: 46,
          borderRadius: theme.radius.sm,
        },
        loginRow: {
          marginTop: theme.spacing.lg,
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
          gap: theme.spacing.xs,
        },
        loginText: {
          color: theme.colors.textSecondary,
          fontSize: 13,
        },
        loginLink: {
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
            <Text style={styles.subtitle}>Crea tu cuenta y empieza tu coleccion</Text>
          </View>

          <View style={styles.formCard}>

            {/* Error */}
            {error && (
              <View style={styles.errorBox}>
                <Text style={styles.errorText}>{error}</Text>
              </View>
            )}

            {/* Email */}
            <View style={styles.field}>
              <Text style={styles.label}>Correo electronico</Text>
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
                }}
              />
            </View>

            {/* Password */}
            <View style={styles.field}>
              <Text style={styles.label}>Contrasena</Text>
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

            {/* Confirm password */}
            <View style={styles.field}>
              <Text style={styles.label}>Confirmar contrasena</Text>
              <TextInput
                placeholder="••••••••"
                placeholderTextColor={theme.colors.textTertiary}
                secureTextEntry
                style={[styles.input, error && styles.inputError]}
                value={confirmPassword}
                onChangeText={(text) => {
                  setConfirmPassword(text)
                  setError(null)
                }}
              />
            </View>

            {/* Register button */}
            <Button
              style={styles.registerButton}
              onPress={handleRegister}
              disabled={loading}
            >
              {loading
                ? <ActivityIndicator color="#fff" />
                : "Crear cuenta"
              }
            </Button>

            {/* Login link */}
            <View style={styles.loginRow}>
              <Text style={styles.loginText}>¿Ya tienes cuenta?</Text>
              <Pressable onPress={() => router.replace("/login")}>
                <Text style={styles.loginLink}>Iniciar sesion</Text>
              </Pressable>
            </View>

          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </ScreenWrapper>
  )
}
