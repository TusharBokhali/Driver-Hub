import { Images } from '@/assets/Images';
import Progress from '@/src/components/Progress';
import { RadioButton } from '@/src/components/RadioButton';
import { User } from '@/src/context/UserContext';
import { Colors } from '@/src/utils/Colors';
import { width } from '@/src/utils/Dimensions';
import { AsyncStorageService } from '@/src/utils/store';
import { Entypo } from '@expo/vector-icons';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import Ionicons from '@expo/vector-icons/Ionicons';
import * as DocumentPicker from "expo-document-picker";
import * as ImagePicker from "expo-image-picker";
import React, { useContext, useEffect, useMemo, useRef, useState } from 'react';
import { Alert, FlatList, Image, Pressable, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import ActionSheet from "react-native-actionsheet";
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { Menu, MenuOption, MenuOptions, MenuTrigger } from 'react-native-popup-menu';
import { SafeAreaView } from 'react-native-safe-area-context';
export default function BookNow({ navigation, route }: any) {
    const { carData } = route?.params || {};
    const [page, setPage] = useState<number>(0);
    const [Number, setNumber] = useState<string>('+91');
    const [Email, setEmail] = useState<string>('');
    const [Description, setDescription] = useState<string>('')
    const [NumberError, setNumberError] = useState<string>('')
    const [EmailError, setEmailError] = useState<string>('')
    const [AadharDocument, setAadharDocument] = useState<string>('');
    const [PanCardDocument, setPanCardDocument] = useState<string>('');
    const [BikeRc, setBikeRc] = useState<string>('');
    const [LightBill, setLightBill] = useState<string>('');
    const scrollRef = useRef<ScrollView>(null);
    const actionSheetRef = useRef<any>(null);
    const [documents, setdocuments] = useState('');
    const AutoFilHandle = useRef(true);
    const [NextPageAvailbleDisbled, setNextPageAvailbleDisbled] = useState(true)
    const DocumentAutoFill = useRef(true);
    const [selectPayment, setSelectPayment] = useState<any>(null);
    const { user, setUser, GlobalBooking, setGlobalBooking } = useContext<any>(User);

    const radioButtons = useMemo(() => ([
        {
            id: 1,
            label: 'online',
            value: 'Pay Online',
            image: Images.OnlinePayment,
            des: 'Card, UPI, Net Banking',
            offer: '5% OFF'
        },
        {
            id: 2,
            label: 'Pay at Service',
            value: 'Pay at Service',
            image: Images.OfflinePayment,
            des: 'Cash or Card on delivery',
            offer: null,
        }
    ]), []);

    const handleScroll = (e: any) => {
        const offsetX = e.nativeEvent.contentOffset.x;
        const newPage = Math.round(offsetX / width);
        setPage(newPage);
    };

    const goToNextPage = () => {
        if (page === 0) {
            if (!Email || Email.trim() === "") {
                setEmailError("Email is required");
                return;
            }

            setGlobalBooking((prev: any) => ({
                ...prev,
                des: Description?.trim(),
            }));
        }

        else if (page === 1) {
            const Obj = {
                light_bill: LightBill,
                aadhar_card: AadharDocument,
                bike_rc: BikeRc,
                pan_card: PanCardDocument,
            };

            setGlobalBooking((prev: any) => ({
                ...prev,
                ...Obj,
            }));

            AsyncStorageService.storeData("UserDocument", Obj)
                .then(() => console.log("Document Stored"))
                .catch(err => console.log("Store Error", err));
        }

        if (page < 3) {
            const nextPage = page + 1;
            scrollRef.current?.scrollTo({ x: nextPage * width, animated: true });
            setPage(nextPage);
        }
    };
    const goToPreviesPage = () => {
        if (page !== 0) {
            const nextPage = page - 1;
            scrollRef.current?.scrollTo({ x: nextPage * width, animated: true });
            setPage(nextPage);
            setNextPageAvailbleDisbled(false)
        }
    };

    const pickDocument = async (type: string) => {
        const result = await DocumentPicker.getDocumentAsync({
            type: ["image/*", "application/pdf"],
        });
        let uri = result?.assets[0]?.uri;
        const ext = uri.split('.').pop()?.toLowerCase();
        console.log(ext);

        if (!result?.canceled) {
            if (ext === 'jpg' || ext === 'jpeg' || ext === 'png') {
                if (type == 'aadhar') {
                    setAadharDocument(uri);
                } else if (type == 'pan') {
                    setPanCardDocument(uri)
                } else if (type == 'rc') {
                    setBikeRc(uri)
                } else if (type == 'lightbill') {
                    setLightBill(uri)
                }
            } else {
                Alert.alert("Error", "Please upload only image (JPG/PNG).");
            }
        }
    };

    const pickImageFromGallery = async (type: string) => {
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ['images'],
            allowsEditing: true,
            quality: 1,
        });

        console.log(result.assets[0].uri);
        if (!result.canceled) {
            if (type == 'aadhar') {

                setAadharDocument(result.assets[0].uri);
            } else if (type == 'pan') {
                setPanCardDocument(result.assets[0].uri)
            } else if (type == 'rc') {
                setBikeRc(result.assets[0].uri)
            } else if (type == 'lightbill') {
                setLightBill(result.assets[0].uri)
            }

        }
    };

    const openCamera = async (type: string) => {
        const result = await ImagePicker.launchCameraAsync({
            mediaTypes: ['images'],
            quality: 1,
        });

        if (!result.canceled) {
            if (type == 'aadhar') {
                setAadharDocument(result.assets[0].uri);
            } else if (type == 'pan') {
                setPanCardDocument(result.assets[0].uri)
            } else if (type == 'rc') {
                setBikeRc(result.assets[0].uri)
            } else if (type == 'lightbill') {
                setLightBill(result.assets[0].uri)
            }

        }
    };


    const openOptions = (type: string) => {
        setdocuments(type)
        actionSheetRef.current.show();
    };
    const autofill = () => {
        setNumber(user?.user?.phone ? `${user.user.phone}` : "");
        setEmail(user?.user?.email || "");
    };
    useEffect(() => {
        setNextPageAvailbleDisbled(true);

        if (page === 0) {

            if (Email?.length > 0) {
                if (!/^\S+@\S+\.\S+$/.test(Email)) {
                    setEmailError('Invalid email format');
                } else {
                    setEmailError('');
                }
            }


            if (Number?.length > 0) {
                if (!/\d{10}$/.test(Number)) {

                    setNumberError('Number by 10 digits');
                } else {
                    setNumberError('');
                }
            }

            if (
                Email?.length > 0 &&
                Number?.length > 0 &&
                EmailError === "" &&
                NumberError === ""
            ) {
                setNextPageAvailbleDisbled(false);
            }
        }

        if (page === 1) {
            let Datas = async () => {
                try {
                    let data = await AsyncStorageService.getItem("UserDocument");
                    console.log(data);
                    setAadharDocument(data?.aadhar_card || "");
                    setPanCardDocument(data?.pan_card || "");
                    setLightBill(data?.light_bill || "");

                } catch (error) {
                    console.log(error);
                }
            }
            if ((!AadharDocument || !PanCardDocument || !LightBill) && DocumentAutoFill.current) {
                Datas();
                DocumentAutoFill.current = false;
            }
            if (AadharDocument && PanCardDocument && LightBill) {
                setNextPageAvailbleDisbled(false);
            }
        }

        if (page === 2) {
            if (selectPayment !== null) {
                setNextPageAvailbleDisbled(false);
            }
        }

        if ((!Number || !Email) && AutoFilHandle.current) {
            autofill();
            AutoFilHandle.current = false;
        }

    }, [
        Email,
        Number,
        LightBill,
        AadharDocument,
        PanCardDocument,
        selectPayment,
        page,
        EmailError,
        NumberError
    ]);


    return (
        <SafeAreaView style={styles.conatiner}>
            <View style={styles.Header}>
                <TouchableOpacity onPress={() => {
                    if (page !== 0) {
                        goToPreviesPage()
                    } else {
                        navigation.goBack()
                    }
                }}>
                    <Ionicons name="arrow-back-outline" size={24} color="#374151" />
                </TouchableOpacity>
                <Text style={styles.Title}>Book Service</Text>
                <Menu>
                    <MenuTrigger>
                        <TouchableOpacity hitSlop={10}>
                            <Entypo name="dots-three-vertical" size={22} color="#374151" />
                        </TouchableOpacity>
                    </MenuTrigger>

                    <MenuOptions>
                        <MenuOption onSelect={() => console.log('Save pressed')}>
                            <Text style={{ color: 'black' }}>Save</Text>
                        </MenuOption>
                        <MenuOption onSelect={() => alert(`Save`)} text='Save' />

                    </MenuOptions>
                </Menu>
            </View>
            <Progress currentStep={page + 1} totalSteps={3} title='Service Details' />
            <ScrollView
                ref={scrollRef}
                horizontal
                pagingEnabled
                scrollEnabled={false}
                showsHorizontalScrollIndicator={false}
                onScroll={handleScroll}
                scrollEventThrottle={26}
                style={{ marginTop: 5, }}
                contentContainerStyle={{ paddingRight: 100, }}
            >

                <View style={[styles.DocumentContainer,]}>
                    <View style={styles.MainContent}>
                        <KeyboardAwareScrollView
                            contentContainerStyle={{ flexGrow: 1 }}
                            extraScrollHeight={65}
                            enableOnAndroid={true}
                            showsVerticalScrollIndicator={false}
                            keyboardShouldPersistTaps="handled"
                        >
                            <Text style={styles.Title}>Contact Information</Text>
                            <Text style={styles.Normal}>{"We'll use this to keep you updated"}</Text>
                            <View style={{ marginTop: 10, gap: 10 }}>
                                <View>
                                    <Text style={styles.Lable}>Mobile Number</Text>
                                    <View style={styles.InputConatiner}>
                                        <Image
                                            source={Images.Call}
                                            style={{ width: 20, height: 20 }}
                                        />
                                        <Text style={styles.Lable}>+91</Text>
                                        <TextInput
                                            placeholder='+91 000 000-0000'
                                            placeholderTextColor={Colors.placeHolder}
                                            style={styles.InputValue}
                                            keyboardType='phone-pad'
                                            returnKeyType='next'
                                            textContentType='telephoneNumber'
                                            maxLength={10}
                                            value={Number}
                                            onChangeText={setNumber}
                                        />
                                    </View>
                                    {
                                        NumberError &&
                                        <Text style={[styles.Normal, { color: Colors.red }]}>{NumberError}</Text>
                                    }
                                </View>

                                <View>
                                    <Text style={styles.Lable}>Email Address</Text>
                                    <View style={styles.InputConatiner}>
                                        <Image
                                            source={Images.Email}
                                            style={{ width: 20, height: 20 }}
                                        />
                                        <TextInput
                                            placeholder='your.email@example.com'
                                            placeholderTextColor={Colors.placeHolder}
                                            style={styles.InputValue}
                                            keyboardType='email-address'
                                            returnKeyType='next'
                                            textContentType='emailAddress'
                                            value={Email}
                                            onChangeText={setEmail}
                                        />
                                    </View>
                                    {
                                        EmailError &&
                                        <Text style={[styles.Normal, { color: Colors.red }]}>{EmailError}</Text>
                                    }
                                </View>
                                <View>
                                    <Text style={[styles.Title, { marginVertical: 10 }]}>Additional Details</Text>
                                    <View style={[styles.InputConatiner, { height: 150, alignItems: 'flex-start', }]}>

                                        <Image
                                            source={Images.comment}
                                            style={{ width: 15, height: 15, marginTop: '5%' }}

                                        />

                                        <TextInput
                                            placeholder='preferred time, location, or any special'
                                            placeholderTextColor={Colors.placeHolder}
                                            style={[styles.InputValue, { height: '100%', textAlignVertical: 'top' }]}
                                            keyboardType='web-search'
                                            multiline
                                            returnKeyType='next'
                                            value={Description}
                                            onChangeText={setDescription}
                                            textContentType='location'
                                        />
                                    </View>
                                </View>
                            </View>
                        </KeyboardAwareScrollView>
                    </View>
                </View>

                <View style={[styles.DocumentContainer,]}>
                    <View style={styles.MainContent}>
                        <Text style={[styles.Title, { marginBottom: 5 }]}>Verify Your Documents</Text>
                        <ScrollView
                            style={{ flexGrow: 1, }}
                            contentContainerStyle={{ paddingBottom: 100, gap: 20 }}
                        >
                            <View style={styles.DocumentBox}>
                                <Text style={styles.Lable}>Aadhar Card <Text style={{ color: Colors.red }}>*</Text></Text>
                                <TouchableOpacity style={styles.UploadButton} onPress={() => openOptions("aadhar")}>
                                    <Text style={[styles.InputValue, { color: Colors.white, marginBottom: 5, fontSize: 12 }]}>Upload Document</Text>
                                </TouchableOpacity>
                                <View style={styles.DocumentViewContainer}>
                                    {
                                        AadharDocument ?
                                            <Image
                                                source={{ uri: AadharDocument }}
                                                style={{ width: '100%', height: '100%' }}
                                                resizeMode='contain'
                                            />
                                            :

                                            <Image
                                                source={Images.DefaultUpload}
                                                style={{ width: 25, height: 25 }}
                                            />
                                    }
                                </View>
                                <Text style={[styles.Lable, { color: Colors.dark, fontSize: 12, marginVertical: 5 }]}>Please upload your Aadhar card document</Text>
                            </View>

                            <View style={styles.DocumentBox}>
                                <Text style={styles.Lable}>PAN Card <Text style={{ color: Colors.red }}>*</Text></Text>
                                <TouchableOpacity style={styles.UploadButton} onPress={() => openOptions("pan")}>
                                    <Text style={[styles.InputValue, { color: Colors.white, marginBottom: 5, fontSize: 12 }]}>Upload Document</Text>
                                </TouchableOpacity>
                                <View style={styles.DocumentViewContainer}>
                                    {
                                        PanCardDocument ?
                                            <Image
                                                source={{ uri: PanCardDocument }}
                                                style={{ width: '100%', height: '100%' }}
                                                resizeMode='contain'
                                            />
                                            :

                                            <Image
                                                source={Images.DefaultUpload}
                                                style={{ width: 25, height: 25 }}
                                            />
                                    }
                                </View>
                                <Text style={[styles.Lable, { color: Colors.dark, fontSize: 12, marginVertical: 5 }]}>Image quality too low. Please upload a clearer photo.</Text>
                            </View>

                            <View style={styles.DocumentBox}>
                                <Text style={styles.Lable}>Bike RC</Text>
                                <TouchableOpacity style={styles.UploadButton} onPress={() => openOptions("rc")}>
                                    <Text style={[styles.InputValue, { color: Colors.white, marginBottom: 5, fontSize: 12 }]}>Upload Document</Text>
                                </TouchableOpacity>
                                <View style={styles.DocumentViewContainer}>
                                    {
                                        BikeRc ?
                                            <Image
                                                source={{ uri: BikeRc }}
                                                style={{ width: '100%', height: '100%' }}
                                                resizeMode='contain'
                                            />
                                            :

                                            <Image
                                                source={Images.DefaultUpload}
                                                style={{ width: 25, height: 25 }}
                                            />
                                    }
                                </View>
                                <Text style={[styles.Lable, { color: Colors.dark, fontSize: 12, marginVertical: 5 }]}>Additional verification required. Please ensure all corners are visible.</Text>
                            </View>

                            <View style={styles.DocumentBox}>
                                <Text style={styles.Lable}>Light Bill <Text style={{ color: Colors.red }}>*</Text></Text>
                                <TouchableOpacity style={styles.UploadButton} onPress={() => openOptions("lightbill")}>
                                    <Text style={[styles.InputValue, { color: Colors.white, marginBottom: 5, fontSize: 12 }]}>Upload Document</Text>
                                </TouchableOpacity>
                                <View style={styles.DocumentViewContainer}>
                                    {
                                        LightBill ?
                                            <Image
                                                source={{ uri: LightBill }}
                                                style={{ width: '100%', height: '100%' }}
                                                resizeMode='contain'
                                            />
                                            :
                                            <Image
                                                source={Images.DefaultUpload}
                                                style={{ width: 25, height: 25 }}
                                            />
                                    }
                                </View>
                                <Text style={[styles.Lable, { color: Colors.dark, fontSize: 12, marginVertical: 5 }]}>Please upload your electricity bill document</Text>
                            </View>
                        </ScrollView>
                    </View>

                </View>

                <View style={[styles.DocumentContainer,]}>
                    <View style={styles.MainContent}>
                        <Text style={styles.Title}>Payment Method</Text>
                        <Text style={[styles.Lable, { marginVertical: 5 }]}>{"Choose how you'd like to pay for the service"}</Text>

                        <FlatList
                            data={radioButtons}
                            style={{ marginTop: 15 }}
                            contentContainerStyle={{ gap: 8 }}
                            renderItem={({ item, index: number }) => (
                                <Pressable style={styles.PaymentBox} onPress={() => setSelectPayment(item)}>
                                    <RadioButton
                                        selected={selectPayment?.id === item?.id}
                                        onPress={() => setSelectPayment(item)}

                                    />
                                    {/* <View> */}

                                    <Image
                                        source={item.image}
                                        style={{ width: 40, height: 40, }}
                                    />
                                    <View style={{ marginLeft: 15 }}>
                                        <Text style={[styles.Normal, { color: Colors.black, fontFamily: 'SemiBold', }]}>{item.value}</Text>
                                        <Text style={[styles.Lable, { marginVertical: 0, color: Colors.mediumDark }]}>{item.des}</Text>
                                    </View>
                                    {
                                        item?.offer &&
                                        <View style={styles.Offer}>
                                            <Text style={[styles.Title, { fontSize: 12, color: Colors.green }]}>{item?.offer}</Text>
                                        </View>
                                    }
                                    {/* </View> */}
                                </Pressable>
                            )}
                        />

                        <View style={styles.BoxPriceDetails}>
                            <Text style={styles.Title}>Service Summary</Text>
                            <View style={{ marginTop: 10 }}>
                                <View style={styles.Flex}>
                                    <Text style={styles.lables}>Vehicle Type</Text>
                                    <Text style={styles.value}>{carData?.vehicleType || ""}</Text>
                                </View>
                                <View style={styles.Flex}>
                                    <Text style={styles.lables}>Service Type</Text>
                                    <Text style={styles.value}>Basic Service</Text>
                                </View>
                                <View style={styles.Flex}>
                                    <Text style={styles.lables}>Features</Text>
                                    <Text style={styles.value}>{carData?.features?.join(",") || "-"}</Text>
                                </View>
                            </View>
                            <View style={styles.TopBorder}>
                                <Text style={styles.Title}>Estimated Cost</Text>
                                <Text style={[styles.Lable, { color: Colors.primary, fontFamily: 'SemiBold' }]}>₹1,299</Text>
                            </View>
                        </View>

                    </View>
                </View>

            </ScrollView>

            <View style={styles.Fixed}>
                <View style={styles.Flex}>
                    <Text style={styles.Normal}>Total:</Text>
                    <Text style={styles.Title}>$93.19</Text>
                </View>
                <TouchableOpacity disabled={NextPageAvailbleDisbled} style={[styles.BTN, { backgroundColor: NextPageAvailbleDisbled ? '#D1D5DB' : Colors.primary }]}
                    onPress={() => {
                        if (page === 2) {
                            navigation.replace('BookConfirm', { carData: carData });
                        } else {
                            goToNextPage()
                        }
                    }}
                >
                    {
                        page < 2 ?
                            <>
                                <Text style={[styles.Lable, { color: Colors.white }]}>Next</Text>
                                <FontAwesome5 name="arrow-right" size={16} color={Colors.white} />
                            </>
                            :
                            <>
                                <Image
                                    source={Images.Book}
                                    style={{ width: 15, height: 15 }}
                                />
                                <Text style={[styles.Lable, { color: Colors.white }]}>Book Service Now</Text>
                            </>
                    }
                </TouchableOpacity>

                <Text style={[styles.Normal, { textAlign: 'center', color: Colors.dark, fontSize: 12 }]}>By booking, you agree to our terms and </Text>
                <Text style={[styles.Normal, { textAlign: 'center', color: Colors.dark, fontSize: 12 }]}>conditions</Text>
            </View>
            <ActionSheet
                ref={actionSheetRef}
                // title={"Document Upload"}
                options={["Camera", "Gallery", "Document", "Cancel"]}
                cancelButtonIndex={3}
                onPress={(index: number) => {
                    if (index === 0) openCamera(documents);
                    if (index === 1) pickImageFromGallery(documents);
                    if (index === 2) pickDocument(documents);
                }}
            />

        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    conatiner: {
        flex: 1,

    },
    Header: {
        paddingHorizontal: 15,
        paddingVertical: 15,
        backgroundColor: Colors.white,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderBottomWidth: 0.5,
        borderColor: Colors.border1
    },
    Title: {
        fontSize: 16,
        color: Colors.black,
        fontFamily: 'SemiBold',
    },
    DocumentContainer: {
        width: width,
        paddingVertical: 10,
        paddingHorizontal: 15
    },
    MainContent: {
        width: '100%'
    },
    Normal: {
        fontSize: 14,
        color: Colors.dark,
        fontFamily: 'regular',

    },
    InputConatiner: {
        backgroundColor: Colors.darkwhite,
        paddingVertical: 5,
        paddingHorizontal: 15,
        borderWidth: 1,
        borderColor: Colors.Bookborder,
        borderRadius: 7,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10
    },
    InputValue: {
        fontSize: 14,
        fontFamily: 'regular',
        color: Colors.black,
        width: '80%'
    },
    Lable: {
        fontSize: 14,
        fontFamily: 'regular',
        marginVertical: 10,
        color: Colors.black
    },
    SimpleFlex: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10
    },
    Fixed: {
        paddingHorizontal: 15,
        paddingTop: 10,
        backgroundColor: Colors.white,
        borderTopWidth: 1,
        borderColor: Colors.Bookborder

    },
    BTN: {
        width: '100%',
        height: 50,
        borderRadius: 10,
        backgroundColor: Colors.primary,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 10,
        marginVertical: 5
    },
    Flex: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 5
    },
    DocumentBox: {
        width: '100%',
        backgroundColor: Colors.white,
        paddingVertical: 10,
        paddingHorizontal: 15,
        borderRadius: 7,
        marginTop: 5
    },
    DocumentViewContainer: {
        width: '100%',
        height: width / 2.5,
        backgroundColor: Colors.darkBorder,
        borderRadius: 7,
        justifyContent: 'center',
        alignItems: 'center',
    },
    UploadButton: {
        backgroundColor: Colors.primary,
        paddingVertical: 8,
        borderRadius: 7,
        alignSelf: 'flex-start',
        paddingHorizontal: 10,
        marginBottom: 10
    },
    PaymentBox: {
        width: '100%',
        paddingHorizontal: 15,
        paddingVertical: 15,
        backgroundColor: Colors.white,
        borderWidth: 2,
        borderColor: Colors.darkwhite,
        flexDirection: 'row',
        alignItems: 'center',
        borderRadius: 18,
    },
    BoxPriceDetails: {
        width: '100%',
        paddingVertical: 10,
        paddingHorizontal: 10,
        borderRadius: 12,
        borderColor: Colors.darkwhite,
        backgroundColor: Colors.white,
        marginTop: 10,
        borderWidth: 2,
    },
    lables: {
        fontSize: 14,
        fontFamily: 'regular',
        color: Colors.mediumDark,
    },
    value: {
        fontSize: 14,
        fontFamily: 'regular',
        color: Colors.black,
        textTransform:'capitalize'
    },
    TopBorder: {
        borderTopWidth: 1,
        borderColor: Colors.mediumDark,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginTop: 10
    },
    Offer: {
        backgroundColor: Colors.rating,
        paddingVertical: 5,
        paddingHorizontal: 10,
        borderRadius: 7,
        position: 'absolute',
        top: 0,
        right: 0,

    }

});