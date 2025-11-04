import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useRouter } from 'expo-router';

export default function Login() {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  function handleLogin() {
    if (username === 'admin' && password === '123') {
      router.push('./telas/admin');
    } else if (username === 'user' && password === '123') {
      router.push('./telas/user');
    } else {
      Alert.alert('Erro', 'Usuário ou senha incorretos');
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login</Text>
      <TextInput
        style={styles.input}
        placeholder="Usuário"
        value={username}
        onChangeText={setUsername}
        autoCapitalize='none'
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
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff' },
  title: { fontSize: 24, marginBottom: 20 },
  input: {
    borderWidth: 1, borderColor: '#ccc', borderRadius: 8,
    width: '80%', padding: 10, marginVertical: 8,
  },
  button: { backgroundColor: 'orange', padding: 12, borderRadius: 8, marginTop: 10, width: '80%' },
  buttonText: { color: '#fff', fontSize: 16, textAlign: 'center' },
});
