'use client'
import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { OrderStatus } from '@/types'

const STATUSES: OrderStatus[] = ['pending', 'confirmed', 'shipping', 'delivered', 'cancelled']
const LABELS: Record<OrderStatus, string> = {
  pending: 'รอยืนยัน', confirmed: 'ยืนยันแล้ว', shipping: 'กำลังจัดส่ง', delivered: 'ส่งแล้ว', cancelled: 'ยกเลิก'
}

export default function OrderStatusUpdater({ orderId, currentStatus }: { orderId: string, currentStatus: OrderStatus }) {
  const [status, setStatus] = useState(currentStatus)
  const [saving, setSaving] = useState(false)
  const supabase = createClient()

  const update = async (newStatus: OrderStatus) => {
    setSaving(true)
    await supabase.from('orders').update({ status: newStatus }).eq('id', orderId)
    setStatus(newStatus)
    setSaving(false)
  }

  return (
    <select
      value={status}
      onChange={e => update(e.target.value as OrderStatus)}
      disabled={saving}
      className="text-xs border border-[#E8E4DF] bg-white px-3 py-1.5 focus:outline-none focus:border-[#1A1A1A] disabled:opacity-50"
    >
      {STATUSES.map(s => <option key={s} value={s}>{LABELS[s]}</option>)}
    </select>
  )
}
