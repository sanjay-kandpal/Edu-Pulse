import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Animated } from 'react-native';
import * as SecureStore from 'expo-secure-store';

const WaterTracker = () => {
  const [isVisible, setIsVisible] = useState(true); // Set to true for testing
  const [completedDays, setCompletedDays] = useState(0);
  const [lastPromptDate, setLastPromptDate] = useState(null);
  const slideAnim = new Animated.Value(0); // Start already visible for testing

  // Load saved data when component mounts
  useEffect(() => {
    loadSavedData();
    showSlider(); // Force visible for testing
  }, []);

  // Load data from secure storage
  const loadSavedData = async () => {
    try {
      const savedCompletedDays = await SecureStore.getItemAsync('waterTracker_completedDays');
      const savedLastPromptDate = await SecureStore.getItemAsync('waterTracker_lastPromptDate');
      
      if (savedCompletedDays) {
        setCompletedDays(parseInt(savedCompletedDays));
      }
      
      if (savedLastPromptDate) {
        setLastPromptDate(savedLastPromptDate);
        checkIfShouldPrompt(savedLastPromptDate);
      } else {
        // If no last prompt date, we should prompt
        showSlider();
      }
    } catch (error) {
      console.error('Error loading water tracker data:', error);
    }
  };

  // Check if we should show the prompt today
  const checkIfShouldPrompt = (savedDate) => {
    const today = new Date().toDateString();
    
    // If we haven't prompted today yet
    if (savedDate !== today) {
      showSlider();
      setLastPromptDate(today);
      saveLastPromptDate(today);
    }
  };

  // Save last prompt date to secure storage
  const saveLastPromptDate = async (date) => {
    try {
      await SecureStore.setItemAsync('waterTracker_lastPromptDate', date);
    } catch (error) {
      console.error('Error saving last prompt date:', error);
    }
  };

  // Save completed days to secure storage
  const saveCompletedDays = async (days) => {
    try {
      await SecureStore.setItemAsync('waterTracker_completedDays', days.toString());
    } catch (error) {
      console.error('Error saving completed days:', error);
    }
  };

  const showSlider = () => {
    setIsVisible(true);
    Animated.timing(slideAnim, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  const hideSlider = () => {
    Animated.timing(slideAnim, {
      toValue: -300,
      duration: 300,
      useNativeDriver: true,
    }).start(() => setIsVisible(false));
  };

  const handleYes = () => {
    const newCompletedDays = completedDays < 7 ? completedDays + 1 : completedDays;
    setCompletedDays(newCompletedDays);
    saveCompletedDays(newCompletedDays);
    
    // Save today's date as the last prompt date
    const today = new Date().toDateString();
    setLastPromptDate(today);
    saveLastPromptDate(today);
    
    hideSlider();
  };

  const handleNo = () => {
    hideSlider();
  };

  // For testing purposes, we're not returning null when invisible
  // In production, you might want to uncomment this line
  if (!isVisible) return null;

  return (
    <Animated.View 
      style={[
        styles.container, 
        { transform: [{ translateX: slideAnim }] }
      ]}
    >
      <View style={styles.content}>
        <Text style={styles.title}>Water Tracker</Text>
        <Text style={styles.question}>
          Have you drunk water today?
        </Text>
        <View style={styles.progressContainer}>
          {[...Array(7)].map((_, index) => (
            <View 
              key={index} 
              style={[
                styles.dayCircle, 
                index < completedDays ? styles.completed : {}
              ]}
            >
              <Text style={styles.dayText}>{index + 1}</Text>
            </View>
          ))}
        </View>
        <Text style={styles.progress}>
          {completedDays}/7 days completed
        </Text>
        <View style={styles.buttonContainer}>
          <TouchableOpacity 
            style={[styles.button, styles.yesButton]} 
            onPress={handleYes}
          >
            <Text style={styles.buttonText}>Yes</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.button, styles.noButton]} 
            onPress={handleNo}
          >
            <Text style={styles.buttonText}>Not yet</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 20,
    left: 0,
    backgroundColor: '#3498db',
    borderTopRightRadius: 15,
    borderBottomRightRadius: 15,
    padding: 15,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    zIndex: 1000,
  },
  content: {
    width: 250,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 10,
  },
  question: {
    fontSize: 16,
    color: 'white',
    marginBottom: 15,
  },
  progressContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  dayCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: 'rgba(255,255,255,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  completed: {
    backgroundColor: '#2ecc71',
  },
  dayText: {
    color: 'white',
    fontWeight: 'bold',
  },
  progress: {
    color: 'white',
    marginBottom: 15,
    textAlign: 'center',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  button: {
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 5,
    flex: 1,
    marginHorizontal: 5,
    alignItems: 'center',
  },
  yesButton: {
    backgroundColor: '#2ecc71',
  },
  noButton: {
    backgroundColor: '#e74c3c',
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});

export default WaterTracker;