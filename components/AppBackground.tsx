// components/ui/AppBackground.tsx
import React from "react";
import { StyleSheet, View } from "react-native";
import Svg, { Defs, RadialGradient, Rect, Stop } from "react-native-svg";

/**
 * Radial: center ~25% color -> #0B284A, edges -> #031224
 */
export default function AppBackground() {
  return (
    <View pointerEvents="none" style={StyleSheet.absoluteFill}>
      <Svg width="100%" height="100%" preserveAspectRatio="none" viewBox="0 0 100 100">
        <Defs>
          <RadialGradient id="bg" cx="50%" cy="45%" r="75%">
            <Stop offset="25%" stopColor="#0B284A" />
            <Stop offset="100%" stopColor="#031224" />
          </RadialGradient>
        </Defs>
        <Rect x="0" y="0" width="100" height="100" fill="url(#bg)" />
      </Svg>
    </View>
  );
}
