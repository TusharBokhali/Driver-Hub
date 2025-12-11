import { Images } from '@/assets/Images';
import axios from 'axios';
import React, { useContext, useEffect, useState } from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';
import { Api } from '../Api/Api';
import { handleApiResponse } from '../components/ErrorHandle';
import { AdminContextData } from '../context/AdminContext';
import { ToastShow } from '../context/ToastContext';
import { Colors } from '../utils/Colors';
import BookingCard from './components/BookingCard';
import ServiceSkeleton from './components/Loader/ServiceSkeleton';
import ServiceBox from './components/ServiceBox';
export default function AdminHome() {
  const [ServiceData, setServiceData] = useState<any>(null);
  const { Toast, setToast } = useContext(ToastShow);

  const [IsLoading, setIsLoading] = useState(false);
  const { AdminUser, setAdminUser } = useContext(AdminContextData);
  const [Cards, setCards] = useState<any[]>([]);
  const [MonthData, setMonthData] = useState<any>(null);
  const [BookingList, setBookungList] = useState<any[]>([]);

  const GetData = async () => {
    setIsLoading(true)
    try {
      let res = await axios.get(Api.dashboard, {
        headers: {
          "Authorization": `Bearer ${AdminUser?.token}`
        }
      });

      let data = res?.data?.data || [];
      const cards: any = [
        {
          Count: data?.kpiCards?.totalVehicles?.value,
          Title: data?.kpiCards?.totalVehicles?.label,
          SubTitle: data?.kpiCards?.totalVehicles?.trend,
          Icon: Images.car,
          color: Colors.All_Vehical
        },
        {
          Count: data?.kpiCards?.activeRentals?.value,
          Title: data?.kpiCards?.activeRentals?.label,
          SubTitle: data?.kpiCards?.activeRentals?.trend,
          Icon: Images.Active,
          color: Colors.Active
        },
        {
          Count: data?.kpiCards?.totalSales?.value,
          Title: data?.kpiCards?.totalSales?.label,
          SubTitle: data?.kpiCards?.totalSales?.trend,
          Icon: Images.Sale,
          color: Colors.Sale
        },
        {
          Count: data?.kpiCards?.pendingBookings?.value,
          Title: data?.kpiCards?.pendingBookings?.label,
          SubTitle: data?.kpiCards?.pendingBookings?.trend,
          Icon: Images.Pending,
          color: Colors.Pending
        }
      ];
      setServiceData(data || [])
      setCards([...cards])
      setMonthData(data?.kpiCards?.monthlyRevenue)
      setBookungList(data?.latestBookings || [])
    } catch (error: any) {
      setToast({
        visible: true,
        type: "error",
        message: error?.response?.message ?? handleApiResponse(error)?.message ?? "Something Wrong!",
      })
      console.log("get Dashboard data error:-", error);
    }
    finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    if (ServiceData == null) {
      GetData()
    }
    // console.log("CADFA",Cards);

  }, [])



  return (
    <View style={styles.container}>
      {
        IsLoading ?
          <>
            <View style={styles.LoaderWrapper}>
              <ServiceSkeleton />
              <ServiceSkeleton />
              <ServiceSkeleton />
              <ServiceSkeleton />
            </View>
            <View style={{marginTop:15}}>
              <ServiceSkeleton width={"100%"}/>
            </View>

          </>
          :
          <>
            <FlatList
              data={Cards}
              numColumns={2}
              columnWrapperStyle={{ justifyContent: "space-between", marginBottom: 10 }}
              keyExtractor={(item, index) => item?.id ?? index.toString()}
              renderItem={({ item }) => (
                <ServiceBox
                  Count={item.Count}
                  Title={item.Title}
                  SubTitle={item.SubTitle}
                  Icon={item.Icon}
                  Arrow={true}
                  color={item.color}
                />
              )}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{}}
            />
            <ServiceBox
              ContainerWidth={"100%"}
              CountColor={Colors.green}
              Count={MonthData?.value}
              Title={MonthData?.label}
              SubTitle={MonthData?.trend}
              Icon={Images.Increase}
              Arrow={true}
              color={Colors.Active}
            />
            {
              BookingList?.length > 0 && !IsLoading &&
              <View style={styles.BookingList}>
                <Text style={styles.Text}>Latest Bookings</Text>

                <FlatList
                  data={BookingList}
                  renderItem={({ item }) => (
                    <BookingCard
                      name="John Smith"
                      vehicle="Toyota Camry 2023"
                      datetime="Dec 15, 2024 • 2:30 PM"
                      price={135}
                      status="pending"
                    />
                  )}
                />
              </View>
            }
          </>
      }
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    // flex: 1,
    padding: 15
  },
  Text: {
    fontSize: 15,
    fontFamily: "regular",
    color: Colors.black,

  },
  BookingList: {
    marginTop: 15,
    gap: 10
  },
  LoaderWrapper: {
    flexDirection: 'row',
    alignItems: 'center', justifyContent: "space-between",
    flexWrap: 'wrap',
    gap: 10
  }


});