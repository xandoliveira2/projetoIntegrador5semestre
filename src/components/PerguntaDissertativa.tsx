import React from "react";
import { StyleSheet, Text, TextInput, View } from "react-native";

interface Props {
  pergunta: string;
  resposta: string;
  onChange: (valor: string) => void;
}

const PerguntaDissertativa = ({ pergunta, resposta, onChange }: Props) => {
  return (
    <View style={styles.container}>
      <Text style={styles.pergunta}>{pergunta}</Text>
      <TextInput
        style={styles.input}
        value={resposta}
        onChangeText={onChange}
        multiline
        placeholder="Digite sua resposta..."
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
    fontSize: 18,
    marginBottom: 15,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 10,
    minHeight: 80,
    textAlignVertical: "top",
  },
});

export default PerguntaDissertativa;
