'use client'
import { useState } from 'react'
import Navbar from '@/components/shop/Navbar'
import { createClient } from '@/lib/supabase/client'
import { useAppState } from '@/components/shop/AppStateContext'
import { formatPrice } from '@/lib/utils'

export default function CheckoutClient({ initialItems }: { initialItems: any[] }) {
  const [items] = useState(initialItems)
  const [form, setForm] = useState({ name: '', phone: '', address: '', province: '', postal_code: '' })
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const { setCartCount } = useAppState()

  const total = items.reduce((s, i) => s + (i.products?.price || 0) * i.quantity, 0)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    const { data: order } = await supabase.from('orders').insert({
      user_id: user.id,
      total_price: total,
      shipping_address: form,
      status: 'pending'
    }).select().single()

    if (order) {
      await supabase.from('order_items').insert(
        items.map(i => ({
          order_id: order.id,
          product_id: i.product_id,
          quantity: i.quantity,
          unit_price: i.products?.price || 0,
        }))
      )
      await supabase.from('cart_items').delete().eq('user_id', user.id)
      setCartCount(0)
      setSuccess(true)
    }
    setLoading(false)
  }

  if (success) return (
    <>
      <Navbar />
      <div className="pt-16 min-h-screen flex items-center justify-center">
        <div className="text-center card p-16 max-w-md mx-4">
          <div className="text-6xl mb-4">✅</div>
          <h2 className="font-display text-3xl mb-2">สั่งซื้อสำเร็จ!</h2>
          <p className="text-[#888] mb-6">คำสั่งซื้อของคุณถูกบันทึกแล้ว เราจะดำเนินการจัดส่งโดยเร็ว</p>
          <a href="/orders" className="btn-primary justify-center">ดูคำสั่งซื้อของฉัน</a>
        </div>
      </div>
    </>
  )

  return (
    <>
      <Navbar />
      <main className="pt-16 max-w-5xl mx-auto px-6 py-12">
        <h1 className="font-display text-3xl mb-8">ชำระเงิน</h1>
        <div className="grid md:grid-cols-2 gap-8">
          <form onSubmit={handleSubmit} className="space-y-4">
            <h2 className="font-medium text-sm uppercase tracking-widest">ที่อยู่จัดส่ง</h2>
            {[
              ['name', 'ชื่อ-นามสกุล', 'text'],
              ['phone', 'เบอร์โทรศัพท์', 'tel'],
              ['address', 'ที่อยู่', 'text'],
              ['province', 'จังหวัด', 'text'],
              ['postal_code', 'รหัสไปรษณีย์', 'text'],
            ].map(([field, label, type]) => (
              <div key={field}>
                <label className="text-xs uppercase tracking-widest text-[#888] block mb-2">{label}</label>
                <input type={type} required className="input"
                  value={(form as any)[field]}
                  onChange={e => setForm(p => ({...p, [field]: e.target.value}))} />
              </div>
            ))}
            <button type="submit" disabled={loading || items.length === 0} className="btn-primary w-full justify-center py-3 mt-4">
              {loading ? 'กำลังบันทึก...' : `ยืนยันคำสั่งซื้อ ${formatPrice(total)}`}
            </button>
          </form>

          <div className="card p-6 h-fit">
            <h2 className="font-medium text-sm uppercase tracking-widest mb-4">สรุปสินค้า</h2>
            <div className="space-y-3">
              {items.map(i => (
                <div key={i.id} className="flex justify-between text-sm">
                  <span className="text-[#888]">{i.products?.name} × {i.quantity}</span>
                  <span>{formatPrice((i.products?.price || 0) * i.quantity)}</span>
                </div>
              ))}
            </div>
            <div className="border-t border-[#E8E4DF] mt-4 pt-4 flex justify-between font-medium">
              <span>รวมทั้งหมด</span><span>{formatPrice(total)}</span>
            </div>
          </div>
        </div>
      </main>
    </>
  )
}
