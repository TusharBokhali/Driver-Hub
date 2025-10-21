import React from "react";
import { View, ActivityIndicator, Text, StyleSheet } from "react-native";
import Modal from "react-native-modal";
import { Colors } from "../utils/Colors";

interface LoaderProps {
  visible?: boolean;
  text?: string;
  color?: string;
  backgroundColor?: string;
  size?: "small" | "large";
}

const Loader: React.FC<LoaderProps> = ({
  visible = true,
  text = "Loading...",
  color = Colors.primary,
  backgroundColor = "rgba(0,0,0,0.3)",
  size = "large",
}) => {
  return (
    <Modal
      isVisible={visible}
      backdropColor={backgroundColor}
      backdropOpacity={1}
      animationIn="fadeIn"
      animationOut="fadeOut"
      useNativeDriver
      style={styles.modal}
    >
      <View style={styles.loaderContainer}>
        <ActivityIndicator size={size} color={color} />
        {text ? <Text style={[styles.text, { color }]}>{text}</Text> : null}
      </View>
    </Modal>
  );
};

export default Loader;

const styles = StyleSheet.create({
  modal: {
    justifyContent: "center",
    alignItems: "center",
    margin: 0, 
  },
  loaderContainer: {
    backgroundColor: Colors.white,
    borderRadius: 12,
    paddingVertical: 20,
    paddingHorizontal: 25,
    alignItems: "center",
    justifyContent: "center",
    elevation: 6,
  },
  text: {
    marginTop: 8,
    fontSize: 16,
    fontWeight: "600",
  },
});
