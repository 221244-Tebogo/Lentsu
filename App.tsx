// App.tsx (only the relevant changes)
import React, { useCallback, useEffect, useState } from "react";
import { View } from "react-native";
import { NavigationContainer, DefaultTheme } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import * as SplashScreen from "expo-splash-screen";
import * as Font from "expo-font";
import AsyncStorage from "@react-native-async-storage/async-storage";

import Onboarding from "./screens/Onboarding";
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
const AppTheme = { ...DefaultTheme, colors: { ...DefaultTheme.colors, background: "#0B284A" } };
const ONBOARD_KEY = "@seen_onboarding_v1";

SplashScreen.preventAutoHideAsync();

export default function App() {
  const [ready, setReady] = useState(false);
  const [seen, setSeen] = useState<boolean | null>(null);

  useEffect(() => {
    (async () => {
      try {
        await Font.loadAsync({});
        const flag = await AsyncStorage.getItem(ONBOARD_KEY);
        setSeen(flag === "1");
      } catch (e) {
        setSeen(true); // fail-safe
      } finally {
        setReady(true);
      }
    })();
  }, []);

  const onLayout = useCallback(async () => {
    if (ready) await SplashScreen.hideAsync();
  }, [ready]);

  if (!ready || seen === null) return null;

  return (
    <View onLayout={onLayout} style={{ flex: 1 }}>
      {seen ? (
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
        </NavigationContainer>
      ) : (
        <Onboarding onDone={() => setSeen(true)} />
      )}
    </View>
  );
}


// import React, { useCallback, useEffect, useState } from "react";
// import { View } from "react-native";
// import { StatusBar } from "expo-status-bar";
// import { NavigationContainer, DefaultTheme } from "@react-navigation/native";
// import { createNativeStackNavigator } from "@react-navigation/native-stack";
// import * as SplashScreen from "expo-splash-screen";
// import * as Font from "expo-font";
// import Animation from "./screens/Animation";

// // Keep native splash visible
// SplashScreen.preventAutoHideAsync();

// // Screens
// import Login from "./screens/Login";
// import Registration from "./screens/Registration";
// import Home from "./screens/Home";
// import MapShare from "./screens/MapShare";
// import Camera from "./screens/Camera";
// import Listen from "./screens/Listen";
// import Emergency from "./screens/Emergency";
// import Settings from "./screens/Settings";
// import Profile from "./screens/Profile";

// const Stack = createNativeStackNavigator();

// const AppTheme = {
//   ...DefaultTheme,
//   colors: { ...DefaultTheme.colors, background: "#0B284A" }
// };

// export default function App() {
//   const [appIsReady, setAppIsReady] = useState(false);
//   const [showLottie, setShowLottie] = useState(true);

//   useEffect(() => {
//     async function prepareResources() {
//       try {
//         await Font.loadAsync({
//           // "SpaceMono": require("./assets/fonts/SpaceMono-Regular.ttf"),
//         });
//         await new Promise((r) => setTimeout(r, 300)); // shorter delay
//       } catch (err) {
//         console.warn("Error loading app resources:", err);
//       } finally {
//         setAppIsReady(true);
//       }
//     }
//     prepareResources();
//   }, []);

//   const onLayoutRootView = useCallback(async () => {
//     if (appIsReady) {
//       await SplashScreen.hideAsync(); // Hide native splash once our root view is ready
//     }
//   }, [appIsReady]);

//   if (!appIsReady) {
    
//     return null;
//   }

//   return (
//     <View onLayout={onLayoutRootView} style={{ flex: 1 }}>
//       {showLottie ? (
//         <Animation onDone={() => setShowLottie(false)} />
//       ) : (
//         <NavigationContainer theme={AppTheme}>
//           <Stack.Navigator initialRouteName="Login" screenOptions={{ headerShown: true }}>
//             <Stack.Screen name="Login" component={Login} />
//             <Stack.Screen name="Registration" component={Registration} />
//             <Stack.Screen name="Home" component={Home} />
//             <Stack.Screen name="MapShare" component={MapShare} />
//             <Stack.Screen name="Listen" component={Listen} />
//             <Stack.Screen name="Emergency" component={Emergency} />
//             <Stack.Screen name="Camera" component={Camera} />
//             <Stack.Screen name="Settings" component={Settings} />
//             <Stack.Screen name="Profile" component={Profile} />
//           </Stack.Navigator>
//           <StatusBar style="light" />
//         </NavigationContainer>
//       )}
//     </View>
//   );
// }
