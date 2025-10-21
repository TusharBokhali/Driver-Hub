import React from "react";
import {
  Image,
  Platform,
  StyleSheet,
  View,
  useWindowDimensions,
} from "react-native";
import Carousel from "react-native-reanimated-carousel";

type Props = {
  AllImage: any[]; 
};

export default function CarouselSlider({ AllImage }: Props) {
  const { width } = useWindowDimensions();

  const itemWidth = width * 0.90;
  const carouselWidth = width;

  return (
    <View style={styles.wrapper}>
      <View style={styles.shadowBox}>
        <Carousel
          loop
          width={carouselWidth}
          height={width / 2}
          autoPlay
          autoPlayInterval={2500}
          data={AllImage}
          mode="parallax"
          modeConfig={{
            parallaxScrollingScale: 0.9,
            parallaxAdjacentItemScale: 0.65,
          }}
          pagingEnabled
          snapEnabled
          defaultIndex={0}
          renderItem={({ item }: any) => (
            <View
              style={[
                styles.itemBox,
                {
                  width: itemWidth,
                },
              ]}
            >
              <Image source={item} style={styles.image} />
            </View>
          )}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
  shadowBox: {
    width: "100%",
    overflow: "hidden", 
    
  },
  itemBox: {
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 20,
    overflow: "hidden",
    alignSelf:'center'
  },
  image: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
});
