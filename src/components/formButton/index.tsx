import React from 'react';
import { 
  TouchableOpacity, 
  Text, 
  StyleSheet, 
  TouchableOpacityProps, // Importa os tipos nativos do TouchableOpacity
} from 'react-native';

// 1. Define a interface (tipagem) das props do seu componente
interface FormButtonProps extends TouchableOpacityProps {
  text: string;           // A prop obrigatória de texto (em vez de 'title')
  onPress: () => void;    // A função que será chamada ao pressionar
  // Você pode adicionar props opcionais, como 'style' ou 'disabled', se quiser
}

// 2. Define o componente como uma função React com tipagem
const FormButton: React.FC<FormButtonProps> = ({ 
  text, 
  onPress, 
  style, // Permite passar estilos externos (merge com o padrão)
  ...rest // Captura todas as outras props do TouchableOpacity (como 'disabled')
}) => {
  return (
    <TouchableOpacity
      style={[styles.container, style]}
      onPress={onPress}
      activeOpacity={0.7}
      {...rest} // Passa o resto das props (ex: disabled, accessibilityLabel)
    >
      <Text style={styles.text}>
        {text}
      </Text>
    </TouchableOpacity>
  );
};

// 3. Define os estilos padrão conforme solicitado
const styles = StyleSheet.create({
  container: {
    // Cor padrão: Azul
    backgroundColor: '#007AFF', 
    
    paddingVertical: 10,
    paddingHorizontal: 20,
    
    // Border Radius Leve
    borderRadius: 8, 
    
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5, // Sombra para Android
  },
  text: {
    // Cor do Texto: Branco
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600', // Semibold
  },
});

export default FormButton;
