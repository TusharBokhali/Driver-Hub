import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import React, { useContext, useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import LogoutModal from '../components/LogoutModal';
import { AdminContextData } from '../context/AdminContext';
import { Colors } from '../utils/Colors';

export default function AdminProfile() {
    const { replace } = useNavigation<any>();
    const [showModal, setShowModal] = useState<boolean>(false);
    const { AdminUser, setAdminUser } = useContext(AdminContextData);

    return (
        <View style={styles.container}>
            <TouchableOpacity style={styles.LogOut} onPress={()=>setShowModal(true)}>
                <Text  style={[styles.NormalText, { color: Colors.red, }]}>LogOut</Text>
            </TouchableOpacity>

            <LogoutModal
                visible={showModal}
                onClose={() => setShowModal(false)}
                onConfirm={() => {
                    AsyncStorage.clear();
                    setAdminUser(null)
                    replace("Login")
                }}
            />
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding:15
    },
    LogOut: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
        justifyContent: 'center',
        backgroundColor: '#FEF2F2',
        paddingVertical: 15,
        borderRadius: 7,
        borderWidth: 2,
        borderColor: '#FECACA',
        marginTop: 25
    },
    NormalText: {
        fontSize: 14,
        fontFamily: 'regular',
        color: Colors.border1,
    },
});