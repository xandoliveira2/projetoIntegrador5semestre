import { useEffect, useState } from "react";
import { Alert, ScrollView, View } from "react-native";

import Date from "@/components/Date";
import EmptyListMessage from "@/components/EmptyListMessage";
import FormButton from "@/components/FormButton";
import Formulario from "@/components/Formulario";
import OptionsMenu from "@/components/OptionsMenu";
import { styles } from "@/styles/IconButtonStyle";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "@/firebase/firebaseConfig";

export default function Finalizado() {
  const [menuAbertoId, setMenuAbertoId] = useState<string>("");
  const [formularios, setFormularios] = useState<
  { id: string; texto: string; data: string }[]
>([]);
useEffect(() => {
  const fetchFormularios = async () => {
    try {
      const q = query(
        collection(db, "formularios"),
        where("status", "==", false) // 👈 Apenas formulários finalizados
      );

      const querySnapshot = await getDocs(q);
      const lista: { id: string; texto: string; data: string }[] = [];

      querySnapshot.forEach((doc) => {
        const data = doc.data();

        const dataCriacao = data.data_criacao?.toDate
          ? data.data_criacao.toDate().toLocaleDateString("pt-BR")
          : "Sem data";

        lista.push({
          id: doc.id,
          texto: data.nome || "Sem nome",
          data: dataCriacao,
        });
      });

      setFormularios(lista);
    } catch (error) {
      console.error("Erro ao carregar formulários finalizados:", error);
    }
  };

  fetchFormularios();
}, []);
  // const formularios = [
  //   { id: 1, texto: "Pesquisa de satisfação 2023", data: "12/06/2023" },
  //   { id: 2, texto: "Avaliação de serviço 2024", data: "15/10/2024" },
  //   { id: 3, texto: "Pesquisa de satisfação 2023", data: "12/06/2023" },
  //   { id: 4, texto: "Avaliação de serviço 2024", data: "15/10/2024" },
  //   { id: 5, texto: "Pesquisa de satisfação 2023", data: "12/06/2023" },
  //   { id: 6, texto: "Avaliação de serviço 2024", data: "15/10/2024" },
  //   { id: 7, texto: "Pesquisa de satisfação 2023", data: "12/06/2023" },
  //   { id: 8, texto: "Avaliação de serviço 2024", data: "15/10/2024" },
  // ];

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
                  onClose={() => setMenuAbertoId("")}
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