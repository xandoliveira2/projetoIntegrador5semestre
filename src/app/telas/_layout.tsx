import { Stack, useRouter } from "expo-router";
import { useState } from "react";
import {
  Image,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function Layout() {
  return (
    <Stack
      screenOptions={{
        header: () => <CustomNavbar />,
      }}
    >
      {/* 🔥 AQUI ESTÁ O QUE VOCÊ QUERIA ADICIONAR */}
      <Stack.Screen
        name="responderFormulario"
        options={{ headerShown: false }}
      />
    </Stack>
  );
}

function CustomNavbar() {
  const router = useRouter();
  const [modalVisible, setModalVisible] = useState(false);

  function confirmLogout() {
    setModalVisible(false);
    router.replace("/"); // voltar pra login
  }

  return (
    <View style={styles.navbar}>
      <Text style={styles.title}> </Text>

      <TouchableOpacity
        style={styles.exitButton}
        onPress={() => setModalVisible(true)}
      >
        <Image
          source={require("@/../assets/icons/logout.png")}
          style={styles.exitIcon}
          resizeMode="contain"
        />
      </TouchableOpacity>

      <Modal animationType="fade" transparent visible={modalVisible}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalBox}>
            <Text style={styles.modalTitle}>Confirmar Logout</Text>
            <Text style={styles.modalMessage}>
              Tem certeza que deseja sair da conta?
            </Text>

            <View style={styles.modalButtons}>
              <Pressable
                style={[styles.button, styles.cancelButton]}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.buttonText}>Cancelar</Text>
              </Pressable>

              <Pressable
                style={[styles.button, styles.confirmButton]}
                onPress={confirmLogout}
              >
                <Text style={styles.buttonText}>Confirmar</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  navbar: {
    backgroundColor: "white",
    height: 100,
    justifyContent: "center",
    paddingHorizontal: 15,
  },

  title: {
    fontSize: 20,
    fontWeight: "bold",
  },

  exitButton: {
    position: "absolute",
    right: 15,
    top: 50,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "white",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 6,
  },

  exitIcon: {
    width: 22,
    height: 22,
  },

  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
    alignItems: "center",
  },

  modalBox: {
    width: "80%",
    backgroundColor: "white",
    padding: 20,
    borderRadius: 12,
    elevation: 10,
  },

  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
  },

  modalMessage: {
    fontSize: 16,
    textAlign: "center",
    marginBottom: 20,
  },

  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
  },

  button: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    marginHorizontal: 5,
    alignItems: "center",
  },

  cancelButton: {
    backgroundColor: "#ccc",
  },

  confirmButton: {
    backgroundColor: "#d9534f",
  },

  buttonText: {
    color: "white",
    fontWeight: "bold",
  },
});
