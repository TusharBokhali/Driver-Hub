// VehicleCardSkeletonMoti.js
import { Skeleton } from 'moti/skeleton';
import React from 'react';
import { Dimensions, StyleSheet, View } from 'react-native';

const { width } = Dimensions.get('window');

const VehicleCardSkeleton = () => {
  const Spacer = ({ height = 16 }) => <View style={{ height }} />;
  
  return (
    <View style={styles.container}>
      <View style={styles.sortSection}>
        <Skeleton width={120} height={20} colorMode="light" />
        <View style={{ width: 10 }} />
        <Skeleton width={80} height={20} colorMode="light" />
      </View>
      
      <Spacer height={20} />
      
      {[1, 2, 3, 4, 5].map((item) => (
        <View key={item} style={styles.carCard}>
          <Skeleton width={width * 0.7} height={24} colorMode="light" />
          <Spacer height={8} />
          
          <View style={styles.row}>
            <Skeleton width={100} height={18} colorMode="light" />
            <View style={{ width: 10 }} />
            <Skeleton width={80} height={18} colorMode="light" />
          </View>
          <Spacer height={6} />
          
          <Skeleton width={100} height={18} colorMode="light" />
          <Spacer height={6} />
          
          <Skeleton width={150} height={20} colorMode="light" />
          <Spacer height={8} />
          
          <View style={styles.priceRow}>
            <Skeleton width={80} height={22} colorMode="light" />
            <Skeleton width={120} height={22} colorMode="light" />
          </View>
          
          {/* Divider */}
          {item < 5 && <View style={styles.divider} />}
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 16,
  },
  sortSection: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  carCard: {
    marginBottom: 24,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  divider: {
    height: 1,
    backgroundColor: '#f0f0f0',
    marginTop: 24,
  },
});

export default VehicleCardSkeleton;