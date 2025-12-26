import { getGreeting } from '@/src/components/GetDaysTime';
import { AdminContextData } from '@/src/context/AdminContext';
import { Colors } from '@/src/utils/Colors';
import Ionicons from '@expo/vector-icons/Ionicons';
import React, { useContext } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function Header(props: any) {
    const { AdminUser, setAdminUser } = useContext(AdminContextData);
    const username = AdminUser?.user?.name?.length > 25 ? `${AdminUser?.user?.name?.slice(0, 25)}..` : AdminUser?.user?.name;
    const parts = username.trim().split(" ");
    const first = parts[0]?.[0] || "";
    const second = parts[1]?.[0] || "";
    const initials = second ? first + second : first;

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.SimpleFlex}>
                <View style={styles.UserImageContainer}>
                    <Text style={styles.Text}>{initials || ""}</Text>
                </View>
                <View>
                    <Text style={styles.NoramlText}>Welcome back, {username || "Admin"}</Text>
                    <Text style={[styles.NoramlText, { color: Colors.dark }]}>{getGreeting()}</Text>
                </View>
            </View>
            <TouchableOpacity style={styles.Notification}>
                <Text style={styles.Fixed}>5</Text>
                <Ionicons name="notifications-outline" size={18} color={Colors.dark} />
            </TouchableOpacity>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        width: '100%',
        padding: 10,
        backgroundColor: Colors.white,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    UserImageContainer: {
        width: 40,
        height: 40,
        borderRadius: 15,
        backgroundColor: "#1D4ED8",
        justifyContent: 'center',
        alignItems: 'center'
    },
    SimpleFlex: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10
    },
    Text: {
        fontSize: 15,
        color: Colors.white,
        fontFamily: "Medium",
        letterSpacing: 1,
        textTransform: 'uppercase',
    },
    NoramlText: {
        fontSize: 14,
        color: Colors.black,
        fontFamily: "regular",
    },
    Notification: {
        width: 40,
        height: 40,
        backgroundColor: Colors.darkBorder,
        borderRadius: 15,
        justifyContent: 'center',
        alignItems: 'center'
    },
    Fixed: {
        fontSize: 12,
        color: Colors.white,
        fontFamily: "Medium",
        textTransform: 'uppercase',
        backgroundColor:Colors.Likes,
        paddingHorizontal:5,
        paddingVertical:1,
        borderRadius:150,
        position:'absolute',
        top:-5,
        zIndex: 90,
        right:0
    }
});