// components/EmptyListMessage.tsx
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

interface Props {
  mensagem: string;
}

const EmptyListMessage: React.FC<Props> = ({ mensagem }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.texto}>{mensagem}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex:5,


  },
  texto: {
    marginTop:30,
    fontSize: 20,
    color: 'gray',
    alignSelf: 'center',
  },
});

export default EmptyListMessage;
