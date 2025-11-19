import React, { useState } from "react";
import { Alert, ScrollView, View } from "react-native";

import Date from "@/components/Date";
import EmptyListMessage from "@/components/EmptyListMessage";
import FormButton from "@/components/FormButton";
import Formulario from "@/components/Formulario";
import OptionsMenu from "@/components/OptionsMenu";
import { styles } from "@/styles/IconButtonStyle";

export default function Finalizado() {
  const [menuAbertoId, setMenuAbertoId] = useState<number | null>(null);

  const formularios = [
    { id: 1, texto: "Pesquisa de satisfação 2023", data: "12/06/2023" },
    { id: 2, texto: "Avaliação de serviço 2024", data: "15/10/2024" },
    { id: 3, texto: "Pesquisa de satisfação 2023", data: "12/06/2023" },
    { id: 4, texto: "Avaliação de serviço 2024", data: "15/10/2024" },
    { id: 5, texto: "Pesquisa de satisfação 2023", data: "12/06/2023" },
    { id: 6, texto: "Avaliação de serviço 2024", data: "15/10/2024" },
    { id: 7, texto: "Pesquisa de satisfação 2023", data: "12/06/2023" },
    { id: 8, texto: "Avaliação de serviço 2024", data: "15/10/2024" },
  ];

  return (
    <View style={{ flex: 1 }}>
      <ScrollView style={{ padding: 20 }}>
        {formularios.length === 0 ? (
          <EmptyListMessage mensagem="Nenhum formulário finalizado" />
        ) : (
          formularios.map((f) => (
            <View key={f.id} style={{ marginTop: 15 }}>
              <Date data={f.data} />
              <Formulario texto={f.texto}>
                <OptionsMenu
                  visible={menuAbertoId === f.id}
                  onOpen={() => setMenuAbertoId(f.id)}
                  onClose={() => setMenuAbertoId(null)}
                  icon={
                    <FormButton
                      style={styles.container}
                      icon={require("@/../assets/icons/engrenagem_branco.png")}
                      iconSize={29}
                      onPress={() => {}}
                    />
                  }
                  options={[
                    {
                      title: "📤 Exportar Dados",
                      onPress: () => Alert.alert("Exportar Dados", f.texto),
                    },
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