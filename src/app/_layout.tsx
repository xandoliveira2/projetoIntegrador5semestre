import { Stack } from "expo-router";
import { View, Text, StyleSheet } from "react-native";

export default function Layout() {
  return (
    <Stack
      screenOptions={{
        header: () => <CustomNavbar />, // Navbar personalizada
      }}
    />
  );
}

function CustomNavbar() {
  return (
    <View style={styles.navbar}>
      <Text style={styles.title}></Text>
    </View>
  );
}

const styles = StyleSheet.create({
  navbar: {
    backgroundColor: "#007bff",
    height: 60,
    alignItems: "center",
    justifyContent: "center",
    marginBottom:15,
  },
  title: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "bold",
  },
});
