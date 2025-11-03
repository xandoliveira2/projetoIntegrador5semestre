// Para Responder
import { Button } from "@/components/button";
import { useRouter } from 'expo-router';
import { ScrollView, StyleSheet, View } from "react-native";

import Data from '@/components/date';
import FormButton from '@/components/formButton';
import Formulario from '@/components/formulario';
import ListaVazia from '@/components/listaVaziaMessage';


export default function Index() {
    const router = useRouter();
    const formularios: any[] = [

        {
            id: 1,
            texto: "Pesquisa de satisfação 2023",
            data: "12/06/2023"
        },
        {
            id: 2,
            texto: "Pesquisa de satisfação 2024",
            data: "07/05/2024"

        },/*
    {
      id: 3,
      texto: "",
    },
    */
    ];

    return (
        <View>
            <View style={styles.container}>


                <Button title="Para Responder" active={true}></Button>
                <Button title="Respondido" onPress={() => router.push('./respondido')}></Button>

            </View>

            <ScrollView style={{ padding: 20 }}>
                {formularios.length === 0 ? (
                    <ListaVazia mensagem="Nenhum formulário para responder" />
                ) : (
                    formularios.map((f) => (
                        <View
                        style={{ marginTop: 15 }}>
                            <Data data={f.data}></Data>

                            <Formulario

                                key={f.id}
                                texto={f.texto}
                            >

                                <FormButton
                                    text="Responder"
                                    style={{ alignSelf: "flex-end" }}
                                    onPress={() => {
                                        // Adicione aqui a ação desejada ao pressionar o botão
                                        console.log(`Responder formulário ${f.id}`);
                                    }}
                                />
                            </Formulario>
                        </View>



                    ))
                )}
            </ScrollView>

        </View>

    )
}


const styles = StyleSheet.create({
    container: {
        width: "100%",
        alignItems: "center",
        justifyContent: "space-around",
        flexDirection: "row",
        alignSelf: "center",

    }

});