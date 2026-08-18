'use client'
import { createContext, useContext, useState, type ReactNode } from 'react'
import type { Profile } from '@/types'

type AppState = {
  user: Profile | null
  cartCount: number
  setCartCount: (value: number | ((prev: number) => number)) => void
}

const AppStateContext = createContext<AppState | null>(null)

export function AppStateProvider({
  initialUser,
  initialCartCount,
  children,
}: {
  initialUser: Profile | null
  initialCartCount: number
  children: ReactNode
}) {
  const [cartCount, setCartCount] = useState(initialCartCount)
  return (
    <AppStateContext.Provider value={{ user: initialUser, cartCount, setCartCount }}>
      {children}
    </AppStateContext.Provider>
  )
}

export function useAppState() {
  const ctx = useContext(AppStateContext)
  if (!ctx) throw new Error('useAppState must be used within AppStateProvider')
  return ctx
}
