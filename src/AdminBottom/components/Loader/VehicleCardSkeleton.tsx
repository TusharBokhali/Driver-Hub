import React from "react";
import { Dimensions, StyleSheet } from "react-native";
import Skeleton from "react-native-reanimated-skeleton";

const { width } = Dimensions.get("window");

type Props = {
  isLoading?: boolean;
};

export default function VehicleCardSkeleton({ isLoading = true }: Props) {
  return (
    <Skeleton
      isLoading={isLoading}
      containerStyle={styles.card}
      boneColor="#E5E7EB"
      highlightColor="#F3F4F6"
      layout={[
        // Left image box
        {
          key: "image",
          width: 64,
          height: 64,
          borderRadius: 12,
          marginRight: 12,
        },

        // Right content
        {
          key: "content",
          flexDirection: "column",
          children: [
            // Title
            {
              key: "title",
              width: width * 0.45,
              height: 14,
              borderRadius: 4,
              marginBottom: 6,
            },

            // Subtitle
            {
              key: "subtitle",
              width: width * 0.35,
              height: 12,
              borderRadius: 4,
              marginBottom: 10,
            },

            // Tags row
            {
              key: "tags",
              flexDirection: "row",
              marginBottom: 10,
              children: [
                {
                  key: "tag1",
                  width: 50,
                  height: 18,
                  borderRadius: 9,
                  marginRight: 6,
                },
                {
                  key: "tag2",
                  width: 80,
                  height: 18,
                  borderRadius: 9,
                  marginRight: 6,
                },
                {
                  key: "tag3",
                  width: 70,
                  height: 18,
                  borderRadius: 9,
                },
              ],
            },

            // Price + switch
            {
              key: "footer",
              flexDirection: "row",
              justifyContent: "space-between",
              children: [
                {
                  key: "price",
                  width: 80,
                  height: 14,
                  borderRadius: 4,
                },
                {
                  key: "switch",
                  width: 42,
                  height: 22,
                  borderRadius: 11,
                },
              ],
            },
          ],
        },
      ]}
    />
  );
}

const styles = StyleSheet.create({
  card: {
    width: "100%",
    padding: 14,
    borderRadius: 16,
    backgroundColor: "#FFFFFF",
    flexDirection: "row",
    marginBottom: 12,
  },
});
