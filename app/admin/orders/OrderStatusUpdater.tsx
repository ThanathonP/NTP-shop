'use client'
import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { ORDER_STATUSES, ORDER_STATUS_LABEL } from '@/lib/utils'
import type { OrderStatus } from '@/types'

export default function OrderStatusUpdater({ orderId, currentStatus }: { orderId: string, currentStatus: OrderStatus }) {
  const [status, setStatus] = useState(currentStatus)
  const [saving, setSaving] = useState(false)

  const update = async (newStatus: OrderStatus) => {
    setSaving(true)
    const supabase = createClient()
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
      {ORDER_STATUSES.map(s => <option key={s} value={s}>{ORDER_STATUS_LABEL[s]}</option>)}
    </select>
  )
}
