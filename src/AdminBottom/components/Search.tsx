import { Colors } from '@/src/utils/Colors';
import Octicons from '@expo/vector-icons/Octicons';
import React from 'react';
import { StyleSheet, TextInput, View } from 'react-native';
interface Props {
    value: string;
    setValue: (value: string) => void;
    containerStyle?: string | any;
    Placeholder?: string
}

export default function Search({ value, setValue, containerStyle, Placeholder = "" }: Props) {
    return (
        <View style={styles.container}>
            <Octicons name="search" size={18} color={Colors.placeHolder} />
            <TextInput
                value={value}
                placeholder={Placeholder}
                placeholderTextColor={Colors.placeHolder}
                onChangeText={setValue}
                style={styles.TextInput}
            />
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        width: "100%",
        backgroundColor: Colors.white,
        alignItems:'center',
        flexDirection: 'row',
        gap: 10,
        borderRadius: 7,
        paddingHorizontal:10,
        paddingVertical:5
    },
    TextInput: {
        width:'90%',
        fontSize: 14,
        color: Colors.black,
        fontFamily: "Medium",
        // backgroundColor:"green"

    }
});