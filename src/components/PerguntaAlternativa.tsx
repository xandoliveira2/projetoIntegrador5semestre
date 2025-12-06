import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface Props {
  pergunta: string;
  opcoes: string[];
  resposta: string | null;
  onSelect: (valor: string) => void;
}

const PerguntaAlternativa = ({ pergunta, opcoes, resposta, onSelect }: Props) => {
  return (
    <View style={styles.container}>
      <Text style={styles.pergunta}>{pergunta}</Text>

      {opcoes.map((opcao, index) => {
        const selecionado = resposta === opcao;
        return (
          <TouchableOpacity
            key={`${opcao}-${index}`}
            style={[styles.opcao, selecionado && styles.opcaoSelecionada]}
            onPress={() => onSelect(opcao)}
          >
            <Text style={[styles.textoOpcao, selecionado && styles.textoSelecionado]}>
              {opcao}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
  },
  pergunta: {
    fontWeight: "bold",
    fontSize: 18,
    marginBottom: 15,
  },
  opcao: {
    backgroundColor: "#d9d9d9",
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 15,
    marginBottom: 10,
  },
  opcaoSelecionada: {
    backgroundColor: "#b8c0ff",
    borderColor: "#5b5fc7",
    borderWidth: 2,
  },
  textoOpcao: {
    fontSize: 16,
  },
  textoSelecionado: {
    fontWeight: "bold",
  },
});

export default PerguntaAlternativa;
