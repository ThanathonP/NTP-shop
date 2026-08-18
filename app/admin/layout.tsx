import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import AdminSidebar from './AdminSidebar'

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth/login')

  const { data: profile } = await supabase.from('profiles').select('*').eq('id', user.id).single()
  if (!profile) redirect('/')
  // ไม่แยก role "customer" กับ "shop_owner" — ใครก็ตามที่ล็อกอินแล้วเข้ามาสร้างร้านค้าของตัวเองได้เลย
  // (หน้าถัดไปอย่าง /admin/products, /admin/orders จะเช็คเองว่ามีร้านหรือยัง ถ้ายังไม่มีจะพาไปสร้างที่ /admin/shop)
  // เฉพาะ role "admin" เท่านั้นที่มีสิทธิ์เพิ่มเข้าไปเห็นเมนู "จัดการเว็บไซต์" ด้านล่าง

  return (
    <div className="min-h-screen">
      <AdminSidebar name={profile.full_name || profile.email} role={profile.role} />

      {/* Main */}
      <main className="md:ml-60 pt-14 md:pt-0 bg-[#F7F5F2] min-h-screen">
        {children}
      </main>
    </div>
  )
}
