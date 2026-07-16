import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import AdminSidebar from './AdminSidebar'

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth/login')

  const { data: profile } = await supabase.from('profiles').select('*').eq('id', user.id).single()
  if (!profile) redirect('/')

  return (
    <div className="min-h-screen">
      <AdminSidebar name={profile.full_name || profile.email} />

      {/* Main */}
      <main className="md:ml-60 pt-14 md:pt-0 bg-[#F7F5F2] min-h-screen">
        {children}
      </main>
    </div>
  )
}
