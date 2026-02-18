import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { LayoutDashboard, Package, ShoppingBag, Store, LogOut } from 'lucide-react'

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth/login')

  const { data: profile } = await supabase.from('profiles').select('*').eq('id', user.id).single()
  if (!profile) redirect('/')

  const navItems = [
    { href: '/admin', icon: LayoutDashboard, label: 'Dashboard' },
    { href: '/admin/products', icon: Package, label: 'สินค้า' },
    { href: '/admin/orders', icon: ShoppingBag, label: 'คำสั่งซื้อ' },
    { href: '/admin/shop', icon: Store, label: 'ข้อมูลร้าน' },
  ]

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <aside className="w-60 bg-[#1A1A1A] text-white flex flex-col fixed h-full z-40">
        <div className="p-6 border-b border-white/10">
          <Link href="/" className="font-display text-xl tracking-widest">MONŌ</Link>
          <p className="text-xs text-white/40 mt-1">Admin Panel</p>
        </div>
        <nav className="flex-1 p-4 space-y-1">
          {navItems.map(({ href, icon: Icon, label }) => (
            <Link key={href} href={href}
              className="flex items-center gap-3 px-4 py-3 text-sm text-white/70 hover:text-white hover:bg-white/10 transition-colors rounded">
              <Icon size={16} />
              {label}
            </Link>
          ))}
        </nav>
        <div className="p-4 border-t border-white/10">
          <p className="text-xs text-white/40 mb-1">เข้าสู่ระบบในฐานะ</p>
          <p className="text-sm text-white truncate">{profile.full_name || profile.email}</p>
          <form action="/api/auth/logout" method="POST">
            <button className="flex items-center gap-2 text-xs text-white/50 hover:text-white mt-2 transition-colors">
              <LogOut size={12} /> ออกจากระบบ
            </button>
          </form>
        </div>
      </aside>

      {/* Main */}
      <main className="ml-60 flex-1 bg-[#F7F5F2] min-h-screen">
        {children}
      </main>
    </div>
  )
}
