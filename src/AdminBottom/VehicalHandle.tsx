import Fontisto from '@expo/vector-icons/Fontisto';
import { useIsFocused } from '@react-navigation/native';
import axios from 'axios';
import React, { useContext, useEffect, useState } from 'react';
import { FlatList, RefreshControl, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Api } from '../Api/Api';
import { handleApiResponse } from '../components/ErrorHandle';
import Loader from '../components/Loader';
import { AdminContextData } from '../context/AdminContext';
import { ToastShow } from '../context/ToastContext';
import { Colors } from '../utils/Colors';
import { height } from '../utils/Dimensions';
import VehicleCardSkeleton from './components/Loader/VehicleCardSkeleton';
import Search from './components/Search';
import VehicleCard from './components/VehicleCard';
export default function VehicalHandle({navigation}:any) {
  const [AllVehical, setAllVehical] = useState<any[]>([]);
  const { AdminUser, setAdminUser } = useContext(AdminContextData);
  const Focused = useIsFocused();
  const [SearchVehical, setSearchVehical] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [CurrentType, setCurrentType] = useState<string>("All");
  const { Toast, setToast } = useContext(ToastShow);
  const [Loading, setLoading] = useState<boolean>(false);
  const [VehicalRent, setVehicalRent] = useState([]);
  const [VehicalSell, setVehicalSell] = useState([]);
  const onFilterHandle = async (filterType: string) => {
    setCurrentType(filterType);
  }

  const GetAllVehical = async () => {
    setIsLoading(true)
    let type = CurrentType == "All" ? "" : CurrentType?.toLocaleLowerCase()?.trim();
    try {
      let res = await axios.get(Api.AllVehical, {
        params: {
          vehicleType: type,
        },
        headers: {
          "Authorization": `Bearer ${AdminUser?.token}`
        }
      });
      const data = res?.data?.data || [];
      switch (CurrentType) {
        case "Rent":
          setVehicalRent(data);
          break;

        case "Sale":
          setVehicalSell(data);
          break;

        default:
          setAllVehical(data);
      }
    } catch (error: any) {
      console.log("Get All Vehical Error:-", error);
      setToast({
        visible: true,
        type: "error",
        message: error?.response?.message ?? handleApiResponse(error)?.message ?? "Something Wrong!",
      })

    }
    finally {
      setIsLoading(false)
    }
  }

  const VehicalBublished = async (vehical: any) => {
    setLoading(true)

    try {
      let res = await axios.patch(`${Api.AllVehical}/${vehical?._id}/publish`, {
        "isPublished": !vehical?.isPublished,
      }, {
        headers: {
          "Authorization": `Bearer ${AdminUser?.token}`
        }
      });

      GetAllVehical()
      setToast({
        visible: true,
        type: "success",
        message: res?.data?.message || "Vehical Published Success!",
      })
    } catch (error: any) {
      console.log("Get All Vehical Error:-", error);
      setToast({
        visible: true,
        type: "error",
        message: error?.response?.message ?? handleApiResponse(error)?.message ?? "Something Wrong!",
      })

    }
    finally {
      setLoading(false)
    }
  }

  const GetFilterData = () => {
    if (CurrentType === "Rent") return VehicalRent || [];
    if (CurrentType === "Sale") return VehicalSell || [];
    return AllVehical || [];
  };
  const GetSearchData = () => {
    const listData = GetFilterData();

    if (!SearchVehical.trim()) {

      return listData;
    }

    return listData.filter((item: any) =>
      item?.title
        ?.toLowerCase()
        .includes(SearchVehical.toLowerCase())
    );
  };
  useEffect(() => {
    let shouldFetch = false;

    if (CurrentType === "Rent") {
      shouldFetch = VehicalRent?.length === 0;
    } else if (CurrentType === "Sale") {
      shouldFetch = VehicalSell?.length === 0;
    } else {
      shouldFetch = AllVehical?.length === 0;
    }

    if (shouldFetch) {
      GetAllVehical();
    }
  }, [CurrentType,Focused]);
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
          <TouchableOpacity style={styles.PlusIcon} onPress={()=>navigation.navigate("CreateVehical")}>
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
        <Text style={[styles.MiniText]}>{GetSearchData()?.length} vehicles found</Text>
      </View>

      {
        isLoading ?
          <FlatList
            contentContainerStyle={{}}
            data={Array(5).fill("")}
            renderItem={() => (
              <VehicleCardSkeleton />
            )}
          />
          :
          <FlatList
            data={GetSearchData()}
            refreshControl={
              <RefreshControl
                refreshing={isLoading}
                onRefresh={GetAllVehical}
                colors={[Colors.primary]}   
                tintColor={Colors.primary}    
              />
            }
            ListEmptyComponent={() => (
              <View style={styles.FullCenter}>
                <Text style={styles.EmptyText}>
                  {SearchVehical?.trim()
                    ? "No matching vehicles found"
                    : "No vehicles available"}
                </Text>
              </View>
            )}
            renderItem={({ item }) => (
              <VehicleCard
                data={item}
                title={item?.title || ""}
                year={item?.year}
                km={`${item?.mileage}km`} location={item?.location}
                tags={[item?.vehicleType, item?.driverAvailable, item?.isAvailable]}
                price={`${item?.currency}${Number(item?.price)?.toFixed(2)}`}
                published={item?.isPublished}
                onEdit={() => console.log("edit")}
                onDelete={() => console.log("delete")}
                onTogglePublished={(v) => VehicalBublished(item)}
              />
            )}
          />
      }
      <Loader visible={Loading} />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 15,
    paddingTop: 15
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
  },
  EmptyText: {
    color: "#999",
    fontSize: 14,
    fontFamily: "regular"
  },
  FullCenter: {
    height: height * 0.65,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center'
  }

});