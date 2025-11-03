// components/date
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

interface Props {
  data: string;
}

const Data: React.FC<Props> = ({ data }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.texto}>{data}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex:1,

  },
  texto: {
    fontSize: 16,
    color: 'black',
  },
});

export default Data;
