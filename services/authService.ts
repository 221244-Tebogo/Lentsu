import { auth } from "../firebase";
import { doc, getDoc } from "firebase/firestore";

import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  UserCredential,
} from "firebase/auth";
import { db as firestoreDb } from "../firebase";

/**
 * Registers a user with email/password.
 */
export async function registerUser(
  email: string,
  password: string
): Promise<UserCredential> {
  try {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );
    console.log("User Registered:", userCredential.user.email);
    return userCredential;
  } catch (error: any) {
    console.log("Registration Error:", error?.code, error?.message);
    throw error;
  }
}

/**
 * Logs a user in with email/password.
 */
export async function loginUser(
  email: string,
  password: string
): Promise<UserCredential> {
  try {
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password
    );
    console.log("User Logged In:", userCredential.user.email);
    return userCredential;
  } catch (error: any) {
    console.log("Login Error:", error?.code, error?.message);
    throw error;
  }
}

/**
 * Logs out current user.
 */
export async function logoutUser(): Promise<void> {
  await signOut(auth);
  console.log("User Logged Out.");
}

/**
 * Returns the current user or null.
 */
export function getUserInfo() {
  return auth.currentUser ?? null;
}

//export doc
export async function getUserDoc(uid: string): Promise<any | null> {
  const docRef = doc(firestoreDb, "users", uid);
  const docSnap = await getDoc(docRef);
  if (docSnap.exists()) {
    return docSnap.data();
  } else {
    console.log("No such document for UID:", uid);
    return null;
  }
}
// // TODO: Create Firebase Auth Functions

// import { signInWithEmailAndPassword, signOut } from "firebase/auth";
// import { createUserWithEmailAndPassword } from "firebase/auth";
// import { auth } from "../firebase";

// //Register new user

//     const user = userCredential.user;
//     console.log("User Registered:", user.email);
//     return userCredential;
//   } catch (error) {
//     console.log("Registration Error:", error.message);
//     throw error;
//   }
// };

// //creating login
// export const loginUser = (email: string, password: string) => {
//   signInWithEmailAndPassword(auth, email, password)
//     .then((userCredential) => {
//       // Signed up
//       const user = userCredential.user;
//       console.log("User Logged In:", user.email);
//     })
//     .catch((error) => {
//       const errorCode = error.code;
//       const errorMessage = error.message;
//       console.log("Error Message:", errorMessage);
//     });
// };
// //TODO: REGISTRATION FUNCTIONALITY HOMEWORK
// export const logoutUser = () => {
//   signOut(auth).then(() => {
//     console.log("User Logged Out....");
//   });
// };

// export const getUserInfo = () => {
//   const user = auth.currentUser;

//   if (user) {
//     //logic handling and to not get null err
//     return user;
//   } else {
//     return null;
//   }
// };
// //5W4U6agRTOdgg8drjFN4XNf3yZn1

// //FIREBASE GOOGLE SETUP
// // Important: To enable Google Sign-In for your Android apps, you must provide the SHA-1 release fingerprint for each app (go to Project settings > Your apps section).

// // Update the project-level setting below to continue
// // Public-facing name for project

// // project-1044569860680
// // Support email for project

// // 221244@virtualwindow.co.za
