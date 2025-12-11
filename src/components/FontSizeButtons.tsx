import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useFontSize } from "./FontSizeProvider";

export default function FontSizeButtons() {
  const { increase, decrease } = useFontSize();

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={decrease} style={styles.btn}>
        <Text style={styles.txt}>A-</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={increase} style={styles.btn}>
        <Text style={styles.txt}>A+</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    gap: 10,
  },
  btn: {
    backgroundColor: "#ffffffff",
    paddingHorizontal: 12,
    borderColor: 'gray',
    paddingVertical: 8,
    borderRadius: 6,
    borderStyle:'solid',
    borderWidth:2
  },
  txt: {
    fontSize: 18,
    fontWeight: "bold",
  },
});
