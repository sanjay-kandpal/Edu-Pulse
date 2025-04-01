import React from 'react';
import { View, StyleSheet,Text } from 'react-native';
import { Header } from '../../components/Headers';
import { StatusBar } from 'expo-status-bar';
import Value from '@/app/components/Value';


export default function VideoCoursesScreen() {
  return (
    <View style={styles.container}>
      <Header />
      <View style={styles.content}>
        
        <Value label="Steps" value="1219" />
        <Value label="Distance" value="0,75km" />
      
      </View>
      
      <Value label="Flights Climbed" value="12" />
      
      <StatusBar style='auto' />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
    justifyContent: 'center',
    padding: 12,
  },
  
  content: {
    flex: 1,
    flexDirection: 'row',
    gap: 25,
    paddingBottom: 80, // Add padding to avoid chatbot button overlap
  },
  values: {
    flexDirection: 'row',
    gap: 25,
    flexWrap: 'wrap'
  }
});