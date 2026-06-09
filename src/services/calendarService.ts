import { db } from "@/src/config/firebase";
import { getCurrentUserId } from "@/src/services/userService";
import {
    addDoc,
    collection,
    deleteDoc,
    doc,
    getDocs,
    orderBy,
    query,
    updateDoc,
    where,
} from "firebase/firestore";

function requireUid(): string {
  const uid = getCurrentUserId();
  if (!uid) throw new Error("Usuario no autenticado");
  return uid;
}

export type CalendarEventType =
  | "watering"
  | "weeding"
  | "fertilizing"
  | "repotting"
  | "custom";

export interface CalendarEvent {
  id: string;
  title: string;
  date: string; // ISO date string "YYYY-MM-DD"
  time?: string; // "HH:mm" opcional
  type: CalendarEventType;
  plantId?: string;
  plantName?: string;
  notes?: string;
  completed: boolean;
  createdAt: string;
}

export interface CreateCalendarEventInput {
  title: string;
  date: string;
  time?: string;
  type: CalendarEventType;
  plantId?: string;
  plantName?: string;
  notes?: string;
}

const EVENT_TYPE_EMOJI: Record<CalendarEventType, string> = {
  watering: "💧",
  weeding: "🌱",
  fertilizing: "🌿",
  repotting: "🪴",
  custom: "📌",
};

export function getEventEmoji(type: CalendarEventType): string {
  return EVENT_TYPE_EMOJI[type] ?? "📌";
}

export const EVENT_TYPE_LABELS: Record<CalendarEventType, string> = {
  watering: "Riego",
  weeding: "Deshierbe",
  fertilizing: "Fertilización",
  repotting: "Trasplante",
  custom: "Personalizado",
};

function eventsRef(uid: string) {
  return collection(db, "users", uid, "calendarEvents");
}

export async function getCalendarEvents(
  from: string,
  to: string,
): Promise<CalendarEvent[]> {
  const uid = requireUid();
  const q = query(
    eventsRef(uid),
    where("date", ">=", from),
    where("date", "<=", to),
    orderBy("date", "asc"),
  );
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }) as CalendarEvent);
}

export async function getAllCalendarEvents(): Promise<CalendarEvent[]> {
  const uid = requireUid();
  const q = query(eventsRef(uid), orderBy("date", "asc"));
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }) as CalendarEvent);
}

export async function createCalendarEvent(
  input: CreateCalendarEventInput,
): Promise<CalendarEvent> {
  const uid = requireUid();
  const data = {
    ...input,
    completed: false,
    createdAt: new Date().toISOString(),
  };
  const ref = await addDoc(eventsRef(uid), data);
  return { id: ref.id, ...data };
}

export async function updateCalendarEvent(
  id: string,
  updates: Partial<Omit<CalendarEvent, "id" | "createdAt">>,
): Promise<void> {
  const uid = requireUid();
  await updateDoc(doc(db, "users", uid, "calendarEvents", id), updates);
}

export async function toggleCalendarEventCompleted(
  id: string,
  completed: boolean,
): Promise<void> {
  const uid = requireUid();
  await updateDoc(doc(db, "users", uid, "calendarEvents", id), { completed });
}

export async function deleteCalendarEvent(id: string): Promise<void> {
  const uid = requireUid();
  await deleteDoc(doc(db, "users", uid, "calendarEvents", id));
}

/** Agrupa eventos por fecha "YYYY-MM-DD" → lista */
export function groupEventsByDate(
  events: CalendarEvent[],
): Record<string, CalendarEvent[]> {
  return events.reduce<Record<string, CalendarEvent[]>>((acc, ev) => {
    if (!acc[ev.date]) acc[ev.date] = [];
    acc[ev.date].push(ev);
    return acc;
  }, {});
}

/** Devuelve los próximos N eventos desde hoy */
export function getUpcomingEvents(
  events: CalendarEvent[],
  limit = 7,
): CalendarEvent[] {
  const today = new Date().toISOString().split("T")[0];
  return events.filter((e) => e.date >= today && !e.completed).slice(0, limit);
}

/** Días con eventos para marcar en el calendario */
export function buildMarkedDates(
  events: CalendarEvent[],
  selectedDate: string,
  primaryColor: string,
): Record<string, any> {
  const grouped = groupEventsByDate(events);
  const marks: Record<string, any> = {};

  for (const date of Object.keys(grouped)) {
    marks[date] = {
      marked: true,
      dotColor: primaryColor,
      selected: date === selectedDate,
      selectedColor: date === selectedDate ? primaryColor : undefined,
    };
  }

  if (!marks[selectedDate]) {
    marks[selectedDate] = {
      selected: true,
      selectedColor: primaryColor,
    };
  }

  return marks;
}
