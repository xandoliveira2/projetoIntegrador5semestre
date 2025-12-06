import { db } from "@/firebase/firebaseConfig";
import { collection, doc, getDoc, getDocs, query, where } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { ScrollView, View } from "react-native";

import Date from "@/components/Date";
import EmptyListMessage from "@/components/EmptyListMessage";
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
        const q = query(
          collection(db, "usuario_formularios_respondidos"),
          where("usuario", "==", user.username)
        );

        console.log(user.username);

        const snapshot = await getDocs(q);

        const listaTemp: any[] = [];

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
      <ScrollView 
        style={{ padding: 20 }}
        contentContainerStyle={{ paddingBottom: 100 }} // 👈 folga no final do scroll
      >
        {formularios.length === 0 ? (
          <EmptyListMessage mensagem="Você ainda não respondeu nenhum formulário" />
        ) : (
          formularios.map((f, index) => (
            <View key={`${f.id}-${index}`} style={{ marginTop: 15 }}>
              <Date data={f.data} />
              <Formulario texto={f.texto}></Formulario>
            </View>
          ))
        )}
      </ScrollView>
    </View>
  );
}
