import { auth } from "@/src/config/firebase";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  onAuthStateChanged,
  User,
} from "firebase/auth";

// ─────────────────────────────────────────────
// LOGIN
// ─────────────────────────────────────────────
export async function login(email: string, password: string): Promise<User> {
  try {
    const result = await signInWithEmailAndPassword(auth, email, password);
    return result.user;
  } catch (error: any) {
    throw new Error(mapAuthError(error.code));
  }
}

// ─────────────────────────────────────────────
// REGISTRO
// ─────────────────────────────────────────────
export async function register(email: string, password: string): Promise<User> {
  try {
    const result = await createUserWithEmailAndPassword(auth, email, password);
    return result.user;
  } catch (error: any) {
    throw new Error(mapAuthError(error.code));
  }
}

// ─────────────────────────────────────────────
// LOGOUT
// ─────────────────────────────────────────────
export async function logout(): Promise<void> {
  try {
    await signOut(auth);
  } catch (error: any) {
    throw new Error("Error al cerrar sesión");
  }
}

// ─────────────────────────────────────────────
// RECUPERAR CONTRASEÑA
// ─────────────────────────────────────────────
export async function resetPassword(email: string): Promise<void> {
  try {
    await sendPasswordResetEmail(auth, email);
  } catch (error: any) {
    throw new Error(mapAuthError(error.code));
  }
}

// ─────────────────────────────────────────────
// OBSERVER - escucha cambios de sesión
// úsalo en tu AuthContext o _layout.tsx
// ─────────────────────────────────────────────
export function onAuthChange(callback: (user: User | null) => void) {
  return onAuthStateChanged(auth, callback);
}

// ─────────────────────────────────────────────
// Mapear errores de Firebase a mensajes en español
// ─────────────────────────────────────────────
function mapAuthError(code: string): string {
  const errors: Record<string, string> = {
    "auth/invalid-email": "El correo electrónico no es válido.",
    "auth/user-disabled": "Esta cuenta ha sido deshabilitada.",
    "auth/user-not-found": "No existe una cuenta con ese correo.",
    "auth/wrong-password": "Contraseña incorrecta.",
    "auth/invalid-credential": "Correo o contraseña incorrectos.",
    "auth/email-already-in-use": "Ya existe una cuenta con ese correo.",
    "auth/weak-password": "La contraseña debe tener al menos 6 caracteres.",
    "auth/too-many-requests": "Demasiados intentos. Intenta más tarde.",
    "auth/network-request-failed": "Error de conexión. Revisa tu internet.",
  };
  return errors[code] ?? "Ocurrió un error inesperado.";
}
