import { Images } from '@/assets/Images';
import { Colors } from '@/src/utils/Colors';
import React, { useEffect, useState } from 'react';
import { Image, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import Modal from 'react-native-modal';

type Props = {
  visible: boolean;
  onClose: () => void;
  onUpdate: (data: { email: string; phone?: string, name?:string}) => void;
  defaultEmail?: string;
  defaultPhone?: string;
  defaultName?:string | any;
};

export default function UpdateProfileModal({
  visible,
  onClose,
  onUpdate,
  defaultEmail,
  defaultPhone,
  defaultName,
}: Props) {
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [name,setName] = useState('');

  useEffect(() => {
    if (defaultEmail) setEmail(defaultEmail);
    if (defaultPhone) setPhone(defaultPhone);
    if(defaultName) setName(defaultName)
  }, [defaultEmail, defaultPhone,defaultName]);

  return (
    <Modal
      isVisible={visible}
      onBackdropPress={onClose}
      backdropOpacity={0.4}
      animationIn="bounceInDown"
      animationOut="bounceOutDown"
      useNativeDriver
    >
      <View style={styles.container}>
        <Text style={styles.title}>Update Profile</Text>

        {/* Email Input */}
        <View style={styles.inputContainer}>
          <Image source={Images.Driver} style={styles.icon} resizeMode="contain" />
          <TextInput
            style={styles.input}
            placeholder="Enter your name"
            placeholderTextColor={Colors.placeHolder}
            keyboardType="default"
            returnKeyType='done'
            textContentType='givenName'
            value={name}
            onChangeText={setName}
          />
        </View>
        <View style={styles.inputContainer}>
          <Image source={Images.FullEmail} style={styles.icon} resizeMode="contain" />
          <TextInput
            style={styles.input}
            placeholder="Enter your email"
            placeholderTextColor={Colors.placeHolder}
            keyboardType="email-address"
            value={email}
            onChangeText={setEmail}
          />
        </View>

        {/* Phone Input */}
        <View style={styles.inputContainer}>
          <Image source={Images.Phone} style={styles.icon} resizeMode="contain" />
          <TextInput
            style={styles.input}
            placeholder="Enter your phone"
            placeholderTextColor={Colors.placeHolder}
            keyboardType="phone-pad"
            value={phone}
            onChangeText={setPhone}
          />
        </View>

        {/* Update Button */}
        <TouchableOpacity
          style={styles.updateBtn}
          onPress={() => {
            onUpdate({ email, phone, name });
            onClose();
          }}
        >
          <Text style={styles.updateText}>Update</Text>
        </TouchableOpacity>

        {/* Cancel Button */}
        <TouchableOpacity style={styles.cancelBtn} onPress={onClose}>
          <Text style={styles.cancelText}>Cancel</Text>
        </TouchableOpacity>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.white,
    borderRadius: 16,
    padding: 20,
  },
  title: {
    color: Colors.black,
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 18,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.gray,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: Colors.lightGray,
    paddingHorizontal: 12,
    marginBottom: 12,
  },
  icon: {
    width: 30,
    height: 30,
    marginRight: 10,
    // tintColor: Colors.dark,
  },
  input: {
    flex: 1,
    color: Colors.black,
    paddingVertical: 10,
    fontSize: 15,
  },
  updateBtn: {
    backgroundColor: Colors.primary,
    borderRadius: 10,
    paddingVertical: 12,
    marginTop: 10,
  },
  updateText: {
    color: Colors.white,
    textAlign: 'center',
    fontSize: 16,
    fontWeight: '600',
  },
  cancelBtn: {
    marginTop: 12,
  },
  cancelText: {
    color: Colors.dark,
    textAlign: 'center',
    fontSize: 14,
    textDecorationLine: 'underline',
  },
});
