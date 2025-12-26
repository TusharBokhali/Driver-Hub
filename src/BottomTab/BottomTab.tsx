import Entypo from '@expo/vector-icons/Entypo';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useIsFocused } from '@react-navigation/native';
import axios from 'axios';
import React, { useContext, useEffect } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Api } from '../Api/Api';
import CustomHeader from '../components/CustomHeader';
import { User } from '../context/UserContext';
import BookingVehical from '../screens/BookingVehical/BookingVehical';
import HomeScreens from '../screens/Home/HomeScreens';
import Profile from '../screens/Profile/Profile';
import Saved from '../screens/Saved/Saved';
import { Colors } from '../utils/Colors';
export default function BottomTab() {
    const Tab = createBottomTabNavigator();
    const { setUnreadMessages, user } = useContext<any>(User);
    const isFocused = useIsFocused();
    const getUnreadMessages = async () => {
        try {
            const res = await axios.get(Api.get_notifications, {
                params: {
                    unreadOnly: true,
                },
                headers: {
                    Authorization: `Bearer ${user.token}`,
                },
            });
            if(res?.data?.success){
                setUnreadMessages(res?.data?.data?.notifications?.length);
            }else{
                setUnreadMessages(0);
            }
            return res.data;
        } catch (error: any) {
            console.log(
                "Error fetching unread messages:",
                error?.response?.data || error.message
            );
            return null;
        }
    };

    useEffect(()=>{
        getUnreadMessages();
    },[isFocused])

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: Colors.white }}>
            <Tab.Navigator
                initialRouteName='Home'
                screenOptions={{
                    tabBarActiveTintColor: Colors.primary,
                    header: (props) => <CustomHeader {...props} />,
                    tabBarInactiveTintColor: Colors.mediumDark,
                    tabBarStyle: {
                        height: 60,
                        paddingTop: 10,
                        backgroundColor: Colors.white,
                    },

                }}
            >
                <Tab.Screen name='Home' component={HomeScreens}
                    options={{
                        tabBarIcon: ({ size, color, focused }) => <Entypo name="home" size={size} color={color} />
                    }}
                />
                <Tab.Screen name='BookingVehical' component={BookingVehical}

                    options={{
                        tabBarIcon: ({ size, color, focused }) => <FontAwesome5 name="car" size={size} color={color} />,
                        tabBarLabel: 'My Booking'
                    }}
                />
                <Tab.Screen name='Favorites' component={Saved}
                    options={{
                        tabBarIcon: ({ size, color, focused }) => <FontAwesome name="heart" size={size} color={color} />
                    }}
                />
                <Tab.Screen name='Profile' component={Profile}
                    options={{
                        tabBarIcon: ({ size, color, focused }) => <FontAwesome6 name="user-large" size={size} color={color} />
                    }}
                />
            </Tab.Navigator>
        </SafeAreaView>
    )
}

// <TouchableOpacity style={styles.BTN}>
//                 <FontAwesome name="heart" size={18} color={Colors.dark} />
//             </TouchableOpacity>