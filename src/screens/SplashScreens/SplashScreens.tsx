import { Images } from '@/assets/Images';
import { AdminContextData } from '@/src/context/AdminContext';
import { User } from '@/src/context/UserContext';
import { Colors } from '@/src/utils/Colors';
import { width } from '@/src/utils/Dimensions';
import { FONT } from '@/src/utils/FONTS';
import { AsyncStorageService } from '@/src/utils/store';
import { useFonts } from 'expo-font';
import React, { useContext, useEffect } from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';
export default function SplashScreens({ navigation }: any) {
    const [fontsLoaded] = useFonts(FONT);
    const { user, setUser } = useContext<any>(User)
    const { AdminUser, setAdminUser } = useContext(AdminContextData);

    useEffect(() => {
        getUserData()
    }, [])

    const getUserData = async () => {
        try {
            const users = await AsyncStorageService.getItem("USERLOGIN");
            const admin_users = await AsyncStorageService.getItem("ADMINUSERLOGIN");

            if (users) {
                setUser(users);
                navigation.replace('BottomTab');
            } else if (admin_users) {
                setAdminUser(admin_users);
                navigation.replace('AdminBottom');
            } else {
                navigation.replace('Login');
            }
        } catch (error) {
            console.error("Error fetching user data:", error);
            navigation.replace('Login');
        }
    };

    return (
        <View style={styles.container}>

            <Image
                source={Images.logo}
                style={styles.Images}
            />
            <Text style={styles.Title}>VehicleHub</Text>
            <Text style={styles.SubTitle}>Sell & Rent Vehicles</Text>

        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: Colors.primary

    },
    Images: {
        width: width * 0.20,
        height: width * 0.20,
        resizeMode: 'contain'
    },
    Title: {
        fontSize: 22,
        color: Colors.white,
        // fontWeight: '600',
        marginTop: 10,
        textAlign: 'center',
        fontFamily: 'regular'
    },
    SubTitle: {
        fontSize: 16,
        color: Colors.darkwhite,
        fontFamily: 'regular',
        marginTop: 5,
        textAlign: 'center'
    }
});