import React, { ReactNode, useEffect, useRef } from "react";
import {
  Animated,
  Dimensions,
  Keyboard,
  Modal,
  StyleSheet,
  TouchableWithoutFeedback,
  View,
} from "react-native";

const { height } = Dimensions.get("window");
type BottomSheetModalProps = {
  visible: boolean;
  onClose: () => void;
  children: ReactNode;
  sheetHeight?: number;
};
const BottomSheetModal = ({
  visible,
  onClose,
  children,
  sheetHeight = height * 0.35,
}:BottomSheetModalProps) => {
  const translateY = useRef(new Animated.Value(sheetHeight)).current;
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      openSheet();
    } else {
      closeSheet();
    }
  }, [visible]);

useEffect(() => {
  const showSub = Keyboard.addListener("keyboardDidShow", (e) => {
    Animated.timing(translateY, {
      toValue: sheetHeight -( e.endCoordinates.height * 2.1),
      duration: 250,
      useNativeDriver: true,
    }).start();
  });

  const hideSub = Keyboard.addListener("keyboardDidHide", () => {
    Animated.timing(translateY, {
      toValue: 0, 
      duration: 250,
      useNativeDriver: true,
    }).start();
  });

  return () => {
    showSub.remove();
    hideSub.remove();
  };
}, [sheetHeight, translateY]);

  const openSheet = () => {
    Animated.parallel([
      Animated.timing(translateY, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(opacity, {
        toValue: 1,
        duration: 250,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const closeSheet = () => {
    Animated.parallel([
      Animated.timing(translateY, {
        toValue: sheetHeight,
        duration: 250,
        useNativeDriver: true,
      }),
      Animated.timing(opacity, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start(() => {
      onClose?.();
    });
  };

  return (
    <Modal transparent visible={visible} animationType="none">
      {/* Overlay */}
      <TouchableWithoutFeedback onPress={closeSheet}>
        <Animated.View style={[styles.overlay, { opacity }]} />
      </TouchableWithoutFeedback>

      {/* Bottom Sheet */}
      <Animated.View
        style={[
          styles.sheet,
          {
            height: sheetHeight,
            transform: [{ translateY }],
          },
        ]}
      >
        {/* Drag Indicator */}
        <View style={styles.indicator} />

        {children}
      </Animated.View>
    </Modal>
  );
};

export default BottomSheetModal;
const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
  },
  sheet: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    backgroundColor: "#fff",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 16,
  },
  indicator: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: "#ccc",
    alignSelf: "center",
    marginBottom: 12,
  },
});
