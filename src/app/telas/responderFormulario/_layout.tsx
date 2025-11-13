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
        headerStyle: {
          backgroundColor: "#fff",
          height: 60, // ⬅️ diminui a altura (padrão é ~90 em alguns dispositivos)
        },
        headerTitleStyle: {
          fontWeight: "bold",
          fontSize: 18, // opcional, pode ajustar o tamanho da fonte também
        },
        headerLeftContainerStyle: {
          paddingLeft: 10, // evita que o botão fique muito colado na borda
        },
        headerLeft: () => (
          <TouchableOpacity onPress={() => router.back()}>
            <Ionicons name="chevron-back" size={26} color="#000" />
          </TouchableOpacity>
        ),
      }}
    />
  );
}