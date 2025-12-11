// Formulario
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

interface Props {
  texto: string;
  children?: React.ReactNode;
  fontSize?: number; // 🟢 Novo prop opcional
}

const Formulario = ({ texto, children, fontSize = 20 }: Props) => {
  return (
    <View style={styles.container}>
      <Text
        style={[styles.texto, { fontSize }]} // 🟢 aplica tamanho da fonte
        numberOfLines={3}
        ellipsizeMode='tail'
      >
        {texto}
      </Text>

      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    marginVertical: 8,

    minHeight: 55,
    maxHeight: 200,

    backgroundColor: '#dfdfdfff',
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'space-between',
    maxWidth: '100%',
    overflow: 'hidden',

    // iOS
    shadowColor: "#444444ff",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,

    // Android
    elevation: 8,
  },
  textContainer: {
    flex: 1,
  },
  texto: {
    fontSize: 20, // padrão (sobrescrito se o prop for passado)
    fontWeight: 'bold',
    marginLeft: 10,
    width: '60%',
  },
});

export default Formulario;
