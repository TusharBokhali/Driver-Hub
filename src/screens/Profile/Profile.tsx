import { Images } from '@/assets/Images';
import { Api } from '@/src/Api/Api';
import UpdateProfileModal from '@/src/components/EditProfile';
import Loader from '@/src/components/Loader';
import LogoutModal from '@/src/components/LogoutModal';
import ToastMessage from '@/src/components/ToastMessage';
import { User } from '@/src/context/UserContext';
import { Colors } from '@/src/utils/Colors';
import { AsyncStorageService } from '@/src/utils/store';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import * as DocumentPicker from "expo-document-picker";
import * as ImagePicker from "expo-image-picker";
import React, { useContext, useEffect, useRef, useState } from 'react';
import { Alert, Image, Platform, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import ActionSheet from "react-native-actionsheet";
export default function Profile({ navigation }: any) {
  let local: string = "http://192.168.1.9:5000"
  const { navigate, replace } = useNavigation<any>();
  const actionSheetRef = useRef<any>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [ProfilePicture, setProfilePicture] = useState<string | any>(null);
  const [IsLoading, setIsLoading] = useState(false);
  const { user, setUser } = useContext<any>(User);

  const [toast, setToast] = useState({
    visible: false,
    message: '',
    type: 'info' as 'success' | 'error' | 'info',
  })
  const pickDocument = async () => {
    const result: any = await DocumentPicker.getDocumentAsync({
      type: ["image/*", "application/pdf"],
    });
    let uri: any = result?.assets[0];
    const ext = uri.split('.').pop()?.toLowerCase();
    console.log(ext);

    if (!result?.canceled) {
      if (ext === 'jpg' || ext === 'jpeg' || ext === 'png') {
        setProfilePicture(uri);

      } else {
        Alert.alert("Error", "Please upload only image (JPG/PNG).");
      }
    }
  };

  const pickImageFromGallery = async () => {
    const result: any = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      quality: 1,
    });

    console.log(result.assets[0].uri);
    if (!result.canceled) {


      setProfilePicture(result.assets[0]);


    }
  };

  const openCamera = async () => {
    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ['images'],
      quality: 1,
    });

    if (!result.canceled) {

      setProfilePicture(result.assets[0]);


    }
  };


  const openOptions = () => {
    actionSheetRef.current.show();
  };
  const getMimeFromUri = (uri: string) => {
    const ext = uri.split('.').pop()?.toLowerCase();
    switch (ext) {
      case 'jpg':
      case 'jpeg':
        return 'image/jpeg';
      case 'png':
        return 'image/png';
      case 'webp':
        return 'image/webp';
      case 'pdf':
        return 'application/pdf';
      default:
        return 'application/octet-stream';
    }
  };

  const ProfileUpdateFun = async (data: any = null) => {
    setIsLoading(true);

    try {
      const formData = new FormData();

      formData.append('name', String(data?.name ?? user?.user?.name ?? ''));
      formData.append('email', String(data?.email ?? user?.user?.email ?? ''));
      formData.append('phone', String(data?.phone ?? user?.user?.phone ?? ''));

      if (ProfilePicture && ProfilePicture.uri) {
        const uri = ProfilePicture.uri.startsWith('file://')
          ? ProfilePicture.uri
          : 'file://' + ProfilePicture.uri;

        const inferredExt = (() => {
          const part = uri.split('?')[0];
          const ext = (part.split('.').pop() || '').toLowerCase();
          return ext || 'jpg';
        })();

        const mime = ProfilePicture.type?.includes('/')
          ? ProfilePicture.type
          : getMimeFromUri(uri);

        const name = ProfilePicture.fileName || `profile.${inferredExt}`;

        formData.append('profileImage', { uri, type: mime, name } as any);
      }


      const res = await axios.put(Api.ProfileUpdate, formData, {
        headers: {
          Authorization: `Bearer ${user?.token}`,
          'Content-Type': 'multipart/form-data',
        },
        transformRequest: (d) => d,
      });

      if (res.data?.success) {
        await AsyncStorageService.storeData('USERLOGIN', res.data.data);
        setUser(res.data.data);
        setToast({ visible: true, type: 'success', message: 'Profile updated successfully!' });
      } else {
        setToast({ visible: true, type: 'error', message: res.data?.message || 'Profile Update Failed!' });
      }
    } catch (error: any) {
      console.log('Profile Update Error:', error.response?.data || error.message);
      setToast({ visible: true, type: 'error', message: error.response?.data?.message || 'Profile Update Failed!' });
    } finally {
      setProfilePicture(''); // reset
      setIsLoading(false);
    }
  };



  useEffect(() => {
    if (ProfilePicture && ProfilePicture !== null) {
      ProfileUpdateFun()
    }
  }, [ProfilePicture])




  return (
    <View style={styles.container}>
      <ScrollView
        style={{ flexGrow: 1 }}
        contentContainerStyle={{ paddingBottom: 100 }}
        showsVerticalScrollIndicator={false}
      >


        <View style={styles.ImageContainer}>
          <Image
            source={{
              uri: ProfilePicture
                ? ProfilePicture.uri.startsWith('file://')
                  ? ProfilePicture.uri
                  : 'file://' + ProfilePicture.uri
                : user?.user?.profileImage
                  ? `${local}${user.user.profileImage}` 
                  : Images.Profile, 
            }}
            style={styles.ProfileImage}
          />

          <TouchableOpacity style={styles.CameraImage} onPress={() => openOptions()}>
            <Image
              source={Images.Camera}
              style={{ width: 35, height: 35 }}
            />
          </TouchableOpacity>
        </View>

        <View style={styles.AllContent}>
          <View style={styles.Box}>
            <Image
              source={Images.Driver}
              style={{ width: 40, height: 40 }}
            />
            <View>
              <Text style={styles.DarkText}>Name</Text>
              <Text style={styles.NormalText}>{user?.user?.name || ""}</Text>
            </View>
          </View>

          <View style={styles.Box}>
            <Image
              source={Images.FullEmail}
              style={{ width: 40, height: 40 }}
            />
            <View>
              <Text style={styles.DarkText}>Email</Text>
              <Text style={styles.NormalText}>{user?.user?.email}</Text>
            </View>
          </View>

          <TouchableOpacity style={styles.Box}>
            <Image
              source={Images.Phone}
              style={{ width: 40, height: 40 }}
            />
            <View>
              <Text style={styles.DarkText}>Phone</Text>
              {
                user?.user?.phone ?
                  <Text style={styles.NormalText}>{user?.user?.phone}</Text>
                  :
                  <Text style={styles.NormalText}>XXXXXX-XXX-XXXX</Text>
              }
            </View>
          </TouchableOpacity>

          <View style={styles.BookSections}>
            <View style={[styles.Flex, { marginBottom: 15 }]}>
              <Text style={styles.Heading}>Past Bookings</Text>
              <TouchableOpacity>
                <Text style={[styles.NormalText, { color: Colors.primary }]}>View All</Text>
              </TouchableOpacity>
            </View>
            <TouchableOpacity style={[styles.Box, { justifyContent: 'space-between', }]}>
              <View style={[styles.Flex, { gap: 10 }]}>
                <Image
                  source={Images.Doller}
                  style={{ width: 40, height: 40 }}
                />
                <View>
                  <Text style={styles.NormalText}>Sell - 2019 Honda Civic</Text>
                  <Text style={styles.DarkText}>Completed • Dec 15, 2023</Text>
                </View>
              </View>
              <Text style={[styles.NormalText, { color: Colors.green }]}>$18,500</Text>
            </TouchableOpacity>

            <TouchableOpacity style={[styles.Box, { justifyContent: 'space-between', marginTop: 15 }]}>
              <View style={[styles.Flex, { gap: 10 }]}>
                <Image
                  source={Images.FullRent}
                  style={{ width: 40, height: 40 }}
                />
                <View>
                  <Text style={styles.NormalText}>Rent - BMW X5</Text>
                  <Text style={styles.DarkText}>Completed • Nov 20, 2023</Text>
                </View>
              </View>
              <Text style={[styles.NormalText, { color: Colors.green }]}>$250/day</Text>
            </TouchableOpacity>

            <TouchableOpacity style={[styles.Box, { justifyContent: 'space-between', marginTop: 15 }]}>
              <View style={[styles.Flex, { gap: 10 }]}>
                <Image
                  source={Images.FullService}
                  style={{ width: 40, height: 40 }}
                />
                <View>
                  <Text style={styles.NormalText}>Service - Oil Change</Text>
                  <Text style={styles.DarkText}>Completed • Oct 10, 2023</Text>
                </View>
              </View>
              <Text style={[styles.NormalText, { color: Colors.green }]}>$85</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity style={[styles.Box, { justifyContent: 'space-between', }]} onPress={() => setModalVisible(true)}>
            <View style={[styles.Flex, { gap: 10 }]}>
              <Image
                source={Images.Edit}
                style={{ width: 40, height: 40 }}
              />
              <View>
                <Text style={styles.NormalText}>Edit Profile</Text>

              </View>
            </View>
            <Image
              source={Images.Back}
              style={{ width: 8, height: 16 }}
            />
          </TouchableOpacity>

          <TouchableOpacity style={[styles.Box, { justifyContent: 'space-between', }]} onPress={() => navigate('Notifications')}>
            <View style={[styles.Flex, { gap: 10 }]}>
              <Image
                source={Images.Notification}
                style={{ width: 40, height: 40 }}
              />
              <View>
                <Text style={styles.NormalText}>Notifications</Text>
              </View>
            </View>
            <Image
              source={Images.Back}
              style={{ width: 8, height: 16 }}
            />
          </TouchableOpacity>

          <TouchableOpacity style={[styles.Box, { justifyContent: 'space-between', }]}>
            <View style={[styles.Flex, { gap: 10 }]}>
              <Image
                source={Images.Privacy}
                style={{ width: 40, height: 40 }}
              />
              <View>
                <Text style={styles.NormalText}>Privacy & Security</Text>
              </View>
            </View>
            <Image
              source={Images.Back}
              style={{ width: 8, height: 16 }}
            />
          </TouchableOpacity>

          <TouchableOpacity style={[styles.Box, { justifyContent: 'space-between', }]}>
            <View style={[styles.Flex, { gap: 10 }]}>
              <Image
                source={Images.Help}
                style={{ width: 40, height: 40 }}
              />
              <View>
                <Text style={styles.NormalText}>Help & Support</Text>
              </View>
            </View>
            <Image
              source={Images.Back}
              style={{ width: 8, height: 16 }}
            />
          </TouchableOpacity>

          <TouchableOpacity style={[styles.LogOut,]} onPress={() => setShowModal(true)}>
            <Image
              source={Images.LogOut}
              style={{ width: 14, height: 20 }}
              resizeMode='contain'
            />
            <View>
              <Text style={[styles.NormalText, { color: Colors.red, }]}>Log out</Text>
            </View>
          </TouchableOpacity>
        </View>


      </ScrollView>
      <LogoutModal
        visible={showModal}
        onClose={() => setShowModal(false)}
        onConfirm={() => {
          AsyncStorage.clear();
          replace("Login")
        }}
      />

      <UpdateProfileModal
        visible={modalVisible}
        defaultEmail={user?.user?.email}
        defaultPhone={user?.user?.phone}
        defaultName={user?.user?.name}
        onClose={() => setModalVisible(false)}
        onUpdate={(data) => ProfileUpdateFun(data)}
      />

      <ActionSheet
        ref={actionSheetRef}
        options={["Camera", "Gallery", "Document", "Cancel"]}
        cancelButtonIndex={3}
        onPress={(index: number) => {
          if (index === 0) openCamera();
          if (index === 1) pickImageFromGallery();
          if (index === 2) pickDocument();
        }}
      />

      <Loader
        visible={IsLoading}
        text="Please wait..."
      />


      {toast.visible && (
        <ToastMessage
          type={toast.type}
          message={toast.message}
          onHide={() => setToast({ ...toast, visible: false })}
        />
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white
  },
  ImageContainer: {
    width: 80,
    height: 80,
    alignSelf: 'center',
    marginTop: 10,
    borderWidth: 4,
    borderColor: Colors.mediumDark,
    borderRadius: 120,
    justifyContent: 'center',
    alignItems: 'center'

  },
  ProfileImage: {
    width: '100%',
    height: '100%',
    borderRadius: 120,
    // resizeMode: 'contain'
  },
  CameraImage: {
    position: 'absolute',
    right: 0,
    bottom: -15
  },
  AllContent: {
    width: '100%',
    paddingHorizontal: 15,
    marginTop: '10%',
    gap: 15

  },
  Box: {
    backgroundColor: Colors.Bg,
    paddingVertical: 10,
    paddingHorizontal: 15,
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 7,
    gap: 10,
    borderWidth: 1,
    borderColor: Colors.border
  },
  DarkText: {
    // color:Colors.border1,
    color: Colors.dark,
    fontSize: 12,
    fontFamily: 'regular',
  },
  NormalText: {
    fontSize: 14,
    fontFamily: 'regular',
    color: Colors.border1,
  },
  Heading: {
    fontSize: 18,
    color: Colors.black,
    fontFamily: 'SemiBold',
  },
  Flex: {
    flexDirection: "row",
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  BookSections: {
    marginTop: 10,
    borderBottomWidth: 1,
    borderColor: Colors.darkwhite,
    paddingBottom: 15
  },
  LogOut: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    justifyContent: 'center',
    backgroundColor: '#FEF2F2',
    paddingVertical: 15,
    borderRadius: 7,
    borderWidth: 2,
    borderColor: '#FECACA',
    marginTop: 25
  }
});