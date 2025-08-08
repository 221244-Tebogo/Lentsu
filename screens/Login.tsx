import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, SafeAreaView } from "react-native";
import { loginUser } from "../services/authService";

const text = "#E6EEF7";
const btnBg = "#152233";

export default function Login({ navigation }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function onLogin() {
    try {
      if (!email || !password) return Alert.alert("Missing fields", "Please fill all fields.");
      await loginUser(email.trim(), password);
      navigation.reset({ index: 0, routes: [{ name: "Home" }] });
    } catch (e: any) {
      Alert.alert("Login failed", e.message ?? String(e));
    }
  }

  return (
    <SafeAreaView style={styles.c}>
      <Text style={styles.h}>Login</Text>

      <TextInput
        style={styles.i}
        placeholder="Email"
        placeholderTextColor="#999"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
      />

      <TextInput
        style={styles.i}
        placeholder="Password"
        placeholderTextColor="#999"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      <View style={styles.btnWrap}>
        <TouchableOpacity style={styles.btn} onPress={onLogin}>
          <Text style={styles.btnText}>Login</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.btn, styles.secondaryBtn]} onPress={() => navigation.navigate("Registration")}>
          <Text style={styles.btnText}>No account? Register</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  c: { flex: 1, backgroundColor: "#0B284A", padding: 20, gap: 14, justifyContent: "center" },
  h: { color: "#fff", fontSize: 28, fontWeight: "800", marginBottom: 10 },
  i: { backgroundColor: "#fff", borderRadius: 8, paddingHorizontal: 12, height: 44, color: "#000" },
  btnWrap: { marginTop: 10, gap: 12, paddingHorizontal: 10 }, // ADDED horizontal padding
  btn: { paddingVertical: 14, borderRadius: 12, alignItems: "center", backgroundColor: btnBg },
  secondaryBtn: { backgroundColor: "#1F334D" },
  btnText: { color: text, fontWeight: "800" },
});
