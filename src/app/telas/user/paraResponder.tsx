import React, { useEffect, useState } from "react";
import { ScrollView, View } from "react-native";

import Date from "@/components/Date";
import EmptyListMessage from "@/components/EmptyListMessage";
import FormButton from "@/components/FormButton";
import Formulario from "@/components/Formulario";

import { useAuth } from "@/context/AuthContext";
import { useRouter } from "expo-router";

import { db } from "@/firebase/firebaseConfig";
import { collection, query, where, getDocs } from "firebase/firestore";

type FormularioType = {
  id: string;
  texto: string;
  data: string;
};

export default function ParaResponder() {
  const router = useRouter();
  const { user } = useAuth();

  const [formularios, setFormularios] = useState<FormularioType[]>([]);

  const handleResponder = (idFormulario: string) => {
    router.push({
      pathname: "/telas/responderFormulario",
      params: { idFormulario },
    });
  };

  useEffect(() => {
    const carregarFormularios = async () => {
      if (!user?.username) return;

      try {
        setFormularios([]); // ✅ LIMPA ANTES DE CARREGAR

        const usuario = user.username;

        // ✅ 1. Buscar formulários já respondidos
        const qRespondidos = query(
          collection(db, "usuario_formularios_respondidos"),
          where("usuario", "==", usuario)
        );

        const respSnapshot = await getDocs(qRespondidos);

        const idsRespondidos = new Set(
          respSnapshot.docs.map((doc) => doc.data().id_formulario)
        );

        // ✅ 2. Buscar formulários disponíveis
        const qFormularios = query(
          collection(db, "formularios"),
          where("status", "==", true)
        );

        const formsSnapshot = await getDocs(qFormularios);

        const lista: FormularioType[] = [];

        formsSnapshot.forEach((doc) => {
          if (idsRespondidos.has(doc.id)) return; // ✅ ignora já respondidos

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

        // ✅ REMOVE QUALQUER DUPLICATA POR GARANTIA
        const listaUnica = lista.filter(
          (item, index, self) =>
            index === self.findIndex((f) => f.id === item.id)
        );

        setFormularios(listaUnica);
      } catch (error) {
        console.error("Erro ao carregar formulários:", error);
      }
    };

    carregarFormularios();
  }, [user?.username]);

  return (
    <View>
      <ScrollView style={{ padding: 20 }}
      contentContainerStyle={{ paddingBottom: 100 }} // 👈 folga no final do scroll
>
        {formularios.length === 0 ? (
          <EmptyListMessage mensagem="Nenhum formulário para responder" />
        ) : (
          formularios.map((f) => (
            <View key={`form-${f.id}`} style={{ marginTop: 15 }}>
              {/* ✅ key agora é 100% única */}

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
