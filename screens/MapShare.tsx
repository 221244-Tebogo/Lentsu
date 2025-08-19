import React, { useEffect, useState } from "react";
import { StyleSheet, View, Button, Share, Alert } from "react-native";
import * as Location from "expo-location";
import type { Region } from "react-native-maps";
import MapViewWrapper from "../components/MapViewWrapper";

export default function MapShare() {
  const [location, setLocation] = useState<Location.LocationObject | null>(null);
  const [region, setRegion] = useState<Region>({
    latitude: -26.2708,
    longitude: 28.1123,
    latitudeDelta: 0.01,
    longitudeDelta: 0.01,
  });

  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        Alert.alert("Permission denied", "Location access is required to share your position.");
        return;
      }

      const currentLocation = await Location.getCurrentPositionAsync({});
      setLocation(currentLocation);
      setRegion((prev) => ({
        ...prev,
        latitude: currentLocation.coords.latitude,
        longitude: currentLocation.coords.longitude,
      }));
    })();
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

  return (
    <View style={styles.container}>
      {/* On native this renders react-native-maps; on web it renders an iframe */}
      <MapViewWrapper region={region} showsUserLocation={true} />
      <View style={styles.buttonContainer}>
        <Button title="Share My Location" onPress={handleShareLocation} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  buttonContainer: { position: "absolute", bottom: 40, left: 20, right: 20 },
});


