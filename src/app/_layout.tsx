import { Stack } from 'expo-router';
import { View, Text, StyleSheet } from "react-native";

export default function RootLayout() {
  return (
    <Stack screenOptions={{headerShown: false,header: () => <Header />}}

    >
      <Stack.Screen name="index" />
      <Stack.Screen name="telas/admin/_layout" />
      <Stack.Screen name="telas/admin/formulario/_layout" />
      <Stack.Screen name="telas/admin/usuarios/_layout" />
      <Stack.Screen name="telas/user/_layout" />
    </Stack>
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
    backgroundColor: "white",
    height: 60,
    alignItems: "center",
    justifyContent: "center",
    marginBottom:15,
    
    // iOS
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 4.65,

    // Android
    elevation: 8,
  },
  title: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "bold",
  },
});
