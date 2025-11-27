import OptionsMenu from "@/components/OptionsMenu"; // ✅ IMPORT
import { Stack, useRouter } from "expo-router";
import React, { useState } from "react";
import { Image, Modal, Text, TouchableOpacity, View } from "react-native";
export default function Layout() {
  const router = useRouter();

  const [menuVisible, setMenuVisible] = useState(false);

  // 🔥 Estado do modal "Salvar"
  const [showSalvarModal, setShowSalvarModal] = useState(false);

  return (
    <>
      <Stack
        screenOptions={{
          headerShown: true,
          header: () => (
            <View
              style={{
                height: 60,
                backgroundColor: "#fff",
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
                paddingHorizontal: 15,
              }}
            >
              {/* BOTÃO VOLTAR */}
              <TouchableOpacity
                onPress={() => router.back()}
                style={{
                  borderWidth: 1.5,
                  borderColor: "#ccc",
                  borderRadius: 50,
                  width: 40,
                  height: 40,
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Image
                  source={require("@/../assets/icons/seta_esquerda.png")}
                  style={{ width: 20, height: 20 }}
                  resizeMode="contain"
                />
              </TouchableOpacity>

              {/* MENU DE TRÊS PONTOS */}
              <OptionsMenu
                visible={menuVisible}
                onOpen={() => setMenuVisible(true)}
                onClose={() => setMenuVisible(false)}
                icon={
                  <TouchableOpacity
                    style={{
                      borderWidth: 1.5,
                      borderColor: "#ccc",
                      borderRadius: 50,
                      width: 40,
                      height: 40,
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <Image
                      source={require("@/../assets/icons/menu_tres_pontos.png")}
                      style={{ width: 20, height: 20 }}
                      resizeMode="contain"
                    />
                  </TouchableOpacity>
                }
                options={[
                  {
                    title: "💾 Salvar",
                    onPress: () => {
                      setMenuVisible(false);
                      setShowSalvarModal(true); // 🔥 Abre modal de confirmação
                    },
                  },
                ]}
              />
            </View>
          ),
        }}
      />

      {/* 🔥 MODAL DE CONFIRMAÇÃO */}
      <Modal
        transparent
        visible={showSalvarModal}
        animationType="fade"
        onRequestClose={() => setShowSalvarModal(false)}
      >
        <View
          style={{
            flex: 1,
            backgroundColor: "rgba(0,0,0,0.5)",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <View
            style={{
              backgroundColor: "#fff",
              borderRadius: 12,
              padding: 20,
              width: "80%",
              alignItems: "center",
            }}
          >
            <Text
              style={{
                fontSize: 18,
                fontWeight: "600",
                textAlign: "center",
                marginBottom: 20,
              }}
            >
              Tem certeza que deseja salvar{"\n"}e lançar esse formulário?
            </Text>

            <View
              style={{
                flexDirection: "row",
                width: "100%",
                justifyContent: "space-between",
                marginTop: 10,
              }}
            >
              {/* CONFIRMAR */}
              <TouchableOpacity
                onPress={() => {
                  setShowSalvarModal(false);
                  alert("Formulário salvo e lançado!"); // 🔥 Aqui você coloca sua ação real
                }}
                style={{
                  backgroundColor: "#4CAF50",
                  paddingVertical: 10,
                  paddingHorizontal: 25,
                  borderRadius: 6,
                }}
              >
                <Text style={{ color: "#fff", fontWeight: "bold" }}>
                  Confirmar
                </Text>
              </TouchableOpacity>

              {/* CANCELAR */}
              <TouchableOpacity
                onPress={() => setShowSalvarModal(false)}
                style={{
                  backgroundColor: "#ccc",
                  paddingVertical: 10,
                  paddingHorizontal: 25,
                  borderRadius: 6,
                }}
              >
                <Text style={{ color: "#333", fontWeight: "bold" }}>
                  Cancelar
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </>
  );
}
