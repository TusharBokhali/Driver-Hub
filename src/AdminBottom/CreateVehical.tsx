import { Colors } from "@/src/utils/Colors";
import { Feather, Ionicons, MaterialCommunityIcons, MaterialIcons } from "@expo/vector-icons";
import { BlurView } from "expo-blur";
import * as Haptics from "expo-haptics";
import * as ImagePicker from "expo-image-picker";
import React, { useContext, useEffect, useRef, useState } from "react";
import {
    Alert,
    Dimensions,
    KeyboardAvoidingView,
    Modal,
    Platform,
    Pressable,
    ScrollView,
    StyleSheet,
    Switch,
    Text,
    TextInput,
    View
} from "react-native";
import Animated, {
    FadeIn,
    FadeInDown,
    Layout,
    SlideInRight,
    SlideOutLeft,
    interpolate,
    useAnimatedStyle,
    useSharedValue,
    withSpring,
    withTiming
} from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";
import { Api, baseUrl } from "../Api/Api";
import Loader from "../components/Loader";
import { AdminContextData } from "../context/AdminContext";
import { ToastShow } from "../context/ToastContext";






const { width } = Dimensions.get('window');



interface VehicleFormData {
    title: string;
    description: string;
    category: string;
    vehicleType: string;
    rentType: string;
    price: number | string;
    dailyPrice?: number | string;
    hourlyPrice?: number | string;
    perKmPrice?: number | string;
    driverRequired: boolean;
    driverAvailable: boolean;
    driverPrice: number | string;
    driverLabel: string;
    location: string;
    mileage: number | string;
    seats: number | string;
    transmission: string;
    fuelType: string;
    year: number | string;
    currency: string;
    isPublished: boolean;
    features: string[];
}

interface FormErrors {
    [key: string]: string;
}



