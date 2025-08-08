import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";

const text = "#E6EEF7";
const sub = "#90A4B8";
const card = "#0E1C2C";
const yellow = "#FFC530";
const orange = "#FF7A2F";

export default function Home() {
  const nav = useNavigation<any>();

  return (
    <View style={styles.wrap}>
      <Text style={styles.h1}>Welcome back, <Text style={styles.accent}>Naledi</Text></Text>

      {/* Big primary action */}
      <TouchableOpacity style={styles.primary} onPress={() => nav.navigate("Listen")}>
        <Ionicons name="mic" size={40} color="#fff" />
        <Text style={styles.primaryText}>Tap to speak</Text>
      </TouchableOpacity>

      {/* Quick actions */}
      <View style={styles.row}>
        <TouchableOpacity style={styles.tile} onPress={() => nav.navigate("Emergency")}>
          <Ionicons name="alert-circle" size={22} color={orange} />
          <Text style={styles.tileTitle}>Emergency</Text>
          <Text style={styles.tileSub}>Get help fast</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.tile} onPress={() => nav.navigate("Settings")}>
          <Ionicons name="settings" size={22} color={yellow} />
          <Text style={styles.tileTitle}>Settings</Text>
          <Text style={styles.tileSub}>ICE, language, voice</Text>
        </TouchableOpacity>
      </View>

      {/* Recent activity / status */}
    <View style={styles.row}>
  <TouchableOpacity style={styles.tile} onPress={() => nav.navigate("Emergency")}>
    <Ionicons name="alert-circle" size={22} color={orange} />
    <Text style={styles.tileTitle}>Emergency</Text>
    <Text style={styles.tileSub}>Get help fast</Text>
  </TouchableOpacity>

  <TouchableOpacity style={styles.tile} onPress={() => nav.navigate("Settings")}>
    <Ionicons name="settings" size={22} color={yellow} />
    <Text style={styles.tileTitle}>Settings</Text>
    <Text style={styles.tileSub}>ICE, language, voice</Text>
  </TouchableOpacity>

  <TouchableOpacity style={styles.tile} onPress={() => nav.navigate("Profile")}>
    <Ionicons name="person" size={22} color="#8BC3FF" />
    <Text style={styles.tileTitle}>Profile</Text>
    <Text style={styles.tileSub}>View & edit</Text>
  </TouchableOpacity>
</View>

      </View>
  );
}

const styles = StyleSheet.create({
  wrap: { flex: 1, padding: 20, gap: 16 },
  h1: { color: text, fontSize: 26, fontWeight: "800" },
  accent: { color: yellow },
  primary: {
    backgroundColor: orange,
    borderRadius: 18,
    paddingVertical: 24,
    alignItems: "center",
    gap: 8,
  },
  primaryText: { color: "#fff", fontWeight: "800", fontSize: 16 },
  row: { flexDirection: "row", gap: 12 },
  tile: { flex: 1, backgroundColor: card, borderRadius: 16, padding: 16 },
  tileTitle: { color: text, fontWeight: "800", marginTop: 8 },
  tileSub: { color: sub, marginTop: 4 },
  card: { backgroundColor: card, borderRadius: 16, padding: 16, gap: 10 },
  cardTitle: { color: text, fontWeight: "800", marginBottom: 4 },
  statusRow: { flexDirection: "row", alignItems: "center", gap: 8 },
  statusText: { color: sub },
});
