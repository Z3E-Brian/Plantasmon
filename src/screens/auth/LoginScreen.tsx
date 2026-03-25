import { useMemo } from "react"
import {
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

export default function LoginScreen() {
  const theme = useAppTheme()
  const insets = useSafeAreaInsets()

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
          <View style={styles.brandBlock}>
            <View style={styles.logoBadge}>
              <Text style={styles.logoEmoji}>🌿</Text>
            </View>
            <Text style={styles.title}>Plantasmon</Text>
            <Text style={styles.subtitle}>Inicia sesión para continuar tu colección</Text>
          </View>

          <View style={styles.formCard}>
            <View style={styles.field}>
              <Text style={styles.label}>Correo electrónico</Text>
              <TextInput
                placeholder="tu@email.com"
                placeholderTextColor={theme.colors.textTertiary}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
                style={styles.input}
              />
            </View>

            <View style={styles.field}>
              <Text style={styles.label}>Contraseña</Text>
              <TextInput
                placeholder="••••••••"
                placeholderTextColor={theme.colors.textTertiary}
                secureTextEntry
                style={styles.input}
              />
            </View>

            <Pressable style={styles.forgotButton}>
              <Text style={styles.forgotText}>¿Olvidaste tu contraseña?</Text>
            </Pressable>

            <Button style={styles.loginButton}>Entrar</Button>

            <View style={styles.registerRow}>
              <Text style={styles.registerText}>¿No tienes cuenta?</Text>
              <Pressable>
                <Text style={styles.registerLink}>Crear cuenta</Text>
              </Pressable>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </ScreenWrapper>
  )
}