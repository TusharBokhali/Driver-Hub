// VehicleCard.tsx
import { Colors } from "@/src/utils/Colors"; // your colors file
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import React from "react";
import {
    Dimensions,
    Image,
    StyleSheet,
    Switch,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

const { width: SCREEN_W } = Dimensions.get("window");

type Props = {
  imageSource?: any;
  title?: string;
  year?: string;
  km?: string;
  location?: string;
  tags?: string[]; 
  price?: string;
  published?: boolean;
  onEdit?: () => void;
  onDelete?: () => void;
  onTogglePublished?: (val: boolean) => void;
  style?: any;
};

export default function VehicleCard({
  imageSource,
  title = "Toyota Camry 2023",
  year = "2023",
  km = "15,000 km",
  location = "Downtown",
  tags = ["Rent", "With driver", "Available"],
  price = "$45/day",
  published = true,
  onEdit,
  onDelete,
  onTogglePublished,
  style,
}: Props) {
  return (
    <View style={[styles.card, style]}>
      <View style={styles.row}>
        {/* LEFT: image */}
        <View style={styles.imageWrap}>
          {imageSource ? (
            <Image source={imageSource} style={styles.image} resizeMode="cover" />
          ) : (
            <View style={styles.placeholder}>
              <Text style={styles.placeholderText}>Toyota</Text>
            </View>
          )}
        </View>

        {/* RIGHT: content */}
        <View style={styles.content}>
          <View style={styles.headerRow}>
            <Text style={styles.title} numberOfLines={1}>
              {title}
            </Text>

            <View style={styles.actionRow}>
              <TouchableOpacity onPress={onEdit} style={styles.iconBtn}>
                <MaterialCommunityIcons name="square-edit-outline" size={16} color={Colors.dark } />
              </TouchableOpacity>

              <TouchableOpacity onPress={onDelete} style={styles.iconBtn}>
                <FontAwesome5 name="trash-alt" size={16} color={Colors.dark } />
              </TouchableOpacity>
            </View>
          </View>

          <Text style={styles.meta}>{year} • {km}</Text>
          <Text style={styles.location}>{location}</Text>

          {/* Tags */}
          <View style={styles.tagsRow}>
            {tags.map((t, i) => (
              <View
                key={`${t}-${i}`}
                style={[
                  styles.tag,
                  // style particular tag colors if needed
                  t.toLowerCase().includes("rent") ? styles.tagPrimary : t.toLowerCase().includes("available") ? styles.tagGreen : styles.tagLight,
                ]}
              >
                <Text style={styles.tagText}>{t}</Text>
              </View>
            ))}
          </View>

          <View style={styles.footerRow}>
            <Text style={styles.price}>{price}</Text>

            <View style={styles.publishedRow}>
              <Text style={styles.publishedText}>Published</Text>
              <Switch
                value={published}
                onValueChange={(v) => onTogglePublished && onTogglePublished(v)}
                thumbColor={published ? Colors.primary : undefined}
                trackColor={{ false: "#d6d6d6", true: Colors.primary + "66" }}
              />
            </View>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.white,
    borderRadius: 12,
    padding: 12,
    marginVertical: 8,
    // shadow
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.06,
    shadowRadius: 10,
    elevation: 3,
  },
  row: {
    flexDirection: "row",
    alignItems: "flex-start",
  },
  imageWrap: {
    width: Math.min(84, SCREEN_W * 0.18),
    height: Math.min(84, SCREEN_W * 0.18),
    borderRadius: 8,
    overflow: "hidden",
    backgroundColor: "#f2f4f7",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  image: {
    width: "100%",
    height: "100%",
  },
  placeholder: {
    width: "100%",
    height: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
  placeholderText: {
    fontFamily: "Medium",
    fontSize: 18,
    color: "#9aa0a6",
  },
  content: {
    flex: 1,
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  title: {
    fontFamily: "Medium",
    fontSize: 15,
    color: Colors.dark,
    flexShrink: 1,
  },
  actionRow: {
    flexDirection: "row",
    alignItems: "center",
    marginLeft: 8,
  },
  iconBtn: {
    marginLeft: 8,
    padding: 6,
    borderRadius: 6,
  },
  meta: {
    fontFamily: "regular",
    fontSize: 12,
    color: "#8b95a1",
    marginTop: 4,
  },
  location: {
    fontFamily: "regular",
    fontSize: 12,
    color: "#8b95a1",
    marginTop: 2,
  },
  tagsRow: {
    flexDirection: "row",
    marginTop: 8,
    flexWrap: "wrap",
    gap: 8,
  },
  tag: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: "flex-start",
  },
  tagText: {
    fontFamily: "regular",
    fontSize: 11,
    color: "#fff",
  },
  tagPrimary: {
    backgroundColor: Colors.primary,
  },
  tagGreen: {
    backgroundColor: Colors.green,
  },
  tagLight: {
    backgroundColor: "#e6eef6",
  },
  footerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 10,
  },
  price: {
    fontFamily: "Medium",
    fontSize: 16,
    color: Colors.dark,
  },
  publishedRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  publishedText: {
    fontFamily: "regular",
    fontSize: 12,
    color: "#8b95a1",
    marginRight: 6,
  },
});
