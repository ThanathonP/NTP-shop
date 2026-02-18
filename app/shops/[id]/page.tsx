import Navbar from '@/components/shop/Navbar'
import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import ProductCard from '@/components/shop/ProductCard'
import type { Product } from '@/types'

export default async function ShopDetailPage({ params }: { params: { id: string } }) {
  const supabase = createClient()
  const { data: shop } = await supabase
    .from('shops')
    .select('*')
    .eq('id', params.id)
    .single()

  if (!shop) notFound()

  const { data: products } = await supabase
    .from('products')
    .select('*, shops(name)')
    .eq('shop_id', params.id)
    .eq('is_active', true)
    .order('created_at', { ascending: false })

  return (
    <>
      <Navbar />
      <main className="pt-16">
        <div className="bg-[#1A1A1A] text-white py-20 px-6">
          <div className="max-w-7xl mx-auto">
            <p className="text-xs uppercase tracking-widest text-[#C8A882] mb-4">ร้านค้า</p>
            <h1 className="font-display text-5xl mb-3">{shop.name}</h1>
            {shop.description && (
              <p className="text-white/60 max-w-lg">{shop.description}</p>
            )}
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-6 py-12">
          {products && products.length > 0 ? (
            <>
              <p className="text-sm text-[#888] mb-6">สินค้าทั้งหมด {products.length} รายการ</p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {(products as Product[]).map(p => <ProductCard key={p.id} product={p} />)}
              </div>
            </>
          ) : (
            <div className="text-center py-32 text-[#888]">
              <p className="text-5xl mb-4">📦</p>
              <p className="text-lg">ยังไม่มีสินค้าในร้านนี้</p>
            </div>
          )}
        </div>
      </main>
    </>
  )
}
