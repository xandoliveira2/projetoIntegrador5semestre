import React, { useEffect, useState } from "react";
import { ScrollView, View } from "react-native";

import Date from "@/components/Date";
import EmptyListMessage from "@/components/EmptyListMessage";
import FormButton from "@/components/FormButton";
import Formulario from "@/components/Formulario";

import { useAuth } from "@/context/AuthContext";
import { useRouter } from "expo-router";

import { db } from "@/firebase/firebaseConfig";
import { collection, getDocs, query, where } from "firebase/firestore";

export default function ParaResponder() {
  const router = useRouter();
  const { user } = useAuth();

  const [formularios, setFormularios] = useState<any[]>([]);

  const handleResponder = (idFormulario: string) => {
    console.log(idFormulario);
    router.push({
      pathname: "/telas/responderFormulario",
      params: { idFormulario },
    });
  };

  useEffect(() => {
    const carregarFormularios = async () => {
      if (!user) return;

      try {
        const usuario = user.username;

        // Buscar IDs dos formulários já respondidos
        const qRespondidos = query(
          collection(db, "usuario_formularios_respondidos"),
          where("usuario", "==", usuario)
        );

        const respSnapshot = await getDocs(qRespondidos);

        const idsRespondidos = respSnapshot.docs.map(
          (doc) => doc.data().id_formulario
        );

        // Buscar formulários ativos
        const qFormularios = query(
          collection(db, "formularios"),
          where("status", "==", true)
        );

        const formsSnapshot = await getDocs(qFormularios);

        const lista: any[] = [];

        formsSnapshot.forEach((doc) => {
          const data = doc.data();

          if (idsRespondidos.includes(doc.id)) return;

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
        console.error(error);
      }
    };

    carregarFormularios();
  }, [user]);

  return (
    <View>
      <ScrollView style={{ padding: 20 }}
      contentContainerStyle={{ paddingBottom: 100 }} // 👈 folga no final do scroll
>
        {formularios.length === 0 ? (
          <EmptyListMessage mensagem="Nenhum formulário para responder" />
        ) : (
          formularios.map((f, index) => (
            <View key={`${f.id}-${index}`} style={{ marginTop: 15 }}>
              <Date data={f.data} />

              <Formulario texto={f.texto}>
                <FormButton
                  text="Responder"
                  onPress={() => handleResponder(f.id)}
                />
              </Formulario>
            </View>
          ))
        )}
      </ScrollView>
    </View>
  );
}
