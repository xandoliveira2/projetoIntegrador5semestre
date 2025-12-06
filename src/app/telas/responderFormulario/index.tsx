import { LinearGradient } from "expo-linear-gradient";
import { useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

import { addDoc, collection, getDocs, orderBy, query, serverTimestamp, where } from "firebase/firestore";

import { db } from "@/firebase/firebaseConfig";

import PerguntaAlternativa from "@/components/PerguntaAlternativa";
import PerguntaDissertativa from "@/components/PerguntaDissertativa";
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'expo-router';

export default function ResponderFormulario() {
  const { user } = useAuth();
  const { idFormulario } = useLocalSearchParams();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [perguntas, setPerguntas] = useState<any[]>([]);
  const [indice, setIndice] = useState(0);
  const [respostas, setRespostas] = useState<{ [key: string]: string }>({});

  // --------------------------------------------------
  // Buscar perguntas do Firestore
  // --------------------------------------------------
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
      <View style={{ padding: 25 }}>
        <Text>Carregando perguntas...</Text>
      </View>
    );
  }

  if (!perguntas.length) {
    return (
      <View style={{ padding: 25 }}>
        <Text>Nenhuma pergunta encontrada neste formulário.</Text>
      </View>
    );
  }

  const perguntaAtual = perguntas[indice];

  if (!perguntaAtual) {
    return (
      <View style={{ padding: 25 }}>
        <Text>Erro ao carregar pergunta atual.</Text>
      </View>
    );
  }

  // --------------------------------------------------
  // Handlers
  // --------------------------------------------------
  const handleChange = (valor: string) => {
    setRespostas({ ...respostas, [perguntaAtual.id]: valor });
  };

  const proximaPergunta = () => {
    if (indice < perguntas.length - 1) setIndice(indice + 1);
  };

  const perguntaAnterior = () => {
    if (indice > 0) setIndice(indice - 1);
  };

  const finalizar = async () => {
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
      router.push("/telas/user/paraResponder");

    } catch (error) {
      console.log("Erro ao salvar respostas:", error);
      alert("❌ Erro ao enviar respostas.");
    }
  };

  const isFirst = indice === 0;
  const isLast = indice === perguntas.length - 1;

  return (
    <View style={{ flex: 1 }}>
      <View>

      </View>

      <LinearGradient colors={["#f3f7f3", "#dbe7db"]} style={styles.container}>
        <Text style={styles.titulo}>Respondendo Formulário</Text>

        <View style={styles.perguntaContainer}>
          {perguntaAtual.tipo === "multipla" ? (
            <PerguntaAlternativa
              pergunta={perguntaAtual.titulo}
              opcoes={perguntaAtual.opcoes}
              resposta={respostas[perguntaAtual.id] || null}
              onSelect={handleChange}
            />
          ) : (
            <PerguntaDissertativa
              pergunta={perguntaAtual.titulo}
              resposta={respostas[perguntaAtual.id] || ""}
              onChange={handleChange}
            />
          )}
        </View>

        {/* FOOTER */}
        <View style={styles.footerRow}>

          {/* COLUNA ESQUERDA */}
          <View style={[styles.col, styles.colLeft]}>
            {!isFirst && (
              <TouchableOpacity
                style={[styles.botao, styles.botaoAnterior]}
                onPress={perguntaAnterior}
              >
                <Text style={styles.textoBotao}>ANTERIOR</Text>
              </TouchableOpacity>
            )}
          </View>

          {/* COLUNA DO MEIO — só aparece se NÃO for a última pergunta */}
          {!isLast && <View style={[styles.col, styles.colCenter]} />}

          {/* COLUNA DIREITA */}
          <View style={[styles.col, styles.colRight]}>
            {isLast ? (
              <TouchableOpacity
                style={[styles.botao, styles.botaoFinalizar]}
                onPress={finalizar}
              >
                <Text style={styles.textoBotaoFinalizar}>FINALIZAR</Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                style={[styles.botao, styles.botaoProximo]}
                onPress={proximaPergunta}
              >
                <Text style={styles.textoBotao}>PRÓXIMO</Text>
              </TouchableOpacity>
            )}
          </View>

        </View>

      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  titulo: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 50,
    textAlign: "center",
    color: "#2b4c2b",
  },
  perguntaContainer: {
    flex: 1,
    backgroundColor: "#ffffffaa",
    borderRadius: 5,
    padding: 15,
    elevation: 1,

  },

  footerRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 25,
    marginBottom: 40,
    height: 72,
  },

  col: { flex: 1, justifyContent: "center" },
  colLeft: { alignItems: "flex-start" },
  colCenter: { alignItems: "center" },
  colRight: { alignItems: "flex-end" },

  botao: {
    backgroundColor: "#4b7250",
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 22,
    minWidth: 150,
  },
  textoBotao: {
    fontWeight: "600",
    color: "#fff",
    textAlign: "center",
    fontSize: 20,
  },

  /* ALTERADO: BOTÃO FINALIZAR AGORA É AZUL */
  botaoFinalizar: {
    backgroundColor: "#007bff",
    paddingHorizontal: 10,
    minWidth: 150,
  },
  textoBotaoFinalizar: {
    fontWeight: "700",
    color: "#fff",
    textAlign: "center",
    fontSize: 20,

  },

  botaoAnterior: {
    backgroundColor: "#4b7250",
  },
  botaoProximo: {
    backgroundColor: "#4b7250",
  },
});
