import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import Fontisto from '@expo/vector-icons/Fontisto';
import Ionicons from '@expo/vector-icons/Ionicons';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import React from 'react';
import AdminHome from './AdminHome';
import AdminProfile from './AdminProfile';
import ClientRequest from './ClientRequest';
import Header from './components/Header';
import VehicalHandle from './VehicalHandle';
export default function AdminBottom() {
  const Tab = createBottomTabNavigator();
  return (
    <Tab.Navigator screenOptions={{
      header: (props) => <Header {...props} />,
      tabBarStyle: {
        height: 70,
        paddingTop: 10,
      },
      tabBarLabelStyle:{
        paddingTop:2,
        fontFamily:"Medium"
      }
    }}>
      <Tab.Screen name='AdminHome' component={AdminHome}
        options={{
          tabBarLabel: "Home",
          tabBarIcon: ({ focused, color, size }) => (
            <Fontisto name="home" size={size} color={color} />
          )
        }}
      />
     
      <Tab.Screen name='VehicalHandle' component={VehicalHandle}
        options={{
          tabBarLabel: "Vehical",
          tabBarIcon: ({ focused, color, size }) => (
            <FontAwesome5 name="car" size={size} color={color} />
          )
        }}
      />
      <Tab.Screen name='ClientRequest' component={ClientRequest}
        options={{
          tabBarLabel: "Order",
          tabBarIcon: ({ focused, color, size }) => (
            <Ionicons name="shield-checkmark" size={size} color={color} />
          )
        }}
      />
        <Tab.Screen name='AdminProfile' component={AdminProfile}
         options={{
           tabBarLabel: "Profile",
           tabBarIcon: ({ focused, color, size }) => (
             <MaterialCommunityIcons name="account-settings" size={size} color={color} />
           )
         }}
       />
      {/* <Tab.Screen name='BankScreen' component={BankScreen}/> */}
    </Tab.Navigator>
  )
}