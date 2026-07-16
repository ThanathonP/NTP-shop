import Navbar from '@/components/shop/Navbar'

export default function Loading() {
  return (
    <>
      <Navbar />
      <main className="pt-16 max-w-7xl mx-auto px-6 py-12" aria-busy="true" aria-label="กำลังโหลดร้านค้า">
        <div className="h-9 w-56 bg-[#EDE8E0] animate-pulse mb-8" />
        <div className="grid md:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="bg-white overflow-hidden">
              <div className="h-40 bg-[#EDE8E0] animate-pulse" />
              <div className="p-6 space-y-2">
                <div className="h-5 w-2/3 bg-[#EDE8E0] animate-pulse" />
                <div className="h-4 w-full bg-[#EDE8E0] animate-pulse" />
              </div>
            </div>
          ))}
        </div>
      </main>
    </>
  )
}
