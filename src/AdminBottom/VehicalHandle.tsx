import Fontisto from '@expo/vector-icons/Fontisto';
import React, { useState } from 'react';
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Colors } from '../utils/Colors';
import VehicleCardSkeleton from './components/Loader/VehicleCardSkeleton';
import Search from './components/Search';
import VehicleCard from './components/VehicleCard';
export default function VehicalHandle() {
  const [SearchVehical, setSearchVehical] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [CurrentType, setCurrentType] = useState<string>("All");

  const onFilterHandle = async (filterType: string) => {
    setCurrentType(filterType);
  }
  return (
    <View style={styles.container}>
      <View style={styles.Flex}>
        <View style={{ flex: 1 / 1.2 }}>
          <Search
            value={SearchVehical}
            setValue={setSearchVehical}
            Placeholder='Search vehical...'
          />
        </View>
        <View style={{ flex: 0.12 }}>
          <TouchableOpacity style={styles.PlusIcon}>
            <Fontisto name="plus-a" size={18} color="black" />
          </TouchableOpacity>
        </View>
      </View>
      <View style={styles.Flex}>
        <View style={styles.SimpleFlex}>
          <TouchableOpacity style={[styles.FilterTab, CurrentType == "All" && styles.Active]} onPress={() => onFilterHandle("All")}>
            <Text style={[styles.Text, CurrentType === "All" && styles.TextWhite]}>All</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.FilterTab, CurrentType == "Rent" && styles.Active]} onPress={() => onFilterHandle("Rent")}>
            <Text style={[styles.Text, CurrentType === "Rent" && styles.TextWhite]}>Rent</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.FilterTab, CurrentType == "Sale" && styles.Active]} onPress={() => onFilterHandle("Sale")}>
            <Text style={[styles.Text, CurrentType === "Sale" && styles.TextWhite]}>Sale</Text>
          </TouchableOpacity>
        </View>
        <Text style={[styles.MiniText]}>5 vehicles found</Text>
      </View>

      {
        isLoading ?
          <FlatList
            contentContainerStyle={{ gap: 15 }}
            data={Array(1).fill("")}
            renderItem={() => (
              <VehicleCardSkeleton />
            )}
          />
          :
          <FlatList
            data={[""]}
            renderItem={({ item }) => (
              <VehicleCard
                title="Toyota Camry 2023"
                year="2023"
                km="15,000 km"
                location="Downtown"
                tags={["Rent", "With driver", "Available"]}
                price="$45/day"
                published={true}
                onEdit={() => console.log("edit")}
                onDelete={() => console.log("delete")}
                onTogglePublished={(v) => console.log("published:", v)}
              />
            )}
          />
      }

    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 15
  },
  PlusIcon: {
    width: 40,
    height: 40,
    backgroundColor: Colors.lightGray,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 7
  },
  Flex: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  FilterTab: {
    paddingVertical: 10,
    paddingHorizontal: 15,
    backgroundColor: Colors.lightGray,
    borderRadius: 7
  },
  SimpleFlex: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginVertical: 10
  },
  Active: {
    color: Colors.white,
    backgroundColor: Colors.primary
  },
  Text: {
    fontFamily: "Medium",
    color: Colors.black,
    fontSize: 14,
  },
  TextWhite: {
    fontFamily: "Medium",
    color: Colors.white,
    fontSize: 14,
  },
  MiniText: {
    color: Colors.mediumDark,
    fontSize: 12,
    fontFamily: "regular"
  }

});