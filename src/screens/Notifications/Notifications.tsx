import { View, Text, StyleSheet, TouchableOpacity } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context';
import Ionicons from '@expo/vector-icons/Ionicons';
import { Colors } from '@/src/utils/Colors';
export default function Notifications({ navigation }: any) {

    return (
        <SafeAreaView style={styles.container}>
            <View style={[styles.Flex, styles.Header]}>
                <TouchableOpacity style={styles.Box} onPress={() => navigation.goBack()}>
                    <Ionicons name="arrow-back-outline" size={24} color="black" />
                </TouchableOpacity>
                <Text style={styles.Heading}>Notification</Text>
                <View />
            </View>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    Header: {
        width: '100%',
        paddingHorizontal: 15,
        backgroundColor:Colors.darkBorder,
        borderBottomWidth:1,
        borderColor:Colors.border,
        paddingBottom:10
        
    },
    Flex: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    Box: {
        width: 40,
        height: 40,
        backgroundColor: Colors.darkwhite,
        borderRadius: 120,
        justifyContent: 'center',
        alignItems: 'center'
    },
    Heading:{
        fontSize:16,
        color:Colors.dark,
        fontFamily:'regular',
    }
});