'use client'
import { useState } from 'react'
import { ShoppingCart } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { useAppState } from '@/components/shop/AppStateContext'
import type { Product } from '@/types'

export default function AddToCartButton({ product }: { product: Product }) {
  const [adding, setAdding] = useState(false)
  const [added, setAdded] = useState(false)
  const { setCartCount } = useAppState()

  const addToCart = async () => {
    setAdding(true)
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) { window.location.href = '/auth/login'; return }

    const { data: existing } = await supabase
      .from('cart_items')
      .select('quantity')
      .eq('user_id', user.id)
      .eq('product_id', product.id)
      .maybeSingle()

    await supabase.from('cart_items').upsert({
      user_id: user.id,
      product_id: product.id,
      quantity: existing ? existing.quantity + 1 : 1,
    }, { onConflict: 'user_id,product_id' })

    if (!existing) setCartCount((prev) => prev + 1)

    setAdding(false)
    setAdded(true)
    setTimeout(() => setAdded(false), 2000)
  }

  return (
    <button
      onClick={addToCart}
      disabled={adding || product.stock_qty === 0}
      className="btn-primary w-full justify-center py-4 flex items-center gap-3 disabled:opacity-50"
    >
      <ShoppingCart size={18} />
      {product.stock_qty === 0 ? 'สินค้าหมด' : added ? 'เพิ่มลงตะกร้าแล้ว ✓' : adding ? '...' : 'เพิ่มลงตะกร้า'}
    </button>
  )
}
