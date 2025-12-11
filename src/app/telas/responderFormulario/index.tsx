import FontSizeButtons from "@/components/FontSizeButtons";
import { MaterialIcons } from "@expo/vector-icons";
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

import { useFontSize } from "@/components/FontSizeProvider";

export default function ResponderFormulario() {
  const { user } = useAuth();
  const { idFormulario } = useLocalSearchParams();
  const router = useRouter();

  const { fontSize, increase, decrease, setBounds } = useFontSize();

  const [loading, setLoading] = useState(true);
  const [perguntas, setPerguntas] = useState<any[]>([]);
  const [indice, setIndice] = useState(0);
  const [respostas, setRespostas] = useState<{ [key: string]: string }>({});
  const [modoRevisao, setModoRevisao] = useState(false);

  const limits = {
    pergunta: { min: 20, max: 40 },
    resposta: { min: 18, max: 40 },
    opcao: { min: 16, max: 40 },
    opcaoSel: { min: 18, max: 40 },
  };

  useEffect(() => {
    const providerMin = Math.max(
      limits.pergunta.min,
      limits.resposta.min,
      limits.opcao.min,
      limits.opcaoSel.min
    );
    const providerMax = Math.min(
      limits.pergunta.max,
      limits.resposta.max,
      limits.opcao.max,
      limits.opcaoSel.max
    );

    if (providerMin > providerMax) {
      setBounds(12, 32);
    } else {
      setBounds(providerMin, providerMax);
    }
  }, [
    limits.pergunta.min,
    limits.pergunta.max,
    limits.resposta.min,
    limits.resposta.max,
    limits.opcao.min,
    limits.opcao.max,
    limits.opcaoSel.min,
    limits.opcaoSel.max,
    setBounds,
  ]);

  const clamp = (size: number, min: number, max: number) =>
    Math.min(max, Math.max(min, size));

  const fontSizes = {
    pergunta: clamp(fontSize, limits.pergunta.min, limits.pergunta.max),
    resposta: clamp(fontSize, limits.resposta.min, limits.resposta.max),
    opcao: clamp(fontSize, limits.opcao.min, limits.opcao.max),
    opcaoSel: clamp(fontSize, limits.opcaoSel.min, limits.opcaoSel.max),
  };

  useEffect(() => {
    if (!idFormulario) return;

    const carregar = async () => {
      try {
        const q = query(
          collection(db, "formularios_pergunta"),
          where("formulario_pai", "==", idFormulario),
          orderBy("ordem", "asc")
        );

        const snap = await getDocs(q);

        const lista = snap.docs.map((doc) => {
          const p = doc.data();

          return {
            id: doc.id,
            titulo: p.pergunta,
            tipo: p.tipo_pergunta,
            opcoes: p.opcoes ? p.opcoes.split(";") : [],
          };
        });

        setPerguntas(lista);
      } catch (err) {
        console.log("Erro ao carregar: ", err);
      } finally {
        setLoading(false);
      }
    };

    carregar();
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
          <Text>Nenhuma pergunta encontrada.</Text>
        </View>
      </SafeAreaView>
    );
  }

  const perguntaAtual = perguntas[indice];

  const handleChange = (v: string) => {
    setRespostas((prev) => ({
      ...prev,
      [perguntaAtual.id]: v,
    }));
  };

  const proxima = () => {
    if (indice < perguntas.length - 1) setIndice((i) => i + 1);
  };

  const anterior = () => {
    if (indice > 0) setIndice((i) => i - 1);
  };

  const irRevisao = () => setModoRevisao(true);

  const voltarEdicao = () => {
    setModoRevisao(false);
    setIndice(0);
  };

  const enviar = async () => {
    try {
      const idUsuario = user?.username ?? "usuario_teste";

      const promises = Object.entries(respostas).map(
        ([idPergunta, valor]) =>
          addDoc(collection(db, "usuario_formularios_respondidos"), {
            id_formulario: String(idFormulario),
            id_pergunta: idPergunta,
            usuario: idUsuario,
            respostas: valor,
            data_resposta: serverTimestamp(),
          })
      );

      await Promise.all(promises);

      alert("Respostas enviadas!");
      router.replace("/telas/user/paraResponder");
    } catch (e) {
      console.log(e);
      alert("Erro ao enviar.");
    }
  };

  const isFirst = indice === 0;
  const isLast = indice === perguntas.length - 1;

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={{ marginLeft: "73%", marginBottom: "2%" }}>
        <FontSizeButtons onIncrease={increase} onDecrease={decrease} />
      </View>

      <LinearGradient colors={["#ffffffff", "#ffffffff"]} style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <Text style={styles.titulo}>
            {modoRevisao ? "Revisar Respostas" : "Respondendo Formulário"}
          </Text>

          {modoRevisao ? (
            perguntas.map((p, i) => (
              <View key={p.id} style={styles.revisaoCard}>
                <Text style={[styles.revisaoPergunta, { fontSize: fontSizes.pergunta }]}>
                  {i + 1}. {p.titulo}
                </Text>

                <Text style={[styles.revisaoResposta, { fontSize: fontSizes.resposta }]}>
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

        {/* ----------------------------
            BOTÕES FIXOS COM SETAS
        ----------------------------- */}
        <View style={styles.footerFixed}>

          {modoRevisao ? (
            <View style={styles.footerButtons}>
              <TouchableOpacity style={styles.botao} onPress={voltarEdicao}>
                <Text style={styles.textoBotao}>EDITAR</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.botaoFinalizar} onPress={enviar}>
                <Text style={styles.textoBotaoFinalizar}>CONFIRMAR ENVIO</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <View style={{ flex: 1 }}>
              {/* SETA ESQUERDA */}
              {!isFirst && (
                <TouchableOpacity style={styles.arrowLeft} onPress={anterior}>
                  <MaterialIcons name="arrow-back-ios" size={34} 
                  style={{marginLeft:10}}
                  />
                </TouchableOpacity>
              )}

              {/* SETA DIREITA */}
              {!isLast ? (
                <TouchableOpacity style={styles.arrowRight} onPress={proxima}>
                  <MaterialIcons name="arrow-forward-ios" size={34} />
                </TouchableOpacity>
              ) : (
                <TouchableOpacity style={styles.revisarButton} onPress={irRevisao}>
                  <Text style={styles.revisarText}>REVISAR</Text>
                </TouchableOpacity>
              )}
            </View>
          )}

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
  },

  revisaoResposta: {
    color: "#2b4c2b",
  },

  footerFixed: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 95,
    backgroundColor: "#f3f7f3ee",
    borderTopWidth: 1,
    borderColor: "#bfd5bf",
    justifyContent: "center",
  },

  /* --------------- SETAS ---------------- */
  arrowLeft: {
    position: "absolute",
    left: 15,
    bottom: 15,
    width: 70,
    height: 70,
    backgroundColor: "#fff",
    borderRadius: 100,
    borderWidth: 2,
    borderColor: "#aaa",
    alignItems: "center",
    justifyContent: "center",
  },

  arrowRight: {
    position: "absolute",
    right: 15,
    bottom: 15,
    width: 70,
    height: 70,
    backgroundColor: "#fff",
    borderRadius: 100,
    borderWidth: 2,
    borderColor: "#aaa",
    alignItems: "center",
    justifyContent: "center",
  },



  revisarButton: {
    position: "absolute",
    right: 15,
    bottom: 18,
    backgroundColor: "#007bff",
    paddingHorizontal: 22,
    paddingVertical: 12,
    borderRadius: 12,
  },

  revisarText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "700",
  },

  /* ----------- NÃO ALTERADO ----------- */
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
