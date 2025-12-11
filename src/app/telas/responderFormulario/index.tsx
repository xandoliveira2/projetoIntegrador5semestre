import FontSizeButtons from "@/components/FontSizeButtons";
import { LinearGradient } from "expo-linear-gradient";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import {
  addDoc,
  collection,
  getDocs,
  orderBy,
  query,
  serverTimestamp,
  where,
} from "firebase/firestore";

import { db } from "@/firebase/firebaseConfig";

import PerguntaAlternativa from "@/components/PerguntaAlternativa";
import PerguntaDissertativa from "@/components/PerguntaDissertativa";
import { useAuth } from "@/context/AuthContext";

// ⬅️ IMPORTANTE: agora pegamos increase e decrease também
import { useFontSize } from "@/components/FontSizeProvider";

export default function ResponderFormulario() {
  const { user } = useAuth();
  const { idFormulario } = useLocalSearchParams();
  const router = useRouter();

  // ⬅️ PEGAR TUDO DO CONTEXTO
  const { fontSize, increase, decrease } = useFontSize();

  const [loading, setLoading] = useState(true);
  const [perguntas, setPerguntas] = useState<any[]>([]);
  const [indice, setIndice] = useState(0);
  const [respostas, setRespostas] = useState<{ [key: string]: string }>({});
  const [modoRevisao, setModoRevisao] = useState(false);

  // ---------------------------------------------------------
  // LIMITES PERSONALIZADOS DESSA TELA
  // ---------------------------------------------------------
  const limits = {
    pergunta: { min: 20, max: 34 },
    resposta: { min: 18, max: 30 },
    opcao: { min: 16, max: 26 },
    opcaoSel: { min: 18, max: 32 },
  };

  const clamp = (size: number, min: number, max: number) =>
    Math.min(max, Math.max(min, size));

  const fontSizes = {
    pergunta: clamp(fontSize, limits.pergunta.min, limits.pergunta.max),
    resposta: clamp(fontSize, limits.resposta.min, limits.resposta.max),
    opcao: clamp(fontSize, limits.opcao.min, limits.opcao.max),
    opcaoSel: clamp(fontSize, limits.opcaoSel.min, limits.opcaoSel.max),
  };

  // ---------------------------------------------------------
  // BUSCAR PERGUNTAS
  // ---------------------------------------------------------
  useEffect(() => {
    if (!idFormulario) return;

    const carregarPerguntas = async () => {
      try {
        const q = query(
          collection(db, "formularios_pergunta"),
          where("formulario_pai", "==", idFormulario),
          orderBy("ordem", "asc")
        );

        const snap = await getDocs(q);

        const lista: any[] = snap.docs.map((doc) => {
          const p = doc.data();

          return {
            id: doc.id,
            titulo: p.pergunta,
            tipo: p.tipo_pergunta,
            opcoes: p.opcoes ? p.opcoes.split(";") : [],
          };
        });

        setPerguntas(lista);
      } catch (error) {
        console.log("Erro ao carregar perguntas:", error);
      } finally {
        setLoading(false);
      }
    };

    carregarPerguntas();
  }, [idFormulario]);

  if (loading) {
    return (
      <SafeAreaView style={{ flex: 1 }}>
        <View style={{ padding: 25 }}>
          <Text>Carregando perguntas...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!perguntas.length) {
    return (
      <SafeAreaView style={{ flex: 1 }}>
        <View style={{ padding: 25 }}>
          <Text>Nenhuma pergunta encontrada neste formulário.</Text>
        </View>
      </SafeAreaView>
    );
  }

  const perguntaAtual = perguntas[indice];

  // ATUALIZA RESPOSTA
  const handleChange = (valor: string) => {
    setRespostas((prev) => ({
      ...prev,
      [perguntaAtual.id]: valor,
    }));
  };

  const proximaPergunta = () => {
    if (indice < perguntas.length - 1) setIndice((prev) => prev + 1);
  };

  const perguntaAnterior = () => {
    if (indice > 0) setIndice((prev) => prev - 1);
  };

  const irParaRevisao = () => {
    setModoRevisao(true);
  };

  const confirmarEnvio = async () => {
    try {
      const idUsuario = user?.username ?? "usuario_teste";

      const promises = Object.entries(respostas).map(
        async ([idPergunta, valorResposta]) => {
          return addDoc(collection(db, "usuario_formularios_respondidos"), {
            id_formulario: String(idFormulario),
            id_pergunta: idPergunta,
            usuario: idUsuario,
            respostas: valorResposta,
            data_resposta: serverTimestamp(),
          });
        }
      );

      await Promise.all(promises);

      alert("✅ Respostas enviadas com sucesso!");
      router.replace("/telas/user/paraResponder");
    } catch (error) {
      console.log("Erro ao salvar respostas:", error);
      alert("❌ Erro ao enviar respostas.");
    }
  };

  const voltarEdicao = () => {
    setModoRevisao(false);
    setIndice(0);
  };

  const isFirst = indice === 0;
  const isLast = indice === perguntas.length - 1;

  return (
    <SafeAreaView style={{ flex: 1 }}>

      {/* ⬅️ AQUI AJUSTADO PARA PASSAR increase/decrease */}
      <View style={{ marginLeft: "73%", marginBottom: "2%" }}>
        <FontSizeButtons  />
      </View>

      <LinearGradient colors={["#ffffffff", "#ffffffff"]} style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <Text style={styles.titulo}>
            {modoRevisao ? "Revisar Respostas" : "Respondendo Formulário"}
          </Text>

          {modoRevisao ? (
            perguntas.map((p, i) => (
              <View key={p.id} style={styles.revisaoCard}>
                <Text style={styles.revisaoPergunta}>{i + 1}. {p.titulo}</Text>
                <Text style={styles.revisaoResposta}>
                  {respostas[p.id] || "❌ Não respondido"}
                </Text>
              </View>
            ))
          ) : (
            <View style={styles.perguntaContainer}>
              {perguntaAtual.tipo === "multipla" ? (
                <PerguntaAlternativa
                  pergunta={perguntaAtual.titulo}
                  opcoes={perguntaAtual.opcoes}
                  resposta={respostas[perguntaAtual.id] || ""}
                  onSelect={handleChange}

                  fontSizePergunta={fontSizes.pergunta}
                  fontSizeOpcao={fontSizes.opcao}
                  fontSizeOpcaoSelecionada={fontSizes.opcaoSel}
                />
              ) : (
                <PerguntaDissertativa
                  pergunta={perguntaAtual.titulo}
                  resposta={respostas[perguntaAtual.id] || ""}
                  onChange={handleChange}

                  fontSizePergunta={fontSizes.pergunta}
                  fontSizeResposta={fontSizes.resposta}
                />
              )}
            </View>
          )}
        </ScrollView>

        <View style={styles.footerFixed}>
          <View style={styles.footerButtons}>
            {modoRevisao ? (
              <>
                <TouchableOpacity style={styles.botao} onPress={voltarEdicao}>
                  <Text style={styles.textoBotao}>EDITAR</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.botaoFinalizar} onPress={confirmarEnvio}>
                  <Text style={styles.textoBotaoFinalizar}>CONFIRMAR ENVIO</Text>
                </TouchableOpacity>
              </>
            ) : (
              <>
                {!isFirst && (
                  <TouchableOpacity style={styles.botao} onPress={perguntaAnterior}>
                    <Text style={styles.textoBotao}>ANTERIOR</Text>
                  </TouchableOpacity>
                )}

                {isLast ? (
                  <TouchableOpacity style={styles.botaoFinalizar} onPress={irParaRevisao}>
                    <Text style={styles.textoBotaoFinalizar}>REVISAR</Text>
                  </TouchableOpacity>
                ) : (
                  <TouchableOpacity style={styles.botao} onPress={proximaPergunta}>
                    <Text style={styles.textoBotao}>PRÓXIMO</Text>
                  </TouchableOpacity>
                )}
              </>
            )}
          </View>
        </View>
      </LinearGradient>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  scrollContainer: { padding: 20, paddingBottom: 160 },

  titulo: {
    fontSize: 25,
    fontWeight: "bold",
    marginBottom: 30,
    textAlign: "center",
    color: "#2b4c2b",
  },

  perguntaContainer: {
    backgroundColor: "#ffffffaa",
    borderRadius: 8,
    padding: 15,
  },

  revisaoCard: {
    backgroundColor: "#fff",
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
  },

  revisaoPergunta: {
    fontWeight: "700",
    marginBottom: 6,
    fontSize: 25
  },

  revisaoResposta: {
    color: "#2b4c2b",
    fontSize: 20
  },

  footerFixed: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    padding: 15,
    backgroundColor: "#f3f7f3ee",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    borderTopWidth: 1,
    borderColor: "#bfd5bf",
  },

  footerButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    gap: 12,
  },

  botao: {
    backgroundColor: "#4b7250",
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 22,
    minWidth: 140,
  },

  botaoFinalizar: {
    backgroundColor: "#007bff",
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 22,
    minWidth: 160,
  },

  textoBotao: {
    color: "#fff",
    fontSize: 18,
    textAlign: "center",
  },

  textoBotaoFinalizar: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "700",
    textAlign: "center",
  },
});
