import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import UserRoleUpdater from './UserRoleUpdater'

export default async function PlatformUsersPage() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  const { data: profile } = await supabase.from('profiles').select('role').eq('id', user!.id).single()
  if (profile?.role !== 'admin') redirect('/admin')

  const { data: users } = await supabase
    .from('profiles')
    .select('*')
    .order('created_at', { ascending: false })

  return (
    <div className="p-8">
      <h1 className="font-display text-3xl mb-2">ผู้ใช้ทั้งหมดในระบบ</h1>
      <p className="text-[#888] text-sm mb-8">{users?.length || 0} ผู้ใช้</p>

      <div className="card overflow-hidden">
        {users && users.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="border-b border-[#E8E4DF]">
                <tr className="text-left text-xs uppercase tracking-widest text-[#888]">
                  <th className="px-6 py-3">ชื่อ</th>
                  <th className="px-6 py-3">อีเมล</th>
                  <th className="px-6 py-3">สมัครเมื่อ</th>
                  <th className="px-6 py-3">บทบาท</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E8E4DF]">
                {users.map((u: any) => (
                  <tr key={u.id} className="hover:bg-[#F7F5F2]">
                    <td className="px-6 py-4 font-medium">{u.full_name || '-'}</td>
                    <td className="px-6 py-4 text-[#888] text-xs">{u.email}</td>
                    <td className="px-6 py-4 text-[#888] text-xs">{new Date(u.created_at).toLocaleDateString('th-TH')}</td>
                    <td className="px-6 py-4">
                      <UserRoleUpdater userId={u.id} currentRole={u.role} disableChange={u.id === user!.id} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="p-16 text-center text-[#888] text-sm">ยังไม่มีผู้ใช้ในระบบ</p>
        )}
      </div>
    </div>
  )
}
