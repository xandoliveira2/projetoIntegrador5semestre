import FormButton from "@/components/FormButton";
import OptionsMenu from "@/components/OptionsMenu";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams } from "expo-router";
import React, { useState } from "react";
import {
  Image,
  Modal,
  Platform,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View
} from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

import { useRouter } from "expo-router";

export default function FormularioTela() {
  const [menuVisible, setMenuVisible] = useState(false);
  const [showSalvarModal, setShowSalvarModal] = useState(false);

  const router = useRouter();

  const [menuAberto, setMenuAberto] = useState(false);
  const [perguntas, setPerguntas] = useState<any[]>([]);
  const [selecionada, setSelecionada] = useState<number | null>(null);

  const { nome } = useLocalSearchParams();

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

  const moverPergunta = (index: number, direcao: "up" | "down") => {
    const novaLista = [...perguntas];
    const novoIndex =
      direcao === "up" ? Math.max(0, index - 1) : Math.min(perguntas.length - 1, index + 1);

    const temp = novaLista[index];
    novaLista[index] = novaLista[novoIndex];
    novaLista[novoIndex] = temp;

    setPerguntas(novaLista);
  };

  const atualizarPergunta = (id: number, novoTitulo: string) => {
    setPerguntas(perguntas.map(p => p.id === id ? { ...p, titulo: novoTitulo } : p));
  };

  const atualizarOpcao = (id: number, index: number, valor: string) => {
    setPerguntas(
      perguntas.map(p =>
        p.id === id
          ? { ...p, opcoes: p.opcoes.map((op: any, i: number) => (i === index ? valor : op)) }
          : p
      )
    );
  };

  const adicionarOpcao = (id: number) => {
    setPerguntas(
      perguntas.map(p =>
        p.id === id ? { ...p, opcoes: [...p.opcoes, ""] } : p
      )
    );
  };

  const removerOpcao = (id: number, index: number) => {
    setPerguntas(
      perguntas.map(p =>
        p.id === id
          ? { ...p, opcoes: p.opcoes.filter((_: any, i: number) => i !== index) }
          : p
      )
    );
  };

  // ❗ AQUI ESTAVA O ERRO — AGORA FECHADO CORRETAMENTE
  const removerPergunta = (id: number) => {
    setPerguntas(perguntas.filter(p => p.id !== id));
  }; //  ← Faltava este fechamento

  const renderPergunta = (pergunta: any, index: number) => {
    const estaSelecionada = selecionada === pergunta.id;

    return (
      <TouchableWithoutFeedback
        key={pergunta.id}
        onPress={() => setSelecionada(pergunta.id)}
      >
        <View
          style={{
            width: "90%",
            backgroundColor: estaSelecionada ? "#fff" : "transparent",
            borderRadius: 10,
            padding: estaSelecionada ? 12 : 0,
            marginBottom: 20,
            elevation: estaSelecionada ? 2 : 0,
          }}
        >
          {estaSelecionada ? (
            <>
              {/* Barra superior */}
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: 8,
                }}
              >
                <View style={{ flexDirection: "row", gap: 10 }}>
                  <TouchableOpacity onPress={() => moverPergunta(index, "up")} disabled={index === 0}>
                    <Ionicons name="chevron-up-circle-outline" size={24} color="#333" />
                  </TouchableOpacity>

                  <TouchableOpacity
                    onPress={() => moverPergunta(index, "down")}
                    disabled={index === perguntas.length - 1}
                  >
                    <Ionicons name="chevron-down-circle-outline" size={24} color="#333" />
                  </TouchableOpacity>
                </View>

                <TouchableOpacity onPress={() => removerPergunta(pergunta.id)}>
                  <Ionicons name="trash-outline" size={22} color="red" />
                </TouchableOpacity>
              </View>

              {/* Título */}
              <View style={{ flexDirection: "row" }}>
                <Text style={{ alignSelf: "center" }}>{index + 1} - </Text>

                <TextInput
                  placeholder="Pergunta"
                  value={pergunta.titulo}
                  onChangeText={t => atualizarPergunta(pergunta.id, t)}
                  style={{
                    flex: 1,
                    borderWidth: 1,
                    borderColor: "#ddd",
                    borderRadius: 6,
                    padding: 8,
                    marginBottom: 5,
                    marginTop: 5,
                  }}
                />
              </View>

              {/* Alternativas */}
              {pergunta.tipo === "alternativa" &&
                pergunta.opcoes.map((op: string, i: number) => (
                  <View key={i} style={{ flexDirection: "row", alignItems: "center" }}>
                    <Text>{`${String.fromCharCode(97 + i)}) `}</Text>

                    <TextInput
                      value={op}
                      onChangeText={t => atualizarOpcao(pergunta.id, i, t)}
                      style={{
                        flex: 1,
                        borderWidth: 1,
                        borderColor: "#ddd",
                        borderRadius: 6,
                        padding: 8,
                        marginVertical: 4,
                      }}
                    />

                    <TouchableOpacity onPress={() => removerOpcao(pergunta.id, i)} style={{ marginLeft: 8 }}>
                      <Ionicons name="close-circle" size={22} color="red" />
                    </TouchableOpacity>
                  </View>
                ))}

              {pergunta.tipo === "alternativa" && (
                <TouchableOpacity
                  onPress={() => adicionarOpcao(pergunta.id)}
                  style={{
                    backgroundColor: "#ff8c00",
                    paddingVertical: 8,
                    borderRadius: 8,
                    alignItems: "center",
                    marginTop: 5,
                  }}
                >
                  <Text style={{ color: "#fff", fontWeight: "bold" }}>+ Adicionar opção</Text>
                </TouchableOpacity>
              )}
            </>
          ) : (
            <>
              <Text style={{ fontWeight: "bold", fontSize: 16, marginBottom: 5 }}>
                {index + 1} - {pergunta.titulo || "Pergunta"}
              </Text>

              {pergunta.tipo === "alternativa" ? (
                pergunta.opcoes.map((op: string, i: number) => (
                  <Text key={i} style={{ marginLeft: 10 }}>
                    {String.fromCharCode(97 + i)}) {op || "Opção"}
                  </Text>
                ))
              ) : (
                <TextInput
                  placeholder="Resposta..."
                  editable={false}
                  style={{
                    borderBottomWidth: 1,
                    borderColor: "#ccc",
                    width: "90%",
                    marginLeft: 10,
                    marginTop: 4,
                  }}
                />
              )}
            </>
          )}
        </View>
      </TouchableWithoutFeedback>
    );
  };

  return (
    <TouchableWithoutFeedback onPress={() => setSelecionada(null)}>
      <View
        style={{
          flex: 1,
          backgroundColor: "#f0f6fc",
          alignItems: "center",
          paddingTop: 0,
        }}
      >

        <View
          style={{
            width:'100%',
            height: 60,
            backgroundColor: "#fff",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            paddingHorizontal: 15,
            marginBottom: 30,
          }}
        >
          <TouchableOpacity
            onPress={() => router.back()}
            style={{
              borderWidth: 1.5,
              borderColor: "#ccc",
              borderRadius: 50,
              width: 40,
              height: 40,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Image
              source={require("@/../assets/icons/seta_esquerda.png")}
              style={{ width: 20, height: 20 }}
            />
          </TouchableOpacity>

          <OptionsMenu
            visible={menuVisible}
            onOpen={() => setMenuVisible(true)}
            onClose={() => setMenuVisible(false)}
            icon={
              <TouchableOpacity
                style={{
                  borderWidth: 1.5,
                  borderColor: "#ccc",
                  borderRadius: 50,
                  width: 40,
                  height: 40,
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Image
                  source={require("@/../assets/icons/menu_tres_pontos.png")}
                  style={{ width: 20, height: 20 }}
                />
              </TouchableOpacity>
            }
            options={[
              {
                title: "💾 Salvar",
                onPress: () => {
                  setMenuVisible(false);
                  setShowSalvarModal(true);
                },
              },
            ]}
          />
        </View>


        <Modal transparent visible={showSalvarModal} animationType="fade">
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
                borderRadius: 12,
                padding: 20,
                width: "80%",
                alignItems: "center",
              }}
            >
              <Text style={{ fontSize: 18, fontWeight: "600", marginBottom: 20 }}>
                Tem certeza que deseja salvar{"\n"}e lançar esse formulário?
              </Text>

              <View
                style={{
                  flexDirection: "row",
                  width: "100%",
                  justifyContent: "space-between",
                }}
              >
                <TouchableOpacity
                  onPress={() => {
                    setShowSalvarModal(false);
                    alert("Formulário salvo!");
                  }}
                  style={{
                    backgroundColor: "#4CAF50",
                    paddingVertical: 10,
                    paddingHorizontal: 25,
                    borderRadius: 6,
                  }}
                >
                  <Text style={{ color: "#fff", fontWeight: "bold" }}>Confirmar</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => setShowSalvarModal(false)}
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

        {/* ////////////////////////////////////////////////////////////////////////////////////////////////////////////// */}

        <Text style={{ fontSize: 22, fontWeight: "bold", marginBottom: 30 }}>
          {nome ?? "- Nome não identificado -"}
        </Text>

        <KeyboardAwareScrollView
          style={{ width: "100%" }}
          contentContainerStyle={{
            alignItems: "center",
            paddingBottom: 120,
          }}
          enableOnAndroid
          extraScrollHeight={Platform.OS === "ios" ? 40 : 80}
          keyboardShouldPersistTaps="handled"
        >
          {perguntas.map((p, i) => renderPergunta(p, i))}

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
                  marginTop: 10,
                  marginBottom: 30,
                }}
                text="＋ Nova Pergunta"
                onPress={() => setMenuAberto(true)}
              />
            }
            options={[
              { title: "📝 Dissertativa", onPress: () => adicionarPergunta("dissertativa") },
              { title: "🔘 Alternativa", onPress: () => adicionarPergunta("alternativa") },
            ]}
          />
        </KeyboardAwareScrollView>
      </View>
    </TouchableWithoutFeedback>
  );
};