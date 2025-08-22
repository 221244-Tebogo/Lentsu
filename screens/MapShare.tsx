import React, { useEffect, useState, useCallback } from "react";
import {
  StyleSheet,
  View,
  Text,
  Share,
  Alert,
  TouchableOpacity,
  ActivityIndicator,
  Platform,
} from "react-native";
import * as Location from "expo-location";
import type { Region } from "react-native-maps";
import { Ionicons } from "@expo/vector-icons";
import MapViewWrapper from "../components/MapViewWrapper";
import { useNavigation } from "@react-navigation/native";

const YELLOW = "#FBBC05";
const TEXT = "#E6EEF7";
const SUB = "#BFD0E2";

export default function MapShare() {
  const nav = useNavigation<any>();

  const [location, setLocation] = useState<Location.LocationObject | null>(null);
  const [region, setRegion] = useState<Region>({
    latitude: -26.2708,
    longitude: 28.1123,
    latitudeDelta: 0.01,
    longitudeDelta: 0.01,
  });
  const [loading, setLoading] = useState(true);
  const [working, setWorking] = useState(false);

  // initial permission + locate
  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        Alert.alert("Permission denied", "Location access is required to share your position.");
        setLoading(false);
        return;
      }
      await recenter();
      setLoading(false);
    })();
  }, []);

  const recenter = useCallback(async () => {
    try {
      setWorking(true);
      const currentLocation = await Location.getCurrentPositionAsync({});
      setLocation(currentLocation);
      setRegion((prev) => ({
        ...prev,
        latitude: currentLocation.coords.latitude,
        longitude: currentLocation.coords.longitude,
      }));
    } catch {
      Alert.alert("Error", "Could not get your current location.");
    } finally {
      setWorking(false);
    }
  }, []);

  const handleShareLocation = async () => {
    if (!location) {
      Alert.alert("Location not available", "Try again in a few seconds.");
      return;
    }
    const { latitude, longitude } = location.coords;
    const url = `https://www.google.com/maps?q=${latitude},${longitude}`;
    try {
      await Share.share({
        message: `Here's my location: ${url}`,
        url,
        title: "Share Location",
      });
    } catch {
      Alert.alert("Error", "Failed to share location.");
    }
  };

  const coordsLabel =
    location
      ? `Ready • ${location.coords.latitude.toFixed(4)}, ${location.coords.longitude.toFixed(4)}`
      : "Getting location…";

  return (
    <View style={styles.root}>
      {/* Map fills the screen; our controls float above */}
      <MapViewWrapper region={region} showsUserLocation style={StyleSheet.absoluteFillObject as any} />

      {/* Bottom info + actions (thumb zone) */}
      <View style={styles.bottom}>
        {/* subtle status text */}
        <Text style={styles.meta}>{coordsLabel}</Text>

        {/* Primary Share button */}
        <TouchableOpacity
          style={styles.primaryBtn}
          onPress={handleShareLocation}
          activeOpacity={0.95}
          disabled={loading || working}
        >
          {loading || working ? (
            <ActivityIndicator />
          ) : (
            <Text style={styles.primaryText}>Share My Location</Text>
          )}
        </TouchableOpacity>

        {/* Utility row: Recenter + Home */}
        <View style={styles.utilityRow}>
          <TouchableOpacity style={styles.pillBtn} onPress={recenter} activeOpacity={0.9} disabled={working}>
            {working ? (
              <ActivityIndicator />
            ) : (
              <>
                <Ionicons name="locate-outline" size={16} color={YELLOW} style={{ marginRight: 6 }} />
                <Text style={styles.pillText}>Recenter</Text>
              </>
            )}
          </TouchableOpacity>

          <TouchableOpacity style={styles.homeChip} onPress={() => nav.navigate("Home")} activeOpacity={0.9}>
            <Ionicons name="home-outline" size={16} color="#0B0F14" style={{ marginRight: 6 }} />
            <Text style={styles.homeChipText}>Home</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: "transparent" },

  bottom: {
    position: "absolute",
    left: 16,
    right: 16,
    bottom: 20,
    gap: 12,
  },

  meta: {
    alignSelf: "center",
    color: SUB,
    fontSize: 12,
    fontFamily: Platform.select({
      ios: "Poppins-Regular",
      android: "Poppins_400Regular",
      default: "Poppins_400Regular",
    }),
  },

  primaryBtn: {
    backgroundColor: YELLOW,
    borderRadius: 16,
    paddingVertical: 16,
    alignItems: "center",
    justifyContent: "center",
    elevation: 2,
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
  },
  primaryText: {
    color: "#0B0F14",
    fontSize: 16,
    fontFamily: Platform.select({
      ios: "Poppins-SemiBold",
      android: "Poppins_600SemiBold",
      default: "Poppins_600SemiBold",
    }),
  },

  utilityRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  pillBtn: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: YELLOW,
    backgroundColor: "rgba(0,0,0,0.25)",
  },
  pillText: {
    color: YELLOW,
    fontSize: 12,
    fontFamily: Platform.select({
      ios: "Poppins-Medium",
      android: "Poppins_500Medium",
      default: "Poppins_500Medium",
    }),
  },

  homeChip: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 999,
    backgroundColor: YELLOW,
  },
  homeChipText: {
    color: "#0B0F14",
    fontSize: 12,
    fontFamily: Platform.select({
      ios: "Poppins-Medium",
      android: "Poppins_500Medium",
      default: "Poppins_500Medium",
    }),
  },
});
