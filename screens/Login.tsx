// screens/Login.tsx
import React from "react";
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView, ActivityIndicator, Alert } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useAuth } from "../context/auth";

const text = "#E6EEF7";
const btnBg = "#152233";

export default function Login() {
  const navigation = useNavigation();
  const { signIn, isLoading, error, ready, user } = useAuth();

  React.useEffect(() => {
    if (user) {
      // @ts-ignore
      navigation.reset({ index: 0, routes: [{ name: "Home" }] });
    }
  }, [user]);

  React.useEffect(() => {
    if (error) Alert.alert("Google sign-in failed", String(error?.message ?? error));
  }, [error]);

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.h}>Login</Text>
      <View style={styles.btnWrap}>
        <TouchableOpacity
          style={[styles.btn, { backgroundColor: "#DB4437" }]}
          onPress={signIn}
          disabled={!ready || isLoading}
        >
          {isLoading ? (
            <ActivityIndicator color={text} />
          ) : (
            <Text style={styles.btnText}>Login with Google</Text>
          )}
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#0B284A", padding: 20, gap: 14, justifyContent: "center" },
  h: { color: "#fff", fontSize: 28, fontWeight: "800", marginBottom: 10 },
  btnWrap: { marginTop: 10, gap: 12, paddingHorizontal: 10 },
  btn: { paddingVertical: 14, borderRadius: 12, alignItems: "center", backgroundColor: btnBg },
  btnText: { color: text, fontWeight: "800" },
});


// // screens/Login.tsx
// import React from "react";
// import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView, ActivityIndicator, Alert } from "react-native";
// import { useNavigation } from "@react-navigation/native";
// import { useAuth } from "../context/auth";

// const text = "#E6EEF7";
// const btnBg = "#152233";

// export default function Login() {
//   const navigation = useNavigation();
// const { signIn, isLoading, error, ready, user } = useAuth();

//   // if you want: when signed in, go Home
//   React.useEffect(() => {
//     if (user) {
//       // e.g. navigate immediately
//       // @ts-ignore
//       navigation.reset({ index: 0, routes: [{ name: "Home" }] });
//     }
//   }, [user]);

//   React.useEffect(() => {
//     if (error) Alert.alert("Google sign-in failed", String(error?.message ?? error));
//   }, [error]);

//   return (
//     <SafeAreaView style={styles.container}>
//       <Text style={styles.h}>Login</Text>

//       <View style={styles.btnWrap}>
//        <TouchableOpacity
//   style={[styles.btn, { backgroundColor: "#DB4437" }]}
//   onPress={signIn}
//   disabled={!ready || isLoading}          // <— prevent early press
// >
//   <Text style={styles.btnText}>{isLoading ? "Please wait…" : "Login with Google"}</Text>
// </TouchableOpacity>
//       </View>
//     </SafeAreaView>
//   );
// }

// const styles = StyleSheet.create({
//   container: { flex: 1, backgroundColor: "#0B284A", padding: 20, gap: 14, justifyContent: "center" },
//   h: { color: "#fff", fontSize: 28, fontWeight: "800", marginBottom: 10 },
//   btnWrap: { marginTop: 10, gap: 12, paddingHorizontal: 10 },
//   btn: { paddingVertical: 14, borderRadius: 12, alignItems: "center", backgroundColor: btnBg },
//   btnText: { color: text, fontWeight: "800" },
// });



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
// import { useNavigation } from "@react-navigation/native";
// import { loginUser } from "../services/authService";

// import { useGoogleAuth } from "../services/googleAuth";


// const text = "#E6EEF7";
// const btnBg = "#152233";

// const Login = () => {
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const navigation = useNavigation();
//   const { request, response, promptAsync } = useGoogleAuth();


//   async function onLogin() {
//     try {
//       if (!email || !password) {
//         return Alert.alert("Missing fields", "Please fill all fields.");
//       }
//       await loginUser(email.trim(), password);
//       navigation.reset({ index: 0, routes: [{ name: "Home" }] });
//     } catch (e: any) {
//       Alert.alert("Login failed", e.message ?? String(e));
//     }
//   }

//   return (
//     <SafeAreaView style={styles.container}>
//       <Text style={styles.h}>Login</Text>

//       <TextInput
//         style={styles.i}
//         placeholder="Email"
//         placeholderTextColor="#999"
//         value={email}
//         onChangeText={setEmail}
//         keyboardType="email-address"
//       />

//       <TextInput
//         style={styles.i}
//         placeholder="Password"
//         value={password}
//         onChangeText={setPassword}
//         secureTextEntry
//       />

