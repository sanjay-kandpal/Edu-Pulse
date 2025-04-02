import React, { createContext, useContext, ReactNode, useState } from 'react'

type SidebarContextType = {
  toggleSidebar: () => void
  isOpen: boolean
}

export const SidebarContext = createContext<SidebarContextType | undefined>(undefined)

export const useSidebar = () => {
  const context = useContext(SidebarContext)
  if (!context) {
    throw new Error('useSidebar must be used within a SidebarProvider')
  }
  return context
}

type SidebarProviderProps = {
  children: ReactNode
}

// Create a provider component
export const SidebarProvider = ({ children }: SidebarProviderProps) => {
  const [isOpen, setIsOpen] = useState(false)

  const toggleSidebar = () => {
    setIsOpen(prev => !prev)
  }

  return (
    <SidebarContext.Provider value={{ toggleSidebar, isOpen }}>
      {children}
    </SidebarContext.Provider>
  )
}

// Add default export
export default SidebarProvider