// Listar Formularios
import FormButton from '@/components/formButton';
import Formulario from '@/components/formulario';
import ListaVazia from '@/components/listaVaziaMessage';

import React from 'react';
import { ScrollView, View } from 'react-native';

export default function App() {
  const formularios: any[] = [
    
    {
      id: 1,
      texto: "Pesquisa de satisfação 205",
    },
    {
      id: 2,
      texto: "",
    },/*
    {
      id: 3,
      texto: "",
    },
    */
  ];

  return (
    <View>
      
      <ScrollView style={{ padding: 20 }}>
        {formularios.length === 0 ? (
          <ListaVazia mensagem="Nenhum formulário para responder" />
        ) : (
          formularios.map((c) => (
            <Formulario

              key={c.id}
              texto={c.texto}

            >

              <FormButton
                text="Editar"
                style={{ alignSelf: "flex-end" }}
                onPress={() => {
                  // Adicione aqui a ação desejada ao pressionar o botão
                  console.log(`Editar formulário ${c.id}`);
                }}
              />
            </Formulario>


          ))
        )}
      </ScrollView>

    </View>
  );
}
