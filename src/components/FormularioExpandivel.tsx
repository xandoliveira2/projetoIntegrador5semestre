import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  FlatList,
  LayoutAnimation,
  Platform,
  UIManager,
} from "react-native";
import FormularioTitulo from "./FormularioTitulo";

// 🔹 Habilita animações no Android
if (Platform.OS === "android" && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

interface Usuario {
  id: number;
  nome: string;
  respondido: boolean;
}

interface Props {
  titulo: string;
  respondidos: number;
  total: number;
  usuarios?: Usuario[];
  children?: React.ReactNode; // ex: botão de engrenagem
}

const FormularioExpandivel = ({
  titulo,
  respondidos,
  total,
  usuarios = [],
  children,
}: Props) => {
  const [aberto, setAberto] = useState(false);

  const alternar = () => {
    // 🔹 Anima suavemente a expansão/retração
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setAberto(!aberto);
  };

  return (
    <View style={styles.card}>
      {/* 🔹 Cabeçalho */}
      <FormularioTitulo titulo={titulo}>{children}</FormularioTitulo>

      {/* 🔹 Linha de respondidos + seta (agora clicável) */}
      <TouchableOpacity style={styles.respondidosContainer} onPress={alternar}>
        <View style={styles.respondidosRow}>
          <Text style={styles.iconeUsuario}>👥</Text>
          <Text style={styles.respondidosTexto}>
            Respondidos: {respondidos}/{total}
          </Text>
        </View>

        <View>
          <Text style={styles.seta}>{aberto ? "▲" : "▼"}</Text>
        </View>
      </TouchableOpacity>

      {/* 🔹 Lista de usuários (aparece só se aberto) */}
      {aberto && (
        <FlatList
          data={usuarios}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <View style={styles.usuarioItem}>
              <View style={styles.usuarioInfo}>
                <View style={styles.avatar} />
                <Text style={styles.usuarioNome}>{item.nome}</Text>
              </View>

              <View
                style={[
                  styles.status,
                  {
                    backgroundColor: item.respondido
                      ? "limegreen"
                      : "transparent",
                    borderWidth: item.respondido ? 0 : 1,
                    borderColor: "#444",
                  },
                ]}
              />
            </View>
          )}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    borderRadius: 8,
    marginVertical: 8,
    overflow: "hidden",
    elevation: 6,
  },
  respondidosContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderTopWidth: 1,
    borderColor: "#ccc",
  },
  respondidosRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  iconeUsuario: {
    fontSize: 18,
    marginRight: 6,
  },
  respondidosTexto: {
    fontSize: 14,
  },
  seta: {
    fontSize: 20,
  },
  usuarioItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderTopWidth: 1,
    borderColor: "#ddd",
  },
  usuarioInfo: {
    flexDirection: "row",
    alignItems: "center",
  },
  avatar: {
    width: 25,
    height: 25,
    borderRadius: 50,
    backgroundColor: "#ccc",
    marginRight: 10,
  },
  usuarioNome: {
    fontSize: 15,
    fontWeight: "500",
  },
  status: {
    width: 20,
    height: 20,
    borderRadius: 10,
  },
});

export default FormularioExpandivel;