import { useAppTheme } from "@/src/constants/designSystem"
import { useCalendar } from "@/src/hooks/useCalendar"
import {
    CalendarEvent,
    CalendarEventType,
    CreateCalendarEventInput,
    EVENT_TYPE_LABELS,
    getEventEmoji,
} from "@/src/services/calendarService"
import { useFocusEffect } from "expo-router"
import { useCallback, useState } from "react"
import {
    ActivityIndicator,
    Alert,
    Modal,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    View,
} from "react-native"
import { Calendar, LocaleConfig } from "react-native-calendars"

// ─── Locale español ───────────────────────────────────────────────────────────
LocaleConfig.locales["es"] = {
  monthNames: [
    "Enero","Febrero","Marzo","Abril","Mayo","Junio",
    "Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre",
  ],
  monthNamesShort: ["Ene","Feb","Mar","Abr","May","Jun","Jul","Ago","Sep","Oct","Nov","Dic"],
  dayNames: ["Domingo","Lunes","Martes","Miércoles","Jueves","Viernes","Sábado"],
  dayNamesShort: ["Dom","Lun","Mar","Mié","Jue","Vie","Sáb"],
  today: "Hoy",
}
LocaleConfig.defaultLocale = "es"

// ─── Tipos de evento ──────────────────────────────────────────────────────────
const EVENT_TYPES: CalendarEventType[] = [
  "watering","weeding","fertilizing","repotting","custom",
]

// ─── Modal para crear/editar evento ──────────────────────────────────────────
function EventModal({
  visible,
  initialDate,
  eventToEdit,
  onSave,
  onDelete,
  onClose,
}: {
  visible: boolean
  initialDate: string
  eventToEdit: CalendarEvent | null
  onSave: (input: CreateCalendarEventInput) => Promise<void>
  onDelete: (id: string) => Promise<void>
  onClose: () => void
}) {
  const theme = useAppTheme()
  const s = modalStyles(theme)

  const [title, setTitle]   = useState(eventToEdit?.title ?? "")
  const [type, setType]     = useState<CalendarEventType>(eventToEdit?.type ?? "custom")
  const [date, setDate]     = useState(eventToEdit?.date ?? initialDate)
  const [time, setTime]     = useState(eventToEdit?.time ?? "")
  const [notes, setNotes]   = useState(eventToEdit?.notes ?? "")
  const [saving, setSaving] = useState(false)

  // Reset cuando cambia el evento a editar
  useState(() => {
    setTitle(eventToEdit?.title ?? "")
    setType(eventToEdit?.type ?? "custom")
    setDate(eventToEdit?.date ?? initialDate)
    setTime(eventToEdit?.time ?? "")
    setNotes(eventToEdit?.notes ?? "")
  })

  const handleSave = async () => {
    if (!title.trim()) {
      Alert.alert("Falta el título", "Escribí un título para el evento.")
      return
    }
    setSaving(true)
    try {
      await onSave({ title: title.trim(), type, date, time: time || undefined, notes: notes || undefined })
      onClose()
    } catch {
      Alert.alert("Error", "No se pudo guardar el evento.")
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = () => {
    if (!eventToEdit) return
    Alert.alert("Eliminar evento", "¿Seguro que querés eliminar este evento?", [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Eliminar",
        style: "destructive",
        onPress: async () => {
          await onDelete(eventToEdit.id)
          onClose()
        },
      },
    ])
  }

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <Pressable style={s.backdrop} onPress={onClose} />
      <View style={s.sheet}>
        <View style={s.handle} />
        <Text style={s.sheetTitle}>
          {eventToEdit ? "Editar evento" : "Nuevo evento"}
        </Text>

        {/* Tipo */}
        <Text style={s.label}>Tipo</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 14 }}>
          <View style={{ flexDirection: "row", gap: 8 }}>
            {EVENT_TYPES.map((t) => (
              <Pressable
                key={t}
                style={[s.typeChip, type === t && { backgroundColor: theme.colors.primary }]}
                onPress={() => setType(t)}
              >
                <Text style={{ fontSize: 14 }}>{getEventEmoji(t)}</Text>
                <Text style={[s.typeLabel, type === t && { color: "#fff" }]}>
                  {EVENT_TYPE_LABELS[t]}
                </Text>
              </Pressable>
            ))}
          </View>
        </ScrollView>

        {/* Título */}
        <Text style={s.label}>Título</Text>
        <TextInput
          style={s.input}
          value={title}
          onChangeText={setTitle}
          placeholder="Ej: Regar monstera..."
          placeholderTextColor={theme.colors.textTertiary}
        />

        {/* Fecha */}
        <Text style={s.label}>Fecha (AAAA-MM-DD)</Text>
        <TextInput
          style={s.input}
          value={date}
          onChangeText={setDate}
          placeholder="2025-06-01"
          placeholderTextColor={theme.colors.textTertiary}
          keyboardType="numeric"
        />

        {/* Hora (opcional) */}
        <Text style={s.label}>Hora (opcional, HH:MM)</Text>
        <TextInput
          style={s.input}
          value={time}
          onChangeText={setTime}
          placeholder="08:00"
          placeholderTextColor={theme.colors.textTertiary}
          keyboardType="numeric"
        />

        {/* Notas */}
        <Text style={s.label}>Notas (opcional)</Text>
        <TextInput
          style={[s.input, { height: 72, textAlignVertical: "top" }]}
          value={notes}
          onChangeText={setNotes}
          placeholder="Detalles adicionales..."
          placeholderTextColor={theme.colors.textTertiary}
          multiline
        />

        <View style={{ flexDirection: "row", gap: 10, marginTop: 4 }}>
          {eventToEdit && (
            <Pressable style={[s.btn, s.deleteBtn]} onPress={handleDelete}>
              <Text style={[s.btnText, { color: "#ef4444" }]}>Eliminar</Text>
            </Pressable>
          )}
          <Pressable style={[s.btn, s.saveBtn, { flex: 1 }]} onPress={handleSave} disabled={saving}>
            {saving
              ? <ActivityIndicator size="small" color="#fff" />
              : <Text style={[s.btnText, { color: "#fff" }]}>Guardar</Text>
            }
          </Pressable>
        </View>
      </View>
    </Modal>
  )
}

