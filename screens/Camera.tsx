import React, { useCallback, useRef, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Alert,
  ActivityIndicator,
  Button,
} from "react-native";
import {
  CameraView,
  CameraType,
  FlashMode,
  useCameraPermissions,
  useMicrophonePermissions,
} from "expo-camera";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { auth, db, storage } from "../firebase";
import { useVideoPlayer, VideoView } from "expo-video";
import * as MediaLibrary from "expo-media-library";
import { useIsFocused } from "@react-navigation/native";

type Mode = "photo" | "video";

export default function CameraScreen() {
  const [mode, setMode] = useState<Mode>("photo");
  const [cameraFacing, setCameraFacing] = useState<CameraType>("back");
  const [flash, setFlash] = useState<FlashMode>("off");
  const [torch, setTorch] = useState(false);

  const [permission, requestPermission] = useCameraPermissions();
  const [micPerm, requestMicPerm] = useMicrophonePermissions();
  const [libStatus, requestLibPermission] = MediaLibrary.usePermissions();

  const [saving, setSaving] = useState(false);
  const [previewUri, setPreviewUri] = useState<string | null>(null);
  const [isVideo, setIsVideo] = useState(false);
  const [isRecording, setIsRecording] = useState(false);

  const cameraRef = useRef<CameraView>(null);
  const isFocused = useIsFocused();

  // Video preview player (safe to pass null when no preview yet)
  const player = useVideoPlayer(previewUri, {
    isLooping: true,
    shouldPlay: true,
  });

  // -- Permissions helpers ----------------------------------------------------

  const ensureCameraPermission = useCallback(async () => {
    if (!permission?.granted) {
      const res = await requestPermission();
      return res.granted;
    }
    return true;
  }, [permission, requestPermission]);

  const ensureMicPermission = useCallback(async () => {
    if (!micPerm?.granted) {
      const res = await requestMicPerm();
      return res.granted;
    }
    return true;
  }, [micPerm, requestMicPerm]);

  const ensureLibraryPermission = useCallback(async () => {
    if (!libStatus?.granted) {
      const res = await requestLibPermission();
      return res.granted;
    }
    return true;
  }, [libStatus, requestLibPermission]);

  // -- Capture actions --------------------------------------------------------

  const takePhoto = useCallback(async () => {
    const ok = await ensureCameraPermission();
    if (!ok) {
      Alert.alert("Permission needed", "Camera permission is required.");
      return;
    }
    try {
      const photo = await cameraRef.current?.takePictureAsync({
        quality: 0.9,
        skipProcessing: false,
      });
      if (photo?.uri) {
        setPreviewUri(photo.uri);
        setIsVideo(false);
      }
    } catch (e: any) {
      Alert.alert("Photo failed", e?.message ?? String(e));
    }
  }, [ensureCameraPermission]);

  const startRecording = useCallback(async () => {
    const camOK = await ensureCameraPermission();
    const micOK = await ensureMicPermission();
    if (!camOK || !micOK) {
      Alert.alert(
        "Permission needed",
        "Camera and microphone permissions are required for video."
      );
      return;
    }

    if (isRecording) return;

    try {
      setIsRecording(true);
      // recordAsync resolves when stopRecording() is called or when maxDuration is reached
      const recordingPromise = cameraRef.current?.recordAsync({
        maxDuration: 600, // seconds
        quality: "1080p",
        mute: false, // include audio
      });

      // Store promise to wait after stop
      (recordingPromise as Promise<any>)
        .then((res) => {
          if (res?.uri) {
            setPreviewUri(res.uri);
            setIsVideo(true);
          }
        })
        .catch((err) => {
          console.warn("recordAsync error:", err);
          Alert.alert("Recording error", err?.message ?? String(err));
        })
        .finally(() => setIsRecording(false));
    } catch (e: any) {
      setIsRecording(false);
      Alert.alert("Recording failed", e?.message ?? String(e));
    }
  }, [ensureCameraPermission, ensureMicPermission, isRecording]);

  const stopRecording = useCallback(() => {
    if (!isRecording) return;
    try {
      cameraRef.current?.stopRecording();
    } catch (e: any) {
      Alert.alert("Stop failed", e?.message ?? String(e));
    }
  }, [isRecording]);

  const saveToLibrary = useCallback(async () => {
    if (!previewUri) return;
    const ok = await ensureLibraryPermission();
    if (!ok) {
      Alert.alert(
        "Permission needed",
        "Media Library permission is required to save."
      );
      return;
    }
    try {
      setSaving(true);
      await MediaLibrary.saveToLibraryAsync(previewUri);
      Alert.alert("Saved", isVideo ? "Video saved to gallery." : "Photo saved to gallery.");
    } catch (e: any) {
      Alert.alert("Save failed", e?.message ?? String(e));
    } finally {
      setSaving(false);
    }
  }, [previewUri, isVideo, ensureLibraryPermission]);

  const resetPreview = useCallback(() => {
    setPreviewUri(null);
    setIsVideo(false);
  }, []);

  // -- UI helpers -------------------------------------------------------------

  const toggleFacing = () => {
    setCameraFacing((prev) => (prev === "back" ? "front" : "back"));
  };

  const toggleFlash = () => {
    setFlash((prev) => (prev === "off" ? "on" : prev === "on" ? "auto" : "off"));
  };

  const toggleTorch = () => setTorch((t) => !t);

  // -- Render -----------------------------------------------------------------

  // Ask for camera permission upfront if missing
  if (!permission) {
    return (
      <View style={styles.center}>
        <ActivityIndicator />
        <Text style={{ marginTop: 8 }}>Checking camera permissions…</Text>
      </View>
    );
  }
  if (!permission.granted) {
    return (
      <View style={styles.center}>
        <Text style={{ marginBottom: 12, textAlign: "center" }}>
          We need your permission to use the camera.
        </Text>
        <Button title="Grant Camera Permission" onPress={requestPermission} />
      </View>
    );
  }

  const showCamera = isFocused && !previewUri;

  return (
    <View style={styles.container}>
      {/* Camera */}
      {showCamera && (
        <CameraView
          ref={cameraRef}
          style={StyleSheet.absoluteFill}
          facing={cameraFacing}
          flash={flash}
          enableTorch={torch}
        />
      )}

      {/* Top bar */}
      <View style={styles.topBar}>
        <TouchableOpacity onPress={toggleFacing} style={styles.pill}>
          <Text style={styles.pillText}>
            {cameraFacing === "back" ? "Rear" : "Front"}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={toggleFlash} style={styles.pill}>
          <Text style={styles.pillText}>Flash: {flash}</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={toggleTorch} style={styles.pill}>
          <Text style={styles.pillText}>Torch: {torch ? "On" : "Off"}</Text>
        </TouchableOpacity>
      </View>

      {/* Preview */}
      {!!previewUri && (
        <View style={styles.previewOverlay}>
          {isVideo ? (
            <View style={{ width: "100%", aspectRatio: 9 / 16 }}>
              {/* expo-video player */}
              <VideoView
                style={{ flex: 1, borderRadius: 12, overflow: "hidden" }}
                player={player}
                allowsFullscreen
                allowsPictureInPicture
                contentFit="contain"
              />
            </View>
          ) : (
            <Image
              source={{ uri: previewUri }}
              style={styles.previewImage}
              resizeMode="contain"
            />
          )}

          <View style={styles.previewButtons}>
            <Button title="Retake" onPress={resetPreview} />
            <View style={{ width: 12 }} />
            <Button
              title={saving ? "Saving…" : "Save"}
              onPress={saveToLibrary}
              disabled={saving}
            />
          </View>
        </View>
      )}

      {/* Bottom controls */}
      {!previewUri && (
        <View style={styles.bottomBar}>
          <View style={styles.modeSwitch}>
            <TouchableOpacity
              onPress={() => setMode("photo")}
              style={[
                styles.modeButton,
                mode === "photo" && styles.modeButtonActive,
              ]}
            >
              <Text
                style={[
                  styles.modeText,
                  mode === "photo" && styles.modeTextActive,
                ]}
              >
                Photo
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setMode("video")}
              style={[
                styles.modeButton,
                mode === "video" && styles.modeButtonActive,
              ]}
            >
              <Text
                style={[
                  styles.modeText,
                  mode === "video" && styles.modeTextActive,
                ]}
              >
                Video
              </Text>
            </TouchableOpacity>
          </View>

          <View style={styles.shutterRow}>
            {mode === "photo" ? (
              <TouchableOpacity onPress={takePhoto} style={styles.shutterBtn}>
                <View style={styles.shutterInner} />
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                onPress={isRecording ? stopRecording : startRecording}
                style={[
                  styles.shutterBtn,
                  isRecording && styles.shutterBtnRecording,
                ]}
              >
                <View
                  style={[
                    styles.shutterInner,
                    isRecording && styles.shutterInnerRecording,
                  ]}
                />
              </TouchableOpacity>
            )}
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#000" },
  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
  },
  topBar: {
    position: "absolute",
    top: 50,
    left: 16,
    right: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    zIndex: 10,
  },
  pill: {
    backgroundColor: "rgba(0,0,0,0.5)",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 999,
  },
  pillText: { color: "#fff", fontWeight: "600" },
  bottomBar: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 36,
    alignItems: "center",
    gap: 16,
  },
  modeSwitch: {
    flexDirection: "row",
    backgroundColor: "rgba(0,0,0,0.5)",
    padding: 6,
    borderRadius: 999,
  },
  modeButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 999,
  },
  modeButtonActive: { backgroundColor: "#fff" },
  modeText: { color: "#fff", fontWeight: "600" },
  modeTextActive: { color: "#000" },
  shutterRow: { marginTop: 12, alignItems: "center", justifyContent: "center" },
  shutterBtn: {
    width: 76,
    height: 76,
    borderRadius: 999,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  shutterBtnRecording: { backgroundColor: "#e53935" },
  shutterInner: {
    width: 64,
    height: 64,
    borderRadius: 999,
    backgroundColor: "#000",
  },
  shutterInnerRecording: {
    width: 36,
    height: 36,
    borderRadius: 12,
    backgroundColor: "#fff",
  },
  previewOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "#000",
    alignItems: "center",
    justifyContent: "center",
    padding: 16,
    gap: 16,
  },
  previewImage: {
    width: "100%",
    aspectRatio: 9 / 16,
    borderRadius: 12,
  },
  previewButtons: {
    flexDirection: "row",
    gap: 12,
  },
});



