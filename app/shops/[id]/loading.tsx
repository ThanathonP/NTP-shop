import Navbar from '@/components/shop/Navbar'

export default function Loading() {
  return (
    <>
      <Navbar />
      <main className="pt-16" aria-busy="true" aria-label="กำลังโหลดร้านค้า">
        <div className="bg-[#1A1A1A] py-20 px-6">
          <div className="max-w-7xl mx-auto space-y-4">
            <div className="h-4 w-20 bg-white/10 animate-pulse" />
            <div className="h-12 w-80 bg-white/10 animate-pulse" />
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-6 py-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="bg-white overflow-hidden">
                <div className="h-60 bg-[#EDE8E0] animate-pulse" />
                <div className="p-4 space-y-2">
                  <div className="h-4 w-3/4 bg-[#EDE8E0] animate-pulse" />
                  <div className="h-4 w-1/2 bg-[#EDE8E0] animate-pulse" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </>
  )
}
