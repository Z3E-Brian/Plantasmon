// Hook React para obtener el feed de actividades del usuario.
// Se actualiza automáticamente cuando la pantalla recibe foco (useProfile pattern).
// Retorna actividades ya convertidas al formato ActivityData para ActivityFeed.
import { useCallback, useState } from "react";
import { useFocusEffect } from "expo-router";
import { getCurrentUserId } from "@/src/services/userService";
import {
  getUserActivities,
  getRecentActivities,
  toActivityData,
} from "@/src/services/activityService";
import type { ActivityData } from "@/src/components/profile/ActivityFeed";

// ─── Types ──────────────────────────────────────────────────────

export interface UseActivityFeedOptions {
  /** Número máximo de actividades (default: 50) */
  limit?: number;
  /** Si se especifica, filtra a los últimos N días */
  days?: number;
  /** Si true (default), recarga al recibir foco la pantalla */
  autoRefresh?: boolean;
}

export interface UseActivityFeedReturn {
  /** Actividades ya convertidas al formato del componente ActivityFeed */
  activities: ActivityData[];
  /** Indicador de carga */
  loading: boolean;
  /** Mensaje de error (null si no hay error) */
  error: string | null;
  /** Función para recargar manualmente */
  reload: () => Promise<void>;
}

// ─── Hook ───────────────────────────────────────────────────────

/**
 * Obtiene el feed de actividades del usuario autenticado.
 *
 * @param options - Opciones de configuración
 * @returns Estado del feed y función de recarga
 *
 * @example
 * const { activities, loading, error, reload } = useActivityFeed();
 * const { activities } = useActivityFeed({ days: 7, limit: 20 });
 */
export function useActivityFeed(
  options?: UseActivityFeedOptions
): UseActivityFeedReturn {
  const { limit = 50, days, autoRefresh = true } = options ?? {};
  const userId = getCurrentUserId();

  // Estado inicial: loading solo si hay userId
  const [activities, setActivities] = useState<ActivityData[]>([]);
  const [loading, setLoading] = useState<boolean>(!!userId);
  const [error, setError] = useState<string | null>(null);

  /**
   * Carga las actividades desde Firestore.
   * Usa getRecentActivities si se especificó days, sino getUserActivities.
   */
  const loadActivities = useCallback(async () => {
    if (!userId) {
      setActivities([]);
      setLoading(false);
      setError(null);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const events =
        days !== undefined
          ? await getRecentActivities(userId, days)
          : await getUserActivities(userId, limit);

      setActivities(events.map(toActivityData));
      setLoading(false);
    } catch (err) {
      setLoading(false);
      setError("Error al cargar actividades");
      // No se limpian las actividades en error — se mantienen los datos anteriores
      // (mismo patrón que useProfile.ts)
    }
  }, [userId, limit, days]);

  // Auto-refresh cada vez que la pantalla recibe foco (useFocusEffect)
  useFocusEffect(
    useCallback(() => {
      if (autoRefresh) {
        loadActivities();
      }
    }, [autoRefresh, loadActivities])
  );

  return {
    activities,
    loading,
    error,
    reload: loadActivities,
  };
}
