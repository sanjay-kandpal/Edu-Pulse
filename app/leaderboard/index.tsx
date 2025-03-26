import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import {Header} from '../components/Headers';
export default function index() {
  return (
    <View style={styles.container}>
      
      <Text style={styles.title}>Water Challenge Leaderboard</Text>
      {/* Add your leaderboard content here */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
});