import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { formatPrice, ORDER_STATUS_LABEL, ORDER_STATUS_COLOR, cn } from '@/lib/utils'

export default async function PlatformOrdersPage() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  const { data: profile } = await supabase.from('profiles').select('role').eq('id', user!.id).single()
  if (profile?.role !== 'admin') redirect('/admin')

  const { data: orders } = await supabase
    .from('orders')
    .select('*, profiles(email, full_name), order_items(*, products(name, shops(name)))')
    .order('created_at', { ascending: false })
    .limit(100)

  return (
    <div className="p-8">
      <h1 className="font-display text-3xl mb-2">คำสั่งซื้อทั้งหมดในระบบ</h1>
      <p className="text-[#888] text-sm mb-8">แสดง {orders?.length || 0} รายการล่าสุด</p>

      <div className="space-y-4">
        {(!orders || orders.length === 0) && (
          <div className="card p-16 text-center text-[#888]">ยังไม่มีคำสั่งซื้อในระบบ</div>
        )}
        {orders?.map((order: any) => (
          <div key={order.id} className="card overflow-hidden">
            <div className="p-4 bg-[#F7F5F2] border-b border-[#E8E4DF] flex flex-wrap items-center justify-between gap-3">
              <div>
                <span className="text-xs font-mono text-[#888]">#{order.id.slice(0, 8).toUpperCase()}</span>
                <span className="mx-3 text-[#E8E4DF]">|</span>
                <span className="text-xs text-[#888]">{order.profiles?.full_name || order.profiles?.email}</span>
                <span className="mx-3 text-[#E8E4DF]">|</span>
                <span className="text-xs text-[#888]">{new Date(order.created_at).toLocaleDateString('th-TH', { dateStyle: 'long' })}</span>
              </div>
              <span className={cn('px-3 py-1 rounded text-xs font-medium', ORDER_STATUS_COLOR[order.status])}>
                {ORDER_STATUS_LABEL[order.status]}
              </span>
            </div>
            <div className="p-4">
              <div className="space-y-1 mb-3">
                {order.order_items?.map((oi: any) => (
                  <div key={oi.id} className="flex justify-between text-sm">
                    <span className="text-[#888]">{oi.products?.name} <span className="text-[#C8A882]">({oi.products?.shops?.name})</span> × {oi.quantity}</span>
                    <span>{formatPrice(oi.unit_price * oi.quantity)}</span>
                  </div>
                ))}
              </div>
              <div className="border-t border-[#E8E4DF] pt-3 flex justify-between font-medium">
                <span>รวมทั้งหมด</span>
                <span>{formatPrice(order.total_price)}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
