import { Images } from '@/assets/Images';
import { Api } from '@/src/Api/Api';
import CarouselSlider from '@/src/components/CarouselSlider';
import CarView from '@/src/components/CarView';
import SearchInput from '@/src/components/Search';
import { User } from '@/src/context/UserContext';
import { Colors } from '@/src/utils/Colors';
import { width } from '@/src/utils/Dimensions';
import axios from 'axios';
import React, { useContext, useEffect, useRef, useState } from 'react';
import { Animated, Image, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

export default function HomeScreens({navigation}:any) {
  const [IsActive, setActive] = useState('Sell');
  const translateX = useRef(new Animated.Value(0)).current;
  const [Search, setSearch] = useState<string>('')
  const [CarData, setCarData] = useState([]);
  const [IsLoading,setIsLoading] = useState<boolean>(false);
  const tabWidth = (width - 40) / 3;
  const { user, setUser, AllFavorites, setAllFavorites } = useContext<any>(User);

  useEffect(() => {
    let toValue = 0;
    if (IsActive === "Sell") {
      toValue = 0;
    } else if (IsActive === "Rent") {
      toValue = tabWidth;
    } else if (IsActive === "Service") {
      toValue = tabWidth * 2;
    }

    Animated.spring(translateX, {
      toValue,
      useNativeDriver: true,
      friction: 8,
      tension: 60,
    }).start();
    GetSellCar();
    GetFavoritesData();
  }, [IsActive]);

  const GetFavoritesData = async () => {
    try {

      let res = await axios.get(Api.getfavorites, {
        headers: {
          'Authorization': `Bearer ${user?.token}`,
          'Content-Type': 'application/json'
        }
      });
      console.log("Get Car", res?.data?.data);
      if (res?.data?.success) {

        setAllFavorites(res?.data?.data)
      }
    } catch (error) {
      console.log("GetFavoritesData Car Error:-", error);
    }
    finally {
    }
  }


  const ImagesData = [
    Images.Slider2,
    Images.Slider2,
  ]

  const GetSellCar = async () => {
    setIsLoading(true)
    try {

      let res = await axios.get(Api.getCar, {
        params:
          IsActive === "Sell"
            ? {}
            : (IsActive === "Rent" || IsActive === "Service")
              ? { vehicleType: IsActive.toLowerCase() }
              : {}
      });
      console.log("Get Car", res?.data?.data);
      if (res?.data?.success) {
        setCarData(res?.data?.data)
      }
    } catch (error) {
      console.log("Get All Sell Car Error:-", error);
    }
    finally {
      setIsLoading(false)
    }
  }
  return (
    <View style={styles.container}>
      <Pressable style={{ paddingHorizontal: 15 }} onPress={()=>navigation.navigate("Search")}>
        <SearchInput value={Search} setValue={setSearch} Container={styles.SearchStyle} edit={false}/>
      </Pressable>
      <ScrollView
        style={styles.Scroll}
        showsVerticalScrollIndicator={false}
        scrollEnabled={CarData?.length > 0}
      >
        <View style={[styles.Shadow, { paddingHorizontal: -15 }]}>
          <CarouselSlider AllImage={ImagesData} />
        </View>
        <View style={{ paddingHorizontal: 15 }}>
          <View style={styles.MenuContainer}>
            <Animated.View style={[styles.Active, { transform: [{ translateX }] },]} />
            <Pressable style={[styles.MenuFlex,]} onPress={() => setActive('Sell')}>
              <Image
                source={Images.car}
                style={styles.Icon}
                tintColor={IsActive === 'Sell' ? Colors.primary : Colors.dark}
              />
              <Text style={[styles.MenuTitle, { color: IsActive === 'Sell' ? Colors.primary : Colors.dark }]}>Sell</Text>
            </Pressable>
            <Pressable style={styles.MenuFlex} onPress={() => setActive('Rent')}>
              <Image
                source={Images.Rent}
                style={[styles.Icon, { width: 16, height: 23 }]}
                tintColor={IsActive === 'Rent' ? Colors.primary : Colors.dark}
              />
              <Text style={[styles.MenuTitle, { color: IsActive === 'Rent' ? Colors.primary : Colors.dark }]}>Rent</Text>
            </Pressable>
            <Pressable style={styles.MenuFlex} onPress={() => setActive('Service')}>
              <Image
                source={Images.Services}
                style={[styles.Icon,]}
                tintColor={IsActive == 'Service' ? Colors.primary : Colors.dark}
              />
              <Text style={[styles.MenuTitle, { color: IsActive === 'Service' ? Colors.primary : Colors.dark }]}>Service</Text>
            </Pressable>
          </View>
        </View>
        <View style={{ paddingHorizontal: 15 }}>
          <CarView data={CarData} Search={Search} IsLoading={IsLoading}/>
        </View>
      </ScrollView>
    </View>

  )
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  Scroll: {
    flex: 1,
    // padding:-15
    // paddingHorizontal:15
  },
  MenuContainer: {
    width: '100%',
    height: 50,
    backgroundColor: Colors.darkwhite,
    padding: 4,
    borderRadius: 7,
    flexDirection: "row",

  },
  Icon: {
    width: 20,
    height: 20,
    resizeMode: 'contain'
  },
  Active: {
    backgroundColor: Colors.white,
    width: '33.33%',
    height: '100%',
    borderRadius: 7,
    position: 'absolute',
    margin: 4
  },
  MenuFlex: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    width: '33.33%',
    height: '100%',
    borderRadius: 7,
    justifyContent: 'center',
    zIndex: 15,

  },
  MenuTitle: {
    fontSize: 16,
    fontFamily: 'regular',
    color: Colors.dark
  },
  CarList: {
    width: '100%',
    marginTop: 20,
    elevation: 5,
  },
  SearchStyle: {
    marginBottom: 15
  },
  Flex: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  CarBox: {
    width: '100%',
    backgroundColor: Colors.white,
    padding: 5
  },
  Title: {
    fontSize: 18,
    fontFamily: 'Bold',
  },
  ViewAll: {
    color: Colors.primary,
    fontFamily: 'SemiBold',
    fontSize: 14
  },
  Shadow: {
    marginBottom: 20,

    // marginHorizontal:-15
  }
});