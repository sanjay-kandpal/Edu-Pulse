import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Header } from '../../components/Headers';
import CourseList from '../../components/CourseList';

export default function CoursesScreen() {
  return (
    <View style={styles.container}>
      <Header />
      <CourseList />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});