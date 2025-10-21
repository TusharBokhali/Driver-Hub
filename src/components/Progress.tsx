import React, { useEffect, useRef } from "react";
import { View, Text, StyleSheet, Animated, Easing } from "react-native";
import { Colors } from "../utils/Colors";

type Props = {
  currentStep: number;
  totalSteps: number;
  title: string;
};

export default function Progress({ currentStep, totalSteps, title }: Props) {
  const progress = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const progressValue = currentStep / totalSteps;

    Animated.timing(progress, {
      toValue: progressValue,
      duration: 500,
      easing: Easing.inOut(Easing.ease),
      useNativeDriver: false,
    }).start();
  }, [currentStep]);

  return (
    <View style={styles.container}>
      
      <View style={styles.header}>
        <Text style={styles.stepText}>
          Step {currentStep} of {totalSteps}
        </Text>
        <Text style={styles.title}>{title}</Text>
      </View>

      
      <View style={styles.progressBarBackground}>
        <Animated.View
          style={[
            styles.progressBarFill,
            {
              width: progress.interpolate({
                inputRange: [0, 1],
                outputRange: ["0%", "100%"],
              }),
            },
          ]}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.Bookborder,
    paddingVertical:20
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 6,
  },
  stepText: {
    color: "#007AFF", 
    fontWeight: "600",
  },
  title: {
    fontWeight: "500",
    color: "#333",
  },
  progressBarBackground: {
    height: 6,
    backgroundColor: "#E5E5E5",
    borderRadius: 4,
    overflow: "hidden",
  },
  progressBarFill: {
    height: "100%",
    backgroundColor: "#007AFF",
    borderRadius: 4,
  },
});
