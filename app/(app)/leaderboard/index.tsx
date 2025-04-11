import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image } from 'react-native';
import { Header } from '../../components/Headers';
import WaterTracker from '../../components/WaterTracker';
import { Ionicons, FontAwesome5, MaterialCommunityIcons } from '@expo/vector-icons';

// Dummy user data with step counts and other health metrics
const dummyData = [
  
  {
    id: '1',
    name: 'sanjaykandpal4@gmail.com',
    avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
    stepCount: 8762,
    waterIntake: 6,
    sleepHours: 6.5,
    mood: 'neutral',
    screenTime: 3.1,
    streak: 3,
  },
  {
    id: '2',
    name: 'importantkandpal@gmail.com',
    avatar: 'https://randomuser.me/api/portraits/men/3.jpg',
    stepCount: 15241,
    waterIntake: 10,
    sleepHours: 8.2,
    mood: 'happy',
    screenTime: 1.8,
    streak: 7,
  },
];

export default function LeaderboardScreen() {
  const [selectedMetric, setSelectedMetric] = useState('stepCount');
  
  // Sort data based on selected metric
  const sortedData = [...dummyData].sort((a, b) => {
    // For screen time, lower is better
    if (selectedMetric === 'screenTime') {
      return a[selectedMetric] - b[selectedMetric];
    }
    // For all other metrics, higher is better
    return b[selectedMetric] - a[selectedMetric];
  });

  // Get appropriate icon for the metric
  const getMetricIcon = (metric, size = 22, color = '#3498db') => {
    switch(metric) {
      case 'stepCount':
        return <FontAwesome5 name="walking" size={size} color={color} />;
      case 'waterIntake':
        return <MaterialCommunityIcons name="cup-water" size={size} color={color} />;
      case 'sleepHours':
        return <Ionicons name="bed-outline" size={size} color={color} />;
      case 'screenTime':
        return <MaterialCommunityIcons name="cellphone" size={size} color={color} />;
      case 'streak':
        return <MaterialCommunityIcons name="fire" size={size} color={color} />;
      default:
        return null;
    }
  };

  // Get mood emoji
  const getMoodEmoji = (mood) => {
    switch(mood) {
      case 'happy':
        return '😊';
      case 'neutral':
        return '😐';
      case 'sad':
        return '😔';
      default:
        return '😐';
    }
  };

  // Format metric value for display
  const formatMetricValue = (metric, value) => {
    switch(metric) {
      case 'stepCount':
        return value.toLocaleString();
      case 'waterIntake':
        return `${value} glasses`;
      case 'sleepHours':
        return `${value} hrs`;
      case 'screenTime':
        return `${value} hrs`;
      case 'streak':
        return `${value} days`;
      default:
        return value;
    }
  };

  // Render each leaderboard item
  const renderItem = ({ item, index }) => {
    // Get medal color for top 3
    const getMedalColor = () => {
      if (index === 0) return '#FFD700'; // Gold
      if (index === 1) return '#C0C0C0'; // Silver
      if (index === 2) return '#CD7F32'; // Bronze
      return 'transparent';
    };

    return (
      <View style={styles.leaderboardItem}>
        <View style={[styles.rankContainer, { backgroundColor: getMedalColor() }]}>
          <Text style={styles.rankText}>{index + 1}</Text>
        </View>
        
        <Image 
          source={{ uri: item.avatar }} 
          style={styles.avatar}
        />
        
        <View style={styles.userInfo}>
          <Text style={styles.userName}>{item.name}</Text>
          <View style={styles.metricRow}>
            {getMetricIcon(selectedMetric, 16, '#555')}
            <Text style={styles.metricValue}>
              {formatMetricValue(selectedMetric, item[selectedMetric])}
            </Text>
            <Text style={styles.moodEmoji}>{getMoodEmoji(item.mood)}</Text>
          </View>
        </View>
        
        <View style={styles.valueContainer}>
          <Text style={styles.value}>
            {getMetricIcon(selectedMetric, 16, '#3498db')}
            <Text style={[styles.valueText, index === 0 && styles.topValue]}>
              {' '}{formatMetricValue(selectedMetric, item[selectedMetric])}
            </Text>
          </Text>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Header />
      
      <View style={styles.content}>
        
        
        <View style={styles.metricSelector}>
          <TouchableOpacity 
            style={[styles.metricButton, selectedMetric === 'stepCount' && styles.selectedMetric]} 
            onPress={() => setSelectedMetric('stepCount')}
          >
            {getMetricIcon('stepCount', 20, selectedMetric === 'stepCount' ? '#fff' : '#3498db')}
            <Text style={[styles.metricButtonText, selectedMetric === 'stepCount' && styles.selectedMetricText]}>Steps</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.metricButton, selectedMetric === 'waterIntake' && styles.selectedMetric]}
            onPress={() => setSelectedMetric('waterIntake')}
          >
            {getMetricIcon('waterIntake', 20, selectedMetric === 'waterIntake' ? '#fff' : '#3498db')}
            <Text style={[styles.metricButtonText, selectedMetric === 'waterIntake' && styles.selectedMetricText]}>Water</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.metricButton, selectedMetric === 'sleepHours' && styles.selectedMetric]}
            onPress={() => setSelectedMetric('sleepHours')}
          >
            {getMetricIcon('sleepHours', 20, selectedMetric === 'sleepHours' ? '#fff' : '#3498db')}
            <Text style={[styles.metricButtonText, selectedMetric === 'sleepHours' && styles.selectedMetricText]}>Sleep</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.metricButton, selectedMetric === 'screenTime' && styles.selectedMetric]}
            onPress={() => setSelectedMetric('screenTime')}
          >
            {getMetricIcon('screenTime', 20, selectedMetric === 'screenTime' ? '#fff' : '#3498db')}
            <Text style={[styles.metricButtonText, selectedMetric === 'screenTime' && styles.selectedMetricText]}>Screen</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.metricButton, selectedMetric === 'streak' && styles.selectedMetric]}
            onPress={() => setSelectedMetric('streak')}
          >
            {getMetricIcon('streak', 20, selectedMetric === 'streak' ? '#fff' : '#3498db')}
            <Text style={[styles.metricButtonText, selectedMetric === 'streak' && styles.selectedMetricText]}>Streak</Text>
          </TouchableOpacity>
        </View>
        
        <FlatList
          data={sortedData}
          renderItem={renderItem}
          keyExtractor={item => item.id}
          style={styles.list}
        />
      </View>
      
      <WaterTracker />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
    textAlign: 'center',
  },
  metricSelector: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  metricButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 8,
    paddingVertical: 6,
    borderRadius: 8,
  },
  selectedMetric: {
    backgroundColor: '#3498db',
  },
  metricButtonText: {
    fontSize: 12,
    marginLeft: 4,
    color: '#3498db',
    fontWeight: '500',
  },
  selectedMetricText: {
    color: '#fff',
  },
  list: {
    flex: 1,
  },
  leaderboardItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 12,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  rankContainer: {
    width: 30,
    height: 30,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  rankText: {
    fontWeight: 'bold',
    color: '#333',
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 12,
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  metricRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  metricValue: {
    fontSize: 14,
    color: '#666',
    marginLeft: 4,
  },
  moodEmoji: {
    fontSize: 14,
    marginLeft: 8,
  },
  valueContainer: {
    alignItems: 'flex-end',
    minWidth: 70,
  },
  value: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  valueText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#3498db',
  },
  topValue: {
    color: '#2ecc71',
    fontWeight: 'bold',
  },
});