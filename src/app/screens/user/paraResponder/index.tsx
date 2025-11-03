import { View, Text, StyleSheet, Alert, Dimensions } from "react-native"
import { Button } from "@/components/button"
import { useRouter } from 'expo-router';

export default function Index() {
    const router = useRouter();

    return (
        <View>
            <View style={styles.container}>

                <Button title="Para Responder" active={true}></Button>
                <Button title="Respondido" onPress={() => router.push('./respondido')}></Button>

            </View>

        </View>

    )
}


const styles = StyleSheet.create({
    container: {
        width:"100%",
        alignItems: "center",
        justifyContent: "space-around",
        flexDirection: "row",
        alignSelf:"center",

    }

});