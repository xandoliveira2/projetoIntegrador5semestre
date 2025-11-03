// Formulario
import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';

const Formulario = ({ texto, children }) => {
  return (
    <View style={styles.container}>
      
      
      <Text style={styles.texto}>{texto}</Text>
      {children}
      
      
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    heigth:50,
    flexDirection: 'row',
    marginVertical: 8,
    padding:10,
    paddingTop:15 ,
    paddingBottom:15,
    backgroundColor: '#f2f2f2',
    borderRadius: 8,
    alignItems: 'center',
  },
  textContainer: {
    flex: 1,
  },
  texto: {
    fontSize: 16,
  },
});

export default Formulario;
