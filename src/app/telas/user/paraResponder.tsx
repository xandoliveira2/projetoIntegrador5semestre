import React from 'react';
import { View, Text, ScrollView } from 'react-native';

import Date from '@/components/Date';
import FormButton from '@/components/FormButton';
import Formulario from '@/components/Formulario';
import EmptyListMessage from '@/components/EmptyListMessage';

export default function ParaResponder() {
  const formularios: any[] = [

        {
            id: 1,
            texto: "Pesquisa de satisfação 2023",
            data: "12/06/2023"
        },
        {
            id: 2,
            texto: "Pesquisa de satisfação 2024",
            data: "07/05/2024"

        },/*
    {
      id: 3,
      texto: "",
    },
    */
    ];

  return (
  /*
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Para Responder</Text>
    </View>
    */
   <view>

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

                                <FormButton
                                    text="Responder"
                                    style={{  }}
                                    onPress={() => {
                                        // Adicione aqui a ação desejada ao pressionar o botão
                                        console.log(`Responder formulário ${f.id}`);
                                    }}
                                />
                            </Formulario>
                        </View>



                    ))
                )}
            </ScrollView>
   </view>

  );
}
