import React, { useEffect, useRef } from "react";
import { View, StyleSheet } from "react-native";
import { Image } from "expo-image";       
import { Audio } from "expo-av";

type Props = { onDone: () => void };

export default function SplashAnimation({ onDone }: Props) {
  const doneRef = useRef(false);

  useEffect(() => {
    let sound: Audio.Sound | null = null;

    const finishOnce = () => {
      if (!doneRef.current) {
        doneRef.current = true;
        onDone();
      }
    };

    (async () => {
      try {
        const { sound: snd } = await Audio.Sound.createAsync(
          require("../assets/success-340660.mp3")
        );
        sound = snd;

        sound.setOnPlaybackStatusUpdate((status) => {
          // advance as soon as the sound finishes (if it plays)
          if ("isLoaded" in status && status.isLoaded && status.didJustFinish) {
            finishOnce();
          }
        });

        await sound.playAsync();
      } catch {
        // ignore: the timeout below will still advance
      }
    })();

 
    const t = setTimeout(finishOnce, 5000);

    return () => {
      clearTimeout(t);
      if (sound) sound.unloadAsync();
    };
  }, [onDone]);

  return (
    <View style={styles.container}>
      <Image
        source={require("../assets/mic.gif")} 
        style={styles.animation}
        contentFit="contain"
       
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
