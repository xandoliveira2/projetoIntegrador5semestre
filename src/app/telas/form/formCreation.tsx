import FormButton from "@/components/FormButton";
import OptionsMenu from "@/components/OptionsMenu";
import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect, useLocalSearchParams, useRouter } from "expo-router";
import {
  addDoc,
  collection,
  doc,
  getDocs,
  orderBy,
  query,
  serverTimestamp,
  where,
  writeBatch
} from "firebase/firestore";
import React, { useCallback, useEffect, useState } from "react";
import {
  Image,
  Modal,
  Pressable,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { db } from "../../../firebase/firebaseConfig";

export default function FormularioTela() {
  const router = useRouter();
  const { nome, id } = useLocalSearchParams();

  const [menuVisible, setMenuVisible] = useState(false);
  const [menuAberto, setMenuAberto] = useState(false);
  const [showSalvarModal, setShowSalvarModal] = useState(false);

  const [perguntas, setPerguntas] = useState<any[]>([]);
  const [selecionada, setSelecionada] = useState<number | null>(null);

  const isEdicao = !!id;

  useFocusEffect(
    useCallback(() => {
      return () => {
        setSelecionada(null);
        setMenuAberto(false);
        setMenuVisible(false);
        setShowSalvarModal(false);
      };
    }, [])
  );

  useEffect(() => {
    if (!id) return;

    const carregarPerguntas = async () => {
      const q = query(
        collection(db, "formularios_pergunta"),
        where("formulario_pai", "==", id),
        orderBy("ordem")
      );

      const snapshot = await getDocs(q);
      const lista: any[] = [];

      snapshot.forEach((doc) => {
        const data = doc.data();

        lista.push({
          firebaseId: doc.id,
          id: Date.now() + Math.random(),
          tipo: data.tipo_pergunta === "multipla" ? "alternativa" : "dissertativa",
          titulo: data.pergunta,
          opcoes: data.opcoes ? data.opcoes.split(";") : [],
        });
      });

      setPerguntas(lista);
    };

    carregarPerguntas();
  }, [id]);

  const adicionarPergunta = (tipo: string) => {
    const novaPergunta = {
      id: Date.now(),
      tipo,
      titulo: "",
      opcoes: tipo === "alternativa" ? ["", ""] : [],
    };

    setPerguntas([...perguntas, novaPergunta]);
    setSelecionada(novaPergunta.id);
    setMenuAberto(false);
  };

  const atualizarPergunta = (id: number, novoTitulo: string) => {
    setPerguntas((prev) =>
      prev.map((p) => (p.id === id ? { ...p, titulo: novoTitulo } : p))
    );
  };

  const atualizarOpcao = (id: number, index: number, valor: string) => {
    setPerguntas((prev) =>
      prev.map((p) =>
        p.id === id
          ? {
            ...p,
            opcoes: p.opcoes.map((op: any, i: number) =>
              i === index ? valor : op
            ),
          }
          : p
      )
    );
  };

  const adicionarOpcao = (id: number) => {
    setPerguntas((prev) =>
      prev.map((p) =>
        p.id === id ? { ...p, opcoes: [...p.opcoes, ""] } : p
      )
    );
  };

  const removerOpcao = (id: number, index: number) => {
    setPerguntas((prev) =>
      prev.map((p) =>
        p.id === id
          ? {
            ...p,
            opcoes: p.opcoes.filter((_: any, i: number) => i !== index),
          }
          : p
      )
    );
  };

  const removerPergunta = (id: number) => {
    setPerguntas(perguntas.filter((p) => p.id !== id));
    if (selecionada === id) setSelecionada(null);
  };

  const salvarFormulario = async () => {
    try {
      let formularioId = id as string;

      if (!isEdicao) {
        const docFormulario = await addDoc(collection(db, "formularios"), {
          nome: nome ?? "Sem nome",
          status: true,
          data_criacao: serverTimestamp(),
        });

        formularioId = docFormulario.id;
      }

      const antigas = query(
        collection(db, "formularios_pergunta"),
        where("formulario_pai", "==", formularioId)
      );

      const antigasSnapshot = await getDocs(antigas);
      const batchDelete = writeBatch(db);

      antigasSnapshot.forEach((docSnap) => {
        batchDelete.delete(doc(db, "formularios_pergunta", docSnap.id));
      });

      await batchDelete.commit();

      for (let i = 0; i < perguntas.length; i++) {
        const pergunta = perguntas[i];

        await addDoc(collection(db, "formularios_pergunta"), {
          formulario_pai: formularioId,
          pergunta: pergunta.titulo,
          tipo_pergunta:
            pergunta.tipo === "alternativa" ? "multipla" : "dissertativa",
          opcoes: pergunta.opcoes?.join(";") ?? "",
          ordem: i,
        });
      }

      alert(isEdicao ? "✅ Formulário atualizado!" : "✅ Formulário criado!");
      router.replace("/telas/admin/ativo");
    } catch (error) {
      console.error("Erro ao salvar:", error);
      alert("❌ Erro ao salvar formulário");
    }
  };

  // Render de cada pergunta
  const renderPergunta = (pergunta: any, index: number) => {
    const estaSelecionada = selecionada === pergunta.id;

    return (
      <Pressable
        key={pergunta.id}
        onPress={() => setSelecionada(pergunta.id)}
        style={{
          width: "90%",
          backgroundColor: estaSelecionada ? "#ffffff" : "#f8f8f8",
          borderRadius: 10,
          padding: estaSelecionada ? 12 : 10,
          marginBottom: 20,
          elevation: estaSelecionada ? 2 : 0,
        }}
      >
        {/* Título */}
        {estaSelecionada ? (
          <TextInput
            placeholder="Pergunta"
            value={pergunta.titulo}
            onChangeText={(t) => atualizarPergunta(pergunta.id, t)}
            style={{
              borderWidth: 1,
              borderColor: "#ddd",
              borderRadius: 6,
              padding: 8,
              marginVertical: 5,
              backgroundColor: "#fff",
            }}
          />
        ) : (
          <Text style={{ fontWeight: "bold", marginVertical: 5 }}>
            {index + 1} - {pergunta.titulo || "Pergunta"}
          </Text>
        )}

        {/* Opções */}
        {pergunta.tipo === "alternativa" &&
          pergunta.opcoes.map((op: string, i: number) => (
            <View
              key={i}
              style={{
                flexDirection: "row",
                alignItems: "center",
                marginVertical: 2,
              }}
            >
              <Text style={{ marginRight: 5 }}>{i + 1} - </Text>

              {estaSelecionada ? (
                <>
                  <TextInput
                    value={op}
                    onChangeText={(t) => atualizarOpcao(pergunta.id, i, t)}
                    style={{
                      flex: 1,
                      borderWidth: 1,
                      borderColor: "#ddd",
                      borderRadius: 6,
                      padding: 8,
                      backgroundColor: "#fff",
                    }}
                  />
                  <TouchableOpacity
                    onPress={() => removerOpcao(pergunta.id, i)}
                    style={{ marginLeft: 5 }}
                  >
                    <Image
                      source={require('./../../../../assets/icons/remove.png')}
                      style={{ width: 22, height: 22 }}
                    />
                  </TouchableOpacity>
                </>
              ) : (
                <Text style={{ flex: 1 }}>{op || "—"}</Text>
              )}
            </View>
          ))}

        {/* Adicionar opção */}
        {estaSelecionada && pergunta.tipo === "alternativa" && (
          <TouchableOpacity onPress={() => adicionarOpcao(pergunta.id)}>
            <Text style={{ color: "#ff8c00", marginTop: 5 }}>+ Adicionar opção</Text>
          </TouchableOpacity>
        )}

        {/* Botão remover pergunta */}
        {estaSelecionada && (
          <View style={{ flexDirection: "row", justifyContent: "flex-end", marginTop: 5 }}>
            <TouchableOpacity onPress={() => removerPergunta(pergunta.id)}>
              <Ionicons name="trash-outline" size={22} color="red" />
            </TouchableOpacity>
          </View>
        )}
      </Pressable>
    );
  };

  return (
    <Pressable onPress={() => setSelecionada(null)} style={{ flex: 1 }}>
      <View style={{ flex: 1, backgroundColor: "#f0f6fc" }}>
        {/* CABEÇALHO */}
        <View
          style={{
            paddingTop: 40,
            paddingBottom: 15,
            alignItems: "center",
            borderBottomWidth: 1,
            borderColor: "#ddd",
          }}
        >
          <Text style={{ fontSize: 22, fontWeight: "bold" }}>
            {nome ?? "Formulário"}
          </Text>
        </View>

        {/* CONTEÚDO COM SCROLL */}
        <KeyboardAwareScrollView
          enableOnAndroid
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={{
            alignItems: "center",
            paddingVertical: 20,
          }}
        >
          {perguntas.map((p, i) => renderPergunta(p, i))}

          <OptionsMenu
            visible={menuAberto}
            onOpen={() => setMenuAberto(true)}
            onClose={() => setMenuAberto(false)}
            icon={
              <FormButton
                text="＋ Nova Pergunta"
                onPress={() => setMenuAberto(true)}
                style={{ marginTop: 10 }}
              />
            }
            options={[
              {
                title: "📝 Dissertativa",
                onPress: () => adicionarPergunta("dissertativa"),
              },
              {
                title: "🔘 Alternativa",
                onPress: () => adicionarPergunta("alternativa"),
              },
            ]}
          />

          <FormButton
            text={isEdicao ? "Atualizar" : "Salvar"}
            onPress={() => setShowSalvarModal(true)}
            style={{
              marginTop: 25,
              marginBottom: 40,
              width: "90%",
            }}
          />
        </KeyboardAwareScrollView>

        {/* MODAL */}
        <Modal transparent visible={showSalvarModal} animationType="fade">
          <View
            style={{
              flex: 1,
              justifyContent: "center",
              alignItems: "center",
              backgroundColor: "rgba(0,0,0,0.5)",
            }}
          >
            <View
              style={{
                backgroundColor: "#fff",
                padding: 20,
                borderRadius: 12,
                width: "80%",
              }}
            >
              <Text style={{ fontSize: 18, marginBottom: 15 }}>
                Deseja salvar?
              </Text>

              <FormButton text="Confirmar" onPress={salvarFormulario} />
            </View>
          </View>
        </Modal>
      </View>
    </Pressable>
  );
}
