import React, { useState } from "react";
import { Alert, View, FlatList } from "react-native";

import Date from "@/components/Date";
import EmptyListMessage from "@/components/EmptyListMessage";
import FormButton from "@/components/FormButton";
import OptionsMenu from "@/components/OptionsMenu";
import { styles } from "@/styles/IconButtonStyle";
import FormularioExpandivel from "@/components/FormularioExpandivel";

export default function Ativo() {
  const formularios = [
    {
      id: 1,
      titulo: "Pesquisa de satisfação 2023",
      data: "12/06/2023",
      usuarios: [
        { id: 1, nome: "João", respondido: true },
        { id: 2, nome: "Maria", respondido: true },
        { id: 3, nome: "Pedro", respondido: false },
        { id: 4, nome: "Ana", respondido: true },
      ],
    },
    {
      id: 2,
      titulo: "Avaliação de serviço 2024",
      data: "15/10/2024",
      usuarios: [
        { id: 1, nome: "Carlos", respondido: false },
        { id: 2, nome: "Jéssica", respondido: false },
        { id: 3, nome: "Bruno", respondido: true },
      ],
    },
  ];

  const [menuAbertoId, setMenuAbertoId] = useState<number | null>(null);

  return (
    <View style={{ flex: 1, padding: 20 }}>
      {formularios.length === 0 ? (
        <EmptyListMessage mensagem="Nenhum formulário ativo" />
      ) : (
        <FlatList
          data={formularios}
          keyExtractor={(item) => item.id.toString()}
          showsVerticalScrollIndicator={false}
          renderItem={({ item: f }) => {
            const total = f.usuarios.length;
            const respondidos = f.usuarios.filter((u) => u.respondido).length;

            return (
              <View style={{ marginTop: 15 }}>
                <Date data={f.data} />

                <FormularioExpandivel
                  titulo={f.titulo}
                  respondidos={respondidos}
                  total={total}
                  usuarios={f.usuarios}
                >
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
                        title: "✏️ Editar",
                        onPress: () => Alert.alert("Editar", f.titulo),
                      },
                      {
                        title: "📅 Alterar Data",
                        onPress: () => Alert.alert("Alterar data", f.data),
                      },
                      {
                        title: "🛑 Encerrar",
                        onPress: () => Alert.alert("Encerrar", f.titulo),
                      },
                    ]}
                  />
                </FormularioExpandivel>
              </View>
            );
          }}
        />
      )}
    </View>
  );
}