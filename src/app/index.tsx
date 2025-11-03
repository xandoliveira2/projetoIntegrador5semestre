import { useRouter } from 'expo-router';
import { useState } from 'react';
import {
  Alert,
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function LoginScreen() {
  const [usuario, setUsuario] = useState('');
  const [senha, setSenha] = useState('');
  const router = useRouter();

  const handleLogin = () => {
    if (usuario === 'admin' && senha === 'admin') {
      Alert.alert('Bem-vindo', 'Login como ADMIN realizado!');
      router.push('./screens/user/paraResponder'); // Navega para tela admin
    } else if (usuario === 'usuario' && senha === '1234') {
      Alert.alert('Bem-vindo', 'Login como USUÁRIO padrão realizado!');
      router.push('./screens/user/paraResponder'); // Navega para tela user
    } else {
      Alert.alert('Erro', 'Usuário ou senha incorretos.');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.card}>
        <Image
          source={{ uri: 'https://via.placeholder.com/90' }}
          style={styles.logo}
          resizeMode="contain"
        />
        <Text style={styles.title}>Bem-vindo de volta</Text>
        <Text style={styles.subtitle}>Faça login na sua conta</Text>

        <View style={styles.inputGroup}>
          <TextInput
            placeholder="Usuário"
            placeholderTextColor="#8b8b8b"
            style={styles.input}
            value={usuario}
            onChangeText={setUsuario}
          />
          <TextInput
            placeholder="Senha"
            placeholderTextColor="#8b8b8b"
            style={styles.input}
            secureTextEntry
            value={senha}
            onChangeText={setSenha}
          />
        </View>

        <TouchableOpacity style={styles.button} onPress={handleLogin}>
          <Text style={styles.buttonText}>Entrar</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0f172a', justifyContent: 'center', padding: 20 },
  card: { backgroundColor: '#0b1220', borderRadius: 18, padding: 24 },
  logo: { width: 90, height: 90, alignSelf: 'center', marginBottom: 12 },
  title: { color: '#fff', fontSize: 22, fontWeight: '700', textAlign: 'center' },
  subtitle: { color: '#9aa4bf', fontSize: 13, textAlign: 'center', marginBottom: 18 },
  inputGroup: { marginVertical: 8 },
  input: { backgroundColor: '#071126', borderColor: '#152238', borderWidth: 1, color: '#fff', borderRadius: 12, padding: 12, marginBottom: 12 },
  button: { backgroundColor: '#2563eb', paddingVertical: 14, borderRadius: 12, alignItems: 'center' },
  buttonText: { color: '#fff', fontWeight: '700', fontSize: 16 },
});
