import { useRouter } from "expo-router";
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

import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  query,
  updateDoc,
  where,
} from "firebase/firestore";

export default function Criar() {
  const router = useRouter();

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [menuAbertoId, setMenuAbertoId] = useState<string>("");

  const [showExcluirModal, setShowExcluirModal] = useState(false);
  const [formularioSelecionado, setFormularioSelecionado] = useState<{ id: string; texto: string } | null>(null);

  const [showEncerrarModal, setShowEncerrarModal] = useState(false);
  const [formularioEncerrar, setFormularioEncerrar] = useState<{ id: string; texto: string } | null>(null);

  const handleOpenModal = () => setIsModalVisible(true);
  const handleCloseModal = () => setIsModalVisible(false);

  const [formularios, setFormularios] = useState<
    { id: string; texto: string; data: string }[]
  >([]);

  useEffect(() => {
    const fetchFormularios = async () => {
      try {
        const q = query(
          collection(db, "formularios"),
          where("status", "==", true)
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

  // ✅ CONTINUAR (CRIAR)
  const handleContinue = (formData: FD) => {
    handleCloseModal();
    router.push({
      pathname: "/telas/form/formCreation",
      params: {
        nome: formData.nome,
      },
    });
  };

  // ✅ EDITAR FORMULÁRIO (NOVO)
  const handleEditar = (id: string, texto: string) => {
    setMenuAbertoId("");
    router.push({
      pathname: "/telas/form/formCreation",
      params: {
        id,
        nome: texto,
      },
    });
  };

  const handleExcluir = (id: string, texto: string) => {
    setMenuAbertoId("");
    setFormularioSelecionado({ id, texto });
    setShowExcluirModal(true);
  };

  const confirmarExclusao = async () => {
    try {
      if (!formularioSelecionado) return;

      await deleteDoc(doc(db, "formularios", formularioSelecionado.id));

      setFormularios((prev) =>
        prev.filter((f) => f.id !== formularioSelecionado.id)
      );

      setShowExcluirModal(false);
      setFormularioSelecionado(null);

      Alert.alert("✅ Excluído!", "O formulário foi excluído com sucesso.");
    } catch (error) {
      console.error("Erro ao excluir:", error);
      Alert.alert("❌ Erro", "Erro ao excluir formulário.");
    }
  };

  const handleEncerrar = (id: string, texto: string) => {
    setMenuAbertoId("");
    setFormularioEncerrar({ id, texto });
    setShowEncerrarModal(true);
  };

  const confirmarEncerramento = async () => {
    try {
      if (!formularioEncerrar) return;

      await updateDoc(doc(db, "formularios", formularioEncerrar.id), {
        status: false,
      });

      setFormularios((prev) =>
        prev.filter((f) => f.id !== formularioEncerrar.id)
      );

      setShowEncerrarModal(false);
      setFormularioEncerrar(null);

      Alert.alert("✅ Encerrado!", "Formulário encerrado com sucesso.");
    } catch (error) {
      console.error("Erro ao encerrar:", error);
      Alert.alert("❌ Erro", "Erro ao encerrar formulário.");
    }
  };

  return (
    <View style={{ flex: 1 }}>
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

      <ScrollView
        style={{ padding: 20 }}
        contentContainerStyle={{ paddingBottom: 100 }}
      >
        {formularios.length === 0 ? (
          <EmptyListMessage mensagem="Nenhum formulário ativo" />
        ) : (
          formularios.map((f) => (
            <View key={f.id}>
              <Date data={f.data} />

              <Formulario texto={f.texto}>
                <OptionsMenu
                  visible={menuAbertoId === f.id && !!f.id}
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
                      title: "✏️ Editar", // ✅ NOVO BOTÃO
                      onPress: () => handleEditar(f.id, f.texto),
                    },
                    {
                      title: "✅ Encerrar",
                      onPress: () => handleEncerrar(f.id, f.texto),
                    },
                    {
                      title: "🗑️ Excluir",
                      onPress: () => handleExcluir(f.id, f.texto),
                    },
                  ]}
                />
              </Formulario>
            </View>
          ))
        )}
      </ScrollView>

      <ModalNovoFormulario
        isVisible={isModalVisible}
        onClose={handleCloseModal}
        onContinue={handleContinue}
      />

      {/* ✅ MODAL EXCLUIR */}
      <Modal transparent visible={showExcluirModal} animationType="fade">
        <View style={{ flex: 1, backgroundColor: "rgba(0,0,0,0.5)", justifyContent: "center", alignItems: "center" }}>
          <View style={{ backgroundColor: "#fff", borderRadius: 10, padding: 20, width: "80%", alignItems: "center" }}>
            <Text style={{ fontSize: 17, fontWeight: "600", textAlign: "center", marginBottom: 20 }}>
              Tem certeza que deseja excluir esse formulário?
            </Text>

            <View style={{ flexDirection: "row" }}>
              <TouchableOpacity onPress={confirmarExclusao} style={{ backgroundColor: "#ff4d4d", padding: 10, borderRadius: 6 }}>
                <Text style={{ color: "#fff" }}>Excluir</Text>
              </TouchableOpacity>

              <TouchableOpacity onPress={() => setShowExcluirModal(false)} style={{ marginLeft: 15, backgroundColor: "#ccc", padding: 10, borderRadius: 6 }}>
                <Text>Cancelar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* ✅ MODAL ENCERRAR */}
      <Modal transparent visible={showEncerrarModal} animationType="fade">
        <View style={{ flex: 1, backgroundColor: "rgba(0,0,0,0.5)", justifyContent: "center", alignItems: "center" }}>
          <View style={{ backgroundColor: "#fff", borderRadius: 10, padding: 20, width: "80%", alignItems: "center" }}>
            <Text style={{ fontSize: 17, fontWeight: "600", textAlign: "center", marginBottom: 20 }}>
              Tem certeza que deseja encerrar esse formulário?
            </Text>

            <View style={{ flexDirection: "row" }}>
              <TouchableOpacity onPress={confirmarEncerramento} style={{ backgroundColor: "#ff4d4d", padding: 10, borderRadius: 6 }}>
                <Text style={{ color: "#fff" }}>Encerrar</Text>
              </TouchableOpacity>

              <TouchableOpacity onPress={() => setShowEncerrarModal(false)} style={{ marginLeft: 15, backgroundColor: "#ccc", padding: 10, borderRadius: 6 }}>
                <Text>Cancelar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}
