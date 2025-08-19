import React, { useState } from 'react';
import { View, Text, Button, Share, StyleSheet } from 'react-native';
import Voice from '@react-native-voice/voice';

export default function VoiceToTextShare() {
  const [text, setText] = useState('');
  const [isRecording, setIsRecording] = useState(false);

  const startRecording = async () => {
    try {
      setIsRecording(true);
      await Voice.start('en-US');
      Voice.onSpeechResults = (result) => {
        const spokenText = result.value[0];
        setText(spokenText);
      };
    } catch (e) {
      console.error('Start Error:', e);
    }
  };

  const stopRecording = async () => {
    try {
      await Voice.stop();
      setIsRecording(false);
    } catch (e) {
      console.error('Stop Error:', e);
    }
  };

  const handleShare = async () => {
    try {
      await Share.share({
        message: text || 'No message to share yet.',
      });
    } catch (error) {
      console.error('Share Error:', error.message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Speak and Share</Text>

      <Button
        title={isRecording ? 'Stop Recording' : 'Start Recording'}
        onPress={isRecording ? stopRecording : startRecording}
      />

      <Text style={styles.transcription}>{text}</Text>

      {text ? (
        <Button title="Share Message" onPress={handleShare} />
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 24 },
  heading: { fontSize: 24, fontWeight: 'bold', marginBottom: 20 },
  transcription: { marginVertical: 20, fontSize: 18, color: '#333' },
});


// // screens/VoiceToText.tsx
// import React, { useState, useEffect } from 'react';
// import { View, Text, TouchableOpacity, StyleSheet, ActivityIndicator, Alert } from 'react-native';
// import Voice from '@react-native-voice/voice';

// export default function VoiceToText() {
//   const [started, setStarted] = useState(false);
//   const [results, setResults] = useState<string[]>([]);
//   const [isProcessing, setIsProcessing] = useState(false);

//   useEffect(() => {
//     Voice.onSpeechStart = () => setStarted(true);
//     Voice.onSpeechEnd = () => setStarted(false);
//     Voice.onSpeechResults = (event) => {
//       setResults(event.value || []);
//       setIsProcessing(false);
//     };

//     return () => {
//       Voice.destroy().then(Voice.removeAllListeners);
//     };
//   }, []);

//   const startRecording = async () => {
//     try {
//       setResults([]);
//       setIsProcessing(true);
//       await Voice.start('en-US');
//     } catch (error) {
//       Alert.alert('Error', 'Could not start recording');
//       setIsProcessing(false);
//     }
//   };

//   const stopRecording = async () => {
//     try {
//       await Voice.stop();
//     } catch (error) {
//       Alert.alert('Error', 'Could not stop recording');
//     }
//   };

//   return (
//     <View style={styles.container}>
//       <Text style={styles.h1}>Tap and Speak</Text>

//       <TouchableOpacity
//         style={[styles.recordBtn, started ? styles.stopBtn : styles.startBtn]}
//         onPress={started ? stopRecording : startRecording}
//       >
//         <Text style={styles.btnText}>{started ? 'Stop' : 'Record'}</Text>
//       </TouchableOpacity>

//       {isProcessing && <ActivityIndicator size="large" color="#FF7A2F" />}

//       <Text style={styles.resultTitle}>Transcript:</Text>
//       {results.map((text, index) => (
//         <Text key={index} style={styles.resultText}>
//           {text}
//         </Text>
//       ))}
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#E6EEF7',
//     padding: 20,
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
//   h1: {
//     fontSize: 24,
//     fontWeight: 'bold',
//     marginBottom: 20,
//   },
//   recordBtn: {
//     paddingVertical: 15,
//     paddingHorizontal: 30,
//     borderRadius: 50,
//     marginBottom: 30,
//   },
//   startBtn: {
//     backgroundColor: '#28A745',
//   },
//   stopBtn: {
//     backgroundColor: '#DC3545',
//   },
//   btnText: {
//     color: '#fff',
//     fontWeight: 'bold',
//   },
//   resultTitle: {
//     fontSize: 18,
//     fontWeight: '600',
//     marginTop: 10,
//   },
//   resultText: {
//     fontSize: 16,
//     marginTop: 5,
//     textAlign: 'center',
//   },
// });

// // screens/VoiceToText.tsx
// import React, { useEffect, useState } from "react";
// import { View, Text, StyleSheet, TouchableOpacity, Share, Alert } from "react-native";
// import Voice from "@react-native-voice/voice";
// import { Ionicons } from "@expo/vector-icons";

// export default function VoiceToText() {
//   const [isRecording, setIsRecording] = useState(false);
//   const [transcript, setTranscript] = useState("");

//   useEffect(() => {
//     Voice.onSpeechResults = (event) => {
//       if (event.value?.[0]) {
//         setTranscript(event.value[0]);
//       }
//     };

//     Voice.onSpeechError = (error) => {
//       console.error("Voice error:", error);
//       Alert.alert("Error", "Speech recognition failed. Try again.");
//       setIsRecording(false);
//     };

//     return () => {
//       Voice.destroy().then(Voice.removeAllListeners);
//     };
//   }, []);

//   const startRecording = async () => {
//     try {
//       setTranscript("");
//       setIsRecording(true);
//       await Voice.start("en-US");
//     } catch (error) {
//       console.error("Start error:", error);
//     }
//   };

//   const stopRecording = async () => {
//     try {
//       await Voice.stop();
//       setIsRecording(false);
//     } catch (error) {
//       console.error("Stop error:", error);
//     }
//   };

//   const handleShare = async () => {
//     try {
//       await Share.share({
//         message: transcript || "No message to share.",
//       });
//     } catch (error) {
//       Alert.alert("Sharing failed", "Could not share the message.");
//     }
//   };

//   return (
//     <View style={styles.container}>
//       <Text style={styles.heading}>🎤 Transcribe Emergency Voice Note</Text>

//       <TouchableOpacity
//         style={[styles.button, isRecording ? styles.stop : styles.start]}
//         onPress={isRecording ? stopRecording : startRecording}
//       >
//         <Ionicons name="mic" size={28} color="#fff" />
//         <Text style={styles.buttonText}>
//           {isRecording ? "Stop Recording" : "Start Recording"}
//         </Text>
//       </TouchableOpacity>

//       {transcript ? (
//         <View style={styles.transcriptCard}>
//           <Text style={styles.label}>Transcription:</Text>
//           <Text style={styles.transcript}>{transcript}</Text>

//           <TouchableOpacity style={styles.shareBtn} onPress={handleShare}>
//             <Ionicons name="share-social" size={20} color="#fff" />
//             <Text style={styles.shareText}>Share Message</Text>
//           </TouchableOpacity>
//         </View>
//       ) : null}
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: "#0B284A",
//     padding: 20,
//     justifyContent: "center",
//   },
//   heading: {
//     color: "#fff",
//     fontSize: 22,
//     textAlign: "center",
//     marginBottom: 30,
//     fontWeight: "600",
//   },
//   button: {
//     flexDirection: "row",
//     backgroundColor: "#FBBC05",
//     padding: 15,
//     borderRadius: 50,
//     alignItems: "center",
//     justifyContent: "center",
//     gap: 10,
//     alignSelf: "center",
//   },
//   start: { backgroundColor: "#28A745" },
//   stop: { backgroundColor: "#DC3545" },
//   buttonText: { color: "#fff", fontWeight: "bold" },
//   transcriptCard: {
//     marginTop: 30,
//     backgroundColor: "#fff",
//     borderRadius: 12,
//     padding: 16,
//   },
//   label: {
//     fontWeight: "bold",
//     color: "#333",
//     marginBottom: 8,
//   },
//   transcript: {
//     color: "#000",
//     fontSize: 16,
//     marginBottom: 16,
//   },
//   shareBtn: {
//     backgroundColor: "#1877F2",
//     padding: 12,
//     borderRadius: 10,
//     flexDirection: "row",
//     justifyContent: "center",
//     gap: 8,
//   },
//   shareText: {
//     color: "#fff",
//     fontWeight: "600",
//   },
// });
