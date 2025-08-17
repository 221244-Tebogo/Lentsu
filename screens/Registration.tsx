// screens/Registration.tsx
import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  SafeAreaView,
} from "react-native";
import { registerUser } from "../services/authService";

const text = "#E6EEF7";
const btnBg = "#152233";
const btnSecondary = "#1F334D";

export default function Registration({ navigation }: any) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const onRegister = async () => {
    try {
      if (!email || !password || !confirmPassword) {
        Alert.alert("Missing fields", "Please fill all fields.");
        return;
      }
      if (password !== confirmPassword) {
        Alert.alert("Password mismatch", "Passwords do not match.");
        return;
      }
      if (password.length < 6) {
        Alert.alert("Weak password", "Password must be at least 6 characters.");
        return;
      }

      setLoading(true);
      await registerUser(email.trim(), password);

      // Clear the form
      setEmail("");
      setPassword("");
      setConfirmPassword("");

      Alert.alert("Success", "Registration complete!");
      // Navigate home or to login as you prefer
      navigation.reset({ index: 0, routes: [{ name: "Home" }] });
    } catch (e: any) {
      // Handle common Firebase auth error codes nicely
      const code = e?.code ?? "";
      if (code === "auth/email-already-in-use") {
        Alert.alert("Email in use", "This email is already registered.");
      } else if (code === "auth/invalid-email") {
        Alert.alert("Invalid email", "Please enter a valid email address.");
      } else if (code === "auth/operation-not-allowed") {
        Alert.alert("Auth disabled", "Email/password sign-in is not enabled in Firebase.");
      } else if (code === "auth/weak-password") {
        Alert.alert("Weak password", "Password must be at least 6 characters.");
      } else {
        Alert.alert("Registration failed", e?.message ?? String(e));
      }
      console.log("Registration failed:", code, e?.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.c}>
      <Text style={styles.h}>Create your account</Text>

      <TextInput
        style={styles.i}
        placeholder="Email"
        autoCapitalize="none"
        autoCorrect={false}
        keyboardType="email-address"
        value={email}
        onChangeText={setEmail}
      />

      <TextInput
        style={styles.i}
        placeholder="Password"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />

      <TextInput
        style={styles.i}
        placeholder="Confirm Password"
        secureTextEntry
        value={confirmPassword}
        onChangeText={setConfirmPassword}
      />

      <View style={styles.btnWrap}>
        <TouchableOpacity style={styles.btn} onPress={onRegister} disabled={loading}>
          <Text style={styles.btnText}>{loading ? "Creating..." : "Register"}</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.btn, styles.secondaryBtn]}
          onPress={() => navigation.navigate("Login")}
          disabled={loading}
        >
          <Text style={styles.btnText}>I already have an account</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  c: {
    flex: 1,
    backgroundColor: "#0B284A",
    padding: 20,
    gap: 14,
    justifyContent: "center",
  },
  h: {
    color: "#fff",
    fontSize: 28,
    fontWeight: "800",
    marginBottom: 10,
  },
  i: {
    backgroundColor: "#fff",
    borderRadius: 8,
    paddingHorizontal: 12,
    height: 44,
    color: "#000",
  },
  btnWrap: {
    marginTop: 10,
    gap: 12,
    paddingHorizontal: 10,
  },
  btn: {
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
    backgroundColor: btnBg,
  },
  secondaryBtn: {
    backgroundColor: btnSecondary,
  },
  btnText: {
    color: text,
    fontWeight: "800",
  },
});


// import { createUserWithEmailAndPassword } from "firebase/auth";
// import { auth } from "../firebase";

// import React, { useState } from "react";
// import {
//   View,
//   Text,
//   TextInput,
//   TouchableOpacity,
//   StyleSheet,
//   Alert,
//   SafeAreaView,
// } from "react-native";
// import { registerUser } from "../services/authService";

// const text = "#E6EEF7";
// const btnBg = "#152233";
// const btnSecondary = "#1F334D";

// export default function Registration({ navigation }) {
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [confirmPassword, setConfirmPassword] = useState("");
// async function onRegister() {
//   try {
//     if (!email || !password || !confirmPassword) {
//       return Alert.alert("Missing fields", "Please fill all fields.");
//     }
//     if (password !== confirmPassword) {
//       return Alert.alert("Password mismatch", "Passwords do not match.");
//     }
//     if (password.length < 6) {
//       return Alert.alert("Weak password", "Password must be at least 6 characters.");
//     }

//     await registerUser(email.trim(), password);
//     navigation.reset({ index: 0, routes: [{ name: "Home" }] });
//   } catch (e: any) {
//     if (e.code === "auth/email-already-in-use") {
//       Alert.alert("Email in use", "This email is already registered.");
//     } else if (e.code === "auth/invalid-email") {
//       Alert.alert("Invalid email", "Please enter a valid email address.");
//     } else {
//       Alert.alert("Registration failed", e.message ?? String(e));
//     }
//   }
// }


// export const registerUser = async (email: string, password: string) => {
//   try {
//     const userCredential = await createUserWithEmailAndPassword(auth, email, password);
//     console.log("User Registered:", userCredential.user.email);
//     return userCredential;
//   } catch (error: any) {
//     console.error("Registration Error:", error.code, error.message);
//     throw error;
//   }
// };

//   return (
//     <SafeAreaView style={styles.c}>
//       <Text style={styles.h}>Register</Text>

//       <TextInput
//         style={styles.i}
//         placeholder="Email"
//         placeholderTextColor="#999"
//         value={email}
//         onChangeText={setEmail}
//         autoCapitalize="none"
//         keyboardType="email-address"
//       />

//       <TextInput
//         style={styles.i}
//         placeholder="Password"
//         placeholderTextColor="#999"
//         value={password}
//         onChangeText={setPassword}
//         secureTextEntry
//       />

//       <TextInput
//         style={styles.i}
//         placeholder="Confirm Password"
//         placeholderTextColor="#999"
//         value={confirmPassword}
//         onChangeText={setConfirmPassword}
//         secureTextEntry
//       />

//       <View style={styles.btnWrap}>
//         <TouchableOpacity style={styles.btn} onPress={onRegister}>
//           <Text style={styles.btnText}>Register</Text>
//         </TouchableOpacity>

//         <TouchableOpacity
//           style={[styles.btn, styles.secondaryBtn]}
//           onPress={() => navigation.navigate("Login")}
//         >
//           <Text style={styles.btnText}>Already have an account? Login</Text>
//         </TouchableOpacity>
//       </View>
//     </SafeAreaView>
//   );
// }

// const styles = StyleSheet.create({
//   c: {
//     flex: 1,
//     backgroundColor: "#0B284A",
//     padding: 20,
//     gap: 14,
//     justifyContent: "center",
//   },
//   h: {
//     color: "#fff",
//     fontSize: 28,
//     fontWeight: "800",
//     marginBottom: 10,
//   },
//   i: {
//     backgroundColor: "#fff",
//     borderRadius: 8,
//     paddingHorizontal: 12,
//     height: 44,
//     color: "#000",
//   },
//   btnWrap: {
//     marginTop: 10,
//     gap: 12,
//     paddingHorizontal: 10,
//   },
//   btn: {
//     paddingVertical: 14,
//     borderRadius: 12,
//     alignItems: "center",
//     backgroundColor: btnBg,
//   },
//   secondaryBtn: {
//     backgroundColor: btnSecondary,
//   },
//   btnText: {
//     color: text,
//     fontWeight: "800",
//   },
// });
