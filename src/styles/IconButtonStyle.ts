import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
    container: {
        alignSelf: 'center',
        marginRight: 0,
        paddingVertical: 0,
        paddingHorizontal: 0,
        height: '100%',
        width: 55,
        borderRadius: 0,
        backgroundColor: 'orange',

    }});

export type IconButtonStyle = typeof styles;