export default function CreateVehicle({ navigation, route }: any) {
    const scrollRef = useRef<ScrollView>(null);
    const { data } = route?.params || {};

    const { AdminUser } = useContext(AdminContextData);
    const { setToast } = useContext(ToastShow);

    const [isLoading, setIsLoading] = useState(false);
    const [step, setStep] = useState(1);
    const totalSteps = 4;


    const [formData, setFormData] = useState<VehicleFormData>({
        title: "",
        description: "",
        category: "",
        vehicleType: "",
        rentType: "per_km",
        price: "",
        dailyPrice: "",
        hourlyPrice: "",
        perKmPrice: "",
        driverRequired: false,
        driverAvailable: false,
        driverPrice: "500",
        driverLabel: "with Driver",
        location: "",
        mileage: "",
        seats: "4",
        transmission: "manual",
        fuelType: "petrol",
        year: new Date().getFullYear().toString(),
        currency: "₹",
        isPublished: false,
        features: [],
    });

    // Additional states
    const [images, setImages] = useState<string[]>([]);
    const [errors, setErrors] = useState<FormErrors>({});
    const [FeaturesData, setFeaturesData] = useState<any[]>([]);
    // Modal states
    const [openCategory, setOpenCategory] = useState(false);
    const [openVehicleType, setOpenVehicleType] = useState(false);
    const [openFuelType, setOpenFuelType] = useState(false);
    const [openFeature, setOpenFeatures] = useState(false);
    const [openTransmission, setOpenTransmission] = useState(false);
    const [openRentType, setOpenRentType] = useState(false);

    // Animation values
    const cardScale = useSharedValue(1);
    const progressAnim = useSharedValue(0);

    /* ================= FORM HANDLERS ================= */

    const updateFormData = (field: keyof VehicleFormData, value: any) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));
        validateField(field, value);
    };



    const pickImages = async () => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
            Alert.alert('Permission Required', 'Please grant camera roll permissions to upload images.');
            return;
        }

        const res = await ImagePicker.launchImageLibraryAsync({
            allowsMultipleSelection: true,
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            quality: 0.8,
            allowsEditing: false,
            selectionLimit: 10 - images.length,
        });

        if (!res.canceled && res.assets.length > 0) {
            setImages(prev => [...prev, ...res.assets.map(a => a.uri)]);
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
            if (errors.images) {
                setErrors(prev => ({ ...prev, images: '' }));
            }
        }
    };

    const removeImage = (index: number) => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        setImages(prev => prev.filter((_, i) => i !== index));
    };


    useEffect(() => {
        if (!data) return;

        setFormData(prev => ({
            ...prev,


            title: data?.title ?? "",
            description: data?.description ?? "",
            category: data?.category ?? "",
            vehicleType: data?.vehicleType ?? "",
            rentType: data?.rentType ?? "per_km",


            price: data?.price ? String(data.price) : "",
            dailyPrice: data?.dailyPrice ? String(data.dailyPrice) : "",
            hourlyPrice: data?.hourlyPrice ? String(data.hourlyPrice) : "",
            perKmPrice: data?.perKmPrice ? String(data.perKmPrice) : "",


            driverRequired: Boolean(data?.driverRequired),
            driverAvailable: Boolean(data?.driverAvailable),
            driverPrice: data?.driverPrice ? String(data.driverPrice) : "",
            driverLabel: data?.driverPricing?.label ?? "with Driver",


            location: data?.location ?? "",
            mileage: data?.mileage ? String(data.mileage) : "",
            seats: data?.seats ? String(data.seats) : "4",
            transmission: data?.transmission ?? "manual",
            fuelType: data?.fuelType ?? "petrol",
            year: data?.year ? String(data.year) : new Date().getFullYear().toString(),


            currency: data?.currency ?? "₹",
            isPublished: Boolean(data?.isPublished),
        }));


        if (Array.isArray(data?.images)) {
            const imageUrls = data.images.map((img: any) =>
                img?.url?.startsWith("http")
                    ? img.url
                    : `${baseUrl}${img.url}`
            );
            setImages(imageUrls);
        }

    }, [data]);

    const validateField = (field: keyof VehicleFormData, value: any) => {
        const newErrors = { ...errors };

        switch (field) {
            case 'title':
                if (!value?.trim()) newErrors.title = 'Vehicle title is required';
                else if (value.length < 3) newErrors.title = 'Title must be at least 3 characters';
                else delete newErrors.title;
                break;

            case 'category':
                if (!value) newErrors.category = 'Please select category';
                else delete newErrors.category;
                break;

            case 'vehicleType':
                if (!value) newErrors.vehicleType = 'Please select vehicle type';
                else delete newErrors.vehicleType;
                break;

            case 'price':
                if (!value) newErrors.price = 'Price is required';
                else if (isNaN(Number(value)) || Number(value) <= 0) newErrors.price = 'Enter valid price';
                else delete newErrors.price;
                break;

            case 'location':
                if (!value?.trim()) newErrors.location = 'Location is required';
                else delete newErrors.location;
                break;

            case 'mileage':
                if (value && (isNaN(Number(value)) || Number(value) < 0)) {
                    newErrors.mileage = 'Enter valid mileage';
                } else delete newErrors.mileage;
                break;

            case 'seats':
                if (!value) newErrors.seats = 'Seats count is required';
                else if (isNaN(Number(value)) || Number(value) < 1) newErrors.seats = 'Enter valid seats count';
                else delete newErrors.seats;
                break;

            case 'year':
                if (!value) newErrors.year = 'Manufacturing year is required';
                else if (isNaN(Number(value)) || Number(value) < 1900 || Number(value) > new Date().getFullYear() + 1) {
                    newErrors.year = 'Enter valid year';
                } else delete newErrors.year;
                break;

            case 'driverPrice':
                if ((formData.driverRequired || formData.driverAvailable) && (!value || isNaN(Number(value)) || Number(value) <= 0)) {
                    newErrors.driverPrice = 'Enter valid driver price';
                } else delete newErrors.driverPrice;
                break;

            default:
                break;
        }

        setErrors(newErrors);
    };

    const validateStep = (stepNumber: number): boolean => {
        const newErrors: FormErrors = {};

        switch (stepNumber) {
            case 1:
                if (!images.length) newErrors.images = 'Add at least one image';
                if (!formData.title.trim()) newErrors.title = 'Vehicle title is required';
                if (!formData.category) newErrors.category = 'Please select category';
                if (!formData.vehicleType) newErrors.vehicleType = 'Please select vehicle type';
                if (!formData.location.trim()) newErrors.location = 'Location is required';
                break;

            case 2:
                if (!formData.seats) newErrors.seats = 'Seats count is required';
                if (!formData.year) newErrors.year = 'Manufacturing year is required';
                if (!formData.fuelType) newErrors.fuelType = 'Please select fuel type';
                if (!formData.transmission) newErrors.transmission = 'Please select transmission';
                break;

            case 3:
                if (!formData.price || isNaN(Number(formData.price)) || Number(formData.price) <= 0) {
                    newErrors.price = 'Enter valid base price';
                }
                if ((formData.driverRequired || formData.driverAvailable) &&
                    (!formData.driverPrice || isNaN(Number(formData.driverPrice)) || Number(formData.driverPrice) <= 0)) {
                    newErrors.driverPrice = 'Enter valid driver price';
                }
                break;
        }

        setErrors(newErrors);

        if (Object.keys(newErrors).length > 0) {
            // Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
            scrollRef.current?.scrollTo({ y: 0, animated: true });

            cardScale.value = withSpring(1.02, {
                damping: 3,
                stiffness: 400
            });
            setTimeout(() => {
                cardScale.value = withSpring(1);
            }, 150);

            return false;
        }
        return true;
    };

    const nextStep = () => {
        if (validateStep(step)) {

            setStep(prev => {
                const next = prev + 1;
                progressAnim.value = withTiming((next - 1) / (totalSteps - 1));
                return next;
            });
        }
    };

    const prevStep = () => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        setStep(prev => {
            const previous = prev - 1;
            progressAnim.value = withTiming((previous - 1) / (totalSteps - 1));
            return previous;
        });
    };

    const onCreateVehicle = async () => {
        if (!validateStep(4)) return;

        setIsLoading(true);
        cardScale.value = withTiming(0.98, { duration: 100 });

        try {
            const formDataToSend = new FormData();

            formDataToSend.append("title", formData.title);
            formDataToSend.append("description", formData.description || "");
            formDataToSend.append("category", formData.category);
            formDataToSend.append("vehicleType", formData.vehicleType);
            formDataToSend.append("rentType", formData.rentType);
            formDataToSend.append("price", String(formData.price));
            FeaturesData.forEach(feature => {
                formDataToSend.append("features[]", feature);
            });

            if (formData.dailyPrice) {
                formDataToSend.append("dailyPrice", String(formData.dailyPrice));
            }
            if (formData.hourlyPrice) {
                formDataToSend.append("hourlyPrice", String(formData.hourlyPrice));
            }
            if (formData.perKmPrice) {
                formDataToSend.append("perKmPrice", String(formData.perKmPrice));
            }

            formDataToSend.append("driverRequired", String(formData.driverRequired));
            formDataToSend.append("driverAvailable", String(formData.driverAvailable));
            formDataToSend.append(
                "driverPrice",
                formData.driverAvailable ? String(formData.driverPrice) : "0"
            );
            // formDataToSend.append("driverLabel", formData.driverLabel || "");

            formDataToSend.append("location", formData.location || "");
            formDataToSend.append("mileage", String(formData.mileage || 0));
            formDataToSend.append("seats", String(formData.seats || 4));
            formDataToSend.append("transmission", formData.transmission || "automatic");
            formDataToSend.append("fuelType", formData.fuelType || "petrol");
            formDataToSend.append(
                "year",
                String(formData.year || new Date().getFullYear())
            );
            formDataToSend.append("currency", formData.currency || "₹");
            formDataToSend.append("isPublished", String(formData.isPublished));
            formDataToSend.append("owner", "");

            // ⚠️ CRITICAL FIX 1: Image URI Format
            images.forEach((uri, index) => {
                if (!uri) return;

                const finalUri =
                    Platform.OS === "android"
                        ? uri.startsWith("file://")
                            ? uri
                            : `file://${uri}`
                        : uri;

                formDataToSend.append("images", {
                    uri: finalUri,
                    name: `vehicle_${Date.now()}_${index}.jpg`,
                    type: "image/jpeg",
                } as any);
            });


            // Debug logging
            console.log("===== VEHICLE CREATE DEBUG =====");
            console.log("API URL:", Api.AllVehical);
            console.log("Vehicle Type:", formData.vehicleType);
            console.log("Rent Type:", formData.rentType);
            console.log("Images Count:", images.length);
            console.log("Token exists:", !!AdminUser?.token);
            console.log("Token length:", AdminUser?.token?.length);
            console.log("Token length:", formDataToSend);


            const response = await fetch(Api.AllVehical, {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${AdminUser?.token}`,

                },
                body: formDataToSend,
            });

            // Check response status
            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                const errorMessage = errorData.message || `HTTP error! status: ${response.status}`;
                console.error("API Error Response:", errorData);
                throw new Error(errorMessage);
            }

            const responseData = await response.json();

            if (!responseData?.status && !responseData?.success) {
                throw new Error(responseData?.message || "Vehicle creation failed");
            }

            // Success
            setToast({
                visible: true,
                type: "success",
                message: responseData?.message || "🚗 Vehicle created successfully!",
            });

            setTimeout(() => {
                setFormData({
                    title: "",
                    description: "",
                    category: "",
                    vehicleType: "",
                    rentType: "per_km",
                    price: "",
                    dailyPrice: "",
                    hourlyPrice: "",
                    perKmPrice: "",
                    driverRequired: false,
                    driverAvailable: false,
                    driverPrice: "0",
                    driverLabel: "with Driver",
                    location: "",
                    mileage: "",
                    seats: "4",
                    transmission: "manual",
                    fuelType: "petrol",
                    year: new Date().getFullYear().toString(),
                    currency: "₹",
                    isPublished: false,
                    features: [],
                });
                setImages([]);
                setErrors({});
                setStep(1);
                progressAnim.value = 0;
                scrollRef.current?.scrollTo({ y: 0, animated: true });
            }, 800);
            navigation.goBack();
        } catch (error: any) {
            console.error("=== VEHICLE CREATION ERROR ===");
            console.error("Error:", error);
            console.error("Error Message:", error?.message);

            // Detailed error logging
            if (error?.response) {
                console.error("Response Status:", error.response.status);
                console.error("Response Data:", JSON.stringify(error.response.data, null, 2));
            }

            setToast({
                visible: true,
                type: "error",
                message:
                    error?.response?.data?.message ||
                    error?.message ||
                    "Failed to create vehicle",
            });
        } finally {
            setIsLoading(false);
            cardScale.value = withSpring(1);
        }
    };

    const VehicalUpdate = async () => {
        if (!validateStep(4)) return;

        setIsLoading(true);
        cardScale.value = withTiming(0.98, { duration: 100 });

        try {
            const vehicleId = data?._id;
            if (!vehicleId) {
                throw new Error("Vehicle ID not found");
            }

            const formDataToSend = new FormData();

            formDataToSend.append("title", formData.title);
            formDataToSend.append("description", formData.description || "");
            formDataToSend.append("category", formData.category);
            formDataToSend.append("vehicleType", formData.vehicleType);
            formDataToSend.append("rentType", formData.rentType);
            formDataToSend.append("price", String(formData.price));

            if (formData.dailyPrice) {
                formDataToSend.append("dailyPrice", String(formData.dailyPrice));
            }
            if (formData.hourlyPrice) {
                formDataToSend.append("hourlyPrice", String(formData.hourlyPrice));
            }
            if (formData.perKmPrice) {
                formDataToSend.append("perKmPrice", String(formData.perKmPrice));
            }


            formDataToSend.append("driverRequired", String(formData.driverRequired));
            formDataToSend.append("driverAvailable", String(formData.driverAvailable));
            formDataToSend.append(
                "driverPrice",
                formData.driverAvailable ? String(formData.driverPrice) : "0"
            );


            formDataToSend.append("location", formData.location || "");
            formDataToSend.append("mileage", String(formData.mileage || 0));
            formDataToSend.append("seats", String(formData.seats || 4));
            formDataToSend.append(
                "transmission",
                formData.transmission || "automatic"
            );
            formDataToSend.append("fuelType", formData.fuelType || "petrol");
            formDataToSend.append(
                "year",
                String(formData.year || new Date().getFullYear())
            );

            formDataToSend.append("currency", formData.currency || "₹");
            formDataToSend.append("isPublished", String(formData.isPublished));


            images.forEach((uri, index) => {

                if (!uri || uri.startsWith("http")) return;

                const finalUri =
                    Platform.OS === "android"
                        ? uri.startsWith("file://")
                            ? uri
                            : `file://${uri}`
                        : uri;

                formDataToSend.append("images", {
                    uri: finalUri,
                    name: `vehicle_${Date.now()}_${index}.jpg`,
                    type: "image/jpeg",
                } as any);
            });

            const response = await fetch(`${Api.AllVehical}/${vehicleId}`, {
                method: "PUT",
                headers: {
                    Authorization: `Bearer ${AdminUser?.token}`,
                },
                body: formDataToSend,
            });

            const responseData = await response.json();

            if (!response.ok || (!responseData?.status && !responseData?.success)) {
                console.error("API Error:", responseData);
                throw new Error(responseData?.message || "Vehicle update failed");
            }

            /* ===== SUCCESS ===== */
            setToast({
                visible: true,
                type: "success",
                message: responseData?.message || "🚗 Vehicle updated successfully!",
            });

            navigation.goBack();

        } catch (error: any) {
            console.error("=== VEHICLE UPDATE ERROR ===");
            console.error("Message:", error?.message);

            setToast({
                visible: true,
                type: "error",
                message: error?.message || "Failed to update vehicle",
            });
        } finally {
            setIsLoading(false);
            cardScale.value = withSpring(1);
        }
    };




    const animatedSubmitStyle = useAnimatedStyle(() => {
        return {
            transform: [{ scale: cardScale.value }],
        };
    });

    const progressStyle = useAnimatedStyle(() => {
        return {
            width: `${progressAnim.value * 100}%`,
        };
    });


    const renderProgressBar = () => (
        <Animated.View entering={FadeInDown} style={styles.progressContainer}>
            <View style={styles.progressBackground}>
                <Animated.View style={[styles.progressFill, progressStyle]} />
            </View>
            <View style={styles.stepIndicator}>
                {[1, 2, 3, 4].map((stepNum) => (
                    <View key={stepNum} style={styles.stepContainer}>
                        <View style={[
                            styles.stepCircle,
                            step >= stepNum && styles.stepCircleActive
                        ]}>
                            {step > stepNum ? (
                                <Feather name="check" size={16} color="#fff" />
                            ) : (
                                <Text style={[
                                    styles.stepText,
                                    step >= stepNum && styles.stepTextActive
                                ]}>
                                    {stepNum}
                                </Text>
                            )}
                        </View>
                        <Text style={styles.stepLabel}>
                            {stepNum === 1 ? 'Basic' :
                                stepNum === 2 ? 'Specs' :
                                    stepNum === 3 ? 'Pricing' :
                                        'Review'}
                        </Text>
                    </View>
                ))}
            </View>
        </Animated.View>
    );

    const renderStep1 = () => (
        <Animated.View>
            {/* Image Upload */}
            <Animated.View style={[styles.card, styles.cardElevated]}>
                <View style={styles.cardHeader}>
                    <MaterialIcons name="photo-library" size={24} color={Colors.primary} />
                    <Text style={styles.cardTitle}>Vehicle Images *</Text>
                    {errors.images && (
                        <Animated.Text style={styles.errorText}>
                            {errors.images}
                        </Animated.Text>
                    )}
                </View>

                <Pressable onPress={pickImages} style={styles.imageAdd}>
                    <Animated.View style={styles.imageAddInner}>
                        <Ionicons name="cloud-upload-outline" size={40} color={Colors.primary} />
                        <Text style={styles.imageAddText}>Upload Images</Text>
                        <Text style={styles.imageAddSubtext}>Max 10 images • JPG, PNG</Text>
                    </Animated.View>
                </Pressable>

                {images.length > 0 && (
                    <Animated.View style={styles.imageGrid}>
                        {images.map((uri, index) => (
                            <Animated.View key={index} style={styles.imageContainer}>
                                <Animated.Image source={{ uri }} style={styles.image} />
                                <Pressable onPress={() => removeImage(index)} style={styles.removeButton}>
                                    <Feather name="x" size={16} color="#fff" />
                                </Pressable>
                                <View style={styles.imageBadge}>
                                    <Text style={styles.imageBadgeText}>{index + 1}</Text>
                                </View>
                            </Animated.View>
                        ))}
                        {images.length < 10 && (
                            <Pressable onPress={pickImages} style={styles.addMoreButton}>
                                <Feather name="plus" size={24} color={Colors.primary} />
                            </Pressable>
                        )}
                    </Animated.View>
                )}
            </Animated.View>

            {/* Basic Info */}
            <Animated.View style={[styles.card, styles.cardElevated]}>
                <View style={styles.cardHeader}>
                    <MaterialIcons name="info" size={24} color={Colors.primary} />
                    <Text style={styles.cardTitle}>Basic Information</Text>
                </View>

                <Field
                    label="Vehicle Title *"
                    value={formData.title}
                    onChangeText={(text: string) => updateFormData('title', text)}
                    error={errors.title}
                    placeholder="Enter vehicle name"
                    icon="car"
                />

                <Field
                    label="Description"
                    value={formData.description}
                    onChangeText={(text: string) => updateFormData('description', text)}
                    placeholder="Enter vehicle description"
                    multiline
                    numberOfLines={3}
                    icon="document-text"
                />

                <Field
                    label="Location *"
                    value={formData.location}
                    onChangeText={(text: string) => updateFormData('location', text)}
                    error={errors.location}
                    placeholder="Enter vehicle location"
                    icon="location"
                />
            </Animated.View>

            {/* Category & Type */}
            <Animated.View style={[styles.card, styles.cardElevated]}>
                <View style={styles.cardHeader}>
                    <MaterialIcons name="category" size={24} color={Colors.primary} />
                    <Text style={styles.cardTitle}>Classification</Text>
                </View>

                <Select
                    label="Category *"
                    value={formData.category}
                    onPress={() => setOpenCategory(true)}
                    error={errors.category}
                    icon="grid"
                />
                <Select
                    label="Vehicle Type *"
                    value={formData.vehicleType}
                    onPress={() => setOpenVehicleType(true)}
                    error={errors.vehicleType}
                    icon="car-sport"
                />
                <Select
                    label="Features *"
                    value={""}
                    onPress={() => setOpenFeatures(true)}
                    error={errors.vehicleType}
                    icon="bag-check"
                />
            </Animated.View>
            <View style={styles.Flex}>
                {
                    FeaturesData?.map((el, index) => (
                        <Pressable key={`${el}-${index}`} style={styles.featureChip} onPress={() => setFeaturesData(pre => pre.filter(item => item !== el))}>
                            <Text style={styles.featureText}>{el}</Text>
                            <Pressable
                                onPress={() =>
                                    setFeaturesData((prev: string[]) =>
                                        prev.filter(item => item !== el)
                                    )
                                }
                                hitSlop={10}
                                style={styles.removeBtn}
                            >
                                <Text style={styles.removeText}>✕</Text>
                            </Pressable>
                        </Pressable>
                    ))
                }
            </View>
        </Animated.View>
    );

    const renderStep2 = () => (
        <Animated.View>
            {/* Specifications */}
            <Animated.View style={[styles.card, styles.cardElevated]}>
                <View style={styles.cardHeader}>
                    <MaterialCommunityIcons name="car-info" size={24} color={Colors.primary} />
                    <Text style={styles.cardTitle}>Specifications</Text>
                </View>

                <View style={styles.specGrid}>
                    <Field
                        label="Seats *"
                        value={formData.seats}
                        onChangeText={(text: string) => updateFormData('seats', text)}
                        error={errors.seats}
                        placeholder="4"
                        keyboardType="numeric"
                        icon="people"
                        containerStyle={styles.specField}
                    />
                    <Field
                        label="Year *"
                        value={formData.year}
                        onChangeText={(text: string) => updateFormData('year', text)}
                        error={errors.year}
                        placeholder="2024"
                        keyboardType="numeric"
                        icon="calendar"
                        containerStyle={styles.specField}
                    />
                </View>

                <View style={styles.specGrid}>
                    <Field
                        label="Mileage (km/l)"
                        value={formData.mileage}
                        onChangeText={(text: string) => updateFormData('mileage', text)}
                        error={errors.mileage}
                        placeholder="20"
                        keyboardType="numeric"
                        icon="speedometer"
                        containerStyle={styles.specField}
                    />
                </View>

                <Select
                    label="Fuel Type *"
                    value={formData.fuelType}
                    onPress={() => setOpenFuelType(true)}
                    error={errors.fuelType}
                    icon="fuel"
                />
                <Select
                    label="Transmission *"
                    value={formData.transmission}
                    onPress={() => setOpenTransmission(true)}
                    error={errors.transmission}
                    icon="settings"
                />
            </Animated.View>

            {/* Rent Type */}
            <Animated.View style={[styles.card, styles.cardElevated]}>
                <View style={styles.cardHeader}>
                    <MaterialIcons name="attach-money" size={24} color={Colors.primary} />
                    <Text style={styles.cardTitle}>Rent Type</Text>
                </View>

                <Select
                    label="Rent Type"
                    value={formData.rentType}
                    onPress={() => setOpenRentType(true)}
                    icon="calendar"
                />

                {formData.rentType === 'daily' && (
                    <Field
                        label="Daily Price"
                        value={formData.dailyPrice}
                        onChangeText={(text: string) => updateFormData('dailyPrice', text)}
                        placeholder="Enter daily price"
                        keyboardType="numeric"
                        icon="sunny"
                        prefix={formData.currency}
                    />
                )}

                {formData.rentType === 'hourly' && (
                    <Field
                        label="Hourly Price"
                        value={formData.hourlyPrice}
                        onChangeText={(text: string) => updateFormData('hourlyPrice', text)}
                        placeholder="Enter hourly price"
                        keyboardType="numeric"
                        icon="time"
                        prefix={formData.currency}
                    />
                )}

                {formData.rentType === 'per_km' && (
                    <Field
                        label="Per KM Price"
                        value={formData.perKmPrice}
                        onChangeText={(text: string) => updateFormData('perKmPrice', text)}
                        placeholder="Enter per km price"
                        keyboardType="numeric"
                        icon="navigate"
                        prefix={formData.currency}
                    />
                )}
            </Animated.View>
        </Animated.View>
    );

    const renderStep3 = () => (
        <Animated.View >
            {/* Pricing */}
            <Animated.View style={[styles.card, styles.cardElevated]}>
                <View style={styles.cardHeader}>
                    <MaterialIcons name="payments" size={24} color={Colors.primary} />
                    <Text style={styles.cardTitle}>Pricing Details</Text>
                </View>

                <Field
                    label="Base Price *"
                    value={formData.price}
                    onChangeText={(text: string) => updateFormData('price', text)}
                    error={errors.price}
                    placeholder="Enter base price"
                    keyboardType="numeric"
                    icon="pricetag"
                    prefix={formData.currency}
                />

                <View style={styles.priceGrid}>
                    <Field
                        label="Daily Price"
                        value={formData.dailyPrice}
                        onChangeText={(text: string) => updateFormData('dailyPrice', text)}
                        placeholder="0"
                        keyboardType="numeric"
                        icon="sunny"
                        prefix={formData.currency}
                        containerStyle={styles.halfField}
                    />
                    <Field
                        label="Hourly Price"
                        value={formData.hourlyPrice}
                        onChangeText={(text: string) => updateFormData('hourlyPrice', text)}
                        placeholder="0"
                        keyboardType="numeric"
                        icon="time"
                        prefix={formData.currency}
                        containerStyle={styles.halfField}
                    />
                </View>

                <Field
                    label="Per KM Price"
                    value={formData.perKmPrice}
                    onChangeText={(text: string) => updateFormData('perKmPrice', text)}
                    placeholder="0"
                    keyboardType="numeric"
                    icon="navigate"
                    prefix={formData.currency}
                />
            </Animated.View>

            {/* Driver Options */}
            <Animated.View style={[styles.card, styles.cardElevated]}>
                <View style={styles.cardHeader}>
                    <MaterialIcons name="person" size={24} color={Colors.primary} />
                    <Text style={styles.cardTitle}>Driver Options</Text>
                </View>

                <View style={styles.switchContainer}>
                    <View style={styles.switchLabel}>
                        <Feather name="user-check" size={20} color="#64748B" />
                        <Text style={styles.switchText}>Driver Required</Text>
                    </View>
                    <Switch
                        value={formData.driverRequired}
                        onValueChange={(value) => updateFormData('driverRequired', value)}
                        trackColor={{ false: '#e2e8f0', true: Colors.primary }}
                        thumbColor="#fff"
                    />
                </View>

                <View style={styles.switchContainer}>
                    <View style={styles.switchLabel}>
                        <Feather name="user-plus" size={20} color="#64748B" />
                        <Text style={styles.switchText}>Driver Available</Text>
                    </View>
                    <Switch
                        value={formData.driverAvailable}
                        onValueChange={(value) => updateFormData('driverAvailable', value)}
                        trackColor={{ false: '#e2e8f0', true: Colors.primary }}
                        thumbColor="#fff"
                    />
                </View>

                {(formData.driverRequired || formData.driverAvailable) && (
                    <Animated.View
                        entering={SlideInRight}
                        exiting={SlideOutLeft}
                        layout={Layout.springify()}
                    >
                        <Field
                            label="Driver Price *"
                            value={formData.driverPrice}
                            onChangeText={(text: string) => updateFormData('driverPrice', text)}
                            error={errors.driverPrice}
                            placeholder="Enter driver charges"
                            keyboardType="numeric"
                            icon="cash"
                            prefix={formData.currency}
                        />
                    </Animated.View>
                )}
            </Animated.View>
        </Animated.View>
    );

    const renderStep4 = () => (
        <Animated.View >
            {/* Review */}
            <Animated.View style={[styles.card, styles.cardElevated]}>
                <View style={styles.cardHeader}>
                    <Feather name="check-circle" size={24} color={Colors.primary} />
                    <Text style={styles.cardTitle}>Review Details</Text>
                </View>

                <View style={styles.reviewSection}>
                    <Text style={styles.reviewTitle}>Vehicle Information</Text>
                    <View style={styles.reviewRow}>
                        <Text style={styles.reviewLabel}>Title:</Text>
                        <Text style={styles.reviewValue}>{formData.title || "-"}</Text>
                    </View>
                    <View style={styles.reviewRow}>
                        <Text style={styles.reviewLabel}>Category:</Text>
                        <Text style={styles.reviewValue}>{formData.category || "-"}</Text>
                    </View>
                    <View style={styles.reviewRow}>
                        <Text style={styles.reviewLabel}>Type:</Text>
                        <Text style={styles.reviewValue}>{formData.vehicleType || "-"}</Text>
                    </View>
                    <View style={styles.reviewRow}>
                        <Text style={styles.reviewLabel}>Location:</Text>
                        <Text style={styles.reviewValue}>{formData.location || "-"}</Text>
                    </View>
                </View>

                <View style={styles.reviewSection}>
                    <Text style={styles.reviewTitle}>Specifications</Text>
                    <View style={styles.reviewRow}>
                        <Text style={styles.reviewLabel}>Seats:</Text>
                        <Text style={styles.reviewValue}>{formData.seats || "-"}</Text>
                    </View>
                    <View style={styles.reviewRow}>
                        <Text style={styles.reviewLabel}>Year:</Text>
                        <Text style={styles.reviewValue}>{formData.year || "-"}</Text>
                    </View>
                    <View style={styles.reviewRow}>
                        <Text style={styles.reviewLabel}>Fuel Type:</Text>
                        <Text style={styles.reviewValue}>{formData.fuelType || "-"}</Text>
                    </View>
                    <View style={styles.reviewRow}>
                        <Text style={styles.reviewLabel}>Transmission:</Text>
                        <Text style={styles.reviewValue}>{formData.transmission || "-"}</Text>
                    </View>
                </View>

                <View style={styles.reviewSection}>
                    <Text style={styles.reviewTitle}>Pricing</Text>
                    <View style={styles.reviewRow}>
                        <Text style={styles.reviewLabel}>Base Price:</Text>
                        <Text style={styles.reviewValue}>{formData.currency}{formData.price || "-"}</Text>
                    </View>
                    <View style={styles.reviewRow}>
                        <Text style={styles.reviewLabel}>Rent Type:</Text>
                        <Text style={styles.reviewValue}>{formData.rentType || "-"}</Text>
                    </View>
                    {(formData.driverRequired || formData.driverAvailable) && (
                        <View style={styles.reviewRow}>
                            <Text style={styles.reviewLabel}>Driver Price:</Text>
                            <Text style={styles.reviewValue}>{formData.currency}{formData.driverPrice}</Text>
                        </View>
                    )}
                </View>

                <View style={styles.reviewSection}>
                    <Text style={styles.reviewTitle}>Images</Text>
                    <Text style={styles.reviewValue}>{images.length} image(s) uploaded</Text>
                </View>
            </Animated.View>
        </Animated.View>
    );

    const renderNavigation = () => (
        <Animated.View style={styles.navigationContainer}>
            {step > 1 && (
                <Pressable
                    onPress={prevStep}
                    style={({ pressed }) => [
                        styles.navButton,
                        styles.navButtonSecondary,
                        pressed && styles.pressed
                    ]}
                >
                    <Feather name="arrow-left" size={20} color={Colors.primary} />
                    <Text style={styles.navButtonTextSecondary}>Previous</Text>
                </Pressable>
            )}

            {step < totalSteps ? (
                <Pressable
                    onPress={nextStep}
                    style={({ pressed }) => [
                        styles.navButton,
                        styles.navButtonPrimary,
                        pressed && styles.pressed
                    ]}
                >
                    <Text style={styles.navButtonText}>Next</Text>
                    <Feather name="arrow-right" size={20} color="#fff" />
                </Pressable>
            ) : (
                <Animated.View style={[styles.submitButton, animatedSubmitStyle]}>
                    <Pressable
                        onPress={() => data ? VehicalUpdate() : onCreateVehicle()}
                        style={({ pressed }) => [
                            styles.submitPressable,
                            pressed && styles.submitPressed
                        ]}
                    >
                        <Feather name="check-circle" size={18} color="#fff" />
                        <Text style={styles.submitText}>{data ? "Update Vehical" : "Create Vehicle"}</Text>
                    </Pressable>
                </Animated.View>
            )}
        </Animated.View>
    );

    return (
        <SafeAreaView style={styles.root}>
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={styles.keyboardView}
            >
                <Animated.View entering={FadeIn.duration(800)}>
                    <View style={styles.header}>
                        <Text style={styles.headerTitle}>Add New Vehicle</Text>
                        <Text style={styles.headerSubtitle}>Step {step} of {totalSteps}</Text>
                    </View>
                    {renderProgressBar()}
                </Animated.View>

                <ScrollView
                    ref={scrollRef}
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={styles.scrollContent}
                >
                    {step === 1 && renderStep1()}
                    {step === 2 && renderStep2()}
                    {step === 3 && renderStep3()}
                    {step === 4 && renderStep4()}

                    <View style={{ height: 100 }} />
                </ScrollView>

            </KeyboardAvoidingView>
            {renderNavigation()}
            {/* Modals */}
            <CategoryModal
                visible={openCategory}
                onClose={() => setOpenCategory(false)}
                onSelect={(value: any) => {
                    updateFormData('category', value);
                    setOpenCategory(false);
                }}
            />
            <VehicleTypeModal
                visible={openVehicleType}
                onClose={() => setOpenVehicleType(false)}
                onSelect={(value: any) => {
                    updateFormData('vehicleType', value);
                    setOpenVehicleType(false);
                }}
            />
            <FeaturesModal
                visible={openFeature}
                onClose={() => setOpenFeatures(false)}
                onSelect={(value: any[]) => {
                    setFeaturesData((prev: any[]) => {
                        const merged = [...FeaturesData];
                        merged.push(value)
                        return Array.from(new Set(merged));
                    });

                    setOpenFeatures(false);
                }}
            />
            <FuelTypeModal
                visible={openFuelType}
                onClose={() => setOpenFuelType(false)}
                onSelect={(value: any) => {
                    updateFormData('fuelType', value);
                    setOpenFuelType(false);
                }}
            />
            <TransmissionModal
                visible={openTransmission}
                onClose={() => setOpenTransmission(false)}
                onSelect={(value: any) => {
                    updateFormData('transmission', value);
                    setOpenTransmission(false);
                }}
            />
            <RentTypeModal
                visible={openRentType}
                onClose={() => setOpenRentType(false)}
                onSelect={(value: any) => {
                    updateFormData('rentType', value);
                    setOpenRentType(false);
                }}
            />

            <Loader visible={isLoading} />

        </SafeAreaView>
    );
}



