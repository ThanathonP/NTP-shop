import Link from 'next/link'
import Navbar from '@/components/shop/Navbar'
import { createClient } from '@/lib/supabase/server'
import ProductCard from '@/components/shop/ProductCard'
import type { Product } from '@/types'

export default async function HomePage() {
  const supabase = createClient()
  const { data: products } = await supabase
    .from('products')
    .select('*, shops(name)')
    .eq('is_active', true)
    .order('created_at', { ascending: false })
    .limit(8)

  return (
    <>
      <Navbar />
      <main className="pt-16">
        {/* HERO */}
        <section className="max-w-7xl mx-auto px-6 py-20 grid md:grid-cols-2 gap-12 items-center">
          <div>
            <p className="text-xs tracking-[0.2em] uppercase text-[#C8A882] mb-4">คอลเลกชันใหม่ 2025</p>
            <h1 className="font-display text-5xl md:text-6xl leading-tight mb-6">
              สินค้าคัดสรร<br />
              <span className="text-[#C8A882]">คุณภาพพรีเมียม</span>
            </h1>
            <p className="text-[#888] leading-relaxed mb-8 max-w-md">
              ค้นพบสินค้าจากร้านค้าคัดสรร ที่ออกแบบมาเพื่อชีวิตประจำวัน ด้วยวัสดุคุณภาพสูง
            </p>
            <div className="flex gap-3 flex-wrap">
              <Link href="/shop" className="btn-primary">เลือกซื้อสินค้า →</Link>
              <Link href="/shops" className="btn-outline">ดูร้านค้าทั้งหมด</Link>
            </div>
          </div>
          <div className="h-96 bg-gradient-to-br from-[#EDE8E0] to-[#D8CFC4] relative overflow-hidden">
            <div className="absolute bottom-8 left-8 font-display text-8xl text-white/10 select-none">MONŌ</div>
            <div className="absolute top-8 right-8 bg-white p-4 shadow-lg text-sm">
              ⭐ ยอดนิยม<br /><strong className="text-base">500+ สินค้า</strong>
            </div>
          </div>
        </section>

        {/* STATS */}
        <div className="border-y border-[#E8E4DF]">
          <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4">
            {[['500+','สินค้าคัดสรร'],['12K+','ลูกค้าพึงพอใจ'],['4.9★','คะแนนรีวิว'],['1-2 วัน','จัดส่งทั่วไทย']].map(([n, l]) => (
              <div key={l} className="text-center py-8 border-r border-[#E8E4DF] last:border-0">
                <div className="font-display text-2xl mb-1">{n}</div>
                <div className="text-xs uppercase tracking-widest text-[#888]">{l}</div>
              </div>
            ))}
          </div>
        </div>

        {/* PRODUCTS */}
        <section className="max-w-7xl mx-auto px-6 py-16">
          <div className="flex items-end justify-between mb-8">
            <h2 className="font-display text-3xl">สินค้าแนะนำ</h2>
            <Link href="/shop" className="text-xs tracking-widest uppercase text-[#888] hover:text-[#1A1A1A] transition-colors">
              ดูทั้งหมด →
            </Link>
          </div>
          {products && products.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {(products as Product[]).map(p => <ProductCard key={p.id} product={p} />)}
            </div>
          ) : (
            <div className="text-center py-20 text-[#888]">
              <p className="text-lg mb-2">ยังไม่มีสินค้า</p>
              <p className="text-sm">เปิดร้านค้าและเพิ่มสินค้าเลยครับ!</p>
            </div>
          )}
        </section>

        {/* PROMO BANNER */}
        <section className="max-w-7xl mx-auto px-6 pb-16">
          <div className="bg-[#1A1A1A] text-white p-16 flex flex-col md:flex-row items-center justify-between gap-8 relative overflow-hidden">
            <div className="absolute right-16 font-display text-9xl text-white/5 select-none">SALE</div>
            <div>
              <p className="text-xs tracking-[0.2em] uppercase text-[#C8A882] mb-3">ข้อเสนอพิเศษ</p>
              <h3 className="font-display text-4xl mb-2">ลด 20% สำหรับสมาชิกใหม่</h3>
              <p className="text-white/60">สมัครวันนี้ รับโค้ดส่วนลดทันที</p>
            </div>
            <Link href="/auth/register" className="btn-accent whitespace-nowrap">สมัครสมาชิกฟรี →</Link>
          </div>
        </section>

        {/* FOOTER */}
        <footer className="border-t border-[#E8E4DF]">
          <div className="max-w-7xl mx-auto px-6 py-10 flex flex-col md:flex-row items-center justify-between gap-4">
            <span className="font-display text-xl tracking-widest">MONŌ</span>
            <div className="flex gap-6 text-xs text-[#888]">
              {['นโยบายความเป็นส่วนตัว','เงื่อนไขการใช้งาน','ติดต่อเรา'].map(l => (
                <a key={l} href="#" className="hover:text-[#1A1A1A] transition-colors">{l}</a>
              ))}
            </div>
            <p className="text-xs text-[#888]">© 2025 MONŌ. สงวนลิขสิทธิ์</p>
          </div>
        </footer>
      </main>
    </>
  )
}
