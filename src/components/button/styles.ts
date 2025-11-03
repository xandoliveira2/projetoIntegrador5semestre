import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({

    button: {
        width: "45%",
        margin: 5,
        borderRadius: 50,

        // iOS
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 4.65,

        // Android
        elevation: 8,

    },
    text: {
        color: "white",
        padding: 14,
        paddingVertical: 8,
        fontSize: 16,
        textAlign: "center",
    },

     activeButton: {
        backgroundColor: "#FF7E00",
    },
    inactiveButton: {
        backgroundColor: "#ffffffff",
    },
    activeText: {
        color: "#ffffffff",
    },
    inactiveText: {
        color: "#000000ff",
    },

})


