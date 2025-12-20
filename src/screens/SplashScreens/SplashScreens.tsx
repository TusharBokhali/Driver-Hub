import { Images } from '@/assets/Images';
import { AdminContextData } from '@/src/context/AdminContext';
import { User } from '@/src/context/UserContext';
import { Colors } from '@/src/utils/Colors';
import { width } from '@/src/utils/Dimensions';
import { AsyncStorageService } from '@/src/utils/store';
import { useNavigation } from '@react-navigation/native';
import * as Font from "expo-font";
import React, { useContext, useEffect, useState } from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';
export default function SplashScreens() {
    const { replace } = useNavigation<any>();
    const { user, setUser } = useContext<any>(User)
    const { AdminUser, setAdminUser } = useContext(AdminContextData);
    const [fontsLoaded, setFontsLoaded] = useState(false);
    const loadFonts = async () => {
        await Font.loadAsync({
            regular: require("../../../assets/fonts/Lexend-Regular.ttf"),
            Bold: require("../../../assets/fonts/Lexend-Bold.ttf"),
            SemiBold: require("../../../assets/fonts/Lexend-SemiBold.ttf"),
            ExtraBold: require("../../../assets/fonts/Lexend-ExtraBold.ttf"),
            ExtraLight: require("../../../assets/fonts/Lexend-ExtraLight.ttf"),
            Medium: require("../../../assets/fonts/Lexend-Medium.ttf"),
            Thin: require("../../../assets/fonts/Lexend-Thin.ttf"),
        });
        setFontsLoaded(true);
    };
    useEffect(() => {
        getUserData()
    }, [])

    const getUserData = async () => {
        try {
            const users = await AsyncStorageService.getItem("USERLOGIN");
            const admin_users = await AsyncStorageService.getItem("ADMINUSERLOGIN");
            loadFonts();
            if (users) {
                setUser(users);
                replace('BottomTab');
            } else if (admin_users) {
                setAdminUser(admin_users);
                replace('AdminBottom');
            } else {
                replace('Login');
            }
       
        } catch (error) {
            console.error("Error fetching user data:", error);
            replace('Login');
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

// import React from 'react'
// import { Text, View } from 'react-native'

// export default function SplashScreens() {
//   return (
//     <View>
//       <Text>SplashScreens</Text>
//     </View>
//   )
// }