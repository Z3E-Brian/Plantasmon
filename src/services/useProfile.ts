import { useEffect, useState } from "react";
import { getUserProfile, UserProfile } from "@/src/services/userService";
import { getUserPlants, UserPlant } from "@/src/services/userPlantsService";
import { getUserAchievements, UserAchievement } from "@/src/services/userAchievementsService";

// ─────────────────────────────────────────────
// Estado completo del perfil
// ─────────────────────────────────────────────
interface ProfileState {
  user: UserProfile | null;
  plants: UserPlant[];
  achievements: UserAchievement[];
  loading: boolean;
  error: string | null;
}

// ─────────────────────────────────────────────
// Hook principal - úsalo en tu ProfileScreen
// ─────────────────────────────────────────────
export function useProfile() {
  const [state, setState] = useState<ProfileState>({
    user: null,
    plants: [],
    achievements: [],
    loading: true,
    error: null,
  });

  const loadProfile = async () => {
    setState((prev) => ({ ...prev, loading: true, error: null }));

    try {
      // Cargar todo en paralelo (más rápido)
      const [user, plants, achResult] = await Promise.all([
        getUserProfile(),
        getUserPlants(),
        getUserAchievements(),
      ]);

      // Inyectar conteo de logros en el user
      if (user) {
        user.achievements = achResult.earned;
        user.totalAchievements = achResult.total;
      }

      setState({
        user,
        plants,
        achievements: achResult.achievements,
        loading: false,
        error: null,
      });
    } catch (error) {
      setState((prev) => ({
        ...prev,
        loading: false,
        error: "Error cargando el perfil",
      }));
    }
  };

  useEffect(() => {
    loadProfile();
  }, []);

  return {
    ...state,
    reload: loadProfile, // para refrescar manualmente
  };
}
