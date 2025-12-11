import { useEffect, useState } from "react";
import {
  Alert,
  ScrollView,
  Text,
  View
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
  onSnapshot,
  orderBy,
  query,
  where,
} from "firebase/firestore";

import * as FileSystem from "expo-file-system/legacy";
import * as Sharing from "expo-sharing";

import { PieChart } from "react-native-chart-kit";

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
const [larguraModal, setLarguraModal] = useState(0);
  const [dadosGrafico, setDadosGrafico] = useState<any[]>([]);
  const [tituloGrafico, setTituloGrafico] = useState("");
  const [legendaCustom, setLegendaCustom] = useState<
    { texto: string; cor: string }[]
  >([]);

  // ✅ TEMPO REAL DOS FINALIZADOS
  useEffect(() => {
    const q = query(
      collection(db, "formularios"),
      where("status", "==", false)
    );

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
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
    });

    return () => unsubscribe();
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

  // ✅ ABRIR SELEÇÃO
  const abrirSelecaoPergunta = async (idFormulario: string) => {
    setFormularioSelecionado(idFormulario);
    setDadosGrafico([]);
    setLegendaCustom([]);

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
  };

  // ✅ GERAR GRÁFICO
  const gerarDadosGrafico = async (idPergunta: string) => {
    const q = query(
      collection(db, "usuario_formularios_respondidos"),
      where("id_formulario", "==", formularioSelecionado),
      where("id_pergunta", "==", idPergunta)
    );

    const snapshot = await getDocs(q);

    const contagem: Record<string, number> = {};
    let total = 0;

    snapshot.forEach((doc) => {
      const { respostas } = doc.data();
      contagem[respostas] = (contagem[respostas] || 0) + 1;
      total++;
    });

    const cores = ["#2563EB", "#16A34A", "#E11D48", "#CA8A04", "#9333EA"];
    const pizzaData: any[] = [];
    const legenda: { texto: string; cor: string }[] = [];

    Object.entries(contagem).forEach(([resposta, valor], index) => {
      const porcentagem = ((valor / total) * 100).toFixed(0);
      const cor = cores[index % cores.length];

      pizzaData.push({
        name: resposta,
        population: valor,
        color: cor,
      });

      legenda.push({
        texto: `${resposta} ( ${valor}, ${porcentagem}% )`,
        cor,
      });
    });

    setTituloGrafico(
      perguntasMultipla.find((p) => p.id === idPergunta)?.texto || "Gráfico"
    );
    setDadosGrafico(pizzaData);
    setLegendaCustom(legenda);
  };

  return (
    <View style={{ flex: 1 }}>
      <ScrollView style={{ padding: 20 }} contentContainerStyle={{ paddingBottom: 100 }}>
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

     {/* ✅ MODAL GRÁFICO */}
{modalGrafico && (
  <View
    style={{
      position: "absolute",
      inset: 0,
      backgroundColor: "rgba(0,0,0,0.6)",
      justifyContent: "center",
      alignItems: "center",
      padding: 20,
    }}
  >
<View
  onLayout={(e) => {
    const largura = e.nativeEvent.layout.width;
    setLarguraModal(largura);
  }}
  style={{
    backgroundColor: "white",
    borderRadius: 10,
    padding: 20,
    width: "100%",
    maxHeight: "90%",
    alignItems: "center",
  }}
>
      {!dadosGrafico.length ? (
        <>
          <Text
            style={{
              fontSize: 18,
              fontWeight: "bold",
              marginBottom: 10,
              textAlign: "center",
            }}
          >
            Selecione uma pergunta:
          </Text>

          <ScrollView
            style={{ width: "100%" }}
            contentContainerStyle={{ paddingBottom: 12 }}
          >
            {perguntasMultipla.map((p) => (
              <FormButton style={{marginBottom:10}} key={p.id} text={p.texto} onPress={() => gerarDadosGrafico(p.id)} />
            ))}
          </ScrollView>

          <FormButton text="Cancelar" onPress={() => setModalGrafico(false)} />
        </>
      ) : (
        <>
          <Text
            style={{
              fontSize: 18,
              fontWeight: "bold",
              marginBottom: 10,
              textAlign: "center",
            }}
          >
            {tituloGrafico}
          </Text>



{dadosGrafico.length > 0 && (
  <View
    style={{
      width: "100%",
      alignItems: "center",
      justifyContent: "center",
      marginVertical: 10,
      marginLeft : 20
    }}
  >
<PieChart
  data={dadosGrafico}
  width={Math.min(larguraModal, 300)}  // largura do gráfico
  height={Math.min(larguraModal, 300)} // altura do gráfico
  chartConfig={{
    backgroundGradientFrom: "#fff",
    backgroundGradientTo: "#fff",
    color: () => "#000",
  }}
  accessor="population"
  backgroundColor="transparent"
  hasLegend={false}
  paddingLeft={'65'} // metade da largura do gráfico
/>
  </View>
)}




          {/* Legenda rolável — não limita a altura do modal, apenas rola quando necessário */}
          <ScrollView
            style={{ width: "100%", maxHeight: 180, marginTop: 15 }}
            contentContainerStyle={{ alignItems: "center", paddingBottom: 8 }}
          >
            {legendaCustom.map((item, index) => (
              <View
                key={index}
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "center",
                  marginBottom: 10,
                }}
              >
                <View
                  style={{
                    width: 12,
                    height: 12,
                    borderRadius: 6,
                    backgroundColor: item.cor,
                    marginRight: 8,
                  }}
                />
                <Text style={{ fontSize: 14, textAlign: "center" }}>{item.texto}</Text>
              </View>
            ))}
          </ScrollView>

          <FormButton
            text="Fechar"
            onPress={() => {
              setModalGrafico(false);
              setDadosGrafico([]);
              setLegendaCustom([]);
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
