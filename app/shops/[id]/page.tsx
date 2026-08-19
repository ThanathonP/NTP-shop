import Navbar from '@/components/shop/Navbar'
import Image from 'next/image'
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
        <div className="relative bg-[#1A1A1A] text-white py-20 px-6 overflow-hidden">
          {shop.banner_url && (
            <>
              <Image src={shop.banner_url} alt="" fill className="object-cover opacity-40" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#1A1A1A] via-[#1A1A1A]/70 to-[#1A1A1A]/40" />
            </>
          )}
          <div className="relative max-w-7xl mx-auto flex items-center gap-6">
            {shop.logo_url && (
              <div className="relative w-20 h-20 rounded-full overflow-hidden border-2 border-white/20 flex-shrink-0">
                <Image src={shop.logo_url} alt={shop.name} fill className="object-cover" />
              </div>
            )}
            <div>
              <p className="text-xs uppercase tracking-widest text-[#C8A882] mb-4">ร้านค้า</p>
              <h1 className="font-display text-5xl mb-3">{shop.name}</h1>
              {shop.description && (
                <p className="text-white/60 max-w-lg">{shop.description}</p>
              )}
            </div>
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
