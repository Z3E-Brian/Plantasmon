// Servicio para registrar y consultar actividades del usuario en Firestore
// Las actividades son eventos como identificar una planta, regar, lograr, etc.
// Se almacenan como subcolección: users/{uid}/activities/{docId} (D-01)
import { auth, db } from "@/src/config/firebase";
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
import { requireUserId } from "./userService";
import type { ActivityData } from "@/src/components/profile/ActivityFeed";

// ─── Types ──────────────────────────────────────────────────────

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
  timestamp: Date; // Convertido desde Firestore Timestamp a Date
};

// ─── Helpers ────────────────────────────────────────────────────

/**
 * Convierte un Timestamp de Firestore a Date de forma segura.
 * Sigue el patrón safeParseDate de userService.ts.
 */
function safeParseDate(value: unknown): Date {
  if (!value) return new Date();
  if (value instanceof Timestamp) return value.toDate();
  if (value instanceof Date) return value;
  const d = new Date(value as any);
  return isNaN(d.getTime()) ? new Date() : d;
}

/**
 * Formatea una fecha como texto relativo en español.
 * - < 1 min: "Ahora"
 * - < 60 min: "Hace X min"
 * - < 24 h: "Hace X h"
 * - < 7 días: "Hace X días"
 * - Otherwise: "dd/mm/aaaa"
 */
export function formatRelativeTime(date: Date): string {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMin = Math.floor(diffMs / (1000 * 60));
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffMin < 1) return "Ahora";
  if (diffMin < 60) return `Hace ${diffMin} min`;
  if (diffHours < 24) return `Hace ${diffHours} h`;
  if (diffDays < 7) return `Hace ${diffDays} días`;

  // Formato dd/mm/aaaa para actividades antiguas
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
}

/**
 * Convierte un ActivityEventWithId (desde Firestore) al formato ActivityData
 * que espera el componente ActivityFeed (src/components/profile/ActivityFeed.tsx).
 *
 * Mapeo de tipos:
 * - "mission" → "achievement" (las misiones se muestran como logros en el feed)
 * - Otros tipos se pasan directamente (con cast as any para adaptar al tipo ActivityData)
 */
export function toActivityData(event: ActivityEventWithId): ActivityData {
  return {
    id: parseInt(event.id, 36) || 0, // hash del doc ID base36 a número
    type: event.type === "mission" ? "achievement" : (event.type as any),
    title: event.title,
    description: event.description,
    time: formatRelativeTime(event.timestamp),
    iconType: event.iconType as any,
  };
}

// ─── Public API ─────────────────────────────────────────────────

/**
 * Crea un nuevo documento de actividad en la subcolección
 * users/{userId}/activities con serverTimestamp().
 *
 * @param userId - ID del usuario autenticado
 * @param event - Datos del evento (timestamp se asigna automáticamente)
 * @returns ID del documento creado en Firestore
 */
export async function logActivity(
  userId: string,
  event: Omit<ActivityEvent, "timestamp">
): Promise<string> {
  try {
    const resolvedUserId = requireUserId(userId);
    const activitiesRef = collection(
      db,
      "users",
      resolvedUserId,
      "activities"
    );
    const docRef = await addDoc(activitiesRef, {
      ...event,
      timestamp: serverTimestamp(),
    });
    return docRef.id;
  } catch (error) {
    console.error("Error en activityService.logActivity:", error);
    throw error;
  }
}

/**
 * Obtiene las actividades del usuario ordenadas por timestamp descendente.
 *
 * @param userId - ID del usuario autenticado
 * @param limitCount - Número máximo de actividades (default: 50)
 * @returns Array de actividades con id y timestamp convertido a Date
 */
export async function getUserActivities(
  userId: string,
  limitCount: number = 50
): Promise<ActivityEventWithId[]> {
  try {
    const resolvedUserId = requireUserId(userId);
    const activitiesRef = collection(
      db,
      "users",
      resolvedUserId,
      "activities"
    );
    const q = query(
      activitiesRef,
      orderBy("timestamp", "desc"),
      limit(limitCount)
    );
    const snapshot = await getDocs(q);

    return snapshot.docs.map((docSnap) => {
      const data = docSnap.data();
      return {
        id: docSnap.id,
        type: data.type,
        title: data.title,
        description: data.description,
        timestamp: safeParseDate(data.timestamp),
        iconType: data.iconType,
        metadata: data.metadata,
      } as ActivityEventWithId;
    });
  } catch (error) {
    console.error("Error en activityService.getUserActivities:", error);
    return []; // Fail-safe: retorna array vacío en vez de crashear
  }
}

/**
 * Obtiene las actividades del usuario de los últimos N días.
 *
 * @param userId - ID del usuario autenticado
 * @param days - Número de días hacia atrás (default: 7)
 * @returns Array de actividades recientes
 */
export async function getRecentActivities(
  userId: string,
  days: number = 7
): Promise<ActivityEventWithId[]> {
  try {
    const resolvedUserId = requireUserId(userId);
    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate() - days);

    const activitiesRef = collection(
      db,
      "users",
      resolvedUserId,
      "activities"
    );
    const q = query(
      activitiesRef,
      where("timestamp", ">=", cutoff),
      orderBy("timestamp", "desc")
    );
    const snapshot = await getDocs(q);

    return snapshot.docs.map((docSnap) => {
      const data = docSnap.data();
      return {
        id: docSnap.id,
        type: data.type,
        title: data.title,
        description: data.description,
        timestamp: safeParseDate(data.timestamp),
        iconType: data.iconType,
        metadata: data.metadata,
      } as ActivityEventWithId;
    });
  } catch (error) {
    console.error("Error en activityService.getRecentActivities:", error);
    return []; // Fail-safe: retorna array vacío
  }
}
