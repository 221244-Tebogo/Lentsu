import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";

const text = "#E6EEF7";
const sub = "#90A4B8";
const card = "#0E1C2C";
const orange = "#FBBC05";

export default function Emergency() {
  return (
    <View style={styles.wrap}>
      <Text style={styles.h1}>Tap to get help</Text>

      <TouchableOpacity style={styles.sosBtn}>
        <Ionicons name="mic" size={40} color="#fff" />
        <Text style={styles.sosLabel}>Emergency</Text>
      </TouchableOpacity>

      <View style={styles.mapCard}>
        <Ionicons name="location" size={20} color="#FF9C66" />
        <Text style={styles.mapText}>Sharing location...</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { flex: 1, padding: 20 },
  h1: { color: text, 
    fontSize: 26, 
    fontWeight: "800", 
    marginBottom: 24 },

    sosBtn: { alignSelf: "center", 
    backgroundColor: orange, 
    width: 160, 
    height: 160, 
    borderRadius: 80, 
    alignItems: "center", 
    justifyContent: "center", 
    gap: 8 },
    
    sosLabel: { color: "#fff", 
    fontWeight: "800" },

  mapCard: { marginTop: 28, 
    backgroundColor: card, 
    borderRadius: 16, 
    padding: 16, 
    flexDirection: "row", 
    alignItems: "center", 
    gap: 10 },

  mapText: { color: sub, 
    fontWeight: "600" },
});
