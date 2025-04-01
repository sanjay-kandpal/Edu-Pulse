import React from 'react';
import { View, StyleSheet,Text } from 'react-native';
import { Header } from '../../components/Headers';
import { StatusBar } from 'expo-status-bar';

type ValueProps = {
  label: String;
  value: String;
}

const Value = ({label,value}: ValueProps) => (
  <View style={styles.valueContainer}>  
    <Text style={styles.label}>{label}</Text>
    <Text style={styles.value}>{value}</Text>
  </View>
)

export default function VideoCoursesScreen() {
  return (
    <View style={styles.container}>
      <Header />
      <View style={styles.content}>
        
        <Value label="Steps" value={1219} />
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
  valueContainer:{
    marginRight: 50,
    marginVertical: 10,
  },
  content: {
    flex: 1,
    paddingBottom: 80, // Add padding to avoid chatbot button overlap
  },
  label:{
    color: 'white',
    fontSize: 20,
  },
  value: {
    fontSize: 35,
    color: '#AFB3BE',
    fontWeight: '500',
  },
});