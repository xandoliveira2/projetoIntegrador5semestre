import React from 'react';
import { ScrollView, View } from 'react-native';

import Date from '@/components/Date';
import EmptyListMessage from '@/components/EmptyListMessage';
import FormButton from '@/components/FormButton';
import Formulario from '@/components/Formulario';

export default function Respondidos() {
  const formularios: any[] = [

    {
      id: 1,
      texto: "Pesquisa de satisfação 2023",
      data: "12/06/2023",
      ativo: true
    },
    {
      id: 1,
      texto: "Pesquisa de satisfação 2023",
      data: "12/06/2023",
      ativo: false

    },

    {
      id: 1,
      texto: "Pesquisa de satisfação 2023",
      data: "12/06/2023",
      ativo: false

    }
  ];

  return (
    /*
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>Para Responder</Text>
      </View>
      */
    <View>

      <ScrollView style={{ padding: 20 }}>
        {formularios.length === 0 ? (
          <EmptyListMessage mensagem="Nenhum formulário para responder" />
        ) : (
          formularios.map((f) => (
            <View
              style={{ marginTop: 15 }}>
              <Date data={f.data}></Date>

              <Formulario

                key={f.id}
                texto={f.texto}
              >

                {f.ativo ? (<FormButton
                  text="Editar"
                  style={{}}
                  onPress={() => {
                    // Adicione aqui a ação desejada ao pressionar o botão
                    console.log(`Responder formulário ${f.id}`);
                  }}
                />
                ) : (undefined)}

              </Formulario>
            </View>



          ))
        )}
      </ScrollView>
    </View>

  );
}
