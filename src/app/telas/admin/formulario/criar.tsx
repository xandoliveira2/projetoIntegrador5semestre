import React, { useState } from "react";
import { Alert, ScrollView, Text, View } from "react-native";

import Date from "@/components/Date";
import EmptyListMessage from "@/components/EmptyListMessage";
import FormButton from "@/components/FormButton";
import Formulario from "@/components/Formulario";
import ModalNovoFormulario from "@/components/ModalNovoFormulario";
import OptionsMenu from "@/components/OptionsMenu";
import { styles } from "@/styles/IconButtonStyle";

export default function Criar() {
  const [isModalVisible, setIsModalVisible] = useState(false);

  const handleOpenModal = () => setIsModalVisible(true);
  const handleCloseModal = () => setIsModalVisible(false);

  const handleContinue = () => {
    Alert.alert("Ação!", "Clicou em Continuar!");
    handleCloseModal();
  };

  // 🔹 Estado para controlar qual menu está aberto
  const [menuAbertoId, setMenuAbertoId] = useState<number | null>(null);

  const formularios = [
    { id: 1, texto: "Pesquisa de satisfação 2023", data: "12/06/2023" },
    { id: 2, texto: "Avaliação de serviço 2024", data: "15/10/2024" },
  ];

  return (
    <View style={{ flex: 1 }}>
      {/* Botão principal */}
      <FormButton
        onPress={handleOpenModal}
        text="Novo Formulário"
        style={{
          maxWidth: "60%",
          minWidth: "60%",
          alignSelf: "center",
          marginTop: 35,
          paddingVertical: 8,
        }}
        textSize={20}
      />

      <Text
        style={{
          alignSelf: "center",
          marginTop: 65,
          fontSize: 22,
          fontWeight: "bold",
        }}
      >
        Pendentes
      </Text>

      {/* Lista de formulários */}
      <ScrollView style={{ padding: 20 }}>
        {formularios.length === 0 ? (
          <EmptyListMessage mensagem="Nenhum formulário ativo" />
        ) : (
          formularios.map((f) => (
            <View key={f.id} style={[f.id !== 1 ? { marginTop: 15 } : undefined]}>
              <Date data={f.data} />

              <Formulario texto={f.texto}>
                <OptionsMenu
                  visible={menuAbertoId === f.id}
                  onOpen={() => setMenuAbertoId(f.id)}
                  onClose={() => setMenuAbertoId(null)}
                  icon={
                    <FormButton
                      style={styles.container}
                      icon={require("@/../assets/icons/engrenagem_branco.png")}
                      iconSize={29}
                      onPress={() => {}}
                    />
                  }
                  options={[
                    {
                      title: "✏️ Editar",
                      onPress: () => Alert.alert("Editar", f.texto),
                    },
                    {
                      title: "📅 Lançar",
                      onPress: () => Alert.alert("Lançar", f.data),
                    },
                    {
                      title: "🗑️ Excluir",
                      onPress: () => Alert.alert("Excluir", f.texto),
                    },
                  ]}
                />
              </Formulario>
            </View>
          ))
        )}
      </ScrollView>

      {/* Modal de novo formulário */}
      <ModalNovoFormulario
        isVisible={isModalVisible}
        onClose={handleCloseModal}
        onContinue={handleContinue}
      />
    </View>
  );
}