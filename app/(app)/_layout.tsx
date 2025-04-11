import { Stack } from 'expo-router/stack';
import { useAuth } from '@clerk/clerk-expo';
import { Redirect } from 'expo-router';
import { View } from 'react-native';
import HealthCareChatBot from '../components/HealthCareChatBot';

export default function AppLayout() {
  const { isSignedIn } = useAuth();

  // Protect all app routes
  if (!isSignedIn) {
    return <Redirect href="/(auth)/sign-in" />;
  }

  return (
    <View style={{flex: 1}}>
      <Stack>
        <Stack.Screen 
          name="index" 
          options={{ headerShown: false }} 
        />
        <Stack.Screen 
          name="courses/index" 
          options={{ headerShown: false }} 
        />
        <Stack.Screen 
          name="video-courses/index" 
          options={{ headerShown: false }} 
        />
        <Stack.Screen 
          name="leaderboard/index" 
          options={{ headerShown: false }} 
        />
        <Stack.Screen 
          name="step-counter/index" 
          options={{ headerShown: false }} 
        />
      </Stack>
      <HealthCareChatBot />
    </View>
  );
}