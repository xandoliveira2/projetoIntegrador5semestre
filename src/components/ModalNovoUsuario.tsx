import React, { useState } from "react";
import {
  Alert,
  Dimensions,
  Modal,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

const { width } = Dimensions.get("window");

// Props
interface ModalNovoUsuarioProps {
  isVisible: boolean;
  onClose: () => void;
  onContinue: (data: FormData) => void;
}

// Dados do formulário
interface FormData {
  nome: string;
  login: string;
  senha: string;
  confirmarSenha: string;
}

const ModalNovoUsuario: React.FC<ModalNovoUsuarioProps> = ({
  isVisible,
  onClose,
  onContinue,
}) => {
  if (!isVisible) return null;

  const [nome, setNome] = useState("");
  const [login, setLogin] = useState("");
  const [senha, setSenha] = useState("");
  const [confirmarSenha, setConfirmarSenha] = useState("");

  const handleConfirmar = () => {
    if (!nome || !login || !senha || !confirmarSenha) {
      Alert.alert("Atenção", "Preencha todos os campos.");
      return;
    }
    if (senha !== confirmarSenha) {
      Alert.alert("Erro", "As senhas não coincidem.");
      return;
    }

    const formData: FormData = { nome, login, senha, confirmarSenha };
    onContinue(formData);
  };

  return (
    <Modal transparent animationType="fade" visible={isVisible}>
      <View style={styles.overlay}>
        <View style={styles.modalContainer}>
          <Text style={styles.title}>Adicionar Usuário</Text>

          <View style={styles.form}>
            <Text style={styles.label}>Nome</Text>
            <TextInput
              style={styles.input}
              placeholder=""
              value={nome}
              onChangeText={setNome}
            />

            <Text style={styles.label}>Login</Text>
            <TextInput
              style={styles.input}
              placeholder=""
              value={login}
              onChangeText={setLogin}
              autoCapitalize="none"
            />

            <Text style={styles.label}>Senha</Text>
            <TextInput
              style={styles.input}
              placeholder=""
              secureTextEntry
              value={senha}
              onChangeText={setSenha}
            />

            <Text style={styles.label}>Confirmar Senha</Text>
            <TextInput
              style={styles.input}
              placeholder=""
              secureTextEntry
              value={confirmarSenha}
              onChangeText={setConfirmarSenha}
            />

            <View style={styles.buttonRow}>
              <TouchableOpacity
                style={[styles.button, { backgroundColor: "#ff6b6b" }]}
                onPress={onClose}
              >
                <Text style={styles.buttonText}>Cancelar</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.button, { backgroundColor: "#4d90fe" }]}
                onPress={handleConfirmar}
              >
                <Text style={styles.buttonText}>Confirmar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    </Modal>
  );
};

// --- ESTILOS ---
const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    width: width * 0.9,
    maxWidth: 400,
    backgroundColor: "#fff",
    borderRadius: 10,
    paddingVertical: 25,
    paddingHorizontal: 20,
    elevation: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 5,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 10,
  },
  form: {
    marginTop: 5,
  },
  label: {
    fontSize: 15,
    fontWeight: "600",
    marginTop: 10,
    color: "#333",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 6,
    height: 40,
    paddingHorizontal: 10,
    marginTop: 5,
    backgroundColor: "#fff",
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 25,
  },
  button: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 6,
    marginHorizontal: 5,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default ModalNovoUsuario;
