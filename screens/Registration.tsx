import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, SafeAreaView } from "react-native";
import { registerUser } from "../services/authService";

const text = "#E6EEF7";
const btnBg = "#152233";
const btnSecondary = "#1F334D";

export default function Registration({ navigation }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  async function onRegister() {
    try {
      if (!email || !password || !confirmPassword) {
        return Alert.alert("Missing fields", "Please fill all fields.");
      }
      if (password !== confirmPassword) {
        return Alert.alert("Password mismatch", "Passwords do not match.");
      }
      await registerUser(email.trim(), password);
      navigation.reset({ index: 0, routes: [{ name: "Home" }] });
    } catch (e: any) {
      Alert.alert("Registration failed", e.message ?? String(e));
    }
  }

  return (
    <SafeAreaView style={styles.c}>
      <Text style={styles.h}>Register</Text>

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

      <TextInput
        style={styles.i}
        placeholder="Confirm Password"
        placeholderTextColor="#999"
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        secureTextEntry
      />

      <View style={styles.btnWrap}>
        <TouchableOpacity style={styles.btn} onPress={onRegister}>
          <Text style={styles.btnText}>Register</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.btn, styles.secondaryBtn]}
          onPress={() => navigation.navigate("Login")}
        >
          <Text style={styles.btnText}>Already have an account? Login</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  c: { flex: 1, backgroundColor: "#0B284A", padding: 20, gap: 14, justifyContent: "center" },
  h: { color: "#fff", fontSize: 28, fontWeight: "800", marginBottom: 10 },
  i: {
    backgroundColor: "#fff",
    borderRadius: 8,
    paddingHorizontal: 12,
    height: 44,
    color: "#000",
  },
  btnWrap: { marginTop: 10, gap: 12, paddingHorizontal: 10 },
  btn: { paddingVertical: 14, 
    borderRadius: 12, 
    alignItems: "center", 
    backgroundColor: btnBg },
  secondaryBtn: { backgroundColor: btnSecondary },
  btnText: { color: text, fontWeight: "800" },
});
