import { db } from "@/src/config/firebase";
import {
  doc,
  getDoc,
  updateDoc,
  setDoc,
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

export interface AddPlantFromIdInput {
  plantId: string;
  imageUri: string;
  userId?: string;
}

export async function addUserPlant(
  input: AddPlantFromIdInput
): Promise<void> {
  const { plantId, imageUri, userId = CURRENT_USER_ID } = input;

  try {
    const userRef = doc(db, "users", userId);
    const userSnap = await getDoc(userRef);

    if (!userSnap.exists()) {
      await setDoc(userRef, { userPlants: [] });
    }

    const userData = userSnap.data();
    const existingPlants: any[] = userData?.userPlants ?? [];
    
    const alreadyExists = existingPlants.some((p: any) => p.id === plantId);
    if (alreadyExists) {
      console.log("Planta ya en colección:", plantId);
      return;
    }

    const plantRef = doc(db, "plants", plantId);
    const plantSnap = await getDoc(plantRef);
    
    const newPlant = {
      id: plantId,
      image: imageUri,
      firstIdentifiedAt: new Date().toISOString(),
      lastWatered: null,
      favorite: false,
      isCompanion: false,
    };

    await updateDoc(userRef, {
      userPlants: [...existingPlants, newPlant],
    });

    console.log("Planta agregada:", plantId);
  } catch (error) {
    console.error("Error agregando planta:", error);
    throw error;
  }
}

// ─── Helpers de StatsBar ─────────────────────────────────────────────────────

/**
 * Cuenta cuántas plantas fueron identificadas hoy (fecha local).
 */
export async function getPhotosTodayCount(userId: string = CURRENT_USER_ID): Promise<number> {
  try {
    const { userPlants } = await getRawUserPlants(userId);
    const today = new Date();
    const todayStr = toDateStr(today);

    return userPlants.filter((p: any) => {
      if (!p.firstIdentifiedAt) return false;
      return toDateStr(new Date(p.firstIdentifiedAt)) === todayStr;
    }).length;
  } catch (error) {
    console.error("Error obteniendo fotos de hoy:", error);
    return 0;
  }
}

/**
 * Obtiene la planta identificada más reciente (nombre + fecha).
 */
export async function getLastIdentification(
  userId: string = CURRENT_USER_ID
): Promise<{ plantName: string; date: Date } | null> {
  try {
    const { userPlants } = await getRawUserPlants(userId);
    if (!userPlants.length) return null;

    // Ordenar por firstIdentifiedAt descendente
    const sorted = [...userPlants].sort((a: any, b: any) => {
      const dateA = new Date(a.firstIdentifiedAt ?? 0).getTime();
      const dateB = new Date(b.firstIdentifiedAt ?? 0).getTime();
      return dateB - dateA;
    });

    const mostRecent = sorted[0];
    if (!mostRecent.firstIdentifiedAt) return null;

    const plantRef = doc(db, "plants", mostRecent.id);
    const plantSnap = await getDoc(plantRef);

    if (!plantSnap.exists()) return null;

    const plantData = plantSnap.data();
    return {
      plantName: plantData.commonName ?? "Planta desconocida",
      date: new Date(mostRecent.firstIdentifiedAt),
    };
  } catch (error) {
    console.error("Error obteniendo última identificación:", error);
    throw error;
  }
}

function toDateStr(d: Date): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}
