import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { formatPrice, ORDER_STATUS_LABEL, cn } from '@/lib/utils'
import BarChart from './BarChart'
import type { OrderStatus } from '@/types'

const DAYS = 14
const ACCENT = '#C8A882'
const INK = '#1A1A1A'

const STATUS_BAR_COLOR: Record<OrderStatus, string> = {
  pending: 'bg-amber-400',
  confirmed: 'bg-blue-400',
  shipping: 'bg-purple-400',
  delivered: 'bg-green-500',
  cancelled: 'bg-red-400',
}

function dayKey(d: Date) {
  return d.toISOString().slice(0, 10)
}
function isSameDay(iso: string, d: Date) {
  return dayKey(new Date(iso)) === dayKey(d)
}
function shortLabel(d: Date) {
  return d.toLocaleDateString('th-TH', { day: 'numeric', month: 'short' })
}

export default async function PlatformDashboardPage() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  const { data: profile } = await supabase.from('profiles').select('role').eq('id', user!.id).single()
  if (profile?.role !== 'admin') redirect('/admin')

  const [{ data: orders }, { data: orderItems }, { data: shops }, { data: profiles }, { count: totalProducts }, { count: activeProducts }] =
    await Promise.all([
      supabase.from('orders').select('id, status, total_price, created_at'),
      supabase.from('order_items').select('quantity, unit_price, product_id, orders(status), products(name, shop_id, shops(name))'),
      supabase.from('shops').select('id, name, is_active, created_at'),
      supabase.from('profiles').select('id, created_at'),
      supabase.from('products').select('*', { count: 'exact', head: true }),
      supabase.from('products').select('*', { count: 'exact', head: true }).eq('is_active', true),
    ])

  const allOrders = orders || []
  const allOrderItems = (orderItems || []) as any[]
  const allShops = shops || []
  const allProfiles = profiles || []

  const today = new Date()
  const notCancelled = (status: string) => status !== 'cancelled'

  const totalRevenue = allOrders.filter((o) => notCancelled(o.status)).reduce((s, o) => s + Number(o.total_price), 0)
  const ordersToday = allOrders.filter((o) => isSameDay(o.created_at, today)).length
  const revenueToday = allOrders.filter((o) => isSameDay(o.created_at, today) && notCancelled(o.status)).reduce((s, o) => s + Number(o.total_price), 0)
  const newUsersToday = allProfiles.filter((p) => isSameDay(p.created_at, today)).length
  const newShopsToday = allShops.filter((s) => isSameDay(s.created_at, today)).length

  const days = Array.from({ length: DAYS }, (_, i) => {
    const d = new Date(today)
    d.setDate(d.getDate() - (DAYS - 1 - i))
    return d
  })
  const dailyOrders = days.map((d) => ({
    label: shortLabel(d),
    value: allOrders.filter((o) => isSameDay(o.created_at, d)).length,
  }))
  const dailyRevenue = days.map((d) => ({
    label: shortLabel(d),
    value: allOrders.filter((o) => isSameDay(o.created_at, d) && notCancelled(o.status)).reduce((s, o) => s + Number(o.total_price), 0),
  }))

  const statuses: OrderStatus[] = ['pending', 'confirmed', 'shipping', 'delivered', 'cancelled']
  const statusCounts = statuses.map((s) => ({ status: s, count: allOrders.filter((o) => o.status === s).length }))
  const maxStatusCount = Math.max(1, ...statusCounts.map((s) => s.count))

  const shopRevenue = new Map<string, { name: string, revenue: number, qty: number }>()
  const productQty = new Map<string, { name: string, shopName: string, qty: number, revenue: number }>()
  for (const oi of allOrderItems) {
    if (oi.orders?.status === 'cancelled') continue
    const lineRevenue = Number(oi.unit_price) * oi.quantity
    const shopId = oi.products?.shop_id
    const shopName = oi.products?.shops?.name || 'ไม่ทราบร้าน'
    if (shopId) {
      const entry = shopRevenue.get(shopId) || { name: shopName, revenue: 0, qty: 0 }
      entry.revenue += lineRevenue
      entry.qty += oi.quantity
      shopRevenue.set(shopId, entry)
    }
    const pid = oi.product_id
    if (pid) {
      const entry = productQty.get(pid) || { name: oi.products?.name || 'ไม่ทราบสินค้า', shopName, qty: 0, revenue: 0 }
      entry.qty += oi.quantity
      entry.revenue += lineRevenue
      productQty.set(pid, entry)
    }
  }
  const topShops = [...shopRevenue.values()].sort((a, b) => b.revenue - a.revenue).slice(0, 5)
  const topProducts = [...productQty.values()].sort((a, b) => b.qty - a.qty).slice(0, 5)

  const todayTiles = [
    { label: 'คำสั่งซื้อวันนี้', value: ordersToday.toLocaleString() },
    { label: 'รายได้วันนี้', value: formatPrice(revenueToday) },
    { label: 'ผู้ใช้ใหม่วันนี้', value: newUsersToday.toLocaleString() },
    { label: 'ร้านค้าใหม่วันนี้', value: newShopsToday.toLocaleString() },
  ]
  const totalTiles = [
    { label: 'ร้านค้าทั้งหมด', value: allShops.length.toLocaleString(), sub: `${allShops.filter((s) => s.is_active).length} เปิดใช้งาน` },
    { label: 'สินค้าทั้งหมด', value: (totalProducts || 0).toLocaleString(), sub: `${activeProducts || 0} เปิดใช้งาน` },
    { label: 'ผู้ใช้ทั้งหมด', value: allProfiles.length.toLocaleString() },
    { label: 'คำสั่งซื้อทั้งหมด', value: allOrders.length.toLocaleString() },
    { label: 'รายได้รวม', value: formatPrice(totalRevenue) },
    { label: 'รอดำเนินการ', value: (statusCounts.find((s) => s.status === 'pending')?.count || 0).toLocaleString() },
  ]

  return (
    <div className="p-8">
      <h1 className="font-display text-3xl mb-2">ภาพรวมระบบ</h1>
      <p className="text-[#888] text-sm mb-8">สรุปสถิติทั้งแพลตฟอร์ม ณ {today.toLocaleDateString('th-TH', { dateStyle: 'long' })}</p>

      <p className="text-xs uppercase tracking-widest text-[#888] mb-3">วันนี้</p>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {todayTiles.map(({ label, value }) => (
          <div key={label} className="card p-6">
            <p className="text-xs text-[#888] mb-2">{label}</p>
            <p className="font-display text-2xl">{value}</p>
          </div>
        ))}
      </div>

      <p className="text-xs uppercase tracking-widest text-[#888] mb-3">ภาพรวมทั้งหมด</p>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
        {totalTiles.map(({ label, value, sub }) => (
          <div key={label} className="card p-6">
            <p className="text-xs text-[#888] mb-2">{label}</p>
            <p className="font-display text-xl">{value}</p>
            {sub && <p className="text-[10px] text-[#888] mt-1">{sub}</p>}
          </div>
        ))}
      </div>

      <div className="grid md:grid-cols-2 gap-4 mb-8">
        <div className="card p-6">
          <p className="text-sm font-medium mb-1">คำสั่งซื้อรายวัน</p>
          <p className="text-xs text-[#888] mb-6">{DAYS} วันล่าสุด</p>
          <BarChart data={dailyOrders} color={INK} formatValue={(v) => `${v} คำสั่งซื้อ`} />
        </div>
        <div className="card p-6">
          <p className="text-sm font-medium mb-1">รายได้รายวัน</p>
          <p className="text-xs text-[#888] mb-6">{DAYS} วันล่าสุด (ไม่รวมคำสั่งซื้อที่ยกเลิก)</p>
          <BarChart data={dailyRevenue} color={ACCENT} formatValue={(v) => formatPrice(v)} />
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-4 mb-8">
        <div className="card p-6">
          <p className="text-sm font-medium mb-6">สถานะคำสั่งซื้อทั้งหมด</p>
          <div className="space-y-3">
            {statusCounts.map(({ status, count }) => (
              <div key={status} className="flex items-center gap-3">
                <span className="text-xs text-[#888] w-20 flex-shrink-0">{ORDER_STATUS_LABEL[status]}</span>
                <div className="flex-1 h-2 bg-[#F7F5F2] rounded-full overflow-hidden">
                  <div
                    className={cn('h-full rounded-full', STATUS_BAR_COLOR[status])}
                    style={{ width: `${(count / maxStatusCount) * 100}%` }}
                  />
                </div>
                <span className="text-xs font-medium w-8 text-right flex-shrink-0">{count}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="card p-6">
          <p className="text-sm font-medium mb-6">ร้านค้าขายดี Top 5 (ตามรายได้)</p>
          {topShops.length > 0 ? (
            <div className="space-y-3">
              {topShops.map((s, i) => (
                <div key={s.name + i} className="flex items-center justify-between text-sm">
                  <span className="text-[#888]"><span className="text-[#C8A882] mr-2">#{i + 1}</span>{s.name}</span>
                  <span className="font-medium">{formatPrice(s.revenue)}</span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-[#888]">ยังไม่มีข้อมูลคำสั่งซื้อ</p>
          )}
        </div>
      </div>

      <div className="card p-6">
        <p className="text-sm font-medium mb-6">สินค้าขายดี Top 5 (ตามจำนวนที่ขายได้)</p>
        {topProducts.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="border-b border-[#E8E4DF]">
                <tr className="text-left text-xs uppercase tracking-widest text-[#888]">
                  <th className="py-2 pr-4">อันดับ</th>
                  <th className="py-2 pr-4">สินค้า</th>
                  <th className="py-2 pr-4">ร้านค้า</th>
                  <th className="py-2 pr-4 text-right">ขายได้ (ชิ้น)</th>
                  <th className="py-2 text-right">รายได้</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E8E4DF]">
                {topProducts.map((p, i) => (
                  <tr key={p.name + i}>
                    <td className="py-3 pr-4 text-[#C8A882]">#{i + 1}</td>
                    <td className="py-3 pr-4 font-medium">{p.name}</td>
                    <td className="py-3 pr-4 text-[#888] text-xs">{p.shopName}</td>
                    <td className="py-3 pr-4 text-right">{p.qty.toLocaleString()}</td>
                    <td className="py-3 text-right font-medium">{formatPrice(p.revenue)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-sm text-[#888]">ยังไม่มีข้อมูลคำสั่งซื้อ</p>
        )}
      </div>
    </div>
  )
}
