import { StyleSheet, Text, View } from 'react-native';

export default function UserScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>👤 Bem-vindo, usuário padrão!</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#0f172a' },
  text: { color: '#fff', fontSize: 22, fontWeight: '700' },
});
