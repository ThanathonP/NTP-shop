import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { formatPrice, ORDER_STATUS_LABEL, ORDER_STATUS_COLOR } from '@/lib/utils'
import { cn } from '@/lib/utils'

export default async function AdminDashboard() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const { data: shop } = await supabase.from('shops').select('*').eq('owner_id', user!.id).single()

  let stats = { products: 0, orders: 0, revenue: 0, pending: 0 }
  let recentOrders: any[] = []

  if (shop) {
    const { count: pCount } = await supabase.from('products').select('*', { count: 'exact', head: true }).eq('shop_id', shop.id)
    stats.products = pCount || 0

    const { data: orderItems } = await supabase
      .from('order_items')
      .select('*, orders(*), products!inner(shop_id)')
      .eq('products.shop_id', shop.id)

    const orderIds = [...new Set((orderItems || []).map(oi => oi.order_id))]
    stats.orders = orderIds.length
    stats.revenue = (orderItems || []).reduce((s, oi) => s + oi.unit_price * oi.quantity, 0)

    const { data: ro } = await supabase
      .from('orders')
      .select('*, order_items(*, products(name))')
      .in('id', orderIds.slice(0, 5))
      .order('created_at', { ascending: false })
    recentOrders = ro || []
    stats.pending = recentOrders.filter(o => o.status === 'pending').length
  }

  const statCards = [
    { label: 'สินค้าทั้งหมด', value: stats.products, color: 'bg-blue-50 text-blue-700' },
    { label: 'คำสั่งซื้อ', value: stats.orders, color: 'bg-purple-50 text-purple-700' },
    { label: 'รายได้รวม', value: formatPrice(stats.revenue), color: 'bg-green-50 text-green-700' },
    { label: 'รอดำเนินการ', value: stats.pending, color: 'bg-yellow-50 text-yellow-700' },
  ]

  return (
    <div className="p-8">
      <h1 className="font-display text-3xl mb-2">Dashboard</h1>
      <p className="text-[#888] text-sm mb-8">ยินดีต้อนรับ, {shop?.name || 'ร้านค้า'}</p>

      {!shop && (
        <div className="card p-8 text-center mb-8">
          <p className="text-lg mb-2">ยังไม่มีร้านค้า</p>
          <p className="text-[#888] text-sm mb-4">สร้างร้านค้าของคุณก่อนเริ่มขายสินค้า</p>
          <Link href="/admin/shop" className="btn-primary">สร้างร้านค้าเลย →</Link>
        </div>
      )}

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {statCards.map(({ label, value, color }) => (
          <div key={label} className="card p-6">
            <div className={`inline-block text-xs uppercase tracking-widest px-2 py-1 rounded mb-3 ${color}`}>{label}</div>
            <p className="font-display text-2xl">{value}</p>
          </div>
        ))}
      </div>

      <div className="card">
        <div className="p-6 border-b border-[#E8E4DF]">
          <h2 className="font-medium">คำสั่งซื้อล่าสุด</h2>
        </div>
        {recentOrders.length === 0 ? (
          <p className="p-8 text-center text-[#888] text-sm">ยังไม่มีคำสั่งซื้อ</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="border-b border-[#E8E4DF]">
                <tr className="text-left text-xs uppercase tracking-widest text-[#888]">
                  <th className="px-6 py-3">รหัสออเดอร์</th>
                  <th className="px-6 py-3">สินค้า</th>
                  <th className="px-6 py-3">ยอดรวม</th>
                  <th className="px-6 py-3">สถานะ</th>
                  <th className="px-6 py-3">วันที่</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E8E4DF]">
                {recentOrders.map(order => (
                  <tr key={order.id} className="hover:bg-[#F7F5F2]">
                    <td className="px-6 py-4 font-mono text-xs">{order.id.slice(0, 8)}...</td>
                    <td className="px-6 py-4 text-[#888] text-xs">{order.order_items?.length} ชิ้น</td>
                    <td className="px-6 py-4 font-medium">{formatPrice(order.total_price)}</td>
                    <td className="px-6 py-4">
                      <span className={cn('px-2 py-1 rounded text-xs', ORDER_STATUS_COLOR[order.status])}>
                        {ORDER_STATUS_LABEL[order.status]}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-[#888] text-xs">{new Date(order.created_at).toLocaleDateString('th-TH', { dateStyle: 'long' })}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
