import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, TextInput, View } from "react-native";

type Props = {
  value: string;
  setValue: (text: string) => void;
  Container?: any;
  edit?: boolean;
};

export default function SearchInput({
  value,
  setValue,
  Container,
  edit = true,
}: Props) {
  return (
    <View style={[styles.container, Container]}>
      <Ionicons name="search-outline" size={20} color="#9CA3AF" />
      <TextInput
        value={value}
        onChangeText={setValue}
        editable={edit}
        placeholder="Search vehicles, services..."
        placeholderTextColor="#9CA3AF"
        style={styles.input}
      />
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F3F4F6",
    borderRadius: 999,
    paddingHorizontal: 14,
    height: 44,
  },
  input: {
    flex: 1,
    marginLeft: 8,
    fontSize: 15,
    color: "#111827",
  },
});
