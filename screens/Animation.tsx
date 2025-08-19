import React, { useEffect } from "react";
import { View, StyleSheet } from "react-native";
import LottieView from "lottie-react-native";

type Props = {
  onDone: () => void;
};

export default function Animation({ onDone }: Props) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onDone();
    }, 4500); 

    return () => clearTimeout(timer);
  }, [onDone]);

  return (
    <View style={styles.container}>
      <LottieView
        source={require("../assets/Rq0TA7iszQ.json")} 
        autoPlay
        loop={false}
        onAnimationFinish={onDone}
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
  animation: {
    width: 300,
    height: 300,
  },
});
