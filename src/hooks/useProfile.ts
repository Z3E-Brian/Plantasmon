import { useEffect, useState } from "react";
import { getUserProfile, UserProfile } from "@/src/services/userService";
import { getUserPlants, UserPlant } from "@/src/services/userPlantsService";
import { getUserAchievements, UserAchievement } from "@/src/services/userAchievementsService";

interface ProfileState {
  user: UserProfile | null;
  plants: UserPlant[];
  achievements: UserAchievement[];
  loading: boolean;
  error: string | null;
}

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
      const [user, plants, achResult] = await Promise.all([
        getUserProfile(),
        getUserPlants(),
        getUserAchievements(),
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
  };

  useEffect(() => {
    loadProfile();
  }, []);

  return {
    ...state,
    reload: loadProfile,
  };
}
