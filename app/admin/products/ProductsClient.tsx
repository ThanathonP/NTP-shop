'use client'
import { useState } from 'react'
import { Plus, Pencil, Trash2, X } from 'lucide-react'
import { formatPrice } from '@/lib/utils'
import { createClient } from '@/lib/supabase/client'
import type { Product } from '@/types'

const EMPTY = { name: '', description: '', price: '', stock_qty: '', category: '', image_url: '' }

export default function ProductsClient({ initialProducts, shopId }: { initialProducts: Product[], shopId: string }) {
  const [products, setProducts] = useState(initialProducts)
  const [showForm, setShowForm] = useState(false)
  const [editing, setEditing] = useState<Product | null>(null)
  const [form, setForm] = useState(EMPTY)
  const [saving, setSaving] = useState(false)
  const supabase = createClient()

  const openCreate = () => { setForm(EMPTY); setEditing(null); setShowForm(true) }
  const openEdit = (p: Product) => {
    setForm({ name: p.name, description: p.description || '', price: String(p.price), stock_qty: String(p.stock_qty), category: p.category || '', image_url: p.image_url || '' })
    setEditing(p); setShowForm(true)
  }

  const save = async () => {
    if (!form.name || !form.price) return
    setSaving(true)
    const payload = { shop_id: shopId, name: form.name, description: form.description, price: Number(form.price), stock_qty: Number(form.stock_qty), category: form.category, image_url: form.image_url || null }

    if (editing) {
      const { data } = await supabase.from('products').update(payload).eq('id', editing.id).select().single()
      if (data) setProducts(prev => prev.map(p => p.id === editing.id ? data : p))
    } else {
      const { data } = await supabase.from('products').insert(payload).select().single()
      if (data) setProducts(prev => [data, ...prev])
    }
    setSaving(false); setShowForm(false)
  }

  const deleteProduct = async (id: string) => {
    if (!confirm('ลบสินค้านี้?')) return
    await supabase.from('products').delete().eq('id', id)
    setProducts(prev => prev.filter(p => p.id !== id))
  }

  return (
    <>
      <div className="flex justify-end mb-4">
        <button onClick={openCreate} className="btn-primary flex items-center gap-2">
          <Plus size={16} /> เพิ่มสินค้าใหม่
        </button>
      </div>

      {/* Product Table */}
      <div className="card overflow-hidden">
        <table className="w-full text-sm">
          <thead className="border-b border-[#E8E4DF] bg-[#F7F5F2]">
            <tr className="text-left text-xs uppercase tracking-widest text-[#888]">
              <th className="px-6 py-3">สินค้า</th>
              <th className="px-6 py-3">หมวดหมู่</th>
              <th className="px-6 py-3">ราคา</th>
              <th className="px-6 py-3">คงเหลือ</th>
              <th className="px-6 py-3">จัดการ</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#E8E4DF]">
            {products.length === 0 && (
              <tr><td colSpan={5} className="text-center py-12 text-[#888]">ยังไม่มีสินค้า</td></tr>
            )}
            {products.map(p => (
              <tr key={p.id} className="hover:bg-[#F7F5F2]">
                <td className="px-6 py-4">
                  <div className="font-medium">{p.name}</div>
                  {p.description && <div className="text-xs text-[#888] line-clamp-1 mt-0.5">{p.description}</div>}
                </td>
                <td className="px-6 py-4 text-[#888] text-xs">{p.category || '-'}</td>
                <td className="px-6 py-4 font-medium">{formatPrice(p.price)}</td>
                <td className="px-6 py-4">
                  <span className={`text-xs px-2 py-1 rounded ${p.stock_qty > 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                    {p.stock_qty}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex gap-2">
                    <button onClick={() => openEdit(p)} className="p-1.5 hover:bg-[#E8E4DF] rounded transition-colors"><Pencil size={14} /></button>
                    <button onClick={() => deleteProduct(p.id)} className="p-1.5 hover:bg-red-50 text-red-400 rounded transition-colors"><Trash2 size={14} /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal Form */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-[#E8E4DF]">
              <h2 className="font-display text-xl">{editing ? 'แก้ไขสินค้า' : 'เพิ่มสินค้าใหม่'}</h2>
              <button onClick={() => setShowForm(false)}><X size={20} /></button>
            </div>
            <div className="p-6 space-y-4">
              {[['name','ชื่อสินค้า *','text'],['price','ราคา (บาท) *','number'],['stock_qty','จำนวนคงเหลือ','number'],['category','หมวดหมู่','text'],['image_url','URL รูปภาพ','url']].map(([field, label, type]) => (
                <div key={field}>
                  <label className="text-xs uppercase tracking-widest text-[#888] block mb-2">{label}</label>
                  <input type={type} className="input" value={(form as any)[field]}
                    onChange={e => setForm(p => ({...p, [field]: e.target.value}))} />
                </div>
              ))}
              <div>
                <label className="text-xs uppercase tracking-widest text-[#888] block mb-2">รายละเอียด</label>
                <textarea rows={3} className="input resize-none" value={form.description}
                  onChange={e => setForm(p => ({...p, description: e.target.value}))} />
              </div>
            </div>
            <div className="p-6 border-t border-[#E8E4DF] flex gap-3 justify-end">
              <button onClick={() => setShowForm(false)} className="btn-outline py-2 px-4">ยกเลิก</button>
              <button onClick={save} disabled={saving} className="btn-primary py-2 px-6">
                {saving ? 'กำลังบันทึก...' : 'บันทึก'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
