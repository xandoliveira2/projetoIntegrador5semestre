import { AuthProvider } from "@/context/AuthContext";
import { Stack } from "expo-router";
import { StyleSheet, Text, View } from "react-native";

ErrorUtils.setGlobalHandler((error, isFatal) => {
  console.log('🔥 ERRO GLOBAL:', error);
});

export default function RootLayout() {
  return (
    <AuthProvider>
      <Stack screenOptions={{ headerShown: false, header: () => <Header /> }}>
        <Stack.Screen name="index" />

      </Stack>
    </AuthProvider>
  );
}

function Header() {
  return (
    <View style={styles.navbar}>
      <Text style={styles.title}></Text>
    </View>
  );
}

const styles = StyleSheet.create({
  navbar: {
    backgroundColor: "black",
    height: 60,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 4.65,
    elevation: 8,
  },
  title: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "bold",
  },
});