// ─── Componente principal ─────────────────────────────────────────────────────
export function JournalCalendarSection() {
  const theme = useAppTheme()
  const {
    loading, error,
    selectedDate, setSelectedDate,
    selectedEvents, markedDates,
    load, addEvent, editEvent, removeEvent, toggleCompleted,
  } = useCalendar({ primaryColor: theme.colors.primary })

  const [modalVisible, setModalVisible] = useState(false)
  const [eventToEdit, setEventToEdit] = useState<CalendarEvent | null>(null)

  useFocusEffect(useCallback(() => { load() }, [load]))

  const openNew = () => {
    setEventToEdit(null)
    setModalVisible(true)
  }

  const openEdit = (ev: CalendarEvent) => {
    setEventToEdit(ev)
    setModalVisible(true)
  }

  const handleSave = async (input: CreateCalendarEventInput) => {
    if (eventToEdit) {
      await editEvent(eventToEdit.id, input)
    } else {
      await addEvent(input)
    }
  }

  const s = sectionStyles(theme)

  return (
    <View style={s.wrapper}>
      {/* Título + botón agregar */}
      <View style={s.header}>
        <Text style={s.title}>📅 Calendario</Text>
        <Pressable style={s.addBtn} onPress={openNew}>
          <Text style={s.addBtnText}>+ Agregar</Text>
        </Pressable>
      </View>

      {/* Calendario */}
      <Calendar
        current={selectedDate}
        onDayPress={(day: { dateString: string }) => setSelectedDate(day.dateString)}
        markedDates={markedDates}
        theme={{
          backgroundColor: theme.colors.surface,
          calendarBackground: theme.colors.surface,
          textSectionTitleColor: theme.colors.textTertiary,
          selectedDayBackgroundColor: theme.colors.primary,
          selectedDayTextColor: "#fff",
          todayTextColor: theme.colors.primary,
          dayTextColor: theme.colors.textPrimary,
          textDisabledColor: theme.colors.textTertiary,
          dotColor: theme.colors.primary,
          selectedDotColor: "#fff",
          arrowColor: theme.colors.primary,
          monthTextColor: theme.colors.textPrimary,
          textMonthFontWeight: "700",
          textDayFontSize: 14,
          textMonthFontSize: 16,
        }}
        style={s.calendar}
      />

      {/* Eventos del día seleccionado */}
      <View style={s.eventsSection}>
        <Text style={s.eventsTitle}>
          {selectedDate === new Date().toISOString().split("T")[0]
            ? "Hoy"
            : selectedDate}
        </Text>

        {loading && (
          <ActivityIndicator size="small" color={theme.colors.primary} style={{ marginVertical: 12 }} />
        )}

        {!loading && error && (
          <Text style={{ color: "#ef4444", fontSize: 13, marginBottom: 8 }}>{error}</Text>
        )}

        {!loading && selectedEvents.length === 0 && (
          <Text style={s.empty}>Sin eventos · Toca "+ Agregar" para crear uno</Text>
        )}

        {selectedEvents.map((ev) => (
          <Pressable
            key={ev.id}
            style={[s.eventCard, ev.completed && { opacity: 0.5 }]}
            onLongPress={() => openEdit(ev)}
          >
            <Pressable style={s.checkBox} onPress={() => toggleCompleted(ev.id)}>
              <Text style={{ fontSize: 16 }}>
                {ev.completed ? "✅" : "⬜"}
              </Text>
            </Pressable>
            <View style={{ flex: 1 }}>
              <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
                <Text style={{ fontSize: 15 }}>{getEventEmoji(ev.type as CalendarEventType)}</Text>
                <Text
                  style={[s.eventTitle, ev.completed && { textDecorationLine: "line-through" }]}
                  numberOfLines={1}
                >
                  {ev.title}
                </Text>
                {ev.time ? <Text style={s.eventTime}>{ev.time}</Text> : null}
              </View>
              {ev.notes ? (
                <Text style={s.eventNotes} numberOfLines={2}>{ev.notes}</Text>
              ) : null}
            </View>
            <Pressable onPress={() => openEdit(ev)} style={s.editBtn}>
              <Text style={{ fontSize: 14, color: theme.colors.textTertiary }}>✏️</Text>
            </Pressable>
          </Pressable>
        ))}
      </View>

      <EventModal
        visible={modalVisible}
        initialDate={selectedDate}
        eventToEdit={eventToEdit}
        onSave={handleSave}
        onDelete={removeEvent}
        onClose={() => setModalVisible(false)}
      />
    </View>
  )
}

