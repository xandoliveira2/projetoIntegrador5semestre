import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function FontSizeButtons({ onIncrease, onDecrease }: any) {
  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.btn} onPress={onDecrease}>
        <Text style={styles.txt}>A−</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.btn} onPress={onIncrease}>
        <Text style={styles.txt}>A+</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flexDirection: "row", gap: 10 },
  btn: {
    paddingVertical: 8,
    paddingHorizontal: 10,
    backgroundColor: "#ffffffff",
    borderRadius: 8,
    borderWidth:2,
    borderColor:'gray'
  },
  txt: {
    color: "#000000ff",
    fontSize: 18,
    fontWeight:'bold'
  }
});
