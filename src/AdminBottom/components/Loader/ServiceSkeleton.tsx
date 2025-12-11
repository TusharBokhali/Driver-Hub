import { Colors } from "@/src/utils/Colors";
import React from "react";
import { View } from "react-native";
import Skeleton from "react-native-reanimated-skeleton";

export default function ServiceSkeleton({ width =null, isLoading = true }:any) {
  return (
    <Skeleton
      isLoading={isLoading}
      containerStyle={{
        width: width ? width :'48%',
        padding: 16,
        borderRadius: 12,
        backgroundColor: Colors.white,
      }}
      layout={[
        { key: "icon", width: 40, height: 40, borderRadius: 20, marginBottom: 16 },
        { key: "count", width:  100, height: 34, borderRadius: 6, marginBottom: 12 },
        { key: "title", width: width ? width*0.8 : 140, height: 16, borderRadius: 6, marginBottom: 8 },
        { key: "sub", width: width ? width*0.8 : 100, height: 14, borderRadius: 6 },
      ]}
    >
      <View>
      </View>
    </Skeleton>
  );
}
