import "react-native-gesture-handler";
import React, { useCallback, useEffect, useState } from "react";
import { View, ActivityIndicator } from "react-native";
import { NavigationContainer, DefaultTheme, DarkTheme as NavDark } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import * as SplashScreen from "expo-splash-screen";
import * as Font from "expo-font";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { StatusBar } from "expo-status-bar";

import { onAuthStateChanged, User } from "firebase/auth";
import { auth } from "./firebase";

import { AuthProvider } from "./context/auth";
import AppUIProvider, { ThemeContext } from "./AppUIProvider";
import AppBackground from "./components/AppBackground";
import SplashAnimation from "./screens/Animation";

import Onboarding from "./screens/Onboarding";
import Login from "./screens/Login";
import Registration from "./screens/Registration";
import Home from "./screens/Home";
import MapShare from "./screens/MapShare";
import Camera from "./screens/Camera";

import Listen from "./screens/Listen";
import VoiceApp from "./screens/VoiceApp";
import Emergency from "./screens/Emergency";
import Settings from "./screens/Settings";
import Profile from "./screens/Profile";

const AuthStack = createNativeStackNavigator();
const AppStack = createNativeStackNavigator();
const ONBOARD_KEY = "@seen_onboarding_v1";

SplashScreen.preventAutoHideAsync().catch(() => {});
export default function App() {
  const [ready, setReady] = useState(false);
  const [seen, setSeen] = useState<boolean | null>(null);
  const [showSplash, setShowSplash] = useState(true);
  const [user, setUser] = useState<User | null | undefined>(undefined);

  useEffect(() => {
    (async () => {
      try {
        await Font.loadAsync({});
        const flag = await AsyncStorage.getItem(ONBOARD_KEY);
        setSeen(flag === "1");
      } catch {
        setSeen(true);
      } finally {
        setReady(true);
      }
    })();
  }, []);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => setUser(u));
    return () => unsub();
  }, []);

  const onSplashLayout = useCallback(async () => {
    if (ready && showSplash) {
      try { await SplashScreen.hideAsync(); } catch {}
    }
  }, [ready, showSplash]);

  if (!ready || seen === null || user === undefined) {
    return (
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center", backgroundColor: "#0B284A" }}>
        <ActivityIndicator color="#fff" />
      </View>
    );
  }

  const themeLight = { ...DefaultTheme, colors: { ...DefaultTheme.colors, background: "#0B284A" } };

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <AuthProvider>
        <AppUIProvider>
          <ThemeContext.Consumer>
            {({ isDark }) => (
              <View style={{ flex: 1 }}>
                <AppBackground />
                <StatusBar style="light" />

                {showSplash ? (
                  <SplashAnimation onDone={() => setShowSplash(false)} />
                ) : seen ? (
                  <NavigationContainer theme={isDark ? NavDark : themeLight}>
                    {user ? (
                      <AppStack.Navigator screenOptions={{ headerShown: false }}>
                        <AppStack.Screen name="Home" component={Home} />
                        <AppStack.Screen name="MapShare" component={MapShare} />
                        <AppStack.Screen name="Listen" component={Listen} />
                        <AppStack.Screen name="VoiceApp" component={VoiceApp} />
                        <AppStack.Screen name="Emergency" component={Emergency} />
                        <AppStack.Screen name="Camera" component={Camera} />
                        <AppStack.Screen name="Settings" component={Settings} />
                        <AppStack.Screen name="Profile" component={Profile} />
                      </AppStack.Navigator>
                    ) : (
                      <AuthStack.Navigator screenOptions={{ headerShown: false }}>
                        <AuthStack.Screen name="Login" component={Login} />
                        <AuthStack.Screen name="Registration" component={Registration} />
                      </AuthStack.Navigator>
                    )}
                  </NavigationContainer>
                ) : (
                  <Onboarding
                    onDone={async () => {
                      try { await AsyncStorage.setItem(ONBOARD_KEY, "1"); } catch {}
                      setSeen(true);
                    }}
                  />
                )}

              </View>
            )}
          </ThemeContext.Consumer>
        </AppUIProvider>
      </AuthProvider>
    </GestureHandlerRootView>
  );
}
