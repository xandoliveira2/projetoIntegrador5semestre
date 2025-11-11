import { Stack } from "expo-router";
import { StyleSheet, Text, View } from "react-native";

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
    backgroundColor: "white",
    height: 60,
    alignItems: "center",
    justifyContent: "center",
    //marginBottom:15,
    
    /*
    // iOS
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 4.65,

    // Android
    elevation: 8,
    */
  },
  title: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "bold",
  },
});
