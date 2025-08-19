// import React from "react";
// import { View, Text, StyleSheet } from "react-native";

// export default function ConversationScreen() {
//   return (
//     <View style={styles.container}>
//       <Text style={styles.text}>AI Conversation Screen Coming Soon...</Text>
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     justifyContent: "center",
//     alignItems: "center",
//     backgroundColor: "#0B284A",
//   },
//   text: {
//     color: "#fff",
//     fontSize: 18,
//   },
// });
import React, { useEffect } from "react";
import { View, Text, StyleSheet } from "react-native";

export default function ConversationScreen({ route }) {
  useEffect(() => {
    console.log("ConversationScreen props:", route?.params);
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.text}>AI Conversation Screen Placeholder</Text>
    </View>
  );
}
