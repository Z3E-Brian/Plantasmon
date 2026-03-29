import ScreenWrapper from "@/src/components/screenWrapper/ScreenWrapper"
import { db } from "@/src/config/firebase"
import { CURRENT_USER_ID } from "@/src/services/userService"
import { useThemedStyles } from "@/src/styles/themedStyles"
import { zodResolver } from "@hookform/resolvers/zod"
import { doc, getDoc, updateDoc } from "firebase/firestore"
import { useState } from "react"
import { Controller, useForm } from "react-hook-form"
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import { z } from "zod"

// ─── Schema ───────────────────────────────────────────────────────────────────

const seedSchema = z.object({
  plantId: z
    .string()
    .min(1, "El ID de la planta es obligatorio")
    .regex(/^[a-zA-Z0-9_-]+$/, "Solo letras, números, guiones y guiones bajos"),
  nickname: z
    .string()
    .max(40, "Máximo 40 caracteres")
    .optional(),
  notes: z
    .string()
    .max(200, "Máximo 200 caracteres")
    .optional(),
})

type SeedFormData = z.infer<typeof seedSchema>

const KNOWN_PLANT_IDS = [
  { id: "pl_001", label: "🌿 Monstera Deliciosa" },
  { id: "pl_002", label: "🌵 Cactus" },
  { id: "pl_003", label: "🌸 Orquídea" },
  { id: "pl_004", label: "🪴 Pothos" },
  { id: "pl_005", label: "🌱 Suculenta" },
]

// ─── Screen ───────────────────────────────────────────────────────────────────

