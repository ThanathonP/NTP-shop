import Navbar from '@/components/shop/Navbar'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import ProductCard from '@/components/shop/ProductCard'
import type { Product } from '@/types'

export default async function ShopPage({ searchParams }: { searchParams: { q?: string; category?: string } }) {
  const supabase = createClient()
  let query = supabase
    .from('products')
    .select('*, shops(name)')
    .eq('is_active', true)
    .order('created_at', { ascending: false })

  if (searchParams.q) {
    query = query.ilike('name', `%${searchParams.q}%`)
  }
  if (searchParams.category) {
    query = query.eq('category', searchParams.category)
  }

  const { data: products } = await query

  const categories = ['ทั้งหมด', 'ของตกแต่งบ้าน', 'ครัวเรือน', 'แฟชัน', 'สกินแคร์', 'เครื่องเขียน']

  return (
    <>
      <Navbar />
      <main className="pt-16 max-w-7xl mx-auto px-6 py-12">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-8">
          <h1 className="font-display text-3xl">สินค้าทั้งหมด</h1>
          <form className="flex gap-2 w-full md:w-auto">
            {searchParams.category && <input type="hidden" name="category" value={searchParams.category} />}
            <input name="q" defaultValue={searchParams.q} placeholder="ค้นหาสินค้า..." className="input w-full md:w-64" />
            <button type="submit" className="btn-primary py-2">ค้นหา</button>
          </form>
        </div>

        {/* Category Filter */}
        <div className="flex gap-2 flex-wrap mb-8">
          {categories.map(cat => {
            const params = new URLSearchParams()
            if (searchParams.q) params.set('q', searchParams.q)
            if (cat !== 'ทั้งหมด') params.set('category', cat)
            const qs = params.toString()
            return (
              <Link
                key={cat}
                href={qs ? `/shop?${qs}` : '/shop'}
                className={`px-4 py-2 text-xs tracking-widest uppercase border transition-colors ${
                  (cat === 'ทั้งหมด' && !searchParams.category) || searchParams.category === cat
                    ? 'bg-[#1A1A1A] text-white border-[#1A1A1A]'
                    : 'border-[#E8E4DF] text-[#888] hover:border-[#1A1A1A] hover:text-[#1A1A1A]'
                }`}
              >
                {cat}
              </Link>
            )
          })}
        </div>

        {products && products.length > 0 ? (
          <>
            <p className="text-sm text-[#888] mb-6">พบ {products.length} รายการ</p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {(products as Product[]).map(p => <ProductCard key={p.id} product={p} />)}
            </div>
          </>
        ) : (
          <div className="text-center py-32 text-[#888]">
            <p className="text-5xl mb-4">🔍</p>
            <p className="text-lg">ไม่พบสินค้า</p>
          </div>
        )}
      </main>
    </>
  )
}
