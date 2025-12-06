import { useEffect, useState } from "react";
import {
  Alert,
  ScrollView,
  View,
} from "react-native";

import Date from "@/components/Date";
import EmptyListMessage from "@/components/EmptyListMessage";
import FormButton from "@/components/FormButton";
import Formulario from "@/components/Formulario";
import OptionsMenu from "@/components/OptionsMenu";
import { db } from "@/firebase/firebaseConfig";
import { styles } from "@/styles/IconButtonStyle";

import {
  collection,
  getDocs,
  orderBy,
  query,
  where,
} from "firebase/firestore";

// ✅ IMPORTAÇÃO LEGACY (REMOVE O ERRO)
import * as FileSystem from "expo-file-system/legacy";
import * as Sharing from "expo-sharing";

type FormularioType = {
  id: string;
  texto: string;
  data: string;
};

type PerguntaType = {
  id: string;
  texto: string;
};

type RespostaType = {
  usuario: string;
  id_pergunta: string;
  respostas: string;
};

export default function Finalizado() {
  const [menuAbertoId, setMenuAbertoId] = useState<string>("");
  const [formularios, setFormularios] = useState<FormularioType[]>([]);

  // ✅ BUSCAR FORMULÁRIOS FINALIZADOS
  useEffect(() => {
    const fetchFormularios = async () => {
      try {
        const q = query(
          collection(db, "formularios"),
          where("status", "==", false)
        );

        const querySnapshot = await getDocs(q);
        const lista: FormularioType[] = [];

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
        console.error("Erro ao carregar formulários:", error);
      }
    };

    fetchFormularios();
  }, []);

  // ✅ EXPORTAR CSV 100% FUNCIONAL
  const exportarCSV = async (idFormulario: string) => {
    try {
      // 1️⃣ Buscar perguntas
      const perguntasQuery = query(
        collection(db, "formularios_pergunta"),
        where("formulario_pai", "==", idFormulario),
        orderBy("ordem")
      );

      const perguntasSnapshot = await getDocs(perguntasQuery);
      const perguntas: PerguntaType[] = [];

      perguntasSnapshot.forEach((doc) => {
        const data = doc.data();
        perguntas.push({
          id: doc.id,
          texto: data.pergunta,
        });
      });

      if (perguntas.length === 0) {
        Alert.alert("Erro", "Este formulário não possui perguntas.");
        return;
      }

      // 2️⃣ Buscar respostas
      const respostasQuery = query(
        collection(db, "usuario_formularios_respondidos"),
        where("id_formulario", "==", idFormulario)
      );

      const respostasSnapshot = await getDocs(respostasQuery);
      const respostas: RespostaType[] = [];

      respostasSnapshot.forEach((doc) => {
        const data = doc.data();
        respostas.push({
          usuario: data.usuario,
          id_pergunta: data.id_pergunta,
          respostas: data.respostas,
        });
      });

      if (respostas.length === 0) {
        Alert.alert("Aviso", "Nenhuma resposta encontrada.");
        return;
      }

      // 3️⃣ Organizar por usuário
      const usuarios: Record<string, Record<string, string>> = {};

      respostas.forEach((res) => {
        if (!usuarios[res.usuario]) {
          usuarios[res.usuario] = {};
        }
        usuarios[res.usuario][res.id_pergunta] = res.respostas;
      });

      // 4️⃣ Montar CSV
      let csv = "Usuário;" + perguntas.map((p) => p.texto).join(";") + "\n";

      Object.entries(usuarios).forEach(([usuario, respostasUsuario]) => {
        const linha = [
          usuario,
          ...perguntas.map(
            (p) => respostasUsuario[p.id] || "Sem resposta"
          ),
        ].join(";");

        csv += linha + "\n";
      });

      // 5️⃣ Criar arquivo
      const fileUri =
        FileSystem.documentDirectory +
        `formulario_${idFormulario}.csv`;

      await FileSystem.writeAsStringAsync(fileUri, csv);

      // 6️⃣ Abrir compartilhamento
      await Sharing.shareAsync(fileUri);

    } catch (error) {
      console.error("Erro ao exportar CSV:", error);
      Alert.alert("Erro", "Falha ao exportar o CSV.");
    }
  };

  return (
    <View style={{ flex: 1 }}>
      <ScrollView style={{ padding: 20 }}
              contentContainerStyle={{ paddingBottom: 100 }} // 👈 folga no final do scroll
>
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
                      title: "📤 Exportar Dados (CSV)",
                      onPress: () => exportarCSV(f.id),
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
