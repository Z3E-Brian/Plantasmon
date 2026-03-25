import { db } from "@/src/config/firebase";
import {
  collection,
  doc,
  getDoc,
  getDocs,
} from "firebase/firestore";
import { CURRENT_USER_ID } from "./userService";

export interface UserAchievement {
  id: string;
  name: string;
  description: string;
  earned: boolean;
  emoji: string;
  progress?: number;
  target?: number;
  xpReward: number;
}

function mapEmoji(category: string, name: string): string {
  if (name.toLowerCase().includes("primera") || name.toLowerCase().includes("first")) return "sprout";
  if (category === "identification" && name.toLowerCase().includes("maestro")) return "crown";
  if (category === "identification") return "magnify";
  if (category === "care") return "water";
  if (category === "collection") return "globe";
  return "sprout";
}

export async function getUserAchievements(userId: string = CURRENT_USER_ID): Promise<{
  achievements: UserAchievement[];
  earned: number;
  total: number;
}> {
  try {
    // 1. Leer el documento del usuario para obtener el array userAchievements
    const userRef = doc(db, "users", userId);
    const userSnap = await getDoc(userRef);

    if (!userSnap.exists()) {
      console.warn("Usuario no encontrado:", userId);
      return { achievements: [], earned: 0, total: 0 };
    }

    const userData = userSnap.data();

    // Soporta "subcollections.userAchievements" o "userAchievements" directo
    const userAchievements: any[] =
      userData.subcollections?.userAchievements ??
      userData.userAchievements ??
      [];

    // 2. Leer colección global achievements
    const achSnap = await getDocs(collection(db, "achievements"));

    if (achSnap.empty) {
      console.warn("Colección achievements vacía");
      return { achievements: [], earned: 0, total: 0 };
    }

    // Map de progreso del usuario por id para lookup rápido
    const userAchMap = new Map(
      userAchievements.map((a: any) => [a.id, a])
    );

    // 3. Combinar datos globales + progreso del usuario
    const achievements: UserAchievement[] = achSnap.docs.map((achDoc) => {
      const global = achDoc.data();
      const userAch = userAchMap.get(achDoc.id);

      return {
        id: achDoc.id,
        name: global.name,
        description: global.description,
        earned: userAch?.unlocked ?? false,
        emoji: mapEmoji(global.category, global.name),
        progress: userAch?.progress,
        target: userAch?.target ?? global.target,
        xpReward: global.xpReward,
      };
    });

    const earned = achievements.filter((a) => a.earned).length;

    return { achievements, earned, total: achievements.length };
  } catch (error) {
    console.error("Error obteniendo logros:", error);
    return { achievements: [], earned: 0, total: 0 };
  }
}
