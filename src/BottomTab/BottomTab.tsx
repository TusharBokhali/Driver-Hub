import Entypo from '@expo/vector-icons/Entypo';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import React from 'react';
import CustomHeader from '../components/CustomHeader';
import Profile from '../screens/Profile/Profile';
import Saved from '../screens/Saved/Saved';
import Search from '../screens/Search/Search';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import { Colors } from '../utils/Colors';
import HomeScreens from '../screens/Home/HomeScreens';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function BottomTab() {
    const Tab = createBottomTabNavigator();
  return (
    <SafeAreaView style={{flex:1}}>
   <Tab.Navigator 
   initialRouteName='Home'
   screenOptions={{
    tabBarActiveTintColor: Colors.primary,
    header:(props)=> <CustomHeader {...props}/>,
    tabBarInactiveTintColor:Colors.mediumDark,
    tabBarStyle:{
        height:60,
        paddingTop:2
    }
   }}
   >
    <Tab.Screen name='Home' component={HomeScreens}
    options={{
        tabBarIcon:({size,color,focused})=> <Entypo name="home" size={size} color={color} />
    }}
    />
    <Tab.Screen name='Search' component={Search}
    options={{
        tabBarIcon:({size,color,focused})=> <FontAwesome name="search" size={size} color={color} />
    }}
    />
    <Tab.Screen name='Favorites' component={Saved}
    options={{
        tabBarIcon:({size,color,focused})=>  <FontAwesome name="heart" size={size} color={color} />
    }}
    />
    <Tab.Screen name='Profile' component={Profile}
    options={{
        tabBarIcon:({size,color,focused})=> <FontAwesome6 name="user-large" size={size} color={color} />
    }}
    />
   </Tab.Navigator>
   </SafeAreaView>
  )
}

        // <TouchableOpacity style={styles.BTN}>
        //                 <FontAwesome name="heart" size={18} color={Colors.dark} />
        //             </TouchableOpacity>