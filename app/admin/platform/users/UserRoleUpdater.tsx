'use client'
import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { Role } from '@/types'

const ROLES: Role[] = ['customer', 'shop_owner', 'admin']
const LABELS: Record<Role, string> = { customer: 'ลูกค้า', shop_owner: 'เจ้าของร้าน', admin: 'ผู้ดูแลระบบ' }

export default function UserRoleUpdater({ userId, currentRole, disableChange }: { userId: string, currentRole: Role, disableChange?: boolean }) {
  const [role, setRole] = useState(currentRole)
  const [saving, setSaving] = useState(false)

  const update = async (newRole: Role) => {
    setSaving(true)
    const supabase = createClient()
    const { error } = await supabase.from('profiles').update({ role: newRole }).eq('id', userId)
    if (!error) setRole(newRole)
    setSaving(false)
  }

  return (
    <select
      value={role}
      onChange={(e) => update(e.target.value as Role)}
      disabled={saving || disableChange}
      title={disableChange ? 'ไม่สามารถเปลี่ยนบทบาทของตัวเองได้' : undefined}
      className="text-xs border border-[#E8E4DF] bg-white px-3 py-1.5 focus:outline-none focus:border-[#1A1A1A] disabled:opacity-50"
    >
      {ROLES.map((r) => <option key={r} value={r}>{LABELS[r]}</option>)}
    </select>
  )
}
