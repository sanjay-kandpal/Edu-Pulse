import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useUser, useAuth } from '@clerk/clerk-expo';

export const Header = () => {
  const { user } = useUser();
  const { signOut } = useAuth();

  const handleSignOut = () => {
    signOut();
  };

  return (
    <View style={styles.header}>
      <Text style={styles.welcomeText}>
        Welcome, {user?.emailAddresses[0].emailAddress}
      </Text>
      <TouchableOpacity style={styles.signOutButton} onPress={handleSignOut}>
        <Text style={styles.signOutText}>Sign Out</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
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