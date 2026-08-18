import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { cn } from '@/lib/utils'
import ShopActiveToggle from './ShopActiveToggle'

export default async function PlatformShopsPage() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  const { data: profile } = await supabase.from('profiles').select('role').eq('id', user!.id).single()
  if (profile?.role !== 'admin') redirect('/admin')

  const { data: shops } = await supabase
    .from('shops')
    .select('*, profiles(email, full_name)')
    .order('created_at', { ascending: false })

  return (
    <div className="p-8">
      <h1 className="font-display text-3xl mb-2">ร้านค้าทั้งหมดในระบบ</h1>
      <p className="text-[#888] text-sm mb-8">{shops?.length || 0} ร้านค้า</p>

      <div className="card overflow-hidden">
        {shops && shops.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="border-b border-[#E8E4DF]">
                <tr className="text-left text-xs uppercase tracking-widest text-[#888]">
                  <th className="px-6 py-3">ร้านค้า</th>
                  <th className="px-6 py-3">เจ้าของ</th>
                  <th className="px-6 py-3">สร้างเมื่อ</th>
                  <th className="px-6 py-3">สถานะ</th>
                  <th className="px-6 py-3"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E8E4DF]">
                {shops.map((shop: any) => (
                  <tr key={shop.id} className="hover:bg-[#F7F5F2]">
                    <td className="px-6 py-4 font-medium">{shop.name}</td>
                    <td className="px-6 py-4 text-[#888] text-xs">{shop.profiles?.full_name || shop.profiles?.email || '-'}</td>
                    <td className="px-6 py-4 text-[#888] text-xs">{new Date(shop.created_at).toLocaleDateString('th-TH')}</td>
                    <td className="px-6 py-4">
                      <span className={cn('px-2 py-1 rounded text-xs', shop.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800')}>
                        {shop.is_active ? 'เปิดใช้งาน' : 'ปิดใช้งาน'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <ShopActiveToggle shopId={shop.id} isActive={shop.is_active} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="p-16 text-center text-[#888] text-sm">ยังไม่มีร้านค้าในระบบ</p>
        )}
      </div>
    </div>
  )
}
