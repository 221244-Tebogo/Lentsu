import React, { useState } from 'react';
import { View, Text, Button, StyleSheet, Share } from 'react-native';
import Voice from '@react-native-voice/voice';

export default function App() {
  const [text, setText] = useState('');

  const startListening = async () => {
    Voice.onSpeechResults = (e) => setText(e.value[0]);
    await Voice.start('en-US');
  };

  const stopListening = async () => {
    await Voice.stop();
  };

  const clearText = () => {
    setText('');
  };

  const shareText = async () => {
    try {
      await Share.share({
        message: text,
      });
    } catch (error) {
      alert('Error sharing text: ' + error.message);
    }
  };

  return (
    <View style={styles.container}>
      <Button title="Start Voice" onPress={startListening} color="#ffffff" />
      <View style={{ height: 10 }} />
      <Button title="Stop Voice" onPress={stopListening} color="#ffffff" />
      <View style={{ height: 10 }} />
      <Button title="Clear" onPress={clearText} color="#ff4444" />
      <View style={{ height: 10 }} />
      <Button title="Share" onPress={shareText} color="#00cc00" />
      <Text style={styles.resultText}>Result: {text}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },
  resultText: {
    color: '#ffffff',
    fontSize: 18,
    marginTop: 20,
  },
});


//--------------OLD NOT WOR----
// import React, { useState, useEffect } from 'react';
// import { View, Text, Button, PermissionsAndroid, Platform } from 'react-native';
// import Voice from '@react-native-voice/voice';

// const VoiceApp = () => {
//   const [recognizedText, setRecognizedText] = useState('');
//   const [isListening, setIsListening] = useState(false);

//   useEffect(() => {
//     Voice.onSpeechStart = () => setIsListening(true);
//     Voice.onSpeechEnd = () => setIsListening(false);
//     Voice.onSpeechResults = (event) => setRecognizedText(event.value[0]);
//     Voice.onSpeechError = (error) => console.error('Speech error:', error);

//     return () => {
//       Voice.destroy().then(Voice.removeAllListeners);
//     };
//   }, []);

//   const requestAudioPermission = async () => {
//     if (Platform.OS === 'android') {
//       try {
//         const granted = await PermissionsAndroid.request(
//           PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
//           {
//             title: 'Microphone Permission',
//             message: 'This app needs access to your microphone to record audio.',
//             buttonNeutral: 'Ask Me Later',
//             buttonNegative: 'Cancel',
//             buttonPositive: 'OK',
//           },
//         );
//         if (granted === PermissionsAndroid.RESULTS.GRANTED) {
//           console.log('You can use the microphone');
//         } else {
//           console.log('Microphone permission denied');
//         }
//       } catch (err) {
//         console.warn(err);
//       }
//     }
//   };

//   const startListening = async () => {
//     await requestAudioPermission(); // Request permission before starting
//     try {
//       await Voice.start('en-US'); // Specify language code
//     } catch (e) {
//       console.error(e);
//     }
//   };

//   const stopListening = async () => {
//     try {
//       await Voice.stop();
//     } catch (e) {
//       console.error(e);
//     }
//   };

//   return (
//     <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
//       <Text>{recognizedText}</Text>
//       <Button title={isListening ? 'Stop Listening' : 'Start Listening'} onPress={isListening ? stopListening : startListening} />
//     </View>
//   );
// };

// export default VoiceApp;

// import React, { useState, useEffect } from 'react';
// import { View, Text, Button, StyleSheet } from 'react-native';
// import Voice from '@react-native-community/voice';

// const VoiceApp = () => {
//   const [recognizedText, setRecognizedText] = useState('');
//   const [isListening, setIsListening] = useState(false);

//   useEffect(() => {
//     Voice.onSpeechStart = onSpeechStart;
//     Voice.onSpeechEnd = onSpeechEnd;
//     Voice.onSpeechResults = onSpeechResults;
//     Voice.onSpeechError = onSpeechError;

//     return () => {
//       Voice.destroy().then(Voice.removeAllListeners);
//     };
//   }, []);

//   const onSpeechStart = (e) => {
//     console.log('onSpeechStart: ', e);
//     setIsListening(true);
//   };

