import { SignedIn, SignedOut, useUser, useAuth } from '@clerk/clerk-expo';
import { Link } from 'expo-router';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity } from "react-native";

export default function Index() {
  const { user } = useUser();
  const { signOut } = useAuth();

  const handleSignOut = () => {
    signOut();
  };

  return (
    <View style={styles.container}>
      <SignedIn>
        <ScrollView>
          <View style={styles.header}>
            <Text style={styles.welcomeText}>Welcome, {user?.emailAddresses[0].emailAddress}</Text>
            <TouchableOpacity 
              style={styles.signOutButton} 
              onPress={handleSignOut}
            >
              <Text style={styles.signOutText}>Sign Out</Text>
            </TouchableOpacity>
          </View>

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
  header: {
    padding: 20,
    backgroundColor: '#4a90e2',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  welcomeText: {
    fontSize: 20,
    color: '#ffffff',
    fontWeight: 'bold',
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
  signOutButton: {
    backgroundColor: '#ffffff',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
  },
  signOutText: {
    color: '#4a90e2',
    fontWeight: '600',
  },
});
