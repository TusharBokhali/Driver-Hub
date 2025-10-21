import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import Modal from 'react-native-modal';
import { Colors } from "../utils/Colors";

type Props = {
  visible: boolean;
  onClose: () => void;
  onConfirm: () => void;
};

export default function LogoutModal({ visible, onClose, onConfirm }: Props) {
  return (
    <Modal
      backdropColor="transparent"
      isVisible={visible}
      animationIn={'bounceInDown'}
      animationOut={'bounceOutDown'}
      onBackdropPress={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.modalBox}>
          <Text style={styles.title}>Logout</Text>
          <Text style={styles.message}>
            Are you sure you want to logout?
          </Text>

          <View style={styles.buttonContainer}>
            <TouchableOpacity onPress={onClose} style={[styles.button, styles.cancelBtn]}>
              <Text style={[styles.btnText, styles.cancelText]}>Cancel</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={onConfirm} style={[styles.button, styles.logoutBtn]}>
              <Text style={[styles.btnText, styles.logoutText]}>Logout</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  modalBox: {
    width: "100%",
    backgroundColor: Colors.white,
    borderRadius: 16,
    padding: 20,
    shadowColor: Colors.black,
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 6,
    elevation: 8,
  },
  title: {
    fontSize: 20,
    fontWeight: "700",
    color: Colors.border1,
    textAlign: "center",
    fontFamily:'regular'

  },
  message: {
    fontSize: 15,
    color: Colors.black,
    textAlign: "center",
    marginVertical: 15,
    fontFamily:'regular'

  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
  },
  button: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: "center",
    marginHorizontal: 5,
  },
  cancelBtn: {
    backgroundColor: Colors.darkwhite
  },
  logoutBtn: {
    backgroundColor: Colors.Likes,
    
  },
  btnText: {
    fontSize: 16,
    fontWeight: "600",
    fontFamily:'regular'

  },
  cancelText: {
    color: Colors.dark,
    fontFamily:'regular'

  },
  logoutText: {
    color: Colors.white,
    fontFamily:'regular'
  },
});
