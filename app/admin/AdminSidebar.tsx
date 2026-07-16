'use client'
import Link from 'next/link'
import { useState } from 'react'
import { usePathname } from 'next/navigation'
import { LayoutDashboard, Package, ShoppingBag, Store, LogOut, Menu, X } from 'lucide-react'

const navItems = [
  { href: '/admin', icon: LayoutDashboard, label: 'Dashboard' },
  { href: '/admin/products', icon: Package, label: 'สินค้า' },
  { href: '/admin/orders', icon: ShoppingBag, label: 'คำสั่งซื้อ' },
  { href: '/admin/shop', icon: Store, label: 'ข้อมูลร้าน' },
]

export default function AdminSidebar({ name }: { name: string }) {
  const [open, setOpen] = useState(false)
  const pathname = usePathname()

  return (
    <>
      {/* Mobile top bar */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-30 h-14 bg-[#1A1A1A] text-white flex items-center justify-between px-4">
        <Link href="/" className="font-display text-lg tracking-widest">MONŌ</Link>
        <button onClick={() => setOpen(true)} aria-label="เปิดเมนู" aria-expanded={open}>
          <Menu size={22} aria-hidden="true" />
        </button>
      </div>

      {/* Overlay */}
      {open && (
        <div
          className="md:hidden fixed inset-0 bg-black/50 z-40"
          onClick={() => setOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Sidebar */}
      <aside
        className={`w-60 bg-[#1A1A1A] text-white flex flex-col fixed h-full z-50 transition-transform duration-300 md:translate-x-0 ${
          open ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="p-6 border-b border-white/10 flex items-start justify-between">
          <div>
            <Link href="/" className="font-display text-xl tracking-widest">MONŌ</Link>
            <p className="text-xs text-white/40 mt-1">Admin Panel</p>
          </div>
          <button className="md:hidden" onClick={() => setOpen(false)} aria-label="ปิดเมนู">
            <X size={20} aria-hidden="true" />
          </button>
        </div>
        <nav className="flex-1 p-4 space-y-1">
          {navItems.map(({ href, icon: Icon, label }) => {
            const active = pathname === href
            return (
              <Link
                key={href}
                href={href}
                onClick={() => setOpen(false)}
                aria-current={active ? 'page' : undefined}
                className={`flex items-center gap-3 px-4 py-3 text-sm rounded transition-colors ${
                  active ? 'bg-white/10 text-white' : 'text-white/70 hover:text-white hover:bg-white/10'
                }`}
              >
                <Icon size={16} aria-hidden="true" />
                {label}
              </Link>
            )
          })}
        </nav>
        <div className="p-4 border-t border-white/10">
          <p className="text-xs text-white/40 mb-1">เข้าสู่ระบบในฐานะ</p>
          <p className="text-sm text-white truncate">{name}</p>
          <form action="/api/auth/logout" method="POST">
            <button className="flex items-center gap-2 text-xs text-white/50 hover:text-white mt-2 transition-colors">
              <LogOut size={12} aria-hidden="true" /> ออกจากระบบ
            </button>
          </form>
        </div>
      </aside>
    </>
  )
}
