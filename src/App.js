import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs } from "firebase/firestore/lite";

const firebaseConfig = {
  apiKey: "AIzaSyCkD50M6XKeVkPQYIygb1_rSjdmOfFyoo0",
  authDomain: "photo-tagging-app-1b523.firebaseapp.com",
  projectId: "photo-tagging-app-1b523",
  storageBucket: "photo-tagging-app-1b523.appspot.com",
  messagingSenderId: "308150812667",
  appId: "1:308150812667:web:ed1c5e8a7e60d64b82d55e",
  measurementId: "G-X4K06VV8H3",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Get a list of liders from your database
async function getLiderboard(db) {
  const leaderboard = collection(db, "leaderboard");
  const leaderboardSnapshot = await getDocs(leaderboard);
  const leadersboardList = leaderboardSnapshot.docs.map((doc) => doc.data());
  return leadersboardList;
}

let leaderboard = getLiderboard(db);
console.log(leaderboard);

function App() {
  return <div>Leaderboard: </div>;
}

export default App;
