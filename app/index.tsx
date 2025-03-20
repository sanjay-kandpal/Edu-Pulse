import { SignedIn, SignedOut, useUser, useAuth } from '@clerk/clerk-expo';
import { Link } from 'expo-router';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity } from "react-native";
import { Header } from './components/Headers';
import  SearchBar  from './components/SearchBar';
import GlobalApi from './Shared/GlobalApi';
import { useEffect } from 'react';

export default function Index() {
  useEffect(() => {
    getSlider();
  }, [])
  const getSlider = async( ) =>{
    const result = (await GlobalApi.getSlider()).data ;
    console.log(result);
    
  } 
  return (
    <View style={styles.container}>
      <SignedIn>
        <ScrollView>
          <Header />
          <SearchBar />
          <View style={styles.menuContainer}>
            <TouchableOpacity style={styles.menuItem}>
              <Text style={styles.menuItemText}>Health Articles</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.menuItem}>
              <Text style={styles.menuItemText}>Daily Health Tips</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.menuItem}>
              <Text style={styles.menuItemText}>Exercise Guides</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.menuItem}>
              <Text style={styles.menuItemText}>Nutrition Information</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
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
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  menuContainer: {
    padding: 15,
  },
  menuItem: {
    backgroundColor: '#ffffff',
    padding: 20,
    borderRadius: 10,
    marginVertical: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  menuItemText: {
    fontSize: 18,
    fontWeight: '500',
    color: '#333333',
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
