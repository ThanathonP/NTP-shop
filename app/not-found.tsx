import Link from 'next/link'
import Navbar from '@/components/shop/Navbar'

export default function NotFound() {
  return (
    <>
      <Navbar />
      <main className="pt-16 min-h-screen flex items-center justify-center px-4">
        <div className="text-center">
          <p className="font-display text-8xl text-[#C8A882] mb-4">404</p>
          <h1 className="font-display text-3xl mb-2">ไม่พบหน้าที่คุณต้องการ</h1>
          <p className="text-[#888] mb-8">หน้านี้อาจถูกย้ายหรือไม่มีอยู่จริง</p>
          <Link href="/" className="btn-primary">กลับหน้าแรก</Link>
        </div>
      </main>
    </>
  )
}
