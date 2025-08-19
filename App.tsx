import React, { useCallback, useEffect, useState } from "react";
import { View } from "react-native";
import { StatusBar } from "expo-status-bar";
import { NavigationContainer, DefaultTheme } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import * as SplashScreen from "expo-splash-screen";
import * as Font from "expo-font";
import Animation from "./screens/Animation";

// Keep native splash visible
SplashScreen.preventAutoHideAsync();

// Screens
import Login from "./screens/Login";
import Registration from "./screens/Registration";
import Home from "./screens/Home";
import MapShare from "./screens/MapShare";
import Camera from "./screens/Camera";
import Listen from "./screens/Listen";
import Emergency from "./screens/Emergency";
import Settings from "./screens/Settings";
import Profile from "./screens/Profile";

const Stack = createNativeStackNavigator();

const AppTheme = {
  ...DefaultTheme,
  colors: { ...DefaultTheme.colors, background: "#0B284A" }
};

export default function App() {
  const [appIsReady, setAppIsReady] = useState(false);
  const [showLottie, setShowLottie] = useState(true);

  useEffect(() => {
    async function prepareResources() {
      try {
        await Font.loadAsync({
          // "SpaceMono": require("./assets/fonts/SpaceMono-Regular.ttf"),
        });
        await new Promise((r) => setTimeout(r, 300)); // shorter delay
      } catch (err) {
        console.warn("Error loading app resources:", err);
      } finally {
        setAppIsReady(true);
      }
    }
    prepareResources();
  }, []);

  const onLayoutRootView = useCallback(async () => {
    if (appIsReady) {
      await SplashScreen.hideAsync();
    }
  }, [appIsReady]);

  if (!appIsReady) {
    
    return null;
  }

  return (
    <View onLayout={onLayoutRootView} style={{ flex: 1 }}>
      {showLottie ? (
        <Animation onDone={() => setShowLottie(false)} />
      ) : (
        <NavigationContainer theme={AppTheme}>
          <Stack.Navigator initialRouteName="Login" screenOptions={{ headerShown: true }}>
            <Stack.Screen name="Login" component={Login} />
            <Stack.Screen name="Registration" component={Registration} />
            <Stack.Screen name="Home" component={Home} />
            <Stack.Screen name="MapShare" component={MapShare} />
            <Stack.Screen name="Listen" component={Listen} />
            <Stack.Screen name="Emergency" component={Emergency} />
            <Stack.Screen name="Camera" component={Camera} />
            <Stack.Screen name="Settings" component={Settings} />
            <Stack.Screen name="Profile" component={Profile} />
          </Stack.Navigator>
          <StatusBar style="light" />
        </NavigationContainer>
      )}
    </View>
  );
}
