import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { formatPrice } from '@/lib/utils'
import ProductsClient from './ProductsClient'

export default async function AdminProductsPage() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  const { data: shop } = await supabase.from('shops').select('*').eq('owner_id', user!.id).single()

  if (!shop) return (
    <div className="p-8 text-center">
      <p className="text-lg mb-4">กรุณาสร้างร้านค้าก่อน</p>
      <Link href="/admin/shop" className="btn-primary">ไปสร้างร้านค้า</Link>
    </div>
  )

  const { data: products } = await supabase
    .from('products')
    .select('*')
    .eq('shop_id', shop.id)
    .order('created_at', { ascending: false })

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="font-display text-3xl">จัดการสินค้า</h1>
      </div>
      <ProductsClient initialProducts={products || []} shopId={shop.id} />
    </div>
  )
}
