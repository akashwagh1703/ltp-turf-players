import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Card from '../../components/common/Card';
import { turfService } from '../../services/turfService';
import { COLORS, SIZES, FONTS } from '../../constants/theme';

export default function TurfsScreen({ navigation, route }) {
  const [turfs, setTurfs] = useState([]);
  const [loading, setLoading] = useState(false);
  const sport = route.params?.sport;

  useEffect(() => {
    loadTurfs();
  }, [sport]);

  const loadTurfs = async () => {
    setLoading(true);
    try {
      const params = sport ? { sport_type: sport } : {};
      const response = await turfService.getTurfs(params);
      setTurfs(response.data);
    } catch (error) {
      console.error('Load turfs error:', error);
    } finally {
      setLoading(false);
    }
  };

  const renderTurf = ({ item }) => (
    <TouchableOpacity onPress={() => navigation.navigate('TurfDetail', { id: item.id })}>
      <Card style={styles.turfCard}>
        <Text style={styles.turfName}>{item.name}</Text>
        <Text style={styles.turfLocation}>{item.city}, {item.state}</Text>
        <Text style={styles.turfSport}>{item.sport_type}</Text>
        <View style={styles.turfFooter}>
          <Text style={styles.turfPrice}>₹{item.uniform_price || 'Dynamic'}/hr</Text>
          <Text style={styles.turfSize}>{item.size}</Text>
        </View>
      </Card>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>{sport || 'All'} Turfs</Text>
      </View>
      <FlatList
        data={turfs}
        renderItem={renderTurf}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.list}
        refreshControl={<RefreshControl refreshing={loading} onRefresh={loadTurfs} />}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    padding: SIZES.lg,
  },
  title: {
    ...FONTS.h1,
    color: COLORS.text,
  },
  list: {
    padding: SIZES.lg,
  },
  turfCard: {
    marginBottom: SIZES.md,
  },
  turfName: {
    ...FONTS.h3,
    color: COLORS.text,
    marginBottom: SIZES.xs,
  },
  turfLocation: {
    ...FONTS.caption,
    color: COLORS.textSecondary,
    marginBottom: SIZES.xs,
  },
  turfSport: {
    ...FONTS.caption,
    color: COLORS.text,
    marginBottom: SIZES.sm,
  },
  turfFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  turfPrice: {
    ...FONTS.body,
    fontWeight: '600',
    color: COLORS.primary,
  },
  turfSize: {
    ...FONTS.caption,
    color: COLORS.textSecondary,
  },
});
