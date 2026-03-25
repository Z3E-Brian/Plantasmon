import { useState } from "react"
import {
  ActivityIndicator,
  Modal,
  Pressable,
  Text,
  TextInput,
  View,
} from "react-native"
import { updateUserBio } from "@/src/services/userService"
import { useThemedStyles } from "@/src/styles/themedStyles"

interface ProfileAboutProps {
  bio: string
  location: string
  streak: number
  careScore: number
  rarestFind: string
  achievements: number
  totalAchievements: number
  // Callback para que UserProfile actualice su estado local
  onBioUpdated?: (newBio: string) => void
}

export function ProfileAbout({
  bio,
  location,
  streak,
  careScore,
  rarestFind,
  achievements,
  totalAchievements,
  onBioUpdated,
}: ProfileAboutProps) {
  const { theme, styles } = useThemedStyles("profileAbout")
  const [modalVisible, setModalVisible] = useState(false)
  const [draftBio, setDraftBio] = useState(bio)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const openModal = () => {
    setDraftBio(bio)   // resetear al valor actual
    setError(null)
    setModalVisible(true)
  }

  const handleSave = async () => {
    if (draftBio.trim() === bio) {
      setModalVisible(false)
      return
    }
    setSaving(true)
    setError(null)
    try {
      await updateUserBio(undefined, { bio: draftBio.trim() })
      onBioUpdated?.(draftBio.trim())
      setModalVisible(false)
    } catch (e) {
      setError("No se pudo guardar. Intenta de nuevo.")
    } finally {
      setSaving(false)
    }
  }

  return (
    <View style={styles.container}>
      {/* Section header */}
      <View style={styles.header}>
        <Text style={styles.title}>ABOUT ME</Text>
        <Pressable style={styles.editButton} onPress={openModal}>
          <Text style={{ fontSize: 12, color: theme.colors.primary }}>✏️</Text>
          <Text style={styles.editText}>Edit</Text>
        </Pressable>
      </View>

      <Text style={styles.bio}>{bio}</Text>

      {/* Location chip */}
      <View style={styles.chips}>
        <View style={styles.chip}>
          <Text style={styles.chipEmoji}>📍</Text>
          <Text style={styles.chipText}>{location}</Text>
        </View>
      </View>

      <View style={styles.divider} />

      {/* Quick stats grid */}
      <View style={styles.statsGrid}>
        <QuickStat icon="streak" title="ID Streak"    value={`${streak} days`}                    subtitle="Keep it going!"        />
        <QuickStat icon="care"   title="Care Score"   value={`${careScore}%`}                     subtitle="Excellent caretaker"   />
        <QuickStat icon="rare"   title="Rarest Find"  value={rarestFind}                          subtitle="Ultra rare species"    />
        <QuickStat icon="badges" title="Badges"       value={`${achievements}/${totalAchievements}`} subtitle="Keep collecting!"  />
      </View>

      {/* ─── Edit Bio Modal ─── */}
      <Modal
        visible={modalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setModalVisible(false)}
      >
        <Pressable
          style={{
            flex: 1,
            backgroundColor: "rgba(0,0,0,0.6)",
            justifyContent: "center",
            alignItems: "center",
            padding: 24,
          }}
          onPress={() => setModalVisible(false)}
        >
          {/* Contenedor del modal — stopPropagation para no cerrar al tocar adentro */}
          <Pressable
            onPress={(e) => e.stopPropagation()}
            style={{
              width: "100%",
              backgroundColor: theme.colors.surface,
              borderRadius: 16,
              padding: 20,
              gap: 16,
            }}
          >
            {/* Header modal */}
            <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
              <Text style={{ fontSize: 16, fontWeight: "700", color: theme.colors.textPrimary }}>
                Edit Bio
              </Text>
              <Pressable onPress={() => setModalVisible(false)}>
                <Text style={{ fontSize: 18, color: theme.colors.textTertiary }}>✕</Text>
              </Pressable>
            </View>

            {/* TextInput */}
            <TextInput
              value={draftBio}
              onChangeText={setDraftBio}
              multiline
              maxLength={200}
              placeholder="Tell the world about yourself 🌿"
              placeholderTextColor={theme.colors.textTertiary}
              style={{
                borderWidth: 1,
                borderColor: theme.colors.border,
                borderRadius: 10,
                padding: 12,
                color: theme.colors.textPrimary,
                fontSize: 14,
                minHeight: 100,
                textAlignVertical: "top",
              }}
            />

            {/* Contador de caracteres */}
            <Text style={{ fontSize: 11, color: theme.colors.textTertiary, textAlign: "right", marginTop: -8 }}>
              {draftBio.length}/200
            </Text>

            {/* Error */}
            {error && (
              <Text style={{ fontSize: 12, color: "red" }}>{error}</Text>
            )}

            {/* Botones */}
            <View style={{ flexDirection: "row", gap: 10 }}>
              <Pressable
                onPress={() => setModalVisible(false)}
                style={{
                  flex: 1,
                  padding: 12,
                  borderRadius: 10,
                  borderWidth: 1,
                  borderColor: theme.colors.border,
                  alignItems: "center",
                }}
              >
                <Text style={{ color: theme.colors.textSecondary, fontWeight: "600" }}>Cancel</Text>
              </Pressable>

              <Pressable
                onPress={handleSave}
                disabled={saving}
                style={{
                  flex: 1,
                  padding: 12,
                  borderRadius: 10,
                  backgroundColor: theme.colors.primary,
                  alignItems: "center",
                }}
              >
                {saving
                  ? <ActivityIndicator size="small" color="#fff" />
                  : <Text style={{ color: "#fff", fontWeight: "700" }}>Save</Text>
                }
              </Pressable>
            </View>
          </Pressable>
        </Pressable>
      </Modal>
    </View>
  )
}

function QuickStat({ icon, title, value, subtitle }: {
  icon: string
  title: string
  value: string
  subtitle: string
}) {
  const { styles } = useThemedStyles("profileAbout")
  return (
    <View style={styles.statCard}>
      <View style={styles.statIconContainer}>
        <Text style={styles.statEmoji}>
          {icon === "streak" ? "🌿" : icon === "care" ? "💧" : icon === "rare" ? "☀️" : "🏅"}
        </Text>
      </View>
      <View style={styles.statInfo}>
        <Text style={styles.statTitle}>{title}</Text>
        <Text style={styles.statValue}>{value}</Text>
        <Text style={styles.statSubtitle}>{subtitle}</Text>
      </View>
    </View>
  )
}
