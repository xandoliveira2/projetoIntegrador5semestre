import { useEffect, useState } from "react";
import {
  Alert,
  ScrollView,
  View,
  Text,
  Dimensions,
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

import * as FileSystem from "expo-file-system/legacy";
import * as Sharing from "expo-sharing";

import { BarChart } from "react-native-chart-kit";

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
  const [menuAbertoId, setMenuAbertoId] = useState("");
  const [formularios, setFormularios] = useState<FormularioType[]>([]);

  const [modalGrafico, setModalGrafico] = useState(false);
  const [perguntasMultipla, setPerguntasMultipla] = useState<PerguntaType[]>([]);
  const [formularioSelecionado, setFormularioSelecionado] = useState("");

  const [dadosGrafico, setDadosGrafico] = useState<any>(null);
  const [tituloGrafico, setTituloGrafico] = useState("");

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

  // ✅ EXPORTAR CSV
  const exportarCSV = async (idFormulario: string) => {
    try {
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

      const usuarios: Record<string, Record<string, string>> = {};

      respostas.forEach((res) => {
        if (!usuarios[res.usuario]) {
          usuarios[res.usuario] = {};
        }
        usuarios[res.usuario][res.id_pergunta] = res.respostas;
      });

      let csv = "Usuário;" + perguntas.map((p) => p.texto).join(";") + "\n";

      Object.entries(usuarios).forEach(([usuario, respostasUsuario]) => {
        const linha = [
          usuario,
          ...perguntas.map((p) => respostasUsuario[p.id] || "Sem resposta"),
        ].join(";");

        csv += linha + "\n";
      });

      const fileUri =
        FileSystem.documentDirectory + `formulario_${idFormulario}.csv`;

      await FileSystem.writeAsStringAsync(fileUri, csv);
      await Sharing.shareAsync(fileUri);
    } catch (error) {
      console.error("Erro ao exportar CSV:", error);
      Alert.alert("Erro", "Falha ao exportar o CSV.");
    }
  };

  // ✅ ABRIR SELEÇÃO DE PERGUNTAS MULTIPLA
  const abrirSelecaoPergunta = async (idFormulario: string) => {
    try {
      setFormularioSelecionado(idFormulario);
      setDadosGrafico(null);

      const q = query(
        collection(db, "formularios_pergunta"),
        where("formulario_pai", "==", idFormulario),
        where("tipo_pergunta", "==", "multipla"),
        orderBy("ordem")
      );

      const snapshot = await getDocs(q);
      const lista: PerguntaType[] = [];

      snapshot.forEach((doc) => {
        const data = doc.data();
        lista.push({
          id: doc.id,
          texto: data.pergunta,
        });
      });

      if (lista.length === 0) {
        Alert.alert("Aviso", "Esse formulário não possui perguntas múltiplas.");
        return;
      }

      setPerguntasMultipla(lista);
      setModalGrafico(true);
    } catch (error) {
      console.error("Erro ao buscar perguntas:", error);
    }
  };

  // ✅ GERAR DADOS DO GRÁFICO
  const gerarDadosGrafico = async (idPergunta: string) => {
    try {
      const q = query(
        collection(db, "usuario_formularios_respondidos"),
        where("id_formulario", "==", formularioSelecionado),
        where("id_pergunta", "==", idPergunta)
      );

      const snapshot = await getDocs(q);
      const contagem: Record<string, number> = {};

      snapshot.forEach((doc) => {
        const { respostas } = doc.data();
        contagem[respostas] = (contagem[respostas] || 0) + 1;
      });

      const labels = Object.keys(contagem);
      const valores = Object.values(contagem);

      setTituloGrafico(
        perguntasMultipla.find((p) => p.id === idPergunta)?.texto || "Gráfico"
      );

      setDadosGrafico({
        labels,
        datasets: [{ data: valores }],
      });
    } catch (error) {
      console.error("Erro ao gerar gráfico:", error);
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
                    {
                      title: "📊 Gerar Gráfico",
                      onPress: () => abrirSelecaoPergunta(f.id),
                    },
                  ]}
                />
              </Formulario>
            </View>
          ))
        )}
      </ScrollView>

      {/* ✅ MODAL DO GRÁFICO */}
      {modalGrafico && (
        <View
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0,0,0,0.6)",
            justifyContent: "center",
            padding: 20,
          }}
        >
          <View
            style={{
              backgroundColor: "white",
              borderRadius: 10,
              padding: 20,
            }}
          >
            {!dadosGrafico ? (
              <>
                <Text style={{ fontSize: 18, fontWeight: "bold", marginBottom: 10 }}>
                  Selecione uma pergunta:
                </Text>

                {perguntasMultipla.map((p) => (
                  <FormButton
                    key={p.id}
                    text={p.texto}
                    onPress={() => gerarDadosGrafico(p.id)}
                  />
                ))}

                <FormButton text="Cancelar" onPress={() => setModalGrafico(false)} />
              </>
            ) : (
              <>
                <Text style={{ fontSize: 18, fontWeight: "bold", marginBottom: 10 }}>
                  {tituloGrafico}
                </Text>

<BarChart
  data={dadosGrafico}
  width={Dimensions.get("window").width - 60}
  height={280}
  yAxisLabel=""
  fromZero
  showValuesOnTopOfBars
  withInnerLines={false}
  segments={Math.max(...dadosGrafico.datasets[0].data)} // 👈 força escala inteira
  chartConfig={{
    backgroundGradientFrom: "#ffffff",
    backgroundGradientTo: "#ffffff",
    decimalPlaces: 0, // 👈 REMOVE CASAS DECIMAIS
    barPercentage: 0.6,

    color: () => "#2563EB",
    labelColor: () => "#333",

    propsForBackgroundLines: {
      strokeWidth: 0,
    },
    propsForLabels: {
      fontSize: 12,
    },
  }}
  style={{
    borderRadius: 16,
    marginVertical: 10,
  }}
/>
                <FormButton
                  text="Fechar"
                  onPress={() => {
                    setModalGrafico(false);
                    setDadosGrafico(null);
                  }}
                />
              </>
            )}
          </View>
        </View>
      )}
    </View>
  );
}
