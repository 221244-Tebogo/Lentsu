import React, { useCallback, useRef, useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image, Alert, ActivityIndicator } from "react-native";
import { CameraView, CameraType, FlashMode, useCameraPermissions } from "expo-camera";
import * as MediaLibrary from "expo-media-library";
import { useIsFocused } from "@react-navigation/native";

export default function CameraScreen() {
  // hooks (top-level, never conditional)
  const [cameraFacing, setCameraFacing] = useState<CameraType>("back"); //back lense
  const [flash, setFlash] = useState<FlashMode>("off"); 
  const [permission, requestPermission] = useCameraPermissions();
  const [saving, setSaving] = useState(false);
  const [previewUri, setPreviewUri] = useState<string | null>(null);
  const [libStatus, requestLibPermission] = MediaLibrary.usePermissions();
  const cameraRef = useRef<CameraView>(null);
  const isFocused = useIsFocused();

  // callbacks
  const flipCamera = () => setCameraFacing(c => (c === "back" ? "front" : "back")); //rotation 
  const toggleFlash = () => setFlash(f => (f === "off" ? "on" : f === "on" ? "auto" : "off"));

  const takePhoto = useCallback(async () => {
    try {
      if (!cameraRef.current) return;
      const pic = await cameraRef.current.takePictureAsync({ quality: 1 });
      setPreviewUri(pic.uri);
    } catch (e: any) {
      Alert.alert("Error", e?.message ?? "Failed to take photo.");
    }
  }, []);

  const ensureMediaPermission = useCallback(async () => {
    if (libStatus?.status !== "granted") {
      const res = await requestLibPermission();
      return res.granted;
    }
    return true;
  }, [libStatus, requestLibPermission]);

  const saveToGallery = useCallback(async () => {
    if (!previewUri) return;
    const ok = await ensureMediaPermission();
    if (!ok) return Alert.alert("Permission required", "Allow Photos access to save.");
    try {
      setSaving(true);
      await MediaLibrary.saveToLibraryAsync(previewUri);
      Alert.alert("Saved", "Photo saved to your gallery.");
    } catch (e: any) {
      Alert.alert("Error", e?.message ?? "Could not save photo.");
    } finally {
      setSaving(false);
    }
  }, [previewUri, ensureMediaPermission]);

  // UI pieces
  const PermissionView = (
    <View style={styles.center}>
      <Text style={styles.info}>We need your permission to use the camera.</Text>
      <TouchableOpacity style={styles.primaryBtn} onPress={requestPermission}>
        <Text style={styles.primaryText}>Grant Permission</Text>
      </TouchableOpacity>
    </View>
  );

  const PreviewView = (
    <View style={styles.previewWrap}>
      {previewUri ? <Image source={{ uri: previewUri }} style={styles.preview} /> : null}
      <View style={styles.previewActions}>
        <TouchableOpacity style={styles.secondaryBtn} onPress={() => setPreviewUri(null)} disabled={saving}>
          <Text style={styles.secondaryText}>Retake</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.primaryBtn} onPress={saveToGallery} disabled={saving}>
          {saving ? <ActivityIndicator /> : <Text style={styles.primaryText}>Save</Text>}
        </TouchableOpacity>
      </View>
    </View>
  );

  const CameraViewUI = (
    <CameraView
      ref={cameraRef}
      style={styles.fill}
      facing={cameraFacing}
      flash={flash}
      active={isFocused}
    >
      <View style={styles.topBar}>
        <TouchableOpacity onPress={toggleFlash} style={styles.pillBtn}>
          <Text style={styles.pillText}>Flash: {flash.toUpperCase()}</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={flipCamera} style={styles.pillBtn}>
          <Text style={styles.pillText}>Flip</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.bottomBar}>
        <TouchableOpacity onPress={takePhoto} style={styles.shutterOuter}>
          <View style={styles.shutterInner} />
        </TouchableOpacity>
      </View>
    </CameraView>
  );

  // single return (prevents parser thinking a return is top-level)
  return (
    <View style={styles.fill}>
      {!permission ? (
        <View style={{ flex: 1, backgroundColor: "#000" }} />
      ) : !permission.granted ? (
        PermissionView
      ) : previewUri ? (
        PreviewView
      ) : (
        CameraViewUI
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  fill: {
    flex: 1,
    backgroundColor: "#000",
  },

  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
    backgroundColor: "#000",
  },

  info: {
    color: "#fff",
    fontSize: 16,
    marginBottom: 12,
    textAlign: "center",
  },

  topBar: {
    position: "absolute",
    top: 40,
    width: "100%",
    paddingHorizontal: 16,
    flexDirection: "row",
    justifyContent: "space-between",
  },

  bottomBar: {
    position: "absolute",
    bottom: 40,
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
  },

  pillBtn: {
    backgroundColor: "rgba(0,0,0,0.5)",
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 999,
  },

  pillText: {
    color: "#fff",
    fontWeight: "600",
  },

  shutterOuter: {
    height: 76,
    width: 76,
    borderRadius: 999,
    borderWidth: 6,
    borderColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },

  shutterInner: {
    height: 56,
    width: 56,
    borderRadius: 999,
    backgroundColor: "#fff",
  },

  previewWrap: {
    flex: 1,
    backgroundColor: "#000",
  },

  preview: {
    flex: 1,
  },

  previewActions: {
    position: "absolute",
    bottom: 30,
    width: "100%",
    paddingHorizontal: 16,
    flexDirection: "row",
    justifyContent: "space-between",
  },

  primaryBtn: {
    backgroundColor: "#0064F1",
    paddingHorizontal: 18,
    paddingVertical: 12,
    borderRadius: 12,
    minWidth: 100,
    alignItems: "center",
  },

  primaryText: {
    color: "#fff",
    fontWeight: "700",
  },

  secondaryBtn: {
    backgroundColor: "rgba(255,255,255,0.1)",
    paddingHorizontal: 18,
    paddingVertical: 12,
    borderRadius: 12,
    minWidth: 100,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.3)",
  },

  secondaryText: {
    color: "#fff",
    fontWeight: "700",
  },
});
