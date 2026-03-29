import { Image } from "expo-image"
import { useFocusEffect, useRouter } from "expo-router"
import { useCallback, useState } from "react"
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import { doc, getDoc } from "firebase/firestore"
import { db } from "@/src/config/firebase"
import { COLORS } from "@/src/constants/theme"
import { CURRENT_USER_ID } from "@/src/services/userService"

interface CompanionData {
  id: string
  nickname: string
  notes: string
  lastWatered: string | null
  lastWeeded: string | null
  firstIdentifiedAt: string | null
  personality: string
  location: string
  favorite: boolean
  commonName: string
  scientificName: string
  difficulty: string
  wateringDays: number
  light: string
  rarity: string
  petFriendly: boolean
}

const PERSONALITY_MAP: Record<string, { emoji: string; label: string; color: string }> = {
  resistente:    { emoji: "💪", label: "Resistente",    color: "#3d9970" },
  delicada:      { emoji: "🌸", label: "Delicada",      color: "#e8839f" },
  dramatica:     { emoji: "🎭", label: "Dramática",     color: "#9b59b6" },
  independiente: { emoji: "😎", label: "Independiente", color: "#2980b9" },
}

const LOCATION_MAP: Record<string, { emoji: string; label: string }> = {
  ventana:     { emoji: "🪟", label: "Ventana"        },
  cochera:     { emoji: "🚗", label: "Cochera"        },
  patio:       { emoji: "🌳", label: "Patio"          },
  patio_pilas: { emoji: "🪣", label: "Patio de pilas" },
  otro:        { emoji: "📍", label: "Otro"           },
}

const DIFFICULTY_MAP: Record<string, { label: string; color: string }> = {
  easy:   { label: "Fácil",    color: COLORS.primary     },
  medium: { label: "Moderada", color: "#e6a817"          },
  hard:   { label: "Difícil",  color: COLORS.destructive },
}

const RARITY_MAP: Record<string, { label: string; color: string }> = {
  common:    { label: "Común",      color: COLORS.mutedForeground },
  uncommon:  { label: "Poco común", color: "#3d9970"              },
  rare:      { label: "Rara",       color: "#2980b9"              },
  epic:      { label: "Épica",      color: "#9b59b6"              },
  legendary: { label: "Legendaria", color: "#e6a817"              },
}

function daysSince(dateStr: string | null): number {
  if (!dateStr) return 0
  return Math.floor((Date.now() - new Date(dateStr).getTime()) / 86400000)
}

function formatDate(dateStr: string | null): string {
  if (!dateStr) return "Sin registrar"
  return new Date(dateStr).toLocaleDateString("es-CR", {
    day: "2-digit", month: "long", year: "numeric",
  })
}

