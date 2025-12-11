import { Api } from "@/src/Api/Api";
import { ApiService } from "@/src/Api/ApiService";
import { handleApiResponse } from "@/src/components/ErrorHandle";
import ToastMessage from "@/src/components/ToastMessage";
import { AdminContextData } from "@/src/context/AdminContext";
import { Colors } from "@/src/utils/Colors";
import { AsyncStorageService } from "@/src/utils/store";
import { Feather } from "@expo/vector-icons";
import React, { useContext, useState } from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from "react-native";


export default function LoginAdmin({ navigation }: any) {
  const [Email, setEmail] = useState<string>('');
  const [Password, setPassword] = useState<string>('');
      const {  AdminUser,setAdminUser } = useContext(AdminContextData);
  
  const [toast, setToast] = useState<{ visible: boolean; message: string; type: 'success' | 'error' | 'info' }>({
    visible: false,
    message: '',
    type: 'info'
  })
  const [IsLoading, setIsLoading] = useState<boolean>(false);


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
        console.log(user);
        await AsyncStorageService.storeData('ADMINUSERLOGIN', user);
        setAdminUser(user);
        navigation.replace('AdminBottom');
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
  return (
    <View style={styles.container}>

      <View style={styles.card}>

        <View style={styles.iconCircle}>
          <Feather name="user" size={28} color={Colors.primary} />
        </View>

        <Text style={styles.title}>Welcome Back</Text>
        <Text style={styles.subTitle}>Sign in to your account</Text>

        <Text style={styles.label}>Email Address</Text>
        <View style={styles.inputContainer}>
          <TextInput
            placeholder="Enter your email"
            placeholderTextColor="#999"
            style={styles.input}
            value={Email}
            keyboardType="email-address"
            returnKeyType="next"
            textContentType="emailAddress"
            onChangeText={setEmail}
          />
          <Feather name="mail" size={18} color="#999" />
        </View>

        <Text style={[styles.label, { marginTop: 15 }]}>Password</Text>
        <View style={styles.inputContainer}>
          <TextInput
            placeholder="Enter your password"
            placeholderTextColor="#999"
            secureTextEntry
            value={Password}
            onChangeText={setPassword}
            style={styles.input}
            keyboardType="visible-password"
            returnKeyType="next"
            textContentType="newPassword"

          />
          <Feather name="lock" size={18} color="#999" />
        </View>

        <TouchableOpacity style={styles.button} onPress={onLogin}>
          <Text style={styles.buttonText}>Sign In</Text>
        </TouchableOpacity>

      </View>
      {toast.visible && (
        <ToastMessage
          type={toast.type}
          message={toast.message}
          onHide={() => setToast({ ...toast, visible: false })}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#E6EBFF",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },

  card: {
    width: "100%",
    backgroundColor: "white",
    borderRadius: 18,
    padding: 25,
    paddingVertical: 35,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
  },

  iconCircle: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: "#EEF2FF",
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center",
    marginBottom: 15,
  },

  title: {
    fontSize: 24,
    fontFamily: "Bold",
    textAlign: "center",
    color: "#000",
  },

  subTitle: {
    textAlign: "center",
    fontSize: 13,
    fontFamily: "Medium",
    marginTop: 4,
    color: "#777",
    marginBottom: 20,
  },

  label: {
    fontFamily: "Medium",
    fontSize: 13,
    marginBottom: 6,
    color: "#111",
  },

  inputContainer: {
    width: "100%",
    height: 50,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 10,
    paddingHorizontal: 12,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FAFAFA",
  },

  input: {
    flex: 1,
    fontSize: 14,
    fontFamily: "Medium",
    color: "#000",
  },

  forgotText: {
    color: Colors.primary,
    fontFamily: "Medium",
    fontSize: 13,
  },

  button: {
    backgroundColor: Colors.primary,
    height: 50,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 25,
  },

  buttonText: {
    color: "white",
    fontSize: 16,
    fontFamily: "Bold",
  },

  bottomText: {
    textAlign: "center",
    marginTop: 15,
    fontSize: 13,
    fontFamily: "Medium",
    color: "#444",
  },

  signUp: {
    color: Colors.primary,
    fontFamily: "Bold",
  },
});
