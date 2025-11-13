import React from "react";
import { Stack } from "expo-router";
import { TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

export default function Layout() {
  const router = useRouter();

  return (
    <Stack
      screenOptions={{
        headerTitle: "Responder Formulário",
        headerShadowVisible: false,
        headerStyle: { backgroundColor: "#fff" },
        headerTitleStyle: { fontWeight: "bold" },
        headerLeft: () => (
          <TouchableOpacity onPress={() => router.back()}>
            <Ionicons name="chevron-back" size={26} color="#000" />
          </TouchableOpacity>
        ),
      }}
    />
  );
}
