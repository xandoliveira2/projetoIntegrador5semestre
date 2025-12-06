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
    if (!user?.username) return;

    const carregarRespondidos = async () => {
      try {
        setLoading(true);

        const q = query(
          collection(db, "usuario_formularios_respondidos"),
          where("usuario", "==", user.username)
        );

        const snapshot = await getDocs(q);

        // ✅ 1. AGRUPAR POR FORMULÁRIO SEM DUPLICAR
        const mapa = new Map<string, any>();

        for (const resposta of snapshot.docs) {
          const dados = resposta.data();
          const idFormulario = dados.id_formulario;

          // ✅ Se já existe no mapa, IGNORA
          if (mapa.has(idFormulario)) continue;

          const formRef = doc(db, "formularios", idFormulario);
          const formSnap = await getDoc(formRef);

          if (formSnap.exists()) {
            const formData = formSnap.data();

            mapa.set(idFormulario, {
              id: idFormulario,
              texto: formData.nome,
              data: dados.data_resposta?.toDate
                ? dados.data_resposta.toDate().toLocaleDateString("pt-BR")
                : "Sem data",
              ativo: formData.status,
            });
          }
        }

        // ✅ 2. CONVERTE O MAPA EM ARRAY
        setFormularios(Array.from(mapa.values()));
      } catch (err) {
        console.log("Erro ao carregar respondidos:", err);
      } finally {
        setLoading(false);
      }
    };

    carregarRespondidos();
  }, [user?.username]);

  if (loading) {
    return (
      <View style={{ padding: 20 }}>
        <EmptyListMessage mensagem="Carregando respostas..." />
      </View>
    );
  }

  return (
    <View style={{ flex: 1 }}>
      <ScrollView
        style={{ padding: 20 }}
        contentContainerStyle={{ paddingBottom: 120 }}
      >
        {formularios.length === 0 ? (
          <EmptyListMessage mensagem="Você ainda não respondeu nenhum formulário" />
        ) : (
          formularios.map((f) => (
            <View key={f.id} style={{ marginTop: 15 }}>
              <Date data={f.data} />
              <Formulario texto={f.texto} />
            </View>
          ))
        )}
      </ScrollView>
    </View>
  );
}
