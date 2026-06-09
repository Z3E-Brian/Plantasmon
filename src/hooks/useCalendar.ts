import {
    buildMarkedDates,
    CalendarEvent,
    createCalendarEvent,
    CreateCalendarEventInput,
    deleteCalendarEvent,
    getAllCalendarEvents,
    getUpcomingEvents,
    groupEventsByDate,
    toggleCalendarEventCompleted,
    updateCalendarEvent,
} from "@/src/services/calendarService";
import { useCallback, useEffect, useState } from "react";

interface UseCalendarOptions {
  primaryColor: string;
  autoLoad?: boolean;
}

export function useCalendar({
  primaryColor,
  autoLoad = true,
}: UseCalendarOptions) {
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState<string>(
    new Date().toISOString().split("T")[0],
  );

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getAllCalendarEvents();
      setEvents(data);
    } catch (e) {
      console.error("useCalendar load error:", e);
      setError("No se pudieron cargar los eventos");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (autoLoad) load();
  }, [autoLoad, load]);

  const addEvent = useCallback(async (input: CreateCalendarEventInput) => {
    const event = await createCalendarEvent(input);
    setEvents((prev) =>
      [...prev, event].sort((a, b) => a.date.localeCompare(b.date)),
    );
    return event;
  }, []);

  const editEvent = useCallback(
    async (
      id: string,
      updates: Partial<Omit<CalendarEvent, "id" | "createdAt">>,
    ) => {
      await updateCalendarEvent(id, updates);
      setEvents((prev) =>
        prev.map((e) => (e.id === id ? { ...e, ...updates } : e)),
      );
    },
    [],
  );

  const removeEvent = useCallback(async (id: string) => {
    await deleteCalendarEvent(id);
    setEvents((prev) => prev.filter((e) => e.id !== id));
  }, []);

  const toggleCompleted = useCallback(
    async (id: string) => {
      const event = events.find((e) => e.id === id);
      if (!event) return;
      const next = !event.completed;
      await toggleCalendarEventCompleted(id, next);
      setEvents((prev) =>
        prev.map((e) => (e.id === id ? { ...e, completed: next } : e)),
      );
    },
    [events],
  );

  const eventsByDate = groupEventsByDate(events);
  const selectedEvents = eventsByDate[selectedDate] ?? [];
  const upcomingEvents = getUpcomingEvents(events);
  const markedDates = buildMarkedDates(events, selectedDate, primaryColor);

  return {
    events,
    loading,
    error,
    selectedDate,
    setSelectedDate,
    selectedEvents,
    upcomingEvents,
    eventsByDate,
    markedDates,
    load,
    addEvent,
    editEvent,
    removeEvent,
    toggleCompleted,
  };
}
