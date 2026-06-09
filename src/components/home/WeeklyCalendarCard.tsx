import { useAppTheme } from "@/src/constants/designSystem"
import { useCalendar } from "@/src/hooks/useCalendar"
import { CalendarEventType, getEventEmoji } from "@/src/services/calendarService"
import { useFocusEffect, useRouter } from "expo-router"
import { useCallback } from "react"
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from "react-native"

const DAYS_ES = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"]

function getWeekDays(): { label: string; iso: string; isToday: boolean }[] {
  const today = new Date()
  const todayStr = today.toISOString().split("T")[0]
  // Lunes como inicio de semana
  const dayOfWeek = today.getDay() === 0 ? 6 : today.getDay() - 1
  const monday = new Date(today)
  monday.setDate(today.getDate() - dayOfWeek)

  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(monday)
    d.setDate(monday.getDate() + i)
    const iso = d.toISOString().split("T")[0]
    return {
      label: DAYS_ES[d.getDay()],
      iso,
      isToday: iso === todayStr,
    }
  })
}

export function WeeklyCalendarCard() {
  const theme = useAppTheme()
  const router = useRouter()
  const { events, loading, selectedDate, setSelectedDate, selectedEvents, eventsByDate, load } =
    useCalendar({ primaryColor: theme.colors.primary })

  const week = getWeekDays()

  // Recargar cuando la pantalla recibe foco
  useFocusEffect(useCallback(() => { load() }, [load]))

  const s = styles(theme)

  return (
    <View style={s.card}>
      {/* Header */}
      <View style={s.header}>
        <Text style={s.title}>📅 Esta semana</Text>
        <Pressable onPress={() => router.push("/journal" as any)}>
          <Text style={s.more}>Ver más →</Text>
        </Pressable>
      </View>

      {/* Días de la semana */}
      <View style={s.weekRow}>
        {week.map((day) => {
          const hasEvents = (eventsByDate[day.iso]?.length ?? 0) > 0
          const isSelected = day.iso === selectedDate
          return (
            <Pressable
              key={day.iso}
              style={[
                s.dayCol,
                isSelected && { backgroundColor: theme.colors.primary + "22", borderRadius: 10 },
              ]}
              onPress={() => setSelectedDate(day.iso)}
            >
              <Text style={[s.dayLabel, day.isToday && { color: theme.colors.primary }]}>
                {day.label}
              </Text>
              <View
                style={[
                  s.dayCircle,
                  day.isToday && { backgroundColor: theme.colors.primary },
                  isSelected && !day.isToday && { borderColor: theme.colors.primary, borderWidth: 1.5 },
                ]}
              >
                <Text
                  style={[
                    s.dayNumber,
                    day.isToday && { color: "#fff" },
                  ]}
                >
                  {day.iso.split("-")[2]}
                </Text>
              </View>
              {hasEvents && (
                <View style={[s.dot, { backgroundColor: theme.colors.primary }]} />
              )}
            </Pressable>
          )
        })}
      </View>

      {/* Eventos del día seleccionado */}
      {loading ? (
        <ActivityIndicator size="small" color={theme.colors.primary} style={{ marginTop: 12 }} />
      ) : selectedEvents.length === 0 ? (
        <Text style={s.empty}>Sin eventos para este día</Text>
      ) : (
        <View style={s.eventList}>
          {selectedEvents.slice(0, 3).map((ev) => (
            <View key={ev.id} style={[s.eventRow, ev.completed && { opacity: 0.45 }]}>
              <Text style={s.eventEmoji}>{getEventEmoji(ev.type as CalendarEventType)}</Text>
              <Text
                style={[s.eventTitle, ev.completed && { textDecorationLine: "line-through" }]}
                numberOfLines={1}
              >
                {ev.title}
              </Text>
              {ev.time ? <Text style={s.eventTime}>{ev.time}</Text> : null}
            </View>
          ))}
          {selectedEvents.length > 3 && (
            <Text style={s.moreEvents}>+{selectedEvents.length - 3} más</Text>
          )}
        </View>
      )}
    </View>
  )
}

const styles = (theme: ReturnType<typeof useAppTheme>) =>
  StyleSheet.create({
    card: {
      marginHorizontal: 16,
      marginBottom: 16,
      backgroundColor: theme.colors.surface,
      borderRadius: 16,
      padding: 16,
      borderWidth: 1,
      borderColor: theme.colors.border,
    },
    header: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: 14,
    },
    title: {
      fontSize: 16,
      fontWeight: "700",
      color: theme.colors.textPrimary,
    },
    more: {
      fontSize: 13,
      color: theme.colors.primary,
      fontWeight: "600",
    },
    weekRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      marginBottom: 14,
    },
    dayCol: {
      alignItems: "center",
      paddingVertical: 6,
      paddingHorizontal: 4,
      minWidth: 36,
    },
    dayLabel: {
      fontSize: 10,
      fontWeight: "600",
      color: theme.colors.textTertiary,
      marginBottom: 4,
    },
    dayCircle: {
      width: 28,
      height: 28,
      borderRadius: 14,
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: "transparent",
    },
    dayNumber: {
      fontSize: 13,
      fontWeight: "700",
      color: theme.colors.textPrimary,
    },
    dot: {
      width: 5,
      height: 5,
      borderRadius: 3,
      marginTop: 3,
    },
    empty: {
      fontSize: 13,
      color: theme.colors.textTertiary,
      textAlign: "center",
      paddingVertical: 10,
    },
    eventList: {
      gap: 8,
    },
    eventRow: {
      flexDirection: "row",
      alignItems: "center",
      gap: 8,
      backgroundColor: theme.colors.surfaceMuted,
      borderRadius: 8,
      paddingHorizontal: 10,
      paddingVertical: 7,
    },
    eventEmoji: {
      fontSize: 15,
    },
    eventTitle: {
      flex: 1,
      fontSize: 13,
      fontWeight: "600",
      color: theme.colors.textPrimary,
    },
    eventTime: {
      fontSize: 11,
      color: theme.colors.textTertiary,
      fontWeight: "600",
    },
    moreEvents: {
      fontSize: 12,
      color: theme.colors.textSecondary,
      textAlign: "center",
      marginTop: 2,
    },
  })