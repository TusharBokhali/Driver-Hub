import SearchInput from '@/src/components/Search';
import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';

export default function Search() {
  const [Search, setSearch] = useState<string>('')

  return (
    <View style={styles.container}>
      <SearchInput value={Search} setValue={setSearch} Container={styles.SearchStyle} autoFocus={true}/>

    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding:15
  },
  SearchStyle: {
    marginBottom: 15
  },
});