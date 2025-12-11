// import BottomTab from '@/src/BottomTab/BottomTab';
import AdminBottom from '@/src/AdminBottom/AdminBottom';
import BottomTab from '@/src/BottomTab/BottomTab';
import AdminContext from '@/src/context/AdminContext';
import ToastContext from '@/src/context/ToastContext';
import UserContext from '@/src/context/UserContext';
import LoginAdmin from '@/src/screens/Admin/LoginAdmin';
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
import LayoutMain from './LayoutMain';

export default function index() {
    const Stack = createNativeStackNavigator();
    const withLayout = (Component:any) => (props:any) => {
        return (
            <LayoutMain>
                <Component {...props} />
            </LayoutMain>
        );
    };
    return (
        <>
            <StatusBar barStyle={'dark-content'} backgroundColor={Colors.white} />
            <ToastContext>
                <AdminContext>
                    <UserContext>
                        <Stack.Navigator initialRouteName='SplashScreens' screenOptions={{ headerShown: false }}>
                            <Stack.Screen name='SplashScreens' component={withLayout(SplashScreens)} />
                            <Stack.Screen name='HomeScreens' component={withLayout(HomeScreens)} />
                            <Stack.Screen name='Login' component={withLayout(Login)} />
                            <Stack.Screen name='Register' component={withLayout(Register)} />
                            <Stack.Screen name='BottomTab' component={withLayout(BottomTab)} />
                            <Stack.Screen name='Details' component={withLayout(Details)} />
                            <Stack.Screen name='BookNow' component={withLayout(BookNow)} />
                            <Stack.Screen name='BookConfirm' component={withLayout(BookConfirm)} />
                            <Stack.Screen name='Notifications' component={withLayout(Notifications)} />

                            {/* Admin Screens */}
                            <Stack.Screen name='LoginAdmin' component={withLayout(LoginAdmin)} />
                            <Stack.Screen name='AdminBottom' component={withLayout(AdminBottom)} />
                        </Stack.Navigator>
                    </UserContext>
                </AdminContext>
            </ToastContext>
        </>
    )
}