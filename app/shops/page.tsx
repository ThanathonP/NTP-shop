import Navbar from '@/components/shop/Navbar'
import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import Image from 'next/image'
import type { Shop } from '@/types'

export default async function ShopsPage() {
  const supabase = createClient()
  const { data: shops } = await supabase
    .from('shops')
    .select('*')
    .eq('is_active', true)
    .order('created_at', { ascending: false })

  return (
    <>
      <Navbar />
      <main className="pt-16 max-w-7xl mx-auto px-6 py-12">
        <h1 className="font-display text-3xl mb-8">ร้านค้าทั้งหมด</h1>
        {shops && shops.length > 0 ? (
          <div className="grid md:grid-cols-3 gap-6">
            {(shops as Shop[]).map(shop => (
              <Link key={shop.id} href={`/shops/${shop.id}`} className="card overflow-hidden hover:shadow-lg transition-shadow group">
                <div className="h-40 bg-[#EDE8E0] relative">
                  {shop.banner_url ? (
                    <Image src={shop.banner_url} alt={shop.name} fill className="object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-5xl">🏪</div>
                  )}
                  {shop.logo_url && (
                    <div className="absolute -bottom-6 left-6 w-14 h-14 rounded-full overflow-hidden border-2 border-white shadow-md bg-white">
                      <Image src={shop.logo_url} alt="" fill className="object-cover" />
                    </div>
                  )}
                </div>
                <div className={`p-6 ${shop.logo_url ? 'pt-9' : ''}`}>
                  <h2 className="font-medium text-lg mb-2 group-hover:text-[#C8A882] transition-colors">{shop.name}</h2>
                  {shop.description && (
                    <p className="text-sm text-[#888] line-clamp-2">{shop.description}</p>
                  )}
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-32 text-[#888]">
            <p className="text-5xl mb-4">🏪</p>
            <p className="text-lg">ยังไม่มีร้านค้า</p>
          </div>
        )}
      </main>
    </>
  )
}
