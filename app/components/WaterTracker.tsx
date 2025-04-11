import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Animated, TextInput, ScrollView, Platform, AppState } from 'react-native';
import * as SecureStore from 'expo-secure-store';
import { useAuth } from '@clerk/clerk-expo'; // Import Clerk authentication

const WaterTracker = () => {
  const { isLoaded, isSignedIn, user } = useAuth();
  const [isVisible, setIsVisible] = useState(true);
  const [completedDays, setCompletedDays] = useState(0);
  const [lastPromptDate, setLastPromptDate] = useState(null);
  const slideAnim = new Animated.Value(0);
  
  // Screen time tracking
  const [screenTime, setScreenTime] = useState('');
  const appState = useRef(AppState.currentState);
  const activeTimeRef = useRef(0);
  const startTimeRef = useRef(null);
  const lastActiveTimeRef = useRef(0);
  const appStateChangeTime = useRef(Date.now());
  
  // Form state
  const [name, setName] = useState('');
  const [sleepHours, setSleepHours] = useState('');
  const [mood, setMood] = useState('');
  const [waterIntake, setWaterIntake] = useState('');
  const [showFullForm, setShowFullForm] = useState(false);

  // Load saved data and start tracking screen time
  useEffect(() => {
    loadSavedData();
    showSlider();
    
    // Extract name from Clerk email if available
    if (isLoaded && isSignedIn && user?.primaryEmailAddress) {
      const email = user.primaryEmailAddress.emailAddress;
      const extractedName = email.split('@')[0];
      console.log(extractedName);
      
      setName(extractedName);
    }
    
    // Start tracking screen time
    startScreenTimeTracking();
    
    // Cleanup function
    return () => {
      if (Platform.OS === 'web') {
        document.removeEventListener('visibilitychange', handleVisibilityChange);
      } else {
        AppState.removeEventListener('change', handleAppStateChange);
      }
    };
  }, [isLoaded, isSignedIn, user]);
  
  // Start tracking screen time based on platform
  const startScreenTimeTracking = async () => {
    // Reset tracking values
    activeTimeRef.current = 0;
    startTimeRef.current = Date.now();
    
    try {
      // Load previous screen time from storage
      const savedTime = await loadScreenTimeFromStorage();
      lastActiveTimeRef.current = typeof savedTime === 'number' ? savedTime : 0;
      
      if (Platform.OS === 'web') {
        // For web, track time spent in the app/tab
        document.addEventListener('visibilitychange', handleVisibilityChange);
        handleVisibilityChange(); // Initialize state
      } else {
        // For mobile (especially Android), track when app is active
        AppState.addEventListener('change', handleAppStateChange);
      }
    } catch (error) {
      console.error('Error starting screen time tracking:', error);
      lastActiveTimeRef.current = 0;
    }
  };
  
  // Handle app state changes for mobile
  const handleAppStateChange = (nextAppState) => {
    const now = Date.now();
    
    if (appState.current === 'active' && nextAppState !== 'active') {
      // App is going to background
      const timeSpent = (now - appStateChangeTime.current) / 1000 / 60 / 60; // Convert to hours
      activeTimeRef.current += timeSpent;
      saveScreenTimeToStorage(activeTimeRef.current + lastActiveTimeRef.current);
    } else if (appState.current !== 'active' && nextAppState === 'active') {
      // App is coming to foreground
      appStateChangeTime.current = now;
    }
    
    appState.current = nextAppState;
    updateScreenTimeState();
  };
  
  // Handle visibility changes for web
  const handleVisibilityChange = () => {
    const now = Date.now();
    
    if (document.visibilityState === 'hidden' && startTimeRef.current) {
      // Tab is hidden, calculate active time
      const timeSpent = (now - startTimeRef.current) / 1000 / 60 / 60; // Convert to hours
      activeTimeRef.current += timeSpent;
      saveScreenTimeToStorage(activeTimeRef.current + lastActiveTimeRef.current);
    } else if (document.visibilityState === 'visible') {
      // Tab is visible, reset start time
      startTimeRef.current = now;
    }
    
    updateScreenTimeState();
  };
  
  // Save screen time to storage
  const saveScreenTimeToStorage = async (time) => {
    try {
      const today = new Date().toDateString();
      await SecureStore.setItemAsync(`screenTime_${today}`, time.toString());
    } catch (error) {
      console.error('Error saving screen time:', error);
    }
  };
  
  // Update screen time state with current value
  const updateScreenTimeState = () => {
    const now = Date.now();
    let currentActiveTime = activeTimeRef.current;
    
    // If currently active, add current session time
    if ((Platform.OS === 'web' && document.visibilityState === 'visible') || 
        (Platform.OS !== 'web' && appState.current === 'active')) {
      currentActiveTime += (now - (startTimeRef.current || now)) / 1000 / 60 / 60;
    }
    
    const totalTime = currentActiveTime + lastActiveTimeRef.current;
    // Ensure we're dealing with a number before using toFixed
    const formattedTime = typeof totalTime === 'number' ? totalTime.toFixed(1) : '0.0';
    setScreenTime(formattedTime);
  };

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
      console.error('Error loading health tracker data:', error);
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
    
    // Update water intake
    setWaterIntake(prevWater => {
      const newWater = prevWater === '' ? '1' : (parseInt(prevWater) + 1).toString();
      return newWater;
    });
    
    // Don't show the form, just hide the slider after tracking water intake
    hideSlider();
  };

  const handleNo = () => {
    // Just hide the slider without showing the form
    hideSlider();
  };
  
  const handleShowForm = () => {
    // Add this function to explicitly show the form if needed
    setShowFullForm(true);
  };
  
  const handleSubmit = async () => {
    // Update screen time one final time before submission
    updateScreenTimeState();
    
    // Get the current date in ISO format
    const currentDate = new Date().toISOString();
    
    // Create the health data object
    const healthData = {
      name: name,
      date: currentDate,
      sleepHours: parseInt(sleepHours) || 0,
      mood: mood || "neutral",
      WaterIntake: parseInt(waterIntake) || 0,
      screenTime: parseFloat(screenTime) || 0
    };
    
    try {
      // Send the data to the API
      const response = await fetch('/api/health', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(healthData),
      });
      
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      
      // Save today's date as the last prompt date
      const today = new Date().toDateString();
      setLastPromptDate(today);
      saveLastPromptDate(today);
      
      // Reset form fields except name
      setSleepHours('');
      setMood('');
      setWaterIntake('');
      // Don't reset screenTime as it continues to accumulate
      setShowFullForm(false);
      
      // Hide the slider
      hideSlider();
      
    } catch (error) {
      console.error('Error submitting health data:', error);
      alert('Failed to submit health data. Please try again later.');
    }
  };

  // For testing purposes, we're not returning null when invisible
  if (!isVisible) return null;

  return (
    <Animated.View 
      style={[
        styles.container, 
        { transform: [{ translateX: slideAnim }] },
        showFullForm && styles.expandedContainer
      ]}
    >
      <ScrollView style={styles.content}>
        <Text style={styles.title}>Health Tracker</Text>
        
        {!showFullForm ? (
          <>
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
          </>
        ) : (
          <>
            <Text style={styles.formHeader}>Daily Health Form</Text>
            
            <Text style={styles.label}>Name (from your email)</Text>
            <View style={styles.nameDisplay}>
              <Text style={styles.nameText}>{name}</Text>
            </View>
            
            <Text style={styles.label}>Sleep Hours</Text>
            <TextInput
              style={styles.input}
              value={sleepHours}
              onChangeText={setSleepHours}
              placeholder="Hours of sleep"
              placeholderTextColor="#ccc"
              keyboardType="numeric"
            />
            
            <Text style={styles.label}>Mood</Text>
            <View style={styles.moodContainer}>
              {['sad', 'neutral', 'happy'].map((moodOption) => (
                <TouchableOpacity
                  key={moodOption}
                  style={[
                    styles.moodButton,
                    mood === moodOption && styles.selectedMood
                  ]}
                  onPress={() => setMood(moodOption)}
                >
                  <Text style={styles.moodText}>{moodOption}</Text>
                </TouchableOpacity>
              ))}
            </View>
            
            <Text style={styles.label}>Water Intake (glasses)</Text>
            <TextInput
              style={styles.input}
              value={waterIntake}
              onChangeText={setWaterIntake}
              placeholder="Glasses of water"
              placeholderTextColor="#ccc"
              keyboardType="numeric"
            />
            
            <Text style={styles.label}>Screen Time (hours)</Text>
            <View style={styles.screenTimeContainer}>
              <Text style={styles.screenTimeText}>{screenTime} hours today</Text>
              <Text style={styles.screenTimeSubtext}>
                {Platform.OS === 'web' 
                  ? 'Time spent in this website'
                  : 'Time your device has been active'}
              </Text>
            </View>
            
            <TouchableOpacity
              style={styles.submitButton}
              onPress={handleSubmit}
            >
              <Text style={styles.submitButtonText}>Submit</Text>
            </TouchableOpacity>
          </>
        )}
      </ScrollView>
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
    maxHeight: '80%',
  },
  expandedContainer: {
    width: 280,
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
  formHeader: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
    marginVertical: 10,
  },
  label: {
    color: 'white',
    fontSize: 14,
    marginTop: 10,
    marginBottom: 5,
  },
  input: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 5,
    padding: 10,
    color: 'white',
    marginBottom: 10,
  },
  moodContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  moodButton: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    padding: 8,
    borderRadius: 5,
    flex: 1,
    marginHorizontal: 3,
    alignItems: 'center',
  },
  selectedMood: {
    backgroundColor: '#2ecc71',
  },
  moodText: {
    color: 'white',
  },
  nameDisplay: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
  },
  nameText: {
    color: 'white',
  },
  screenTimeContainer: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
  },
  screenTimeText: {
    color: 'white',
    fontWeight: 'bold',
  },
  screenTimeSubtext: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 12,
    marginTop: 3,
  },
  submitButton: {
    backgroundColor: '#2ecc71',
    padding: 12,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 15,
    marginBottom: 20,
  },
  submitButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default WaterTracker;