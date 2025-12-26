import { Api } from '@/src/Api/Api';
import { timeAgo } from '@/src/components/TimeAgo';
import { ToastShow } from '@/src/context/ToastContext';
import { User } from '@/src/context/UserContext';
import { Colors } from '@/src/utils/Colors';
import { height } from '@/src/utils/Dimensions';
import Ionicons from '@expo/vector-icons/Ionicons';
import axios from 'axios';
import LottieView from 'lottie-react-native';
import React, { useContext, useEffect, useState } from 'react';

import { FlatList, RefreshControl, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
export default function Notifications({ navigation }: any) {
    const [AllNotifications, setAllNotifications] = useState([]);
    const [Loading, setLoading] = useState<boolean>(false);
    const { Toast, setToast } = useContext(ToastShow);
    const { user, setUser } = useContext<any>(User);

    const GetAllNotifications = async () => {
        setLoading(true);
        try {
            let res = await axios.get(Api.get_notifications, {
                headers: {
                    "Authorization": `Bearer ${user?.token}`
                }
            });
            if (res?.data?.success) {
                setAllNotifications(res?.data?.data?.notifications || []);
            } else {
                setToast({
                    visible: true,
                    type: 'error',
                    message: res?.data?.message || 'Failed to fetch notifications'
                })
            }
        } catch (error) {
            if (axios.isAxiosError(error)) {
                setToast({
                    visible: true,
                    type: 'error',
                    message: error?.response?.data?.message || 'An error occurred while fetching notifications'
                })
            }
        }
        finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        if (AllNotifications.length === 0) {
            GetAllNotifications();
        }

        setTimeout(() => {
            SeenNotifications();
        }, 5000)
    }, [])

    const SeenNotifications = async () => {
        try {
            let res = await axios.delete(Api.clean_notifications, {
                headers: {
                    "Authorization": `Bearer ${user?.token}`
                }
            })
            console.log(res?.data?.message);

        } catch (error) {
            console.log("Error in marking notifications as seen:", error);
        }
    }
    const onRefresh = async () => {
        setLoading(true);
        await GetAllNotifications();
        setLoading(false);
    };
    return (
        <SafeAreaView style={styles.container}>
            <View style={[styles.Flex, styles.Header]}>
                <TouchableOpacity style={styles.Box} onPress={() => navigation.goBack()}>
                    <Ionicons name="arrow-back-outline" size={24} color="black" />
                </TouchableOpacity>
                <Text style={styles.Heading}>Notification</Text>
                <View />
            </View>

            <FlatList
                data={AllNotifications}
                keyExtractor={(item: any) => item._id?.toString()}
                style={{ paddingTop: 15 }}
                ListEmptyComponent={() => (
                    <View style={styles.EmptyView}>
                        <LottieView
                            autoPlay
                            loop={false}
                            style={{
                                width: 150,
                                height: 150,
                            }}
                            source={require('../../Animation/NoNotification.json')}
                        />
                        <Text style={styles.EmptyText}>No Notifications Found</Text>
                    </View>
                )}
                contentContainerStyle={{ paddingBottom: 20 }}
                refreshControl={
                    <RefreshControl
                        refreshing={Loading}
                        onRefresh={onRefresh}
                        colors={[Colors.primary]}
                        tintColor={Colors.green}
                    />
                }
                renderItem={({ item, index }) => (
                    <View style={[styles.card, styles.unread]}>

                        <View style={[styles.iconBox, { backgroundColor: Colors.green }]}>
                            <Text style={styles.iconText}>✓</Text>
                        </View>

                        <View style={styles.content}>
                            <Text style={styles.title}>
                                {item?.title || ""}
                            </Text>

                            <Text numberOfLines={2} style={styles.message}>
                                {item?.message || ""}
                            </Text>

                            <Text style={styles.time}>
                                {timeAgo(item?.createdAt)}
                            </Text>
                        </View>

                    </View>
                )}
            />
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 15
    },
    Header: {
        width: '100%',
        paddingHorizontal: 15,
        backgroundColor: Colors.darkBorder,
        borderBottomWidth: 1,
        borderColor: Colors.border,
        paddingBottom: 10

    },
    Flex: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    Box: {
        width: 40,
        height: 40,
        backgroundColor: Colors.darkwhite,
        borderRadius: 120,
        justifyContent: 'center',
        alignItems: 'center'
    },
    Heading: {
        fontSize: 16,
        color: Colors.dark,
        fontFamily: 'regular',
    },
    card: {
        flexDirection: 'row',
        backgroundColor: Colors.white,
        padding: 14,
        borderRadius: 12,
        marginBottom: 12,
        elevation: 2,
    },

    unread: {
        backgroundColor: '#ECFDF3',
        borderLeftWidth: 4,
        borderLeftColor: Colors.green,
    },

    iconBox: {
        width: 42,
        height: 42,
        borderRadius: 21,
        alignItems: 'center',
        justifyContent: 'center',
    },

    iconText: {
        color: Colors.white,
        fontFamily: 'Bold',
        fontSize: 18,
    },

    content: {
        flex: 1,
        marginLeft: 12,
    },

    title: {
        color: Colors.black,
        fontFamily: 'SemiBold',
        fontSize: 15,
    },

    message: {
        color: Colors.dark,
        fontFamily: 'Regular',
        fontSize: 13,
        marginTop: 4,
    },

    time: {
        color: Colors.lightGray,
        fontFamily: 'Medium',
        fontSize: 11,
        marginTop: 6,
    },
    EmptyView: {
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        height: height * 0.7,
    },
    EmptyText: {
        fontFamily: 'Medium', fontSize: 16, color: Colors.dark, marginTop: 10
    }
});