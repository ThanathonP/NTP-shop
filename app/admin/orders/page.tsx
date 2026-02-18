import { createClient } from '@/lib/supabase/server'
import { formatPrice, ORDER_STATUS_LABEL, ORDER_STATUS_COLOR } from '@/lib/utils'
import { cn } from '@/lib/utils'
import OrderStatusUpdater from './OrderStatusUpdater'

export default async function AdminOrdersPage() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  const { data: shop } = await supabase.from('shops').select('id').eq('owner_id', user!.id).single()

  if (!shop) return <div className="p-8 text-center text-[#888]">กรุณาสร้างร้านค้าก่อน</div>

  // Get orders that contain products from this shop
  const { data: orderItems } = await supabase
    .from('order_items')
    .select('order_id, products!inner(shop_id)')
    .eq('products.shop_id', shop.id)

  const orderIds = [...new Set((orderItems || []).map(oi => oi.order_id))]

  const { data: orders } = await supabase
    .from('orders')
    .select('*, order_items(*, products(name, price, shop_id))')
    .in('id', orderIds)
    .order('created_at', { ascending: false })

  return (
    <div className="p-8">
      <h1 className="font-display text-3xl mb-8">จัดการคำสั่งซื้อ</h1>

      <div className="space-y-4">
        {(!orders || orders.length === 0) && (
          <div className="card p-16 text-center text-[#888]">ยังไม่มีคำสั่งซื้อ</div>
        )}
        {orders?.map(order => (
          <div key={order.id} className="card overflow-hidden">
            <div className="p-4 bg-[#F7F5F2] border-b border-[#E8E4DF] flex flex-wrap items-center justify-between gap-3">
              <div>
                <span className="text-xs font-mono text-[#888]">#{order.id.slice(0, 8).toUpperCase()}</span>
                <span className="mx-3 text-[#E8E4DF]">|</span>
                <span className="text-xs text-[#888]">{new Date(order.created_at).toLocaleDateString('th-TH', { dateStyle: 'long' })}</span>
              </div>
              <div className="flex items-center gap-3">
                <span className={cn('px-3 py-1 rounded text-xs font-medium', ORDER_STATUS_COLOR[order.status])}>
                  {ORDER_STATUS_LABEL[order.status]}
                </span>
                <OrderStatusUpdater orderId={order.id} currentStatus={order.status} />
              </div>
            </div>
            <div className="p-4 grid md:grid-cols-3 gap-4">
              <div className="md:col-span-2">
                <p className="text-xs uppercase tracking-widest text-[#888] mb-2">รายการสินค้า</p>
                <div className="space-y-1">
                  {order.order_items?.filter((oi: any) => oi.products?.shop_id === shop.id).map((oi: any) => (
                    <div key={oi.id} className="flex justify-between text-sm">
                      <span>{oi.products?.name} × {oi.quantity}</span>
                      <span className="text-[#888]">{formatPrice(oi.unit_price * oi.quantity)}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <p className="text-xs uppercase tracking-widest text-[#888] mb-2">ที่อยู่จัดส่ง</p>
                {order.shipping_address && (
                  <div className="text-sm text-[#888] space-y-0.5">
                    <p className="text-[#1A1A1A] font-medium">{order.shipping_address.name}</p>
                    <p>{order.shipping_address.phone}</p>
                    <p>{order.shipping_address.address}</p>
                    <p>{order.shipping_address.province} {order.shipping_address.postal_code}</p>
                  </div>
                )}
                <p className="mt-3 font-medium">{formatPrice(order.total_price)}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
