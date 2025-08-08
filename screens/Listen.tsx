import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";

const text = "#E6EEF7";
const sub = "#90A4B8";
const card = "#0E1C2C";
const ring = "#16314B";
const orange = "#FF7A2F";

export default function Listen() {
  return (
    <View style={styles.wrap}>
      <Text style={styles.h1}>Listen up, <Text style={styles.accent}>Naledi!</Text></Text>

      <View style={styles.micWrap}>
        <View style={styles.micRing}/>
        <View style={styles.micInner}>
          <Ionicons name="mic" size={40} color="#fff" />
        </View>
      </View>

      <Text style={styles.helper}>Tap to speak</Text>

      <View style={styles.row}>
        <TouchableOpacity style={styles.tile}>
          <Ionicons name="call" size={22} color="#8BE28B" />
          <Text style={styles.tileText}>Call ICE</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.tile}>
          <Ionicons name="share-social" size={22} color="#8BC3FF" />
          <Text style={styles.tileText}>Share location</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { flex: 1, padding: 20 },
  h1: { color: text, fontSize: 28, fontWeight: "800", marginBottom: 24 },
  accent: { color: "#FFC530" },
  micWrap: { alignItems: "center", justifyContent: "center", marginVertical: 24 },
  micRing: { width: 180, height: 180, borderRadius: 90, backgroundColor: ring },
  micInner: { position: "absolute", width: 120, height: 120, borderRadius: 60, backgroundColor: orange, alignItems: "center", justifyContent: "center" },
  helper: { color: sub, textAlign: "center" },
  row: { flexDirection: "row", gap: 12, marginTop: 28 },
  tile: { flex: 1, backgroundColor: card, borderRadius: 16, padding: 16, alignItems: "center", gap: 8 },
  tileText: { color: text, fontWeight: "700" },
});
