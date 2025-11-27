import { useEffect, useState } from "react";
import {
  Alert,
  Modal,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import Date from "@/components/Date";
import EmptyListMessage from "@/components/EmptyListMessage";
import FormButton from "@/components/FormButton";
import Formulario from "@/components/Formulario";
import OptionsMenu from "@/components/OptionsMenu";
import { db } from "@/firebase/firebaseConfig";
import { styles } from "@/styles/IconButtonStyle";
import { collection, getDocs, query, where } from "firebase/firestore";

export default function Finalizado() {
  const [menuAbertoId, setMenuAbertoId] = useState<string>("");
  const [formularios, setFormularios] = useState<
    { id: string; texto: string; data: string }[]
  >([]);

  // Estados do modal de exportar
  const [modalVisivel, setModalVisivel] = useState(false);
  const [emailExport, setEmailExport] = useState("");
  const [formSelecionado, setFormSelecionado] = useState<string | null>(null);

  // 🔹 Buscar formulários finalizados no Firestore
  useEffect(() => {
    const fetchFormularios = async () => {
      try {
        const q = query(
          collection(db, "formularios"),
          where("status", "==", false)
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
        console.error("Erro ao carregar formulários finalizados:", error);
      }
    };

    fetchFormularios();
  }, []);

  // 🔹 Abrir modal
  const abrirModalExportar = (id: string) => {
    setFormSelecionado(id);
    setModalVisivel(true);
  };

  // 🔹 Confirmar exportação
  const confirmarExportacao = () => {
    if (!emailExport.includes("@")) {
      Alert.alert("Email inválido", "Digite um email válido.");
      return;
    }

    Alert.alert(
      "Exportação concluída!",
      `Formulário: ${formSelecionado}\nEnviado para: ${emailExport}`
    );

    // Fecha o modal
    setModalVisivel(false);
    setEmailExport("");
    setFormSelecionado(null);
  };

  return (
    <View style={{ flex: 1 }}>
      <ScrollView style={{ padding: 20 }}>
        {formularios.length === 0 ? (
          <EmptyListMessage mensagem="Nenhum formulário finalizado" />
        ) : (
          formularios.map((f) => (
            <View key={f.id} style={{ marginTop: 15 }}>
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
                      title: "📤 Exportar Dados",
                      onPress: () => abrirModalExportar(f.id),
                    },
                  ]}
                />
              </Formulario>
            </View>
          ))
        )}
      </ScrollView>

      {/* 🔹 MODAL DE EXPORTAR DADOS */}
      <Modal visible={modalVisivel} transparent animationType="fade">
        <View
          style={{
            flex: 1,
            backgroundColor: "rgba(0,0,0,0.5)",
            alignItems: "center",
            justifyContent: "center",
            padding: 20,
          }}
        >
          <View
            style={{
              backgroundColor: "white",
              padding: 20,
              width: "100%",
              borderRadius: 10,
            }}
          >
            <Text style={{ fontSize: 18, fontWeight: "bold", marginBottom: 15 }}>
              Exportar Dados
            </Text>

            <TextInput
              placeholder="Digite o email"
              style={{
                borderWidth: 1,
                borderColor: "#ccc",
                borderRadius: 8,
                padding: 10,
                marginBottom: 20,
              }}
              value={emailExport}
              onChangeText={setEmailExport}
            />

            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                marginTop: 10,
              }}
            >
              <TouchableOpacity
                onPress={() => setModalVisivel(false)}
                style={{
                  padding: 12,
                  backgroundColor: "#ccc",
                  borderRadius: 8,
                  width: "45%",
                  alignItems: "center",
                }}
              >
                <Text style={{ fontWeight: "bold" }}>Cancelar</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={confirmarExportacao}
                style={{
                  padding: 12,
                  backgroundColor: "#4CAF50",
                  borderRadius: 8,
                  width: "45%",
                  alignItems: "center",
                }}
              >
                <Text style={{ color: "white", fontWeight: "bold" }}>
                  Confirmar
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}
