import React from "react";
import { Image, StyleSheet, Text, View } from "react-native";

interface Props {
  nome: string;
  imagem?: string;
  children?: React.ReactNode;
}

const Usuario = ({ nome, imagem, children }: Props) => {
  return (
    <View style={styles.container}>
      <View style={styles.infoContainer}>
        <Image
          source={
            imagem
              ? { uri: imagem }
              : require("@/../assets/icons/user.png") // imagem padrão
          }
          style={styles.avatar}
        />
        <Text
          style={styles.nome}
          numberOfLines={1}
          ellipsizeMode="tail"
        >
          {nome}
        </Text>
      </View>

      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    marginVertical: 8,
    minHeight: 55,
    maxHeight: 55,
    backgroundColor: "#dfdfdfff",
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "space-between",
    maxWidth: "100%",
    overflow: "hidden",

    // iOS sombra
    shadowColor: "#444444ff",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,

    // Android sombra
    elevation: 8,
  },
  infoContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  avatar: {
    width: 38,
    height: 38,
    borderRadius: 50,
    marginLeft: 10,
  },
  nome: {
    fontSize: 16,
    fontWeight: "bold",
    marginLeft: 10,
  },
});

export default Usuario;