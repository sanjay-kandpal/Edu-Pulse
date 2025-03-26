import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Header } from '../../components/Headers';
import VideoCourseList from '../../components/VideoCourseList';

export default function VideoCoursesScreen() {
  return (
    <View style={styles.container}>
      <Header />
      <VideoCourseList />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});