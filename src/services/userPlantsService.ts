import { db } from "@/src/config/firebase";
import {
  doc,
  getDoc,
  updateDoc,
} from "firebase/firestore";
import { CURRENT_USER_ID } from "./userService";

export interface UserPlant {
  id: string;
  name: string;
  scientificName: string;
  image: string;
  waterLevel: "low" | "medium" | "high";
  sunlight: "shade" | "partial" | "full";
  health: "thriving" | "good" | "needs-care";
  lastWatered: string;
  daysOwned: number;
  favorite: boolean;
}

function mapWaterLevel(wateringDays: number): "low" | "medium" | "high" {
  if (wateringDays >= 10) return "low";
  if (wateringDays >= 6) return "medium";
  return "high";
}

function mapSunlight(light: string): "shade" | "partial" | "full" {
  if (light.includes("low")) return "shade";
  if (light.includes("bright") || light.includes("full")) return "full";
  return "partial";
}

function daysSince(dateStr: string): number {
  const date = new Date(dateStr);
  const now = new Date();
  return Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
}

function formatLastWatered(dateStr: string): string {
  const days = daysSince(dateStr);
  if (days === 0) return "Today";
  if (days === 1) return "1 day ago";
  return `${days} days ago`;
}

export async function getUserPlants(userId: string = CURRENT_USER_ID): Promise<UserPlant[]> {
  try {
    // userPlants es un array dentro del documento del usuario
    const userRef = doc(db, "users", userId);
    const userSnap = await getDoc(userRef);

    if (!userSnap.exists()) {
      console.warn("Usuario no encontrado:", userId);
      return [];
    }

    const userData = userSnap.data();

    // Soporta tanto "subcollections.userPlants" como "userPlants" directo
    const userPlants: any[] =
      userData.subcollections?.userPlants ??
      userData.userPlants ??
      [];

    if (!userPlants.length) {
      console.log("No hay plantas para:", userId);
      return [];
    }

    // Por cada item del array, leer el documento de plants
    const results = await Promise.all(
      userPlants.map(async (userPlant: any) => {
        const plantId = userPlant.id; // "pl_001"

        const plantRef = doc(db, "plants", plantId);
        const plantSnap = await getDoc(plantRef);

        if (!plantSnap.exists()) {
          console.warn("Planta no encontrada en plants:", plantId);
          return null;
        }

        const plantData = plantSnap.data();

        return {
          id: plantId,
          name: plantData.commonName,
          scientificName: plantData.scientificName,
          image: `https://picsum.photos/seed/${plantId}/400/300`,
          waterLevel: mapWaterLevel(plantData.wateringDays),
          sunlight: mapSunlight(plantData.light),
          health: "thriving" as const,
          lastWatered: formatLastWatered(userPlant.lastIdentifiedAt),
          daysOwned: daysSince(userPlant.firstIdentifiedAt),
          favorite: userPlant.favorite ?? false,
        } as UserPlant;
      })
    );

    return results.filter(Boolean) as UserPlant[];
  } catch (error) {
    console.error("Error obteniendo plantas:", error);
    return [];
  }
}

export async function togglePlantFavorite(
  plantId: string,
  isFavorite: boolean,
  userId: string = CURRENT_USER_ID
): Promise<void> {
  try {
    const userRef = doc(db, "users", userId);
    const userSnap = await getDoc(userRef);
    if (!userSnap.exists()) return;

    const userData = userSnap.data();
    const isNested = !!userData.subcollections?.userPlants;
    const userPlants: any[] = isNested
      ? userData.subcollections.userPlants
      : userData.userPlants ?? [];

    const updated = userPlants.map((p: any) =>
      p.id === plantId ? { ...p, favorite: isFavorite } : p
    );

    const fieldPath = isNested ? "subcollections.userPlants" : "userPlants";
    await updateDoc(userRef, { [fieldPath]: updated });
  } catch (error) {
    console.error("Error actualizando favorito:", error);
    throw error;
  }
}
