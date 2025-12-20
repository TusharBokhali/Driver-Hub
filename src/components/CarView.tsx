import { Images } from "@/assets/Images";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { useNavigation } from "@react-navigation/native";
import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Image,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";
import { Api } from "../Api/Api";
import { ToastShow } from "../context/ToastContext";
import { User } from "../context/UserContext";
import { Colors } from "../utils/Colors";
import { height, width } from "../utils/Dimensions";
import { handleApiResponse } from "./ErrorHandle";

export default function CarView({
  data = [],
  type,
  Search = "",
  IsLoading = false,
}: any) {
  const { navigate } = useNavigation<any>();
  const [animateKey, setAnimateKey] = useState(0);
  const { Toast, setToast } = useContext(ToastShow);

  const { user, AllFavorites, setAllFavorites } = useContext<any>(User);

  useEffect(() => {
    setAnimateKey((prev) => prev + 1);
  }, []);

  

  const GetFavoritesData = async () => {
    try {
      const res = await axios.get(Api.getfavorites, {
        headers: {
          Authorization: `Bearer ${user?.token}`,
        },
      });

      if (res?.data?.success) {
        setAllFavorites(res.data.data);
      }
    } catch (error) {
      console.log("GetFavoritesData Error:", error);
    }
  };

  const FavoritesAdd = async (item: any) => {
    try {
      const res = await axios.post(
        Api.getfavorites,
        { carId: item?._id },
        {
          headers: {
            Authorization: `Bearer ${user?.token}`,
          },
        }
      );

      if (res?.data?.success) {
        GetFavoritesData();
        setToast({
          visible: true,
          type: "success",
          message: res.data.message,
        });
      }
    } catch (error) {
      setToast({
        visible: true,
        type: handleApiResponse(error)?.type,
        message: handleApiResponse(error)?.message,
      });
    }
  };

  const RemoveFavorites = async (item: any) => {
    try {
      const res = await axios.delete(`${Api.getfavorites}/${item?._id}`, {
        headers: {
          Authorization: `Bearer ${user?.token}`,
        },
      });

      if (res?.data?.success) {
        GetFavoritesData();
        setToast({
          visible: true,
          type: "success",
          message: res.data.message,
        });
      }
    } catch (error) {
      setToast({
        visible: true,
        type: handleApiResponse(error)?.type,
        message: handleApiResponse(error)?.message,
      });
    }
  };



  const filterData = () => {
    if (!Search) return data;
    return data.filter((item: any) =>
      item?.title?.toLowerCase().includes(Search.toLowerCase())
    );
  };



  return (
    <Animated.View
      key={animateKey}
      entering={FadeInDown.duration(200)}
      style={styles.container}
    >
      <View style={styles.CarList}>
        {data?.length > 0 && (
          <View style={styles.Flex}>
            <Text style={styles.Title}>
              {data[0]?.owner?.title ?? ""}
            </Text>
          </View>
        )}

        <FlatList
          data={filterData()}
          scrollEnabled={false}
          contentContainerStyle={{ paddingBottom: 100, gap: 25 }}
          keyExtractor={(item: any, index) =>
            item?._id?.toString() ?? index.toString()
          }
          ListEmptyComponent={() =>
            !IsLoading ? (
              <View
                style={[
                  styles.Flex,
                  { height: height * 0.35, width: width - 25,justifyContent:'center',alignItems:'center' },
                ]}
              >
                <Text style={[styles.Title, { textAlign: "center" }]}>
                  No Data
                </Text>
              </View>
            ) : null
          }
          ListFooterComponent={() =>
            IsLoading ? (
              <View
                style={[
                  styles.Flex,
                  { height: height * 0.35, width: width - 25, justifyContent:'center',alignItems:'center'},
                ]}
              >
                <ActivityIndicator
                  size="large"
                  color={Colors.primary}
                />
              </View>
            ) : null
          }
          renderItem={({ item }) => (
            <Pressable
              style={styles.CarBox}
              onPress={() => navigate("Details", { item })}
            >
              {/* TOP */}
              <View style={styles.TopFixed}>
                {item?.isAvailable && (
                  <View style={styles.Status}>
                    <Text style={styles.StatusText}>Available</Text>
                  </View>
                )}

                <TouchableOpacity
                  style={styles.Heart}
                  onPress={() =>
                    AllFavorites?.ids?.includes(item?._id)
                      ? RemoveFavorites(item)
                      : FavoritesAdd(item)
                  }
                >
                  <FontAwesome
                    name="heart"
                    size={18}
                    color={
                      AllFavorites?.ids?.includes(item?._id)
                        ? Colors.Likes
                        : Colors.dark
                    }
                  />
                </TouchableOpacity>
              </View>

              {/* IMAGE */}
              <Image
                source={
                  item?.images?.length > 0
                    ? { uri: Api?.BASE_URL + item.images[0].url }
                    : Images.Car1
                }
                style={styles.ImagesStyle}
              />

              {/* CONTENT */}
              <View style={{ padding: 10 }}>
                <Text style={styles.Title}>{item?.title ?? ""}</Text>

                <Text style={styles.DarkText}>
                  {`${item?.year} • ${item?.mileage}Km`}
                </Text>

                <View style={styles.Flex}>
                  <Text style={styles.Price}>₹{item?.price}</Text>

                  <TouchableOpacity
                    style={styles.Button}
                    onPress={() => navigate("Details", { item })}
                  >
                    <Text style={styles.ButtonText}>
                      View Details
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </Pressable>
          )}
        />
      </View>

    
    </Animated.View>
  );
}

/* ================= STYLES ================= */

const styles = StyleSheet.create({
  container: { width: "100%" },
  CarList: { width: "100%", marginTop: 20 },
  Flex: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  CarBox: {
    backgroundColor: Colors.white,
    marginTop: 15,
    elevation: 5,
    borderRadius: 20,
  },
  Title: { fontSize: 18, fontFamily: "Bold" },
  ImagesStyle: {
    width: "100%",
    height: 200,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  DarkText: {
    color: Colors.dark,
    fontFamily: "SemiBold",
    fontSize: 14,
    marginVertical: 4,
  },
  Price: {
    fontSize: 18,
    fontFamily: "SemiBold",
    color: Colors.black,
  },
  Button: {
    backgroundColor: Colors.primary,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 7,
  },
  ButtonText: {
    color: Colors.white,
    fontFamily: "regular",
    fontSize: 14,
  },
  TopFixed: {
    position: "absolute",
    zIndex: 2,
    top: 10,
    left: 10,
    right: 10,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  Heart: {
    backgroundColor: Colors.darkwhite,
    padding: 8,
    borderRadius: 15,
  },
  Status: {
    backgroundColor: Colors.green,
    paddingHorizontal: 8,
    paddingTop: 5,
    borderRadius: 10,
  },
  StatusText: {
    color: Colors.white,
    fontSize: 14,
    fontFamily: "regular",
  },
});
