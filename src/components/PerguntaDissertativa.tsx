import React from "react";
import { StyleSheet, Text, TextInput, View, ViewStyle } from "react-native";

interface Props {
  pergunta: string;
  resposta: string;
  onChange: (valor: string) => void;

  // NOVAS PROPS
  fontSizePergunta?: number;
  fontSizeResposta?: number;
  containerStyle?: ViewStyle;
}

const PerguntaDissertativa = ({
  pergunta,
  resposta,
  onChange,
  fontSizePergunta = 23,
  fontSizeResposta = 25,
  containerStyle,
}: Props) => {
  return (
    <View style={[styles.container, containerStyle]}>
      <Text style={[styles.pergunta, { fontSize: fontSizePergunta }]}>
        {pergunta}
      </Text>

      <TextInput
        style={[styles.input, { fontSize: fontSizeResposta }]}
        value={resposta}
        onChangeText={onChange}
        multiline
        placeholder="Digite sua resposta..."
        placeholderTextColor="#999"
      />
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
  input: {
    borderWidth: 2,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 10,
    minHeight: 80,
    textAlignVertical: "top",
  },
});

export default PerguntaDissertativa;