const Field = ({
    label,
    value,
    onChangeText,
    error,
    placeholder,
    icon,
    prefix,
    multiline = false,
    numberOfLines = 1,
    keyboardType = "default",
    containerStyle
}: any) => {
    const isFocused = useSharedValue(0);

    const animatedLabelStyle = useAnimatedStyle(() => {
        const translateY = interpolate(
            isFocused.value,
            [0, 1],
            [0, -20]
        );
        const scale = interpolate(
            isFocused.value,
            [0, 1],
            [1, 0.85]
        );
        return {
            transform: [{ translateY }, { scale }],
        };
    });

    return (
        <View style={[styles.fieldContainer, containerStyle]}>
            <View style={styles.fieldHeader}>
                {icon && (
                    <Ionicons
                        name={icon}
                        size={18}
                        color={error ? Colors.red : Colors.primary}
                        style={styles.fieldIcon}
                    />
                )}
                <Animated.Text
                    style={[
                        styles.fieldLabel,
                        animatedLabelStyle,
                        (value || isFocused.value) && styles.fieldLabelFocused,
                        error && styles.fieldLabelError
                    ]}
                >
                    {label}
                </Animated.Text>
            </View>

            <View style={[
                styles.inputContainer,
                error && styles.inputError,
                multiline && styles.multilineContainer
            ]}>
                {prefix && (
                    <Text style={styles.prefix}>{prefix}</Text>
                )}
                <TextInput
                    value={value}
                    onChangeText={onChangeText}
                    onFocus={() => isFocused.value = withTiming(1)}
                    onBlur={() => isFocused.value = withTiming(value ? 1 : 0)}
                    placeholder={placeholder}
                    placeholderTextColor="#94A3B8"
                    style={[
                        styles.input,
                        multiline && styles.multilineInput,
                        prefix && styles.inputWithPrefix
                    ]}
                    multiline={multiline}
                    numberOfLines={numberOfLines}
                    keyboardType={keyboardType}
                    textAlignVertical={multiline ? 'top' : 'center'}
                />
            </View>

            {error && (
                <Animated.View style={styles.errorContainer}>
                    <Feather name="alert-circle" size={14} color={Colors.red} />
                    <Text style={styles.errorText}>{error}</Text>
                </Animated.View>
            )}
        </View>
    );
};

