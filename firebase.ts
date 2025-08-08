// firebase.ts
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBEZIMhusON6__17T1uo5GDgZh0n_OJFq4",
  authDomain: "lentsu-16a96.firebaseapp.com",
  projectId: "lentsu-16a96",
  storageBucket: "lentsu-16a96.firebasestorage.app",
  messagingSenderId: "1044569860680",
  appId: "1:1044569860680:web:e9c6109b1b0c3738e9c67d",
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
