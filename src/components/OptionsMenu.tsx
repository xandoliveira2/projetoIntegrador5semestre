import React, { cloneElement, useState } from "react";
import {
  Alert,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Popover, { PopoverPlacement as Placement } from "react-native-popover-view";

interface Option {
  title: string;
  onPress: () => void;
}

interface OptionsMenuProps {
  options: Option[];
  icon: React.ReactElement<{ onPress?: () => void }>;
}

const OptionsMenu: React.FC<OptionsMenuProps> = ({ options, icon }) => {
  const [visible, setVisible] = useState(false);

  const handleOpen = () => {
    if (Platform.OS === "web") {
      Alert.alert("Aviso", "Menu popover não é suportado no Web");
      return;
    }
    setVisible(true);
  };

  const handleClose = () => setVisible(false);

  return (
    <Popover
      isVisible={visible}
      onRequestClose={handleClose}
      placement={Placement.BOTTOM}
      from={() => cloneElement(icon, { onPress: handleOpen })}
      animationConfig={{ duration: 60 }}
    >
      <View style={styles.menuContent}>
        {options.map((opt, index) => (
          <React.Fragment key={index}>
            <TouchableOpacity
              style={styles.menuOption}
              onPress={() => {
                handleClose();
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
    backgroundColor: "#ddd",
    marginVertical: 6,
  },
});

export default OptionsMenu;