const Select = ({ label, value, onPress, error, icon }: any) => (
    <Pressable
        onPress={onPress}
        style={({ pressed }) => [
            styles.selectContainer,
            pressed && styles.pressed,
            error && styles.selectError
        ]}
    >
        <View style={styles.selectContent}>
            <View style={styles.selectLabel}>
                {icon && (
                    <Ionicons
                        name={icon}
                        size={18}
                        color={error ? Colors.red : Colors.primary}
                        style={styles.selectIcon}
                    />
                )}
                <Text style={[
                    styles.selectLabelText,
                    error && styles.selectLabelError
                ]}>
                    {label}
                </Text>
            </View>
            <View style={styles.selectValue}>
                <Text style={[
                    styles.selectValueText,
                    !value && styles.selectValuePlaceholder
                ]}>
                    {value || "Select"}
                </Text>
                <Feather name="chevron-down" size={20} color={error ? Colors.red : "#64748B"} />
            </View>
        </View>
        {error && (
            <Animated.View style={styles.selectErrorContainer}>
                <Feather name="alert-circle" size={14} color={Colors.red} />
                <Text style={styles.errorText}>{error}</Text>
            </Animated.View>
        )}
    </Pressable>
);



const BaseModal = ({ visible, title, options, onClose, onSelect }: any) => {
    const translateY = useSharedValue(300);

    React.useEffect(() => {
        if (visible) {
            translateY.value = withSpring(0, {
                stiffness: 200
            });
        } else {
            translateY.value = withTiming(300, { duration: 250 });
        }
    }, [visible]);

    const modalStyle = useAnimatedStyle(() => ({
        transform: [{ translateY: translateY.value }],
    }));

    if (!visible) return null;

    return (
        <Modal visible={visible} transparent animationType="none">
            <BlurView intensity={80} tint="dark" style={styles.modalOverlay}>
                <Pressable style={styles.modalBackdrop} onPress={onClose}>
                    <Animated.View style={[styles.modalContent, modalStyle]}>
                        <View style={styles.modalHeader}>
                            <Text style={styles.modalTitle}>{title}</Text>
                            <Pressable onPress={onClose} style={styles.modalClose}>
                                <Feather name="x" size={24} color="#64748B" />
                            </Pressable>
                        </View>

                        <ScrollView style={styles.modalOptions}>
                            {options.map((option: any, index: number) => (
                                <Animated.View
                                    key={option.label}
                                    entering={FadeInDown.delay(index * 50)}
                                >
                                    <Pressable
                                        onPress={() => onSelect(option.label)}
                                        style={({ pressed }) => [
                                            styles.modalOption,
                                            pressed && styles.pressed
                                        ]}
                                    >
                                        {option.icon && (
                                            <View style={[styles.optionIcon, { backgroundColor: `${option.color}20` }]}>
                                                <Ionicons name={option.icon} size={24} color={option.color} />
                                            </View>
                                        )}
                                        <View style={styles.optionContent}>
                                            <Text style={styles.optionLabel}>{option.label}</Text>
                                            {option.subtitle && (
                                                <Text style={styles.optionSubtitle}>{option.subtitle}</Text>
                                            )}
                                        </View>
                                        <Feather name="chevron-right" size={20} color="#CBD5E1" />
                                    </Pressable>
                                </Animated.View>
                            ))}
                        </ScrollView>
                    </Animated.View>
                </Pressable>
            </BlurView>
        </Modal>
    );
};

