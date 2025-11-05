import React from 'react';
import { Alert, ScrollView, View } from 'react-native';

import Date from '@/components/Date';
import EmptyListMessage from '@/components/EmptyListMessage';
import FormButton from '@/components/FormButton';
import Formulario from '@/components/Formulario';
import OptionsMenu from '@/components/OptionsMenu'; // ✅ novo import
import { styles } from '@/styles/IconButtonStyle';

export default function Ativo() {
  const formularios = [
    { id: 1, texto: 'Pesquisa de satisfação 2023', data: '12/06/2023' },
    { id: 2, texto: 'Avaliação de serviço 2024', data: '15/10/2024' },
  ];

  return (
    <View style={{ flex: 1 }}>
      <ScrollView style={{ padding: 20 }}>
        {formularios.length === 0 ? (
          <EmptyListMessage mensagem="Nenhum formulário respondido" />
        ) : (
          formularios.map((f) => (
            <View key={f.id} style={{ marginTop: 15 }}>
              <Date data={f.data} />
              <Formulario texto={f.texto}>
                
                <OptionsMenu
                  icon={
                    <FormButton
                      style={styles.container}
                      icon={require('@/../assets/icons/engrenagem_branco.png')}
                      iconSize={29}
                      onPress={() => console.log("clicado")} />
                  }
                  options={[
                    { title: '✏️ Editar', onPress: () => Alert.alert('Editar', f.texto) },
                    { title: '📅 Alterar Data', onPress: () => Alert.alert('Alterar data', f.data) },
                    { title: '🛑 Encerrar', onPress: () => Alert.alert('Encerrar', f.texto) },
                  ]}
                />

              </Formulario>
            </View>
          ))
        )}
      </ScrollView>
    </View>
  );
}
