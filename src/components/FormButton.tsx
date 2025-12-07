import React from 'react';
import {
  Image,
  ImageSourcePropType,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableOpacityProps,
  View,
} from 'react-native';

// Tipagem das props
interface FormButtonProps extends TouchableOpacityProps {
  text?: string;               // Texto opcional
  icon?: ImageSourcePropType;  // Ícone opcional (require() ou { uri })
  iconSize?: number;           // Define tamanho igual (largura e altura)
  iconWidth?: number;          // Define largura do ícone
  iconHeight?: number;         // Define altura do ícone
  textSize?: number;
  onPress: () => void;
}

// Componente funcional
const FormButton: React.FC<FormButtonProps> = ({
  text,
  icon,
  iconSize,
  iconWidth,
  iconHeight,
  onPress,
  style,
  textSize,
  ...rest
}) => {
  const isIconOnly = icon && !text;

  return (
    <TouchableOpacity
      style={[
        styles.container,
        isIconOnly ? styles.iconOnlyContainer : undefined, // deixa redondo se for só ícone
        style,
      ]}
      onPress={onPress}
      activeOpacity={0.7}
      {...rest}
    >
      <View style={styles.content}>
        {icon && (
          <Image
            source={icon}
            style={[
              styles.icon,
              iconSize != null ? { width: iconSize, height: iconSize } : undefined,
              iconWidth != null ? { width: iconWidth } : undefined,
              iconHeight != null ? { height: iconHeight } : undefined,
              !text ? { marginRight: 0 } : undefined, // remove espaçamento se não tiver texto
            ]}
          />
        )}
        {text && <Text style={[styles.text, textSize != null ? { fontSize: textSize } : undefined]}>{text}</Text>}
      </View>
    </TouchableOpacity>
  );
};

// Estilos
const styles = StyleSheet.create({
  container: {
    backgroundColor: '#007AFF',
    paddingVertical: 7,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    marginRight: 10,
  },
  iconOnlyContainer: {
    borderRadius: 50,          // botão redondo
    width: 50,                 // tamanho padrão
    height: 50,
    paddingHorizontal: 0,      // remove padding lateral
    paddingVertical: 0,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    width: 20,
    height: 20,
    marginRight: 8,
    resizeMode: 'contain',
  },
  text: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
  },
});

export default FormButton;
