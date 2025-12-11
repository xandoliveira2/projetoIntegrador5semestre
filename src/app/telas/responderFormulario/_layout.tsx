import { FontSizeProvider } from "@/components/FontSizeProvider";
import { Stack } from "expo-router";

export default function Layout() {
  return (
    <FontSizeProvider>
      <Stack
        screenOptions={{
          header: () => <CustomNavbar />,
        }}
      />
    </FontSizeProvider>
  );
}

import { useRouter } from "expo-router";
import { useState } from "react";
import {
  Image,
  StyleSheet,
  TouchableOpacity,
  View
} from "react-native";

function CustomNavbar() {
  const router = useRouter();
  const [modalVisible, setModalVisible] = useState(false);

  function confirmLogout() {
    setModalVisible(false);
    router.replace("/");
  }

  return (
    <View style={styles.navbarContainer}>
      <TouchableOpacity
        onPress={() => router.back()}
        style={styles.backButton}
      >
        <Image
          source={require("@/../assets/icons/seta_esquerda.png")}
          style={{ width: 40, height: 40 }}
          resizeMode="contain"
        />
      </TouchableOpacity>
{/* 
      <View style={styles.navbar}>
        <Text style={styles.title}></Text>

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
      </View>

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
      </Modal> */}
    </View>
  );
}

const styles = StyleSheet.create({
  navbarContainer: {
    height: 0,
    backgroundColor: "white",
    justifyContent: "center",
  },
  navbar: {
    height: 100,
    justifyContent: "center",
    paddingHorizontal: 50,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
  backButton: {
    position: "absolute",
    top: 50,
    left: 10,
    zIndex: 99999,
    elevation: 50,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "white",
    borderWidth: 1.5,
    borderColor: "#ccc",
    justifyContent: "center",
    alignItems: "center",
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
