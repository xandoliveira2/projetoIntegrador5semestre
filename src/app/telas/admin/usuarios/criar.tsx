import React, { useState } from "react";
import {
  Alert,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import Date from "@/components/Date";
import EmptyListMessage from "@/components/EmptyListMessage";
import FormButton from "@/components/FormButton";
import Usuario from "@/components/Usuario"; // ✅ agora suporta children
import OptionsMenu from "@/components/OptionsMenu"; // ✅ menu como filho
import ModalNovoUsuario from "@/components/ModalNovoUsuario"; // ✅ novo modal baseado na imagem

import { styles } from "@/styles/IconButtonStyle";

export default function CriarUsuario() {
  const [usuarios, setUsuarios] = useState([
    { id: 1, nome: "Gabriel Alves", imagem: undefined },
    { id: 2, nome: "Ana Souza", imagem: undefined },
    { id: 3, nome: "Lucas Pereira", imagem: undefined },
  ]);

  const [modalVisible, setModalVisible] = useState(false);
  const [menuAbertoId, setMenuAbertoId] = useState<number | null>(null);

  // ✅ Abrir modal novo usuário
  const handleNovoUsuario = () => {
    setModalVisible(true);
  };

  // ✅ Receber dados do novo usuário
  const handleSalvarUsuario = (novoUsuario: any) => {
    setUsuarios((prev) => [
      ...prev,
      {
        id: prev.length + 1,
        nome: novoUsuario.nome,
        imagem: undefined,
      },
    ]);
    setModalVisible(false);
  };

  // ✅ Excluir usuário
  const handleExcluir = (nome: string) => {
    Alert.alert("Excluir Usuário", `Deseja excluir ${nome}?`, [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Excluir",
        style: "destructive",
        onPress: () =>
          setUsuarios((prev) => prev.filter((u) => u.nome !== nome)),
      },
    ]);
  };

  return (
    <View style={{ flex: 1, backgroundColor: "#f5f5f5" }}>
      
      
        {/* Botão para adicionar novo usuário */}
        <FormButton
          text="Adicionar Usuário"
        /*  icon={require("@/../assets/icons/add_branco.png")}*/
          iconSize={24}
          style={{
          maxWidth: "60%",
          minWidth: "60%",
          alignSelf: "center",
         marginTop: 35,
         marginBottom:60,
         
          paddingVertical: 8,
        }}
        textSize={20}
          onPress={handleNovoUsuario}
        />
              <Text
        style={{
          alignSelf: "center",
          marginTop: 65,
          fontSize: 22,
          fontWeight: "bold",
        }}
      >
        Usuários cadastrados
      </Text>

      <ScrollView
        contentContainerStyle={{
          paddingHorizontal: 20,
          paddingTop: 10,
          paddingBottom: 120,
        }}
      >

        {/* Lista de usuários */}
        {usuarios.length === 0 ? (
          <EmptyListMessage text="Nenhum usuário cadastrado." />
        ) : (
          usuarios.map((u) => (
            <View key={u.id} style={[u.id !== 1 ? { marginTop: 15 } : undefined]}>
              <Usuario nome={u.nome} imagem={u.imagem}>
                {/* ✅ OptionsMenu agora é filho de Usuario */}
                <OptionsMenu
                  visible={menuAbertoId === u.id}
                  onOpen={() => setMenuAbertoId(u.id)}
                  onClose={() => setMenuAbertoId(null)}
                  icon={
                    <FormButton
                      style={styles.container}
                      icon={require("@/../assets/icons/engrenagem_branco.png")}
                      iconSize={29}
                      onPress={() => {}}
                    />
                  }
                  options={[
                    { title: "✏️ Editar", onPress: () => Alert.alert("Editar", u.nome) },
                    { title: "🗑️ Excluir", onPress: () => handleExcluir(u.nome) },
                  ]}
                />
              </Usuario>
            </View>
          ))
        )}
      </ScrollView>

      {/* ✅ Modal de novo usuário (baseado na imagem) */}
      <ModalNovoUsuario
        isVisible={modalVisible}
        onClose={() => setModalVisible(false)}
        onConfirm={handleSalvarUsuario}
      />
    </View>
  );
}