const CategoryModal = (props: any) => (
    <BaseModal
        {...props}
        title="Select Category"
        options={[
            { label: "car", icon: "car-sport", color: "#3B82F6" },
            { label: "bike", icon: "car", color: "#10B981" },

        ]}
    />
);

const VehicleTypeModal = (props: any) => (
    <BaseModal
        {...props}
        title="Select Vehicle Type"
        options={[
            { label: "sell", icon: "speedometer", color: "#10B981", subtitle: "Budget friendly" },
            { label: "rent", icon: "car-sedan", color: "#3B82F6", subtitle: "Small size" },

        ]}
    />
);
const FeaturesModal = (props: any) => (
    <BaseModal
        {...props}
        title="Select Features"
        options={[
            { label: "ac ", icon: "speedometer", color: "#10B981", subtitle: "High" },
            { label: "camera", icon: "camera", color: "#3B82F6", subtitle: "Selfie" },
            { label: "wifi", icon: "wifi", color: "#3B82F6", subtitle: "Strong" },
            { label: "bluetooth", icon: "bluetooth", color: "#3B82F6", subtitle: "Music" },

        ]}
    />
);

const FuelTypeModal = (props: any) => (
    <BaseModal
        {...props}
        title="Select Fuel Type"
        options={[
            { label: "Petrol", icon: "water", color: "#10B981" },
            { label: "Diesel", icon: "flame", color: "#F59E0B" },
            { label: "CNG", icon: "leaf", color: "#8B5CF6" },
            { label: "Electric", icon: "flash", color: "#3B82F6" },
            { label: "Hybrid", icon: "git-merge", color: "#EC4899" },
            { label: "LPG", icon: "gas-station", color: "#F59E0B" },
        ]}
    />
);

