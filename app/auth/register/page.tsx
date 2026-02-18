'use client'
import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

export default function RegisterPage() {
  const [form, setForm] = useState({ email: '', password: '', full_name: '' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const supabase = createClient()
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true); setError('')
    const { error } = await supabase.auth.signUp({
      email: form.email,
      password: form.password,
      options: { data: { full_name: form.full_name } }
    })
    if (error) { setError(error.message); setLoading(false) }
    else router.push('/')
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F7F5F2] px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-10">
          <Link href="/" className="font-display text-3xl tracking-widest">MONŌ</Link>
          <p className="text-[#888] mt-2 text-sm">สมัครสมาชิกเพื่อเริ่มใช้งาน</p>
        </div>
        <div className="card p-8">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-xs uppercase tracking-widest text-[#888] block mb-2">ชื่อ-นามสกุล</label>
              <input type="text" required className="input" value={form.full_name}
                onChange={e => setForm(p => ({...p, full_name: e.target.value}))} />
            </div>
            <div>
              <label className="text-xs uppercase tracking-widest text-[#888] block mb-2">อีเมล</label>
              <input type="email" required className="input" value={form.email}
                onChange={e => setForm(p => ({...p, email: e.target.value}))} />
            </div>
            <div>
              <label className="text-xs uppercase tracking-widest text-[#888] block mb-2">รหัสผ่าน</label>
              <input type="password" required minLength={6} className="input" value={form.password}
                onChange={e => setForm(p => ({...p, password: e.target.value}))} />
            </div>
            {error && <p className="text-red-500 text-sm">{error}</p>}
            <button type="submit" disabled={loading} className="btn-primary w-full justify-center py-3 mt-2">
              {loading ? 'กำลังสมัคร...' : 'สมัครสมาชิกฟรี'}
            </button>
          </form>
          <div className="mt-6 pt-6 border-t border-[#E8E4DF] text-center">
            <p className="text-sm text-[#888]">
              มีบัญชีแล้ว?{' '}
              <Link href="/auth/login" className="text-[#1A1A1A] font-medium hover:underline">เข้าสู่ระบบ</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
