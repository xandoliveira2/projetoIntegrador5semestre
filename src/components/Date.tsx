// components/date
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

interface Props {
  data: string;
  fontSize?: number; // 🟢 Novo prop opcional
}

const Date: React.FC<Props> = ({ data, fontSize = 16 }) => {
  return (
    <View style={styles.container}>
      <Text style={[styles.texto, { fontSize }]}>{data}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  texto: {
    fontSize: 16, // padrão, mas será sobrescrito caso o usuário envie outro
    color: 'black',
  },
});

export default Date;