// import React, { useCallback, useRef, useState } from "react";
// import {
//   View,
//   Text,
//   StyleSheet,
//   TouchableOpacity,
//   Image,
//   Alert,
//   ActivityIndicator,
// } from "react-native";
// import {
//   CameraView,
//   CameraType,
//   FlashMode,
//   useCameraPermissions,
//   useMicrophonePermissions,
// } from "expo-camera";
// import { useVideoPlayer, VideoView } from "expo-video";
// import * as MediaLibrary from "expo-media-library";
// import { useIsFocused } from "@react-navigation/native";

// type Mode = "photo" | "video";

// export default function CameraScreen() {
//   // state
//   const [mode, setMode] = useState<Mode>("photo");
//   const [cameraFacing, setCameraFacing] = useState<CameraType>("back");
//   const [flash, setFlash] = useState<FlashMode>("off"); // used in photo mode
//   const [torch, setTorch] = useState(false);            // used in video mode
//   const [permission, requestPermission] = useCameraPermissions();
//   const [micPerm, requestMicPerm] = useMicrophonePermissions();
//   const [saving, setSaving] = useState(false);
//   const [previewUri, setPreviewUri] = useState<string | null>(null);
//   const [isVideo, setIsVideo] = useState(false);
//   const [libStatus, requestLibPermission] = MediaLibrary.usePermissions();
//   const [isRecording, setIsRecording] = useState(false);

