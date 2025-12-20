import { Api } from '@/src/Api/Api';
import CarView from '@/src/components/CarView';
import { User } from '@/src/context/UserContext';
import { Colors } from '@/src/utils/Colors';
import { useIsFocused } from '@react-navigation/native';
import axios from 'axios';
import React, { useContext, useEffect } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

export default function Saved() {

  const Focused = useIsFocused();
  const { user, setUser,AllFavorites,setAllFavorites } = useContext<any>(User);
  

  const GetFavoritesData = async () => {
    try {

      let res = await axios.get(Api.getfavorites, {
        headers: {
          'Authorization': `Bearer ${user?.token}`,
          'Content-Type': 'application/json'
        }
      });
      console.log("Get Car", res?.data?.data);
      if (res?.data?.success) {
        
        setAllFavorites(res?.data?.data)
      }
    } catch (error) {
      console.log("GetFavoritesData Car Error:-", error);
    }
    finally {
    }
  }

  

  useEffect(() => {
    if(AllFavorites?.length === 0){
      GetFavoritesData();
    }
  }, [])

  return (
    <View style={styles.container}>
      <Text style={styles.Heading}>Favorites</Text>
      <ScrollView 
      scrollEnabled={AllFavorites?.cars?.length > 0}
      style={{flex:1}}
      contentContainerStyle={{paddingBottom:50}}
      showsVerticalScrollIndicator={false}
      >
       
      <CarView data={AllFavorites?.cars} />

      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
    paddingHorizontal: 15
  },
  Heading: {
    fontSize: 22,
    color: Colors.black,
    fontFamily: 'regular'
  }
});