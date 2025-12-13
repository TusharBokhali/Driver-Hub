import React from "react";
import { ActivityIndicator, StyleSheet, View } from "react-native";
import Modal from "react-native-modal";

type LoaderProps = {
  visible: boolean;
};

const Loader: React.FC<LoaderProps> = ({ visible }) => {
  return (
    <Modal
      isVisible={visible}
      backdropOpacity={0.3}
      animationIn="fadeIn"
      animationOut="fadeOut"
      useNativeDriver
    >
      <View style={styles.container}>
        <View style={styles.loaderBox}>
          <ActivityIndicator size="large" color="#2563EB" />
        </View>
      </View>
    </Modal>
  );
};

export default Loader;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loaderBox: {
    width: 90,
    height: 90,
    borderRadius: 14,
    backgroundColor: "rgba(255,255,255,0.95)",
    justifyContent: "center",
    alignItems: "center",
  },
});
