'use client'
import { useEffect } from 'react'
import Link from 'next/link'
import Navbar from '@/components/shop/Navbar'

export default function Error({ error, reset }: { error: Error & { digest?: string }, reset: () => void }) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <>
      <Navbar />
      <main className="pt-16 min-h-screen flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <p className="text-6xl mb-4">⚠️</p>
          <h1 className="font-display text-3xl mb-2">เกิดข้อผิดพลาดบางอย่าง</h1>
          <p className="text-[#888] mb-8">ขออภัยในความไม่สะดวก กรุณาลองใหม่อีกครั้ง</p>
          <div className="flex gap-3 justify-center">
            <button onClick={() => reset()} className="btn-primary">ลองใหม่</button>
            <Link href="/" className="btn-outline">กลับหน้าแรก</Link>
          </div>
        </div>
      </main>
    </>
  )
}
