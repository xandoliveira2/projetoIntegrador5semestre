import React, { useState } from 'react';
import { Alert, Button, SafeAreaView, StyleSheet, View } from 'react-native';
import CustomModal from './CustomModal'; // Assumindo que você salvou o arquivo como CustomModal.tsx

const App: React.FC = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);

  const handleOpenModal = () => {
    setIsModalVisible(true);
  };

  const handleCloseModal = () => {
    setIsModalVisible(false);
  };

  const handleContinue = () => {
    Alert.alert('Ação!', 'Clicou em Continuar!');
    handleCloseModal(); // Fecha o modal após a ação
  };

  return (
    <SafeAreaView style={appStyles.container}>
      <View style={appStyles.content}>
        {/* Botão que aciona o modal */}
        <Button title="Abrir Novo Formulário" onPress={handleOpenModal} />
      </View>

      {/* Seu componente Modal */}
      <CustomModal
        isVisible={isModalVisible}
        onClose={handleCloseModal} // Usado pelo botão Cancelar e pelo 'onRequestClose'
        onContinue={handleContinue}
      />
    </SafeAreaView>
  );
};

const appStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
});

export default App;