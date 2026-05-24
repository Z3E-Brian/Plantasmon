import { storage, db } from "@/src/config/firebase";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { doc, updateDoc } from "firebase/firestore";
import { getCurrentUserId } from "./userService";

export async function uploadAvatar(uri: string): Promise<string> {
  const uid = getCurrentUserId();
  if (!uid) throw new Error("Usuario no autenticado");

  const response = await fetch(uri);
  const blob = await response.blob();

  const storageRef = ref(storage, `avatars/${uid}`);
  await uploadBytes(storageRef, blob);

  const downloadUrl = await getDownloadURL(storageRef);

  const userRef = doc(db, "users", uid);
  await updateDoc(userRef, { avatarUrl: downloadUrl });

  return downloadUrl;
}