//   // refs
//   const cameraRef = useRef<CameraView>(null);
//   const isFocused = useIsFocused();

//   // video player for preview
//   const player = previewUri && isVideo
//     ? useVideoPlayer(previewUri, p => {
//         p.loop = true;
//         p.play();
//       })
//     : null;

//   // toggles
//   const flipCamera = () =>
//     setCameraFacing(c => (c === "back" ? "front" : "back"));
//   const toggleFlash = () =>
//     setFlash(f => (f === "off" ? "on" : f === "on" ? "auto" : "off"));
//   const toggleTorch = () => setTorch(t => !t);

//   // capture photo
//   const takePhoto = useCallback(async () => {
//     try {
//       if (!cameraRef.current) return;
//       const pic = await cameraRef.current.takePictureAsync({ quality: 1 });
//       setPreviewUri(pic.uri);
//       setIsVideo(false);
//     } catch (e: any) {
//       Alert.alert("Photo error", e?.message ?? "Failed to take photo.");
//     }
//   }, []);

//   // start / stop video
//   const startRecording = useCallback(async () => {
//     try {
//       // mic permission (Android needs this for audio)
//       if (mode === "video" && micPerm?.status !== "granted") {
//         const r = await requestMicPerm();
//         if (!r.granted) {
//           Alert.alert("Microphone needed", "Enable microphone to record video with sound.");
//           return;
//         }
//       }
//       if (!cameraRef.current) return;
//       setIsRecording(true);

