import { Colors } from "@/src/utils/Colors";
import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import Modal from "react-native-modal";

type Props = {
  visible: boolean;
  title?: string;
  message?: string;
  confirmText?: string;
  cancelText?: string;
  loading?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
};

export default function ConfirmDeleteModal({
  visible,
  title = "Delete Vehicle",
  message = "Are you sure you want to delete this vehicle? This action cannot be undone.",
  confirmText = "Delete",
  cancelText = "Cancel",
  loading = false,
  onConfirm,
  onCancel,
}: Props) {
  return (
    <Modal
      isVisible={visible}
      onBackdropPress={onCancel}
      onBackButtonPress={onCancel}
      backdropOpacity={0.5}
      animationIn="zoomIn"
      animationOut="zoomOut"
      useNativeDriver
    >
      <View style={styles.container}>
        <View style={styles.iconCircle}>
          <Text style={styles.icon}>🗑️</Text>
        </View>

        <Text style={styles.title}>{title}</Text>
        <Text style={styles.message}>{message}</Text>

        <View style={styles.actions}>
          <Pressable
            style={[styles.btn, styles.cancelBtn]}
            onPress={onCancel}
            disabled={loading}
          >
            <Text style={styles.cancelText}>{cancelText}</Text>
          </Pressable>

          <Pressable
            style={[
              styles.btn,
              styles.deleteBtn,
              loading && { opacity: 0.7 },
            ]}
            onPress={onConfirm}
            disabled={loading}
          >
            <Text style={styles.deleteText}>
              {loading ? "Deleting..." : confirmText}
            </Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
}
const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.white,
    borderRadius: 20,
    padding: 20,
    alignItems: "center",
  },
  iconCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "#FEE2E2",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
  },
  icon: {
    fontSize: 26,
  },
  title: {
    fontSize: 18,
    fontFamily: "Bold",
    color: Colors.dark,
    marginBottom: 6,
  },
  message: {
    fontSize: 14,
    color: "#6B7280",
    textAlign: "center",
    marginBottom: 20,
  },
  actions: {
    flexDirection: "row",
    gap: 12,
    width: "100%",
  },
  btn: {
    flex: 1,
    height: 46,
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
  },
  cancelBtn: {
    backgroundColor: "#F3F4F6",
  },
  deleteBtn: {
    backgroundColor: Colors.red,
  },
  cancelText: {
    color: "#374151",
    fontFamily: "SemiBold",
  },
  deleteText: {
    color: Colors.white,
    fontFamily: "SemiBold",
  },
});
