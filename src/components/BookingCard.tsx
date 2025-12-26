import { Images } from "@/assets/Images";
import React from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { baseUrl } from "../Api/Api";
import { timeAgo } from "./TimeAgo";


const Colors = {
    white: "#FFFFFF",
    black: "#000000",
    red: "#EF4444",
    green: "#22C55E",
};

type Type = {
    user: boolean,
    data: any,
    onPress?: () => void,
}

const formatDate = (date: string | Date) => {
    const d = new Date(date);
    return d.toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
    });
};

function parseColor(color: string) {
  if (color.startsWith("#")) {
    let c = color.slice(1);
    if (c.length === 3) c = c.split("").map(ch => ch + ch).join("");
    const r = parseInt(c.slice(0, 2), 16);
    const g = parseInt(c.slice(2, 4), 16);
    const b = parseInt(c.slice(4, 6), 16);
    return [r, g, b];
  } else if (color.startsWith("rgb")) {
    const nums = color.match(/\d+/g);
    if (nums) return nums.map(Number);
  }
  return [128, 128, 128];
}

function getReadableTextColor(bgColor: string) {
  const [r, g, b] = parseColor(bgColor);

  const luminance =
    0.2126 * (r / 255) +
    0.7152 * (g / 255) +
    0.0722 * (b / 255);


  return luminance > 0.5 ? "#111" : "#fff";
}


export default function BookingCard({ user, data, onPress}: Type) {
    return (
        <View style={styles.card}>
            <View style={styles.rowBetween}>
                <View style={styles.row}>
                    <View style={styles.avatar}>
                        <Image 
                        source={data?.user?.profileImage ? {uri:baseUrl+data?.user?.profileImage} : Images.Driver}
                        style={{width:'100%',height:'100%',borderRadius:22,resizeMode:'cover'}}
                        />
                    </View>
                    <View>
                        <Text style={styles.name}>{data?.user?.name}</Text>
                        <Text style={styles.subText}>{"+" + data?.phone || ""}</Text>
                        <Text style={styles.subText}>Booked at {timeAgo(data?.createdAt)}</Text>
                    </View>
                </View>

            </View>

            <View style={styles.divider} />

            <View>
                <Text style={styles.carTitle}>{data?.vehicleId?.title}</Text>
                <Text style={styles.subText}>{data?.vehicleId?.category}</Text>
            </View>

            <View style={styles.infoBox}>
                <View>
                    <Text style={styles.label}>Start Date</Text>
                    <Text style={styles.value}>{formatDate(data?.startDate)}</Text>
                </View>
                <View>
                    <Text style={styles.label}>End Date</Text>
                    <Text style={styles.value}>{formatDate(data?.endDate)}</Text>
                </View>

                <View>
                    <Text style={styles.label}>Type</Text>
                    <Text style={styles.value}>{data?.paymentMethod?.replace(/_/g, " ")}</Text>
                </View>
            </View>

            <View style={styles.rowBetween}>
                <View>
                    <Text style={styles.price}>{data?.priceType?.currency_symbol}{Number(data?.priceType?.price)?.toFixed(2)}<Text style={styles.Dark}>({data?.priceType?.label})</Text></Text>
                    <Text style={styles.subText}>Total Amount</Text>
                </View>
                <View style={{ flexDirection: 'row', gap: 10 }}>
                    <View style={[styles.status,{backgroundColor:data?.statusColor || "#FEF3C7"}]}>
                        <Text style={[styles.statusText,{color:getReadableTextColor(data?.statusColor || "#FEF3C7")}]}>{data?.bookingStatus}</Text>
                    </View>
                    {
                        data?.bookingStatus === "pending" &&
                        <TouchableOpacity style={[styles.status, { backgroundColor: Colors.red }]} onPress={onPress}>
                            <Text style={[styles.statusText, { color: Colors.white }]}>Cancel</Text>
                        </TouchableOpacity>
                    }
                </View>
                {
                    !user &&
                    <View style={styles.actions}>
                        <TouchableOpacity style={styles.viewBtn}>
                            <Text style={styles.viewText}>View Details</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.rejectBtn}>
                            <Text style={styles.rejectText}>Reject</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.acceptBtn}>
                            <Text style={styles.acceptText}>Accept</Text>
                        </TouchableOpacity>
                    </View>
                }
            </View>
        </View>
    );
}
const styles = StyleSheet.create({
    card: {
        backgroundColor: Colors.white,
        borderRadius: 16,
        padding: 16,
        shadowColor: Colors.black,
        shadowOpacity: 0.08,
        shadowRadius: 10,
        elevation: 4,
    },
    row: {
        flexDirection: "row",
        alignItems: "center",
    },
    rowBetween: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
    avatar: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: "#E5E7EB",
        alignItems: "center",
        justifyContent: "center",
        marginRight: 12,
    },
    avatarText: {
        fontFamily: "SemiBold",
        color: Colors.black,
    },
    name: {
        fontFamily: "SemiBold",
        color: Colors.black,
        fontSize: 15,
    },
    subText: {
        fontFamily: "Regular",
        fontSize: 12,
        color: "#6B7280",
    },
    status: {
        backgroundColor: "#FEF3C7",
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 12,
    },
    statusText: {
        fontFamily: "Medium",
        fontSize: 12,
        color: "#F59E0B",
        textTransform: 'capitalize'
    },
    divider: {
        height: 1,
        backgroundColor: "#E5E7EB",
        marginVertical: 12,
    },
    carTitle: {
        fontFamily: "Bold",
        fontSize: 16,
        color: Colors.black,
    },
    infoBox: {
        backgroundColor: "#F9FAFB",
        borderRadius: 12,
        padding: 12,
        marginVertical: 12,
        flexDirection: "row",
        justifyContent: "space-between",
        flexWrap: "wrap",
    },
    label: {
        fontFamily: "Regular",
        fontSize: 11,
        color: "#6B7280",
    },
    value: {
        fontFamily: "Medium",
        fontSize: 13,
        color: Colors.black,
        marginBottom: 8,
    },
    price: {
        fontFamily: "Bold",
        fontSize: 16,
        color: Colors.black,
    },
    actions: {
        flexDirection: "row",
        gap: 8,
    },
    viewBtn: {
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 10,
        backgroundColor: "#F3F4F6",
    },
    viewText: {
        fontFamily: "Medium",
        fontSize: 13,
        color: Colors.black,
    },
    rejectBtn: {
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 10,
        backgroundColor: "#FEE2E2",
    },
    rejectText: {
        fontFamily: "Medium",
        fontSize: 13,
        color: Colors.red,
    },
    acceptBtn: {
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 10,
        backgroundColor: "#DCFCE7",
    },
    acceptText: {
        fontFamily: "Medium",
        fontSize: 13,
        color: Colors.green,
    },
    Dark: {
        fontFamily: 'regular',
        fontSize: 11,
        color: Colors.black
    }
});
