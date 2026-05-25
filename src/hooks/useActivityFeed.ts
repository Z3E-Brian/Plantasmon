import { useCallback, useState } from "react";
import { useFocusEffect } from "expo-router";
import { getCurrentUserId } from "@/src/services/userService";
import {
  getRecentActivities,
  getUserActivities,
  toActivityData,
} from "@/src/services/activityService";
import type { ActivityData } from "@/src/components/profile/ActivityFeed";

interface ActivityFeedState {
  activities: ActivityData[];
  loading: boolean;
  error: string | null;
}

export function useActivityFeed(options?: {
  limit?: number;
  days?: number;
  autoRefresh?: boolean;
}): {
  activities: ActivityData[];
  loading: boolean;
  error: string | null;
  reload: () => Promise<void>;
} {
  const { limit = 50, days, autoRefresh = true } = options ?? {};
  const userId = getCurrentUserId();

  const [state, setState] = useState<ActivityFeedState>({
    activities: [],
    loading: !!userId,
    error: null,
  });

  const loadActivities = useCallback(async () => {
    if (!userId) {
      setState({ activities: [], loading: false, error: null });
      return;
    }

    setState((prev) => ({ ...prev, loading: true, error: null }));

    try {
      const events = days
        ? await getRecentActivities(userId, days)
        : await getUserActivities(userId, limit);
      const activities = events.map((event) => toActivityData(event));
      setState({ activities, loading: false, error: null });
    } catch (error) {
      setState((prev) => ({
        ...prev,
        loading: false,
        error: "Error cargando actividad",
      }));
    }
  }, [days, limit, userId]);

  useFocusEffect(
    useCallback(() => {
      if (autoRefresh === false) return;
      loadActivities();
    }, [autoRefresh, loadActivities])
  );

  return {
    ...state,
    reload: loadActivities,
  };
}
