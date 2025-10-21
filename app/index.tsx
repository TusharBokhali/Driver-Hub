// import BottomTab from '@/src/BottomTab/BottomTab';
import BottomTab from '@/src/BottomTab/BottomTab';
import UserContext from '@/src/context/UserContext';
import BookNow from '@/src/screens/Book/BookNow';
import BookConfirm from '@/src/screens/BookConfirm/BookConfirm';
import Details from '@/src/screens/Details/Details';
import HomeScreens from '@/src/screens/Home/HomeScreens';
import Login from '@/src/screens/Login/Login';
import Notifications from '@/src/screens/Notifications/Notifications';
import Register from '@/src/screens/Register/Register';
import SplashScreens from '@/src/screens/SplashScreens/SplashScreens';
import { Colors } from '@/src/utils/Colors';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import { StatusBar } from 'react-native';

export default function index() {
    const Stack = createNativeStackNavigator();
    return (
        <>
            <StatusBar barStyle={'dark-content'} backgroundColor={Colors.white} />
            <UserContext>
                <Stack.Navigator initialRouteName='SplashScreens' screenOptions={{ headerShown: false }}>
                    <Stack.Screen name='SplashScreens' component={SplashScreens} />
                    <Stack.Screen name='HomeScreens' component={HomeScreens} />
                    <Stack.Screen name='Login' component={Login} />
                    <Stack.Screen name='Register' component={Register} />
                    <Stack.Screen name='BottomTab' component={BottomTab} />
                    <Stack.Screen name='Details' component={Details} />
                    <Stack.Screen name='BookNow' component={BookNow} />
                    <Stack.Screen name='BookConfirm' component={BookConfirm} />
                    <Stack.Screen name='Notifications' component={Notifications} />
                </Stack.Navigator>
            </UserContext>
        </>
    )
}