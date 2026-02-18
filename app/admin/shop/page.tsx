import { createClient } from '@/lib/supabase/server'
import ShopFormClient from './ShopFormClient'

export default async function AdminShopPage() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  const { data: shop } = await supabase.from('shops').select('*').eq('owner_id', user!.id).single()

  return (
    <div className="p-8 max-w-2xl">
      <h1 className="font-display text-3xl mb-2">{shop ? 'แก้ไขข้อมูลร้านค้า' : 'สร้างร้านค้า'}</h1>
      <p className="text-[#888] text-sm mb-8">{shop ? 'อัพเดทข้อมูลร้านค้าของคุณ' : 'กรอกข้อมูลเพื่อเปิดร้านค้าของคุณ'}</p>
      <ShopFormClient initialShop={shop} ownerId={user!.id} />
    </div>
  )
}
