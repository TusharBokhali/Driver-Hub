import { Images } from '@/assets/Images';
import { Api } from '@/src/Api/Api';
import CalendarModal from '@/src/components/CalenderView';
import { handleApiResponse } from '@/src/components/ErrorHandle';
import { formatDate } from '@/src/components/FormatDate';
import StarRating from '@/src/components/RatingView';
import { User } from '@/src/context/UserContext';
import { Colors } from '@/src/utils/Colors';
import { width } from '@/src/utils/Dimensions';
import Feather from '@expo/vector-icons/Feather';
import Ionicons from '@expo/vector-icons/Ionicons';
import axios from 'axios';
import React, { useContext, useEffect, useRef, useState } from 'react';
import { Image, Pressable, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useSharedValue } from 'react-native-reanimated';
import Carousel, { ICarouselInstance } from 'react-native-reanimated-carousel';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import SwitchToggle from "react-native-switch-toggle";

export default function Details({ route, navigation }: any) {
    const insets = useSafeAreaInsets();
    const { item } = route?.params || ""
    const ref = useRef<ICarouselInstance>(null);
    const progress = useSharedValue<number>(0);
    const [imgHeight, setImgHeight] = useState<number>(200);
    const [ActiveIndex, setActiveIndex] = useState(0);
    const [Driver, setDriver] = useState(true);
    const [SelectPerPrice, setSelectPerice] = useState<number>(1);
    const [selectStartDate, setSelectStartDate] = useState<any>(new Date());
    const [selectEndDate, setSelectEndDate] = useState<any>(new Date());
    const [VisibleCalender, setVisibleCalender] = useState<number>(0);
    const [Like, setLike] = useState(false);

    const { user, setUser, AllFavorites, setAllFavorites } = useContext<any>(User);

    const [toast, setToast] = useState<{ visible: boolean; message: string; type: 'success' | 'error' | 'info' }>({
        visible: false,
        message: '',
        type: 'info'
    })

    const onPressPagination = (index: number) => {
        console.log("hell");
        ref.current?.scrollTo({
            count: index - progress.value,
            animated: true,
        });
    };
    useEffect(() => {
        if (item?.images?.length > 0) {
            Image.getSize(
                item.images[0],
                (w, h) => {
                    const aspectRatio = h / w;
                    setImgHeight(width * aspectRatio);
                },
                (err) => console.log("Image size error", err)
            );
        }
    }, [item?.images]);

    const FavoritesAdd = async (item: any) => {
        try {
            let res = await axios.post(
                Api.getfavorites,
                { carId: item?._id },
                {
                    headers: {
                        'Authorization': `Bearer ${user?.token}`,
                        'Content-Type': 'application/json',
                    },
                }
            );


            if (res?.data?.success) {
                GetFavoritesData();
                setToast({
                    visible: true,
                    type: 'success',
                    message: res?.data?.message,
                });
            }
        } catch (error) {
            setToast({
                visible: true,
                type: handleApiResponse(error)?.type,
                message: handleApiResponse(error)?.message,
            });
            console.log("FavoritesAdd Car Error:-", error);
        }
    };

    const RemoveFavorites = async (item: any) => {
        try {
            let res = await axios.delete(
                `${Api.getfavorites}/${item?._id}`,
                {
                    headers: {
                        'Authorization': `Bearer ${user?.token}`,
                        'Content-Type': 'application/json',
                    },
                }
            );


            if (res?.data?.success) {
                GetFavoritesData();
                //   Alert.alert("Success");
                setToast({
                    visible: true,
                    type: 'success',
                    message: res?.data?.message,
                });
            }
        } catch (error) {
            setToast({
                visible: true,
                type: handleApiResponse(error)?.type,
                message: handleApiResponse(error)?.message,
            });
            console.log("FavoritesAdd Car Error:-", error);
        }
    };

    const GetFavoritesData = async () => {
        try {

            let res = await axios.get(Api.getfavorites, {
                headers: {
                    'Authorization': `Bearer ${user?.token}`,
                    'Content-Type': 'application/json'
                }
            });
            console.log("Get setAllFavorites Car", res?.data?.data);
            if (res?.data?.success) {
                setAllFavorites(res?.data?.data)
            }
        } catch (error) {
            console.log("GetFavoritesData Car Error:-", error);
        }
        finally {
        }
    }

    useEffect(() => {
        console.log(item);

    }, [item])


    return (
        <SafeAreaView style={[styles.container,]}>
            <ScrollView
                style={{ flex: 1, }}
                contentContainerStyle={{ paddingBottom: 150 }}
            >
                <View style={[styles.Flex, styles.TopBack]}>
                    <TouchableOpacity style={styles.Box} onPress={() => navigation.goBack()}>
                        <Ionicons name="arrow-back-outline" size={24} color="black" />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.Box} onPress={() => AllFavorites?.ids?.includes(item?._id) ? RemoveFavorites(item) : FavoritesAdd(item)}>

                        <Ionicons name={AllFavorites?.ids?.includes(item?._id) ? "heart-sharp" : "heart-outline"} size={24} color={AllFavorites?.ids?.includes(item?._id) ? Colors.Likes : Colors.black} />
                    </TouchableOpacity>
                </View>
                <Carousel
                    ref={ref}
                    width={width}
                    height={width / 1.7}
                    data={item?.images?.length > 0 ? item?.images : ["", ""]}
                    onProgressChange={(_, absoluteProgress) => {
                        console.log(Math.round(absoluteProgress));
                        setActiveIndex(Math.round(absoluteProgress));
                    }}

                    renderItem={({ item,index: number }) => (
                        <View style={styles.ImageContainer}>
                            <Image
                                source={item ? {uri:item} : Images.SliderImages}
                                style={[styles.Image, { height: imgHeight }]}
                            />
                        </View>

                    )}
                />
                <View style={styles.paginationContainer}>
                    {(item?.images || ["", ""]).map((_: any, index: number) => {

                        return (
                            <TouchableOpacity
                                key={index}
                                style={[
                                    styles.dot,
                                    index === ActiveIndex && styles.activeDot,
                                ]}
                                onPress={() => onPressPagination(index)}
                            />
                        );
                    })}
                </View>
                <View style={styles.DetailsContainer}>
                    <View style={styles.Flex}>
                        <View>
                            <Text style={styles.Heading}>BMW 3 Series</Text>
                            <Text style={styles.Title}>Sedan • Automatic • 5 seats</Text>
                        </View>
                        <View style={[styles.AlignCenter, styles.Ratings]}>
                            <Image
                                source={Images.StarImage}
                                style={{ width: 20, height: 20 }}
                                resizeMode='contain'
                            />
                            <Text style={styles.Title}>4.8</Text>
                        </View>
                    </View>

                    <View style={styles.Pricing}>
                        <Pressable style={[styles.PriceBox, { borderColor: SelectPerPrice === 1 ? Colors.primary : Colors.mediumDark }]} onPress={() => setSelectPerice(1)}>
                            <Text style={[styles.Title, { fontSize: 16 }]}>$45</Text>
                            <Text style={styles.dark}>per hour</Text>
                        </Pressable>

                        <Pressable style={[styles.PriceBox, { borderColor: SelectPerPrice === 2 ? Colors.primary : Colors.mediumDark }]} onPress={() => setSelectPerice(2)}>
                            <Text style={[styles.Title, { fontSize: 16 }]}>$425</Text>
                            <Text style={styles.dark}>per day</Text>
                        </Pressable>

                        <Pressable style={[styles.PriceBox, { borderColor: SelectPerPrice === 3 ? Colors.primary : Colors.mediumDark }]} onPress={() => setSelectPerice(3)}>
                            <Text style={[styles.Title, { fontSize: 16 }]}>$15</Text>
                            <Text style={styles.dark}>per km</Text>
                        </Pressable>
                    </View>

                    <View style={{ marginTop: 15 }}>
                        <Text style={[styles.Title, { marginBottom: 10 }]}>Trip Dates</Text>
                        <View style={styles.Flex}>
                            <TouchableOpacity style={styles.DateContainer} onPress={() => setVisibleCalender(1)}>
                                <Text style={[styles.dark, { marginTop: 5 }]}>Start Date</Text>
                                <Text style={styles.Title}>
                                    {
                                        selectStartDate ?
                                            formatDate(selectStartDate) :
                                            "Select Date"
                                    }
                                </Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.DateContainer} onPress={() => setVisibleCalender(2)}>
                                <Text style={[styles.dark, { marginTop: 5 }]}>End Date</Text>
                                <Text style={styles.Title}>
                                    {
                                        selectEndDate ?
                                            formatDate(selectEndDate) :
                                            "Select Date"
                                    }
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </View>

                    <View style={styles.DriverContainer}>
                        <Pressable style={[styles.AlignCenter, { gap: 10 }]} >
                            <Image
                                source={Images.Driver}
                                style={{ width: 40, height: 40 }}
                            />
                            <View>
                                <Text style={[styles.Heading, { fontSize: 16 }]}>Include Driver</Text>
                                <Text style={styles.Title}>+$25/hour</Text>
                            </View>
                        </Pressable>
                        <SwitchToggle
                            switchOn={Driver}
                            onPress={() => setDriver(!Driver)}
                            circleColorOff={Colors.white}
                            circleColorOn={Colors.white}
                            backgroundColorOn={Colors.green}
                            backgroundColorOff={Colors.lightGray}
                            duration={50}
                            containerStyle={{
                                marginTop: 16,
                                width: 50,
                                height: 30,
                                borderRadius: 25,
                                padding: 2,
                            }}
                            circleStyle={{
                                width: 25,
                                height: 25,
                                borderRadius: 20,
                            }}
                        />
                    </View>
                    <View style={{ marginVertical: 15 }}>
                        <Text style={[styles.Title, { marginBottom: 10, fontFamily: 'SemiBold', fontSize: 16 }]}>Features</Text>
                        <View style={[styles.Flex, { gap: 5, }]}>
                            <View style={[styles.Width]}>
                                <Image
                                    source={Images.WIFI}
                                    style={styles.Icon}
                                />
                                <Text style={[styles.Title, styles.Smallest]}>WiFi</Text>
                            </View>
                            <View style={[styles.Width]}>
                                <Feather name="bluetooth" size={20} color={Colors.primary} />
                                <Text style={[styles.Title, styles.Smallest]}>Bluetooth</Text>
                            </View>
                            <View style={[styles.Width]}>
                                <Image
                                    source={Images.AC}
                                    style={styles.Icon}
                                />
                                <Text style={[styles.Title, styles.Smallest]}>AC</Text>
                            </View>
                            <View style={[styles.Width]}>
                                <Image
                                    source={Images.Petroll}
                                    style={styles.Icon}
                                />
                                <Text style={[styles.Title, styles.Smallest]}>Full Tank</Text>
                            </View>
                        </View>
                    </View>
                    <View style={{ marginTop: 10 }}>
                        <View style={[styles.Flex, { marginBottom: 10 }]}>
                            <Text style={styles.Title}>Reviews (124)</Text>
                            <TouchableOpacity>
                                <Text style={[styles.Title, { color: Colors.primary }]}>View All</Text>
                            </TouchableOpacity>
                        </View>
                        <View style={styles.ReviewBox}>
                            <View style={[styles.Flex,]}>
                                <View style={[styles.AlignCenter, { alignItems: 'flex-start' }]}>
                                    <Image
                                        source={Images.Profile}
                                        style={styles.Profile}
                                    />
                                    <View style={{ width: '80%' }}>
                                        <View style={[styles.Flex, { width: '100%', }]}>
                                            <Text style={styles.Title}>Sarah Johnson</Text>
                                            <StarRating
                                                rating={4.5}
                                                Size={18}
                                            />
                                        </View>
                                        <Text style={styles.ReviewDescription}>
                                            Amazing car and excellent service! The driver was professional and the vehicle was spotless. Highly recommended for business trips.
                                        </Text>
                                        <Text style={styles.Duration}>2 days ago</Text>
                                    </View>
                                </View>
                            </View>

                        </View>
                    </View>

                </View>
            </ScrollView>
            <View style={[styles.Fixed, { bottom: insets.bottom }]}>
                <View>
                    <Text style={styles.Heading}>$45/hour</Text>
                    <Text style={[styles.Title, { color: Colors.dark }]}>Total: $180 (4 hours)</Text>
                </View>
                <TouchableOpacity style={styles.Button} onPress={() => navigation.navigate("BookNow")}>
                    <Text style={[styles.Title, { color: Colors.white }]}>Book Now</Text>
                    <Image
                        source={Images.Left}
                        style={{ width: 25, height: 25, paddingTop: 2 }}
                        resizeMode='contain'
                    />
                </TouchableOpacity>
            </View>
            <CalendarModal
                visible={VisibleCalender !== 0 ? true : false}
                onClose={() => setVisibleCalender(0)}
                onSelectDate={(date: string) => VisibleCalender === 1 ? setSelectStartDate(date) : setSelectEndDate(date)}
                date={VisibleCalender === 1 ? selectStartDate : selectEndDate}
            />
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    TopBack: {
        width: '100%',
        paddingHorizontal: 15,
        position: 'absolute',
        zIndex: 2,
        top: '2%'
    },
    Image: {
        width: '100%',
        height: '100%',
        borderBottomLeftRadius: 20,
        borderBottomRightRadius: 20,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        // resizeMode:'contain'
    },
    ImageContainer: {
        width: width,
        // margin: 5,
        // paddingHorizontal: 5,
        alignSelf: 'center',

        overflow: 'hidden',

    },
    DateContainer: {
        borderWidth: 1,
        borderColor: Colors.darkwhite,
        width: '45%',
        paddingHorizontal: 10,
        borderRadius: 10,
        height: 70,
        gap: 5
    },
    Heading: {
        fontSize: 18,
        fontFamily: 'SemiBold',
        color: Colors.black
    },
    paginationContainer: {
        flexDirection: "row",
        justifyContent: "center",
        marginVertical: 10,
    },
    dot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: "#ccc",
        marginHorizontal: 4,
    },
    activeDot: {
        backgroundColor: Colors.primary,
        width: 8,
    },
    DetailsContainer: {
        paddingHorizontal: 15,
    },
    Flex: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    AlignCenter: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 5
    },
    Ratings: {
        backgroundColor: Colors.rating,
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderRadius: 120
    },
    Title: {
        color: Colors.black,
        fontSize: 14,
        fontFamily: 'regular',

    },
    Pricing: {
        width: '100%',
        backgroundColor: Colors.darkwhite,
        padding: 10,
        marginTop: 15,
        borderRadius: 20,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    PriceBox: {
        width: '30%',
        height: 60,
        backgroundColor: Colors.white,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: Colors.mediumDark,
        alignItems: 'center',
        justifyContent: 'center'
    },
    dark: {
        fontSize: 14,
        fontFamily: 'regular',
        color: Colors.dark
    },
    DriverContainer: {
        backgroundColor: Colors.white,
        padding: 15,
        marginTop: 20,
        borderWidth: 0.5,
        borderColor: Colors.mediumDark,
        borderRadius: 15,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    Icon: {
        width: 20,
        height: 20,
        resizeMode: 'contain'
    },
    Width: {
        width: '22%',
        alignItems: 'center',
        borderWidth: 2,
        paddingVertical: 10,
        borderRadius: 15,
        borderColor: Colors.border
    },
    Smallest: {
        fontSize: 12,
        color: Colors.dark
    },
    ReviewBox: {
        width: '100%',
        padding: 10,
        borderWidth: 1,
        borderColor: Colors.darkwhite,
        borderRadius: 15
    },
    Profile: {
        width: 50,
        height: 50,
        resizeMode: 'contain'
    },
    ReviewDescription: {
        width: '100%',
        alignSelf: 'flex-end',
        fontSize: 12,
        fontFamily: 'regular',
        color: Colors.dark,
        marginTop: 5
    },
    Duration: {
        fontSize: 12,
        fontFamily: 'regular',
        color: Colors.dark,
        marginTop: 5
    },
    Fixed: {
        paddingHorizontal: 15,
        paddingVertical: 15,
        backgroundColor: Colors.white,
        borderWidth: 2,
        borderColor: Colors.lightGray,
        position: 'absolute',
        zIndex: 20,
        bottom: 0,
        width: '100%',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    Button: {
        backgroundColor: Colors.primary,
        paddingVertical: 15,
        textAlign: 'center',
        alignItems: 'center',
        paddingHorizontal: 25,
        borderRadius: 10,
        flexDirection: 'row',
    },
    Box: {
        width: 40,
        height: 40,
        backgroundColor: Colors.darkwhite,
        borderRadius: 120,
        justifyContent: 'center',
        alignItems: 'center'
    }
});