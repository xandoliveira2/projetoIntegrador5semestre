import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import PerguntaAlternativa from "@/components/PerguntaAlternativa";
import PerguntaDissertativa from "@/components/PerguntaDissertativa";

export default function ResponderFormulario() {
  const perguntas = [
    {
      id: 1,
      tipo: "alternativa",
      titulo: "1 - Pergunta",
      opcoes: ["a) Opção", "b) Opção", "c) Opção", "d) Opção"],
    },
    {
      id: 2,
      tipo: "dissertativa",
      titulo: "2 - Pergunta",
    },
    {
      id: 3,
      tipo: "alternativa",
      titulo: "3 - Pergunta",
      opcoes: ["a) Opção", "b) Opção", "c) Opção", "d) Opção"],
    },
  ];

  const [indice, setIndice] = useState(0);
  const [respostas, setRespostas] = useState<{ [key: number]: string }>({});

  const perguntaAtual = perguntas[indice];

  const handleChange = (valor: string) => {
    setRespostas({ ...respostas, [perguntaAtual.id]: valor });
  };

  const proximaPergunta = () => {
    if (indice < perguntas.length - 1) setIndice(indice + 1);
  };

  const perguntaAnterior = () => {
    if (indice > 0) setIndice(indice - 1);
  };

  const finalizar = () => {
    console.log("Respostas:", respostas);
    alert("Formulário finalizado!");
  };

  const isFirst = indice === 0;
  const isLast = indice === perguntas.length - 1;

  return (
    <LinearGradient colors={["#f3f7f3", "#dbe7db"]} style={styles.container}>
      <Text style={styles.titulo}>Nome do Formulário</Text>

      <View style={styles.perguntaContainer}>
        {perguntaAtual.tipo === "alternativa" ? (
          <PerguntaAlternativa
            pergunta={perguntaAtual.titulo}
            opcoes={perguntaAtual.opcoes || []}
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

      {/* FOOTER EM 3 COLUNAS */}
      <View style={styles.footerRow}>
        {/* esquerda */}
        <View style={[styles.col, styles.colLeft]}>
          {!isFirst && (
            <TouchableOpacity
              style={[styles.botao, styles.botaoAnterior]}
              onPress={perguntaAnterior}
              activeOpacity={0.8}
            >
              <Text style={styles.textoBotao} numberOfLines={1}>
                ANTERIOR
              </Text>
            </TouchableOpacity>
          )}
        </View>

        {/* centro */}
        <View style={[styles.col, styles.colCenter]}>
          {isLast && (
            <TouchableOpacity
              style={[styles.botao, styles.botaoFinalizar]}
              onPress={finalizar}
              activeOpacity={0.9}
            >
              <Text style={styles.textoBotaoFinalizar} numberOfLines={1}>
                FINALIZAR
              </Text>
            </TouchableOpacity>
          )}
        </View>

        {/* direita */}
        <View style={[styles.col, styles.colRight]}>
          {!isLast && (
            <TouchableOpacity
              style={[styles.botao, styles.botaoProximo]}
              onPress={proximaPergunta}
              activeOpacity={0.8}
            >
              <Text style={styles.textoBotao} numberOfLines={1}>
                PRÓXIMO
              </Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  titulo: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 25,
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

  /* footer 3-col */
  footerRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 25,
    marginBottom: 40,
    height: 72,
  },
  col: {
    flex: 1,
    justifyContent: "center",
  },
  colLeft: {
    alignItems: "flex-start",
    paddingLeft: 4,
  },
  colCenter: {
    alignItems: "center",
  },
  colRight: {
    alignItems: "flex-end",
    paddingRight: 4,
  },

  botao: {
    backgroundColor: "#4b7250",
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 22,
    alignItems: "center",
    justifyContent: "center",

    /* NÃO deixar o botão encolher e garantir tamanho mínimo */
    flexShrink: 0,
    minWidth: 120,
  },

  textoBotao: {
    fontWeight: "600",
    color: "#fff",
    textAlign: "center",
    flexWrap: "nowrap",
  },

  /* estilos específicos */
  botaoAnterior: {
    backgroundColor: "#4b7250",
  },
  botaoProximo: {
    backgroundColor: "#4b7250",
  },

  botaoFinalizar: {
    backgroundColor: "#2e8b57", // destaque
    paddingHorizontal: 10,
    minWidth: 130, // garantir espaço pro texto sem quebra
    flexShrink: 0,
    shadowColor: "#000",
    shadowOpacity: 0.18,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 4,
  },
  textoBotaoFinalizar: {
    fontWeight: "700",
    color: "#fff",
    letterSpacing: 0.5,
    textAlign: "center",
    flexWrap: "nowrap",
  },
});