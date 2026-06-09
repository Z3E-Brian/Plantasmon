const { initializeApp } = require("firebase/app");
const { getFirestore, doc, setDoc, Timestamp } = require("firebase/firestore");

const firebaseConfig = {
  apiKey: "AIzaSyB1Xj_H9WcB3Ld8NqwWTKDXE1t53H-CTks",
  authDomain: "plantasmon-32e0b.firebaseapp.com",
  projectId: "plantasmon-32e0b",
  storageBucket: "plantasmon-32e0b.firebasestorage.app",
  messagingSenderId: "988204932281",
  appId: "1:988204932281:web:a83308fb2e94d05e2a8f68",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const uid = process.argv[2] || "h5fs3heEomT34vLwbQWwuWOlAqb2";
const name = process.argv[3] || "Usuario";

async function create() {
  await setDoc(doc(db, "users", uid), {
    displayName: name,
    email: "usuario@test.com",
    username: name.toLowerCase().replace(/\s/g, ""),
    aboutme: "Amante de las plantas",
    location: "Sin ubicacion",
    avatarUrl: "",
    rarestFind: "Por descubrir",
    careScore: 0,
    createdAt: Timestamp.now(),
    stats: { level: 1, xp: 0, xpToNextLevel: 1000, plantsIdentified: 0, streakDays: 0, lastWateredDate: null, longestStreak: 0 },
    missions: { assignedDailyIds: [], assignedWeeklyIds: [], missionProgress: [], lastDailyRefresh: null, lastWeeklyRefresh: null },
    obtainedItems: [], settings: { themeId: "theme_forest", titleId: "", frameId: "" },
    userPlants: [], userAchievements: [],
  });
  console.log("✅ Documento creado para:", uid);
}
create().catch((e) => {
  console.error("Error:", e.message);
  process.exit(1);
});
