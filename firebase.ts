// firebase.ts
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
  //add yours here...
};

const app = getApps().length ? getApp() : initializeApp(firebaseConfig);

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
