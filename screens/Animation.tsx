import React, { useEffect, useRef } from "react";
import { View, StyleSheet } from "react-native";
import LottieView from "lottie-react-native";
import { Audio } from "expo-av";

type Props = { onDone: () => void };

export default function SplashAnimation({ onDone }: Props) {
  const doneRef = useRef(false);

  useEffect(() => {
   
    let sound: Audio.Sound | null = null;
    (async () => {
      try {
        const res = await Audio.Sound.createAsync(require("../assets/success-340660.mp3"));
        sound = res.sound;
        await sound.playAsync();
      } catch {}
    })();

    // hard fallback in case onAnimationFinish doesn’t fire
    const t = setTimeout(() => {
      if (!doneRef.current) {
        doneRef.current = true;
        onDone();
      }
    }, 5000);

    return () => {
      clearTimeout(t);
      if (sound) sound.unloadAsync();
    };
  }, [onDone]);

  return (
    <View style={styles.container}>
      <LottieView
        source={require("../assets/Rq0TA7iszQ.json")}
        autoPlay
        loop={false}
        onAnimationFinish={() => {
          if (!doneRef.current) {
            doneRef.current = true;
            onDone();
          }
        }}
        style={styles.animation}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0B284A",
    justifyContent: "center",
    alignItems: "center",
  },
  animation: { width: 300, height: 300 },
});