//       // IMPORTANT: when mode="video", CameraView will record correctly
//       const result = await cameraRef.current.recordAsync({
//         quality: "720p",
//         // Expo Camera uses device orientation automatically.
//         // On iOS 18 you can toggle pause/resume via toggleRecordingAsync if supported.
//         mute: false,
//       });

//       setPreviewUri(result.uri);
//       setIsVideo(true);
//     } catch (e: any) {
//       // This is the error you saw when stopping too quickly or mode not set to video
//       Alert.alert("Video error", e?.message ?? "Video recording failed.");
//     } finally {
//       setIsRecording(false);
//     }
//   }, [micPerm?.status, mode, requestMicPerm]);

//   const stopRecording = useCallback(() => {
//     if (cameraRef.current) cameraRef.current.stopRecording();
//   }, []);

//   const ensureMediaPermission = useCallback(async () => {
//     if (libStatus?.status !== "granted") {
//       const res = await requestLibPermission();
//       return res.granted;
//     }
//     return true;
//   }, [libStatus, requestLibPermission]);

//   const saveToGallery = useCallback(async () => {
//     if (!previewUri) return;
//     const ok = await ensureMediaPermission();
//     if (!ok) return Alert.alert("Permission required", "Allow Photos access to save.");
//     try {
//       setSaving(true);
//       await MediaLibrary.saveToLibraryAsync(previewUri);
//       Alert.alert("Saved", isVideo ? "Video saved!" : "Photo saved!");
//     } catch (e: any) {
//       Alert.alert("Save error", e?.message ?? "Could not save file.");
//     } finally {
//       setSaving(false);
//     }
//   }, [previewUri, ensureMediaPermission, isVideo]);

//   // permissions UI
//   if (!permission || !micPerm) {
//     return <View style={{ flex: 1, backgroundColor: "#000" }} />;
//   }
//   if (!permission.granted) {
//     return (
//       <View style={styles.center}>
//         <Text style={styles.info}>We need your permission to use the camera.</Text>
//         <TouchableOpacity style={styles.primaryBtn} onPress={requestPermission}>
//           <Text style={styles.primaryText}>Grant Camera Permission</Text>
//         </TouchableOpacity>
//       </View>
//     );
//   }

//   // preview UI
//   if (previewUri) {
//     return (
//       <View style={styles.previewWrap}>
//         {isVideo && player ? (
//           <VideoView
//             style={styles.preview}
//             player={player}
//             allowsFullscreen
//             allowsPictureInPicture
//           />
//         ) : (
//           <Image source={{ uri: previewUri }} style={styles.preview} />
//         )}

//         <View style={styles.previewActions}>
//           <TouchableOpacity
//             style={styles.secondaryBtn}
//             onPress={() => setPreviewUri(null)}
//             disabled={saving}
//           >
//             <Text style={styles.secondaryText}>Retake</Text>
//           </TouchableOpacity>
//           <TouchableOpacity
//             style={styles.primaryBtn}
//             onPress={saveToGallery}
//             disabled={saving}
//           >
//             {saving ? <ActivityIndicator /> : <Text style={styles.primaryText}>Save</Text>}
//           </TouchableOpacity>
//         </View>
//       </View>
//     );
//   }

//   // camera + overlays (no children inside CameraView)
//   return (
//     <View style={styles.fill}>
//       <View style={styles.cameraWrap}>
//         <CameraView
//           ref={cameraRef}
//           style={StyleSheet.absoluteFill}
//           facing={cameraFacing}
//           flash={mode === "photo" ? flash : "off"} // flash only for photos
//           enableTorch={mode === "video" ? torch : false} // torch for video
//           mode={mode === "video" ? "video" : "picture"}
//           active={isFocused}
//         />
//       </View>

//       {/* Top controls */}
//       <View style={[styles.row, styles.topBar]}>
//         <View style={styles.modeSwitch}>
//           <TouchableOpacity
//             style={[styles.modeBtn, mode === "photo" && styles.modeBtnActive]}
//             onPress={() => setMode("photo")}
//           >
//             <Text style={[styles.modeText, mode === "photo" && styles.modeTextActive]}>
//               PHOTO
//             </Text>
//           </TouchableOpacity>
//           <TouchableOpacity
//             style={[styles.modeBtn, mode === "video" && styles.modeBtnActive]}
//             onPress={() => setMode("video")}
//           >
//             <Text style={[styles.modeText, mode === "video" && styles.modeTextActive]}>
//               VIDEO
//             </Text>
//           </TouchableOpacity>
//         </View>