const TransmissionModal = (props: any) => (
    <BaseModal
        {...props}
        title="Select Transmission"
        options={[
            { label: "manual", icon: "cog", color: "#3B82F6", subtitle: "Manual gear" },
            { label: "automatic", icon: "settings", color: "#10B981", subtitle: "Automatic gear" },
        ]}
    />
);

const RentTypeModal = (props: any) => (
    <BaseModal
        {...props}
        title="Select Rent Type"
        options={[
            { label: "per_km", icon: "navigate", color: "#3B82F6", subtitle: "Per kilometer" },
            { label: "daily", icon: "sunny", color: "#10B981", subtitle: "Per day basis" },
            { label: "hourly", icon: "time", color: "#8B5CF6", subtitle: "Per hour basis" },
            { label: "weekly", icon: "calendar", color: "#F59E0B", subtitle: "Per week basis" },
            { label: "monthly", icon: "today", color: "#EC4899", subtitle: "Per month basis" },
        ]}
    />
);

/* ================= STYLES ================= */

const styles = StyleSheet.create({
    root: {
        flex: 1,
        backgroundColor: '#F8FAFC',
    },
    keyboardView: {
        flex: 1,
    },
    header: {
        paddingHorizontal: 20,
        paddingTop: 10,
        paddingBottom: 20,
        backgroundColor: '#fff',
        borderBottomWidth: 1,
        borderBottomColor: '#F1F5F9',
    },
    headerTitle: {
        fontSize: 28,
        fontWeight: '800',
        color: '#0F172A',
        marginBottom: 4,
    },
    headerSubtitle: {
        fontSize: 14,
        color: '#64748B',
    },
    progressContainer: {
        paddingHorizontal: 20,
        paddingBottom: 20,
        backgroundColor: '#fff',
    },
    progressBackground: {
        height: 4,
        backgroundColor: '#E2E8F0',
        borderRadius: 2,
        overflow: 'hidden',
        marginBottom: 16,
    },
    progressFill: {
        height: '100%',
        backgroundColor: Colors.primary,
        borderRadius: 2,
    },
    stepIndicator: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    stepContainer: {
        alignItems: 'center',
    },
    stepCircle: {
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: '#E2E8F0',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 8,
    },
    stepCircleActive: {
        backgroundColor: Colors.primary,
    },
    stepText: {
        fontSize: 14,
        fontWeight: '600',
        color: '#64748B',
    },
    stepTextActive: {
        color: '#fff',
    },
    stepLabel: {
        fontSize: 12,
        color: '#64748B',
    },
    scrollContent: {
        padding: 16,
        paddingBottom: 40,
    },
    card: {
        backgroundColor: '#fff',
        borderRadius: 24,
        padding: 20,
        marginBottom: 16,
        borderWidth: 1,
        borderColor: '#F1F5F9',
    },
    cardElevated: {
        shadowColor: '#0F172A',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.08,
        shadowRadius: 16,
        elevation: 8,
    },
    cardHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20,
        gap: 12,
    },
    cardTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: '#0F172A',
        textTransform: "capitalize"
    },
    // Image Upload Styles
    imageAdd: {
        borderWidth: 2,
        borderColor: '#E2E8F0',
        borderStyle: 'dashed',
        borderRadius: 20,
        padding: 32,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 16,
    },
    imageAddInner: {
        alignItems: 'center',
        gap: 12,
    },
    imageAddText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#0F172A',
    },
    imageAddSubtext: {
        fontSize: 12,
        color: '#94A3B8',
        marginTop: 4,
    },
    imageGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 12,
    },
    imageContainer: {
        width: (width - 72) / 4,
        height: (width - 72) / 4,
        borderRadius: 16,
        overflow: 'hidden',
        position: 'relative',
    },
    image: {
        width: '100%',
        height: '100%',
        resizeMode: 'cover',
    },
    removeButton: {
        position: 'absolute',
        top: 6,
        right: 6,
        backgroundColor: 'rgba(239, 68, 68, 0.9)',
        width: 24,
        height: 24,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 2,
    },
    imageBadge: {
        position: 'absolute',
        top: 6,
        left: 6,
        backgroundColor: 'rgba(15, 23, 42, 0.8)',
        width: 20,
        height: 20,
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
    },
    imageBadgeText: {
        color: '#fff',
        fontSize: 10,
        fontWeight: '600',
    },
    addMoreButton: {
        width: (width - 72) / 4,
        height: (width - 72) / 4,
        borderRadius: 16,
        borderWidth: 2,
        borderColor: '#E2E8F0',
        borderStyle: 'dashed',
        alignItems: 'center',
        justifyContent: 'center',
    },
    // Field Styles
    fieldContainer: {
        marginBottom: 16,
    },
    fieldHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
    },
    fieldIcon: {
        marginRight: 8,
    },
    fieldLabel: {
        fontSize: 14,
        fontWeight: '600',
        color: '#64748B',
        position: 'absolute',
        left: 0,
        top: 0,
    },
    fieldLabelFocused: {
        color: Colors.primary,
    },
    fieldLabelError: {
        color: Colors.red,
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1.5,
        borderColor: '#E2E8F0',
        borderRadius: 14,
        paddingHorizontal: 16,
        backgroundColor: '#F8FAFC',
        minHeight: 56,
    },
    input: {
        flex: 1,
        fontSize: 16,
        color: '#0F172A',
        paddingVertical: 16,
    },
    inputWithPrefix: {
        marginLeft: 8,
    },
    inputError: {
        borderColor: Colors.red,
    },
    prefix: {
        fontSize: 16,
        fontWeight: '600',
        color: '#64748B',
    },
    multilineContainer: {
        minHeight: 100,
        alignItems: 'flex-start',
    },
    multilineInput: {
        paddingTop: 16,
        textAlignVertical: 'top',
    },
    // Select Styles
    selectContainer: {
        borderWidth: 1.5,
        borderColor: '#E2E8F0',
        borderRadius: 14,
        padding: 16,
        backgroundColor: '#F8FAFC',
        marginBottom: 16,
    },
    selectContent: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    selectLabel: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    selectIcon: {
        marginRight: 8,
    },
    selectLabelText: {
        fontSize: 14,
        fontWeight: '600',
        color: '#64748B',
        textTransform: "capitalize"
    },
    selectLabelError: {
        color: Colors.red,
    },
    selectValue: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    selectValueText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#0F172A',
        textTransform: 'capitalize',
    },
    selectValuePlaceholder: {
        color: '#94A3B8',
    },
    selectError: {
        borderColor: Colors.red,
    },
    selectErrorContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 8,
        gap: 6,
    },
    // Spec Grid
    specGrid: {
        flexDirection: 'row',
        gap: 12,
        marginBottom: 16,
    },
    specField: {
        flex: 1,
    },
    // Switch Styles
    switchContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 12,
        marginBottom: 8,
    },
    switchLabel: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    switchText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#0F172A',
    },
    // Price Grid
    priceGrid: {
        flexDirection: 'row',
        gap: 12,
        marginBottom: 16,
    },
    halfField: {
        flex: 1,
    },
    // Review Styles
    reviewSection: {
        marginBottom: 24,
        paddingBottom: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#F1F5F9',
    },
    reviewTitle: {
        fontSize: 16,
        fontWeight: '700',
        color: '#0F172A',
        marginBottom: 12,
    },
    reviewRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },
    reviewLabel: {
        fontSize: 14,
        color: '#64748B',
    },
    reviewValue: {
        fontSize: 14,
        fontWeight: '600',
        color: '#0F172A',
    },
    // Navigation
    navigationContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: 16,
        backgroundColor: '#fff',
        borderTopWidth: 1,
        borderTopColor: '#F1F5F9',
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
    },
    navButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 24,
        paddingVertical: 16,
        borderRadius: 14,
        gap: 8,
        flex: 1,
    },
    navButtonPrimary: {
        backgroundColor: Colors.primary,
        marginLeft: 8,
    },
    navButtonSecondary: {
        backgroundColor: '#F1F5F9',
        marginRight: 8,
    },
    navButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },
    navButtonTextSecondary: {
        color: Colors.primary,
        fontSize: 16,
        fontWeight: '600',
    },
    // Submit Button
    submitButton: {
        backgroundColor: Colors.primary,
        borderRadius: 18,
        overflow: 'hidden',
        shadowColor: Colors.primary,
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.3,
        shadowRadius: 16,
        elevation: 12,
        flex: 1,
    },
    submitPressable: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 18,
        gap: 12,
    },
    submitPressed: {
        opacity: 0.9,
    },
    submitText: {
        color: '#fff',
        fontSize: 14,
        fontWeight: '700',
    },
    // Error Styles
    errorContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 8,
        gap: 6,
    },
    errorText: {
        color: Colors.red,
        fontSize: 12,
        fontWeight: '500',
    },
    // Modal Styles
    modalOverlay: {
        flex: 1,
    },
    modalBackdrop: {
        flex: 1,
        justifyContent: 'flex-end',
    },
    modalContent: {
        backgroundColor: '#fff',
        borderTopLeftRadius: 32,
        borderTopRightRadius: 32,
        maxHeight: '80%',
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 24,
        borderBottomWidth: 1,
        borderBottomColor: '#F1F5F9',
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: '700',
        color: '#0F172A',
    },
    modalClose: {
        width: 40,
        height: 40,
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#F1F5F9',
    },
    modalOptions: {
        padding: 20,
    },
    modalOption: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 16,
        paddingHorizontal: 4,
        borderRadius: 12,
        gap: 16,
        marginBottom: 8,
    },
    optionIcon: {
        width: 48,
        height: 48,
        borderRadius: 14,
        alignItems: 'center',
        justifyContent: 'center',
    },
    optionContent: {
        flex: 1,
    },
    optionLabel: {
        fontSize: 16,
        fontWeight: '600',
        color: '#0F172A',
        marginBottom: 2,
        textTransform: 'capitalize'
    },
    optionSubtitle: {
        fontSize: 12,
        color: '#64748B',
    },
    // Common
    pressed: {
        opacity: 0.7,
        transform: [{ scale: 0.98 }],
    },
    featuresWrapper: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 10,
        marginTop: 10,
    },

    featureChip: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F5F7FB',
        borderRadius: 20,
        paddingVertical: 8,
        paddingHorizontal: 14,

        shadowColor: '#000',
        shadowOpacity: 0.05,
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 6,
        elevation: 2,
    },

    featureText: {
        fontSize: 14,
        fontFamily: 'Medium',
        color: '#333',
        textTransform: 'capitalize'
    },

    removeBtn: {
        marginLeft: 8,
        width: 18,
        height: 18,
        borderRadius: 9,
        backgroundColor: '#E74C3C',
        justifyContent: 'center',
        alignItems: 'center',
    },

    removeText: {
        color: '#fff',
        fontSize: 12,
        lineHeight: 12,
        fontWeight: 'bold',
    },
    Flex: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
        flexWrap: 'wrap'
    }
});