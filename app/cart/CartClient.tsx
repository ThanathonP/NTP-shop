'use client'
import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Trash2, Plus, Minus } from 'lucide-react'
import { formatPrice } from '@/lib/utils'
import { createClient } from '@/lib/supabase/client'
import type { CartItem } from '@/types'

export default function CartClient({ initialItems }: { initialItems: any[] }) {
  const [items, setItems] = useState(initialItems)
  const supabase = createClient()

  const updateQty = async (id: string, qty: number) => {
    if (qty < 1) return removeItem(id)
    await supabase.from('cart_items').update({ quantity: qty }).eq('id', id)
    setItems(prev => prev.map(i => i.id === id ? { ...i, quantity: qty } : i))
  }

  const removeItem = async (id: string) => {
    await supabase.from('cart_items').delete().eq('id', id)
    setItems(prev => prev.filter(i => i.id !== id))
  }

  const total = items.reduce((s, i) => s + (i.products?.price || 0) * i.quantity, 0)

  if (items.length === 0) return (
    <div className="text-center py-32">
      <p className="text-5xl mb-4">🛒</p>
      <p className="text-xl font-display mb-2">ตะกร้าว่างเปล่า</p>
      <p className="text-[#888] mb-6">เริ่มเลือกสินค้าที่ชอบกันเลย!</p>
      <Link href="/shop" className="btn-primary">เลือกซื้อสินค้า</Link>
    </div>
  )

  return (
    <div className="grid md:grid-cols-3 gap-8">
      <div className="md:col-span-2 space-y-4">
        {items.map(item => (
          <div key={item.id} className="card p-4 flex gap-4 items-center">
            <div className="w-20 h-20 bg-[#EDE8E0] flex-shrink-0 relative overflow-hidden">
              {item.products?.image_url
                ? <Image src={item.products.image_url} alt={item.products.name} fill className="object-cover" />
                : <div className="w-full h-full flex items-center justify-center text-2xl">🛍️</div>
              }
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs text-[#C8A882] mb-1">{item.products?.shops?.name}</p>
              <p className="font-medium text-sm line-clamp-1">{item.products?.name}</p>
              <p className="text-[#888] text-sm">{formatPrice(item.products?.price || 0)}</p>
            </div>
            <div className="flex items-center gap-2">
              <button onClick={() => updateQty(item.id, item.quantity - 1)} className="w-8 h-8 border border-[#E8E4DF] flex items-center justify-center hover:bg-[#F7F5F2]">
                <Minus size={12} />
              </button>
              <span className="w-8 text-center text-sm">{item.quantity}</span>
              <button onClick={() => updateQty(item.id, item.quantity + 1)} className="w-8 h-8 border border-[#E8E4DF] flex items-center justify-center hover:bg-[#F7F5F2]">
                <Plus size={12} />
              </button>
            </div>
            <p className="font-medium w-20 text-right text-sm">{formatPrice((item.products?.price || 0) * item.quantity)}</p>
            <button onClick={() => removeItem(item.id)} className="text-red-400 hover:text-red-600 p-1">
              <Trash2 size={16} />
            </button>
          </div>
        ))}
      </div>

      {/* Summary */}
      <div>
        <div className="card p-6 sticky top-20">
          <h2 className="font-display text-xl mb-4">สรุปคำสั่งซื้อ</h2>
          <div className="space-y-2 text-sm mb-4">
            <div className="flex justify-between"><span className="text-[#888]">ยอดรวม</span><span>{formatPrice(total)}</span></div>
            <div className="flex justify-between"><span className="text-[#888]">ค่าจัดส่ง</span><span className="text-green-600">ฟรี</span></div>
          </div>
          <div className="border-t border-[#E8E4DF] pt-4 mb-6">
            <div className="flex justify-between font-medium"><span>ยอดชำระ</span><span className="text-lg">{formatPrice(total)}</span></div>
          </div>
          <Link href="/checkout" className="btn-primary w-full justify-center py-3">
            ดำเนินการชำระเงิน →
          </Link>
        </div>
      </div>
    </div>
  )
}
