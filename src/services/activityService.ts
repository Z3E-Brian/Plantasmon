import { db } from "@/src/config/firebase";
import {
  Timestamp,
  addDoc,
  collection,
  doc,
  getDocs,
  limit,
  orderBy,
  query,
  serverTimestamp,
  where,
} from "firebase/firestore";
import type { ActivityData } from "@/src/components/profile/ActivityFeed";
import { requireUserId } from "./userService";

export interface ActivityEvent {
  type: "identify" | "water" | "achievement" | "mission";
  title: string;
  description: string;
  timestamp: Timestamp;
  iconType: "camera" | "water" | "award" | "sparkles";
  metadata?: {
    plantName?: string;
    plantId?: string;
    missionId?: string;
    achievementId?: string;
    xpEarned?: number;
  };
}

export type ActivityEventWithId = Omit<ActivityEvent, "timestamp"> & {
  id: string;
  timestamp: Date;
};

// Convierte Timestamp de Firestore a Date de forma segura.
function safeParseDate(value: unknown): Date {
  if (!value) return new Date();
  if (value instanceof Timestamp) return value.toDate();
  if (value instanceof Date) return value;
  const parsed = new Date(value as any);
  return isNaN(parsed.getTime()) ? new Date() : parsed;
}

// Formatea fecha a texto relativo en español.
function formatRelativeTime(date: Date): string {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMinutes = Math.round(diffMs / (1000 * 60));

  if (diffMinutes < 1) return "Ahora";
  if (diffMinutes < 60) return `Hace ${diffMinutes} min`;

  const diffHours = Math.round(diffMinutes / 60);
  if (diffHours < 24) return `Hace ${diffHours} h`;

  const diffDays = Math.round(diffHours / 24);
  if (diffDays < 7) return `Hace ${diffDays} días`;

  const dd = String(date.getDate()).padStart(2, "0");
  const mm = String(date.getMonth() + 1).padStart(2, "0");
  const yyyy = date.getFullYear();
  return `${dd}/${mm}/${yyyy}`;
}

function mapSnapshotToEvent(snapshot: { id: string; data: () => ActivityEvent }): ActivityEventWithId {
  const data = snapshot.data();
  return {
    ...data,
    id: snapshot.id,
    timestamp: safeParseDate(data.timestamp),
  };
}

export async function logActivity(
  userId: string,
  event: Omit<ActivityEvent, "timestamp">
): Promise<string> {
  try {
    const resolvedUserId = requireUserId(userId);
    const userRef = doc(db, "users", resolvedUserId);
    const activitiesRef = collection(userRef, "activities");
    const docRef = await addDoc(activitiesRef, {
      ...event,
      timestamp: serverTimestamp(),
    });
    return docRef.id;
  } catch (error) {
    console.error("Error en activityService:", error);
    throw error;
  }
}

export async function getUserActivities(
  userId: string,
  limitCount = 50
): Promise<ActivityEventWithId[]> {
  try {
    const resolvedUserId = requireUserId(userId);
    const userRef = doc(db, "users", resolvedUserId);
    const activitiesRef = collection(userRef, "activities");
    const activitiesQuery = query(
      activitiesRef,
      orderBy("timestamp", "desc"),
      limit(limitCount)
    );
    const snapshot = await getDocs(activitiesQuery);
    return snapshot.docs.map((docSnap) =>
      mapSnapshotToEvent({ id: docSnap.id, data: () => docSnap.data() as ActivityEvent })
    );
  } catch (error) {
    console.error("Error en activityService:", error);
    return [];
  }
}

export async function getRecentActivities(
  userId: string,
  days = 7
): Promise<ActivityEventWithId[]> {
  try {
    const resolvedUserId = requireUserId(userId);
    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate() - days);
    const userRef = doc(db, "users", resolvedUserId);
    const activitiesRef = collection(userRef, "activities");
    const activitiesQuery = query(
      activitiesRef,
      where("timestamp", ">=", cutoff),
      orderBy("timestamp", "desc"),
      limit(50)
    );
    const snapshot = await getDocs(activitiesQuery);
    return snapshot.docs.map((docSnap) =>
      mapSnapshotToEvent({ id: docSnap.id, data: () => docSnap.data() as ActivityEvent })
    );
  } catch (error) {
    console.error("Error en activityService:", error);
    return [];
  }
}

export function toActivityData(event: ActivityEventWithId): ActivityData {
  return {
    id: parseInt(event.id, 36) || 0,
    type: (event.type === "mission" ? "achievement" : (event.type as any)) as ActivityData["type"],
    title: event.title,
    description: event.description,
    time: formatRelativeTime(event.timestamp),
    iconType: event.iconType as ActivityData["iconType"],
  };
}
