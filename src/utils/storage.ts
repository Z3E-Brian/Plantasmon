import * as SecureStore from "expo-secure-store";

const KEYS = {
  SECRET_KEY: "chat_secretKey",
  PUBLIC_KEY: "chat_publicKey",
  NICKNAME: "chat_nickname",
  TOKEN: "chat_token",
  USER_ID: "chat_user_id",
} as const;

export async function saveKeyPair(kp: { secretKey: string; publicKey: string }): Promise<void> {
  if (!kp.secretKey || !kp.publicKey) {
    throw new Error("Las claves no pueden estar vacías");
  }
  await SecureStore.setItemAsync(KEYS.SECRET_KEY, kp.secretKey);
  await SecureStore.setItemAsync(KEYS.PUBLIC_KEY, kp.publicKey);
}

export async function loadKeyPair(): Promise<{ secretKey: string | null; publicKey: string | null }> {
  return {
    secretKey: await SecureStore.getItemAsync(KEYS.SECRET_KEY),
    publicKey: await SecureStore.getItemAsync(KEYS.PUBLIC_KEY),
  };
}

export async function saveNickname(nickname: string): Promise<void> {
  if (!nickname.trim()) {
    throw new Error("El apodo no puede estar vacío");
  }
  await SecureStore.setItemAsync(KEYS.NICKNAME, nickname.trim());
}

export async function loadNickname(): Promise<string | null> {
  return await SecureStore.getItemAsync(KEYS.NICKNAME);
}

export async function saveToken(token: string): Promise<void> {
  if (!token) {
    throw new Error("El token no puede estar vacío");
  }
  await SecureStore.setItemAsync(KEYS.TOKEN, token);
}

export async function loadToken(): Promise<string | null> {
  return await SecureStore.getItemAsync(KEYS.TOKEN);
}

export async function saveUserId(userId: string): Promise<void> {
  if (!userId) {
    throw new Error("El ID de usuario no puede estar vacío");
  }
  await SecureStore.setItemAsync(KEYS.USER_ID, userId);
}

export async function loadUserId(): Promise<string | null> {
  return await SecureStore.getItemAsync(KEYS.USER_ID);
}

export async function clearChatSession(): Promise<void> {
  await SecureStore.deleteItemAsync(KEYS.SECRET_KEY);
  await SecureStore.deleteItemAsync(KEYS.PUBLIC_KEY);
  await SecureStore.deleteItemAsync(KEYS.NICKNAME);
  await SecureStore.deleteItemAsync(KEYS.TOKEN);
  await SecureStore.deleteItemAsync(KEYS.USER_ID);
}