//       <View style={styles.btnWrap}>
//         <TouchableOpacity style={styles.btn} onPress={onLogin}>
//           <Text style={styles.btnText}>Login</Text>
//         </TouchableOpacity>

//         <TouchableOpacity
//           style={[styles.btn, styles.secondaryBtn]}
//           onPress={() => navigation.navigate("Registration")}
//         >
//           <Text style={styles.btnText}>Don't have an account? Register</Text>
//         </TouchableOpacity>


// <TouchableOpacity
//       style={[styles.btn, { backgroundColor: "#DB4437" }]}
//       onPress={() => promptAsync()}   // 👈 triggers Expo’s proxy login
//       disabled={!request}
//     >
//       <Text style={styles.btnText}>Login with Google</Text>
//     </TouchableOpacity>

//       </View>
//     </SafeAreaView>
//   );
// };

// export default Login;

// const styles = StyleSheet.create({
//   container: {
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
//     backgroundColor: "#1F334D",
//   },
//   btnText: {
//     color: text,
//     fontWeight: "800",
//   },
// });


//
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
// import { useNavigation } from "@react-navigation/native";
// import { loginUser } from "../services/authService";

// const text = "#E6EEF7";
// const btnBg = "#152233";

// const Login = () => {
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const navigation = useNavigation();

//   async function onLogin() {
//     try {
//       if (!email || !password) {
//         return Alert.alert("Missing fields", "Please fill all fields.");
//       }
//       await loginUser(email.trim(), password);
//       navigation.reset({ index: 0, routes: [{ name: "Home" }] });
//     } catch (e: any) {
//       Alert.alert("Login failed", e.message ?? String(e));
//     }
//   }

//   return (
//     <SafeAreaView style={styles.container}>
//       <Text style={styles.h}>Login</Text>

//       <TextInput
//         style={styles.i}
//         placeholder="Email"
//         placeholderTextColor="#999"
//         value={email}
//         onChangeText={setEmail}
//         keyboardType="email-address"
//       />

//       <TextInput
//         style={styles.i}
//         placeholder="Password"
//         value={password}
//         onChangeText={setPassword}
//         secureTextEntry
//       />

//       <View style={styles.btnWrap}>
//         <TouchableOpacity style={styles.btn} onPress={onLogin}>
//           <Text style={styles.btnText}>Login</Text>
//         </TouchableOpacity>

//         <TouchableOpacity
//           style={[styles.btn, styles.secondaryBtn]}
//           onPress={() => navigation.navigate("Registration")}
//         >
//           <Text style={styles.btnText}>Don't have an account? Register</Text>
//         </TouchableOpacity>
//       </View>
//     </SafeAreaView>
//   );
// };

// export default Login;

// const styles = StyleSheet.create({
//   container: {
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
//     backgroundColor: "#1F334D",
//   },
//   btnText: {
//     color: text,
//     fontWeight: "800",
//   },
// });

// import React, { useState } from 'react';
// import { View, TextInput, TouchableOpacity, Text } from 'react-native';

// export default function LoginScreen() {
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');

//   return (
//     <View style={{ flex: 1, justifyContent: 'center', padding: 20 }}>
      
//       {/* App Title */}
//       <Text style={{ fontSize: 24, textAlign: 'center', marginBottom: 40 }}>
//         NightRide Safe
//       </Text>

//       {/* Email Input */}
//       <TextInput
//         placeholder="Phone or Email"
//         style={{
//           backgroundColor: '#f2f2f2',
//           padding: 16,
//           borderRadius: 12,
//           marginBottom: 12,
//         }}
//         value={email}
//         onChangeText={setEmail}
//       />

//       {/* Password Input */}
//       <TextInput
//         placeholder="Password"
//         secureTextEntry
//         style={{
//           backgroundColor: '#f2f2f2',
//           padding: 16,
//           borderRadius: 12,
//           marginBottom: 12,
//         }}
//         value={password}
//         onChangeText={setPassword}
//       />

//       {/* Login Button */}
//       <TouchableOpacity
//         style={{
//           backgroundColor: '#e63946',
//           padding: 18,
//           borderRadius: 16,
//           marginTop: 20,
//         }}
//       >
//         <Text style={{ color: 'white', textAlign: 'center', fontSize: 18 }}>
//           Login
//         </Text>
//       </TouchableOpacity>

//       {/* Secondary Actions */}
//       <View style={{ marginTop: 16, alignItems: 'center' }}>
//         <Text style={{ color: '#555' }}>Forgot Password? | Register</Text>
//       </View>
//     </View>
//   );
// }

