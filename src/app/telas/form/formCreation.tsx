import React from "react";
import { Text, View, TouchableOpacity } from "react-native";

export default function FormularioTela() {
  return (
    <View
      style={{
        flex: 1,
        backgroundColor: "#f0f6fc",
        alignItems: "center",
        justifyContent: "flex-start",
        paddingTop: 80,
      }}
    >
      {/* Nome do formulário */}
      <Text
        style={{
          fontSize: 22,
          fontWeight: "bold",
          color: "#000",
          marginBottom: 40,
        }}
      >
        Nome do Formulário
      </Text>

      {/* Botão Nova Pergunta */}
      <TouchableOpacity
        onPress={() => console.log("Nova pergunta")}
        style={{
          backgroundColor: "#ff8c00",
          paddingVertical: 12,
          paddingHorizontal: 25,
          borderRadius: 8,
          flexDirection: "row",
          alignItems: "center",
        }}
      >
        <Text style={{ fontSize: 22, color: "#fff", fontWeight: "bold" }}>＋</Text>
        <Text
          style={{
            fontSize: 18,
            color: "#fff",
            fontWeight: "bold",
            marginLeft: 8,
          }}
        >
          Nova Pergunta
        </Text>
      </TouchableOpacity>
    </View>
  );
}
