import { db } from "@/firebase/firebaseConfig";
import { useRouter } from 'expo-router';
import { doc, getDoc } from "firebase/firestore";
import React, { useState } from 'react';
import { Alert, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

export default function Login() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    try {
      // 1️⃣ Buscar o documento do usuário no Firestore usando o login
     
      const userRef = doc(db, "user", username);
      const userSnap = await getDoc(userRef);
      

      if (!userSnap.exists()) {
        Alert.alert("Erro", "Usuário não encontrado!");
        return;
      }
       
      const userData = userSnap.data();
      const senhaCorreta = userData.senha;
      const isAdmin = userData.administrador || false;

      // 2️⃣ Verificar se a senha digitada é correta
      if (password !== senhaCorreta) {
        Alert.alert("Erro", "Senha incorreta!");
        return;
      }

      // 3️⃣ Redirecionar de acordo com o tipo do usuário
      if (isAdmin) {
        Alert.alert("Sucesso", `Bem-vindo administrador ${username}!`);
        router.push("/telas/admin/ativo");
      } else {
        Alert.alert("Sucesso", `Bem-vindo, ${username}!`);
        router.push("./telas/user");
      }

    } catch (error) {
      console.error(error);
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
        value={password}
        secureTextEntry
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
    fontSize: 24,
    marginBottom: 20
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    width: '80%',
    padding: 10,
    marginVertical: 8,
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
    fontSize: 16,
    textAlign: 'center'
  },
});
