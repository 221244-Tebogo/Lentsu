// app.config.js
export default {
  expo: {
    scheme: "lentsu",
    name: "lentsu",
    slug: "lentsu",
    version: "1.0.0",
    orientation: "portrait",
    icon: "./assets/icon.png",
    userInterfaceStyle: "light",
    newArchEnabled: true,
    splash: {
      image: "./assets/logo.png",
      resizeMode: "contain",
      backgroundColor: "#0b1894ff",
    },
    ios: {
      supportsTablet: true,
      bundleIdentifier: "com.yourcompany.lentsu",
      config: {
        googleMapsApiKey: "AIzaSyC_eMAo82GEngecUl7az3YtLk4B9MJrUTE",
      },
      infoPlist: {
        NSLocationWhenInUseUsageDescription:
          "We use your location to show where you are on the map and to share it with your contacts.",
      },
    },
    android: {
      permissions: [
        "android.permission.RECORD_AUDIO",
        "android.permission.ACCESS_NETWORK_STATE",
        "android.permission.CAMERA",
        "android.permission.INTERNET",
        "android.permission.MODIFY_AUDIO_SETTINGS",
        "android.permission.SYSTEM_ALERT_WINDOW",
        "android.permission.WAKE_LOCK",
        "android.permission.BLUETOOTH",
      ],
      adaptiveIcon: {
        foregroundImage: "./assets/adaptive-icon.png",
        backgroundColor: "#760909ff",
      },
      edgeToEdgeEnabled: true,
      package: "com.yourcompany.lentsu",
      config: {
        googleMaps: {
          apiKey: "AIzaSyC_eMAo82GEngecUl7az3YtLk4B9MJrUTE",
        },
      },
    },
    web: {
      favicon: "./assets/favicon.png",
    },
    plugins: [
      "expo-router",
      [
        "expo-camera",
        {
          cameraPermission: "Allow $(PRODUCT_NAME) to access your camera",
          microphonePermission:
            "Allow $(PRODUCT_NAME) to access your microphone",
          recordAudioAndroid: true,
        },
      ],
      [
        "expo-location",
        {
          locationAlwaysAndWhenInUsePermission:
            "Allow $(PRODUCT_NAME) to use your location.",
        },
      ],
      "expo-media-library",
      "expo-video",
    ],
  },
};
