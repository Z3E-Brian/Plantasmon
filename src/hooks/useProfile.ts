import { getUserAchievements, UserAchievement } from "@/src/services/userAchievementsService";
import { getUserPlants, UserPlant } from "@/src/services/userPlantsService";
import { getUserProfile, UserProfile } from "@/src/services/userService";
import { useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";

interface ProfileState {
  user: UserProfile | null;
  plants: UserPlant[];
  achievements: UserAchievement[];
  loading: boolean;
  error: string | null;
}

export function useProfile() {
  // Hardcoded for now - fix later
  const userId = "u_001";
  
  const [state, setState] = useState<ProfileState>({
    user: null,
    plants: [],
    achievements: [],
    loading: true,
    error: null,
  });

  const loadProfile = useCallback(async () => {
    setState((prev) => ({ ...prev, loading: true, error: null }));

    try {
      const [user, plants, achResult] = await Promise.all([
        getUserProfile(userId),
        getUserPlants(userId),
        getUserAchievements(userId),
      ]);

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
  }, [userId]);

  // Se ejecuta cada vez que la pantalla recibe foco (al volver de editProfile)
  useFocusEffect(
    useCallback(() => {
      loadProfile();
    }, [loadProfile])
  );

  return {
    ...state,
    reload: loadProfile,
  };
}
