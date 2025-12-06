import { useAuth } from "@/context/AuthContext";
import { db } from "@/firebase/firebaseConfig";
import { useRouter } from 'expo-router';
import { collection, getDocs, query, where } from "firebase/firestore";
import React, { useState } from 'react';
import { Alert, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

export default function Login() {
  const { setUser } = useAuth();
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    try {
      // 1️⃣ Buscar usuário pelo campo "usuario"
      const q = query(
        collection(db, "user"),
        where("usuario", "==", username)
      );

      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) {
        Alert.alert("Erro", "Usuário não encontrado!");
        return;
      }

      // Firestore pode retornar mais de 1, mas pegamos só o primeiro
      const userDoc = querySnapshot.docs[0];
      const userData = userDoc.data();

      // 2️⃣ Verificar senha
      if (password !== userData.senha) {
        Alert.alert("Erro", "Senha incorreta!");
        return;
      }

      // 3️⃣ Checar se é administrador
      const isAdmin = userData.administrador === true;

      if (isAdmin) {
        Alert.alert("Sucesso", `Bem-vindo administrador ${username}!`);
        setUser({ username, admin: true });
        router.push("./telas/admin/ativo");
      } else {
        Alert.alert("Sucesso", `Bem-vindo ${username}!`);
        setUser({ username, admin: false });
        router.push("./telas/user");
      }

    } catch (error) {
      console.error(error);
      Alert.alert("Erro", "Ocorreu um erro ao fazer login.");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login</Text>
      <TextInput
        style={styles.input}
        placeholder="Usuário"
        value={username}
        onChangeText={setUsername}
        autoCapitalize="none"
      />
      <TextInput
        style={styles.input}
        placeholder="Senha"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />
      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Entrar</Text>
      </TouchableOpacity>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff'
  },
  title: {
    fontSize: 30,
    marginBottom: 20
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    width: '80%',
    padding: 10,
    marginVertical: 8,
    fontSize:20,
  },
  button: {
    backgroundColor: 'orange',
    padding: 12,
    borderRadius: 8,
    marginTop: 10,
    width: '80%'
  },
  buttonText: {
    color: '#fff',
    fontSize: 26,
    textAlign: 'center',
    fontWeight:'bold'
  },
});
