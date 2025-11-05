import React, { useState, useRef, cloneElement } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform, Alert } from 'react-native';
import Popover from 'react-native-popover-view';
import { Placement } from 'react-native-popover-view/dist/Types';

interface Option {
  title: string;
  onPress: () => void;
}

interface OptionsMenuProps {
  options: Option[];
  icon: React.ReactElement<{ onPress?: () => void }>; // ✅ precisa ser elemento React (ex: <FormButton />)
}

const OptionsMenu: React.FC<OptionsMenuProps> = ({ options, icon }) => {
  const [visible, setVisible] = useState(false);
  const buttonRef = useRef<any>(null);

  const handlePress = () => {
    if (Platform.OS === 'web') {
      Alert.alert('Aviso', 'Menu popover não é suportado no Web');
      return;
    }
    setVisible(true);
  };

  // ✅ clona o componente recebido (FormButton) e injeta o onPress
  const clonedIcon = cloneElement(icon, {
    onPress: handlePress,
  });

  return (
    <View ref={buttonRef}>
      {clonedIcon}

      <Popover
        isVisible={visible}
        onRequestClose={() => setVisible(false)}
        from={buttonRef}
        placement={Placement.BOTTOM}
      >
        <View style={styles.menuContent}>
          {options.map((opt, index) => (
            <React.Fragment key={index}>
              <TouchableOpacity
                style={styles.menuOption}
                onPress={() => {
                  setVisible(false);
                  opt.onPress();
                }}
              >
                <Text style={styles.menuText}>{opt.title}</Text>
              </TouchableOpacity>
              {index < options.length - 1 && <View style={styles.separator} />}
            </React.Fragment>
          ))}
        </View>
      </Popover>
    </View>
  );
};

const styles = StyleSheet.create({
  menuContent: {
    padding: 10,
    minWidth: 180,
  },
  menuOption: {
    paddingVertical: 10,
  },
  menuText: {
    fontSize: 16,
  },
  separator: {
    height: 1,
    backgroundColor: '#ddd',
    marginVertical: 6,
  },
});

export default OptionsMenu;
