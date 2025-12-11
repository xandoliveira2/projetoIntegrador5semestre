import React, { useEffect, useState } from "react";
import { ScrollView, View } from "react-native";

import Date from "@/components/Date";
import EmptyListMessage from "@/components/EmptyListMessage";
import FormButton from "@/components/FormButton";
import Formulario from "@/components/Formulario";

import { useAuth } from "@/context/AuthContext";
import { useRouter } from "expo-router";

import FontSizeButtons from "@/components/FontSizeButtons";
import { useFontSize } from "@/components/FontSizeProvider";

import { db } from "@/firebase/firebaseConfig";
import { collection, getDocs, query, where } from "firebase/firestore";

type FormularioType = {
  id: string;
  texto: string;
  data: string;
};

export default function ParaResponder() {
  const router = useRouter();
  const { user } = useAuth();

  const { fontSize, increase, decrease, setBounds } = useFontSize();

  const [formularios, setFormularios] = useState<FormularioType[]>([]);

  // -------------------------------
  //  🔤 LIMITES DE TAMANHO DE FONTE
  // -------------------------------
  const limits = {
    titulo: { min: 18, max: 50 }, // Formulario (texto)
    data: { min: 12, max: 30 },   // Date (data)
    //botao: { min: 16, max: 30 },  // Botão "Responder"
  };

  // define limites globais no provider
  useEffect(() => {
    const providerMin = Math.max(
      limits.titulo.min,
      limits.data.min,
     // limits.botao.min
    );
    const providerMax = Math.min(
      limits.titulo.max,
      limits.data.max,
    //  limits.botao.max
    );

    if (providerMin > providerMax) {
      setBounds(14, 32);
    } else {
      setBounds(providerMin, providerMax);
    }
  }, []);

  const clamp = (size: number, min: number, max: number) =>
    Math.min(max, Math.max(min, size));

  //  🔤 tamanhos finais aplicados nos componentes
  const fontSizes = {
    data: clamp(fontSize, limits.data.min, limits.data.max),
    titulo: clamp(fontSize, limits.titulo.min, limits.titulo.max),
   // botao: clamp(fontSize, limits.botao.min, limits.botao.max),
  };

  // -------------------------------
  //  🔍 CARREGAR FORMULÁRIOS
  // -------------------------------
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
        setFormularios([]);

        const usuario = user.username;

        // 🔹 Buscar IDs já respondidos
        const qRespondidos = query(
          collection(db, "usuario_formularios_respondidos"),
          where("usuario", "==", usuario)
        );

        const respSnapshot = await getDocs(qRespondidos);
        const idsRespondidos = new Set(
          respSnapshot.docs.map((doc) => doc.data().id_formulario)
        );

        // 🔹 Buscar formulários ativos
        const qFormularios = query(
          collection(db, "formularios"),
          where("status", "==", true)
        );

        const formsSnapshot = await getDocs(qFormularios);

        const lista: FormularioType[] = [];

        formsSnapshot.forEach((doc) => {
          if (idsRespondidos.has(doc.id)) return;

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
        console.error("Erro ao carregar formulários:", error);
      }
    };

    carregarFormularios();
  }, [user]);

  // -------------------------------
  //  📌 RENDER
  // -------------------------------
  return (
    <View style={{ flex: 1 }}>
      {/* ------------------ BOTÕES DE FONT SIZE ------------------ */}
      <View style={{ marginLeft: "73%", marginBottom: "2%" }}>
        <FontSizeButtons onIncrease={increase} onDecrease={decrease} />
      </View>

      <ScrollView
        style={{ padding: 20 }}
        contentContainerStyle={{ paddingBottom: 100 }}
      >
        {formularios.length === 0 ? (
          <EmptyListMessage mensagem="Nenhum formulário para responder" />
        ) : (
          formularios.map((f) => (
            <View key={f.id} style={{ marginTop: 15 }}>
              {/* 🔤 Fonte da data controlada pelo provider */}
              <Date data={f.data} fontSize={fontSizes.data} />

              {/* 🔤 Fonte do titulo do formulario controlada */}
              <Formulario texto={f.texto} fontSize={fontSizes.titulo}>
                {/* 🔤 Botão com fonte controlada */}
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
