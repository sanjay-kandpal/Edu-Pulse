import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Header } from '../../components/Headers';
import CourseList from '../../components/CourseList';

export default function CoursesScreen() {
  return (
    <View style={styles.container}>
      <Header />
      <View style={styles.content}>
        <CourseList />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingBottom: 80, // Add padding to avoid chatbot button overlap
  },
});