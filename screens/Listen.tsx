import React from 'react';
import { StyleSheet, Text, View, Button } from 'react-native';
import { Audio } from 'expo-av';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { Ionicons } from "@expo/vector-icons";

const COLORS = {
  bg: "#08111B",
  text: "#E6EEF7",
  sub: "#90A4B8",
  card: "#0E1C2C",
  ring: "#16314B",
  primary: "#FF7A2F",
  accent: "#FFC530",
  danger: "#FF6B6B",
};

export default function Listen() {
  const [recording, setRecording] = React.useState<Audio.Recording | undefined>();
  const [recordings, setRecordings] = React.useState<any[]>([]);

  async function startRecording() {
    try {
      const permission = await Audio.requestPermissionsAsync();
      if (permission.status !== 'granted') {
        alert('Permission to access microphone is required!');
        return;
      }

      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true
      });

      const { recording } = await Audio.Recording.createAsync(
        Audio.RECORDING_OPTIONS_PRESET_HIGH_QUALITY
      );

      setRecording(recording);
    } catch (err) {
      console.error('Failed to start recording:', err);
    }
  }

  async function stopRecording() {
    try {
      if (!recording) return;

      setRecording(undefined);
      await recording.stopAndUnloadAsync();

      const { sound, status } = await recording.createNewLoadedSoundAsync();
      const uri = recording.getURI();

      const newRecording = {
        sound,
        duration: getDurationFormatted(status.durationMillis || 0),
        file: uri
      };

      setRecordings(prev => [...prev, newRecording]);

      // Save to Firestore
      if (uri) {
        await addDoc(collection(db, 'recordings'), {
          duration: newRecording.duration,
          file: uri,
          timestamp: new Date()
        });
        console.log('Recording saved to Firestore');
      }
    } catch (err) {
      console.error('Failed to stop/save recording:', err);
    }
  }

  function getDurationFormatted(milliseconds: number) {
    const minutes = Math.floor(milliseconds / 60000);
    const seconds = Math.round((milliseconds % 60000) / 1000);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  }

  function getRecordingLines() {
    return recordings.map((recordingLine, index) => (
      <View key={index} style={styles.row}>
        <Text style={styles.fill}>
          Recording #{index + 1} | {recordingLine.duration}
        </Text>
        <Button onPress={() => recordingLine.sound.replayAsync()} title="Play" />
      </View>
    ));
  }

  function clearRecordings() {
    setRecordings([]);
  }

  return (
    <View style={styles.container}>
      <Button
        title={recording ? 'Stop Recording' : 'Start Recording'}
        onPress={recording ? stopRecording : startRecording}
      />
      {getRecordingLines()}
      {recordings.length > 0 && (
        <Button title="Clear Recordings" onPress={clearRecordings} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 20,
    marginVertical: 10,
  },
  fill: {
    flex: 1,
    marginRight: 10,
  },
});

