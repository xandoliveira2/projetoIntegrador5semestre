import React from "react";
import { StyleSheet, Text, TouchableOpacity, View, ViewStyle } from "react-native";

interface Props {
  pergunta: string;
  opcoes: string[];
  resposta: string | null;
  onSelect: (valor: string) => void;
  containerStyle?: ViewStyle;

  // NOVAS PROPS
  fontSizePergunta?: number;
  fontSizeOpcao?: number;
  fontSizeOpcaoSelecionada?: number;
}

const PerguntaAlternativa = ({
  pergunta,
  opcoes,
  resposta,
  onSelect,
  containerStyle,
  fontSizePergunta = 23,
  fontSizeOpcao = 18,
  fontSizeOpcaoSelecionada = 18,
}: Props) => {
  return (
    <View style={[styles.container, containerStyle]}>
      <Text style={[styles.pergunta, { fontSize: fontSizePergunta }]}>
        {pergunta}
      </Text>

      {opcoes.map((opcao, index) => {
        const selecionado = resposta === opcao;

        return (
          <TouchableOpacity
            key={`${opcao}-${index}`}
            style={[styles.opcao, selecionado && styles.opcaoSelecionada]}
            onPress={() => onSelect(opcao)}
          >
            <Text
              style={[
                styles.textoOpcao,
                {
                  fontSize: selecionado
                    ? fontSizeOpcaoSelecionada
                    : fontSizeOpcao,
                },
                selecionado && styles.textoSelecionado,
              ]}
            >
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
  textoOpcao: {},
  textoSelecionado: {
    fontWeight: "bold",
  },
});

export default PerguntaAlternativa;
