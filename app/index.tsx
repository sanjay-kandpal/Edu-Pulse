import React from 'react';
import { SignedIn, SignedOut } from '@clerk/clerk-expo';
import { Link } from 'expo-router';
import { 
  StyleSheet, 
  Text, 
  View, 
  ScrollView, 
  TouchableOpacity
} from "react-native";
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Header } from './components/Headers';
import SearchBar from './components/SearchBar';
import VideoCourseList from './components/VideoCourseList';
import Slider from './components/Slider';
import CourseList from './components/CourseList';
import WaterTracker from './components/WaterTracker';

export default function Index() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SignedIn>
        <>
          {/* Header */}
          <Header />

          {/* Main Content */}
          <View style={styles.contentContainer}>
            <ScrollView>
              <SearchBar />
              <Slider />
              <VideoCourseList />
              <CourseList type="basic" />
              <CourseList type="advanced" />
            </ScrollView>
            <WaterTracker />
          </View>
        </>
      </SignedIn>
      
      <SignedOut>
        <View style={styles.authContainer}>
          <Text style={styles.headerText}>Welcome to EduHealth</Text>
          <View style={styles.buttonContainer}>
            <Link href="/(auth)/sign-in" asChild>
              <TouchableOpacity style={styles.authButton}>
                <Text style={styles.authButtonText}>Sign in</Text>
              </TouchableOpacity>
            </Link>
            <Link href="/(auth)/sign-up" asChild>
              <TouchableOpacity style={styles.authButton}>
                <Text style={styles.authButtonText}>Sign up</Text>
              </TouchableOpacity>
            </Link>
          </View>
        </View>
      </SignedOut>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  contentContainer: {
    flex: 1,
  },
  authContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  headerText: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 30,
    color: '#333333',
  },
  buttonContainer: {
    width: '100%',
    gap: 15,
  },
  authButton: {
    backgroundColor: '#4a90e2',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  authButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
});