import { db } from "@/src/config/firebase";
import {
  doc,
  getDoc,
  updateDoc,
} from "firebase/firestore";

export const CURRENT_USER_ID = "u_001";

export interface UserProfile {
  // ProfileHero
  name: string;
  handle: string;
  level: number;
  xp: number;
  xpToNextLevel: number;
  plantsOwned: number;
  plantsDiscovered: number;
  joinDate: Date;
  avatarUrl: string;

  // ProfileAbout
  bio: string;
  location: string;
  streak: number;
  careScore: number;
  rarestFind: string;
  achievements: number;
  totalAchievements: number;

  // Settings
  themeId: string;
  titleId: string;
  frameId: string;
}

export async function getUserProfile(userId: string = CURRENT_USER_ID): Promise<UserProfile | null> {
  try {
    const ref = doc(db, "users", userId);
    const snapshot = await getDoc(ref);

    if (!snapshot.exists()) {
      console.warn("Usuario no encontrado:", userId);
      return null;
    }

    const data = snapshot.data();

    return {
      name: data.displayName ?? data.username ?? "Usuario",
      handle: `#${data.username ?? "PlantUser"}`,
      level: data.stats?.level ?? 1,
      xp: data.stats?.xp ?? 0,
      xpToNextLevel: data.stats?.xpToNextLevel ?? 1000,
      plantsOwned: data.stats?.plantsIdentified ?? 0,
      plantsDiscovered: data.stats?.plantsIdentified ?? 0,
      joinDate: new Date(data.createdAt),
      avatarUrl: data.avatarUrl ?? "",

      // ✅ Firebase usa "aboutme", no "bio"
      bio: data.aboutme ?? "Amante de las plantas 🌿",
      location: data.location ?? "Sin ubicación",
      streak: data.stats?.streakDays ?? 0,
      careScore: data.careScore ?? 90,
      rarestFind: data.rarestFind ?? "Por descubrir",
      achievements: 0,
      totalAchievements: 0,

      themeId: data.settings?.themeId ?? "theme_forest",
      titleId: data.settings?.titleId ?? "",
      frameId: data.settings?.frameId ?? "",
    };
  } catch (error) {
    console.error("Error obteniendo perfil:", error);
    return null;
  }
}

export async function updateUserSettings(
  userId: string = CURRENT_USER_ID,
  settings: Partial<{ themeId: string; titleId: string; frameId: string; notificationsEnabled: boolean }>
): Promise<void> {
  try {
    const ref = doc(db, "users", userId);
    await updateDoc(ref, {
      "settings.themeId": settings.themeId,
      "settings.titleId": settings.titleId,
      "settings.frameId": settings.frameId,
    });
  } catch (error) {
    console.error("Error actualizando settings:", error);
    throw error;
  }
}

export async function updateUserBio(
  userId: string = CURRENT_USER_ID,
  data: Partial<{ bio: string; location: string }>
): Promise<void> {
  try {
    const ref = doc(db, "users", userId);
    const updateData: Record<string, any> = {};

    // ✅ Escribir en "aboutme", que es el campo real en Firebase
    if (data.bio !== undefined)      updateData["aboutme"]  = data.bio;
    if (data.location !== undefined) updateData["location"] = data.location;

    await updateDoc(ref, updateData);
  } catch (error) {
    console.error("Error actualizando bio:", error);
    throw error;
  }
}
