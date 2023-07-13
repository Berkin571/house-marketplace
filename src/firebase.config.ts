import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

type FirebaseConfig = {
  apiKey: string;
  authDomain: string;
  projectId: string;
  storageBucket: string;
  messagingSenderId: string;
  appId: string;
};

const firebaseConfig: FirebaseConfig = {
  apiKey: "AIzaSyAX2mOqHLCpPm5Fym4JklpZtfcPegDKGmw",
  authDomain: "house-marketplace-app-e404b.firebaseapp.com",
  projectId: "house-marketplace-app-e404b",
  storageBucket: "house-marketplace-app-e404b.appspot.com",
  messagingSenderId: "482987904519",
  appId: "1:482987904519:web:249ac367917d268182e4a2",
};

export const app = initializeApp(firebaseConfig);
export const db = getFirestore();
