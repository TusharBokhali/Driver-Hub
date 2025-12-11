import React from "react";
import {
    GestureResponderEvent,
    Image,
    ImageSourcePropType,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
    ViewStyle
} from "react-native";

type StatusType = "pending" | "accepted" | "rejected" | "ongoing" | "completed";

type BookingCardProps = {
  name: string;
  vehicle: string;
  datetime: string; // formatted display string: "Dec 15, 2024 • 2:30 PM"
  price: string | number; // show like "$135" or 135
  status?: StatusType;
  avatarUri?: string | null;
  // fallback to initials if no avatarUri
  bgColor?: string; // card background - default Colors.white
  textColor?: string; // main text color
  onPress?: (e: GestureResponderEvent) => void;
  containerStyle?: ViewStyle;
  // font family names - pass strings like "Inter-Regular", "Inter-Medium"
  fontRegular?: string;
  fontMedium?: string;
  // allow overriding badge colors
  statusColors?: Partial<Record<StatusType, string>>;
};

const defaultStatusColors: Partial<Record<StatusType, string>> = {
  pending: "#F59E0B",
  accepted: "#10B981",
  rejected: "#EF4444",
  ongoing: "#06B6D4",
  completed: "#06B6D4",
};

export default function BookingCard({
  name,
  vehicle,
  datetime,
  price,
  status = "pending",
  avatarUri,
  bgColor = "#FFFFFF",
  textColor = "#0F172A",
  onPress,
  containerStyle,
  fontRegular = "regular",
  fontMedium = "Medium",
  statusColors = {},
}: BookingCardProps) {
  
  const badgeColor = (statusColors[status] ?? defaultStatusColors[status]) as string;

  
  const initials = name
    ? name
        .split(" ")
        .map((s) => s[0])
        .slice(0, 2)
        .join("")
        .toUpperCase()
    : "";

  return (
    <TouchableOpacity
      activeOpacity={0.9}
      onPress={onPress}
      style={[styles.wrapper, { backgroundColor: bgColor }, containerStyle]}
    >
      <View style={styles.row}>
        {/* Avatar */}
        <View style={styles.avatarWrap}>
          {avatarUri ? (
            <Image source={{ uri: avatarUri } as ImageSourcePropType} style={styles.avatar} />
          ) : (
            <View style={[styles.avatarFallback, { backgroundColor: "#E6E9EE" }]}>
              <Text style={[styles.avatarInitials, { color: "#374151", fontFamily: fontMedium }]}>
                {initials}
              </Text>
            </View>
          )}
        </View>

        
        <View style={styles.content}>
          <Text style={[styles.name, { color: textColor, fontFamily: fontMedium }]} numberOfLines={1}>
            {name}
          </Text>
          <Text style={[styles.vehicle, { color: "#6B7280", fontFamily: fontRegular }]} numberOfLines={1}>
            {vehicle}
          </Text>
          <Text style={[styles.datetime, { color: "#9CA3AF", fontFamily: fontRegular }]} numberOfLines={1}>
            {datetime}
          </Text>
        </View>

        
        <View style={styles.right}>
          <Text style={[styles.price, { color: textColor, fontFamily: fontMedium }]}>
            {typeof price === "number" ? `$${price}` : price}
          </Text>

          <View style={[styles.badge, { backgroundColor: lightenHex(badgeColor, 0.85) }]}>
            <Text style={[styles.badgeText, { color: badgeColor, fontFamily: fontMedium }]}>
              {capitalize(status)}
            </Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
}


function capitalize(s: string) {
  if (!s) return s;
  return s.charAt(0).toUpperCase() + s.slice(1);
}


function lightenHex(hex: string, factor = 0.9) {
  try {
    const c = hex.replace("#", "");
    const num = parseInt(c.length === 3 ? c.split("").map(ch => ch+ch).join("") : c, 16);
    const r = Math.round(((num >> 16) & 0xff) + (255 - ((num >> 16) & 0xff)) * factor);
    const g = Math.round(((num >> 8) & 0xff) + (255 - ((num >> 8) & 0xff)) * factor);
    const b = Math.round((num & 0xff) + (255 - (num & 0xff)) * factor);
    return `rgb(${r}, ${g}, ${b})`;
  } catch (e) {
    return hex;
  }
}


const styles = StyleSheet.create({
  wrapper: {
    borderRadius: 14,
    padding: 14,
    shadowColor: "#000",
    shadowOpacity: 0.04,
    shadowOffset: { width: 0, height: 6 },
    shadowRadius: 12,
    elevation: 3,
    marginVertical: 8,
  },
  row: { flexDirection: "row", alignItems: "center" },

  avatarWrap: { width: 48, alignItems: "center", justifyContent: "center" },
  avatar: { width: 40, height: 40, borderRadius: 20 },
  avatarFallback: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },
    
  avatarInitials: { fontSize: 14,fontFamily: "Medium", },

  content: { flex: 1, paddingHorizontal: 12 },
  name: { fontSize: 16, marginBottom: 2 ,fontFamily: "Medium",},
  vehicle: { fontSize: 13 },
  datetime: { fontSize: 12, marginTop: 6,fontFamily: "Medium", },

  right: { alignItems: "flex-end", justifyContent: "space-between", height: 56 },
  price: { fontSize: 16 ,fontFamily: "Medium",},
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
    alignItems: "center",
    justifyContent: "center",
  },
  badgeText: { fontSize: 12 },
});
