import { db } from "@/src/config/firebase";
import { getUserProfile } from "@/src/services/userService";
import {
  AchievementDefinition,
  INITIAL_ACHIEVEMENTS,
} from "@/src/services/userAchievementsService";
import { getUserPlants } from "@/src/services/userPlantsService";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  updateDoc,
} from "firebase/firestore";

interface UnlockedAchievementEntry {
  id: string;
  unlockedAt: string;
  progress: number;
}

/**
 * Verifica y desbloquea logros para un usuario después de una acción relevante.
 *
 * Lee los logros definidos en Firestore (o usa INITIAL_ACHIEVEMENTS como fallback),
 * compara con el progreso actual del usuario, y escribe los nuevos desbloqueos
 * en el documento del usuario.
 *
 * @param userId - ID del usuario en Firestore
 * @returns Promise<string[]> - IDs de los logros recién desbloqueados
 */
export async function checkAndUnlockAchievements(
  userId: string
): Promise<string[]> {
  try {
    // ── 1. Leer datos del usuario ──────────────────────────────
    const userRef = doc(db, "users", userId);
    const userSnap = await getDoc(userRef);

    if (!userSnap.exists()) {
      console.warn("Usuario no encontrado:", userId);
      return [];
    }

    const userData = userSnap.data();

    // Soporta estructura anidada (subcollections) o plana
    const unlockedAchievements: UnlockedAchievementEntry[] =
      userData.subcollections?.unlockedAchievements ??
      userData.unlockedAchievements ??
      [];

    const unlockedIds = new Set(unlockedAchievements.map((ua) => ua.id));

    // ── 2. Leer definiciones de logros ─────────────────────────
    let allAchievements: AchievementDefinition[];
    const achSnap = await getDocs(collection(db, "achievements"));

    if (achSnap.empty) {
      console.warn(
        "Colección 'achievements' vacía — usando INITIAL_ACHIEVEMENTS como fallback"
      );
      allAchievements = INITIAL_ACHIEVEMENTS;
    } else {
      allAchievements = achSnap.docs.map(
        (d) => ({ id: d.id, ...d.data() } as AchievementDefinition)
      );
    }

    // ── 3. Obtener progreso del usuario ────────────────────────
    const userProfile = await getUserProfile(userId);
    if (!userProfile) {
      console.warn("No se pudo cargar el perfil del usuario");
      return [];
    }

    const userPlants = await getUserPlants(userId);

    // Especies distintas (por nombre científico)
    const distinctSpecies = new Set(
      userPlants.map((p) => p.scientificName).filter(Boolean)
    );
    const speciesCount = distinctSpecies.size;

    // Días desde que se unió
    const joinDate = userProfile.joinDate;
    const daysActive = Math.max(
      0,
      Math.floor((Date.now() - joinDate.getTime()) / (1000 * 60 * 60 * 24))
    );

    // ── 4. Evaluar cada logro no desbloqueado ──────────────────
    const newlyUnlocked: string[] = [];

    for (const achievement of allAchievements) {
      if (unlockedIds.has(achievement.id)) continue;

      const { type, count } = achievement.requirement;
      let progress = 0;
      let isUnlocked = false;

      switch (type) {
        case "identifications":
          progress = userProfile.plantsOwned;
          isUnlocked = progress >= count;
          break;

        case "streak":
          progress = userProfile.streak;
          isUnlocked = progress >= count;
          break;

        case "species":
          progress = speciesCount;
          isUnlocked = progress >= count;
          break;

        case "waterings":
          // Usa streak como proxy para cantidad total de riegos
          // TODO: reemplazar con totalWaterings cuando exista el campo
          progress = userProfile.streak;
          isUnlocked = progress >= count;
          break;

        case "days_active":
          progress = daysActive;
          isUnlocked = progress >= count;
          break;

        default:
          console.warn(
            `Tipo de requisito no implementado: "${type}" para logro "${achievement.id}"`
          );
          continue;
      }

      if (isUnlocked) {
        const entry: UnlockedAchievementEntry = {
          id: achievement.id,
          unlockedAt: new Date().toISOString(),
          progress,
        };

        // Escribir en la ruta que corresponda (subcollections o plano)
        const fieldPath =
          userData.subcollections?.unlockedAchievements !== undefined
            ? "subcollections.unlockedAchievements"
            : "unlockedAchievements";

        const currentList: UnlockedAchievementEntry[] =
          userData.subcollections?.unlockedAchievements ??
          userData.unlockedAchievements ??
          [];

        await updateDoc(userRef, {
          [fieldPath]: [...currentList, entry],
        });

        console.log(
          `🏆 Logro desbloqueado: ${achievement.name} (${achievement.id})`
        );
        newlyUnlocked.push(achievement.id);
      }
    }

    return newlyUnlocked;
  } catch (error) {
    console.error("Error verificando logros:", error);
    return [];
  }
}
