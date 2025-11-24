import React, { useEffect, useState } from "react";
import { ScrollView, View } from "react-native";
import { collection, getDocs, query, where, doc, getDoc } from "firebase/firestore";
import { db } from "@/firebase/firebaseConfig";

import Date from "@/components/Date";
import EmptyListMessage from "@/components/EmptyListMessage";
import FormButton from "@/components/FormButton";
import Formulario from "@/components/Formulario";
import { useAuth } from "@/context/AuthContext";

export default function Respondidos() {
  const { user } = useAuth();
  const [formularios, setFormularios] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    const carregarRespondidos = async () => {
      try {
        // 1️⃣ Buscar todos os formulários respondidos pelo usuário
        const q = query(
          collection(db, "usuario_formularios_respondidos"),
          where("usuario", "==", user.username)
        );

        console.log(user.username)
      
        const snapshot = await getDocs(q);

        const listaTemp: any[] = [];

        // 2️⃣ Para cada resposta, buscar os dados do formulário na collection "formularios"
        for (const resposta of snapshot.docs) {
          const dados = resposta.data();
          const formRef = doc(db, "formularios", dados.id_formulario);
          const formSnap = await getDoc(formRef);

          if (formSnap.exists()) {
            const formData = formSnap.data();

              listaTemp.push({
            id: dados.id_formulario,
            texto: formData.nome,
            data: dados.data_resposta.toDate().toLocaleDateString("pt-BR"),
            ativo: formData.status,
          });
          }
        }

        setFormularios(listaTemp);
      } catch (err) {
        console.log("Erro ao carregar respondidos:", err);
      } finally {
        setLoading(false);
      }
    };

    carregarRespondidos();
  }, [user]);

  if (loading) {
    return (
      <View style={{ padding: 20 }}>
        <EmptyListMessage mensagem="Carregando respostas..." />
      </View>
    );
  }

  return (
    <View>
      <ScrollView style={{ padding: 20 }}>
        {formularios.length === 0 ? (
          <EmptyListMessage mensagem="Você ainda não respondeu nenhum formulário" />
        ) : (
          formularios.map((f) => (
            <View key={f.id} style={{ marginTop: 15 }}>
              <Date data={f.data} />

              <Formulario texto={f.texto}>
                {f.ativo ? (
                  <FormButton
                    text="Editar"
                    onPress={() => console.log("Editar resposta", f.id)}
                  />
                ) : undefined}
              </Formulario>
            </View>
          ))
        )}
      </ScrollView>
    </View>
  );
}
