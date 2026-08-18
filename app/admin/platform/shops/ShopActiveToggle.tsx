'use client'
import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'

export default function ShopActiveToggle({ shopId, isActive }: { shopId: string, isActive: boolean }) {
  const [active, setActive] = useState(isActive)
  const [saving, setSaving] = useState(false)

  const toggle = async () => {
    setSaving(true)
    const supabase = createClient()
    const { error } = await supabase.from('shops').update({ is_active: !active }).eq('id', shopId)
    if (!error) setActive(!active)
    setSaving(false)
  }

  return (
    <button
      onClick={toggle}
      disabled={saving}
      className="text-xs border border-[#E8E4DF] px-3 py-1.5 hover:bg-[#F7F5F2] transition-colors disabled:opacity-50"
    >
      {active ? 'ปิดร้าน' : 'เปิดร้าน'}
    </button>
  )
}
