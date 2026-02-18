'use client'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { ShoppingCart, Heart, User, Menu, X } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import type { Profile } from '@/types'

export default function Navbar() {
  const [user, setUser] = useState<Profile | null>(null)
  const [cartCount, setCartCount] = useState(0)
  const [menuOpen, setMenuOpen] = useState(false)
  const supabase = createClient()

  useEffect(() => {
    supabase.auth.getUser().then(async ({ data: { user } }) => {
      if (user) {
        const { data } = await supabase.from('profiles').select('*').eq('id', user.id).single()
        setUser(data)
        // Get cart count
        const { count } = await supabase
          .from('cart_items')
          .select('*', { count: 'exact', head: true })
          .eq('user_id', user.id)
        setCartCount(count || 0)
      }
    })
  }, [])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    window.location.href = '/'
  }

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-[#F7F5F2]/90 backdrop-blur-md border-b border-[#E8E4DF] h-16 flex items-center">
      <div className="max-w-7xl mx-auto w-full px-6 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="font-display text-xl tracking-widest">MONŌ</Link>

        {/* Desktop Nav */}
        <ul className="hidden md:flex gap-8 list-none">
          {[['สินค้าทั้งหมด', '/shop'], ['ร้านค้า', '/shops'], ['โปรโมชัน', '/shop?sale=1']].map(([label, href]) => (
            <li key={href}>
              <Link href={href} className="text-xs tracking-widest uppercase text-[#888] hover:text-[#1A1A1A] transition-colors">
                {label}
              </Link>
            </li>
          ))}
        </ul>

        {/* Actions */}
        <div className="flex items-center gap-4">
          <Link href="/cart" className="relative p-1">
            <ShoppingCart size={20} />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-[#C8A882] text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center">
                {cartCount}
              </span>
            )}
          </Link>

          {user ? (
            <div className="relative group">
              <button className="flex items-center gap-2 text-sm">
                <User size={20} />
                <span className="hidden md:block text-xs">{user.full_name || user.email}</span>
              </button>
              <div className="absolute right-0 top-8 bg-white border border-[#E8E4DF] shadow-lg min-w-[160px] opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
                <Link href="/admin" className="block px-4 py-3 text-sm hover:bg-[#F7F5F2] border-b border-[#E8E4DF]">
                  ร้านของฉัน
                </Link>
                <Link href="/orders" className="block px-4 py-3 text-sm hover:bg-[#F7F5F2]">คำสั่งซื้อของฉัน</Link>
                <button onClick={handleLogout} className="block w-full text-left px-4 py-3 text-sm hover:bg-[#F7F5F2] text-red-600">
                  ออกจากระบบ
                </button>
              </div>
            </div>
          ) : (
            <Link href="/auth/login" className="btn-primary text-xs py-2 px-4">เข้าสู่ระบบ</Link>
          )}

          <button className="md:hidden" onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="absolute top-16 left-0 right-0 bg-white border-b border-[#E8E4DF] md:hidden">
          {[['สินค้าทั้งหมด', '/shop'], ['ร้านค้า', '/shops'], ['โปรโมชัน', '/shop?sale=1']].map(([label, href]) => (
            <Link key={href} href={href} className="block px-6 py-4 text-sm border-b border-[#E8E4DF]" onClick={() => setMenuOpen(false)}>
              {label}
            </Link>
          ))}
        </div>
      )}
    </nav>
  )
}
