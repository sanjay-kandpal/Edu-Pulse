import React from 'react';
import { SignedIn, SignedOut } from '@clerk/clerk-expo';
import { Link } from 'expo-router';
import { 
  StyleSheet, 
  Text, 
  View, 
  ScrollView, 
  TouchableOpacity,
  SafeAreaView,
  Image,
  Platform,
  ImageBackground
} from "react-native";
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import {Header} from './components/Headers';
import SearchBar from './components/SearchBar';
import VideoCourseList from './components/VideoCourseList';
import Slider from './components/Slider';
import CourseList from './components/CourseList';
import WaterTracker from './components/WaterTracker';

// Ghibli-inspired theme constants
const COLORS = {
  primary: '#4695CB',     // Ghibli Sky Blue
  secondary: '#6C9D70',   // Ghibli Forest Green
  accent: '#E8934A',      // Ghibli Warm Orange
  background: '#F7F2E8',  // Soft Cream Background
  text: '#43464B',        // Deep Charcoal
  textLight: '#ffffff',
};

export default function Index() {
  return (
    <GestureHandlerRootView style={styles.container}>
      <SignedIn>
        <ImageBackground 
          source={require('../assets/images/signin_ghibli.png')} 
          style={styles.backgroundImage}
          resizeMode="cover"
        >
          <SafeAreaView style={styles.safeArea}>
            <Header />
            <View style={styles.contentContainer}>
              <ScrollView style={styles.scrollView}>
                <SearchBar />
                
                {/* Hero Image Banner */}
                <View style={styles.heroBanner}>
                  <View style={styles.heroOverlay}>
                    <Text style={styles.heroTitle}>Begin Your Adventure</Text>
                    <Text style={styles.heroSubtitle}>Explore the world of knowledge</Text>
                  </View>
                </View>
                
                <View style={styles.section}>
                  <Slider />
                </View>
                
                <View style={styles.ghibliCard}>
                  <Text style={styles.sectionTitle}>Video Courses</Text>
                  <VideoCourseList />
                </View>
                
                <View style={styles.ghibliCard}>
                  <Text style={styles.sectionTitle}>Basic Courses</Text>
                  <CourseList type="basic" />
                </View>
                
                <View style={styles.ghibliCard}>
                  <Text style={styles.sectionTitle}>Advanced Courses</Text>
                  <CourseList type="advanced" />
                </View>
              </ScrollView>
              
              <View style={styles.floatingContainer}>
                <WaterTracker />
              </View>
            </View>
          </SafeAreaView>
        </ImageBackground>
      </SignedIn>
      
      <SignedOut>
        <ImageBackground 
          source={require('../assets/images/signin_ghibli.png')} 
          style={styles.backgroundImage}
          resizeMode="cover"
        >
          <SafeAreaView style={styles.safeArea}>
            <View style={styles.authContainer}>
              
              <View style={styles.authCard}>
                <Text style={styles.headerText}>Welcome to Edu-Pulse</Text>
                <Text style={styles.subHeaderText}>Your magical learning journey begins here</Text>
                
                <View style={styles.buttonContainer}>
                  <Link href="/(auth)/sign-in" asChild>
                    <TouchableOpacity 
                      style={styles.authButton}
                      activeOpacity={0.7}
                    >
                      <Text style={styles.authButtonText}>Sign in</Text>
                    </TouchableOpacity>
                  </Link>
                  <Link href="/(auth)/sign-up" asChild>
                    <TouchableOpacity 
                      style={styles.secondaryButton}
                      activeOpacity={0.7}
                    >
                      <Text style={styles.authButtonText}>Sign up</Text>
                    </TouchableOpacity>
                  </Link>
                </View>
              </View>
              
              {/* Ghibli-inspired decorative elements */}
              <View style={styles.decorContainer}>
                <View style={styles.decorCircle}></View>
                <View style={[styles.decorCircle, styles.decorCircle2]}></View>
                <View style={[styles.decorCircle, styles.decorCircle3]}></View>
              </View>
            </View>
          </SafeAreaView>
        </ImageBackground>
      </SignedOut>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backgroundImage: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  safeArea: {
    flex: 1,
    paddingTop: Platform.OS === 'android' ? 25 : 0,
  },
  contentContainer: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  section: {
    marginTop: 20,
    paddingHorizontal: 15,
  },
  ghibliCard: {
    marginTop: 20,
    marginHorizontal: 15,
    padding: 15,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.85)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.7)',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 12,
    color: COLORS.text,
    fontFamily: Platform.OS === 'ios' ? 'Avenir-Medium' : 'sans-serif-medium',
  },
  heroBanner: {
    height: 200,
    marginTop: 15,
    marginHorizontal: 15,
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.7)',
  },
  heroOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(70, 149, 203, 0.7)',
    padding: 15,
  },
  heroTitle: {
    color: COLORS.textLight,
    fontSize: 24,
    fontWeight: 'bold',
    fontFamily: Platform.OS === 'ios' ? 'Avenir-Heavy' : 'sans-serif-medium',
  },
  heroSubtitle: {
    color: COLORS.textLight,
    fontSize: 16,
    fontFamily: Platform.OS === 'ios' ? 'Avenir' : 'sans-serif',
  },
  authContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  authCard: {
    width: '100%',
    padding: 25,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.85)',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.7)',
  },
  logoContainer: {
    marginBottom: 20,
    alignItems: 'center',
  },
  logo: {
    width: 200,
    height: 100,
    borderRadius: 16,
  },
  headerText: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 10,
    color: COLORS.text,
    textAlign: 'center',
    fontFamily: Platform.OS === 'ios' ? 'Avenir-Heavy' : 'sans-serif-medium',
  },
  subHeaderText: {
    fontSize: 16,
    color: '#666',
    marginBottom: 30,
    textAlign: 'center',
    fontFamily: Platform.OS === 'ios' ? 'Avenir' : 'sans-serif',
    lineHeight: 22,
  },
  buttonContainer: {
    width: '100%',
    marginBottom: 10,
  },
  authButton: {
    backgroundColor: COLORS.primary,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 2,
  },
  secondaryButton: {
    backgroundColor: COLORS.secondary,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 2,
  },
  authButtonText: {
    color: COLORS.textLight,
    fontSize: 16,
    fontWeight: '600',
    fontFamily: Platform.OS === 'ios' ? 'Avenir-Medium' : 'sans-serif-medium',
  },
  floatingContainer: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    borderRadius: 30,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  decorContainer: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    zIndex: -1,
  },
  decorCircle: {
    position: 'absolute',
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: 'rgba(70, 149, 203, 0.2)',
    top: '10%',
    left: '10%',
  },
  decorCircle2: {
    width: 150,
    height: 150,
    backgroundColor: 'rgba(108, 157, 112, 0.2)',
    top: '50%',
    right: '5%',
    left: undefined,
  },
  decorCircle3: {
    width: 80,
    height: 80,
    backgroundColor: 'rgba(232, 147, 74, 0.2)',
    bottom: '15%',
    left: '20%',
    top: undefined,
  },
});