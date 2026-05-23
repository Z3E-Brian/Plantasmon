import { db } from "@/src/config/firebase";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  arrayUnion,
} from "firebase/firestore";
import { getCurrentUserId } from "./userService";
import {
  OBTENIBLES,
  type ObtenibleDefinition,
  type RarityTier,
} from "@/src/constants/obteniblesData";

// ── Re-export types ─────────────────────────────────────────────
export type { ObtenibleDefinition, RarityTier };

// ── Types ───────────────────────────────────────────────────────
export interface ObtenibleWithStatus {
  definition: ObtenibleDefinition;
  obtained: boolean;
}

// ── Seed ────────────────────────────────────────────────────────
export async function seedObtenibles(): Promise<void> {
  try {
    const obteniblesRef = collection(db, "obtenibles");
    const snapshot = await getDocs(obteniblesRef);

    if (!snapshot.empty) {
      console.log(
        "La colección 'obtenibles' ya tiene datos. Omitiendo seed."
      );
      return;
    }

    for (const item of OBTENIBLES) {
      await setDoc(doc(db, "obtenibles", item.id), item, {
        merge: true,
      });
      console.log(`Obtenible creado: ${item.id} — ${item.name}`);
    }

    console.log(
      `Seed completado: ${OBTENIBLES.length} obtenibles creados.`
    );
  } catch (error) {
    console.error("Error durante el seed de obtenibles:", error);
    throw error;
  }
}

// ── CRUD ────────────────────────────────────────────────────────
export async function getObtenibleDefinitions(): Promise<
  ObtenibleDefinition[]
> {
  try {
    const obteniblesRef = collection(db, "obtenibles");
    const snapshot = await getDocs(obteniblesRef);

    if (snapshot.empty) {
      console.warn("Colección 'obtenibles' vacía");
      return [];
    }

    return snapshot.docs.map(
      (doc) => doc.data() as ObtenibleDefinition
    );
  } catch (error) {
    console.error("Error obteniendo definiciones de obtenibles:", error);
    return [];
  }
}

// ── User obtained items ─────────────────────────────────────────
export async function getUserObtainedItems(
  userId?: string
): Promise<string[]> {
  const resolvedUserId = userId ?? getCurrentUserId();
  if (!resolvedUserId) return [];

  try {
    const userRef = doc(db, "users", resolvedUserId);
    const userSnap = await getDoc(userRef);

    if (!userSnap.exists()) {
      console.warn("Usuario no encontrado:", userId);
      return [];
    }

    const userData = userSnap.data();
    return userData.obtainedItems ?? [];
  } catch (error) {
    console.error("Error obteniendo items del usuario:", error);
    return [];
  }
}

// ── Grant item ──────────────────────────────────────────────────
export async function grantObtenibleItem(
  userId: string,
  itemId: string
): Promise<boolean> {
  try {
    // Check if user already owns the item
    const userRef = doc(db, "users", userId);
    const userSnap = await getDoc(userRef);

    if (!userSnap.exists()) {
      console.warn("Usuario no encontrado:", userId);
      return false;
    }

    const userData = userSnap.data();
    const obtained: string[] = userData.obtainedItems ?? [];

    if (obtained.includes(itemId)) {
      console.log(
        `El usuario ya posee el item ${itemId}. Omitiendo.`
      );
      return true; // Already owned, not an error
    }

    // Grant the item using arrayUnion to prevent duplicates
    await updateDoc(userRef, {
      obtainedItems: arrayUnion(itemId),
    });

    console.log(`Item ${itemId} otorgado al usuario ${userId}`);
    return true;
  } catch (error) {
    console.error("Error otorgando item:", error);
    return false;
  }
}

// ── Combine definitions + user status ───────────────────────────
export async function getObteniblesWithStatus(
  userId?: string
): Promise<ObtenibleWithStatus[]> {
  const resolvedUserId = userId ?? getCurrentUserId();

  try {
    // Fetch definitions from Firestore
    const definitions = await getObtenibleDefinitions();

    // If no definitions exist and no user, return empty
    if (definitions.length === 0) return [];

    // If no user, return all as not obtained
    if (!resolvedUserId) {
      return definitions.map((def) => ({
        definition: def,
        obtained: false,
      }));
    }

    // Get user's obtained items
    const obtainedItems = await getUserObtainedItems(resolvedUserId);
    const obtainedSet = new Set(obtainedItems);

    // Merge
    return definitions.map((def) => ({
      definition: def,
      obtained: obtainedSet.has(def.id),
    }));
  } catch (error) {
    console.error("Error obteniendo obtenibles con estado:", error);
    return [];
  }
}
