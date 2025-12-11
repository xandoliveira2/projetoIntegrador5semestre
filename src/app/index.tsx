import { useAuth } from "@/context/AuthContext";
import { db } from "@/firebase/firebaseConfig";
import { useRouter } from 'expo-router';
import { collection, getDocs, query, where } from "firebase/firestore";
import React, { useEffect, useRef, useState } from 'react';
import {
  Alert, Image,
  Keyboard,
  KeyboardAvoidingView,
  SafeAreaView,
  ScrollView,
  StyleSheet, Text, TextInput,
  TouchableOpacity
} from 'react-native';

export default function Login() {
  const { setUser } = useAuth();
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const scrollRef = useRef<ScrollView | null>(null);

  useEffect(() => {
    const hide = Keyboard.addListener("keyboardDidHide", () => {
      scrollRef.current?.scrollTo({ y: 0, animated: true });
    });

    return () => hide.remove();
  }, []);

  const handleLogin = async () => {
    try {
      const q = query(
        collection(db, "user"),
        where("usuario", "==", username)
      );

      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) {
        Alert.alert("Erro", "Usuário não encontrado!");
        return;
      }

      const userDoc = querySnapshot.docs[0];
      const userData = userDoc.data();

      if (password !== userData.senha) {
        Alert.alert("Erro", "Senha incorreta!");
        return;
      }

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
    <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior="padding"    // 🟢 evita a barra cinza
      >
        <ScrollView
          ref={scrollRef}
          contentContainerStyle={styles.container}
          keyboardShouldPersistTaps="handled"
        >
          <Image 
            source={require('@/../assets/images/logo.png')}
            style={{ width: 270, height: 270, marginBottom: 70 }}
          />

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
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
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
    fontSize: 20,
  },
  button: {
    backgroundColor: 'orange',
    padding: 12,
    borderRadius: 8,
    marginTop: 20,
    width: '80%',
    marginBottom: 60
  },
  buttonText: {
    color: '#fff',
    fontSize: 26,
    textAlign: 'center',
    fontWeight: 'bold'
  },
});
