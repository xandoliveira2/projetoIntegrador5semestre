import React, { useState } from "react";
import {
  Alert,
  Modal,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useRouter } from "expo-router"; // ✅ importação do hook de navegação

import Date from "@/components/Date";
import EmptyListMessage from "@/components/EmptyListMessage";
import FormButton from "@/components/FormButton";
import Formulario from "@/components/Formulario";
import ModalNovoFormulario from "@/components/ModalNovoFormulario";
import OptionsMenu from "@/components/OptionsMenu";
import { styles } from "@/styles/IconButtonStyle";

export default function Criar() {
  const router = useRouter(); // ✅ instância do roteador

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [menuAbertoId, setMenuAbertoId] = useState<number | null>(null);

  // 🔹 Controle do modal de confirmação de exclusão
  const [showExcluirModal, setShowExcluirModal] = useState(false);
  const [formularioSelecionado, setFormularioSelecionado] = useState<string | null>(null);

  const handleOpenModal = () => setIsModalVisible(true);
  const handleCloseModal = () => setIsModalVisible(false);

  // ✅ Navega para a tela do formulário ao continuar
  const handleContinue = () => {
    handleCloseModal();
    router.push("./../../form/formCreation"); // 🚀 vai para a tela do formulário
  };

  const formularios = [
    { id: 1, texto: "Pesquisa de satisfação 2023", data: "12/06/2023" },
    { id: 2, texto: "Avaliação de serviço 2024", data: "15/10/2024" },
  ];

  const handleExcluir = (texto: string) => {
    setFormularioSelecionado(texto);
    setShowExcluirModal(true);
  };

  const confirmarExclusao = () => {
    setShowExcluirModal(false);
    Alert.alert("Excluído!", `O formulário "${formularioSelecionado}" foi excluído.`);
  };

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
                      onPress: () => handleExcluir(f.texto),
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
        onContinue={handleContinue} // ✅ navegação adicionada
      />

      {/* Modal de confirmação de exclusão */}
      <Modal
        transparent
        visible={showExcluirModal}
        animationType="fade"
        onRequestClose={() => setShowExcluirModal(false)}
      >
        <View
          style={{
            flex: 1,
            backgroundColor: "rgba(0,0,0,0.5)",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <View
            style={{
              backgroundColor: "#fff",
              borderRadius: 10,
              padding: 20,
              width: "80%",
              alignItems: "center",
              elevation: 5,
            }}
          >
            <Text
              style={{
                fontSize: 17,
                fontWeight: "600",
                textAlign: "center",
                marginBottom: 20,
              }}
            >
              Tem certeza que deseja excluir{"\n"}esse formulário?
            </Text>

            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-around",
                width: "100%",
              }}
            >
              <TouchableOpacity
                onPress={confirmarExclusao}
                style={{
                  backgroundColor: "#ff4d4d",
                  paddingVertical: 10,
                  paddingHorizontal: 25,
                  borderRadius: 6,
                }}
              >
                <Text style={{ color: "#fff", fontWeight: "bold" }}>Excluir</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => setShowExcluirModal(false)}
                style={{
                  backgroundColor: "#ccc",
                  paddingVertical: 10,
                  paddingHorizontal: 25,
                  borderRadius: 6,
                }}
              >
                <Text style={{ color: "#333", fontWeight: "bold" }}>Cancelar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}