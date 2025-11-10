import React from "react";
import { Stack, useRouter } from "expo-router";
import { TouchableOpacity, View, Image } from "react-native";

export default function Layout() {
  const router = useRouter();

  return (
    <Stack
      screenOptions={{
        // força o uso do header local, escondendo o global
        headerShown: true,
        headerTitle: "",
        headerShadowVisible: false,
        headerStyle: { backgroundColor: "#fff" },
        headerLeft: () => (
          <TouchableOpacity
            onPress={() => router.back()}
            style={{
              marginLeft: 15,
              borderWidth: 1.5,
              borderColor: "#ccc",
              borderRadius: 50,
              width: 40,
              height: 40,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Image
              source={require("@/../assets/icons/seta_esquerda.png")}
              style={{ width: 20, height: 20 }}
              resizeMode="contain"
            />
          </TouchableOpacity>
        ),
        headerRight: () => (
          <TouchableOpacity
            onPress={() => console.log("Menu aberto")}
            style={{
              marginRight: 15,
              borderWidth: 1.5,
              borderColor: "#ccc",
              borderRadius: 50,
              width: 40,
              height: 40,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Image
              source={require("@/../assets/icons/menu_tres_pontos.png")}
              style={{ width: 20, height: 20 }}
              resizeMode="contain"
            />
          </TouchableOpacity>
        ),
      }}
    />
  );
}