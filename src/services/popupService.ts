/**
 * Servicio para el seguimiento de desestimación de popups informativos.
 * 
 * Estrategias de almacenamiento:
 * - Por sesión: `@plantasmon/popup_session:{popupKey}` — se reinicia en cada sesión
 * - Permanente: `@plantasmon/popup_forever:{popupKey}` — nunca se muestra de nuevo
 */
import AsyncStorage from '@react-native-async-storage/async-storage';

// Constantes de namespacing (no exportadas)
const STORAGE_PREFIX = "@plantasmon/popup_";
const SESSION_SUFFIX = "session";
const FOREVER_SUFFIX = "forever";

/** Genera la clave de almacenamiento para desestimación por sesión */
const sessionKey = (key: string) => `${STORAGE_PREFIX}${SESSION_SUFFIX}:${key}`;

/** Genera la clave de almacenamiento para desestimación permanente */
const foreverKey = (key: string) => `${STORAGE_PREFIX}${FOREVER_SUFFIX}:${key}`;

/**
 * Verifica si un popup ha sido desestimado (por sesión o permanentemente).
 * 
 * @param popupKey Identificador único del popup
 * @returns `true` si el popup está desestimado, `false` si debe mostrarse
 */
export async function isPopupDismissed(popupKey: string): Promise<boolean> {
  try {
    // Verificar primero desestimación permanente (prioridad más alta)
    const foreverDismissed = await AsyncStorage.getItem(foreverKey(popupKey));
    if (foreverDismissed === "true") {
      return true;
    }

    // Verificar desestimación por sesión
    const sessionDismissed = await AsyncStorage.getItem(sessionKey(popupKey));
    if (sessionDismissed === "true") {
      return true;
    }

    // Ninguna desestimación encontrada — popup debe mostrarse
    return false;
  } catch (error) {
    console.error(`Error verificando desestimación de popup "${popupKey}":`, error);
    // En caso de error, mostrar el popup (fail-safe)
    return false;
  }
}

/**
 * Desestima un popup para la sesión actual solamente.
 * El popup volverá a mostrarse en la próxima sesión de la app.
 * 
 * Corresponde a botón "Entendido" (D-04).
 * 
 * @param popupKey Identificador único del popup
 */
export async function dismissPopup(popupKey: string): Promise<void> {
  try {
    await AsyncStorage.setItem(sessionKey(popupKey), "true");
  } catch (error) {
    console.error(`Error desestimando popup "${popupKey}" (por sesión):`, error);
    throw error;
  }
}

/**
 * Desestima un popup permanentemente.
 * El popup NUNCA volverá a mostrarse para este dispositivo/usuario.
 * 
 * Corresponde a "No mostrar de nuevo" (D-05).
 * 
 * @param popupKey Identificador único del popup
 */
export async function dismissForever(popupKey: string): Promise<void> {
  try {
    // Establecer ambas banderas: sesión y permanente
    await AsyncStorage.setItem(sessionKey(popupKey), "true");
    await AsyncStorage.setItem(foreverKey(popupKey), "true");
  } catch (error) {
    console.error(`Error desestimando popup "${popupKey}" (permanentemente):`, error);
    throw error;
  }
}

/**
 * Reinicia el estado de desestimación de un popup.
 * Útil para testing o reseteo administrativo.
 * 
 * @param popupKey Identificador único del popup
 */
export async function resetPopup(popupKey: string): Promise<void> {
  try {
    await AsyncStorage.removeItem(sessionKey(popupKey));
    await AsyncStorage.removeItem(foreverKey(popupKey));
  } catch (error) {
    console.error(`Error reseteando popup "${popupKey}":`, error);
    throw error;
  }
}
