import { Images } from '@/assets/Images';
import Ionicons from '@expo/vector-icons/Ionicons';
import { BottomTabHeaderProps } from '@react-navigation/bottom-tabs';
import { useNavigation } from '@react-navigation/native';
import React, { useContext } from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { User } from '../context/UserContext';
import { Colors } from '../utils/Colors';
import { getGreeting } from './GetDaysTime';
const CustomHeader: React.FC<BottomTabHeaderProps> = () => {
    const { navigate } = useNavigation<any>();
    const { user, setUser, UnreadMessages } = useContext<any>(User);
    let local: string = "http://192.168.1.4:5000"


    return (

        <View style={styles.container}>
            <View style={styles.Flex}>
                <Image
                    source={user?.user?.profileImage ? { uri: user?.user?.profileImage } : Images.Driver}
                    style={styles.Images}
                />
                <View>
                    <Text style={styles.Label}>{getGreeting()}</Text>
                    <Text style={styles.Name}>{user?.user?.name}</Text>
                </View>
            </View>
            <View style={styles.Flex}>
                <TouchableOpacity style={styles.BTN} onPress={() => navigate('Notifications')}>
                    {
                        UnreadMessages > 0 &&
                        <View style={styles.Brdige}>
                            <Text style={styles.BrdigeText}>{UnreadMessages}</Text>
                        </View>
                    }
                    <Ionicons name="notifications-outline" size={18} color={Colors.dark} />
                </TouchableOpacity>

            </View>
        </View>
    )
}

export default CustomHeader;

const styles = StyleSheet.create({
    container: {
        width: '100%',
        backgroundColor: Colors.white,
        paddingHorizontal: 15,
        paddingVertical: 10,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    Images: {
        width: 35,
        height: 35,
        borderRadius: 120,
        resizeMode: 'cover'
    },
    Label: {
        fontFamily: 'SemiBold',
        color: Colors.black,
        fontSize: 16
    },
    Name: {
        // flex: 1,
        fontFamily: 'regular',
        fontSize: 14,
        color: Colors.black
    },
    Flex: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10
    },
    BTN: {
        backgroundColor: Colors.lightGray,
        paddingHorizontal: 5,
        paddingVertical: 10,
        borderRadius: 20
    },
    Brdige: {
        position: 'absolute',
        top: -5,
        right: -10,
        backgroundColor: Colors.primary,
        width: 25,
        height: 25,
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 1,
        borderRadius: 150,
        zIndex: 10,
    },
    BrdigeText: {
        fontSize: 10,
        color: Colors.white,
        fontFamily: 'Medium',

    }
});