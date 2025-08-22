import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ActivityIndicator,
  Alert,
  Platform,
  Image,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useAuth } from "../context/auth";
import { LinearGradient } from "expo-linear-gradient";
import { ThemeContext } from "../AppUIProvider";
import { FontAwesome } from "@expo/vector-icons";

const text = "#E6EEF7";

export default function Login() {
  const navigation = useNavigation();
  const { signIn, isLoading, error, ready, user } = useAuth();
  const { isDark } = React.useContext(ThemeContext);

  React.useEffect(() => {
    if (user) {
      // @ts-ignore
      navigation.reset({ index: 0, routes: [{ name: "Home" }] });
    }
  }, [user]);

  React.useEffect(() => {
    if (error) Alert.alert("Google sign-in failed", String(error?.message ?? error));
  }, [error]);

  return (
    <SafeAreaView style={styles.container}>
      {/* Background gradient */}
      <LinearGradient
        colors={isDark ? ["#0B0F14", "#0D1218"] : ["#0B284A", "#0E3C76"]}
        start={[0, 1]}
        end={[1, 0]}
        style={StyleSheet.absoluteFill}
      />

      {/* Center logo */}
      <View style={styles.logoWrap}>
        <Image source={require("../assets/logo.png")} style={styles.logo} resizeMode="contain" />
      </View>

      {/* Bottom text + actions */}
      <View style={styles.content}>
        <Text style={styles.h}>Login</Text>
        <Text style={styles.sub}>Welcome back to Lentsu</Text>
      </View>

      <View style={styles.bottomBar}>
        <TouchableOpacity
          style={styles.googleBtn}
          onPress={signIn}
          disabled={!ready || isLoading}
          activeOpacity={0.9}
        >
          {isLoading ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <View style={styles.googleRow}>
              <FontAwesome name="google" size={20} color="#FFFFFF" style={{ marginRight: 10 }} />
              <Text style={styles.googleText}>Continue with Google</Text>
            </View>
          )}
        </TouchableOpacity>

        {/* Optional secondary link */}
        <TouchableOpacity
          onPress={() => {
            // @ts-ignore
            navigation.navigate("Registration");
          }}
          style={styles.secondaryWrap}
        >
          <Text style={styles.secondaryText}>Create an account</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  logoWrap: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  logo: {
    width: 160,
    height: 160,
  },
  content: {
    justifyContent: "flex-end",
    alignItems: "center",
    paddingHorizontal: 24,
    paddingBottom: 16,
  },
  h: {
    color: "#FFFFFF",
    fontSize: 32,
    fontFamily: Platform.select({
      ios: "Poppins-SemiBold",
      android: "Poppins_600SemiBold",
      default: "Poppins_600SemiBold",
    }),
  },
  sub: {
    color: text,
    marginTop: 8,
    fontSize: 14,
    opacity: 0.9,
    textAlign: "center",
    fontFamily: Platform.select({
      ios: "Poppins-Regular",
      android: "Poppins_400Regular",
      default: "Poppins_400Regular",
    }),
  },
  bottomBar: {
    paddingHorizontal: 16,
    paddingBottom: 20,
    gap: 12,
  },
  googleBtn: {
    borderRadius: 16,
    backgroundColor: "#DB4437",
    paddingVertical: 16,
    alignItems: "center",
    justifyContent: "center",
    elevation: 2,
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
  },
  googleRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  googleText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontFamily: Platform.select({
      ios: "Poppins-SemiBold",
      android: "Poppins_600SemiBold",
      default: "Poppins_600SemiBold",
    }),
  },
  secondaryWrap: { alignItems: "center" },
  secondaryText: {
    color: "#FFFFFF",
    opacity: 0.8,
    fontSize: 13,
    fontFamily: Platform.select({
      ios: "Poppins-Medium",
      android: "Poppins_500Medium",
      default: "Poppins_500Medium",
    }),
  },
});
