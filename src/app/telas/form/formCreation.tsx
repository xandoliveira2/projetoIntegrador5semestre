import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  TouchableWithoutFeedback,
  Platform,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import OptionsMenu from "@/components/OptionsMenu";
import FormButton from "@/components/FormButton";

export default function FormularioTela() {
  const [menuAberto, setMenuAberto] = useState(false);
  const [perguntas, setPerguntas] = useState<any[]>([]);
  const [selecionada, setSelecionada] = useState<number | null>(null);

  // 👉 Adiciona pergunta nova
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

  // 👉 Move pergunta pra cima ou pra baixo
  const moverPergunta = (index: number, direcao: "up" | "down") => {
    const novaLista = [...perguntas];
    const novoIndex =
      direcao === "up"
        ? Math.max(0, index - 1)
        : Math.min(perguntas.length - 1, index + 1);
    const temp = novaLista[index];
    novaLista[index] = novaLista[novoIndex];
    novaLista[novoIndex] = temp;
    setPerguntas(novaLista);
  };

  // 👉 Atualiza texto da pergunta
  const atualizarPergunta = (id: number, novoTitulo: string) => {
    setPerguntas(
      perguntas.map((p) =>
        p.id === id ? { ...p, titulo: novoTitulo } : p
      )
    );
  };

  // 👉 Atualiza texto de uma opção
  const atualizarOpcao = (id: number, index: number, valor: string) => {
    setPerguntas(
      perguntas.map((p) =>
        p.id === id
          ? {
              ...p,
              opcoes: p.opcoes.map((op, i) => (i === index ? valor : op)),
            }
          : p
      )
    );
  };

  // 👉 Adiciona nova opção em pergunta alternativa
  const adicionarOpcao = (id: number) => {
    setPerguntas(
      perguntas.map((p) =>
        p.id === id ? { ...p, opcoes: [...p.opcoes, ""] } : p
      )
    );
  };

  // 👉 Remove uma pergunta
  const removerPergunta = (id: number) => {
    setPerguntas(perguntas.filter((p) => p.id !== id));
  };

  // 👉 Renderiza cada pergunta
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
              {/* Barra superior com setas e lixeira */}
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: 8,
                }}
              >
                <View style={{ flexDirection: "row", gap: 10 }}>
                  <TouchableOpacity
                    onPress={() => moverPergunta(index, "up")}
                    disabled={index === 0}
                  >
                    <Ionicons
                      name="chevron-up-circle-outline"
                      size={24}
                      color="#333"
                    />
                  </TouchableOpacity>

                  <TouchableOpacity
                    onPress={() => moverPergunta(index, "down")}
                    disabled={index === perguntas.length - 1}
                  >
                    <Ionicons
                      name="chevron-down-circle-outline"
                      size={24}
                      color="#333"
                    />
                  </TouchableOpacity>
                </View>

                <TouchableOpacity onPress={() => removerPergunta(pergunta.id)}>
                  <Ionicons name="trash-outline" size={22} color="red" />
                </TouchableOpacity>
              </View>

              {/* Campo de título */}
              <TextInput
                placeholder={`${index + 1} - Pergunta`}
                value={pergunta.titulo}
                onChangeText={(t) => atualizarPergunta(pergunta.id, t)}
                style={{
                  borderWidth: 1,
                  borderColor: "#ddd",
                  borderRadius: 6,
                  padding: 8,
                  marginBottom: 10,
                }}
              />

              {/* Alternativas */}
              {pergunta.tipo === "alternativa" &&
                pergunta.opcoes.map((op: string, i: number) => (
                  <TextInput
                    key={i}
                    placeholder={`${String.fromCharCode(97 + i)})`}
                    value={op}
                    onChangeText={(t) => atualizarOpcao(pergunta.id, i, t)}
                    style={{
                      borderWidth: 1,
                      borderColor: "#ddd",
                      borderRadius: 6,
                      padding: 8,
                      marginBottom: 8,
                    }}
                  />
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
                  <Text
                    style={{ color: "#fff", fontWeight: "bold", fontSize: 14 }}
                  >
                    + Adicionar opção
                  </Text>
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
                  <Text key={i} style={{ marginLeft: 10, marginBottom: 2 }}>
                    {String.fromCharCode(97 + i)}) {op || "Opção"}
                  </Text>
                ))
              ) : (
                <TextInput
                  placeholder="Resposta..."
                  style={{
                    borderBottomWidth: 1,
                    borderColor: "#ccc",
                    width: "90%",
                    marginLeft: 10,
                    marginTop: 4,
                  }}
                  editable={false}
                />
              )}
            </>
          )}
        </View>
      </TouchableWithoutFeedback>
    );
  };

  // 👉 Retorno da tela
  return (
    <TouchableWithoutFeedback onPress={() => setSelecionada(null)}>
      <View
        style={{
          flex: 1,
          backgroundColor: "#f0f6fc",
          alignItems: "center",
          paddingTop: 80,
        }}
      >
        <Text
          style={{
            fontSize: 22,
            fontWeight: "bold",
            color: "#000",
            marginBottom: 30,
          }}
        >
          Nome do Formulário
        </Text>

        {/* Scroll que evita o teclado automaticamente */}
        <KeyboardAwareScrollView
          style={{ width: "100%" }}
          contentContainerStyle={{
            alignItems: "center",
            paddingBottom: 120,
          }}
          enableOnAndroid={true}
          extraScrollHeight={Platform.OS === "ios" ? 40 : 80}
          keyboardShouldPersistTaps="handled"
        >
          {perguntas.map((p, i) => renderPergunta(p, i))}

          {/* Botão "Nova Pergunta" */}
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
                onPress: () => adicionarPergunta("dissertativa"),
              },
              {
                title: "🔘 Alternativa",
                onPress: () => adicionarPergunta("alternativa"),
              },
            ]}
          />
        </KeyboardAwareScrollView>
      </View>
    </TouchableWithoutFeedback>
  );
}