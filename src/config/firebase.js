import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyB1Xj_H9WcB3Ld8NqwWTKDXE1t53H-CTks",
  authDomain: "plantasmon-32e0b.firebaseapp.com",
  projectId: "plantasmon-32e0b",
  storageBucket: "plantasmon-32e0b.firebasestorage.app",
  messagingSenderId: "988204932281",
  appId: "1:988204932281:web:a83308fb2e94d05e2a8f68",
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
export const auth = getAuth(app);
