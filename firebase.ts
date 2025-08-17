import { Platform } from "react-native";
import { initializeApp, getApps, getApp } from "firebase/app";
import {
  getAuth,
  initializeAuth,
  getReactNativePersistence,
  Auth,
} from "firebase/auth";
// import AsyncStorage from "@react-native-async-storage/async-storage";
// import { getFirestore } from "firebase/firestore";
// import { getDatabase } from "firebase/database";

// const firebaseConfig = {
//   apiKey: "AIzaSyBEZIMhusON6__17T1uo5GDgZh0n_OJFq4",
//   authDomain: "lentsu-16a96.firebaseapp.com",
//   projectId: "lentsu-16a96",
//   storageBucket: "lentsu-16a96.firebasestorage.app",
//   messagingSenderId: "1044569860680",
//   appId: "1:1044569860680:web:e9c6109b1b0c3738e9c67d",
// };
// App singleton
const app = getApps().length ? getApp() : initializeApp(firebaseConfig);

// Auth singleton (handle RN vs Web, avoid double-initialization during HMR)
let _auth: Auth;

if (Platform.OS === "web") {
  // Web can just use getAuth
  _auth = (globalThis as any)._auth ?? getAuth(app);
} else {
  // Native must use initializeAuth to set AsyncStorage persistence
  _auth =
    (globalThis as any)._auth ??
    initializeAuth(app, {
      persistence: getReactNativePersistence(AsyncStorage),
    });
}

(globalThis as any)._auth = _auth;

// Other services
const db = getFirestore(app);
const rtdb = getDatabase(app);

export { app, _auth as auth, db, rtdb };

// import { initializeApp } from "firebase/app";
// import { getAuth } from "firebase/auth";
// import { getFirestore } from "firebase/firestore";
// import { getDatabase, ref, set } from "firebase/database"; //Realtime DB
// // Import the functions you need from the SDKs you need

// // TODO: Add SDKs for Firebase products that you want to use
// // https://firebase.google.com/docs/web/setup#available-libraries

// // Your web app's Firebase configuration
// const firebaseConfig = {
//   apiKey: "AIzaSyBEZIMhusON6__17T1uo5GDgZh0n_OJFq4",
//   authDomain: "lentsu-16a96.firebaseapp.com",
//   projectId: "lentsu-16a96",
//   storageBucket: "lentsu-16a96.firebasestorage.app",
//   messagingSenderId: "1044569860680",
//   appId: "1:1044569860680:web:e9c6109b1b0c3738e9c67d",
// };

// // Initialize Firebase
// const app = initializeApp(firebaseConfig);
// const realtimeDb = getDatabase(app);
// export const auth = getAuth(app);
// export const db = getFirestore(app);
