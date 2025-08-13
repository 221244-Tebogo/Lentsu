import React, { useEffect, useState } from "react";
import { View, Text, Button, StyleSheet, SafeAreaView } from "react-native";
import { getUserInfo, getUserDoc, logoutUser } from "../services/authService";

export default function Profile({ navigation }) {
  const user = getUserInfo();
  const [profile, setProfile] = useState<any>(null);

  useEffect(() => {
    let mounted = true;
    if (user?.uid) {
      getUserDoc(user.uid).then((d) => mounted && setProfile(d));
    }
    return () => { mounted = false; };
  }, [user?.uid]);

  async function onSignOut() {
    await logoutUser();
    navigation.reset({ index: 0, routes: [{ name: "Login" }] });
  }

  return (
    <SafeAreaView style={styles.c}>
      <Text style={styles.t}>Profile</Text>
      <Text style={styles.s}>Auth Email: {user?.email ?? "-"}</Text>
      <Text style={styles.s}>Name (db): {profile?.name ?? "-"}</Text>
      <View style={{ height: 12 }} />
      <Button title="Sign Out" onPress={onSignOut} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  c: { flex: 1, 
    backgroundColor: "#0B284A", 
    padding: 20, 
    justifyContent: "center" 
  },


  t: { 
    color: "#fff", 
    fontSize: 24, 
    fontWeight: "800" 
  },

  s: { 
    color: "#E6EEF7", 
    marginTop: 8 
  },
});