//   const onSpeechEnd = (e) => {
//     console.log('onSpeechEnd: ', e);
//     setIsListening(false);
//   };

//   const onSpeechResults = (e) => {
//     console.log('onSpeechResults: ', e);
//     if (e.value && e.value.length > 0) {
//       setRecognizedText(e.value[0]);
//     }
//   };

//   const onSpeechError = (e) => {
//     console.log('onSpeechError: ', e);
//   };

//   const startListening = async () => {
//     setRecognizedText('');
//     try {
//       await Voice.start('en-US'); // Specify locale if needed
//     } catch (error) {
//       console.error(error);
//     }
//   };

//   const stopListening = async () => {
//     try {
//       await Voice.stop();
//     } catch (error) {
//       console.error(error);
//     }
//   };

//   return (
//     <View style={styles.container}>
//       <Text style={styles.statusText}>
//         Status: {isListening ? 'Listening...' : 'Not Listening'}
//       </Text>
//       <Text style={styles.resultText}>Recognized Text: {recognizedText}</Text>
//       <View style={styles.buttonContainer}>
//         <Button title="Start Listening" onPress={startListening} disabled={isListening} />
//         <Button title="Stop Listening" onPress={stopListening} disabled={!isListening} />
//       </View>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     padding: 20,
//   },
//   statusText: {
//     fontSize: 18,
//     marginBottom: 10,
//   },
//   resultText: {
//     fontSize: 20,
//     fontWeight: 'bold',
//     textAlign: 'center',
//     marginBottom: 20,
//   },
//   buttonContainer: {
//     flexDirection: 'row',
//     justifyContent: 'space-around',
//     width: '100%',
//   },
// });

// export default VoiceApp;

// import React, { useState } from 'react';
// import { View, Text, Button, StyleSheet } from 'react-native';
// import * as SpeechRecognition from 'expo-speech-recognition';
// import { useNavigation } from '@react-navigation/native';

// const VoiceApp = () => {
//   const [recognizedText, setRecognizedText] = useState('');
//   const [isListening, setIsListening] = useState(false);
//   const navigation = useNavigation();

//   const handleCommand = (text) => {
//     const command = text.toLowerCase();

//     if (command.includes("open emergency")) {
//       navigation.navigate("Emergency");
//     } else if (command.includes("open profile")) {
//       navigation.navigate("Profile");
//     } else if (command.includes("call security")) {
//       navigation.navigate("Security");
//     } else if (command.includes("play music")) {
//       navigation.navigate("Music");
//     } else {
//       console.log("Command not recognized.");
//     }
//   };

//   const startListening = async () => {
//     try {
//       setIsListening(true);
//       const result = await SpeechRecognition.startAsync({
//         language: 'en-US',
//       });

//       const transcript = result.transcript;
//       setRecognizedText(transcript);
//       handleCommand(transcript);
//       setIsListening(false);
//     } catch (e) {
//       console.error('Speech recognition error:', e);
//       setIsListening(false);
//     }
//   };

//   return (
//     <View style={styles.container}>
//       <Button
//         title={isListening ? "Listening..." : "Tap to Speak"}
//         onPress={startListening}
//         disabled={isListening}
//       />
//       <Text style={styles.text}>You said: {recognizedText}</Text>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     padding: 20,
//     backgroundColor: '#0E1C2C',
//     flex: 1,
//     justifyContent: 'center',
//   },
//   text: {
//     marginTop: 20,
//     color: '#FFC530',
//     fontSize: 18,
//     fontWeight: 'bold',
//   },
// });

// export default VoiceApp;

//READS TEXTS 
// import { View, StyleSheet, Button } from 'react-native';
// import * as Speech from 'expo-speech';

// export default function VoiceApp() {
//   const speak = () => {
//     const thingToSay = 'How can I help';
//     Speech.speak(thingToSay);
//   };

//   return (
//     <View style={styles.container}>
//       <Button title="Press to hear some words" onPress={speak} />
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     justifyContent: 'center',
//     backgroundColor: '#ecf0f1',
//     padding: 8,
//   },
// });
