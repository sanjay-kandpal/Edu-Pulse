import { tokenCache } from '@/cache'
import { ClerkProvider, ClerkLoaded } from '@clerk/clerk-expo'
import { Slot } from 'expo-router'
import React, { useState, useCallback } from 'react'
import Sidebar from './components/SideBar'
import { View } from 'react-native'
import { SidebarContext } from './Context/SidebarContext'
export default function RootLayout() {
  const publishableKey = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY!
  // Add sidebar state
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  // Add sidebar controls
  const toggleSidebar = useCallback(() => {
    setIsSidebarOpen(prev => !prev)
  }, [])

  const closeSidebar = useCallback(() => {
    setIsSidebarOpen(false)
  }, [])

  if (!publishableKey) {
    throw new Error('Add EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY in your .env')
  }

  return (
    <ClerkProvider tokenCache={tokenCache} publishableKey={publishableKey}>
      <ClerkLoaded>
        <SidebarContext.Provider value={{ toggleSidebar }}>
        <View style={{ flex: 1 }}>
          <Sidebar isOpen={isSidebarOpen} onClose={closeSidebar} />
          <Slot />
        </View>
        </SidebarContext.Provider>
      </ClerkLoaded>
    </ClerkProvider>
  )
}