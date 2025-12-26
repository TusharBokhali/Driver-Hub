import { StyleSheet, View } from "react-native";
import Skeleton from "react-native-reanimated-skeleton";


export const BookingCardSkeleton = () => {
  return (
    <View style={styles.card}>
      <Skeleton
        containerStyle={{ gap: 16 }}
        isLoading={true}
        animationDirection="horizontalRight"
        layout={[
          // Header
          {
            flexDirection: "row",
            alignItems: "center",
            children: [
              { width: 42, height: 42, borderRadius: 21 },
              {
                marginLeft: 12,
                gap: 8,
                children: [
                  { width: 120, height: 14, borderRadius: 6 },
                  { width: 160, height: 12, borderRadius: 6 },
                ],
              },
            ],
          },

          // Car name
          { width: 180, height: 16, borderRadius: 6 },

          // Date / Type row
          {
            flexDirection: "row",
            justifyContent: "space-between",
            children: [
              { width: 80, height: 12, borderRadius: 6 },
              { width: 80, height: 12, borderRadius: 6 },
              { width: 80, height: 12, borderRadius: 6 },
            ],
          },

          // Price
          { width: 140, height: 16, borderRadius: 6 },

          // Buttons
          {
            flexDirection: "row",
            justifyContent: "flex-end",
            gap: 10,
            children: [
              { width: 70, height: 30, borderRadius: 15 },
              { width: 70, height: 30, borderRadius: 15 },
            ],
          },
        ]}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 16,
    marginVertical: 10,
    marginHorizontal: 12,
    elevation: 2,
  },
});