export default function Identify() {
  const insets = useSafeAreaInsets()
  const { theme, styles: s } = useThemedStyles("identify")

  const [saving,   setSaving  ] = useState(false)
  const [preview,  setPreview ] = useState<string | null>(null)
  const [checking, setChecking] = useState(false)
  const [previewOk, setPreviewOk] = useState(false)

  const {
    control,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<SeedFormData>({
    resolver: zodResolver(seedSchema),
    mode: "onBlur",
    defaultValues: { plantId: "", nickname: "", notes: "" },
  })

  const plantIdValue = watch("plantId")

  // ── Verificar si el doc existe en plants/ ─────────────────────────────────
  const checkPlant = async () => {
    if (!plantIdValue) return
    setChecking(true)
    try {
      const snap = await getDoc(doc(db, "plants", plantIdValue))
      if (snap.exists()) {
        const data = snap.data()
        setPreview(`✅ Encontrada: ${data.commonName} (${data.scientificName})`)
        setPreviewOk(true)
      } else {
        setPreview(`❌ No existe ninguna planta con ID "${plantIdValue}"`)
        setPreviewOk(false)
      }
    } catch {
      setPreview("⚠️ Error al verificar. Revisá tu conexión.")
      setPreviewOk(false)
    } finally {
      setChecking(false)
    }
  }

  // ── Agregar planta al perfil ───────────────────────────────────────────────
  const onSubmit = async (data: SeedFormData) => {
    setSaving(true)
    try {
      const plantSnap = await getDoc(doc(db, "plants", data.plantId))
      if (!plantSnap.exists()) {
        Alert.alert("Error", `No existe una planta con ID "${data.plantId}" en Firebase.`)
        return
      }

      const userRef  = doc(db, "users", CURRENT_USER_ID)
      const userSnap = await getDoc(userRef)
      if (!userSnap.exists()) {
        Alert.alert("Error", "Usuario no encontrado.")
        return
      }

      const userData = userSnap.data()
      const isNested = !!userData.subcollections?.userPlants
      const current: any[] = isNested
        ? userData.subcollections.userPlants
        : userData.userPlants ?? []

      if (current.some((p: any) => p.id === data.plantId)) {
        Alert.alert("Ya existe", "Esta planta ya está en tu colección.")
        return
      }

      const newPlant = {
        id:                data.plantId,
        nickname:          data.nickname  ?? "",
        notes:             data.notes     ?? "",
        favorite:          false,
        lastWatered:       null,
        lastWeeded:        null,
        firstIdentifiedAt: new Date().toISOString(),
        lastIdentifiedAt:  new Date().toISOString(),
      }

      const updated   = [...current, newPlant]
      const fieldPath = isNested ? "subcollections.userPlants" : "userPlants"
      await updateDoc(userRef, { [fieldPath]: updated })

      Alert.alert("¡Listo! 🌿", `${plantSnap.data().commonName} fue agregada a tu colección.`)
      reset()
      setPreview(null)
    } catch (e) {
      Alert.alert("Error", "No se pudo agregar la planta. Revisá la consola.")
      console.error(e)
    } finally {
      setSaving(false)
    }
  }

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <ScreenWrapper>
      <ScrollView
        contentContainerStyle={[
          s.content,
          { paddingTop: insets.top + 16, paddingBottom: insets.bottom + 40 },
        ]}
        showsVerticalScrollIndicator={false}
      >
        {/* Badge DEV */}
        <View style={s.devBadge}>
          <Text style={s.devBadgeText}>🛠 MODO DEV — Agregar planta de prueba</Text>
        </View>

        <Text style={s.title}>📷 Identificar</Text>
        <Text style={s.subtitle}>
          Esta pantalla es provisional para agregar plantas a tu perfil sin la cámara.
        </Text>

        {/* Atajos */}
        <Text style={s.label}>Plantas disponibles (atajo rápido)</Text>
        <View style={s.shortcuts}>
          {KNOWN_PLANT_IDS.map((p) => (
            <TouchableOpacity
              key={p.id}
              style={[s.shortcut, plantIdValue === p.id && s.shortcutSelected]}
              onPress={() => { setValue("plantId", p.id); setPreview(null) }}
            >
              <Text style={[s.shortcutText, plantIdValue === p.id && s.shortcutTextSelected]}>
                {p.label}
              </Text>
              <Text style={s.shortcutId}>{p.id}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Plant ID */}
        <Text style={s.label}>ID de planta *</Text>
        <Controller
          control={control}
          name="plantId"
          render={({ field: { value, onChange, onBlur } }) => (
            <View>
              <View style={s.idRow}>
                <TextInput
                  style={[s.input, s.idInput, errors.plantId && s.inputError]}
                  value={value}
                  onChangeText={(t) => { onChange(t); setPreview(null) }}
                  onBlur={onBlur}
                  placeholder="ej: pl_002"
                  placeholderTextColor={theme.colors.textTertiary}
                  autoCapitalize="none"
                  autoCorrect={false}
                />
                <TouchableOpacity
                  style={[s.checkBtn, (checking || !value) && s.checkBtnDisabled]}
                  onPress={checkPlant}
                  disabled={checking || !value}
                >
                  {checking
                    ? <ActivityIndicator size="small" color={theme.colors.primaryForeground} />
                    : <Text style={s.checkBtnText}>Verificar</Text>
                  }
                </TouchableOpacity>
              </View>
              {errors.plantId && (
                <Text style={s.errorText}>{errors.plantId.message}</Text>
              )}
              {preview && (
                <Text style={[s.preview, previewOk ? s.previewOk : s.previewErr]}>
                  {preview}
                </Text>
              )}
            </View>
          )}
        />

        {/* Apodo */}
        <Text style={s.label}>Apodo (opcional)</Text>
        <Controller
          control={control}
          name="nickname"
          render={({ field: { value, onChange, onBlur } }) => (
            <View>
              <TextInput
                style={[s.input, errors.nickname && s.inputError]}
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                placeholder="ej: Monsti"
                placeholderTextColor={theme.colors.textTertiary}
              />
              {errors.nickname && (
                <Text style={s.errorText}>{errors.nickname.message}</Text>
              )}
            </View>
          )}
        />

        {/* Notas */}
        <Text style={s.label}>Notas (opcional)</Text>
        <Controller
          control={control}
          name="notes"
          render={({ field: { value, onChange, onBlur } }) => (
            <View>
              <TextInput
                style={[s.input, s.textarea, errors.notes && s.inputError]}
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                placeholder="Observaciones iniciales..."
                placeholderTextColor={theme.colors.textTertiary}
                multiline
                numberOfLines={3}
              />
              {errors.notes && (
                <Text style={s.errorText}>{errors.notes.message}</Text>
              )}
            </View>
          )}
        />

        {/* Submit */}
        <TouchableOpacity
          style={[s.submitBtn, saving && s.submitBtnDisabled]}
          onPress={handleSubmit(onSubmit)}
          disabled={saving}
        >
          {saving
            ? <ActivityIndicator color={theme.colors.primaryForeground} />
            : <Text style={s.submitBtnText}>🌿 Agregar al perfil</Text>
          }
        </TouchableOpacity>

        <Text style={s.hint}>
          💡 Tip: los IDs deben existir en la colección{" "}
          <Text style={s.hintBold}>plants/</Text> de Firebase.{"\n"}
          Podés crear nuevos docs ahí con cualquier ID.
        </Text>
      </ScrollView>
    </ScreenWrapper>
  )
}
