'use client'
import Image from 'next/image'
import Link from 'next/link'
import { ShoppingCart, Heart } from 'lucide-react'
import { formatPrice } from '@/lib/utils'
import type { Product } from '@/types'
import { createClient } from '@/lib/supabase/client'
import { useState } from 'react'

export default function ProductCard({ product }: { product: Product }) {
  const [adding, setAdding] = useState(false)
  const [added, setAdded] = useState(false)

  const addToCart = async () => {
    setAdding(true)
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) { window.location.href = '/auth/login'; return }

    await supabase.from('cart_items').upsert({
      user_id: user.id,
      product_id: product.id,
      quantity: 1,
    }, { onConflict: 'user_id,product_id', ignoreDuplicates: false })

    setAdding(false)
    setAdded(true)
    setTimeout(() => setAdded(false), 2000)
  }

  return (
    <div className="group bg-white overflow-hidden transition-all hover:-translate-y-1 hover:shadow-lg">
      <div className="relative h-60 bg-[#EDE8E0] overflow-hidden">
        {product.image_url ? (
          <Image src={product.image_url} alt={product.name} fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-5xl">🛍️</div>
        )}
        {product.stock_qty === 0 && (
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
            <span className="text-white text-sm tracking-widest uppercase">หมด</span>
          </div>
        )}
        {/* Hover Actions */}
        <div className="absolute bottom-0 left-0 right-0 bg-[#1A1A1A]/90 p-3 flex gap-2 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
          <button
            onClick={addToCart}
            disabled={adding || product.stock_qty === 0}
            className="flex-1 text-white text-xs tracking-widest uppercase py-2 hover:bg-white/10 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
          >
            <ShoppingCart size={14} />
            {added ? 'เพิ่มแล้ว ✓' : adding ? '...' : 'เพิ่มลงตะกร้า'}
          </button>
        </div>
      </div>
      <div className="p-4">
        {product.shops && (
          <Link href={`/shops/${product.shop_id}`} className="text-[10px] uppercase tracking-widest text-[#C8A882] hover:underline">
            {product.shops.name}
          </Link>
        )}
        <Link href={`/shop/${product.id}`}>
          <h3 className="text-sm mt-1 mb-2 hover:text-[#C8A882] transition-colors line-clamp-2">{product.name}</h3>
        </Link>
        <div className="flex items-center justify-between">
          <span className="font-medium">{formatPrice(product.price)}</span>
          <span className="text-xs text-[#888]">เหลือ {product.stock_qty}</span>
        </div>
      </div>
    </div>
  )
}
