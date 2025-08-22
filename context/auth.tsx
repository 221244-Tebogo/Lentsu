// // context/auth.tsx
// import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
// import * as WebBrowser from "expo-web-browser";
// import { Platform } from "react-native";
// import { makeRedirectUri } from "expo-auth-session";
// import * as Google from "expo-auth-session/providers/google";
// import { GoogleAuthProvider, signInWithCredential, onAuthStateChanged, User as FBUser } from "firebase/auth";
// import { auth } from "../firebase";
// import { nameFromEmail } from "../utils/name";

// // If RN throws "atob is not defined", uncomment the polyfill below:
// // import { decode as atobPolyfill } from "base-64";
// // // @ts-ignore
// // if (typeof global.atob === "undefined") global.atob = atobPolyfill;

// WebBrowser.maybeCompleteAuthSession();

// type User = { id: string; name?: string | null; email?: string | null; picture?: string | null } | null;
// type AuthCtx = {
//   user: User;
//   isLoading: boolean;
//   error?: any;
//   ready: boolean;
//   signIn: () => Promise<void>;
//   signOut: () => void;
// };

// const Ctx = createContext<AuthCtx | null>(null);

// function mapFirebaseUser(fb: FBUser | null): User {
//   if (!fb) return null;
//   return {
//     id: fb.uid,
//     name: fb.displayName ?? nameFromEmail(fb.email) ?? null,
//     email: fb.email ?? null,
//     picture: fb.photoURL ?? null,
//   };
// }

// const redirectUri =
//   Platform.OS === "web" ? makeRedirectUri({ useProxy: false }) : makeRedirectUri({ useProxy: true });

// export function AuthProvider({ children }: { children: React.ReactNode }) {
//   const [user, setUser] = useState<User>(null);
//   const [isLoading, setLoading] = useState(false);
//   const [error, setError] = useState<any>();

//   // Keep Firebase auth state in sync (page refresh, app resume, etc.)
//   useEffect(() => {
//     const unsub = onAuthStateChanged(auth, (fb) => setUser(mapFirebaseUser(fb)));
//     return unsub;
//   }, []);

//   const [request, response, promptAsync] = Google.useAuthRequest({
//     webClientId: process.env.EXPO_PUBLIC_GOOGLE_CLIENT_ID!,
//     iosClientId: process.env.EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID,
//     androidClientId: process.env.EXPO_PUBLIC_GOOGLE_ANDROID_CLIENT_ID,
//     redirectUri,
//     scopes: ["openid", "profile", "email"], // ensures name/email claims
//   });

//   const ready = !!request;

//   useEffect(() => {
//     if (!response) return;
//     (async () => {
//       try {
//         if (response.type === "success") {
//           // @ts-ignore
//           const idToken: string | undefined = response.params?.id_token;
//           const accessToken = response.authentication?.accessToken as string | undefined;

//           if (idToken) {
//             // 1) Sign into Firebase
//             const cred = GoogleAuthProvider.credential(idToken, accessToken);
//             const userCred = await signInWithCredential(auth, cred);

//             // 2) Take the *Firebase user* for name/email (most reliable)
//             const fb = userCred.user;
//             setUser({
//               id: fb.uid,
//               name: fb.displayName ?? nameFromEmail(fb.email) ?? null,
//               email: fb.email ?? null,
//               picture: fb.photoURL ?? null,
//             });
//           }

//           setError(undefined);
//         } else if (response.type === "error") {
//           setError(response.error);
//         }
//       } catch (e) {
//         setError(e);
//       }
//     })();
//   }, [response]);

//   const signIn = async () => {
//     setError(undefined);
//     if (!ready) return;
//     setLoading(true);
//     try {
//       await promptAsync(); // response handled above
//     } finally {
//       setLoading(false);
//     }
//   };

//   const signOut = () => auth.signOut(); // onAuthStateChanged will set user=null

//   // Debug while configuring
//   console.log("Auth redirectUri →", redirectUri);
//   console.log("Request redirectUri →", request?.redirectUri);

//   const value = useMemo(() => ({ user, isLoading, error, ready, signIn, signOut }), [user, isLoading, error, ready]);
//   return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
// }

// export const useAuth = () => {
//   const v = useContext(Ctx);
//   if (!v) throw new Error("useAuth must be used inside <AuthProvider>");
//   return v;
// };

