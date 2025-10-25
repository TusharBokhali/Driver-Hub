import { Images } from '@/assets/Images';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import React, { useContext, useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, Image, Pressable, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { Api } from '../Api/Api';
import { User } from '../context/UserContext';
import { Colors } from '../utils/Colors';
import { height, width } from '../utils/Dimensions';
import { handleApiResponse } from './ErrorHandle';
import ToastMessage from './ToastMessage';
export default function CarView({ data, type, Search='',IsLoading=false}: any) {
    const { navigate } = useNavigation<any>();
    // Alert.alert(JSON.stringify(data[0]))
    const [animateKey, setAnimateKey] = useState(0);
      const { user, setUser,AllFavorites,setAllFavorites } = useContext<any>(User);

    const [toast, setToast] = useState<{ visible: boolean; message: string; type: 'success' | 'error' | 'info' }>({
        visible: false,
        message: '',
        type: 'info'
    })

    useEffect(() => {
        setAnimateKey(prev => prev + 1);
    }, [data]);


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

const filterData = () => {
  if (!Search) return data;

  return data.filter((item: any) =>
    item.title?.toLowerCase().includes(Search.toLowerCase())
  );
};

    return (
        <Animated.View key={animateKey} entering={FadeInDown.duration(200)} style={styles.container}>
            <View style={styles.CarList}>
                {
                    data?.length > 0 &&
                    <View style={styles.Flex}>
                        <Text style={styles.Title}>{data[0]?.owner?.title}</Text>
                        <TouchableOpacity>
                            <Text style={[styles.ViewAll]}>View All</Text>
                        </TouchableOpacity>
                    </View>
                }

                <FlatList
                    data={filterData()}
                    scrollEnabled={false}
                    ListEmptyComponent={() => (
                      !IsLoading &&
                        <View style={[styles.Flex, { height: height * 0.2, width: width }]}>
                            <Text style={[styles.Title, { textAlign: 'center', width: '100%',alignSelf:'center' }]}>No Data</Text>
                        </View>
                    )}
                    ListFooterComponent={()=>(
                     IsLoading &&
                      <View  style={[styles.Flex, { height: height * 0.2, width: width, }]}>
                        <ActivityIndicator size={'large'} color={Colors.primary} style={{alignSelf:'center',width:'100%'}}/>
                      </View>
                    )}
                    contentContainerStyle={{ paddingBottom: 100, gap: 25 }}
                    keyExtractor={({ item, index }: any) => `${item?._id}`}
                    renderItem={({ item, index }) => (
                        <Pressable style={styles.CarBox} onPress={() => { navigate('Details', { item: item }) }}>
                            <View style={styles.TopFixed}>
                                {
                                    item?.isAvailable &&
                                    <View style={styles.Status}>
                                        <Text style={[styles.Title, { fontSize: 14, color: Colors.white, fontFamily: 'regular' }]}>Available</Text>
                                    </View>
                                }
                                <TouchableOpacity style={styles.Heart} onPress={()=> AllFavorites?.ids?.includes(item?._id) ? RemoveFavorites(item) : FavoritesAdd(item)}> 
                                    <FontAwesome name="heart" size={18} color={AllFavorites?.ids?.includes(item?._id) ? Colors.Likes : Colors.dark} />
                                </TouchableOpacity>
                            </View>
                            <Image
                                source={item?.images?.length > 0 ? { uri: item?.images[0]?.uri } : Images.Car1}
                                style={styles.ImagesStyle}
                            />
                            <View style={{ padding: 10 }}>
                                <Text style={styles.Title}>{item?.title || ""}</Text>
                                <Text style={styles.DarkText}> <Text>{item?.year}</Text> • {item?.mileage}Km</Text>
                                <View style={styles.Flex}>
                                    <Text style={styles.Price}>${item?.price}</Text>
                                    <View style={[styles.Flex, { gap: 10 }]}>
                                        {
                                            item?.totalRatings &&
                                            <View style={[styles.Flex, { gap: 5 }]}>
                                                <Image
                                                    source={Images.StarImage}
                                                    style={{ width: 15, height: 15 }}
                                                />
                                                <Text style={styles.DarkText}>4.8</Text>
                                            </View>
                                        }
                                        <TouchableOpacity style={[styles.Button]} onPress={() => { navigate('Details', { item: item }) }}>
                                            <Text style={[styles.Title, { color: Colors.white, fontFamily: 'regular', fontSize: 14 }]}>View Details</Text>
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            </View>
                        </Pressable>
                    )}
                />

            </View>

            {toast.visible && (
                <ToastMessage
                    type={toast.type}
                    message={toast.message}
                    onHide={() => setToast({ ...toast, visible: false })}
                />
            )}
        </Animated.View>
    )
}

const styles = StyleSheet.create({
    container: {
        width: "100%",
    },
    itle: {
        fontSize: 18,
        fontFamily: 'Bold',
    },
    ViewAll: {
        color: Colors.primary,
        fontFamily: 'SemiBold',
        fontSize: 14
    },
    Shadow: {
        marginBottom: 20
    },
    Flex: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    CarBox: {
        width: '100%',
        backgroundColor: Colors.white,
        // padding: 5,
        marginTop: 15,
        elevation: 5,
        borderRadius: 20
    },
    Title: {
        fontSize: 18,
        fontFamily: 'Bold',
    },
    CarList: {
        width: '100%',
        marginTop: 20,
        elevation: 5,

    },
    ImagesStyle: {
        width: '100%',
        height: 200,
        resizeMode: 'cover',
        borderTopRightRadius: 20,
        borderTopLeftRadius: 20
    },
    DarkText: {
        color: Colors.dark,
        fontFamily: 'SemiBold',
        fontSize: 14
    },
    Price: {
        fontSize: 18,
        fontFamily: 'SemiBold',
        color: Colors.black
    },
    Button: {
        backgroundColor: Colors.primary,
        paddingVertical: 8,
        paddingHorizontal: 10,
        borderRadius: 7
    },
    TopFixed: {
        width: '100%',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 10,
        position: 'absolute',
        zIndex: 2,
        top: '5%'
    },
    Heart: {
        backgroundColor: Colors.darkwhite,
        paddingVertical: 10,
        paddingHorizontal: 5,
        borderRadius: 15,
    },
    Status: {
        backgroundColor: Colors.green,
        paddingVertical: 4,
        paddingHorizontal: 5,
        borderRadius: 10
    }
});