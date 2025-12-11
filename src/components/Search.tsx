import { Images } from '@/assets/Images';
import { useIsFocused } from '@react-navigation/native';
import React, { useEffect, useRef } from 'react';
import { Image, StyleSheet, TextInput, View } from 'react-native';
import { Colors } from '../utils/Colors';

type Input = {
  value: string;
  setValue: React.Dispatch<React.SetStateAction<string>>;
  Container?: object;
  autoFocus?: boolean;
  edit?: boolean;
};

export default function SearchInput({ value, setValue, Container, autoFocus = false, edit = true }: Input) {
  const inputRef = useRef<TextInput>(null);
  const Focused = useIsFocused();

  useEffect(() => {
    if (autoFocus) {
      const timeout = setTimeout(() => {
        inputRef.current?.focus();
      }, 100); 
      return () => clearTimeout(timeout); 
    }
  }, [autoFocus,Focused]);

  return (
    <View style={[styles.container, Container]}>
      <View style={styles.Flex}>
        <Image source={Images.Search} style={styles.Image} />
        <TextInput
          ref={inputRef}
          placeholder="Search vehicles, services..."
          style={styles.Input}
          placeholderTextColor={Colors.dark}
          value={value}
          editable={edit}
          onChangeText={setValue}
        />
      </View>
     
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.darkwhite,
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 10,
    justifyContent: 'space-between',
  },
  Image: {
    width: 16,
    height: 24,
  },
  Input: {
    width: '80%',
    fontSize: 14,
    color: Colors.black,
    fontFamily: 'regular',
  },
  Flex: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  Btn: {
    backgroundColor: Colors.primary,
    paddingVertical: 5,
    paddingHorizontal: 5,
    borderRadius: 7,
  },
});
