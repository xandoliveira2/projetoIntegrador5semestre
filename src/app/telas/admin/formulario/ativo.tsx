import React from 'react';
import { ScrollView, View } from 'react-native';

import Date from '@/components/Date';
import EmptyListMessage from '@/components/EmptyListMessage';
import FormButton from '@/components/FormButton';
import Formulario from '@/components/Formulario';

import { styles } from '@/styles/IconButtonStyle';

export default function Ativo() {
  const formularios: any[] = [

    {
      id: 1,
      texto: "Pesquisa de satisfação 2023",
      data: "12/06/2023"
    }
  ];

  return (
    /*<View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Ativo</Text>
    </View>*/


    <View style={{ flex: 1 }}>

      <ScrollView style={{ padding: 20 }}>
        {formularios.length === 0 ? (
          <EmptyListMessage mensagem="Nenhum formulário respondido" />


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
                  style={styles.container}
                  icon={require('@/../assets/icons/engrenagem_branco.png')}
                  iconSize={29}

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
    </View>


  );
}
