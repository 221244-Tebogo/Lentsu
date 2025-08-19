import { Platform } from "react-native";
import { initializeApp, getApps, getApp } from "firebase/app";
import {
  getAuth,
  initializeAuth,
  getReactNativePersistence,
  Auth,
} from "firebase/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getFirestore } from "firebase/firestore";
import { getDatabase } from "firebase/database";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyBEZIMhusON6__17T1uo5GDgZh0n_OJFq4",
  authDomain: "lentsu-16a96.firebaseapp.com",
  projectId: "lentsu-16a96",
  storageBucket: "lentsu-16a96.appspot.com",
  messagingSenderId: "1044569860680",
  appId: "1:1044569860680:web:e9c6109b1b0c3738e9c67d",
};

const app = getApps().length ? getApp() : initializeApp(firebaseConfig);

// Auth (web vs native)
let _auth: Auth;
if (Platform.OS === "web") {
  _auth = (globalThis as any)._auth ?? getAuth(app);
} else {
  _auth =
    (globalThis as any)._auth ??
    initializeAuth(app, {
      persistence: getReactNativePersistence(AsyncStorage),
    });
}
(globalThis as any)._auth = _auth;

const db = getFirestore(app);
const rtdb = getDatabase(app);
const storage = getStorage(app);

export { app, _auth as auth, db, rtdb, storage };
