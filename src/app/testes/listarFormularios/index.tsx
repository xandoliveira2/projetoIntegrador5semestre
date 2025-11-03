// Listar Formularios
import React from 'react';
import { ScrollView, View, Text } from 'react-native';
import Formulario from '@/components/formulario';
import FormButton from '@/components/formButton';

export default function App() {
  const formularios = [
    {
      id: 1,
      texto: "Pesquisa de satisfação 205",
    }/*,
    {
      id: 2,
      texto: "Muito interessante!",
      imagem: "https://placekitten.com/51/51",
      likes: 8,
      dislikes: 1,
    },
    {
      id: 3,
      texto: "Não gostei desse post.",
      imagem: "https://placekitten.com/52/52",
      likes: 2,
      dislikes: 3,
    },
    */
  ];

  return (
  
    <ScrollView style={{ padding: 20 }}>

      {formularios.map((c) => (
        <Formulario
          key={c.id}
          texto={c.texto}
          
        >
         
           <FormButton text="Editar"
           style={{align: "flex-start"}}
           ></FormButton>
        </Formulario>
      ))}
    </ScrollView>
  );
}
