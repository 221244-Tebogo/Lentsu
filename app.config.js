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
      backgroundColor: "#0b1894",
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
        NSMicrophoneUsageDescription:
          "We need microphone access for voice features.",
        NSSpeechRecognitionUsageDescription:
          "We need speech recognition to enable voice commands.",
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
        backgroundColor: "#760909",
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
      [
        "@react-native-voice/voice",
        {
          microphonePermission:
            "Allow $(PRODUCT_NAME) to access your microphone for voice commands",
          speechRecognitionPermission:
            "Allow $(PRODUCT_NAME) to recognise your speech for voice control",
        },
      ],
    ],
    // Expo sign up - this is how the speech recognition worked!
    extra: {
      eas: {
        projectId: "d9d482d7-b784-4482-b2ad-a2e7166d6dfe",
      },
    },
  },
};

// app.config.js
// export default {
//   expo: {
//     scheme: "lentsu",
//     name: "lentsu",
//     slug: "lentsu",
//     version: "1.0.0",
//     orientation: "portrait",
//     icon: "./assets/icon.png",
//     userInterfaceStyle: "light",
//     newArchEnabled: true,
//     splash: {
//       image: "./assets/logo.png",
//       resizeMode: "contain",
//       backgroundColor: "#0b1894",
//     },
//     ios: {
//       supportsTablet: true,
//       bundleIdentifier: "com.yourcompany.lentsu",
//       config: {
//         googleMapsApiKey: "AIzaSyC_eMAo82GEngecUl7az3YtLk4B9MJrUTE",
//       },
//       infoPlist: {
//         NSLocationWhenInUseUsageDescription:
//           "We use your location to show where you are on the map and to share it with your contacts.",
//       },
//     },
//     android: {
//       permissions: [
//         "android.permission.RECORD_AUDIO",
//         "android.permission.ACCESS_NETWORK_STATE",
//         "android.permission.CAMERA",
//         "android.permission.INTERNET",
//         "android.permission.MODIFY_AUDIO_SETTINGS",
//         "android.permission.SYSTEM_ALERT_WINDOW",
//         "android.permission.WAKE_LOCK",
//         "android.permission.BLUETOOTH",
//       ],
//       adaptiveIcon: {
//         foregroundImage: "./assets/adaptive-icon.png",
//         backgroundColor: "#760909ff",
//       },
//       edgeToEdgeEnabled: true,
//       package: "com.yourcompany.lentsu",
//       config: {
//         googleMaps: {
//           apiKey: "AIzaSyC_eMAo82GEngecUl7az3YtLk4B9MJrUTE",
//         },
//       },
//     },
//     web: {
//       favicon: "./assets/favicon.png",
//     },
//     plugins: [
//       "expo-router",
//       [
//         "expo-camera",
//         {
//           cameraPermission: "Allow $(PRODUCT_NAME) to access your camera",
//           microphonePermission:
//             "Allow $(PRODUCT_NAME) to access your microphone",
//           recordAudioAndroid: true,
//         },
//       ],
//       [
//         "expo-location",
//         {
//           locationAlwaysAndWhenInUsePermission:
//             "Allow $(PRODUCT_NAME) to use your location.",
//         },
//       ],
//       "expo-media-library",
//       "expo-video",

//       [
//         "@react-native-voice/voice",
//         {
//           microphonePermission: "Allow SafeRide to access microphone",
//           speechRecognitionPermission: "Allow SafeRide to recognize speech",
//         },
//       ],
//     ],
//   },
// };

// export default {
//   expo: {
//     scheme: "lentsu",
//     name: "lentsu",
//     slug: "lentsu",
//     version: "1.0.0",
//     orientation: "portrait",
//     icon: "./assets/icon.png",
//     userInterfaceStyle: "light",
//     newArchEnabled: true,
//     splash: {
//       image: "./assets/logo.png",
//       resizeMode: "contain",
//       backgroundColor: "#0b1894ff",
//     },
//     ios: {
//       supportsTablet: true,
//       bundleIdentifier: "com.yourcompany.lentsu",
//       config: {
//         googleMapsApiKey: "AIzaSyC_eMAo82GEngecUl7az3YtLk4B9MJrUTE",
//       },
//       infoPlist: {
//         NSLocationWhenInUseUsageDescription:
//           "We use your location to show where you are on the map and to share it with your contacts.",
//       },
//     },
//     android: {
//       permissions: [
//         "android.permission.RECORD_AUDIO",
//         "android.permission.ACCESS_NETWORK_STATE",
//         "android.permission.CAMERA",
//         "android.permission.INTERNET",
//         "android.permission.MODIFY_AUDIO_SETTINGS",
//         "android.permission.SYSTEM_ALERT_WINDOW",
//         "android.permission.WAKE_LOCK",
//         "android.permission.BLUETOOTH",
//       ],
//       adaptiveIcon: {
//         foregroundImage: "./assets/adaptive-icon.png",
//         backgroundColor: "#760909ff",
//       },
//       edgeToEdgeEnabled: true,
//       package: "com.yourcompany.lentsu",
//       config: {
//         googleMaps: {
//           apiKey: "AIzaSyC_eMAo82GEngecUl7az3YtLk4B9MJrUTE",
//         },
//       },
//     },
//     web: {
//       favicon: "./assets/favicon.png",
//     },
//     plugins: [
//       "expo-router",
//       [
//         "expo-camera",
//         {
//           cameraPermission: "Allow $(PRODUCT_NAME) to access your camera",
//           microphonePermission:
//             "Allow $(PRODUCT_NAME) to access your microphone",
//           recordAudioAndroid: true,
//         },
//       ],

//       [
//         "expo-location",
//         {
//           locationAlwaysAndWhenInUsePermission:
//             "Allow $(PRODUCT_NAME) to use your location.",
//         },
//       ],
//       "expo-media-library",
//       "expo-video",
//     ],
//   },
// };
