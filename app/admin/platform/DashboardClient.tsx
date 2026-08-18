'use client'
import { useMemo, useState } from 'react'
import { formatPrice, ORDER_STATUS_LABEL, cn } from '@/lib/utils'
import type { OrderStatus } from '@/types'
import DateRangeFilter, { rangeForPreset, type DateRange } from './DateRangeFilter'
import TrendLine from './charts/TrendLine'
import DonutChart from './charts/DonutChart'
import RankBar from './charts/RankBar'
import { CATEGORICAL, STATUS_HEX, TREND_ORDERS_COLOR, TREND_REVENUE_COLOR } from './chartTheme'

type RawOrder = { id: string, status: OrderStatus, total_price: number, created_at: string }
type RawOrderItem = {
  quantity: number
  unit_price: number
  product_id: string
  orders: { status: OrderStatus, created_at: string } | null
  products: { name: string, shop_id: string, shops: { name: string } | null } | null
}
type RawShop = { id: string, name: string, is_active: boolean, created_at: string }
type RawProfile = { id: string, created_at: string }

const STATUSES: OrderStatus[] = ['pending', 'confirmed', 'shipping', 'delivered', 'cancelled']
const notCancelled = (status: string) => status !== 'cancelled'

function inRange(iso: string, from: Date, to: Date) {
  const t = new Date(iso).getTime()
  return t >= from.getTime() && t <= to.getTime()
}

function getBuckets(from: Date, to: Date) {
  const oneDayMs = 24 * 60 * 60 * 1000
  if (to.getTime() - from.getTime() <= oneDayMs) {
    return Array.from({ length: 24 }, (_, h) => {
      const start = new Date(from); start.setHours(h, 0, 0, 0)
      const end = new Date(from); end.setHours(h, 59, 59, 999)
      return { label: `${String(h).padStart(2, '0')}:00`, start, end }
    })
  }
  const buckets: { label: string, start: Date, end: Date }[] = []
  const cursor = new Date(from)
  cursor.setHours(0, 0, 0, 0)
  let guard = 0
  while (cursor.getTime() <= to.getTime() && guard < 400) {
    const start = new Date(cursor)
    const end = new Date(cursor); end.setHours(23, 59, 59, 999)
    buckets.push({ label: start.toLocaleDateString('th-TH', { day: 'numeric', month: 'short' }), start, end })
    cursor.setDate(cursor.getDate() + 1)
    guard++
  }
  return buckets
}

