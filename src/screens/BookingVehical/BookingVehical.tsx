import { BookingCardSkeleton } from '@/src/AdminBottom/components/Loader/BookingCardSkeleton ';
import { Api } from '@/src/Api/Api';
import BookingCard from '@/src/components/BookingCard';
import BottomSheetModal from '@/src/components/BottomSheetModal';
import { ToastShow } from '@/src/context/ToastContext';
import { User } from '@/src/context/UserContext';
import { Colors } from '@/src/utils/Colors';
import { height } from '@/src/utils/Dimensions';
import axios from 'axios';
import LottieView from 'lottie-react-native';
import React, { useCallback, useContext, useEffect, useState } from 'react';
import { FlatList, RefreshControl, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

export default function BookingVehical() {
    const [GetAllBooking, setGetAllBooking] = useState([]);
    const [Loading, setLoading] = useState<boolean>(false);
    const { user, setUser, GlobalBooking, setGlobalBooking } = useContext<any>(User);
    const { Toast, setToast } = useContext(ToastShow);
    const [CancelLoading, setCancelLoading] = useState<boolean>(false);
    const [cancelBookingId, setCancelBookingId] = useState<string | null>(null);
    const [cancelReason, setCancelReason] = useState<string>("");
    const [refreshing, setRefreshing] = useState<boolean>(false);
    const GetAllBookingsFun = async (type: Number | null = null) => {
        if (type == null) {
            setLoading(true);
        }
        try {
            let res = await axios.get(Api.Vehical_booking, {
                headers: {
                    "Authorization": `Bearer ${user?.token}`
                }
            })
            if (res?.data?.success) {
                console.log(res?.data);

                setGetAllBooking(res?.data?.data || []);
            } else {
                setToast({
                    visible: true,
                    message: res?.data?.message || "Something went wrong",
                    type: 'error'
                })
            }
        } catch (error: any) {
            console.log("GetAllBookingsFun Error:-", error);
            if (axios.isAxiosError(error)) {
                setToast({
                    visible: true,
                    message: error?.response?.data?.message || error.message,
                    type: 'error'
                })
            }
        }
        finally {
            setLoading(false);
        }
    }
    const cancelBooking = async () => {
        setCancelLoading(true);
        try {
            const response = await axios.post(
                `${Api.Vehical_booking}/${cancelBookingId}/cancel`,
                { cancellationReason: cancelReason?.trim() },
                { headers: { Authorization: `Bearer ${user?.token}` } }
            );

            const message = response?.data?.message || "Booking cancelled successfully";

            if (response?.data?.success) {
                console.log("✅ Booking cancelled:", response.data);
                setToast({
                    visible: true,
                    message,
                    type: "success",
                });
                setCancelBookingId(null);
                setCancelReason("");
                return response.data;
            } else {
                setToast({
                    visible: true,
                    message,
                    type: "error",
                });
            }
        } catch (error: any) {
            const errorMessage =
                error?.response?.data?.message || error?.message || "Failed to cancel booking";

            console.error("❌ Cancel booking error:", error?.response?.data || errorMessage);

            setToast({
                visible: true,
                message: errorMessage,
                type: "error",
            });

            throw error;
        } finally {
            setCancelLoading(false);
        }
    };



    useEffect(() => {
        if (GetAllBooking.length === 0) {
            GetAllBookingsFun();
        }
    }, [])

    const onRefresh = useCallback(() => {
        setRefreshing(true);
        GetAllBookingsFun(1).then(() => setRefreshing(false));

    }, []);

    return (
        <View style={styles.container}>
            {
                Loading ?
                    <View style={{ gap: 10 }}>
                        <BookingCardSkeleton />
                        <BookingCardSkeleton />
                        <BookingCardSkeleton />
                    </View>
                    :
                    <FlatList
                        data={GetAllBooking}

                        refreshControl={
                            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                        }
                        ListEmptyComponent={() => (
                            <View style={styles.FullFlex}>
                                <LottieView
                                    autoPlay
                                    loop={false}
                                    style={{
                                        width: 150,
                                        height: 100,
                                    }}
                                    source={require('../../Animation/carr.json')}
                                />
                                <Text style={[styles.title, { color: Colors.dark }]}>No bookings found</Text>
                            </View>
                        )}
                        keyExtractor={(item: any) => `${item?._id}`}
                        renderItem={({ item, index }) => (
                            <BookingCard
                                onPress={() => {
                                    setCancelBookingId(item?._id); console.log(item);
                                }}
                                user={true}
                                data={item}
                            />
                        )}
                    />
            }
            <BottomSheetModal
                visible={cancelBookingId !== null}
                onClose={() => setCancelBookingId(null)}


            >
                <KeyboardAwareScrollView
                    contentContainerStyle={{ flex: 1 }}
                    enableOnAndroid={true}
                    extraScrollHeight={20}
                    keyboardOpeningTime={0}
                >

                    <Text style={styles.title}>Cancel Booking</Text>

                    {/* Reason Input */}
                    <TextInput
                        placeholder="Enter cancel reason..."
                        placeholderTextColor="#9CA3AF"
                        multiline
                        numberOfLines={4}
                        value={cancelReason}
                        onChangeText={setCancelReason}
                        style={styles.input}
                        textAlignVertical="top"
                    />

                    {/* Cancel Button */}
                    <TouchableOpacity
                        style={[
                            styles.cancelBtn,
                            !cancelReason && { opacity: 0.6 },
                        ]}
                        disabled={!cancelReason}
                        onPress={cancelBooking}
                    >
                        <Text style={styles.btnText}>Cancel Booking</Text>
                    </TouchableOpacity>

                </KeyboardAwareScrollView>
            </BottomSheetModal>

            {/* <Loader visible={Loading} /> */}
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 15
    },
    title: {
        fontSize: 18,
        fontFamily: "SemiBold",
        color: Colors.black,
        marginBottom: 12,
    },

    input: {
        minHeight: 150,
        borderWidth: 1,
        borderColor: Colors.border,
        borderRadius: 12,
        padding: 12,
        fontSize: 14,
        fontFamily: "regular",
        color: "#000000",
        backgroundColor: Colors.white,
        textAlignVertical: "top",
    },

    cancelBtn: {
        marginTop: 16,
        backgroundColor: Colors.red,
        paddingVertical: 14,
        borderRadius: 12,
        alignItems: "center",
    },

    btnText: {
        color: Colors.white,
        fontSize: 16,
        fontFamily: "SemiBold",
    },
    FullFlex: {
        width: '100%',
        height: height * 0.85,
        justifyContent: 'center',
        alignItems: 'center',
    }
});