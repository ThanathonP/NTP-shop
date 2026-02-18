import Navbar from '@/components/shop/Navbar'
import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { formatPrice } from '@/lib/utils'
import AddToCartButton from './AddToCartButton'
import type { Product } from '@/types'

export default async function ProductDetailPage({ params }: { params: { id: string } }) {
  const supabase = createClient()
  const { data: product } = await supabase
    .from('products')
    .select('*, shops(name)')
    .eq('id', params.id)
    .single()

  if (!product) notFound()

  const p = product as Product

  return (
    <>
      <Navbar />
      <main className="pt-16 max-w-7xl mx-auto px-6 py-12">
        <p className="text-xs uppercase tracking-widest text-[#888] mb-8">
          <Link href="/shop" className="hover:text-[#1A1A1A]">สินค้าทั้งหมด</Link>
          {p.shops && <> / <Link href={`/shops/${p.shop_id}`} className="hover:text-[#1A1A1A]">{p.shops.name}</Link></>}
          {' '}/ {p.name}
        </p>

        <div className="grid md:grid-cols-2 gap-12">
          <div className="relative h-[480px] bg-[#EDE8E0]">
            {p.image_url ? (
              <Image src={p.image_url} alt={p.name} fill className="object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-8xl">🛍️</div>
            )}
            {p.stock_qty === 0 && (
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                <span className="text-white text-lg tracking-widest uppercase">สินค้าหมด</span>
              </div>
            )}
          </div>

          <div className="flex flex-col justify-center">
            {p.shops && (
              <Link href={`/shops/${p.shop_id}`} className="text-xs uppercase tracking-widest text-[#C8A882] hover:underline mb-2 block">
                {p.shops.name}
              </Link>
            )}
            <h1 className="font-display text-4xl mb-4">{p.name}</h1>
            <p className="text-3xl font-medium mb-6">{formatPrice(p.price)}</p>
            {p.description && (
              <p className="text-[#888] leading-relaxed mb-8">{p.description}</p>
            )}
            <div className="mb-6">
              <span className="text-xs uppercase tracking-widest text-[#888]">
                {p.stock_qty > 0 ? `เหลือ ${p.stock_qty} ชิ้น` : 'สินค้าหมด'}
              </span>
            </div>
            <AddToCartButton product={p} />
          </div>
        </div>
      </main>
    </>
  )
}