export default function DashboardClient({
  orders,
  orderItems,
  shops,
  profiles,
  totalProducts,
  activeProducts,
}: {
  orders: RawOrder[]
  orderItems: RawOrderItem[]
  shops: RawShop[]
  profiles: RawProfile[]
  totalProducts: number
  activeProducts: number
}) {
  const [range, setRange] = useState<DateRange>(() => rangeForPreset('today'))

  const ordersInRange = useMemo(() => orders.filter((o) => inRange(o.created_at, range.from, range.to)), [orders, range])
  const orderItemsInRange = useMemo(
    () => orderItems.filter((oi) => oi.orders && inRange(oi.orders.created_at, range.from, range.to)),
    [orderItems, range]
  )
  const newUsersInRange = useMemo(() => profiles.filter((p) => inRange(p.created_at, range.from, range.to)).length, [profiles, range])
  const newShopsInRange = useMemo(() => shops.filter((s) => inRange(s.created_at, range.from, range.to)).length, [shops, range])

  const revenueInRange = useMemo(
    () => ordersInRange.filter((o) => notCancelled(o.status)).reduce((s, o) => s + Number(o.total_price), 0),
    [ordersInRange]
  )
  const paidOrdersInRange = ordersInRange.filter((o) => notCancelled(o.status)).length
  const avgOrderValue = paidOrdersInRange > 0 ? revenueInRange / paidOrdersInRange : 0

  const pendingAllTime = orders.filter((o) => o.status === 'pending').length

  const buckets = useMemo(() => getBuckets(range.from, range.to), [range])
  const dailyOrders = useMemo(
    () => buckets.map((b) => ({ label: b.label, value: orders.filter((o) => inRange(o.created_at, b.start, b.end)).length })),
    [buckets, orders]
  )
  const dailyRevenue = useMemo(
    () => buckets.map((b) => ({
      label: b.label,
      value: orders.filter((o) => inRange(o.created_at, b.start, b.end) && notCancelled(o.status)).reduce((s, o) => s + Number(o.total_price), 0),
    })),
    [buckets, orders]
  )

  const statusCounts = useMemo(
    () => STATUSES.map((s) => ({ status: s, count: ordersInRange.filter((o) => o.status === s).length })),
    [ordersInRange]
  )

  const { topShops, topProducts } = useMemo(() => {
    const shopRevenue = new Map<string, { name: string, revenue: number }>()
    const productQty = new Map<string, { name: string, qty: number }>()
    for (const oi of orderItemsInRange) {
      if (oi.orders?.status === 'cancelled') continue
      const lineRevenue = Number(oi.unit_price) * oi.quantity
      const shopId = oi.products?.shop_id
      if (shopId) {
        const entry = shopRevenue.get(shopId) || { name: oi.products?.shops?.name || 'ไม่ทราบร้าน', revenue: 0 }
        entry.revenue += lineRevenue
        shopRevenue.set(shopId, entry)
      }
      const pid = oi.product_id
      if (pid) {
        const entry = productQty.get(pid) || { name: oi.products?.name || 'ไม่ทราบสินค้า', qty: 0 }
        entry.qty += oi.quantity
        productQty.set(pid, entry)
      }
    }
    return {
      topShops: [...shopRevenue.values()].sort((a, b) => b.revenue - a.revenue).slice(0, 8),
      topProducts: [...productQty.values()].sort((a, b) => b.qty - a.qty).slice(0, 8),
    }
  }, [orderItemsInRange])

  const currentTiles = [
    { label: 'ร้านค้าทั้งหมด', value: shops.length.toLocaleString(), sub: `${shops.filter((s) => s.is_active).length} เปิดใช้งาน` },
    { label: 'ผู้ใช้ทั้งหมด', value: profiles.length.toLocaleString() },
    { label: 'สินค้าทั้งหมด', value: totalProducts.toLocaleString(), sub: `${activeProducts} เปิดใช้งาน` },
    { label: 'รอดำเนินการทั้งหมด', value: pendingAllTime.toLocaleString() },
  ]
  const rangeTiles = [
    { label: 'คำสั่งซื้อ', value: ordersInRange.length.toLocaleString() },
    { label: 'รายได้', value: formatPrice(revenueInRange) },
    { label: 'มูลค่าเฉลี่ย/ออเดอร์', value: formatPrice(avgOrderValue) },
    { label: 'ผู้ใช้ใหม่', value: newUsersInRange.toLocaleString() },
    { label: 'ร้านค้าใหม่', value: newShopsInRange.toLocaleString() },
  ]

  return (
    <div className="p-8">
      <h1 className="font-display text-3xl mb-2">ภาพรวมระบบ</h1>
      <p className="text-[#888] text-sm mb-6">สรุปสถิติทั้งแพลตฟอร์ม</p>

      <DateRangeFilter value={range} onChange={setRange} />

      <p className="text-xs uppercase tracking-widest text-[#888] mb-3">ภาพรวมปัจจุบัน (ทั้งหมดตลอดกาล)</p>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {currentTiles.map(({ label, value, sub }) => (
          <div key={label} className="card p-6">
            <p className="text-xs text-[#888] mb-2">{label}</p>
            <p className="font-display text-2xl">{value}</p>
            {sub && <p className="text-[10px] text-[#888] mt-1">{sub}</p>}
          </div>
        ))}
      </div>

      <p className="text-xs uppercase tracking-widest text-[#888] mb-3">ตามช่วงเวลาที่เลือก</p>
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
        {rangeTiles.map(({ label, value }) => (
          <div key={label} className="card p-6">
            <p className="text-xs text-[#888] mb-2">{label}</p>
            <p className="font-display text-xl">{value}</p>
          </div>
        ))}
      </div>

      <div className="grid md:grid-cols-2 gap-4 mb-8">
        <div className="card p-6">
          <p className="text-sm font-medium mb-1">แนวโน้มคำสั่งซื้อ</p>
          <p className="text-xs text-[#888] mb-2">{range.preset === 'today' ? 'รายชั่วโมง' : 'รายวัน'} ในช่วงที่เลือก</p>
          <TrendLine data={dailyOrders} color={TREND_ORDERS_COLOR} valueFormatter={(v) => `${v} คำสั่งซื้อ`} />
        </div>
        <div className="card p-6">
          <p className="text-sm font-medium mb-1">แนวโน้มรายได้</p>
          <p className="text-xs text-[#888] mb-2">{range.preset === 'today' ? 'รายชั่วโมง' : 'รายวัน'} ในช่วงที่เลือก (ไม่รวมยกเลิก)</p>
          <TrendLine data={dailyRevenue} color={TREND_REVENUE_COLOR} valueFormatter={(v) => formatPrice(v)} />
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-4 mb-8">
        <div className="card p-6">
          <p className="text-sm font-medium mb-4">สัดส่วนสถานะคำสั่งซื้อ</p>
          <DonutChart
            data={statusCounts.filter((s) => s.count > 0).map((s) => ({ name: ORDER_STATUS_LABEL[s.status], value: s.count, color: STATUS_HEX[s.status] }))}
            valueFormatter={(v) => `${v} รายการ`}
          />
        </div>
        <div className="card p-6">
          <p className="text-sm font-medium mb-4">สัดส่วนรายได้ตามร้านค้า</p>
          <DonutChart
            data={topShops.map((s, i) => ({ name: s.name, value: s.revenue, color: CATEGORICAL[i % CATEGORICAL.length] }))}
            valueFormatter={(v) => formatPrice(v)}
          />
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div className="card p-6">
          <p className="text-sm font-medium mb-4">ร้านค้าขายดี (ตามรายได้)</p>
          <RankBar
            data={topShops.map((s) => ({ name: s.name, value: s.revenue }))}
            color={TREND_REVENUE_COLOR}
            valueFormatter={(v) => formatPrice(v)}
          />
        </div>
        <div className="card p-6">
          <p className="text-sm font-medium mb-4">สินค้าขายดี (ตามจำนวนที่ขายได้)</p>
          <RankBar
            data={topProducts.map((p) => ({ name: p.name, value: p.qty }))}
            color={TREND_ORDERS_COLOR}
            valueFormatter={(v) => `${v} ชิ้น`}
          />
        </div>
      </div>
    </div>
  )
}
