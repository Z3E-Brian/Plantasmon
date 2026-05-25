import { useCallback, useEffect, useMemo, useState } from "react"
import { View, Text, StyleSheet, ActivityIndicator } from "react-native"
import { Calendar, DateData, LocaleConfig } from "react-native-calendars"
import ScreenWrapper from "@/src/components/screenWrapper/ScreenWrapper"
import { getCurrentUserId } from "@/src/services/userService"
import {
  getUserActivities,
  toActivityData,
  type ActivityEventWithId,
} from "@/src/services/activityService"
import { ActivityFeed, type ActivityData } from "@/src/components/profile/ActivityFeed"
import { COLORS } from "@/src/constants/theme"

LocaleConfig.locales["es"] = {
  monthNames: [
    "Enero",
    "Febrero",
    "Marzo",
    "Abril",
    "Mayo",
    "Junio",
    "Julio",
    "Agosto",
    "Septiembre",
    "Octubre",
    "Noviembre",
    "Diciembre",
  ],
  monthNamesShort: [
    "Ene",
    "Feb",
    "Mar",
    "Abr",
    "May",
    "Jun",
    "Jul",
    "Ago",
    "Sep",
    "Oct",
    "Nov",
    "Dic",
  ],
  dayNames: [
    "Domingo",
    "Lunes",
    "Martes",
    "Miércoles",
    "Jueves",
    "Viernes",
    "Sábado",
  ],
  dayNamesShort: ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"],
  today: "Hoy",
}
LocaleConfig.defaultLocale = "es"

const DOT_COLORS = {
  water: "#4A90D9",
  identify: "#50C878",
  achievement: "#FFD700",
  mission: "#9B59B6",
} as const

type DotKey = keyof typeof DOT_COLORS

export default function CalendarScreen() {
  const [allActivities, setAllActivities] = useState<ActivityEventWithId[]>([])
  const [selectedDate, setSelectedDate] = useState<string>("")
  const [selectedEvents, setSelectedEvents] = useState<ActivityData[]>([])
  const [loading, setLoading] = useState(true)

  const markedDates = useMemo(() => {
    const dateGroups: Record<string, Record<DotKey, number>> = {}

    for (const event of allActivities) {
      const dateStr = formatDate(event.timestamp)
      if (!dateGroups[dateStr]) {
        dateGroups[dateStr] = { water: 0, identify: 0, achievement: 0, mission: 0 }
      }
      dateGroups[dateStr][event.type] += 1
    }

    const marked: Record<string, { dots: { key: string; color: string }[]; selected: boolean }> = {}
    for (const [date, counts] of Object.entries(dateGroups)) {
      const dots: { key: string; color: string }[] = []
      if (counts.water > 0) dots.push({ key: "water", color: DOT_COLORS.water })
      if (counts.identify > 0) dots.push({ key: "identify", color: DOT_COLORS.identify })
      if (counts.achievement > 0)
        dots.push({ key: "achievement", color: DOT_COLORS.achievement })
      if (counts.mission > 0) dots.push({ key: "mission", color: DOT_COLORS.mission })
      marked[date] = { dots, selected: date === selectedDate }
    }

    if (selectedDate && !marked[selectedDate]) {
      marked[selectedDate] = { dots: [], selected: true }
    }

    return marked
  }, [allActivities, selectedDate])

  const updateSelectedEvents = useCallback(
    (dateStr: string, events: ActivityEventWithId[]) => {
      const filtered = events.filter((event) => formatDate(event.timestamp) === dateStr)
      setSelectedEvents(filtered.map((event) => toActivityData(event)))
    },
    []
  )

  useEffect(() => {
    let mounted = true
    const loadActivities = async () => {
      const uid = getCurrentUserId()
      if (!uid) {
        if (mounted) {
          setAllActivities([])
          setLoading(false)
        }
        return
      }
      const events = await getUserActivities(uid, 200)
      if (mounted) {
        setAllActivities(events)
        setLoading(false)
        const initialDate = events.length > 0 ? formatDate(events[0].timestamp) : ""
        setSelectedDate(initialDate)
        if (initialDate) {
          updateSelectedEvents(initialDate, events)
        } else {
          setSelectedEvents([])
        }
      }
    }

    loadActivities()
    return () => {
      mounted = false
    }
  }, [updateSelectedEvents])

  const handleDayPress = useCallback(
    (day: DateData) => {
      setSelectedDate(day.dateString)
      updateSelectedEvents(day.dateString, allActivities)
    },
    [allActivities, updateSelectedEvents]
  )

  return (
    <ScreenWrapper>
      <View style={styles.container}>
        <Text style={styles.title}>📅 Calendario de actividades</Text>

        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={COLORS.primary} />
          </View>
        ) : (
          <Calendar
            markedDates={markedDates}
            markingType="multi-dot"
            onDayPress={handleDayPress}
            theme={{
              todayTextColor: COLORS.primary,
              selectedDayBackgroundColor: `${COLORS.primary}20`,
              dotColor: COLORS.primary,
              arrowColor: COLORS.primary,
            }}
          />
        )}

        <View style={styles.legend}>
          {[
            { label: "Riego", color: DOT_COLORS.water },
            { label: "Identificación", color: DOT_COLORS.identify },
            { label: "Logro", color: DOT_COLORS.achievement },
            { label: "Misión", color: DOT_COLORS.mission },
          ].map((item) => (
            <View key={item.label} style={styles.legendItem}>
              <View style={[styles.legendDot, { backgroundColor: item.color }]} />
              <Text style={styles.legendLabel}>{item.label}</Text>
            </View>
          ))}
        </View>

        <Text style={styles.sectionTitle}>
          Eventos {selectedDate ? formatDisplayDate(selectedDate) : ""}
        </Text>
        {selectedEvents.length > 0 ? (
          <ActivityFeed activities={selectedEvents} />
        ) : (
          <Text style={styles.emptyText}>No hay actividades este día</Text>
        )}
      </View>
    </ScreenWrapper>
  )
}

function formatDate(date: Date): string {
  const yyyy = date.getFullYear()
  const mm = String(date.getMonth() + 1).padStart(2, "0")
  const dd = String(date.getDate()).padStart(2, "0")
  return `${yyyy}-${mm}-${dd}`
}

function formatDisplayDate(dateStr: string): string {
  const [year, month, day] = dateStr.split("-").map((value) => Number(value))
  if (!year || !month || !day) return ""
  const monthNames = [
    "ene",
    "feb",
    "mar",
    "abr",
    "may",
    "jun",
    "jul",
    "ago",
    "sep",
    "oct",
    "nov",
    "dic",
  ]
  const monthLabel = monthNames[month - 1] ?? ""
  return `${day} ${monthLabel} ${year}`
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  title: {
    fontSize: 22,
    fontWeight: "700",
    marginBottom: 16,
  },
  loadingContainer: {
    paddingVertical: 32,
    alignItems: "center",
  },
  legend: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginVertical: 12,
    padding: 8,
    borderRadius: 12,
    backgroundColor: "rgba(0,0,0,0.03)",
  },
  legendItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  legendDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  legendLabel: {
    fontSize: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginVertical: 12,
  },
  emptyText: {
    textAlign: "center",
    color: "gray",
    marginTop: 20,
  },
})
