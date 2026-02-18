import { createClient } from '@/lib/supabase/server'
import Navbar from '@/components/shop/Navbar'
import { formatPrice, ORDER_STATUS_LABEL, ORDER_STATUS_COLOR } from '@/lib/utils'
import { cn } from '@/lib/utils'
import { redirect } from 'next/navigation'

export default async function OrdersPage() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth/login')

  const { data: orders } = await supabase
    .from('orders')
    .select('*, order_items(*, products(name, image_url))')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  return (
    <>
      <Navbar />
      <main className="pt-16 max-w-4xl mx-auto px-6 py-12">
        <h1 className="font-display text-3xl mb-8">คำสั่งซื้อของฉัน</h1>

        {(!orders || orders.length === 0) ? (
          <div className="text-center py-32">
            <p className="text-5xl mb-4">📦</p>
            <p className="text-xl font-display mb-2">ยังไม่มีคำสั่งซื้อ</p>
            <a href="/shop" className="btn-primary mt-4 inline-flex">เลือกซื้อสินค้า</a>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map(order => (
              <div key={order.id} className="card overflow-hidden">
                <div className="p-4 bg-[#F7F5F2] border-b border-[#E8E4DF] flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <span className="text-xs font-mono text-[#888]">#{order.id.slice(0, 8).toUpperCase()}</span>
                    <span className="mx-2 text-[#E8E4DF]">|</span>
                    <span className="text-xs text-[#888]">{new Date(order.created_at).toLocaleDateString('th-TH', { dateStyle: 'long' })}</span>
                  </div>
                  <span className={cn('px-3 py-1 text-xs rounded font-medium', ORDER_STATUS_COLOR[order.status])}>
                    {ORDER_STATUS_LABEL[order.status]}
                  </span>
                </div>
                <div className="p-4">
                  <div className="space-y-2 mb-4">
                    {order.order_items?.map((oi: any) => (
                      <div key={oi.id} className="flex justify-between text-sm">
                        <span className="text-[#888]">{oi.products?.name} × {oi.quantity}</span>
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
        )}
      </main>
    </>
  )
}
