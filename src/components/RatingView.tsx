import Icon from '@expo/vector-icons/FontAwesome';
import React from "react";
import { StyleSheet, View } from "react-native";
import { Colors } from "../utils/Colors";

type Props = {
  rating: number;   
  maxRating?: number;
  Size:number
};

const StarRating = ({ rating, maxRating = 5, Size }: Props) => {
  const stars = [];

  for (let i = 1; i <= maxRating; i++) {
    if (i <= Math.floor(rating)) {
      stars.push(<Icon key={i} name="star" size={Size} color={Colors.star} />); 
    } else if (i - rating < 1) {
      stars.push(<Icon key={i} name="star-half-full" size={Size} color={Colors.star} />); 
    } else {
      stars.push(<Icon key={i} name="star-o" size={Size} color={Colors.star} />); 
    }
  }

  return <View style={styles.container}>{stars}</View>;
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
  },
});

export default StarRating;