//         <View style={styles.rightBtns}>
//           {mode === "photo" ? (
//             <TouchableOpacity onPress={toggleFlash} style={styles.pillBtn}>
//               <Text style={styles.pillText}>Flash: {flash.toUpperCase()}</Text>
//             </TouchableOpacity>
//           ) : (
//             <TouchableOpacity onPress={toggleTorch} style={styles.pillBtn}>
//               <Text style={styles.pillText}>Torch: {torch ? "ON" : "OFF"}</Text>
//             </TouchableOpacity>
//           )}
//           <TouchableOpacity onPress={flipCamera} style={styles.pillBtn}>
//             <Text style={styles.pillText}>Flip</Text>
//           </TouchableOpacity>
//         </View>
//       </View>

//       {/* Bottom controls */}
//       <View style={styles.bottomBar}>
//         {mode === "photo" ? (
//           <TouchableOpacity onPress={takePhoto} style={styles.shutterOuter}>
//             <View style={styles.shutterInner} />
//           </TouchableOpacity>
//         ) : (
//           <View style={styles.videoControls}>
//             {!isRecording ? (
//               <TouchableOpacity onPress={startRecording} style={[styles.recBtn, styles.recStart]}>
//                 <Text style={styles.recText}>START</Text>
//               </TouchableOpacity>
//             ) : (
//               <TouchableOpacity onPress={stopRecording} style={[styles.recBtn, styles.recStop]}>
//                 <Text style={styles.recText}>STOP</Text>
//               </TouchableOpacity>
//             )}
//           </View>
//         )}
//       </View>
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   fill: { flex: 1, backgroundColor: "#000" },
//   cameraWrap: { flex: 1, position: "relative" },

//   center: {
//     flex: 1, alignItems: "center", justifyContent: "center",
//     padding: 24, backgroundColor: "#000",
//   },
//   info: { color: "#fff", fontSize: 16, marginBottom: 12, textAlign: "center" },

//   row: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
//   topBar: { position: "absolute", top: 40, left: 16, right: 16 },
//   bottomBar: {
//     position: "absolute", bottom: 40, left: 0, right: 0,
//     alignItems: "center", justifyContent: "center",
//   },

//   modeSwitch: { flexDirection: "row", gap: 8 },
//   modeBtn: { paddingVertical: 6, paddingHorizontal: 12, borderRadius: 999, backgroundColor: "rgba(0,0,0,0.35)" },
//   modeBtnActive: { backgroundColor: "rgba(0,0,0,0.7)" },
//   modeText: { color: "#ddd", fontWeight: "700" },
//   modeTextActive: { color: "#fff" },

//   rightBtns: { flexDirection: "row", gap: 8 },

//   pillBtn: {
//     backgroundColor: "rgba(0,0,0,0.5)",
//     paddingHorizontal: 14,
//     paddingVertical: 8,
//     borderRadius: 999,
//   },
//   pillText: { color: "#fff", fontWeight: "600" },

//   shutterOuter: {
//     height: 76, width: 76, borderRadius: 999,
//     borderWidth: 6, borderColor: "#fff",
//     alignItems: "center", justifyContent: "center",
//   },
//   shutterInner: { height: 56, width: 56, borderRadius: 999, backgroundColor: "#fff" },

//   videoControls: { flexDirection: "row", gap: 12 },
//   recBtn: { paddingVertical: 12, paddingHorizontal: 18, borderRadius: 12, minWidth: 120, alignItems: "center" },
//   recStart: { backgroundColor: "#EA4335" },
//   recStop: { backgroundColor: "#C5221F" },
//   recText: { color: "#fff", fontWeight: "800" },

//   previewWrap: { flex: 1, backgroundColor: "#000" },
//   preview: { flex: 1 },
//   previewActions: {
//     position: "absolute", bottom: 30, left: 16, right: 16,
//     flexDirection: "row", justifyContent: "space-between",
//   },
//   primaryBtn: {
//     backgroundColor: "#0064F1", paddingHorizontal: 18, paddingVertical: 12,
//     borderRadius: 12, minWidth: 100, alignItems: "center",
//   },
//   primaryText: { color: "#fff", fontWeight: "700" },
//   secondaryBtn: {
//     backgroundColor: "rgba(255,255,255,0.1)", paddingHorizontal: 18, paddingVertical: 12,
//     borderRadius: 12, minWidth: 100, alignItems: "center",
//     borderWidth: 1, borderColor: "rgba(255,255,255,0.3)",
//   },
//   secondaryText: { color: "#fff", fontWeight: "700" },
// });

