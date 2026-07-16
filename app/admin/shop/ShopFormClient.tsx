'use client'
import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { Shop } from '@/types'

export default function ShopFormClient({ initialShop, ownerId }: { initialShop: Shop | null, ownerId: string }) {
  const [form, setForm] = useState({
    name: initialShop?.name || '',
    description: initialShop?.description || '',
    logo_url: initialShop?.logo_url || '',
    banner_url: initialShop?.banner_url || '',
  })
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  const save = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    const supabase = createClient()
    if (initialShop) {
      await supabase.from('shops').update(form).eq('id', initialShop.id)
    } else {
      await supabase.from('shops').insert({ ...form, owner_id: ownerId })
    }
    setSaving(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  return (
    <form onSubmit={save} className="card p-8 space-y-6">
      {[
        ['name', 'ชื่อร้านค้า *', 'text'],
        ['logo_url', 'URL โลโก้', 'url'],
        ['banner_url', 'URL แบนเนอร์', 'url'],
      ].map(([field, label, type]) => (
        <div key={field}>
          <label className="text-xs uppercase tracking-widest text-[#888] block mb-2">{label}</label>
          <input type={type} className="input" required={field === 'name'}
            value={(form as any)[field]} onChange={e => setForm(p => ({...p, [field]: e.target.value}))} />
        </div>
      ))}
      <div>
        <label className="text-xs uppercase tracking-widest text-[#888] block mb-2">คำอธิบายร้าน</label>
        <textarea rows={4} className="input resize-none" value={form.description}
          onChange={e => setForm(p => ({...p, description: e.target.value}))} />
      </div>
      <button type="submit" disabled={saving} className="btn-primary py-3 px-8">
        {saving ? 'กำลังบันทึก...' : saved ? '✓ บันทึกแล้ว!' : initialShop ? 'บันทึกการเปลี่ยนแปลง' : 'สร้างร้านค้า'}
      </button>
    </form>
  )
}
