import { db } from "@/firebase/firebaseConfig";
import { collection, doc, getDoc, getDocs, query, where } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { ScrollView, View } from "react-native";

import Date from "@/components/Date";
import EmptyListMessage from "@/components/EmptyListMessage";
import FontSizeButtons from "@/components/FontSizeButtons";
import { useFontSize } from "@/components/FontSizeProvider";
import Formulario from "@/components/Formulario";
import { useAuth } from "@/context/AuthContext";

export default function Respondidos() {
  const { user } = useAuth();
  const { fontSize, setBounds, increase, decrease } = useFontSize();

  const [formularios, setFormularios] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // -------------------------------
  //  🔤 LIMITES DE TAMANHO DE FONTE
  // -------------------------------
  const limits = {
    titulo: { min: 18, max: 30 }, // Formulario (texto)
    data: { min: 12, max: 30 },   // Date (data)
  };

  // define limites globais no provider
  useEffect(() => {
    const providerMin = Math.max(limits.titulo.min, limits.data.min);
    const providerMax = Math.min(limits.titulo.max, limits.data.max);

    if (providerMin > providerMax) {
      setBounds(14, 32);
    } else {
      setBounds(providerMin, providerMax);
    }
  }, []);

  const clamp = (size: number, min: number, max: number) =>
    Math.min(max, Math.max(min, size));

  const fontSizes = {
    data: clamp(fontSize, limits.data.min, limits.data.max),
    titulo: clamp(fontSize, limits.titulo.min, limits.titulo.max),
  };

  // -------------------------------
  //  🔍 CARREGAR FORMULÁRIOS RESPONDIDOS
  // -------------------------------
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
        const mapa = new Map<string, any>();

        for (const resposta of snapshot.docs) {
          const dados = resposta.data();
          const idFormulario = dados.id_formulario;

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

        setFormularios(Array.from(mapa.values()));
      } catch (err) {
        console.log("Erro ao carregar respondidos:", err);
      } finally {
        setLoading(false);
      }
    };

    carregarRespondidos();
  }, [user?.username]);

  // -------------------------------
  //  📌 RENDER
  // -------------------------------
  if (loading) {
    return (
      <View style={{ padding: 20 }}>
        <EmptyListMessage mensagem="Carregando respostas..." />
      </View>
    );
  }

  return (
    <View style={{ flex: 1 }}>
      {/* ------------------ BOTÕES DE FONT SIZE ------------------ */}
      <View style={{ marginLeft: "73%", marginBottom: "2%" }}>
        <FontSizeButtons onIncrease={increase} onDecrease={decrease} />
      </View>

      <ScrollView
        style={{ padding: 20 }}
        contentContainerStyle={{ paddingBottom: 120 }}
      >
        {formularios.length === 0 ? (
          <EmptyListMessage mensagem="Você ainda não respondeu nenhum formulário" />
        ) : (
          formularios.map((f) => (
            <View key={f.id} style={{ marginTop: 15 }}>
              {/* 🔤 Fonte da data controlada pelo provider */}
              <Date data={f.data} fontSize={fontSizes.data} />

              {/* 🔤 Fonte do titulo do formulario controlada */}
              <Formulario texto={f.texto} fontSize={fontSizes.titulo} />
            </View>
          ))
        )}
      </ScrollView>
    </View>
  );
}
