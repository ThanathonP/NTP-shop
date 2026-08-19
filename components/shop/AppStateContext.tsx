'use client'
import { createContext, useContext, useState, type ReactNode } from 'react'
import type { Profile } from '@/types'

type AppState = {
  user: Profile | null
  cartProductIds: Set<string>
  cartCount: number
  isInCart: (productId: string) => boolean
  addToCartState: (productId: string) => void
  removeFromCartState: (productId: string) => void
  setCartProductIds: (ids: string[]) => void
  clearCart: () => void
}

const AppStateContext = createContext<AppState | null>(null)

export function AppStateProvider({
  initialUser,
  initialCartProductIds,
  children,
}: {
  initialUser: Profile | null
  initialCartProductIds: string[]
  children: ReactNode
}) {
  const [cartProductIds, setCartProductIdsState] = useState<Set<string>>(() => new Set(initialCartProductIds))

  // เก็บ "สินค้าชิ้นไหนอยู่ในตะกร้าบ้าง" แทนตัวเลขนับเฉยๆ — จำนวนที่ badge ใช้ก็มาจาก set นี้ (.size)
  // เพราะการ add แบบ idempotent (Set.add ซ้ำได้ไม่มีผล) กันปัญหานับเพี้ยนจาก race condition ได้ตรงจุดกว่า
  // การบวก/ลบตัวเลขแบบ relative ที่เคยใช้ก่อนหน้านี้
  const addToCartState = (productId: string) => {
    setCartProductIdsState((prev) => (prev.has(productId) ? prev : new Set(prev).add(productId)))
  }
  const removeFromCartState = (productId: string) => {
    setCartProductIdsState((prev) => {
      if (!prev.has(productId)) return prev
      const next = new Set(prev)
      next.delete(productId)
      return next
    })
  }
  const setCartProductIds = (ids: string[]) => setCartProductIdsState(new Set(ids))
  const clearCart = () => setCartProductIdsState(new Set())
  const isInCart = (productId: string) => cartProductIds.has(productId)

  return (
    <AppStateContext.Provider
      value={{
        user: initialUser,
        cartProductIds,
        cartCount: cartProductIds.size,
        isInCart,
        addToCartState,
        removeFromCartState,
        setCartProductIds,
        clearCart,
      }}
    >
      {children}
    </AppStateContext.Provider>
  )
}

export function useAppState() {
  const ctx = useContext(AppStateContext)
  if (!ctx) throw new Error('useAppState must be used within AppStateProvider')
  return ctx
}
