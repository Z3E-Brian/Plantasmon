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
  isCompanion: boolean;
}

export interface UserPlantUpdate {
  nickname?: string;
  notes?: string;
  lastWatered?: string;
  lastWeeded?: string;
  favorite?: boolean;
  isCompanion?: boolean;
  location?: string;
  personality?: string;
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

function formatLastWatered(dateStr: string | null): string {
  if (!dateStr) return "Sin registrar";
  const days = daysSince(dateStr);
  if (days === 0) return "Hoy";
  if (days === 1) return "Hace 1 día";
  return `Hace ${days} días`;
}

// ─── Helpers internos ────────────────────────────────────────────────────────

async function getRawUserPlants(userId: string): Promise<{
  userPlants: any[];
  fieldPath: string;
  userRef: ReturnType<typeof doc>;
}> {
  const userRef = doc(db, "users", userId);
  const userSnap = await getDoc(userRef);
  if (!userSnap.exists()) return { userPlants: [], fieldPath: "userPlants", userRef };

  const userData = userSnap.data();
  const isNested = !!userData.subcollections?.userPlants;
  const userPlants: any[] = isNested
    ? userData.subcollections.userPlants
    : userData.userPlants ?? [];
  const fieldPath = isNested ? "subcollections.userPlants" : "userPlants";

  return { userPlants, fieldPath, userRef };
}

// ─── Funciones públicas ──────────────────────────────────────────────────────

export async function getUserPlants(userId: string = CURRENT_USER_ID): Promise<UserPlant[]> {
  try {
    const { userPlants } = await getRawUserPlants(userId);

    if (!userPlants.length) {
      console.log("No hay plantas para:", userId);
      return [];
    }

    const results = await Promise.all(
      userPlants.map(async (userPlant: any) => {
        const plantId = userPlant.id;
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
          lastWatered: formatLastWatered(userPlant.lastWatered ?? userPlant.lastIdentifiedAt),
          daysOwned: daysSince(userPlant.firstIdentifiedAt),
          favorite: userPlant.favorite ?? false,
          isCompanion: userPlant.isCompanion ?? false,
        } as UserPlant;
      })
    );

    return results.filter(Boolean) as UserPlant[];
  } catch (error) {
    console.error("Error obteniendo plantas:", error);
    return [];
  }
}

export async function updateUserPlant(
  plantId: string,
  updates: UserPlantUpdate,
  userId: string = CURRENT_USER_ID
): Promise<void> {
  try {
    const { userPlants, fieldPath, userRef } = await getRawUserPlants(userId);

    const updated = userPlants.map((p: any) =>
      p.id === plantId ? { ...p, ...updates } : p
    );

    await updateDoc(userRef, { [fieldPath]: updated });
  } catch (error) {
    console.error("Error actualizando planta:", error);
    throw error;
  }
}

/**
 * Marca una planta como compañera y desmarca el resto.
 */
export async function setCompanionPlant(
  plantId: string,
  userId: string = CURRENT_USER_ID
): Promise<void> {
  try {
    const { userPlants, fieldPath, userRef } = await getRawUserPlants(userId);

    const updated = userPlants.map((p: any) => ({
      ...p,
      isCompanion: p.id === plantId,
    }));

    await updateDoc(userRef, { [fieldPath]: updated });
  } catch (error) {
    console.error("Error seteando planta compañera:", error);
    throw error;
  }
}

export async function togglePlantFavorite(
  plantId: string,
  isFavorite: boolean,
  userId: string = CURRENT_USER_ID
): Promise<void> {
  try {
    const { userPlants, fieldPath, userRef } = await getRawUserPlants(userId);

    const updated = userPlants.map((p: any) =>
      p.id === plantId ? { ...p, favorite: isFavorite } : p
    );

    await updateDoc(userRef, { [fieldPath]: updated });
  } catch (error) {
    console.error("Error actualizando favorito:", error);
    throw error;
  }
}
