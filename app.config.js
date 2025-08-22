module.exports = ({ config }) => ({
  ...config,
  scheme: "lentsu",
  name: "lentsu",
  slug: "lentsu",
  version: "1.0.0",
  orientation: "portrait",
  icon: "./assets/icon.png",
  userInterfaceStyle: "light",
  newArchEnabled: true,
  assetBundlePatterns: ["**/*"],

  splash: {
    image: "./assets/logo.png",
    resizeMode: "contain",
    backgroundColor: "#0b1894",
  },

  ios: {
    supportsTablet: true,
    bundleIdentifier: "com.yourcompany.lentsu",
    config: {
      googleSignIn: {
        reservedClientId:
          "com.googleusercontent.apps.1044569860680-cod2es1ho3g55nqq2vkh9uvdhn41l8rh",
      },
      googleMapsApiKey: process.env.IOS_MAPS_KEY,
    },
    infoPlist: {
      NSLocationWhenInUseUsageDescription:
        "We use your location to show where you are on the map and to share it with your contacts.",
      NSMicrophoneUsageDescription:
        "We need microphone access for voice features.",
      NSSpeechRecognitionUsageDescription:
        "We need speech recognition to enable voice commands.",
    },
  },

  android: {
    package: "com.yourcompany.lentsu",
    edgeToEdgeEnabled: true,
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
      backgroundColor: "#0B284A",
    },
    config: {
      googleMaps: {
        apiKey: process.env.ANDROID_MAPS_KEY,
      },
    },
  },

  web: {
    favicon: "./assets/favicon.png",
  },

  plugins: [
    "expo-router",
    "expo-audio",
    "expo-media-library",
    "expo-video",
    "expo-web-browser",
    [
      "expo-camera",
      {
        cameraPermission: "Allow $(PRODUCT_NAME) to access your camera",
        microphonePermission: "Allow $(PRODUCT_NAME) to access your microphone",
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
    [
      "@react-native-voice/voice",
      {
        microphonePermission:
          "Allow $(PRODUCT_NAME) to access your microphone for voice commands",
        speechRecognitionPermission:
          "Allow $(PRODUCT_NAME) to recognise your speech for voice control",
      },
    ],
    [
      "expo-splash-screen",
      {
        image: "./assets/logo.png",
        resizeMode: "contain",
        backgroundColor: "#FBBC05",
      },
    ],
  ],

  extra: {
    API_BASE: process.env.API_BASE,
    GOOGLE_IOS_CLIENT_ID: process.env.GOOGLE_IOS_CLIENT_ID,
    GOOGLE_ANDROID_CLIENT_ID: process.env.GOOGLE_ANDROID_CLIENT_ID,
    GOOGLE_WEB_CLIENT_ID: process.env.GOOGLE_WEB_CLIENT_ID,
    eas: {
      projectId: "d9d482d7-b784-4482-b2ad-a2e7166d6dfe",
    },
  },
});