// context/auth.tsx
import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import * as WebBrowser from "expo-web-browser";
import { Platform } from "react-native";
import { makeRedirectUri } from "expo-auth-session";
import * as Google from "expo-auth-session/providers/google";
import {
  GoogleAuthProvider,
  signInWithCredential,
  onAuthStateChanged,
  User as FBUser,
  signOut as fbSignOut,
} from "firebase/auth";
import { auth } from "../firebase";

// If RN complains "atob is not defined", uncomment:
// import { decode as atobPolyfill } from "base-64";
// // @ts-ignore
// if (typeof global.atob === "undefined") global.atob = atobPolyfill;

WebBrowser.maybeCompleteAuthSession();

type User = { id: string; name?: string | null; email?: string | null; picture?: string | null } | null;
type AuthCtx = {
  user: User;
  isLoading: boolean;
  error?: any;
  ready: boolean;
  signIn: () => Promise<void>;
  signOut: () => Promise<void>;
};

const Ctx = createContext<AuthCtx | null>(null);

function nameFromEmail(email?: string | null) {
  if (!email) return null;
  const raw = (email.split("@")[0] ?? "").replace(/[._-]+/g, " ").trim();
  if (!raw) return null;
  return raw.replace(/\b\w/g, (c) => c.toUpperCase());
}

function mapFirebaseUser(fb: FBUser | null): User {
  if (!fb) return null;
  return {
    id: fb.uid,
    name: fb.displayName ?? nameFromEmail(fb.email) ?? null,
    email: fb.email ?? null,
    picture: fb.photoURL ?? null,
  };
}

// Web uses localhost; native uses Expo proxy
const redirectUri =
  Platform.OS === "web"
    ? makeRedirectUri({ useProxy: false }) // http://localhost:8081
    : makeRedirectUri({ useProxy: true }); // https://auth.expo.io/@<owner>/<slug>

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User>(null);
  const [isLoading, setLoading] = useState(false);
  const [error, setError] = useState<any>();

  // Keep Firebase auth state in sync across refreshes
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (fb) => {
      const mapped = mapFirebaseUser(fb);
      setUser(mapped);
      // console.log("onAuthStateChanged →", mapped);
    });
    return unsub;
  }, []);

  // IMPORTANT: responseType "id_token" to get a JWT on web
  const [request, response, promptAsync] = Google.useAuthRequest({
    webClientId: process.env.EXPO_PUBLIC_GOOGLE_CLIENT_ID!,
    iosClientId: process.env.EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID,
    androidClientId: process.env.EXPO_PUBLIC_GOOGLE_ANDROID_CLIENT_ID,
    redirectUri,
    responseType: "id_token",     // 👈 ensure Google returns an ID token (web)
    scopes: ["openid", "profile", "email"],
  });

  const ready = !!request;

  useEffect(() => {
    if (!response) return;
    (async () => {
      try {
        if (response.type === "success") {
          // @ts-ignore
          const idToken: string | undefined = response.params?.id_token;
          const accessToken = response.authentication?.accessToken as string | undefined;

          if (idToken) {
            const cred = GoogleAuthProvider.credential(idToken, accessToken);
            const userCred = await signInWithCredential(auth, cred); // Firebase sign-in
            setUser(mapFirebaseUser(userCred.user));
          }
          setError(undefined);
        } else if (response.type === "error") {
          setError(response.error);
        }
      } catch (e) {
        setError(e);
      }
    })();
  }, [response]);

  const signIn = async () => {
    setError(undefined);
    if (!ready) return; // don't open popup early
    setLoading(true);
    try {
      // On web, this must match your web client’s JS origin + redirect URI (localhost:8081)
      await promptAsync(); // result handled in useEffect
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    await fbSignOut(auth); // onAuthStateChanged will set user=null
  };

  // Helpful while configuring
  console.log("Auth redirectUri →", redirectUri);
  console.log("Request redirectUri →", request?.redirectUri);

  const value = useMemo(
    () => ({ user, isLoading, error, ready, signIn, signOut }),
    [user, isLoading, error, ready]
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export const useAuth = () => {
  const v = useContext(Ctx);
  if (!v) throw new Error("useAuth must be used inside <AuthProvider>");
  return v;
};
