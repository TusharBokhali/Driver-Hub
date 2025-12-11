/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-unused-expressions */
import { Images } from '@/assets/Images'
import { Api } from '@/src/Api/Api'
import { ApiService } from '@/src/Api/ApiService'
import { handleApiResponse } from '@/src/components/ErrorHandle'
import ToastMessage from '@/src/components/ToastMessage'
import { Colors } from '@/src/utils/Colors'
import Ionicons from '@expo/vector-icons/Ionicons'
import React, { useState } from 'react'
import { Image, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view"
import { SafeAreaView } from 'react-native-safe-area-context'
export default function Register({ navigation }: any) {
  const [Email, setEmail] = useState<string>('');
  const [Password, setPassword] = useState<string>('');
  const [name, setName] = useState<string>('');
  const [EyeShow, setEyeShow] = useState<boolean>(false);
  const [IsLoading, setIsLoading] = useState<boolean>(false);
  const [toast, setToast] = useState<{ visible: boolean; message: string; type: 'success' | 'error' | 'info' }>({
    visible: false,
    message: '',
    type: 'info'
  })
  const OnRegister = async () => {
    if (!name || !name.trim()) {
      setToast({ visible: true, type: 'error', message: "Please enter your name!" })

      return
    }

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
      let res = await ApiService(Api.register, {
        email: Email.trim(),
        password: Password.trim(),
        name: name.trim(),
        role: "user",
        header:true
      });
      // console.log(res);

      if (res?.success) {
        let user = res?.data?.user;
        navigation.replace('Login');
        <ToastMessage type="success" message="Account Created successfully!" />;
      } else {
        // Alert.alert(res?.error?.message || "");
        setToast({ visible: true, type: 'error', message: res?.error?.message || res?.error });
        <ToastMessage type="error" message={res?.error?.message || "Account Created failed!"} />;
        
      }
    } catch (error: any) {
      console.log("LogIn Error:", error);

      <ToastMessage type={handleApiResponse(error)?.type} message={handleApiResponse(error)?.message} />;
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAwareScrollView contentContainerStyle={{ flexGrow: 1, padding: 15 }} 
    enableOnAndroid={true} 
    // extraScrollHeight={60} 
    keyboardShouldPersistTaps="handled">

        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color={Colors.dark} onPress={() => navigation.goBack()} />
        </TouchableOpacity>
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
            <Text style={styles.Label}>Name <Text style={{ color: Colors.red }}>*</Text></Text>
            <View style={styles.Input}>
              <Image
                source={Images.Email}
                style={styles.MiniImage}
              />
              <TextInput
                style={styles.TextInput}
                placeholder='Enter your name'
                placeholderTextColor={Colors.dark}
                value={name}
                onChangeText={setName}
                keyboardType='name-phone-pad'

              />
            </View>
          </View>

          <View style={styles.InputBox}>
            <Text style={styles.Label}>Email Address <Text style={{ color: Colors.red }}>*</Text></Text>
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
            <Text style={styles.Label}>Password <Text style={{ color: Colors.red }}>*</Text></Text>
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

          <TouchableOpacity style={styles.Button} onPress={() => OnRegister()}>
            <Text style={[styles.Label, { color: Colors.white, }]}>Sing Up</Text>
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

          <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginVertical: 10 }}>
            <Text style={[styles.Label, { textAlign: 'center', }]}>{"Already have an account? "}</Text>
            <TouchableOpacity onPress={() => navigation.navigate('Login')}>
              <Text style={[styles.Label, { color: Colors.primary, fontFamily: "Bold" }]}>Log In</Text>
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
    marginTop: 10,
    borderRadius: 7
  },
  InputBox: {
    marginTop: 10
  },
  Label: {
    fontFamily: 'regular',
    color: Colors.black,
    fontSize: 14
  },
  Input: {
    width: '100%',
    backgroundColor: Colors.darkwhite,
    paddingVertical: 10,
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
    marginTop: 15
  },
  Line: {
    width: '100%',
    borderTopWidth: 1,
    borderTopColor: Colors.darkwhite,
    marginTop: 20,
    marginBottom: 15
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
    marginTop: 5
  }
})