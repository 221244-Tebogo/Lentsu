import React, { useMemo } from "react";
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Platform,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { getUserInfo } from "../services/authService";

const YELLOW = "#FBBC05";
const TEXT = "#E6EEF7";
const SUB = "#90A4B8";
const CARD = "#0E1C2C";
const GOOGLE_RED = "#DB4437";

type RowProps = {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  value?: string;
  onPress?: () => void;
};

function Row({ icon, label, value, onPress }: RowProps) {
  return (
    <TouchableOpacity style={styles.row} onPress={onPress} activeOpacity={0.8}>
      <View style={styles.rowLeft}>
        <Ionicons name={icon} size={20} color={YELLOW} style={{ marginRight: 10 }} />
        <Text style={styles.rowLabel}>{label}</Text>
      </View>
      {!!value && <Text style={styles.rowValue}>{value}</Text>}
      <Ionicons name="chevron-forward" size={18} color={SUB} />
    </TouchableOpacity>
  );
}

export default function Settings() {
  const navigation = useNavigation<any>();
  const user = getUserInfo();

  const displayName = useMemo(
    () =>
      user?.displayName ||
      (user?.email ? user.email.split("@")[0] : "User"),
    [user?.displayName, user?.email]
  );

  const initials = useMemo(() => {
    const src = user?.displayName || user?.email || "U";
    const parts = String(src).replace(/@.*/, "").split(/\s|\.|_/).filter(Boolean);
    const a = parts[0]?.[0] || "U";
    const b = parts[1]?.[0] || "";
    return (a + b).toUpperCase();
  }, [user?.displayName, user?.email]);

  const handleSignOut = () => {
    navigation.reset({ index: 0, routes: [{ name: "Login" }] });
  };

  return (
    <SafeAreaView style={styles.root}>
   
      <View style={styles.center}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{initials}</Text>
        </View>
        <Text style={styles.name}>{displayName}</Text>
        <Text style={styles.email}>{user?.email ?? "-"}</Text>
      </View>

      {/* Settings card */}
      <View style={styles.card}>
        <Row icon="people"   label="ICE Contacts" value="3 saved" onPress={() => navigation.navigate("Profile")} />
        <Row icon="language" label="Language"    value="Setswana" onPress={() => {}} />
        <Row icon="megaphone"label="Voice"       value="Female"   onPress={() => {}} />
        <Row icon="options"  label="Preferences"                 onPress={() => {}} />
      </View>

      {/* Bottom thumb-zone actions */}
      <View style={styles.bottom}>
        <TouchableOpacity style={styles.btnOutlineDestructive} onPress={handleSignOut} activeOpacity={0.9}>
          <Text style={styles.btnOutlineDestructiveText}>Sign Out</Text>
        </TouchableOpacity>

        <View style={styles.utilityRow}>
          <View style={{ width: 1 }} />
          <TouchableOpacity
            style={styles.homeChip}
            activeOpacity={0.9}
            onPress={() => navigation.navigate("Home")}
          >
            <Ionicons name="home-outline" size={16} color="#0B0F14" style={{ marginRight: 6 }} />
            <Text style={styles.homeChipText}>Home</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: "transparent", paddingHorizontal: 20 },
  center: { alignItems: "center", justifyContent: "center", paddingTop: 24, paddingBottom: 12 },

  avatar: {
    width: 96, height: 96, borderRadius: 48,
    backgroundColor: YELLOW, alignItems: "center", justifyContent: "center",
    shadowColor: "#000", shadowOpacity: 0.2, shadowRadius: 12, elevation: 6,
  },
  avatarText: {
    color: "#0B0F14", fontSize: 34, letterSpacing: 1,
    fontFamily: Platform.select({ ios: 
      "Poppins-SemiBold", android:
       "Poppins_600SemiBold", 
       default: "Poppins_600SemiBold" }),
  },
  name: {
    color: "#FFFFFF", fontSize: 22, marginTop: 12,
    fontFamily: Platform.select({ ios: "Poppins-SemiBold", android: "Poppins_600SemiBold", default: "Poppins_600SemiBold" }),
  },
  email: {
    color: TEXT, opacity: 0.9, fontSize: 13, marginTop: 4,
    fontFamily: Platform.select({ ios: "Poppins-Regular", 
      android: "Poppins_400Regular", 
      default: "Poppins_400Regular" }),
  },

  card: {
    backgroundColor: CARD, 
    borderRadius: 16, padding: 12, gap: 10, marginTop: 16,
  },
  row: {
    flexDirection: "row", alignItems: "center",
    paddingVertical: 12, paddingHorizontal: 6,
  },
  rowLeft: { flexDirection: "row", alignItems: "center", flex: 1 },
  rowLabel: {
    color: TEXT,
    fontSize: 15,
    fontFamily: Platform.select({ ios: "Poppins-Medium",
      android: "Poppins_500Medium",
       default: "Poppins_500Medium" }),
  },
  rowValue: {
    color: SUB,
    marginRight: 8,
    fontSize: 13,
    fontFamily: Platform.select({ ios: "Poppins-Regular", android: "Poppins_400Regular", default: "Poppins_400Regular" }),
  },

  bottom: { paddingVertical: 16, gap: 12 },
  btnOutlineDestructive: {
    borderWidth: 1, borderColor: GOOGLE_RED, borderRadius: 16,
    paddingVertical: 16, alignItems: "center", justifyContent: "center",
  },
  btnOutlineDestructiveText: {
    color: GOOGLE_RED, fontSize: 16,
    fontFamily: Platform.select({ ios: "Poppins-Medium", android: "Poppins_500Medium", default: "Poppins_500Medium" }),
  },

  utilityRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginTop: 6 },

  homeChip: {
    flexDirection: "row", alignItems: "center",
    paddingHorizontal: 12, paddingVertical: 8, borderRadius: 999, backgroundColor: YELLOW,
  },
  homeChipText: {
    color: "#0B0F14", fontSize: 12,
    fontFamily: Platform.select({ ios: "Poppins-Medium", android: "Poppins_500Medium", default: "Poppins_500Medium" }),
  },
});
