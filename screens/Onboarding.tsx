// screens/Onboarding.tsx
import React, { useRef, useState } from "react";
import { View, Text, StyleSheet, Dimensions, FlatList, TouchableOpacity, NativeScrollEvent, NativeSyntheticEvent } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Audio } from "expo-av";

const { width } = Dimensions.get("window");
const KEY = "@seen_onboarding_v1";

type Slide = { id: string; title: string; subtitle: string; };

const SLIDES: Slide[] = [
  { id: "1", title: "Lentsu", subtitle: "Your voice is your shield. Control safety features hands-free." },
  { id: "2", title: "Share Location", subtitle: "Quickly share your live location with trusted contacts." },
  { id: "3", title: "Emergency SOS", subtitle: "One-hand actions with a cancelable countdown to prevent false alarms." },
];

export default function Onboarding({ onDone }: { onDone: () => void }) {
  const listRef = useRef<FlatList<Slide>>(null);
  const [index, setIndex] = useState(0);

  const handleScroll = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const i = Math.round(e.nativeEvent.contentOffset.x / width);
    if (i !== index) setIndex(i);
  };

  const next = () => {
    if (index < SLIDES.length - 1) {
      listRef.current?.scrollToIndex({ index: index + 1, animated: true });
      setIndex((i) => i + 1);
    }
  };

  const playTap = async () => {
    try {
      const { sound } = await Audio.Sound.createAsync(require("../assets/success-340660.mp3"));
      await sound.playAsync();
      setTimeout(() => sound.unloadAsync(), 500);
    } catch {}
  };

  const finish = async () => {
    await playTap();
    await AsyncStorage.setItem(KEY, "1");
    onDone();
  };

  const isLast = index === SLIDES.length - 1;

  return (
    <View style={styles.c}>
      <FlatList
        ref={listRef}
        data={SLIDES}
        keyExtractor={(s) => s.id}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        renderItem={({ item }) => (
          <View style={{ width, paddingHorizontal: 24, justifyContent: "center" }}>
            <Text style={styles.h1}>{item.title}</Text>
            <Text style={styles.p}>{item.subtitle}</Text>
          </View>
        )}
      />

      <View style={styles.dots}>
        {SLIDES.map((_, i) => (
          <View key={i} style={[styles.dot, i === index && styles.dotActive]} />
        ))}
      </View>

      <View style={styles.footer}>
        {!isLast ? (
          <TouchableOpacity style={styles.btnOutline} onPress={next}>
            <Text style={styles.btnOutlineText}>Next</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity style={styles.btn} onPress={finish}>
            <Text style={styles.btnText}>Get Started</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  c: { flex: 1, backgroundColor: "#0B284A" },
  h1: { color: "#fff", fontSize: 32, fontWeight: "800", marginBottom: 12 },
  p: { color: "#E6EEF7", fontSize: 16, lineHeight: 24 },
  dots: { position: "absolute", bottom: 96, width: "100%", flexDirection: "row", justifyContent: "center", gap: 8 },
  dot: { width: 8, height: 8, borderRadius: 4, backgroundColor: "#425672" },
  dotActive: { backgroundColor: "#E6EEF7", width: 18 },
  footer: { position: "absolute", bottom: 32, left: 24, right: 24 },
  btn: { backgroundColor: "#1E90FF", paddingVertical: 14, borderRadius: 12, alignItems: "center" },
  btnText: { color: "#fff", fontWeight: "800", fontSize: 16 },
  btnOutline: { borderWidth: 1, borderColor: "#2F4F73", paddingVertical: 14, borderRadius: 12, alignItems: "center" },
  btnOutlineText: { color: "#E6EEF7", fontWeight: "700", fontSize: 16 },
});
