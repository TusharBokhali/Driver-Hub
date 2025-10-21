import { Images } from '@/assets/Images';
import { User } from '@/src/context/UserContext';
import { Colors } from '@/src/utils/Colors';
import { width } from '@/src/utils/Dimensions';
import { FONT } from '@/src/utils/FONTS';
import { AsyncStorageService } from '@/src/utils/store';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFonts } from 'expo-font';
import React, { useContext, useEffect } from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';
export default function SplashScreens({ navigation }: any) {
    const [fontsLoaded] = useFonts(FONT);
    const {user,setUser} = useContext<any>(User)
    useEffect(() => {
        getUserData()
    }, [])

    const getUserData = async () => {
        let users = await AsyncStorageService.getItem("USERLOGIN");
        setUser(users)
        if (users) {
            navigation.replace('BottomTab')
        }else{
            navigation.replace('Login')
        }
    }
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