import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

interface Props {
  titulo: string;
  children?: React.ReactNode;
}

const FormularioTitulo = ({ titulo, children }: Props) => {
  return (
    <View style={styles.container}>
      <Text
        style={styles.texto}
        numberOfLines={1}
        ellipsizeMode="tail"
      >
        {titulo}
      </Text>

      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',

    backgroundColor: '#dfdfdf',
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
    paddingHorizontal: 10,
    minHeight: 55,
    maxHeight: 55,

    // Sombras
    shadowColor: '#444444ff',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
  },
  texto: {
    fontSize: 16,
    fontWeight: 'bold',
    flex: 1,
    marginRight: 10,
  },
});

export default FormularioTitulo;
