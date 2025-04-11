import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Header } from '../../components/Headers';
import WaterTracker from '../../components/WaterTracker';

export default function LeaderboardScreen() {
  return (
    <View style={styles.container}>
      <Header />
      <WaterTracker />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});