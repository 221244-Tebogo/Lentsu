import React, { createContext, useMemo, useState, useEffect } from "react";
import { Appearance, useColorScheme } from "react-native";
import * as SplashScreen from "expo-splash-screen";
import { useFonts, Poppins_400Regular, Poppins_500Medium, Poppins_600SemiBold } from "@expo-google-fonts/poppins";
import * as Font from "expo-font";
import { GluestackUIProvider } from "@gluestack-ui/themed";
import { config } from "@gluestack-ui/config";

SplashScreen.preventAutoHideAsync().catch(() => {});

type ThemeCtx = { isDark: boolean; toggleTheme: () => void };
export const ThemeContext = createContext<ThemeCtx>({ isDark: false, toggleTheme: () => {} });

export default function AppUIProvider({ children }: { children: React.ReactNode }) {
  const system = useColorScheme();
  const [forced, setForced] = useState<boolean | null>(null);
  const isDark = forced ?? (system === "dark");

  const [loaded] = useFonts({
    Poppins_400Regular,
    Poppins_500Medium,
    Poppins_600SemiBold,
  });

  useEffect(() => {
    (async () => {
      await Font.loadAsync({});
      if (loaded) await SplashScreen.hideAsync().catch(() => {});
    })();
  }, [loaded]);

  const value = useMemo(
    () => ({ isDark, toggleTheme: () => setForced(prev => (prev === null ? !isDark : !prev)) }),
    [isDark]
  );

  if (!loaded) return null;

  return (
    <ThemeContext.Provider value={value}>
      <GluestackUIProvider config={config} mode={isDark ? "dark" : "light"}>
        {children}
      </GluestackUIProvider>
    </ThemeContext.Provider>
  );
}