// ─── Estilos ──────────────────────────────────────────────────────────────────
const sectionStyles = (theme: ReturnType<typeof useAppTheme>) =>
  StyleSheet.create({
    wrapper: { marginHorizontal: 0 },
    header: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      marginBottom: 10,
      paddingHorizontal: 4,
    },
    title: {
      fontSize: 17,
      fontWeight: "700",
      color: theme.colors.textPrimary,
    },
    addBtn: {
      backgroundColor: theme.colors.primary + "22",
      borderRadius: 20,
      paddingHorizontal: 14,
      paddingVertical: 6,
      borderWidth: 1,
      borderColor: theme.colors.primary + "50",
    },
    addBtnText: {
      fontSize: 13,
      fontWeight: "700",
      color: theme.colors.primary,
    },
    calendar: {
      borderRadius: 14,
      overflow: "hidden",
      borderWidth: 1,
      borderColor: theme.colors.border,
      marginBottom: 16,
    },
    eventsSection: { gap: 8 },
    eventsTitle: {
      fontSize: 14,
      fontWeight: "700",
      color: theme.colors.textSecondary,
      marginBottom: 4,
      textTransform: "uppercase",
      letterSpacing: 0.5,
    },
    empty: {
      fontSize: 13,
      color: theme.colors.textTertiary,
      textAlign: "center",
      paddingVertical: 14,
    },
    eventCard: {
      flexDirection: "row",
      alignItems: "center",
      gap: 10,
      backgroundColor: theme.colors.surfaceMuted,
      borderRadius: 10,
      padding: 12,
      borderWidth: 1,
      borderColor: theme.colors.border,
    },
    checkBox: { paddingRight: 2 },
    eventTitle: {
      flex: 1,
      fontSize: 14,
      fontWeight: "600",
      color: theme.colors.textPrimary,
    },
    eventTime: {
      fontSize: 11,
      color: theme.colors.textTertiary,
      fontWeight: "600",
    },
    eventNotes: {
      fontSize: 12,
      color: theme.colors.textSecondary,
      marginTop: 2,
    },
    editBtn: { padding: 4 },
  })

const modalStyles = (theme: ReturnType<typeof useAppTheme>) =>
  StyleSheet.create({
    backdrop: {
      flex: 1,
      backgroundColor: "rgba(0,0,0,0.45)",
    },
    sheet: {
      backgroundColor: theme.colors.surface,
      borderTopLeftRadius: 24,
      borderTopRightRadius: 24,
      padding: 20,
      paddingBottom: 36,
    },
    handle: {
      width: 40,
      height: 4,
      backgroundColor: theme.colors.border,
      borderRadius: 2,
      alignSelf: "center",
      marginBottom: 16,
    },
    sheetTitle: {
      fontSize: 18,
      fontWeight: "700",
      color: theme.colors.textPrimary,
      marginBottom: 16,
    },
    label: {
      fontSize: 12,
      fontWeight: "700",
      color: theme.colors.textTertiary,
      marginBottom: 6,
      textTransform: "uppercase",
      letterSpacing: 0.5,
    },
    typeChip: {
      flexDirection: "row",
      alignItems: "center",
      gap: 6,
      backgroundColor: theme.colors.surfaceMuted,
      borderRadius: 20,
      paddingHorizontal: 12,
      paddingVertical: 7,
      borderWidth: 1,
      borderColor: theme.colors.border,
    },
    typeLabel: {
      fontSize: 13,
      fontWeight: "600",
      color: theme.colors.textPrimary,
    },
    input: {
      backgroundColor: theme.colors.surfaceMuted,
      borderRadius: 10,
      borderWidth: 1,
      borderColor: theme.colors.border,
      paddingHorizontal: 12,
      paddingVertical: 10,
      fontSize: 14,
      color: theme.colors.textPrimary,
      marginBottom: 14,
    },
    btn: {
      borderRadius: 10,
      paddingVertical: 13,
      alignItems: "center",
      justifyContent: "center",
    },
    saveBtn: {
      backgroundColor: theme.colors.primary,
    },
    deleteBtn: {
      backgroundColor: "#ef444422",
      borderWidth: 1,
      borderColor: "#ef4444",
      paddingHorizontal: 16,
    },
    btnText: {
      fontSize: 15,
      fontWeight: "700",
    },
  })