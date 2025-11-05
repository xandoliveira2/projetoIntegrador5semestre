import React, { useState } from 'react';
import {
  Alert,
  Dimensions,
  Modal,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

// 1. Importações dos Novos Componentes
import DateTimePicker from '@react-native-community/datetimepicker';
import { Picker } from '@react-native-picker/picker';

// Obter a largura da tela para um layout responsivo
const { width } = Dimensions.get('window');

// Definição das Props para o componente Modal
interface CustomModalProps {
  isVisible: boolean;
  onClose: () => void;
  onContinue: (data: FormData) => void; // Passa os dados do formulário
}

// Interface para o estado dos dados do formulário
interface FormData {
    nome: string;
    intervalo: 'Com intervalo' | 'Sem intervalo';
    dataInicio: Date;
    dataFinal: Date;
}

const CustomModal: React.FC<CustomModalProps> = ({ isVisible, onClose, onContinue }) => {
  if (!isVisible) {
    return null;
  }

  // --- ESTADOS DO FORMULÁRIO ---
  const [nome, setNome] = useState('');
  const [intervalo, setIntervalo] = useState<'Com intervalo' | 'Sem intervalo'>('Com intervalo');
  const [dataInicio, setDataInicio] = useState(new Date());
  const [dataFinal, setDataFinal] = useState(new Date());
  
  // Estados para controlar a visibilidade dos DatePickers (necessário no Android)
  const [showDatePickerInicio, setShowDatePickerInicio] = useState(false);
  const [showDatePickerFinal, setShowDatePickerFinal] = useState(false);

  // --- FUNÇÕES DE DATA ---
  const onChangeDateInicio = (event: any, selectedDate?: Date) => {
    const currentDate = selectedDate || dataInicio;
    setShowDatePickerInicio(Platform.OS === 'ios'); // Fecha no Android
    if (event.type === 'set') {
        setDataInicio(currentDate);
    }
  };

  const onChangeDateFinal = (event: any, selectedDate?: Date) => {
    const currentDate = selectedDate || dataFinal;
    setShowDatePickerFinal(Platform.OS === 'ios'); // Fecha no Android
    if (event.type === 'set') {
        setDataFinal(currentDate);
    }
  };

  // Função para formatar a data para exibição no campo de texto
  const formatDate = (date: Date) => {
    return date.toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: '2-digit',
    });
  };

  // --- AÇÃO CONTINUAR ---
  const handleContinue = () => {
    if (!nome) {
        Alert.alert('Atenção', 'O campo Nome é obrigatório.');
        return;
    }

    const formData: FormData = {
        nome,
        intervalo,
        dataInicio,
        dataFinal,
    };
    onContinue(formData);
  }

  // Cores e Estilos
  const INPUT_BACKGROUND_COLOR = '#F0F0F0';
  const CANCEL_BUTTON_COLOR = '#E57373';
  const CONTINUE_BUTTON_COLOR = '#42A5F5';
  const HEADER_COLOR = '#9575CD';

  return (
    <Modal
      transparent={true}
      animationType="fade"
      visible={isVisible}
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.modalContainer}>

          {/* Cabeçalho Roxo */}
          <View style={styles.headerBanner}>
            <Text style={styles.headerText}>Novo Formulário</Text>
          </View>

          {/* Conteúdo Principal do Formulário */}
          <View style={styles.formContent}>
            <Text style={styles.formTitle}>Novo Formulário</Text>
            
            {/* Campo Nome */}
            <Text style={styles.label}>Nome</Text>
            <TextInput
              style={[styles.input, { backgroundColor: INPUT_BACKGROUND_COLOR }]}
              placeholder=""
              placeholderTextColor="#999"
              value={nome}
              onChangeText={setNome}
            />

            {/* Campo Intervalo (Picker) */}
            <Text style={styles.label}>Intervalo</Text>
            <View style={[styles.inputContainer, { backgroundColor: INPUT_BACKGROUND_COLOR, paddingHorizontal: 0 }]}>
              <Picker
                selectedValue={intervalo}
                onValueChange={(itemValue) => setIntervalo(itemValue)}
                style={styles.picker}
                itemStyle={Platform.OS === 'ios' ? { height: 40 } : {}} // Ajuste no iOS
              >
                <Picker.Item label="Com intervalo" value="Com intervalo" />
                <Picker.Item label="Sem intervalo" value="Sem intervalo" />
              </Picker>
            </View>

            {/* Campos Data Início e Data Final */}
            <View style={styles.dateRow}>
              {/* Data Início */}
              <View style={styles.dateColumn}>
                <Text style={styles.label}>Data início</Text>
                <TouchableOpacity onPress={() => setShowDatePickerInicio(true)} style={[styles.dateInputTouchable, { backgroundColor: INPUT_BACKGROUND_COLOR }]}>
                  <Text style={styles.dateText}>{formatDate(dataInicio)}</Text>
                </TouchableOpacity>

                {/* Date Picker (Início) */}
                {(showDatePickerInicio || Platform.OS === 'ios') && (
                    <DateTimePicker
                        testID="datePickerInicio"
                        value={dataInicio}
                        mode="date"
                        is24Hour={true}
                        display={Platform.OS === 'ios' ? 'spinner' : 'default'} // Melhor visual em cada plataforma
                        onChange={onChangeDateInicio}
                    />
                )}
              </View>

              {/* Data Final */}
              <View style={styles.dateColumn}>
                <Text style={styles.label}>Data final</Text>
                <TouchableOpacity onPress={() => setShowDatePickerFinal(true)} style={[styles.dateInputTouchable, { backgroundColor: INPUT_BACKGROUND_COLOR }]}>
                  <Text style={styles.dateText}>{formatDate(dataFinal)}</Text>
                </TouchableOpacity>

                {/* Date Picker (Final) */}
                {(showDatePickerFinal || Platform.OS === 'ios') && (
                    <DateTimePicker
                        testID="datePickerFinal"
                        value={dataFinal}
                        mode="date"
                        is24Hour={true}
                        display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                        onChange={onChangeDateFinal}
                    />
                )}
              </View>
            </View>

            {/* Linha de Botões */}
            <View style={styles.buttonRow}>
              {/* Botão Cancelar */}
              <TouchableOpacity
                style={[styles.button, { backgroundColor: CANCEL_BUTTON_COLOR }]}
                onPress={onClose}
              >
                <Text style={styles.buttonText}>Cancelar</Text>
              </TouchableOpacity>

              {/* Botão Continuar */}
              <TouchableOpacity
                style={[styles.button, { backgroundColor: CONTINUE_BUTTON_COLOR }]}
                onPress={handleContinue}
              >
                <Text style={styles.buttonText}>Continuar</Text>
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
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContainer: {
        width: width * 0.9,
        maxWidth: 400,
        backgroundColor: 'white',
        borderRadius: 8,
        overflow: 'hidden',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    headerBanner: {
        backgroundColor: '#9575CD',
        paddingVertical: 8,
        alignItems: 'center',
    },
    headerText: {
        color: 'white',
        fontSize: 18,
        fontWeight: 'bold',
    },
    formContent: {
        padding: 20,
    },
    formTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 15,
        color: '#333',
    },
    label: {
        fontSize: 14,
        color: '#555',
        marginBottom: 5,
        marginTop: 10,
    },
    input: {
        height: 40,
        borderRadius: 5,
        paddingHorizontal: 10,
        fontSize: 16,
        borderWidth: 1,
        borderColor: '#E0E0E0',
    },
    // Container para o Picker e Data Inputs
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        height: 40,
        borderRadius: 5,
        borderWidth: 1,
        borderColor: '#E0E0E0',
        overflow: 'hidden', // Importante para o Picker no Android
    },
    // Estilo do Picker
    picker: {
        flex: 1,
        height: 40,
        color: '#333',
        // O padding é controlado pelo Picker nativo
    },

    // Estilos para os campos de Data
    dateRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 5,
    },
    dateColumn: {
        flex: 1,
        marginRight: 10,
    },
    // Touchable que simula o input de data
    dateInputTouchable: {
        height: 40,
        borderRadius: 5,
        paddingHorizontal: 10,
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: '#E0E0E0',
    },
    dateText: {
        fontSize: 16,
        textAlign: 'center',
        color: '#333',
    },
    
    // Linha de botões (Cancelar e Continuar)
    buttonRow: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        marginTop: 25,
        paddingTop: 15,
        borderTopWidth: 1,
        borderTopColor: '#EEE',
    },
    button: {
        paddingVertical: 8,
        paddingHorizontal: 20,
        borderRadius: 5,
        marginLeft: 10,
        minWidth: 100,
        alignItems: 'center',
    },
    buttonText: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 16,
    },
});

export default CustomModal;