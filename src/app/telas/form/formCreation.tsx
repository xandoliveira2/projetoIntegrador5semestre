import React, { useState } from "react";
import { Text, View, Alert } from "react-native";
import OptionsMenu from "@/components/OptionsMenu";
import FormButton from "@/components/FormButton";
import { styles } from "@/styles/IconButtonStyle";

export default function FormularioTela() {
  const [menuAberto, setMenuAberto] = useState(false);

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

      {/* Botão "Nova Pergunta" com OptionsMenu */}
      <OptionsMenu
        visible={menuAberto}
        onOpen={() => setMenuAberto(true)}
        onClose={() => setMenuAberto(false)}
        icon={
          <FormButton
            style={{
              backgroundColor: "#ff8c00",
              paddingVertical: 12,
              paddingHorizontal: 25,
              borderRadius: 8,
              flexDirection: "row",
              alignItems: "center",
            }}
            text="＋ Nova Pergunta"
            textStyle={{
              fontSize: 18,
              color: "#fff",
              fontWeight: "bold",
            }}
            onPress={() => setMenuAberto(true)}
          />
        }
        options={[
          {
            title: "📝 Dissertativa",
            onPress: () => Alert.alert("Nova Pergunta", "Tipo: Dissertativa"),
          },
          {
            title: "🔘 Alternativa",
            onPress: () => Alert.alert("Nova Pergunta", "Tipo: Alternativa"),
          },
        ]}
      />
    </View>
  );
}