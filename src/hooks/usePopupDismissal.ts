/**
 * Hook React para el manejo de estado de popups informativos.
 * 
 * Envuelve popupService en un hook con manejo de estado React.
 * 
 * Modos de desestimación (D-04, D-05):
 * - Por sesión: Botón "Entendido" — popup vuelve a mostrarse en próxima sesión
 * - Permanente: "No mostrar de nuevo" — popup NUNCA vuelve a mostrarse
 */
import { useState, useEffect, useCallback } from "react";
import {
  isPopupDismissed,
  dismissPopup,
  dismissForever,
  resetPopup as resetPopupService,
} from "@/src/services/popupService";

/**
 * Opciones para el hook usePopupDismissal.
 */
export interface UsePopupDismissalOptions {
  /** Identificador único del popup */
  popupKey: string;
  /** Si `true` (predeterminado), verifica el estado de desestimación al montar */
  autoCheck?: boolean;
}

/**
 * Valor de retorno del hook usePopupDismissal.
 */
export interface UsePopupDismissalReturn {
  /** Si el popup debe ser visible en este momento */
  visible: boolean;
  /**
   * Desestima el popup por sesión solamente.
   * Llamar cuando el usuario toca "Entendido".
   */
  dismiss: () => Promise<void>;
  /**
   * Desestima el popup permanentemente.
   * Llamar cuando el usuario marca "No mostrar de nuevo" y desestima.
   */
  dismissForeverFn: () => Promise<void>;
  /**
   * Reinicia ambas banderas de desestimación.
   * Útil para testing o reseteo administrativo.
   * El popup volverá a estar visible.
   */
  reset: () => Promise<void>;
  /**
   * Vuelve a verificar AsyncStorage y actualiza el estado `visible`.
   * Útil después de cambios en segundo plano o al volver a primer plano.
   */
  checkDismissal: () => Promise<void>;
}

/**
 * Hook React para manejar el estado de visibilidad de popups informativos
 * con seguimiento de desestimación por sesión y permanente.
 * 
 * @example
 * const { visible, dismiss, dismissForeverFn } = usePopupDismissal({ popupKey: "welcome_tip" });
 * 
 * @param options Configuración del hook
 * @returns Estado y acciones para controlar el popup
 */
export function usePopupDismissal(
  options: UsePopupDismissalOptions
): UsePopupDismissalReturn {
  const { popupKey, autoCheck = true } = options;

  // Estado de visibilidad del popup (inicialmente oculto hasta verificación
  const [visible, setVisible] = useState<boolean>(false);

  /**
   * Verifica AsyncStorage y actualiza el estado de visibilidad.
   */
  const checkDismissal = useCallback(async () => {
    try {
      const dismissed = await isPopupDismissed(popupKey);
      // Popup es visible si NO está desestimado
      setVisible(!dismissed);
    } catch (error) {
      console.error(`Error en checkDismissal para "${popupKey}":`, error);
      // En caso de error, mostrar el popup (fail-safe)
      setVisible(true);
    }
  }, [popupKey]);

  /**
   * Desestima por sesión: botón "Entendido" (D-04).
   */
  const dismiss = useCallback(async () => {
    try {
      await dismissPopup(popupKey);
      setVisible(false);
    } catch (error) {
      console.error(`Error en dismiss para "${popupKey}":`, error);
    }
  }, [popupKey]);

  /**
   * Desestima permanentemente: "No mostrar de nuevo" (D-05).
   */
  const dismissForeverFn = useCallback(async () => {
    try {
      await dismissForever(popupKey);
      setVisible(false);
    } catch (error) {
      console.error(`Error en dismissForeverFn para "${popupKey}":`, error);
    }
  }, [popupKey]);

  /**
   * Reinicia el estado: útil para testing.
   */
  const reset = useCallback(async () => {
    try {
      await resetPopupService(popupKey);
      // Después de reiniciar, el popup debe estar visible
      setVisible(true);
    } catch (error) {
      console.error(`Error en reset para "${popupKey}":`, error);
    }
  }, [popupKey]);

  // Verificación automática al montar (si autoCheck no es false)
  useEffect(() => {
    if (autoCheck !== false) {
      checkDismissal();
    }
  }, []); // popupKey es estable por uso del componente — no necesita ser dependencia

  return {
    visible,
    dismiss,
    dismissForeverFn,
    reset,
    checkDismissal,
  };
}
