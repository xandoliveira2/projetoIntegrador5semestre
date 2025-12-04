import React, { cloneElement } from "react";
import {
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

interface Option {
  title: string;
  onPress: () => void;
}

interface OptionsMenuProps {
  options: Option[];
  icon: React.ReactElement;
  visible: boolean;
  onOpen: () => void;
  onClose: () => void;
}

export default function OptionsMenu({
  options,
  icon,
  visible,
  onOpen,
  onClose,
}: OptionsMenuProps) {
  return (
    <>
      {/* Botão que abre o menu */}
      {cloneElement(icon, {
        onPress: onOpen,
      })}

      {/* Menu simples via Modal */}
      <Modal transparent visible={visible} animationType="fade">
        <TouchableOpacity style={styles.overlay} onPress={onClose}>
          <View style={styles.menu}>
            {options.map((opt, index) => (
              <TouchableOpacity
                key={index}
                style={styles.option}
                onPress={() => {
                  onClose();
                  opt.onPress();
                }}
              >
                <Text style={styles.text}>{opt.title}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </TouchableOpacity>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.3)",
    justifyContent: "center",
    alignItems: "center",
  },
  menu: {
    backgroundColor: "#fff",
    borderRadius: 10,
    width: 220,
    paddingVertical: 10,
  },
  option: {
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  text: {
    fontSize: 16,
  },
});
