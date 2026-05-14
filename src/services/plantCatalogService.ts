import { db } from "@/src/config/firebase";
import { collection, getDocs } from "firebase/firestore";

export type CatalogPlantRarity = "common" | "uncommon" | "rare" | "legendary";
export type CatalogPlantDifficulty = "fácil" | "moderada" | "difícil";

export interface CatalogPlant {
  id: string;
  commonName: string;
  scientificName: string;
  image: string;
  wateringDays: number;
  light: string;
  difficulty: CatalogPlantDifficulty;
  rarity: CatalogPlantRarity;
  description?: string;
  careInstructions?: string;
}

export async function getAllPlants(): Promise<CatalogPlant[]> {
  try {
    const plantsRef = collection(db, "plants");
    const snapshot = await getDocs(plantsRef);

    return snapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        commonName: data.commonName ?? "",
        scientificName: data.scientificName ?? "",
        image: data.image ?? `https://picsum.photos/seed/${doc.id}/400/300`,
        wateringDays: data.wateringDays ?? 7,
        light: data.light ?? "",
        difficulty: data.difficulty ?? "fácil",
        rarity: data.rarity ?? "common",
        description: data.description,
        careInstructions: data.careInstructions,
      } as CatalogPlant;
    });
  } catch (error) {
    console.error("Error obteniendo plantas del catálogo:", error);
    return [];
  }
}
