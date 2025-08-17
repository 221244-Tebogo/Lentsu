import React from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";

const text = "#E6EEF7";
const sub = "#90A4B8";
const card = "#0E1C2C";
const yellow = "#FFC530";

const Row = ({ icon, label, value }: { icon: any; label: string; value?: string }) => (
  <View style={styles.row}>
    <Ionicons name={icon} size={20} color={yellow} />
    <Text style={styles.rowLabel}>{label}</Text>
    {value ? <Text style={styles.rowValue}>{value}</Text> : null}
  </View>
);

export default function Settings() {
  const navigation = useNavigation();

  const handleSignOut = () => {
    navigation.reset({
      index: 0,
      routes: [{ name: "Login" as never }],
    });
  };

  return (
    <View style={styles.wrap}>
      {/* HEADER */}
      <View style={styles.header}>
        <Image
          source={{
            uri: "https://unsplash.com/photos/woman-looking-back-while-smiling-DrVJk1EaPSc",
          }}
          style={styles.avatar}
        />
        <View>
          <Text style={styles.name}>Naledi Mokoena</Text>
          <Text style={styles.email}>naledi.mokoena@example.com</Text>
        </View>
      </View>

      {/* SETTINGS CARD */}
      <View style={styles.card}>
        <Row icon="people" label="ICE Contacts" value="3 saved" />
        <Row icon="language" label="Language" value="Setswana" />
        <Row icon="megaphone" label="Voice" value="Female" />
        <Row icon="options" label="Preferences" />
      </View>

      {/* LOGOUT BUTTON */}
      <TouchableOpacity style={styles.logout} onPress={handleSignOut}>
        <Text style={styles.logoutText}>Sign Out</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { flex: 1, padding: 20 },
  header: { 
    flexDirection: "row", 
    alignItems: "center", 
    gap: 14, 
    marginBottom: 16
   },

  avatar: { 
    width: 60, 
    height: 60, 
    borderRadius: 30 
  },

  name: { 
    color: text, 
    fontWeight: "800", 
    fontSize: 22 
  },

  email: { 
    color: sub 

  },

  card: { backgroundColor: card, 
    borderRadius: 16, 
    padding: 12, 
    gap: 14 
  },

  row: { 
    flexDirection: "row", 
    alignItems: "center", 
    gap: 12 
  },

  rowLabel: { 
    color: text, 
    fontWeight: "700", 
    flex: 1 
  },

  rowValue: { 
    color: sub, 
    fontWeight: "600" 
  },

  logout: { 
    marginTop: 20, 
    paddingVertical: 14, 
    borderRadius: 12, 
    alignItems: "center", 
    backgroundColor: "#152233" 
  },

  logoutText: { 
    color: text, 
    fontWeight: "800" 
  },
});