export default function CompanionPlantScreen() {
  const router = useRouter()
  const insets = useSafeAreaInsets()
  const [companion, setCompanion] = useState<CompanionData | null>(null)
  const [loading,   setLoading  ] = useState(true)

  const loadCompanion = useCallback(async () => {
    setLoading(true)
    try {
      const userSnap = await getDoc(doc(db, "users", CURRENT_USER_ID))
      if (!userSnap.exists()) return
      const userData  = userSnap.data()
      const rawPlants: any[] = userData?.subcollections?.userPlants ?? userData?.userPlants ?? []
      const raw = rawPlants.find((p: any) => p.isCompanion) ?? rawPlants[0] ?? null
      if (!raw) return
      const plantSnap = await getDoc(doc(db, "plants", raw.id))
      if (!plantSnap.exists()) return
      const pd = plantSnap.data()
      setCompanion({
        id: raw.id, nickname: raw.nickname ?? "", notes: raw.notes ?? "",
        lastWatered: raw.lastWatered ?? null, lastWeeded: raw.lastWeeded ?? null,
        firstIdentifiedAt: raw.firstIdentifiedAt ?? null,
        personality: raw.personality ?? "", location: raw.location ?? "",
        favorite: raw.favorite ?? false,
        commonName: pd.commonName, scientificName: pd.scientificName,
        difficulty: pd.difficulty, wateringDays: pd.wateringDays,
        light: pd.light, rarity: pd.rarity ?? "common", petFriendly: pd.petFriendly ?? false,
      })
    } finally {
      setLoading(false)
    }
  }, [])

  // Se recarga automáticamente cada vez que esta pantalla recibe foco
  useFocusEffect(useCallback(() => { loadCompanion() }, [loadCompanion]))

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    )
  }

  if (!companion) {
    return (
      <View style={styles.centered}>
        <Text style={styles.emptyText}>No hay planta compañera registrada.</Text>
        <Pressable onPress={() => router.back()} style={styles.backBtn}>
          <Text style={styles.backBtnText}>← Volver</Text>
        </Pressable>
      </View>
    )
  }

  const daysOwned   = daysSince(companion.firstIdentifiedAt)
  const personality = PERSONALITY_MAP[companion.personality]
  const location    = LOCATION_MAP[companion.location]
  const difficulty  = DIFFICULTY_MAP[companion.difficulty]
  const rarity      = RARITY_MAP[companion.rarity] ?? RARITY_MAP.common

  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={[styles.content, { paddingTop: insets.top + 8, paddingBottom: insets.bottom + 32 }]}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.topBar}>
        <Pressable onPress={() => router.back()} style={styles.backPill}>
          <Text style={styles.backPillText}>← Volver</Text>
        </Pressable>
        <Pressable onPress={() => router.push("/editProfile")} style={styles.editPill}>
          <Text style={styles.editPillText}>✏️ Editar</Text>
        </Pressable>
      </View>

      <View style={styles.passport}>
        {/* Foto */}
        <View style={styles.photoSection}>
          <Image source={`https://picsum.photos/seed/${companion.id}/800/600`} style={styles.photo} contentFit="cover" />
          <View style={styles.photoOverlay} />
          <View style={styles.photoContent}>
            <View style={styles.passportBadge}>
              <Text style={styles.passportBadgeText}>🌿 PASAPORTE BOTÁNICO</Text>
            </View>
            <Text style={styles.nickname}>{companion.nickname || companion.commonName}</Text>
            {companion.nickname ? <Text style={styles.speciesOnPhoto}>{companion.commonName}</Text> : null}
          </View>
          <View style={[styles.rarityBadge, { backgroundColor: rarity.color + "22", borderColor: rarity.color + "60" }]}>
            <Text style={[styles.rarityText, { color: rarity.color }]}>{rarity.label}</Text>
          </View>
        </View>

        {/* Cuerpo */}
        <View style={styles.body}>
          <Text style={styles.scientificName}>{companion.scientificName}</Text>

          <View style={styles.daysRow}>
            <View style={styles.daysCard}>
              <Text style={styles.daysValue}>{daysOwned}</Text>
              <Text style={styles.daysLabel}>días juntos</Text>
            </View>
            <View style={styles.daysCard}>
              <Text style={styles.daysValue}>{companion.wateringDays}</Text>
              <Text style={styles.daysLabel}>días entre riegos</Text>
            </View>
            <View style={styles.daysCard}>
              <Text style={styles.daysValue}>{companion.petFriendly ? "✅" : "⚠️"}</Text>
              <Text style={styles.daysLabel}>pet friendly</Text>
            </View>
          </View>

          <PassportDivider />

          {personality && <PassportRow label="Personalidad" value={`${personality.emoji} ${personality.label}`} valueColor={personality.color} />}
          {location    && <PassportRow label="Vive en"      value={`${location.emoji} ${location.label}`} />}
          {difficulty  && <PassportRow label="Cuidado"      value={difficulty.label} valueColor={difficulty.color} />}
          <PassportRow label="Luz" value={companion.light} />

          <PassportDivider />

          <Text style={styles.sectionTitle}>📋 Historial de cuidados</Text>
          <CareRow icon="💧" label="Último riego"     date={formatDate(companion.lastWatered)} />
          <CareRow icon="🌱" label="Último deshierbe" date={formatDate(companion.lastWeeded)}  />
          <CareRow icon="📅" label="Desde"            date={formatDate(companion.firstIdentifiedAt)} />

          {companion.notes ? (
            <>
              <PassportDivider />
              <Text style={styles.sectionTitle}>📝 Notas personales</Text>
              <View style={styles.notesBox}>
                <Text style={styles.notesText}>{companion.notes}</Text>
              </View>
            </>
          ) : null}

          <View style={styles.stamp}>
            <Text style={styles.stampEmoji}>🌿</Text>
            <Text style={styles.stampText}>PLANTASMON</Text>
          </View>
        </View>
      </View>
    </ScrollView>
  )
}

function PassportDivider() {
  return (
    <View style={{ flexDirection: "row", gap: 4, marginVertical: 14, justifyContent: "center" }}>
      {Array.from({ length: 24 }).map((_, i) => (
        <View key={i} style={{ width: 6, height: 1.5, backgroundColor: COLORS.border, borderRadius: 1 }} />
      ))}
    </View>
  )
}

