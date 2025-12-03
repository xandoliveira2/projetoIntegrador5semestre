import { useRouter } from "expo-router"; // ✅ importação do hook de navegação
import React, { useEffect, useState } from "react";
import {
  Alert,
  Modal,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import Date from "@/components/Date";
import EmptyListMessage from "@/components/EmptyListMessage";
import FormButton from "@/components/FormButton";
import Formulario from "@/components/Formulario";
import ModalNovoFormulario, { FormData as FD } from "@/components/ModalNovoFormulario";
import OptionsMenu from "@/components/OptionsMenu";
import { db } from "@/firebase/firebaseConfig";
import { styles } from "@/styles/IconButtonStyle";
import { collection, getDocs, query, where } from "firebase/firestore";


export default function Criar() {
  const router = useRouter(); // ✅ instância do roteador

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [menuAbertoId, setMenuAbertoId] = useState<string>("");

  // 🔹 Controle do modal de confirmação de exclusão
  const [showExcluirModal, setShowExcluirModal] = useState(false);
  const [formularioSelecionado, setFormularioSelecionado] = useState<string | null>(null);

  // 🔹 Controle do modal de confirmação de encerramento (NOVO)
  const [showEncerrarModal, setShowEncerrarModal] = useState(false);
  const [formularioEncerrar, setFormularioEncerrar] = useState<string | null>(null);

  const handleOpenModal = () => setIsModalVisible(true);
  const handleCloseModal = () => setIsModalVisible(false);

  useEffect(() => {
    const fetchFormularios = async () => {
      try {
        const q = query(
          collection(db, "formularios"),
          where("status", "==", true) // 👈 FILTRO AQUI
        );

        const querySnapshot = await getDocs(q);

        const lista: { id: string; texto: string; data: string }[] = [];

        querySnapshot.forEach((doc) => {
          const data = doc.data();

          const dataCriacao = data.data_criacao?.toDate
            ? data.data_criacao.toDate().toLocaleDateString("pt-BR")
            : "Sem data";

          lista.push({
            id: doc.id,
            texto: data.nome || "Sem nome",
            data: dataCriacao,
          });
        });

        setFormularios(lista);
      } catch (error) {
        console.error("Erro ao carregar formulários:", error);
      }
    };

    fetchFormularios();
  }, []);

  // ✅ Navega para a tela do formulário ao continuar
  const handleContinue = (formData: FD) => {
    handleCloseModal();
    router.push({
      pathname: "/telas/form/formCreation",
      params: {
        nome: formData.nome,
      },
    });
  };

  const [formularios, setFormularios] = useState<
    { id: string; texto: string; data: string }[]
  >([]);

  const handleExcluir = (texto: string) => {
    setFormularioSelecionado(texto);
    setShowExcluirModal(true);
  };

  const confirmarExclusao = () => {
    setShowExcluirModal(false);
    Alert.alert("Excluído!", `O formulário "${formularioSelecionado}" foi excluído.`);
  };

  // 🔹 Função para abrir modal de ENCERRAR (NOVO)
  const handleEncerrar = (texto: string) => {
    setFormularioEncerrar(texto);
    setShowEncerrarModal(true);
  };

  // 🔹 Função para confirmar encerramento (NOVO)
  const confirmarEncerramento = () => {
    setShowEncerrarModal(false);
    Alert.alert("Encerrado!", `O formulário "${formularioEncerrar}" foi encerrado.`);
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
        Formulários
      </Text>

      {/* Lista de formulários */}
      <ScrollView style={{ padding: 20 }}>
        {formularios.length === 0 ? (
          <EmptyListMessage mensagem="Nenhum formulário ativo" />
        ) : (
          formularios.map((f) => (
            <View key={f.id}>
              <Date data={f.data} />

              <Formulario texto={f.texto}>
                <OptionsMenu
                  visible={menuAbertoId === f.id}
                  onOpen={() => setMenuAbertoId(f.id)}
                  onClose={() => setMenuAbertoId("")}
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
                      title: "   Encerrar",
                      onPress: () => handleEncerrar(f.texto), // 🔄 ALTERADO AQUI
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
        onContinue={handleContinue}
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

      {/* Modal de confirmação de ENCERRAR (NOVO - IDÊNTICO AO DE EXCLUIR) */}
      <Modal
        transparent
        visible={showEncerrarModal}
        animationType="fade"
        onRequestClose={() => setShowEncerrarModal(false)}
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
              Tem certeza que deseja encerrar{"\n"}esse formulário?
            </Text>

            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-around",
                width: "100%",
              }}
            >
              <TouchableOpacity
                onPress={confirmarEncerramento}
                style={{
                  backgroundColor: "#ff4d4d",
                  paddingVertical: 10,
                  paddingHorizontal: 25,
                  borderRadius: 6,
                }}
              >
                <Text style={{ color: "#fff", fontWeight: "bold" }}>Encerrar</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => setShowEncerrarModal(false)}
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
