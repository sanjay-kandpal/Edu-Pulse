  import { StyleSheet, Text, TouchableOpacity, View, Modal, TextInput } from 'react-native';
  import { useUser, useAuth } from '@clerk/clerk-expo';
  import { useState } from 'react';
  import { Entypo } from '@expo/vector-icons';
  import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
  import { useSidebar } from '../Context/SidebarContext';

  export const Header = () => {
    const { toggleSidebar } = useSidebar();
    const { user } = useUser();
    const { signOut } = useAuth();
    const [modalVisible, setModalVisible] = useState(false);
    const [email, setEmail] = useState('');

    const handleSignOut = () => {
      signOut();
    };

    const toggleModal = () => {
      
      setModalVisible(!modalVisible);
      // Reset email field when closing modal
      if (modalVisible) {
        setEmail('');
      }
    };

    const handleSubscribe = () => {
      // Here you would handle the subscription logic
      console.log('Subscribing with email:', email);
      toggleModal();
    };
    // console.log(onSidebarToggle);
    
    return (
      <View style={styles.header}>
        <TouchableOpacity onPress={toggleSidebar} style={styles.menuButton}>
          <FontAwesome6 color="#333" size={24} name="bars" />
          
        </TouchableOpacity>

        <Text style={styles.welcomeText} numberOfLines={1}>
          Welcome, {user?.emailAddresses[0].emailAddress}
        </Text>
        
        <View style={styles.actionsContainer}>
          <TouchableOpacity style={styles.bellIconContainer} onPress={toggleModal}>
            <Entypo name="bell" size={24} color="#ffffff" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.signOutButton} onPress={handleSignOut}>
            <Text style={styles.signOutText}>Sign Out</Text>
          </TouchableOpacity>
        </View>

        {/* Newsletter Subscription Modal */}
        <Modal
          animationType="fade"
          transparent={true}
          visible={modalVisible}
          onRequestClose={toggleModal}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Subscribe to Edtech Newsletter</Text>
              <Text style={styles.modalDescription}>
                Stay updated with the latest educational technology news, tips, and resources.
              </Text>
              
              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Enter Email Address</Text>
                <TextInput
                  style={styles.emailInput}
                  value={email}
                  onChangeText={setEmail}
                  placeholder="your@email.com"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoCorrect={false}
                />
              </View>
              
              <View style={styles.modalActions}>
                <TouchableOpacity 
                  style={[styles.modalButton, styles.subscribeButton]} 
                  onPress={handleSubscribe}
                >
                  <Text style={styles.subscribeButtonText}>Subscribe</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  style={[styles.modalButton, styles.cancelButton]} 
                  onPress={toggleModal}
                >
                  <Text style={styles.cancelButtonText}>Maybe Later</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
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
    menuButton: {
      marginRight: 10,
    },
    welcomeText: {
      fontSize: 20,
      color: '#ffffff',
      fontWeight: 'bold',
      flexShrink: 1,
      marginLeft: 10,
    },
    actionsContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      flexWrap: 'wrap',
    },
    bellIconContainer: {
      marginRight: 10,
      padding: 5,
    },
    signOutButton: {
      backgroundColor: '#ffffff',
      paddingHorizontal: 10,
      paddingVertical: 6,
      borderRadius: 20,
    },
    signOutText: {
      color: '#4a90e2',
      fontWeight: '600',
      fontSize: 14,
    },
    modalOverlay: {
      flex: 1,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      justifyContent: 'center',
      alignItems: 'center',
    },
    modalContent: {
      backgroundColor: '#ffffff',
      borderRadius: 10,
      padding: 20,
      width: '80%',
      alignItems: 'center',
    },
    modalTitle: {
      fontSize: 20,
      fontWeight: 'bold',
      marginBottom: 10,
      color: '#4a90e2',
    },
    modalDescription: {
      textAlign: 'center',
      marginBottom: 20,
      color: '#333',
    },
    inputContainer: {
      width: '100%',
      marginBottom: 20,
    },
    inputLabel: {
      fontSize: 16,
      color: '#333',
      marginBottom: 5,
      fontWeight: '500',
    },
    emailInput: {
      width: '100%',
      height: 45,
      borderWidth: 1,
      borderColor: '#ddd',
      borderRadius: 5,
      paddingHorizontal: 10,
      fontSize: 16,
    },
    modalActions: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      width: '100%',
    },
    modalButton: {
      paddingVertical: 10,
      paddingHorizontal: 15,
      borderRadius: 20,
      flex: 1,
      marginHorizontal: 5,
      alignItems: 'center',
    },
    subscribeButton: {
      backgroundColor: '#4a90e2',
    },
    subscribeButtonText: {
      color: '#ffffff',
      fontWeight: '600',
    },
    cancelButton: {
      backgroundColor: '#f0f0f0',
    },
    cancelButtonText: {
      color: '#666',
    },
  });