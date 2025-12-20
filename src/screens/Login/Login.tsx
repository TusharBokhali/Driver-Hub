/* eslint-disable no-unused-expressions */
import { Images } from '@/assets/Images'
import { Api } from '@/src/Api/Api'
import { ApiService } from '@/src/Api/ApiService'
import { handleApiResponse } from '@/src/components/ErrorHandle'
import ToastMessage from '@/src/components/ToastMessage'
import { User } from '@/src/context/UserContext'
import { Colors } from '@/src/utils/Colors'
import { AsyncStorageService } from '@/src/utils/store'
import Ionicons from '@expo/vector-icons/Ionicons'
import React, { useContext, useState } from 'react'
import { ActivityIndicator, Image, StyleSheet, Text, TextInput, TouchableOpacity, Vibration, View } from 'react-native'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { SafeAreaView } from 'react-native-safe-area-context'
import GestureRecognizer from 'react-native-swipe-gestures'
export default function Login({ navigation }: any) {
  const [Email, setEmail] = useState<string>('');
  const [Password, setPassword] = useState<string>('');
  const [EyeShow, setEyeShow] = useState<boolean>(false);
  const [IsLoading, setIsLoading] = useState<boolean>(false);
  const [swipeSequence, setSwipeSequence] = useState<string[]>([]);
    const { user, setUser } = useContext<any>(User);
  
  const [toast, setToast] = useState<{ visible: boolean; message: string; type: 'success' | 'error' | 'info' }>({
    visible: false,
    message: '',
    type: 'info'
  })

  const REQUIRED_PATTERN = ['up', 'right', 'down', 'left'];
  const isExactMatch = (arr1: string[], arr2: string[]) => {
    if (arr1.length !== arr2.length) return false;

    return arr1.every((item, index) => item === arr2[index]);
  };
  const handleSwipe = (direction: string) => {
    let copy = [...swipeSequence];
    // Alert.alert(`${direction}`)
    if (copy.includes(direction)) {
      setSwipeSequence([]);
    } else {
      copy.push(direction)
      setSwipeSequence(copy)
    }
    Vibration.vibrate(400)
    const isMatch = isExactMatch(copy, REQUIRED_PATTERN);
    if (isMatch) {
      setTimeout(() => {
        navigation.reset({
          index: 0,
          routes: [{ name: 'LoginAdmin' }],
        });
        setSwipeSequence([]);
        copy = [];
      }, 50);
    }

  };

  const onLogin = async () => {
    if (!Email || !Email.trim()) {
      setToast({ visible: true, type: 'error', message: "Please enter your email!" })

      return
    }


    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(Email.trim())) {
      setToast({ visible: true, type: 'error', message: "Please enter a valid email!" })
      return
    }


    if (!Password || !Password.trim()) {
      setToast({ visible: true, type: 'error', message: "Please enter your password!" })
      return
    }

    if (Password.trim().length < 6) {
      setToast({ visible: true, type: 'error', message: "Password must be at least 6 characters!" })
      return
    }

    setIsLoading(true);
    try {


      let res = await ApiService(Api.login, {
        email: Email.trim(),
        password: Password.trim(),
      });

      if (res?.success) {
        let user = res?.data?.data;
        // console.log(user);
        setUser(user)
        await AsyncStorageService.storeData('USERLOGIN', user);
        navigation.replace('BottomTab');
        setToast({ visible: true, type: "success", message: "Login successful!" })

      } else {
        setToast({ visible: true, type: 'error', message: `${res?.error?.message}` })
      }
    } catch (error: any) {
      console.log("LogIn Error:", error);

      <ToastMessage type={handleApiResponse(error)?.type} message={handleApiResponse(error)?.message} />;
    } finally {
      setIsLoading(false);
    }
  };

  const config = {
    velocityThreshold: 0.3,
    directionalOffsetThreshold: 80,
  };

  return (
    <GestureRecognizer
      onSwipeUp={() => handleSwipe('up')}
      onSwipeDown={() => handleSwipe('down')}
      onSwipeLeft={() => handleSwipe('left')}
      onSwipeRight={() => handleSwipe('right')}
      config={config}
      style={styles.container}
    >
      <SafeAreaView style={styles.container}>
        <KeyboardAwareScrollView
          contentContainerStyle={{ flexGrow: 1, padding: 15 }}
          enableOnAndroid={true}
          extraScrollHeight={20}
          keyboardShouldPersistTaps="handled"
        >

          <View style={styles.TopContent}>
            <Image
              source={Images.RadientLogo}
              style={styles.LOGO}
              resizeMode='contain'
            />
            <Text style={styles.Title}>Welcome Back</Text>
            <Text style={styles.Description}>Sign in to your Vehicle Hub </Text>
            <Text style={styles.Description}>account</Text>
          </View>

          <View style={styles.LoginBox}>
            <View style={styles.InputBox}>
              <Text style={styles.Label}>Email Address</Text>
              <View style={styles.Input}>
                <Image
                  source={Images.Email}
                  style={styles.MiniImage}
                />
                <TextInput
                  style={styles.TextInput}
                  placeholder='Enter your email'
                  placeholderTextColor={Colors.dark}
                  value={Email}
                  onChangeText={setEmail}
                  keyboardType='email-address'
                  autoCapitalize='none'
                  autoCorrect={false}
                  autoComplete='email'
                  textContentType='emailAddress'
                />
              </View>
            </View>

            <View style={styles.InputBox}>
              <Text style={styles.Label}>Password</Text>
              <View style={styles.Input}>
                <Image
                  source={Images.Lock}
                  style={[styles.MiniImage, { width: 15, height: 20 }]}
                />
                <TextInput
                  style={[styles.TextInput, { width: '80%' }]}
                  placeholderTextColor={Colors.dark}
                  placeholder='Enter your password'
                  value={Password}
                  onChangeText={setPassword}
                  secureTextEntry={!EyeShow}
                  autoCorrect={false}
                  autoComplete='password'
                  textContentType='password'
                />
                <TouchableOpacity onPress={() => setEyeShow(!EyeShow)}>
                  <Ionicons name={EyeShow ? "eye" : "eye-off"} size={24} color={Colors.dark} />
                </TouchableOpacity>
              </View>
            </View>
            <TouchableOpacity>
              <Text style={[styles.Label, { color: Colors.primary, textAlign: 'right', marginTop: 10 }]}>Forgot Password?</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.Button} onPress={() => onLogin()}>
              <Text style={[styles.Label, { color: Colors.white, }]}>
                {
                  IsLoading ?
                    <ActivityIndicator size="small" color={Colors.white} />
                    : "Log In"
                }
              </Text>
            </TouchableOpacity>

            <View style={styles.Line}>
              <Text style={styles.ORText}>OR</Text>
            </View>

            <TouchableOpacity style={[styles.Button, styles.Flex]}>
              <Image
                source={Images.Google}
                style={styles.Google}
              />
              <Text style={[styles.Label]}>Continue with Google</Text>
            </TouchableOpacity>
            <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginBottom: 10 }}>
              <Text style={[styles.Label, { textAlign: 'center', }]}>{"Don't have an account? "}</Text>
              <TouchableOpacity onPress={() => navigation.navigate('Register')}>
                <Text style={[styles.Label, { color: Colors.primary, fontFamily: "Bold" }]}>Sign Up</Text>
              </TouchableOpacity>
            </View>
          </View>

          {toast.visible && (
            <ToastMessage
              type={toast.type}
              message={toast.message}
              onHide={() => setToast({ ...toast, visible: false })}
            />
          )}
        </KeyboardAwareScrollView>
      </SafeAreaView>
    </GestureRecognizer>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,

  },
  TopContent: {
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: '5%'
  },
  LOGO: {
    width: 80,
    height: 80,
  },
  Title: {
    fontSize: 22,
    fontFamily: 'Bold',
    color: Colors.black
  },
  Description: {
    fontSize: 14,
    fontFamily: 'Bold',
    color: Colors.dark
  },
  LoginBox: {
    padding: 10,
    backgroundColor: Colors.white,
    elevation: 3,
    marginTop: 20,
    borderRadius: 7
  },
  InputBox: {
    marginTop: 15
  },
  Label: {
    fontFamily: 'regular',
    color: Colors.black,
    fontSize: 14
  },
  Input: {
    width: '100%',
    backgroundColor: Colors.darkwhite,
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 7,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    marginTop: 10
  },
  MiniImage: {
    width: 20,
    height: 20,
  },
  TextInput: {
    width: '90%',
    fontSize: 14,
    fontFamily: 'regular',
    color: Colors.black
  },
  Button: {
    width: '100%',
    backgroundColor: Colors.primary,
    paddingVertical: 15,
    borderRadius: 7,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20
  },
  Line: {
    width: '100%',
    borderTopWidth: 1,
    borderTopColor: Colors.darkwhite,
    marginVertical: 30,
  },
  ORText: {
    position: 'absolute',
    top: -10,
    alignSelf: 'center',
    backgroundColor: Colors.white,
    paddingHorizontal: 10,
    fontFamily: 'regular',
    color: Colors.dark,
    fontSize: 14
  },
  Google: {
    width: 20,
    height: 20,
  },
  Flex: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 10,
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: Colors.darkwhite,
    marginVertical: 25,
    marginTop: 5
  },

})