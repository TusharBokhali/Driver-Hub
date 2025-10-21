import { StyleSheet, TouchableOpacity, View } from "react-native";
import { Colors } from "../utils/Colors";

type RadioButtonProps = {
  selected: boolean;
  onPress: () => void;
  
};

export const RadioButton = ({ selected, onPress,  }: RadioButtonProps) => {
  return (
    <TouchableOpacity style={styles.container} onPress={onPress}>
      <View style={[styles.circle, selected && styles.circleSelected]} />
    </TouchableOpacity>
  );
};


const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
  },
  circle: {
    height: 20,
    width: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: Colors.darkwhite,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10,
  },
  circleSelected: {
    backgroundColor: Colors.primary,
  },
  label: {
    fontSize: 16,
  },
});