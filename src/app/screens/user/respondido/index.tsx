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
            texto: "Pesquisa de satisfação 2025",
            data: "08/11/2025"

        },
        {
            id: 2,
            texto: "Pesquisa de satisfação 2022",
            data: "30/01/2022"

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

                <Button title="Para Responder" onPress={() => router.push('./paraResponder')}></Button>
                <Button title="Respondido" active={true}></Button>

            </View>


            <ScrollView style={{ padding: 20 }}>
                {formularios.length === 0 ? (
                    <ListaVazia mensagem="Nenhum formulário respondido " />
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
                                    text="Editar"
                                    style={{ alignSelf: "flex-end" }}
                                    onPress={() => {
                                        // Adicione aqui a ação desejada ao pressionar o botão
                                        console.log(`Editar formulário ${f.id}`);
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