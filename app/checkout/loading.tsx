import Navbar from '@/components/shop/Navbar'

export default function Loading() {
  return (
    <>
      <Navbar />
      <main className="pt-16 max-w-5xl mx-auto px-6 py-12" aria-busy="true" aria-label="กำลังโหลดหน้าชำระเงิน">
        <div className="h-9 w-40 bg-[#EDE8E0] animate-pulse mb-8" />
        <div className="grid md:grid-cols-2 gap-8">
          <div className="space-y-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="space-y-2">
                <div className="h-3 w-20 bg-[#EDE8E0] animate-pulse" />
                <div className="h-10 bg-[#EDE8E0] animate-pulse" />
              </div>
            ))}
          </div>
          <div className="h-64 bg-[#EDE8E0] animate-pulse" />
        </div>
      </main>
    </>
  )
}
