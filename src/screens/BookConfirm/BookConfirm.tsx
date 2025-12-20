import { Images } from '@/assets/Images';
import { baseUrl } from '@/src/Api/Api';
import { User } from '@/src/context/UserContext';
import { Colors } from '@/src/utils/Colors';
import { useNavigation } from '@react-navigation/native';
import { Audio } from "expo-av";
import * as Haptics from 'expo-haptics';
import LottieView from 'lottie-react-native';
import React, { useContext, useEffect } from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, Vibration, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
export default function BookConfirm({route}:any) {
  const {replace} = useNavigation<any>();
  const { carData } = route?.params || {};
  const { user, setUser, GlobalBooking, setGlobalBooking } = useContext<any>(User);
  
  useEffect(() => {
    Vibration.vibrate([1000, 500, 300]);
    const handlePaymentSuccess = async () => {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      const { sound } = await Audio.Sound.createAsync(
        Images.ring
      );
      await sound.playAsync();
    };
    handlePaymentSuccess()
  }, [])


  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.animationTop}>
        <LottieView
          autoPlay
          loop={false}
          style={{
            width: 150,
            height: 150,
          }}

          source={Images.animation}
        />
      </View>
      <Text style={styles.Title}>Booking Confirmed!</Text>
      <View style={styles.UserDetails}>
        <View style={styles.Flexible}>
          <Image
            source={user?.user?.profileImage ? {uri:baseUrl+user?.user?.profileImage} : Images.Profile}
            style={{ width: 60, height: 60,borderRadius:120}}
          />
          <View>
            <Text style={styles.Normal}>{user?.user?.name}</Text>
            <Text style={styles.darkText}>Enjoy!</Text>
          </View>
        </View>
        <View style={styles.CarModalView}>
          <View style={styles.SimpleFlex}>
            <Image
              source={Images.car}
              style={{ width: 15, height: 15 }}
              tintColor={Colors.black}
            />
            <View>
              <Text style={styles.Normal}>Car Model</Text>
              <Text style={styles.darkText}>{carData?.title || ""}</Text>
            </View>
          </View>
          <Text style={[styles.Normal,{fontSize:12}]}>KA 01 AB 1234</Text>
        </View>

        <View style={styles.CarModalView}>
          <View style={styles.SimpleFlex}>
            <Image
              source={Images.Driver}
              style={{ width: 25, height: 25 }}
              // tintColor={Colors.black}
            />
            <View>
              <Text style={styles.Normal}>Car Model</Text>
              <Text style={styles.darkText}>Maruti Swift Dzire</Text>
            </View>
          </View>
          <Text style={[styles.Normal,{fontSize:12,color:Colors.green}]}>No</Text>
        </View>

        <View style={styles.CarModalView}>
          <View style={styles.SimpleFlex}>
            <Image
              source={Images.pickup}
              style={{ width: 20, height: 20 }}
              // tintColor={Colors.black}
            />
            <View>
              <Text style={styles.Normal}>Pickup Location</Text>
              <Text style={styles.darkText}>123 Main Street, Downtown</Text>
            </View>
          </View>
          
        </View>
      </View>
      <TouchableOpacity style={styles.Button} onPress={()=>replace('BottomTab')}>
        <Text style={[styles.Normal,{color:Colors.dark,textAlign:'center'}]}>Go Home</Text>
      </TouchableOpacity>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  animationTop: {
    alignSelf: 'center',
    marginTop: '10%'
  },
  Title: {
    fontSize: 22,
    color: Colors.black,
    fontFamily: 'SemiBold',
    textAlign: 'center',
    marginTop: '5%'

  },
  UserDetails: {
    backgroundColor: Colors.white,
    paddingHorizontal: 15,
    paddingVertical: 25,
    borderRadius: 7,
    marginTop: 25,
    marginHorizontal: 15,
    gap:15
  },
  CarModalView:{
    flexDirection:'row',
    alignItems:'center',
    justifyContent:'space-between'
  },
  Flexible: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10
  },
  Normal: {
    fontSize: 13,
    color: Colors.black,
    fontFamily: 'regular',
  },
  darkText: {
    fontFamily: 'regular',
    color: Colors.dark,
    fontSize: 13
  },
  SimpleFlex:{
    flexDirection:'row',
    alignItems:'center',
    gap:10
  },
  Button:{
    backgroundColor:Colors.darkwhite,
    paddingVertical:15,
    alignSelf:'center',
    width:'60%',
    marginTop:'10%',
    borderRadius:10,
    borderWidth:1,
    borderColor:Colors.mediumDark
  }
});