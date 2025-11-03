
import { TouchableOpacity, TouchableOpacityProps, Text, Pressable } from "react-native"
import { styles } from "./styles"

type Props = TouchableOpacityProps & {
    title: string;
    active?: boolean;

}


export function Button({ title, active = false, ...rest }) {
    return (
        <TouchableOpacity style={[styles.button, active ? styles.activeButton : styles.inactiveButton]} {...rest}>
            <Text style={[styles.text, active ? styles.activeText : styles.inactiveText]}>{title}</Text>
        </TouchableOpacity>


    )
}