function PassportRow({ label, value, valueColor }: { label: string; value: string; valueColor?: string }) {
  return (
    <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
      <Text style={{ color: COLORS.mutedForeground, fontSize: 13, fontWeight: "500" }}>{label}</Text>
      <Text style={{ color: valueColor ?? COLORS.foreground, fontSize: 13, fontWeight: "700", textTransform: "capitalize" }}>{value}</Text>
    </View>
  )
}

function CareRow({ icon, label, date }: { icon: string; label: string; date: string }) {
  return (
    <View style={{ flexDirection: "row", alignItems: "center", gap: 8, marginBottom: 8 }}>
      <Text style={{ fontSize: 16, width: 22 }}>{icon}</Text>
      <Text style={{ color: COLORS.mutedForeground, fontSize: 13, flex: 1 }}>{label}</Text>
      <Text style={{ color: COLORS.foreground, fontSize: 13, fontWeight: "600" }}>{date}</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  screen:    { flex: 1, backgroundColor: COLORS.background },
  content:   { paddingHorizontal: 16 },
  centered:  { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: COLORS.background, gap: 16 },
  emptyText: { color: COLORS.mutedForeground, fontSize: 15 },
  backBtn:      { marginTop: 12 },
  backBtnText:  { color: COLORS.primary, fontSize: 15 },
  topBar:       { flexDirection: "row", justifyContent: "space-between", marginBottom: 20 },
  backPill:     { backgroundColor: COLORS.card, borderRadius: 20, paddingHorizontal: 14, paddingVertical: 7, borderWidth: 1, borderColor: COLORS.border },
  backPillText: { color: COLORS.foreground, fontSize: 13, fontWeight: "600" },
  editPill:     { backgroundColor: COLORS.primary + "22", borderRadius: 20, paddingHorizontal: 14, paddingVertical: 7, borderWidth: 1, borderColor: COLORS.primary + "50" },
  editPillText: { color: COLORS.primary, fontSize: 13, fontWeight: "600" },
  passport:     { backgroundColor: COLORS.card, borderRadius: 20, borderWidth: 1.5, borderColor: COLORS.primary + "40", overflow: "hidden", elevation: 6 },
  photoSection:      { height: 240 },
  photo:             { width: "100%", height: "100%" },
  photoOverlay:      { ...StyleSheet.absoluteFillObject, backgroundColor: "rgba(0,0,0,0.45)" },
  photoContent:      { ...StyleSheet.absoluteFillObject, justifyContent: "flex-end", padding: 18 },
  passportBadge:     { backgroundColor: COLORS.primary + "33", borderWidth: 1, borderColor: COLORS.primary + "60", borderRadius: 20, paddingHorizontal: 10, paddingVertical: 4, alignSelf: "flex-start", marginBottom: 8 },
  passportBadgeText: { color: COLORS.primary, fontSize: 10, fontWeight: "800", letterSpacing: 1 },
  nickname:          { color: "#fff", fontSize: 28, fontWeight: "900", letterSpacing: -0.5 },
  speciesOnPhoto:    { color: "rgba(255,255,255,0.75)", fontSize: 14, marginTop: 2 },
  rarityBadge:       { position: "absolute", top: 14, right: 14, borderRadius: 20, borderWidth: 1, paddingHorizontal: 10, paddingVertical: 4 },
  rarityText:        { fontSize: 11, fontWeight: "700" },
  body:           { padding: 20 },
  scientificName: { color: COLORS.mutedForeground, fontSize: 14, fontStyle: "italic", textAlign: "center", marginBottom: 16 },
  daysRow:        { flexDirection: "row", justifyContent: "space-around" },
  daysCard:       { alignItems: "center", gap: 2 },
  daysValue:      { color: COLORS.foreground, fontSize: 22, fontWeight: "800" },
  daysLabel:      { color: COLORS.mutedForeground, fontSize: 10, textAlign: "center" },
  sectionTitle:   { color: COLORS.foreground, fontSize: 13, fontWeight: "700", marginBottom: 10, textTransform: "uppercase", letterSpacing: 0.5 },
  notesBox:       { backgroundColor: COLORS.background, borderRadius: 10, padding: 12, borderWidth: 1, borderColor: COLORS.border },
  notesText:      { color: COLORS.foreground, fontSize: 14, lineHeight: 20 },
  stamp:          { alignItems: "center", marginTop: 24, opacity: 0.25, gap: 2 },
  stampEmoji:     { fontSize: 32 },
  stampText:      { color: COLORS.foreground, fontSize: 10, fontWeight: "900", letterSpacing: 3 },
})
