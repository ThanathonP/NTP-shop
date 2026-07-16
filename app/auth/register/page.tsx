'use client'
import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

export default function RegisterPage() {
  const [form, setForm] = useState({ email: '', password: '', confirmPassword: '', full_name: '' })
  const [touched, setTouched] = useState({ password: false, confirmPassword: false })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()

  const passwordTooShort = form.password.length > 0 && form.password.length < 6
  const passwordMismatch = form.confirmPassword.length > 0 && form.password !== form.confirmPassword
  const canSubmit = form.password.length >= 6 && form.password === form.confirmPassword

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setTouched({ password: true, confirmPassword: true })
    if (!canSubmit) return
    setLoading(true); setError('')
    const supabase = createClient()
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
          <Link href="/" className="font-display text-3xl tracking-widest">NTP</Link>
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
              <label htmlFor="password" className="text-xs uppercase tracking-widest text-[#888] block mb-2">รหัสผ่าน</label>
              <input
                id="password"
                type="password"
                required
                minLength={6}
                className={`input ${touched.password && passwordTooShort ? 'border-red-400 focus:border-red-500' : ''}`}
                value={form.password}
                onChange={e => setForm(p => ({...p, password: e.target.value}))}
                onBlur={() => setTouched(t => ({...t, password: true}))}
                aria-invalid={touched.password && passwordTooShort}
                aria-describedby="password-error"
              />
              {touched.password && passwordTooShort && (
                <p id="password-error" className="text-red-500 text-xs mt-1">รหัสผ่านต้องมีอย่างน้อย 6 ตัวอักษร</p>
              )}
            </div>
            <div>
              <label htmlFor="confirmPassword" className="text-xs uppercase tracking-widest text-[#888] block mb-2">ยืนยันรหัสผ่าน</label>
              <input
                id="confirmPassword"
                type="password"
                required
                className={`input ${touched.confirmPassword && passwordMismatch ? 'border-red-400 focus:border-red-500' : ''}`}
                value={form.confirmPassword}
                onChange={e => setForm(p => ({...p, confirmPassword: e.target.value}))}
                onBlur={() => setTouched(t => ({...t, confirmPassword: true}))}
                aria-invalid={touched.confirmPassword && passwordMismatch}
                aria-describedby="confirm-password-error"
              />
              {touched.confirmPassword && passwordMismatch && (
                <p id="confirm-password-error" className="text-red-500 text-xs mt-1">รหัสผ่านไม่ตรงกัน</p>
              )}
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
