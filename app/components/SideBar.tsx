import React, { useMemo } from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  StyleSheet, 
  Dimensions, 
  Platform 
} from 'react-native';
import { useRouter } from 'expo-router';

const Sidebar = ({ isOpen, onClose }) => {
  const navigation = useRouter();

  // Memoize menu items and screen width
  const menuItems = useMemo(() => [
    { title: 'Home', route: '/' },
    { title: 'Courses', route: '/(app)/courses' },
    { title: 'Step Counter', route: '/(app)/step-counter' },
    { title: 'WaterChallenge Leaderboard', route: '/(app)/leaderboard' }
  ], []);

  // Memoize sidebar width
  const sidebarWidth = useMemo(() => {
    const screenWidth = Dimensions.get('window').width;
    return screenWidth * 0.7;
  }, []);

  return (
    <View 
      style={[
        styles.overlay,
        { 
          // Ensure overlay is visible when sidebar is open
          opacity: isOpen ? 1 : 0,
          // Disable touch when not open
          pointerEvents: isOpen ? 'auto' : 'none'
        }
      ]}
    >
      {/* Backdrop to dim background when sidebar is open */}
      <TouchableOpacity 
        style={styles.backdrop} 
        onPress={onClose} 
        activeOpacity={1}
      />

      <View 
        style={[
          styles.container, 
          { 
            width: isOpen ? sidebarWidth : 0,
            // Ensure sidebar slides in from the left
            transform: [{ translateX: isOpen ? 0 : -sidebarWidth }]
          }
        ]}
      >
        <TouchableOpacity 
          style={styles.closeButton} 
          onPress={onClose}
          accessibilityLabel="Close sidebar"
        >
          <Text style={styles.closeButtonText}>×</Text>
        </TouchableOpacity>

        {menuItems.map((item) => (
          <TouchableOpacity
            key={item.route}
            style={styles.menuItem}
            onPress={() => {
              navigation.navigate(item.route);
              onClose();
            }}
            accessibilityLabel={`Navigate to ${item.title}`}
          >
            <Text style={styles.menuItemText}>{item.title}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 1000, // Highest z-index to ensure it's on top
    backgroundColor: 'transparent',
  },
  backdrop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)', // Semi-transparent overlay
  },
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    backgroundColor: '#f0f0f0',
    zIndex: 1001, // Slightly higher than overlay to ensure content is on top
    paddingTop: Platform.OS === 'android' ? 50 : 70, // Adjust for different platforms
    shadowColor: '#000',
    shadowOffset: { width: 2, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 10, // Higher elevation for Android
  },
  closeButton: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 40 : 20,
    right: 20,
    zIndex: 1002, // Highest z-index for close button
    padding: 10, // Increased touch area
  },
  closeButtonText: {
    fontSize: 30,
    color: 'black',
    fontWeight: 'bold',
  },
  menuItem: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd'
  },
  menuItemText: {
    fontSize: 18,
    color: 'black'
  }
});

export default React.memo(Sidebar);