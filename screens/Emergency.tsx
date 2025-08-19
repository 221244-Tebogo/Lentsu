import React, { useEffect, useMemo, useRef, useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Linking, Vibration, Platform, AppState, Alert, Share } from "react-native";
import * as Location from "expo-location";
import * as ImagePicker from "expo-image-picker";
import { Audio } from "expo-av";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { db, auth } from "../firebase";

type Coords = { lat: number | null; lon: number | null; accuracy?: number | null };
const CONTACTS_KEY = "@trusted_contacts_v1";

enum Phase {
  Idle = "Idle",
  Countdown = "Countdown",
  Alarm = "Alarm",
  FakeCall = "FakeCall",
  FollowUp = "FollowUp",
}

export default function Emergency() {
  const [uid, setUid] = useState<string | null>(null);
  const [phase, setPhase] = useState<Phase>(Phase.Idle);
  const [count, setCount] = useState<number>(0);
  const [coords, setCoords] = useState<Coords>({ lat: null, lon: null, accuracy: null });
  const [contacts, setContacts] = useState<string[]>([]);

  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const alarmSound = useRef<Audio.Sound | null>(null);
  const callSound = useRef<Audio.Sound | null>(null);
  const appState = useRef(AppState.currentState);

  useEffect(() => onAuthStateChanged(auth, (u) => setUid(u?.uid ?? null)), []);

  // load contacts + location on mount
  useEffect(() => {
    (async () => {
      const raw = await AsyncStorage.getItem(CONTACTS_KEY);
      if (raw) {
        setContacts(
          raw.split(",").map((s) => s.trim()).filter(Boolean)
        );
      }
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status === "granted") {
        const loc = await Location.getCurrentPositionAsync({});
        setCoords({ lat: loc.coords.latitude, lon: loc.coords.longitude, accuracy: loc.coords.accuracy });
      }
    })();
  }, []);

  useEffect(() => {
    const sub = AppState.addEventListener("change", (next) => (appState.current = next));
    return () => sub.remove();
  }, []);

  const emergencyMessage = useMemo(() => {
    const parts = ["Hey, please call me back. I might be unsafe."];
    if (coords.lat && coords.lon) {
      const maps = `https://www.google.com/maps?q=${coords.lat},${coords.lon}`;
      parts.push(`My location: ${coords.lat.toFixed(5)}, ${coords.lon.toFixed(5)} • ${maps}`);
    }
    parts.push("If you can, I am sending you photos of the car/number plate/driver.");
    return parts.join(" ");
  }, [coords]);

  // --- alarm controls ---
  const startAlarm = async () => {
    try {
      const { sound } = await Audio.Sound.createAsync(
        require("../assets/iphone.mp3"),
        { shouldPlay: true, isLooping: true }
      );
      alarmSound.current = sound;
      await sound.playAsync();
      Vibration.vibrate([0, 400, 200, 400], true);
    } catch {}
  };

  const stopAlarm = async () => {
    try {
      if (alarmSound.current) {
        await alarmSound.current.stopAsync();
        await alarmSound.current.unloadAsync();
        alarmSound.current = null;
      }
    } catch {}
    Vibration.cancel();
  };

  const playFakeCall = async () => {
    try {
      const { sound } = await Audio.Sound.createAsync(
        require("../assets/hey-baby-girl.mp3"),
        { shouldPlay: true, isLooping: false }
      );
      callSound.current = sound;
      await sound.playAsync();
      // when it finishes, move to follow-up CTA
      sound.setOnPlaybackStatusUpdate((status: any) => {
        if (status.didJustFinish) {
          sound.unloadAsync();
          setPhase(Phase.FollowUp);
        }
      });
    } catch {
      // if audio fails, still show follow-up
      setPhase(Phase.FollowUp);
    }
  };

  const beginCountdown = async () => {
    // refresh location
    try {
      const { status } = await Location.getForegroundPermissionsAsync();
      if (status === "granted") {
        const loc = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Balanced });
        setCoords({ lat: loc.coords.latitude, lon: loc.coords.longitude, accuracy: loc.coords.accuracy });
      }
    } catch {}
    setCount(5);
    setPhase(Phase.Countdown);
    intervalRef.current = setInterval(() => {
      setCount((n) => {
        if (n <= 1) {
          clearInt();
          triggerSOS();
          return 0;
        }
        return n - 1;
      });
    }, 1000);
  };

  const clearInt = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  const cancelCountdown = async () => {
    clearInt();
    setPhase(Phase.Idle);
  };

  const logToFirestore = async () => {
    try {
      if (!uid) return;
      await addDoc(collection(db, "users", uid, "sosEvents"), {
        createdAt: serverTimestamp(),
        lat: coords.lat ?? null,
        lon: coords.lon ?? null,
        accuracy: coords.accuracy ?? null,
        platform: Platform.OS,
        type: "SOS",
      });
    } catch {}
  };

  const triggerSMSCompose = async () => {
    if (contacts.length === 0) return;
    const to = Platform.OS === "ios" ? contacts.join(",") : contacts[0];
    const url = `sms:${to}?body=${encodeURIComponent(emergencyMessage)}`;
    try {
      const can = await Linking.canOpenURL(url);
      if (can) await Linking.openURL(url);
    } catch {}
  };

  const triggerSOS = async () => {
    await startAlarm();
    await logToFirestore();
    setPhase(Phase.Alarm);
  };

  // user presses "I'm Safe" → stop siren, play fake call VO, then show CTAs
  const handleImSafe = async () => {
    await stopAlarm();
    setPhase(Phase.FakeCall);
    await playFakeCall();
  };

  // --- follow-up actions ---
  const capturePhoto = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Camera permission needed");
      return;
    }
    const result = await ImagePicker.launchCameraAsync({ quality: 0.7 });
    if (!result.canceled && result.assets?.[0]?.uri) {
      // share image via native share sheet (Messages/WhatsApp/etc.)
      try {
        await Share.share({
          title: "Car evidence",
          message: emergencyMessage,
          url: result.assets[0].uri, // iOS honors this; Android uses message + app pickers
        });
      } catch (e) {
        Alert.alert("Share failed", String(e));
      }
    }
  };

  const messagePartner = async () => {
    // open SMS with prefilled text; user can paste photos after
    await triggerSMSCompose();
  };

  useEffect(() => {
    return () => {
      clearInt();
      stopAlarm();
      if (callSound.current) callSound.current.unloadAsync();
    };
  }, []);

  return (
    <View style={styles.c}>
      <Text style={styles.h}>Emergency SOS</Text>

      {phase === Phase.Idle && (
        <View style={styles.center}>
          <TouchableOpacity style={styles.sosBtn} onPress={beginCountdown} activeOpacity={0.85}>
            <Text style={styles.sosText}>SOS</Text>
          </TouchableOpacity>
          <Text style={styles.meta}>
            {coords.lat && coords.lon ? `Ready • ${coords.lat.toFixed(4)}, ${coords.lon.toFixed(4)}` : "Getting location…"}
          </Text>
        </View>
      )}

      {phase === Phase.Countdown && (
        <View style={styles.center}>
          <Text style={styles.label}>Sending SOS in</Text>
          <Text style={styles.big}>{count}</Text>
          <TouchableOpacity style={[styles.btn, styles.btnCancel]} onPress={cancelCountdown}>
            <Text style={styles.btnText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      )}

      {phase === Phase.Alarm && (
        <View style={styles.center}>
          <Text style={styles.label}>Alarm Active</Text>
          <TouchableOpacity style={[styles.btn, styles.btnSafe]} onPress={handleImSafe}>
            <Text style={styles.btnText}>I’m Safe (Stop Alarm)</Text>
          </TouchableOpacity>
        </View>
      )}

      {phase === Phase.FakeCall && (
        <View style={styles.center}>
          <Text style={styles.label}>On call… “Are you safe? Send me photos.”</Text>
          {/* No buttons here; transitions to FollowUp when VO ends */}
        </View>
      )}

      {phase === Phase.FollowUp && (
        <View style={styles.center}>
          <Text style={styles.label}>Follow up</Text>
          <TouchableOpacity style={[styles.btn, styles.btnPrimary]} onPress={capturePhoto}>
            <Text style={styles.btnText}>Open Camera (Car / Number Plate)</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.btn, styles.btnOutline]} onPress={messagePartner}>
            <Text style={styles.btnOutlineText}>Message Partner</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  c: { flex: 1, backgroundColor: "#0B284A", padding: 20 },
  h: { color: "#fff", fontSize: 24, fontWeight: "800", marginBottom: 16 },
  center: { flex: 1, alignItems: "center", justifyContent: "center" },
  label: { color: "#E6EEF7", fontSize: 16, marginBottom: 10, textAlign: "center" },
  big: { color: "#fff", fontSize: 72, fontWeight: "900", marginBottom: 16 },
  sosBtn: {
    width: 180, height: 180, borderRadius: 90,
    backgroundColor: "#D7263D", alignItems: "center", justifyContent: "center",
    shadowColor: "#000", shadowOpacity: 0.4, shadowRadius: 16, elevation: 8,
  },
  sosText: { color: "#fff", fontSize: 48, fontWeight: "900", letterSpacing: 2 },
  meta: { marginTop: 16, color: "#90A4B8" },
  btn: { marginTop: 14, paddingVertical: 12, paddingHorizontal: 18, borderRadius: 12, alignItems: "center", minWidth: 260 },
  btnCancel: { backgroundColor: "#AF2730" },
  btnSafe: { backgroundColor: "#1E90FF" },
  btnPrimary: { backgroundColor: "#1E90FF" },
  btnOutline: { borderWidth: 1, borderColor: "#2F4F73" },
  btnText: { color: "#fff", fontWeight: "800" },
  btnOutlineText: { color: "#E6EEF7", fontWeight: "800" },
});
