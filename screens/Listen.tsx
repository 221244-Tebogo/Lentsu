//SAVES INDIVIDUAL LISTS PER USER
import React, { useCallback, useEffect, useRef, useState } from "react";
import { StyleSheet, Text, View, Button, Alert, FlatList, TouchableOpacity } from "react-native";
import { Audio } from "expo-av";
import * as FileSystem from "expo-file-system";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { collection, addDoc, getDocs, serverTimestamp, query, where } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { db, storage, auth } from "../firebase";
import { onAuthStateChanged } from "firebase/auth";

type SavedRecording = {
  id: string;
  localUri: string;
  duration: string;
  createdAt: number;
  remoteUrl?: string;
};

const STORAGE_KEY = (uid: string) => `@local_recordings_v1_${uid}`;             // ⬅️ per-user key
const RECORDINGS_DIR = (uid: string) => FileSystem.documentDirectory + `recordings/${uid}/`; // ⬅️ per-user dir

export default function Listen() {
  const [recording, setRecording] = useState<Audio.Recording | null>(null);
  const [items, setItems] = useState<SavedRecording[]>([]);
  const [uid, setUid] = useState<string | null>(null);                          // ⬅️ active user
  const soundRef = useRef<Audio.Sound | null>(null);

  // Track auth state
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      setUid(user?.uid ?? null);
    });
    return unsub;
  }, []);

  // ---------- helpers ----------
  const ensureDirAsync = useCallback(async () => {
    if (!uid) return;
    const dir = RECORDINGS_DIR(uid);
    const dirInfo = await FileSystem.getInfoAsync(dir);
    if (!dirInfo.exists) {
      await FileSystem.makeDirectoryAsync(dir, { intermediates: true });
    }
  }, [uid]);

  const loadLocal = useCallback(async () => {
    if (!uid) return;
    try {
      const raw = await AsyncStorage.getItem(STORAGE_KEY(uid));
      if (raw) setItems(JSON.parse(raw));
      else setItems([]);
    } catch (e) {
      console.warn("Failed to load local recordings:", e);
    }
  }, [uid]);

  const saveLocal = useCallback(async (list: SavedRecording[]) => {
    setItems(list);
    if (!uid) return;
    try {
      await AsyncStorage.setItem(STORAGE_KEY(uid), JSON.stringify(list));
    } catch (e) {
      console.warn("Failed to persist local recordings:", e);
    }
  }, [uid]);

  // Merge only THIS USER'S server items into local cache
  const mergeFromFirestore = useCallback(async () => {
    if (!uid) return;
    try {
      const q = query(collection(db, "recordings"), where("ownerUid", "==", uid)); // ⬅️ filter by user
      const snap = await getDocs(q);
      const serverRecs: SavedRecording[] = [];
      snap.forEach(docu => {
        const d = docu.data() as any;
        if (!d?.file || typeof d.file !== "string") return;
        serverRecs.push({
          id: docu.id,
          localUri: d.file, // fallback to remote if no local copy yet
          duration: d.duration || "0:00",
          createdAt: (d.timestamp?.toMillis?.() ?? Date.now()),
          remoteUrl: d.file,
        });
      });

      const existing = items;
      const merged = [...existing];
      for (const s of serverRecs) {
        const dup = existing.find(
          r =>
            (r.remoteUrl && s.remoteUrl && r.remoteUrl === s.remoteUrl) ||
            Math.abs(r.createdAt - s.createdAt) < 5000
        );
        if (!dup) merged.push(s);
      }
      if (merged.length !== existing.length) {
        await saveLocal(merged);
      }
    } catch (e) {
      console.warn("Failed to merge Firestore recordings:", e);
    }
  }, [db, items, saveLocal, uid]);

  // Load when user is ready
  useEffect(() => {
    (async () => {
      if (!uid) return;
      await ensureDirAsync();
      await loadLocal();
      await mergeFromFirestore();
    })();
  }, [uid, ensureDirAsync, loadLocal, mergeFromFirestore]);

  // ---------- record ----------
  async function startRecording() {
    if (!uid) {
      Alert.alert("Not signed in", "Please sign in to record.");
      return;
    }
    try {
      const perm = await Audio.requestPermissionsAsync();
      if (perm.status !== "granted") {
        Alert.alert("Permission required", "Microphone access is needed to record audio.");
        return;
      }
      await Audio.setAudioModeAsync({ allowsRecordingIOS: true, playsInSilentModeIOS: true });
      const rec = new Audio.Recording();
      await rec.prepareToRecordAsync(Audio.RECORDING_OPTIONS_PRESET_HIGH_QUALITY);
      await rec.startAsync();
      setRecording(rec);
    } catch (err) {
      console.error("Failed to start recording:", err);
      Alert.alert("Error", "Could not start recording.");
    }
  }

  async function stopRecording() {
    if (!uid || !recording) return;
    try {
      await recording.stopAndUnloadAsync();

      const status = await recording.getStatusAsync();
      const millis = (status as any).durationMillis ?? 0;
      const duration = formatDuration(millis);

      const tempUri = recording.getURI();
      if (!tempUri) throw new Error("Recording URI is undefined");

      // Move to per-user dir
      await ensureDirAsync();
      const fileName = `rec-${Date.now()}.m4a`;
      const finalPath = RECORDINGS_DIR(uid) + fileName;
      await FileSystem.moveAsync({ from: tempUri, to: finalPath });

      // Save locally first
      const local: SavedRecording = {
        id: `local-${Date.now()}`,
        localUri: finalPath,
        duration,
        createdAt: Date.now(),
      };
      const next = [...items, local];
      await saveLocal(next);

      // Upload to per-user path and write Firestore with ownerUid
      (async () => {
        try {
          const base64 = await FileSystem.readAsStringAsync(finalPath, { encoding: FileSystem.EncodingType.Base64 });
          // Convert base64 -> Uint8Array
          const binary = global.atob ? global.atob(base64) : Buffer.from(base64, "base64").toString("binary");
          const bytes = new Uint8Array([...binary].map((c) => c.charCodeAt(0)));

          const storageRef = ref(storage, `recordings/${uid}/${fileName}`); // ⬅️ per-user folder
          await uploadBytes(storageRef, bytes);
          const url = await getDownloadURL(storageRef);

          await addDoc(collection(db, "recordings"), {
            ownerUid: uid,    
            duration,
            file: url,
            timestamp: serverTimestamp(),
          });

          // patch local with remoteUrl
          const raw = (await AsyncStorage.getItem(STORAGE_KEY(uid))) || "[]";
          const list: SavedRecording[] = JSON.parse(raw);
          const idx = list.findIndex(r => r.id === local.id);
          if (idx >= 0) {
            list[idx] = { ...list[idx], remoteUrl: url };
            await AsyncStorage.setItem(STORAGE_KEY(uid), JSON.stringify(list));
            setItems(list);
          }
        } catch (e) {
          console.warn("Upload/Firestore sync failed (kept local):", e);
        }
      })();
    } catch (err) {
      console.error("Failed to stop/save recording:", err);
      Alert.alert("Error", "Could not save the recording.");
    } finally {
      setRecording(null);
    }
  }

  // ---------- playback ----------
  async function play(rec: SavedRecording) {
    try {
      const playableUri = await ensurePlayableUri(rec);
      if (!playableUri) {
        Alert.alert("Missing file", "This recording is not available offline yet.");
        return;
      }
      if (soundRef.current) {
        await soundRef.current.unloadAsync();
        soundRef.current = null;
      }
      const { sound } = await Audio.Sound.createAsync({ uri: playableUri });
      soundRef.current = sound;
      await sound.playAsync();
    } catch (e) {
      console.error("Playback error:", e);
    }
  }

  async function ensurePlayableUri(rec: SavedRecording): Promise<string | null> {
    if (rec.localUri) {
      const info = await FileSystem.getInfoAsync(rec.localUri);
      if (info.exists) return rec.localUri;
    }
    if (rec.remoteUrl) return rec.remoteUrl;
    return null;
  }

  // ---------- utils & UI ----------
  function formatDuration(ms: number) {
    const minutes = Math.floor(ms / 60000);
    const seconds = Math.round((ms % 60000) / 1000);
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  }

  async function clearLocal() {
    if (!uid) return;
    try {
      for (const r of items) {
        if (r.localUri) {
          const info = await FileSystem.getInfoAsync(r.localUri);
          if (info.exists) await FileSystem.deleteAsync(r.localUri, { idempotent: true });
        }
      }
      await AsyncStorage.removeItem(STORAGE_KEY(uid));
      setItems([]);
    } catch (e) {
      console.warn("Failed to clear local recordings:", e);
    }
  }

  const renderItem = ({ item, index }: { item: SavedRecording; index: number }) => (
    <View style={styles.row}>
      <Text style={styles.fill}>Recording #{index + 1} | {item.duration}</Text>
      <TouchableOpacity style={styles.btn} onPress={() => play(item)}>
        <Text style={styles.btnText}>Play</Text>
      </TouchableOpacity>
    </View>
  );

  if (!uid) {
    return (
      <View style={styles.container}>
        <Text style={{ padding: 16, textAlign: "center" }}>Please sign in to view your recordings.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Button
        title={recording ? "Stop Recording" : "Start Recording"}
        onPress={recording ? stopRecording : startRecording}
      />
      <FlatList
        data={items}
        keyExtractor={(r) => r.id}
        renderItem={renderItem}
        contentContainerStyle={{ paddingVertical: 16, paddingHorizontal: 12 }}
      />
      {items.length > 0 && <Button title="Clear Local Recordings" onPress={clearLocal} />}
      <View style={{ height: 24 }} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: 
  { flex: 1, 
    backgroundColor: "#fff", 
    alignItems: "stretch", 
    justifyContent: "flex-start", 
    paddingTop: 40 
  },

  row: { 
    flexDirection: "row", 
    alignItems: "center", 
    paddingVertical: 8 
  },

  fill: 
  { 
    flex: 1, 
    marginRight: 10 
  },

  btn: { 
    paddingHorizontal: 12,
    paddingVertical: 8, 
    backgroundColor: "#0E1C2C", 
    borderRadius: 8 
  },

  btnText: { 
    color: "#fff", 
    fontWeight: "600" 
  },
});
